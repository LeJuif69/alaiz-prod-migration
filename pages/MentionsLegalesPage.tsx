

import React, { useState, useEffect } from 'react';
import { getLabelInfo, getHostingInfo } from '../services/cmsService';
import MetaTags from '../components/MetaTags';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';
import BackButton from '../components/BackButton';
import { ALAIZ_DATA } from '../constants';

type LabelInfo = typeof ALAIZ_DATA.labelInfo;
type HostingInfo = typeof ALAIZ_DATA.hostingInfo;

const MentionsLegalesPage: React.FC = () => {
    const [data, setData] = useState<{ labelInfo: LabelInfo; hostingInfo: HostingInfo } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [labelInfo, hostingInfo] = await Promise.all([getLabelInfo(), getHostingInfo()]);
                setData({ labelInfo, hostingInfo });
            } catch (err) {
                setError("Impossible de charger les informations légales.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const LegalSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="mb-8">
            <h2 className="text-3xl font-playfair font-bold text-alaiz-gold-light mb-4">{title}</h2>
            <div className="space-y-3 text-alaiz-cream/90 leading-relaxed">{children}</div>
        </div>
    );
    
    return (
        <>
            <MetaTags title="Mentions Légales" description="Consultez les mentions légales du site A Laiz Prod." />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="mb-8"><BackButton /></div>
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Mentions Légales</h1>
                    </div>
                    
                    {loading && <Loader />}
                    {error && <ErrorDisplay message={error} />}
                    
                    {data && (
                        <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20">
                            <LegalSection title="1. Éditeur du site">
                                <p><strong>Raison Sociale :</strong> {data.labelInfo.name}</p>
                                <p><strong>Forme Juridique :</strong> {data.labelInfo.legalForm}</p>
                                <p><strong>Adresse du siège social :</strong> {data.labelInfo.address}</p>
                                <p><strong>Adresse e-mail :</strong> <a href={`mailto:${data.labelInfo.emails.contact}`} className="text-alaiz-gold hover:underline">{data.labelInfo.emails.contact}</a></p>
                                <p><strong>Directeur de la publication :</strong> {data.labelInfo.publicationDirector}</p>
                            </LegalSection>
                            
                            <LegalSection title="2. Hébergement du site">
                                <p><strong>Hébergeur :</strong> {data.hostingInfo.name}</p>
                                <p><strong>Adresse :</strong> {data.hostingInfo.address}</p>
                                <p><strong>Contact :</strong> <a href={`mailto:${data.hostingInfo.contact}`} className="text-alaiz-gold hover:underline">{data.hostingInfo.contact}</a></p>
                            </LegalSection>

                            <LegalSection title="3. Propriété Intellectuelle">
                                <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.</p>
                                <p>La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.</p>
                            </LegalSection>

                            <LegalSection title="4. Données Personnelles">
                                <p>Les informations recueillies font l’objet d’un traitement informatique destiné à la gestion de la relation client. Conformément à la loi "informatique et libertés" du 6 janvier 1978 modifiée, vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent.</p>
                            </LegalSection>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MentionsLegalesPage;