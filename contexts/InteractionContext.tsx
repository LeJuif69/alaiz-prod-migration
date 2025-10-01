
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { getBlogPosts, updatePostLikes } from '../services/cmsService';
import { BlogPost } from '../types';

const LIKED_POSTS_STORAGE_KEY = 'alaiz_liked_posts';

interface InteractionContextType {
    isLiked: (postId: number) => boolean;
    getLikes: (postId: number) => number;
    toggleLike: (postId: number) => void;
    loading: boolean;
}

const InteractionContext = createContext<InteractionContextType | undefined>(undefined);

export const InteractionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
    const [postLikes, setPostLikes] = useState<Map<number, number>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            try {
                // Fetch initial like counts from our "DB" (constants.ts)
                const posts = await getBlogPosts();
                const initialLikes = new Map<number, number>();
                posts.forEach(post => {
                    initialLikes.set(post.id, post.likes || 0);
                });
                setPostLikes(initialLikes);

                // Load user's liked posts from localStorage
                const storedLikes = localStorage.getItem(LIKED_POSTS_STORAGE_KEY);
                if (storedLikes) {
                    setLikedPosts(new Set(JSON.parse(storedLikes)));
                }
            } catch (error) {
                console.error('Failed to initialize interaction context', error);
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, []);

    // Persist liked posts to localStorage whenever they change
    useEffect(() => {
        if (!loading) { // Avoid writing the empty initial set to storage
            try {
                localStorage.setItem(LIKED_POSTS_STORAGE_KEY, JSON.stringify(Array.from(likedPosts)));
            } catch (error) {
                console.error('Could not save liked posts to localStorage', error);
            }
        }
    }, [likedPosts, loading]);

    const isLiked = useCallback((postId: number) => likedPosts.has(postId), [likedPosts]);

    const getLikes = useCallback((postId: number) => postLikes.get(postId) || 0, [postLikes]);

    const toggleLike = useCallback(async (postId: number) => {
        const originalLikedPosts = new Set(likedPosts);
        const originalLikesCount = postLikes.get(postId) || 0;

        // --- Optimistic UI Update ---
        const isCurrentlyLiked = likedPosts.has(postId);
        const action = isCurrentlyLiked ? 'unlike' : 'like';

        // Update local state immediately for instant feedback
        setLikedPosts(prevLiked => {
            const newLiked = new Set(prevLiked);
            if (isCurrentlyLiked) {
                newLiked.delete(postId);
            } else {
                newLiked.add(postId);
            }
            return newLiked;
        });

        setPostLikes(prevLikes => {
            const newLikes = new Map(prevLikes);
            newLikes.set(postId, isCurrentlyLiked ? originalLikesCount - 1 : originalLikesCount + 1);
            return newLikes;
        });
        
        // --- Backend Sync ---
        try {
            // This will call our serverless function to persist the like
            const newLikesFromServer = await updatePostLikes(postId, action);
            
            // Re-sync with the server's response to be safe
            setPostLikes(prevLikes => {
                const newLikes = new Map(prevLikes);
                newLikes.set(postId, newLikesFromServer);
                return newLikes;
            });

        } catch (error) {
            console.error("Failed to update likes on server:", error);
            // --- Revert UI on error ---
            setLikedPosts(originalLikedPosts);
            setPostLikes(prevLikes => {
                const revertedLikes = new Map(prevLikes);
                revertedLikes.set(postId, originalLikesCount);
                return revertedLikes;
            });
            // Optionally, show a toast notification to the user
            alert("Une erreur est survenue. Votre 'J'aime' n'a pas pu être enregistré.");
        }
    }, [likedPosts, postLikes]);

    const value = { isLiked, getLikes, toggleLike, loading };

    return (
        <InteractionContext.Provider value={value}>
            {children}
        </InteractionContext.Provider>
    );
};

export const useInteraction = (): InteractionContextType => {
    const context = useContext(InteractionContext);
    if (context === undefined) {
        throw new Error('useInteraction must be used within an InteractionProvider');
    }
    return context;
};
