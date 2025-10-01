import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import { getBlogPosts, getPageSlogans } from '../services/cmsService';
import type { BlogPost } from '../types';
import MetaTags from '../components/MetaTags';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import WatermarkedImage from '../components/WatermarkedImage';
import { useInteraction } from '../contexts/InteractionContext';
import { HeartIcon, SearchIcon } from '../components/Icons';

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

        const widths = [400, 600, 800];
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

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    const { isLiked, getLikes, toggleLike } = useInteraction();
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(post.id);
        setIsAnimating(true);
    };

    return (
        <Link to={`/blog/${post.id}`} className="block bg-alaiz-gray rounded-lg overflow-hidden group transition-transform duration-300 hover:scale-[1.02] border border-transparent hover:border-alaiz-gold/20 shadow-lg">
            <div className="md:flex">
                <div className="md:w-1/3 overflow-hidden aspect-[3/2] md:aspect-auto">
                    <WatermarkedImage 
                        src={post.imageUrl} 
                        {...generatePexelsSrcSet(post.imageUrl)}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        loading="lazy" 
                        decoding="async"
                    />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col">
                  <p className="text-sm text-alaiz-gold mb-2">{post.category} • {formatDate(post.date)}</p>
                  <h3 className="text-2xl font-playfair font-bold text-alaiz-gold-light group-hover:text-alaiz-gold-light transition-colors">{post.title}</h3>
                  <p className="mt-3 text-alaiz-cream/80 flex-grow">{post.excerpt}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-alaiz-gold font-bold self-start group-hover:underline">
                      Lire la suite →
                    </span>
                    <button
                        onClick={handleLikeClick}
                        onAnimationEnd={() => setIsAnimating(false)}
                        className={`flex items-center gap-2 text-alaiz-cream/70 hover:text-red-400 transition-colors ${isAnimating ? 'animate-pop' : ''}`}
                        aria-label={`Aimer cet article, ${getLikes(post.id)} J'aime`}
                    >
                        <HeartIcon className={`w-6 h-6 transition-colors ${isLiked(post.id) ? 'text-red-500 fill-current' : ''}`} />
                        <span className="font-semibold">{getLikes(post.id)}</span>
                    </button>
                  </div>
                </div>
            </div>
        </Link>
    );
};


const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center items-center space-x-2 mt-16" aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md bg-alaiz-gray text-alaiz-cream hover:bg-alaiz-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Précédent
            </button>
            <div className="flex items-center space-x-2">
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`w-10 h-10 rounded-md font-bold transition-colors ${
                            currentPage === number
                                ? 'bg-alaiz-gold text-alaiz-black'
                                : 'bg-alaiz-gray text-alaiz-cream hover:bg-alaiz-gold/20'
                        }`}
                        aria-current={currentPage === number ? 'page' : undefined}
                    >
                        {number}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md bg-alaiz-gray text-alaiz-cream hover:bg-alaiz-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Suivant
            </button>
        </nav>
    );
};

const BlogPageSkeleton: React.FC = () => (
    <div className="space-y-12 max-w-5xl mx-auto animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-alaiz-gray rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/3 bg-alaiz-dark aspect-[3/2]"></div>
                    <div className="p-6 md:w-2/3 flex flex-col">
                        <div className="h-4 bg-alaiz-dark rounded w-1/4 mb-2"></div>
                        <div className="h-8 bg-alaiz-dark rounded w-3/4"></div>
                        <div className="mt-3 space-y-2 flex-grow">
                            <div className="h-4 bg-alaiz-dark rounded w-full"></div>
                            <div className="h-4 bg-alaiz-dark rounded w-5/6"></div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <div className="h-5 bg-alaiz-dark rounded w-1/3"></div>
                            <div className="h-6 bg-alaiz-dark rounded-full w-12"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);


const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const postsPerPage = 5;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [slogan, setSlogan] = useState("Actualités, tutoriels et réflexions sur le monde de la musique.");

  useEffect(() => {
    const fetchPostsAndSlogan = async () => {
      try {
        setLoading(true);
        const [fetchedPosts, fetchedSlogans] = await Promise.all([
          getBlogPosts(),
          getPageSlogans()
        ]);
        setPosts(fetchedPosts.sort((a, b) => b.date.localeCompare(a.date)));
        setSlogan(fetchedSlogans.blog);
      } catch (err) {
        setError("Impossible de charger les articles du blog.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsAndSlogan();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query)
        );
    });
  }, [posts, searchQuery]);

  // Pagination logic
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  

  const handlePageChange = (pageNumber: number) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };


  return (
    <>
      <MetaTags
        title="Blog"
        description="Actualités, tutoriels et réflexions sur le monde de la musique. Plongez dans l'univers A Laiz Prod."
        keywords="blog musical, actualités musique, tutoriels MAO, conseils artistes"
      />
      <div className="pt-32 pb-16 bg-alaiz-gray/50">
        <div className="container mx-auto px-6">
            <div className="mb-4"><BackButton /></div>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Notre Blog</h1>
              <p className="mt-4 text-xl text-alaiz-cream/80 max-w-3xl mx-auto">{slogan}</p>
            </div>
        </div>
      </div>
      
      <div ref={sectionRef} className="scroll-mt-20">
        <Section
          title="Articles Récents"
          subtitle="Plongez dans l'univers A Laiz Prod et enrichissez votre culture musicale."
        >
          <div className="relative mb-12 max-w-2xl mx-auto">
              <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Rechercher un article..."
                  className="w-full bg-alaiz-gray border-2 border-alaiz-gold/30 rounded-full py-3 pl-12 pr-4 text-alaiz-white focus:outline-none focus:ring-2 focus:ring-alaiz-gold focus:border-alaiz-gold transition-all"
                  aria-label="Rechercher un article"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-alaiz-cream/50">
                  <SearchIcon className="w-6 h-6"/>
              </div>
          </div>

          {loading && <BlogPageSkeleton />}
          {error && <ErrorDisplay message={error} />}
          {!loading && !error && currentPosts.length > 0 ? (
            <>
              <div className="space-y-12 max-w-5xl mx-auto">
                {currentPosts.map(post => <BlogPostCard key={post.id} post={post} />)}
              </div>
              <div className="mt-12 text-center text-alaiz-cream/70 text-sm">
                  Page {currentPage} sur {totalPages} ({totalPosts} article{totalPosts > 1 ? 's' : ''} trouvé{totalPosts > 1 ? 's' : ''})
              </div>
              <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
            </>
          ) : (
             !loading && <p className="text-center text-lg text-alaiz-cream/70 py-10">Aucun article ne correspond à votre recherche.</p>
          )}
        </Section>
      </div>
    </>
  );
};

export default BlogPage;