

import { ALAIZ_DATA } from '../constants';
import type { Artist, Service, BlogPost, Testimonial, AcademyDiscipline, AcademyFormula, Event, PortfolioItem, Creation, NewsItem, Comment } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Comments Service Logic ---

const COMMENTS_STORAGE_KEY = 'alaiz_prod_comments';

const getStoredComments = (): Comment[] => {
    try {
        const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse comments from localStorage", e);
        return [];
    }
};

const setStoredComments = (comments: Comment[]) => {
    try {
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    // FIX: Added curly braces to the catch block to fix syntax error.
    } catch (e) {
        console.error("Failed to save comments to localStorage", e);
    }
};

// Initial mock data if localStorage is empty
const initializeComments = () => {
    let comments = getStoredComments();
    if (comments.length === 0) {
        comments = [
            { id: 1, postId: 1, author: 'DJ Master', date: new Date(Date.now() - 3 * 86400000).toISOString(), content: "Super article ! L'EQ est vraiment la clé. Merci pour ces conseils." },
            { id: 2, postId: 1, author: 'Jeune Producteur', date: new Date(Date.now() - 2 * 86400000).toISOString(), content: "Très utile pour un débutant comme moi. La partie sur la compression est top." },
            { id: 3, postId: 3, author: 'Amateur de Jazz', date: new Date().toISOString(), content: "Excellent article, très instructif sur l'héritage de Manu Dibango." },
        ];
        setStoredComments(comments);
    }
};

initializeComments();


// --- API Functions ---

export const getLabelInfo = async () => {
    await delay(200);
    return ALAIZ_DATA.labelInfo;
};

export const getHostingInfo = async () => {
    await delay(50);
    return ALAIZ_DATA.hostingInfo;
};

export const getPageSlogans = async () => {
    await delay(50);
    return ALAIZ_DATA.pageSlogans;
};

export const getArtists = async (): Promise<Readonly<Artist[]>> => {
    await delay(500);
    return ALAIZ_DATA.artists;
};

export const getArtistById = async (id: number): Promise<Readonly<Artist> | undefined> => {
    await delay(300);
    return ALAIZ_DATA.artists.find(a => a.id === id);
};

export const getServices = async (): Promise<Readonly<Service[]>> => {
    await delay(400);
    return ALAIZ_DATA.services;
};

export const getAcademyData = async (): Promise<Readonly<typeof ALAIZ_DATA.academy>> => {
    await delay(600);
    return ALAIZ_DATA.academy;
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    await delay(700);
    // Return a mutable copy to avoid readonly type issues in components
    return ALAIZ_DATA.blogPosts.map(p => ({...p}));
};

export const getBlogPostById = async (id: number): Promise<BlogPost | undefined> => {
    await delay(300);
    const post = ALAIZ_DATA.blogPosts.find(p => p.id === id);
    // Return a mutable copy
    return post ? { ...post } : undefined;
};

export const getTestimonials = async (): Promise<Readonly<Testimonial[]>> => {
    await delay(800);
    return ALAIZ_DATA.testimonials;
};

export const getStudentTestimonials = async (): Promise<Readonly<Testimonial[]>> => {
    await delay(500);
    return ALAIZ_DATA.testimonials.filter(t => t.type === 'student');
};


export const getEvents = async (): Promise<Event[]> => {
    await delay(450);
    // Return a mutable copy
    return ALAIZ_DATA.events.map(e => ({...e}));
};

export const getPortfolio = async (): Promise<Readonly<PortfolioItem[]>> => {
    await delay(650);
    return ALAIZ_DATA.portfolio;
};

export const getPublicCreations = async (): Promise<Readonly<Creation[]>> => {
    await delay(400);
    return ALAIZ_DATA.publicCreations || []; 
};

export const getLabelAbout = async () => {
    await delay(100);
    return ALAIZ_DATA.labelAbout;
};

export const getNews = async (): Promise<Readonly<NewsItem[]>> => {
    await delay(250);
    return ALAIZ_DATA.news;
}

export const getPressKit = async () => {
    await delay(100);
    return ALAIZ_DATA.pressKit;
};

export const getBookingBlock = async () => {
    await delay(100);
    return ALAIZ_DATA.bookingBlock;
};

// --- New Comment Functions ---
export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
    await delay(400);
    const allComments = getStoredComments();
    return allComments
        .filter(c => c.postId === postId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addComment = async (postId: number, author: string, content: string): Promise<Comment> => {
    await delay(500);
    const allComments = getStoredComments();
    const newComment: Comment = {
        id: Date.now(),
        postId,
        author,
        content,
        date: new Date().toISOString(),
    };
    const updatedComments = [...allComments, newComment];
    setStoredComments(updatedComments);
    return newComment;
};

// --- New Like Function ---
export const updatePostLikes = async (postId: number, action: 'like' | 'unlike'): Promise<number> => {
    const response = await fetch('/api/like-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, action }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "L'action 'J'aime' a échoué.");
    }

    const data = await response.json();
    return data.newLikes;
};