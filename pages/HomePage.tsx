

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Section from '../components/Section';
import { getServices, getPortfolio, getEvents, getTestimonials, getBlogPosts } from '../services/cmsService';
import { Testimonial, PortfolioItem, Event, Service, BlogPost } from '../types';
import { MaximizeIcon, XIcon, CalendarIcon, MicrophoneIcon, AcademicCapIcon } from '../components/Icons';
import MetaTags from '../components/MetaTags';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import { useAuth } from '../contexts/AuthContext';
import WatermarkedImage from '../components/WatermarkedImage';

const EventIcon: React.FC<{type: Event['type']}> = ({ type }) => {
    switch (type) {
        case 'Concert':
            return <MicrophoneIcon className="w-8 h-8 text-alaiz-gold" />;
        case 'Masterclass':
            return <AcademicCapIcon className="w-8 h-8 text-alaiz-gold" />;
        case 'Événement Spécial':
            return <CalendarIcon className="w-8 h-8 text-alaiz-gold" />;
        default:
            return <CalendarIcon className="w-8 h-8 text-alaiz-gold" />;
    }
}

const TestimonialCarousel: React.FC<{testimonials: Testimonial[]}> = ({testimonials}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    return (
         <div className="relative max-w-3xl mx-auto text-center p-8 h-48 flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className={`absolute transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <blockquote className="text-2xl italic text-alaiz-gold-light font-playfair">"{testimonial.quote}"</blockquote>
                    <cite className="block mt-4 text-alaiz-cream/80 not-italic font-bold">- {testimonial.author}, {testimonial.role}</cite>
                </div>
            ))}
        </div>
    );
}

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
            params.set('h', w.toString()); // Portfolio cards are square
            return `${base}?${params.toString()} ${w}w`;
        }).join(', ');
        
        return { srcSet: srcset };
    } catch (e) {
        console.error("Invalid URL for srcset generation:", baseUrl, e);
        return {};
    }
};

const PortfolioCard: React.FC<{ item: PortfolioItem; onSelect: () => void }> = ({ item, onSelect }) => (
    <div
        className="group relative aspect-square bg-alaiz-gray rounded-lg overflow-hidden cursor-pointer shadow-lg"
        onClick={onSelect}
    >
        <WatermarkedImage 
            src={item.cover_image} 
            {...generatePexelsSrcSet(item.cover_image)}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            loading="lazy" 
            decoding="async" 
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
            <MaximizeIcon className="w-10 h-10 text-alaiz-gold mb-2" />
            <h3 className="font-playfair font-bold text-white text-lg">{item.title}</h3>
            <p className="text-sm text-alaiz-cream/80 capitalize">{item.type}</p>
        </div>
    </div>
);

const Lightbox: React.FC<{ item: PortfolioItem; onClose: () => void }> = ({ item, onClose }) => (
     <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-alaiz-gold transition-colors z-50">
            <XIcon className="w-10 h-10" />
        </button>
        <div className="relative w-full max-w-4xl max-h-full bg-alaiz-dark rounded-lg overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-alaiz-gold/20">
            <div className="md:w-2/3 bg-black flex items-center justify-center">
                 {item.media.video_url ? (
                    <div className="aspect-video w-full">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${item.media.video_url}?autoplay=1`}
                            title={item.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                ) : (
                    <WatermarkedImage src={item.cover_image} alt={item.title} className="max-w-full max-h-[80vh] object-contain" loading="lazy" decoding="async" />
                )}
            </div>
            <div className="md:w-1/3 p-6 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                 <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light">{item.title}</h2>
                 <p className="text-alaiz-gold mt-1 capitalize">{item.type} &bull; {item.year}</p>
                 <p className="mt-4 text-alaiz-cream/80 leading-relaxed">{item.description}</p>
            </div>
        </div>
    </div>
);

const ForYouSection: React.FC<{ blogPosts: BlogPost[] }> = ({ blogPosts }) => {
    const { currentUser } = useAuth();
  
    if (!currentUser) return null;
  
    // Simuler la logique de recommandation
    let recommendations: React.ReactNode[] = [];
    if (currentUser.role === 'Élève') {
      const studentPost = blogPosts.find(p => p.category === 'Conseils pour artistes');
      if (studentPost) {
        recommendations.push(
          <div key="post-1" className="bg-alaiz-gray p-6 rounded-lg">
            <h4 className="font-bold text-alaiz-gold">Article Recommandé</h4>
            <p className="mt-2 text-lg font-semibold text-alaiz-cream">{studentPost.title}</p>
            <Link to={`/blog/${studentPost.id}`} className="text-sm text-alaiz-gold-light hover:underline mt-2 inline-block">Lire la suite &rarr;</Link>
          </div>
        );
      }
    } else {
      const musicPost = blogPosts.find(p => p.category === 'Musique & Culture');
      if (musicPost) {
        recommendations.push(
          <div key="post-2" className="bg-alaiz-gray p-6 rounded-lg">
            <h4 className="font-bold text-alaiz-gold">À Découvrir</h4>
            <p className="mt-2 text-lg font-semibold text-alaiz-cream">{musicPost.title}</p>
            <Link to={`/blog/${musicPost.id}`} className="text-sm text-alaiz-gold-light hover:underline mt-2 inline-block">Lire l'article &rarr;</Link>
          </div>
        );
      }
    }

    recommendations.push(
      <div key="tutor" className="bg-alaiz-gray p-6 rounded-lg">
        <h4 className="font-bold text-alaiz-gold">Gombiste IA</h4>
        <p className="mt-2 text-lg font-semibold text-alaiz-cream">Envie de composer ? Laissez parler votre créativité avec notre IA.</p>
        <Link to="/tutor" className="text-sm text-alaiz-gold-light hover:underline mt-2 inline-block">Lancer Gombiste IA &rarr;</Link>
      </div>
    );
  
    return (
        <div id="pour-vous" className="snap-start min-h-screen flex items-center bg-alaiz-dark scroll-mt-24">
            <Section title="Juste Pour Vous" subtitle={`Une sélection de contenus qui pourraient vous intéresser, ${currentUser.name.split(' ')[0]}.`}>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {recommendations}
                </div>
            </Section>
        </div>
    );
  };

const SectionSkeleton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="py-16 md:py-24 w-full">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12 animate-pulse">
                <div className="h-12 bg-alaiz-gray rounded-md w-1/3 mx-auto"></div>
                <div className="mt-4 h-6 bg-alaiz-gray rounded-md w-2/3 mx-auto"></div>
            </div>
            <div>{children}</div>
        </div>
    </div>
);

const HomePageSkeleton: React.FC = () => (
    <>
        <div className="snap-start min-h-screen flex items-center justify-center">
            <SectionSkeleton>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => <div key={i} className="bg-alaiz-gray h-60 rounded-lg animate-pulse" />)}
                </div>
            </SectionSkeleton>
        </div>
        <div className="snap-start min-h-screen flex items-center justify-center">
            <SectionSkeleton>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-alaiz-gray rounded-lg animate-pulse" />)}
                </div>
            </SectionSkeleton>
        </div>
    </>
);


const HomePage: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [data, setData] = useState<{
    services: Service[],
    portfolio: PortfolioItem[],
    events: Event[],
    testimonials: Testimonial[],
    blogPosts: BlogPost[]
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const [services, portfolio, events, testimonials, blogPosts] = await Promise.all([
          getServices(),
          getPortfolio(),
          getEvents(),
          getTestimonials(),
          getBlogPosts()
        ]);
        setData({ services: [...services], portfolio: [...portfolio], events, testimonials: [...testimonials], blogPosts });
      } catch (err) {
        setError("Impossible de charger les données de la page d'accueil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.classList.add('snap-y', 'snap-mandatory', 'scroll-smooth');
    
    return () => {
        htmlElement.classList.remove('snap-y', 'snap-mandatory', 'scroll-smooth');
    };
  }, []);

  const latestPortfolioItems = data?.portfolio.slice(0, 6) ?? [];
  const upcomingEvents = data?.events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3) ?? [];

  return (
    <div>
      <MetaTags />
      <Hero />
      
      {loading && <HomePageSkeleton />}
      {error && <div className="snap-start min-h-screen flex items-center justify-center"><ErrorDisplay message={error} /></div>}
      
      {data && (
        <>
          {currentUser && <ForYouSection blogPosts={data.blogPosts} />}
          <div className="snap-start min-h-screen flex items-center">
            <Section
              title="Nos Prestations"
              subtitle="De la scène à la production, A Laiz Prod offre une gamme complète de services musicaux pour sublimer vos projets et événements."
              className="!py-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.services.map((service, index) => (
                  <div key={service.id} className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 text-center transition-all duration-300 hover:border-alaiz-gold hover:shadow-2xl hover:shadow-alaiz-gold/10 transform hover:-translate-y-2" style={{ animation: `fade-in-up 0.5s ease-out ${index * 0.15}s forwards`, opacity: 0 }}>
                    <div className="flex justify-center items-center mb-6">
                      <service.icon className="w-16 h-16 text-alaiz-gold" />
                    </div>
                    <h3 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-4">{service.title}</h3>
                    <p className="text-alaiz-cream/80">{service.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>
          
          <div className="snap-start min-h-screen flex items-center">
            <Section
              title="Notre Portfolio"
              subtitle="Un aperçu de nos dernières réalisations et collaborations. Cliquez pour en voir plus."
              className="!py-0"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPortfolioItems.map((item) => (
                  <PortfolioCard key={item.id} item={item} onSelect={() => setSelectedPortfolioItem(item)} />
                ))}
              </div>
              <div className="text-center mt-12">
                  <Link
                      to="/portfolio"
                      className="inline-block bg-transparent text-alaiz-gold font-bold text-lg px-10 py-4 rounded-full border-2 border-alaiz-gold hover:bg-alaiz-gold hover:text-alaiz-black transition-all duration-300 transform hover:scale-105"
                  >
                      Voir tout le portfolio
                  </Link>
              </div>
            </Section>
          </div>

          <div id="agenda" className="snap-start min-h-screen flex items-center bg-alaiz-dark scroll-mt-24">
              <Section
                  title="Événements à Venir"
                  subtitle="Ne manquez pas nos prochains rendez-vous musicaux."
                  className="!py-0"
              >
                  <div className="max-w-4xl mx-auto space-y-6">
                      {upcomingEvents.length > 0 ? (
                          upcomingEvents.map(event => (
                              <div key={event.id} className="flex flex-col sm:flex-row items-center bg-alaiz-gray p-6 rounded-lg border-l-4 border-alaiz-gold/50 hover:border-alaiz-gold transition-colors duration-300">
                                  <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 bg-alaiz-dark rounded-full mb-4 sm:mb-0 sm:mr-6 text-center">
                                      <div>
                                          <div className="font-bold text-4xl text-alaiz-gold-light">{new Date(event.date).getDate()}</div>
                                          <div className="text-lg text-alaiz-cream/70 -mt-1">{new Date(event.date).toLocaleString('fr-FR', { month: 'short' })}</div>
                                      </div>
                                  </div>
                                  <div className="flex-grow text-center">
                                      <span className="font-semibold text-alaiz-gold">{event.type}</span>
                                      <h4 className="text-2xl font-bold font-playfair text-alaiz-gold-light mt-1">{event.title}</h4>
                                      <p className="text-alaiz-cream/80 mt-2">{event.time} @ {event.location}</p>
                                  </div>
                              </div>
                          ))
                      ) : (
                          <p className="text-center text-alaiz-cream/70 text-xl italic py-8">Aucun événement à venir pour le moment. Restez connectés !</p>
                      )}
                      <div className="text-center mt-12">
                          <Link to="/contact#calendrier" className="inline-block bg-transparent text-alaiz-gold font-bold text-lg px-10 py-4 rounded-full border-2 border-alaiz-gold hover:bg-alaiz-gold hover:text-alaiz-black transition-all duration-300 transform hover:scale-105">
                              Voir tout l'agenda
                          </Link>
                      </div>
                  </div>
              </Section>
          </div>
      
          <div id="temoignages" className="snap-start min-h-screen flex items-center bg-alaiz-gray scroll-mt-24">
              <Section
                  title="Ce qu'ils disent de nous"
                  subtitle="La confiance et la satisfaction de nos partenaires et élèves."
                  className="!py-0"
              >
                  <TestimonialCarousel testimonials={data.testimonials} />
              </Section>
          </div>
      
          <div className="snap-start min-h-screen flex items-center justify-center">
            <div className="container mx-auto text-center py-20">
                <h2 className="text-3xl md:text-4xl font-playfair font-bold text-alaiz-gold-light">Prêt à créer ensemble ?</h2>
                <p className="mt-4 text-lg text-alaiz-cream/80 max-w-2xl mx-auto">Contactez-nous pour discuter de votre projet musical, réserver une prestation ou rejoindre notre académie.</p>
                <Link
                  to="/contact"
                  className="mt-8 inline-block bg-alaiz-gold text-alaiz-black font-bold text-lg px-10 py-4 rounded-full border-2 border-transparent hover:bg-transparent hover:text-alaiz-gold hover:border-alaiz-gold transition-all duration-300 transform hover:scale-105"
                >
                  Nous Contacter
                </Link>
            </div>
          </div>
        </>
      )}

      {selectedPortfolioItem && <Lightbox item={selectedPortfolioItem} onClose={() => setSelectedPortfolioItem(null)} />}
    </div>
  );
};

export default HomePage;