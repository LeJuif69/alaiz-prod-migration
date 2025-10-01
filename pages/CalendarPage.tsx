
import React, { useState, useMemo, useEffect } from 'react';
import Section from '../components/Section';
import { getEvents } from '../services/cmsService';
import { Event } from '../types';
import { CalendarIcon, MicrophoneIcon, AcademicCapIcon } from '../components/Icons';
import MetaTags from '../components/MetaTags';
import BackButton from '../components/BackButton';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';

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

const CalendarPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activeFilter, setActiveFilter] = useState<'Tous' | Event['type']>('Tous');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getEvents();
                setEvents(data);
            } catch(err) {
                setError("Impossible de charger les événements.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filterTypes: Array<'Tous' | Event['type']> = ['Tous', 'Concert', 'Masterclass', 'Événement Spécial'];

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust for week starting on Monday
    const startDay = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const eventsForCurrentMonth = useMemo(() => {
        return events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month;
            })
            .filter(event => {
                if (activeFilter === 'Tous') return true;
                return event.type === activeFilter;
            })
            .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate());
    }, [month, year, activeFilter, events]);

    const eventsByDay: { [key: number]: Event[] } = useMemo(() => {
        const groupedEvents: { [key: number]: Event[] } = {};
        // Use all events for the month to populate dots, not the filtered ones
        events
            .filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month;
            })
             .filter(event => {
                if (activeFilter === 'Tous') return true;
                return event.type === activeFilter;
            })
            .forEach(event => {
                const day = new Date(event.date).getDate();
                if (!groupedEvents[day]) {
                    groupedEvents[day] = [];
                }
                groupedEvents[day].push(event);
            });
        return groupedEvents;
    }, [month, year, activeFilter, events]);

    return (
        <>
            <MetaTags
                title="Agenda des événements"
                description="Consultez le calendrier des concerts, masterclasses et événements de A Laiz Prod. Ne manquez aucune de nos prochaines dates."
                keywords="agenda, calendrier, événements, concerts, masterclasses, Yaoundé"
            />
            <div className="pt-24 pb-16 bg-alaiz-gray/50">
                <div className="container mx-auto px-6">
                    <div className="mb-4"><BackButton /></div>
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Agenda</h1>
                        <p className="mt-4 text-xl text-alaiz-cream/80 max-w-3xl mx-auto">Concerts, masterclasses et événements à venir. Ne manquez rien de l'actualité A Laiz Prod.</p>
                    </div>
                </div>
            </div>

            <Section
                title="Calendrier des Événements"
                subtitle="Naviguez à travers les mois et filtrez par type pour découvrir nos activités."
            >
                {loading ? <Loader /> : error ? <ErrorDisplay message={error}/> : (
                    <>
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
                                        <div key={event.id} className="flex flex-col sm:flex-row items-start bg-alaiz-dark p-6 rounded-lg border-l-4 border-alaiz-gold animate-fade-in-up" style={{animationDuration: '0.5s'}}>
                                            <div className="flex-shrink-0 mr-6 mb-4 sm:mb-0 text-center">
                                            <EventIcon type={event.type} />
                                            <div className="mt-1 font-bold text-2xl text-alaiz-cream">{new Date(event.date).getDate()}</div>
                                            <div className="text-sm text-alaiz-cream/70">{new Date(event.date).toLocaleString('fr-FR', { month: 'short' })}</div>
                                            </div>
                                            <div>
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
            </Section>
        </>
    );
};

export default CalendarPage;
