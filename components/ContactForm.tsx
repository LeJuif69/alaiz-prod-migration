
import React, { useState } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.error || 'La soumission du formulaire a échoué.');
        }

        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
        // Réinitialiser à l'état initial après quelques secondes
        setTimeout(() => setStatus('idle'), 5000);

    } catch (error) {
        console.error("Erreur lors de la soumission du formulaire:", error);
        setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-alaiz-cream/80">Nom</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full bg-alaiz-gray border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-alaiz-cream/80">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full bg-alaiz-gray border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-alaiz-cream/80">Message</label>
        <textarea
          id="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full bg-alaiz-gray border-alaiz-gold/30 rounded-md shadow-sm py-3 px-4 text-alaiz-white focus:outline-none focus:ring-alaiz-gold focus:border-alaiz-gold"
          required
        ></textarea>
      </div>
      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-alaiz-black bg-alaiz-gold hover:bg-alaiz-gold-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alaiz-gold-light transition-all duration-300 disabled:bg-alaiz-gray disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </div>
      {status === 'success' && <p className="text-green-400 text-center">Message envoyé avec succès ! Nous vous répondrons bientôt.</p>}
      {status === 'error' && <p className="text-red-400 text-center">Une erreur est survenue. Veuillez réessayer.</p>}
    </form>
  );
};

export default ContactForm;
