
import React, { useState, useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPostById, getCommentsByPostId, addComment } from '../services/cmsService';
import MetaTags from '../components/MetaTags';
import { BlogPost, Comment } from '../types';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import WatermarkedImage from '../components/WatermarkedImage';
import { useInteraction } from '../contexts/InteractionContext';
import { useAuth } from '../contexts/AuthContext';
import { HeartIcon, TwitterIcon, FacebookIcon, WhatsAppIcon, LinkIcon, UserIcon } from '../components/Icons';

const generatePexelsSrcSet = (baseUrl: string) => {
    if (!baseUrl || !baseUrl.includes('pexels.com')) {
        return {};
    }
    try {
        const url = new URL(baseUrl);
        const base = `${url.protocol}//${url.host}${url.pathname}`;
        const originalParams = new URLSearchParams(url.search);
        originalParams.delete('w');
        originalParams.delete('h');

        const widths = [400, 800, 1200];
        const srcset = widths.map(w => {
            const params = new URLSearchParams(originalParams);
            params.set('w', w.toString());
            params.set('h', Math.round(w * (2 / 3)).toString());
            return `${base}?${params.toString()} ${w}w`;
        }).join(', ');
        
        return { srcSet: srcset };
    } catch (e) {
        console.error("Invalid URL for srcset generation:", baseUrl, e);
        return {};
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
};

// --- New Components for Article Page ---

const renderMarkdownContent = (text: string) => {
    const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        
        // It's a link: [text](url)
        if (match[1]) {
            const linkText = match[2];
            const linkUrl = match[3];
            if (linkUrl.startsWith('/')) {
                parts.push(<Link key={match.index} to={linkUrl} className="text-alaiz-gold hover:underline font-semibold">{linkText}</Link>);
            } else {
                parts.push(<a key={match.index} href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-alaiz-gold hover:underline font-semibold">{linkText}</a>);
            }
        } 
        // It's bold: **text**
        else if (match[4]) {
            const boldText = match[5];
            parts.push(<strong key={match.index} className="font-bold text-alaiz-cream">{boldText}</strong>);
        }

        lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.map((part, index) => <Fragment key={index}>{part}</Fragment>);
};


const ShareSection: React.FC<{ post: BlogPost }> = ({ post }) => {
    const postUrl = encodeURIComponent(window.location.href);
    const postTitle = encodeURIComponent(post.title);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(decodeURIComponent(postUrl)).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
        whatsapp: `https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}`,
    };

    return (
        <div className="mt-12 py-8 border-t border-b border-alaiz-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="font-bold text-alaiz-gold text-lg">Partager cet article</h3>
            <div className="flex items-center gap-2">
                <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-alaiz-gray rounded-full hover:bg-alaiz-dark transition-colors"><TwitterIcon className="w-5 h-5 text-alaiz-cream"/></a>
                <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-alaiz-gray rounded-full hover:bg-alaiz-dark transition-colors"><FacebookIcon className="w-5 h-5 text-alaiz-cream"/></a>
                <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-3 bg-alaiz-gray rounded-full hover:bg-alaiz-dark transition-colors"><WhatsAppIcon className="w-5 h-5 text-alaiz-cream"/></a>
                <button onClick={copyToClipboard} title="Copier le lien" className="p-3 bg-alaiz-gray rounded-full hover:bg-alaiz-dark transition-colors"><LinkIcon className="w-5 h-5 text-alaiz-cream"/></button>
                {copied && <span className="text-sm text-alaiz-gold transition-opacity duration-300">Copié !</span>}
            </div>
        </div>
    );
};

const CommentsSection: React.FC<{ postId: number }> = ({ postId }) => {
    const { currentUser } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [author, setAuthor] = useState(currentUser?.name || '');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            const fetchedComments = await getCommentsByPostId(postId);
            setComments(fetchedComments);
            setLoading(false);
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !author.trim()) return;
        setSubmitting(true);
        const newComment = await addComment(postId, author, content);
        setComments(prev => [newComment, ...prev]);
        setContent('');
        setSubmitting(false);
    };
    
    return (
        <div className="mt-12">
            <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-8">Commentaires ({comments.length})</h2>
            <div className="bg-alaiz-gray p-6 rounded-lg mb-8">
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-lg text-alaiz-gold">Laisser un commentaire</h3>
                    {!currentUser && (
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-alaiz-cream/80 mb-1">Votre nom</label>
                            <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full bg-alaiz-dark p-2 rounded-md" />
                        </div>
                    )}
                     <div>
                        <label htmlFor="content" className="block text-sm font-medium text-alaiz-cream/80 mb-1">Votre message</label>
                        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={4} required className="w-full bg-alaiz-dark p-2 rounded-md"></textarea>
                    </div>
                    <button type="submit" disabled={submitting} className="px-6 py-2 bg-alaiz-gold text-alaiz-black font-bold rounded-full hover:bg-alaiz-gold-light disabled:opacity-50">
                        {submitting ? 'Envoi...' : 'Envoyer'}
                    </button>
                 </form>
            </div>
            {loading ? <Loader message="Chargement des commentaires..." /> : (
                <div className="space-y-6">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-4">
                             <div className="flex-shrink-0 w-12 h-12 bg-alaiz-dark rounded-full flex items-center justify-center"><UserIcon className="w-6 h-6 text-alaiz-gold"/></div>
                             <div className="flex-grow bg-alaiz-dark p-4 rounded-lg">
                                 <div className="flex items-baseline gap-3">
                                    <p className="font-bold text-alaiz-cream">{comment.author}</p>
                                    <p className="text-xs text-alaiz-cream/60">{formatDate(comment.date)}</p>
                                 </div>
                                 <p className="mt-2 text-alaiz-cream/90">{comment.content}</p>
                             </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


// --- Main Page Component ---

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLiked, getLikes, toggleLike, loading: interactionLoading } = useInteraction();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await getBlogPostById(Number(id));
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError("L'article demandé n'a pas été trouvé.");
        }
      } catch (err) {
        setError("Impossible de charger l'article.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleLikeClick = () => {
    if (post) {
      toggleLike(post.id);
      setIsAnimating(true);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16">
        <Loader message="Chargement de l'article..." />
      </div>
    );
  }

  if (error || !post) {
    return (
        <div className="container mx-auto px-6 py-24 text-center">
          <MetaTags title="Article non trouvé" />
          <ErrorDisplay message={error || "Article non trouvé"} />
          <Link to="/blog" className="mt-8 inline-block bg-alaiz-gold text-alaiz-black font-bold px-6 py-3 rounded-full hover:bg-alaiz-gold-light transition-colors">
            Retour au Blog
          </Link>
        </div>
    );
  }

  return (
      <div className="pt-32 pb-16">
        <MetaTags
            title={post.title}
            description={post.excerpt}
            keywords={`${post.category}, ${post.title}`}
            ogImage={post.imageUrl}
        />
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <BackButton to="/blog" />
          </div>
          <article>
            <header className="text-center">
              <span className="text-alaiz-gold font-semibold">{post.category}</span>
              <h1 className="text-4xl md:text-5xl font-playfair font-extrabold text-alaiz-gold-light mt-2 mb-4">{post.title}</h1>
              <div className="flex justify-center items-center gap-6">
                  <p className="text-alaiz-cream/70">Par {post.author} &bull; {formatDate(post.date)}</p>
                  {!interactionLoading && (
                      <>
                          <div className="h-6 border-l border-alaiz-gold/30"></div>
                          <button
                              onClick={handleLikeClick}
                              onAnimationEnd={() => setIsAnimating(false)}
                              className={`flex items-center gap-2 text-alaiz-cream/70 hover:text-red-400 transition-colors ${isAnimating ? 'animate-pop' : ''}`}
                              aria-label={`Aimer cet article, ${getLikes(post.id)} J'aime`}
                          >
                              <HeartIcon className={`w-6 h-6 transition-colors ${isLiked(post.id) ? 'text-red-500 fill-current' : ''}`} />
                              <span className="font-semibold">{getLikes(post.id)}</span>
                          </button>
                      </>
                  )}
              </div>
            </header>
            
            <div className="my-8 rounded-lg overflow-hidden shadow-lg aspect-[3/2] bg-alaiz-gray">
              <WatermarkedImage 
                src={post.imageUrl} 
                {...generatePexelsSrcSet(post.imageUrl)}
                sizes="(min-width: 900px) 896px, 100vw"
                alt={post.title} 
                className="w-full h-full object-cover" 
                loading="eager" // Load main article image eagerly for better LCP
                decoding="async"
              />
            </div>
            
            <div className="prose prose-invert prose-lg max-w-none text-alaiz-cream/90 leading-relaxed space-y-6 text-lg">
               {post.content.split('\n').map((paragraph, index) => {
                    const trimmedParagraph = paragraph.trim();

                    // Handle iframes
                    if (trimmedParagraph.startsWith('<iframe')) {
                        // YouTube videos should be responsive
                        if (trimmedParagraph.includes('youtube.com/embed')) {
                            const responsiveIframeHtml = trimmedParagraph
                                .replace(/width="[^"]*"/, 'width="100%"')
                                .replace(/height="[^"]*"/, 'height="100%"');
                            
                            return (
                                <div 
                                    key={index} 
                                    className="my-6 aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                                >
                                  <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: responsiveIframeHtml }} />
                                </div>
                            );
                        }
                        
                        // Other iframes (like Spotify) are treated as-is.
                        return <div key={index} className="my-6" dangerouslySetInnerHTML={{ __html: trimmedParagraph }} />;
                    }
                    
                    // Handle custom headings
                    if (trimmedParagraph.startsWith('###')) {
                        return <h4 key={index} className="text-xl font-playfair font-bold text-alaiz-gold !mt-6 !mb-2">{trimmedParagraph.replace(/###\s*/, '')}</h4>;
                    }
                    if (trimmedParagraph.startsWith('##')) {
                        return <h3 key={index} className="text-2xl font-playfair font-bold text-alaiz-gold-light !mt-10 !mb-4">{trimmedParagraph.replace(/##\s*/, '')}</h3>;
                    }
                    if (trimmedParagraph.startsWith('**') && trimmedParagraph.endsWith('**')) {
                        return <h3 key={index} className="text-2xl font-playfair font-bold text-alaiz-gold-light !mt-10 !mb-4">{trimmedParagraph.replace(/\*\*/g, '')}</h3>;
                    }

                    // Handle italic lines for captions
                    if (trimmedParagraph.startsWith('*') && trimmedParagraph.endsWith('*') && !trimmedParagraph.includes(' ')) {
                        return <p key={index} className="text-center italic text-alaiz-cream/70 text-sm mt-2 mb-6">{renderMarkdownContent(trimmedParagraph.slice(1,-1))}</p>
                    }
                    
                    // Default paragraph, don't render if empty
                    if (trimmedParagraph) {
                        return <p key={index}>{renderMarkdownContent(paragraph)}</p>;
                    }
                    
                    return null;
                })}
            </div>

            <ShareSection post={post} />
            <CommentsSection postId={post.id} />

          </article>
        </div>
      </div>
  );
};

export default ArticlePage;
