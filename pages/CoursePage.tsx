import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAcademyData } from '../services/cmsService';
import { AcademyDiscipline, AcademyLevel, SyllabusItem, ExerciseItem } from '../types';
import MetaTags from '../components/MetaTags';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import { BookOpenIcon, CheckCircleIcon, DownloadIcon, MusicNoteIcon, CalendarIcon } from '../components/Icons';

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

const CoursePage: React.FC = () => {
    const { disciplineId, courseId } = useParams<{ disciplineId: string, courseId: string }>();
    const [level, setLevel] = useState<AcademyLevel | null>(null);
    const [discipline, setDiscipline] = useState<AcademyDiscipline | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!disciplineId || !courseId) {
                setError("Informations sur le cours manquantes.");
                setLoading(false);
                return;
            }

            try {
                const academyData = await getAcademyData();
                const foundDiscipline = academyData.disciplines.find(d => d.id === disciplineId);

                if (!foundDiscipline) {
                    setError("Discipline non trouvée.");
                    setLoading(false);
                    return;
                }

                const foundLevel = foundDiscipline.levels.find(l => slugify(l.level_name) === courseId);

                if (foundLevel) {
                    setDiscipline(foundDiscipline);
                    setLevel(foundLevel);
                } else {
                    setError("Niveau de formation non trouvé.");
                }
            } catch (err) {
                setError("Impossible de charger les détails du cours.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [disciplineId, courseId]);

    if (loading) {
        return <div className="pt-32 pb-16"><Loader message="Chargement du programme..." /></div>;
    }

    if (error || !level || !discipline) {
        return (
            <div className="pt-32 pb-16 container mx-auto px-6 text-center">
                <MetaTags title="Programme non trouvé" />
                <ErrorDisplay message={error || "Programme de formation non trouvé."} />
                <Link to="/academie" className="mt-8 inline-block bg-alaiz-gold text-alaiz-black font-bold px-6 py-3 rounded-full hover:bg-alaiz-gold-light transition-colors">
                    Retour à l'Académie
                </Link>
            </div>
        );
    }

    return (
        <>
            <MetaTags
                title={`${level.level_name} - ${discipline.name}`}
                description={`Programme détaillé du niveau ${level.level_name} pour la discipline ${discipline.name} à l'A Laiz Academy.`}
                keywords={`${level.level_name}, ${discipline.name}, A Laiz Academy, syllabus, cours de musique`}
            />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="mb-8">
                        <BackButton to="/academie" />
                    </div>
                    
                    <header className="mb-12">
                        <p className="text-alaiz-gold font-semibold text-lg">{discipline.name}</p>
                        <h1 className="text-4xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light mt-2">{level.level_name}</h1>
                    </header>
                    
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        <main className="lg:col-span-2 space-y-12">
                            {/* Learning Objectives */}
                            <section>
                                <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-4">Objectifs d'Apprentissage</h2>
                                <ul className="space-y-3">
                                    {level.learning_objectives.map((objective, index) => (
                                        <li key={index} className="flex items-start gap-3 text-alaiz-cream/90 text-lg">
                                            <CheckCircleIcon className="w-6 h-6 text-alaiz-gold flex-shrink-0 mt-1" />
                                            <span>{objective}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* Syllabus */}
                            <section>
                                <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-6">Syllabus Détaillé</h2>
                                <div className="space-y-4">
                                    {level.syllabus.map((item: SyllabusItem) => (
                                        <div key={item.lesson} className="p-4 bg-alaiz-dark rounded-lg border-l-4 border-alaiz-gold/30">
                                            <h3 className="font-bold text-alaiz-gold text-lg">Leçon {item.lesson}: {item.title}</h3>
                                            <p className="text-alaiz-cream/80 mt-1">{item.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Exercises & Repertoire */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <section>
                                    <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-4">Exercices Pratiques</h2>
                                    <div className="space-y-4">
                                        {level.exercises.map((ex: ExerciseItem, index) => (
                                            <div key={index} className="bg-alaiz-dark p-4 rounded-lg">
                                                <h4 className="font-semibold text-alaiz-cream">{ex.title}</h4>
                                                <p className="text-sm text-alaiz-cream/70 mt-1">{ex.instructions}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <h2 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-4">Répertoire Recommandé</h2>
                                    <ul className="space-y-2">
                                        {level.recommended_repertoire.map((piece, index) => (
                                             <li key={index} className="flex items-center gap-3 text-alaiz-cream/90">
                                                <MusicNoteIcon className="w-5 h-5 text-alaiz-gold flex-shrink-0" />
                                                <span>{piece}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </main>

                        <aside className="lg:col-span-1 self-start sticky top-28">
                            <div className="bg-alaiz-gray p-6 rounded-lg border border-alaiz-gold/20">
                                <h3 className="text-2xl font-playfair font-bold text-alaiz-gold-light mb-4">Informations Clés</h3>
                                <div className="space-y-4 text-alaiz-cream/90">
                                    <p className="flex items-center gap-3"><CalendarIcon className="w-5 h-5 text-alaiz-gold" /> <strong>Durée:</strong> {level.duration_weeks} semaines</p>
                                    <p className="flex items-center gap-3"><BookOpenIcon className="w-5 h-5 text-alaiz-gold" /> <strong>Volume:</strong> {level.hours_per_week}h / semaine</p>
                                </div>
                                <hr className="my-6 border-alaiz-gold/20" />
                                <div>
                                    <h4 className="font-bold text-alaiz-cream mb-2">Ressources Incluses</h4>
                                    <ul className="space-y-2 text-sm">
                                        {level.resources.map((res, index) => (
                                            <li key={index} className="flex items-center gap-2 text-alaiz-cream/80">
                                                <DownloadIcon className="w-4 h-4 text-alaiz-gold"/>
                                                <span>{res.replace(/pdf:|mp3:|zip:/, '')} ({res.split(':')[0]})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <hr className="my-6 border-alaiz-gold/20" />
                                 <div>
                                    <h4 className="font-bold text-alaiz-cream mb-2">Évaluation</h4>
                                    <p className="text-alaiz-cream/80 text-sm">{level.assessment.type}</p>
                                    <p className="text-xs text-alaiz-cream/60 mt-1">Critère: {level.assessment.passing_criteria}</p>
                                </div>
                                <Link to="/academie#formules" className="mt-8 block w-full text-center bg-alaiz-gold text-alaiz-black font-bold py-3 rounded-full hover:bg-alaiz-gold-light transition-colors">
                                    Voir les Formules
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoursePage;
