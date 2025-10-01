

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAcademyData } from '../services/cmsService';
import { AcademyFormula } from '../types';
import MetaTags from '../components/MetaTags';
import { useCurrency } from '../contexts/CurrencyContext';
import Loader from '../components/Loader';
import BackButton from '../components/BackButton';

const CheckoutPage: React.FC = () => {
    const { formuleId } = useParams<{ formuleId: string }>();
    const navigate = useNavigate();
    const { enrollInCourse } = useAuth();
    const { currency, loading: currencyLoading } = useCurrency();
    
    const [formula, setFormula] = useState<AcademyFormula | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFormula = async () => {
            if (!formuleId) {
                setError("ID de formule manquant.");
                setLoading(false);
                return;
            }
            try {
                const academyData = await getAcademyData();
                const foundFormula = academyData.formulas.find(f => f.id === formuleId);
                // FIX: Use the 'in' operator for a type-safe property check to ensure `price` exists before access.
                // The `foundFormula` is a union of specific object types due to `as const` in constants,
                // and some of those types do not have a `price` property. `in` correctly narrows the type.
                if (foundFormula && 'price' in foundFormula && foundFormula.price) {
                    setFormula(foundFormula);
                } else {
                    setError("Formule non trouvée ou indisponible à l'achat.");
                }
            } catch (err) {
                setError("Impossible de charger les détails de la formule.");
            } finally {
                setLoading(false);
            }
        };
        fetchFormula();
    }, [formuleId]);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formula) return;
        setProcessing(true);
        setError('');
        try {
            await enrollInCourse(formula.id);
            // Simuler la redirection après un paiement réussi
            setTimeout(() => {
                navigate('/profil');
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Le paiement a échoué.");
            setProcessing(false);
        }
    };

    if (loading || currencyLoading) {
        return <div className="pt-32 pb-16"><Loader message="Chargement du paiement..." /></div>;
    }
    
    if (error) {
        return <div className="pt-32 pb-16 text-center text-red-400">{error}</div>;
    }

    if (!formula || !formula.price) {
        return <div className="pt-32 pb-16 text-center">Formule non valide.</div>;
    }

    const price = currency === 'XAF' ? formula.price.xaf : formula.price.eur;
    const formattedPrice = new Intl.NumberFormat(currency === 'XAF' ? 'fr-CM' : 'fr-FR', {
        style: 'currency',
        currency: currency,
    }).format(price);

    return (
        <>
            <MetaTags title="Paiement" />
            <div className="pt-32 pb-16">
                <div className="container mx-auto px-6 max-w-2xl">
                    <div className="mb-4"><BackButton to="/academie" /></div>
                    <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 shadow-xl mt-4">
                        <h1 className="text-4xl font-playfair font-bold text-alaiz-gold-light text-center mb-8">Finaliser l'inscription</h1>
                        
                        <div className="bg-alaiz-dark p-6 rounded-lg mb-8">
                            <h2 className="text-2xl font-bold font-playfair text-alaiz-gold mb-2">Récapitulatif</h2>
                            <p className="text-xl text-alaiz-cream">{formula.name}</p>
                            <p className="text-2xl font-bold text-alaiz-gold-light mt-4">
                                Total : {formattedPrice} {formula.billingCycle === 'mois' ? '/ mois' : ''}
                            </p>
                        </div>
                        
                        <form onSubmit={handlePayment} className="space-y-6">
                            <p className="text-center text-alaiz-cream/70">Ceci est une simulation. Aucun paiement ne sera effectué.</p>
                            <div>
                                <label className="block text-sm font-medium text-alaiz-cream/80">Numéro de carte</label>
                                <input type="text" placeholder="**** **** **** 1234" disabled={processing} className="mt-1 block w-full bg-alaiz-dark rounded-md p-3" />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1"><label className="block text-sm font-medium text-alaiz-cream/80">Date d'expiration</label><input type="text" placeholder="MM/AA" disabled={processing} className="mt-1 block w-full bg-alaiz-dark rounded-md p-3" /></div>
                                <div className="flex-1"><label className="block text-sm font-medium text-alaiz-cream/80">CVC</label><input type="text" placeholder="123" disabled={processing} className="mt-1 block w-full bg-alaiz-dark rounded-md p-3" /></div>
                            </div>
                            <div>
                                <button type="submit" disabled={processing} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-alaiz-black bg-alaiz-gold hover:bg-alaiz-gold-light transition-all duration-300 disabled:bg-alaiz-gray disabled:cursor-not-allowed">
                                    {processing ? 'Paiement en cours...' : `Payer ${formattedPrice}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CheckoutPage;