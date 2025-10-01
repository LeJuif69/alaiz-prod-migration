import React, { useState, useMemo, useEffect } from 'react';
import Section from '../components/Section';
import ContactForm from '../components/ContactForm';
import { getEvents } from '../services/cmsService';
import { useData } from '../contexts/DataContext';
import { Event } from '../types';
import { 
    FacebookIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon, 
    CalendarIcon, MicrophoneIcon, AcademicCapIcon 
} from '../components/Icons';
import MetaTags from '../components/MetaTags';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';


const EventIcon: React.FC<{type: Event['type']}> = ({ type }) => {
    switch (type) {
        case 'Concert':
            return <MicrophoneIcon className="w-6 h-6 text-alaiz-gold" />;
        case 'Masterclass':
            return <AcademicCapIcon className="w-6 h-6 text-alaiz-gold" />;
        case 'Événement Spécial':
            return <CalendarIcon className="w-6 h-6 text-alaiz-gold" />;
        default:
            return null;
    }
}


const ContactPage: React.FC = () => {
    const { labelInfo, loading: loadingLabelInfo } = useData();
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [errorEvents, setErrorEvents] = useState<string | null>(null);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeFilter, setActiveFilter] = useState<'Tous' | Event['type']>('Tous');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoadingEvents(true);
                const fetchedEvents = await getEvents();
                setEvents(fetchedEvents);
            } catch (err) {
                setErrorEvents("Impossible de charger le calendrier des événements.");
                console.error(err);
            } finally {
                setLoadingEvents(false);
            }
        };
        fetchEvents();
    }, []);

    const filterTypes: Array<'Tous' | Event['type']> = ['Tous', 'Concert', 'Masterclass', 'Événement Spécial'];

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const eventsForCurrentMonth = useMemo(() => {
        return events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month;
            })
            .filter(event => activeFilter === 'Tous' || event.type === activeFilter)
            .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());
    }, [month, year, activeFilter, events]);

    const eventsByDay: { [key: number]: Event[] } = useMemo(() => {
        const groupedEvents: { [key: number]: Event[] } = {};
        events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month;
            })
             .filter(event => activeFilter === 'Tous' || event.type === activeFilter)
            .forEach(event => {
                const day = new Date(event.date).getDate();
                if (!groupedEvents[day]) groupedEvents[day] = [];
                groupedEvents[day].push(event);
            });
        return groupedEvents;
    }, [month, year, activeFilter, events]);


  return (
    <>
       <MetaTags
        title="Contact & Agenda"
        description="Contactez A Laiz Prod et consultez le calendrier de nos concerts, masterclasses et événements à Yaoundé."
        keywords="contact, agenda, calendrier, événements, concerts, devis, réservation, Yaoundé"
      />
       <div className="pt-32 pb-16 bg-alaiz-gray/50">
          <div className="container mx-auto px-6">
              <div className="mb-4"><BackButton /></div>
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Contact & Agenda</h1>
                <p className="mt-4 text-xl text-alaiz-cream/80 max-w-3xl mx-auto">Consultez nos prochains événements et n'hésitez pas à nous contacter pour toute question ou projet.</p>
              </div>
          </div>
      </div>

        <Section
            title="Calendrier des Événements"
            subtitle="Naviguez à travers les mois et filtrez par type pour découvrir nos activités."
        >
            <div id="calendrier" className="scroll-mt-24">
                <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                    {filterTypes.map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveFilter(type)}
                            className={`px-6 py-2 rounded-full font-bold text-lg transition-all duration-300 ${
                                activeFilter === type
                                ? 'bg-alaiz-gold text-alaiz-black scale-105 shadow-lg'
                                : 'bg-alaiz-gray text-alaiz-cream hover:bg-alaiz-gold/20'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {loadingEvents && <Loader message="Chargement du calendrier..." />}
                {errorEvents && <ErrorDisplay message={errorEvents} />}
                {!loadingEvents && !errorEvents && (
                    <>
                        <div className="max-w-5xl mx-auto bg-alaiz-gray p-4 sm:p-6 rounded-lg border border-alaiz-gold/20">
                            <div className="flex justify-between items-center mb-6">
                                <button onClick={handlePrevMonth} className="px-4 py-2 rounded-md hover:bg-alaiz-gold/20 transition-colors">&lt;</button>
                                <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-alaiz-gold-light capitalize">
                                    {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                                </h2>
                                <button onClick={handleNextMonth} className="px-4 py-2 rounded-md hover:bg-alaiz-gold/20 transition-colors">&gt;</button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center font-bold text-alaiz-cream/80 mb-2">
                                {daysOfWeek.map(day => <div key={day} className="py-2 text-sm sm:text-base">{day}</div>)}
                            </div>

                            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                                {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} className="h-16 sm:h-24"></div>)}
                                {Array.from({ length: daysInMonth }).map((_, day) => {
                                    const dayNumber = day + 1;
                                    const isToday = new Date().toDateString() === new Date(year, month, dayNumber).toDateString();
                                    const dayEvents = eventsByDay[dayNumber];
                                    
                                    return (
                                        <div key={dayNumber} className={`relative h-16 sm:h-24 p-1 sm:p-2 border border-alaiz-black/30 rounded-md transition-colors ${isToday ? 'bg-alaiz-gold/30' : 'bg-alaiz-gray/50 hover:bg-alaiz-dark'}`}>
                                            <span className={`text-sm sm:text-base ${isToday ? 'font-bold text-alaiz-gold-light' : ''}`}>{dayNumber}</span>
                                            {dayEvents && (
                                                <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                                                    {dayEvents.map(event => (
                                                        <div key={event.id} className={`w-2 h-2 rounded-full ${event.type === 'Concert' ? 'bg-red-500' : event.type === 'Masterclass' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-16 max-w-5xl mx-auto">
                            <h3 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-8">Événements en {currentDate.toLocaleString('fr-FR', { month: 'long' })}</h3>
                            {eventsForCurrentMonth.length > 0 ? (
                                <div className="space-y-6">
                                    {eventsForCurrentMonth.map(event => (
                                        <div key={event.id} className="flex flex-col sm:flex-row items-center bg-alaiz-dark p-6 rounded-lg border-l-4 border-alaiz-gold animate-fade-in-up" style={{animationDuration: '0.5s'}}>
                                            <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0 text-center">
                                            <EventIcon type={event.type} />
                                            <div className="mt-1 font-bold text-2xl text-alaiz-cream">{new Date(event.date).getDate()}</div>
                                            <div className="text-sm text-alaiz-cream/70">{new Date(event.date).toLocaleString('fr-FR', { month: 'short' })}</div>
                                            </div>
                                            <div className="flex-grow text-center">
                                                <span className="text-sm font-semibold text-alaiz-gold">{event.type}</span>
                                                <h4 className="text-xl font-bold font-playfair text-alaiz-gold-light mt-1">{event.title}</h4>
                                                <p className="text-alaiz-cream/80 mt-2">{event.description}</p>
                                                <p className="text-sm text-alaiz-cream/70 mt-3 font-semibold">{event.time} @ {event.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-alaiz-cream/70 text-lg italic py-8">
                                    {activeFilter === 'Tous' 
                                        ? 'Aucun événement prévu pour ce mois.' 
                                        : `Aucun événement de type "${activeFilter}" prévu pour ce mois.`
                                    }
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Section>
        
        <div className="bg-alaiz-dark">
            <Section
                title="Entrons en contact"
                subtitle="Remplissez le formulaire ci-dessous ou retrouvez-nous via nos coordonnées."
            >
                <div className="grid md:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">
                    <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20">
                        <h3 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-6">Envoyez-nous un message</h3>
                        <ContactForm />
                    </div>
                    {loadingLabelInfo ? <div className="animate-pulse h-96 bg-alaiz-gray rounded-lg"></div> : labelInfo && (
                        <div className="space-y-8 text-lg">
                            <div>
                                <h4 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-3">Emails</h4>
                                <div className="space-y-2">
                                    <p><strong className="font-semibold text-alaiz-cream/90">Général :</strong><br/><a href={`mailto:${labelInfo.emails.contact}`} className="text-alaiz-cream/80 hover:text-alaiz-gold-light transition-colors">{labelInfo.emails.contact}</a></p>
                                    <p><strong className="font-semibold text-alaiz-cream/90">Réservations :</strong><br/><a href={`mailto:${labelInfo.emails.booking}`} className="text-alaiz-cream/80 hover:text-alaiz-gold-light transition-colors">{labelInfo.emails.booking}</a></p>
                                    <p><strong className="font-semibold text-alaiz-cream/90">Formations :</strong><br/><a href={`mailto:${labelInfo.emails.training}`} className="text-alaiz-cream/80 hover:text-alaiz-gold-light transition-colors">{labelInfo.emails.training}</a></p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-2">Téléphones</h4>
                                <div className="text-alaiz-cream/80">
                                    {labelInfo.phones.map(phone => <p key={phone}>{phone}</p>)}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-2">Adresse</h4>
                                <p className="text-alaiz-cream/80">
                                    {labelInfo.address}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-2">Réseaux Sociaux</h4>
                                <div className="flex space-x-4 mt-2">
                                    <a href={labelInfo.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/70 hover:text-alaiz-gold transition-colors"><FacebookIcon className="w-8 h-8" /></a>
                                    <a href={labelInfo.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/70 hover:text-alaiz-gold transition-colors"><InstagramIcon className="w-8 h-8" /></a>
                                    <a href={labelInfo.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/70 hover:text-alaiz-gold transition-colors"><YoutubeIcon className="w-8 h-8" /></a>
                                    <a href={labelInfo.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-alaiz-cream/70 hover:text-alaiz-gold transition-colors"><WhatsAppIcon className="w-8 h-8" /></a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    </>
  );
};

export default ContactPage;