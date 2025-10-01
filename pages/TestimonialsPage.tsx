
import React, { useState, useEffect } from 'react';
import Section from '../components/Section';
import { getTestimonials } from '../services/cmsService';
import type { Testimonial } from '../types';
import MetaTags from '../components/MetaTags';
import BackButton from '../components/BackButton';
import Loader from '../components/Loader';
import ErrorDisplay from '../components/ErrorDisplay';

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <div className="bg-alaiz-gray p-8 rounded-lg border border-alaiz-gold/20 h-full flex flex-col transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-alaiz-gold/10">
    <blockquote className="flex-grow">
      <p className="text-lg italic text-alaiz-cream/90">"{testimonial.quote}"</p>
    </blockquote>
    <footer className="mt-6">
      <p className="font-bold text-alaiz-gold-light text-xl font-playfair">{testimonial.author}</p>
      <p className="text-alaiz-cream/70">{testimonial.role}</p>
    </footer>
  </div>
);


const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials();
        setTestimonials(Array.from(data)); // Ensure it's mutable if needed
      } catch (err) {
        setError("Impossible de charger les témoignages.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const clientTestimonials = testimonials.filter(t => t.type === 'client');
  const studentTestimonials = testimonials.filter(t => t.type === 'student');

  return (
    <>
      <MetaTags
        title="Témoignages"
        description="Découvrez ce que nos clients et nos élèves pensent de A Laiz Prod. Leur satisfaction est notre plus grande fierté."
        keywords="témoignages, avis clients, retours élèves, satisfaction"
      />
      <div className="pt-24 pb-16 bg-alaiz-gray/50">
          <div className="container mx-auto px-6">
              <div className="mb-4"><BackButton /></div>
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-playfair font-extrabold text-alaiz-gold-light">Témoignages</h1>
                <p className="mt-4 text-xl text-alaiz-cream/80 max-w-3xl mx-auto">La satisfaction de nos clients et la progression de nos élèves sont notre plus grande fierté.</p>
              </div>
          </div>
      </div>
      
      {loading ? <Loader /> : error ? <ErrorDisplay message={error} /> : (
        <>
          <Section
            title="Retours de nos Clients"
            subtitle="Ils nous ont fait confiance pour leurs événements et productions."
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clientTestimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </Section>

          <div className="bg-alaiz-dark">
            <Section
                title="Paroles de nos Étudiants"
                subtitle="Leurs parcours et leurs réussites à l'A Laiz Academy."
            >
                <div className="grid md:grid-cols-2 gap-8">
                {studentTestimonials.map(testimonial => (
                    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
                </div>
            </Section>
          </div>
        </>
      )}
    </>
  );
};

export default TestimonialsPage;
