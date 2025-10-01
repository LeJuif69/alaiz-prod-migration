

import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import { getAcademyData, getStudentTestimonials, getEvents, getPageSlogans } from '../services/cmsService';
import { CheckCircleIcon, PlayCircleIcon, XIcon, BookOpenIcon, DownloadIcon, CalendarIcon, ChevronDownIcon } from '../components/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { AcademyDiscipline, AcademyLevel, AcademyFormula, Testimonial, Event } from '../types';
import MetaTags from '../components/MetaTags';
import { useCurrency } from '../contexts/CurrencyContext';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import WatermarkedImage from '../components/WatermarkedImage';
import { useAuth } from '../contexts/AuthContext';

// --- Utility function to create URL-friendly slugs ---
const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

// --- Sub-components for Academy Page ---

const AcademyHero: React.FC<{ slogan: string }> = ({ slogan }) => {
    const handleScrollToDisciplines = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const disciplinesSection = document.getElementById('disciplines');
        if (disciplinesSection) {
            disciplinesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
                poster="https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-playing-the-piano-338-large.mp4" type="video/mp4" />
            </video>
            <div className="relative z-20 px-4 animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-playfair font-black text-alaiz-gold-light">A Laiz Academy</h1>
                <p className="mt-6 text-xl md:text-2xl text-alaiz-cream/90 max-w-3xl mx-auto">{slogan}</p>
                <button
                    onClick={handleScrollToDisciplines}
                    className="mt-10 inline-block bg-alaiz-gold text-alaiz-black font-bold text-lg px-10 py-4 rounded-full border-2 border-transparent hover:bg-transparent hover:text-alaiz-gold hover:border-alaiz-gold transition-all duration-300 transform hover:scale-105"
                >
                    Explorer les formations
                </button>
            </div>
        </div>
    );
};

const VideoModal: React.FC<{ videoId: string; onClose: () => void }> = ({ videoId, onClose }) => (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }} onClick={onClose}>
        <div className="relative aspect-video w-full max-w-4xl bg-black rounded-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute -top-10 -right-2 text-white hover:text-alaiz-gold transition-colors z-50">
                <XIcon className="w-8 h-8" />
            </button>
            <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Présentation de la discipline"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    </div>
);


const DisciplineAccordion: React.FC<{ discipline: AcademyDiscipline, isOpen: boolean, onToggle: () => void, onSelectVideo: (id: string) => void }> = ({ discipline, isOpen, onToggle, onSelectVideo }) => (
    <div className="bg-alaiz-dark rounded-lg border border-alaiz-gold/20 overflow-hidden">
        <div className="p-6 flex justify-between items-center w-full text-left">
            <div className="flex items-center flex-grow cursor-pointer" onClick={onToggle}>
                 <div className="relative w-20 h-20 mr-6 flex-shrink-0 group">
                    <WatermarkedImage src={discipline.imageUrl} alt={discipline.name} className="w-full h-full rounded-md object-cover" />
                    {discipline.videoId &&
                        <button onClick={(e) => { e.stopPropagation(); onSelectVideo(discipline.videoId!) }} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                        <PlayCircleIcon className="w-10 h-10 text-white" />
                        </button>
                    }
                </div>
                <div>
                    <h3 className="text-3xl font-playfair font-bold text-alaiz-gold-light">{discipline.name}</h3>
                </div>
            </div>
            <button onClick={onToggle} className="p-2 ml-4">
              <ChevronDownIcon className={`w-8 h-8 text-alaiz-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
        <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 border-t border-alaiz-gold/20 grid md:grid-cols-3 gap-6">
                {discipline.levels.map(level => (
                    <Link
                        key={slugify(level.level_name)}
                        to={`/academie/${discipline.id}/${slugify(level.level_name)}`}
                        className="block bg-alaiz-gray p-6 rounded-lg hover:bg-alaiz-black hover:shadow-lg hover:shadow-alaiz-gold/10 transition-all transform hover:-translate-y-1 group"
                    >
                        <h4 className="font-bold text-xl text-alaiz-gold">{level.level_name}</h4>
                        <p className="text-sm text-alaiz-cream/70 mt-2">{level.duration_weeks} semaines &bull; {level.hours_per_week}h/semaine</p>
                        <p className="text-alaiz-cream/80 mt-3 text-sm">{level.learning_objectives[0]}...</p>
                        <span className="inline-block mt-4 font-bold text-alaiz-gold-light group-hover:underline">
                            Voir le programme &rarr;
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    </div>
);


const FormulaCard: React.FC<{ formula: AcademyFormula }> = ({ formula }) => {
    const { currency } = useCurrency();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const price = formula.price ? (currency === 'XAF' ? formula.price.xaf : formula.price.eur) : null;
    const formattedPrice = price !== null ? new Intl.NumberFormat(currency === 'XAF' ? 'fr-CM' : 'fr-FR', {
        style: 'currency',
        currency: currency,
    }).format(price) : null;
    
    const handleCTAClick = () => {
        if(formula.customPriceText) {
            navigate('/contact');
        } else {
             navigate(currentUser ? `/paiement/${formula.id}` : '/connexion');
        }
    }

    return (
        <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 flex flex-col h-full">
            <div className="flex-shrink-0 mb-4 text-center">
                <formula.icon className="w-16 h-16 text-alaiz-gold mx-auto" />
                <h3 className="text-2xl font-playfair font-bold text-alaiz-gold-light mt-4">{formula.name}</h3>
            </div>
            <p className="text-center text-alaiz-cream/80 flex-grow">{formula.description}</p>
            <div className="my-6 text-center">
                {formula.customPriceText ? (
                    <span className="text-3xl font-bold text-white">{formula.customPriceText}</span>
                ) : (
                    <>
                        <span className="text-4xl font-bold text-white">{formattedPrice}</span>
                        {formula.billingCycle && <span className="text-alaiz-cream/70">/{formula.billingCycle}</span>}
                    </>
                )}
            </div>
            <ul className="space-y-3 mb-8 text-alaiz-cream/90 flex-grow">
                {formula.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-alaiz-gold flex-shrink-0 mt-1" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                 onClick={handleCTAClick}
                 className="mt-auto w-full bg-alaiz-gold text-alaiz-black font-bold py-3 rounded-full hover:bg-alaiz-gold-light transition-colors"
            >
                {formula.customPriceText ? "Nous contacter" : "Choisir cette formule"}
            </button>
        </div>
    );
};


const WhyChooseUs: React.FC<{ reasons: readonly string[] }> = ({ reasons }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((reason, index) => (
            <div key={index} className="flex items-start gap-4">
                <CheckCircleIcon className="w-8 h-8 text-alaiz-gold flex-shrink-0 mt-1" />
                <p className="text-alaiz-cream/90 text-lg">{reason}</p>
            </div>
        ))}
    </div>
);


const AcademyPage: React.FC = () => {
    const [data, setData] = useState<{
        disciplines: readonly AcademyDiscipline[],
        formulas: readonly AcademyFormula[],
        whyChooseUs: readonly string[]
    } | null>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDiscipline, setOpenDiscipline] = useState<string | null>(null);
    const [slogan, setSlogan] = useState("L'excellence musicale à votre portée.");
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);


    useEffect(() => {
        const fetchPageData = async () => {
            try {
                setLoading(true);
                const [academyData, studentTestimonials, upcomingEvents, slogans] = await Promise.all([
                    getAcademyData(),
                    getStudentTestimonials(),
                    getEvents(),
                    getPageSlogans()
                ]);
                setData(academyData);
                setTestimonials([...studentTestimonials]);
                setEvents(upcomingEvents.filter(e => new Date(e.date) >= new Date()).slice(0, 2));
                setSlogan(slogans.academy);
                if (academyData.disciplines.length > 0) {
                    setOpenDiscipline(academyData.disciplines[0].id);
                }
            } catch (err) {
                setError("Impossible de charger les informations de l'académie.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, []);

    const toggleDiscipline = (id: string) => {
        setOpenDiscipline(prev => (prev === id ? null : id));
    };

    return (
      <>
        <MetaTags
          title="Académie"
          description="Formations d'excellence en piano, chant, MAO et musicologie. Rejoignez l'A Laiz Academy et développez votre talent."
          keywords="cours de musique, formation musicale, cours de piano, cours de chant, MAO, musicologie, Yaoundé"
        />
        <AcademyHero slogan={slogan} />
        {loading ? <div className="min-h-screen"><Loader /></div> : error ? <ErrorDisplay message={error} /> : data && (
          <>
            <div id="disciplines" className="scroll-mt-24">
                <Section title="Nos Disciplines" subtitle="Découvrez nos programmes de formation complets, du niveau débutant au niveau avancé.">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {data.disciplines.map(discipline => (
                            <DisciplineAccordion
                                key={discipline.id}
                                discipline={discipline}
                                isOpen={openDiscipline === discipline.id}
                                onToggle={() => toggleDiscipline(discipline.id)}
                                onSelectVideo={setSelectedVideo}
                            />
                        ))}
                    </div>
                </Section>
            </div>
            
            <div className="bg-alaiz-dark">
                <Section title="Nos Formules" subtitle="Choisissez le parcours qui correspond à vos objectifs et à votre rythme.">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.formulas.map(formula => (
                            <FormulaCard key={formula.id} formula={formula} />
                        ))}
                    </div>
                </Section>
            </div>

            <Section title="Pourquoi choisir A Laiz Academy ?" subtitle="Plus qu'une école, une communauté passionnée au service de votre talent.">
                <WhyChooseUs reasons={data.whyChooseUs} />
            </Section>

            {testimonials.length > 0 && (
                <div className="bg-alaiz-dark">
                    <Section title="Paroles d'Élèves" subtitle="Leurs parcours et leurs réussites à l'A Laiz Academy.">
                         <div className="relative max-w-3xl mx-auto text-center p-8 h-48 flex items-center justify-center">
                            {testimonials.length > 0 && (
                                <blockquote className="text-2xl italic text-alaiz-gold-light font-playfair">"{testimonials[0].quote}"
                                 <cite className="block mt-4 text-alaiz-cream/80 not-italic font-bold">- {testimonials[0].author}, {testimonials[0].role}</cite>
                                </blockquote>
                            )}
                        </div>
                    </Section>
                </div>
            )}
          </>
        )}
        {selectedVideo && <VideoModal videoId={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </>
    );
};

export default AcademyPage;