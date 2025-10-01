
import React from 'react';

export interface DiscographyItem {
  title: string;
  year: number;
  type: 'Album' | 'Single' | 'EP';
  coverUrl: string;
  audioSrc: string;
}

export interface VideoItem {
  title: string;
  youtubeId: string;
}

export interface Artist {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  isFounder?: boolean;
  detailedBio: string;
  discography: readonly DiscographyItem[];
  videos: readonly VideoItem[];
  socials?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  genres?: readonly string[];
  pressQuote?: string;
  tags?: readonly string[];
  bookingContact?: {
      email: string;
      phone: string;
  };
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

// --- ACADEMY ---
export interface SyllabusItem {
    readonly lesson: number;
    readonly title: string;
    readonly content: string;
}

export interface ExerciseItem {
    readonly title: string;
    readonly instructions: string;
    readonly solution: string;
}

export interface AssessmentDetails {
    readonly type: string;
    readonly passing_criteria: string;
}

export interface AcademyLevel {
    readonly level_name: string;
    readonly duration_weeks: number;
    readonly hours_per_week: number;
    readonly learning_objectives: readonly string[];
    readonly syllabus: readonly SyllabusItem[];
    readonly exercises: readonly ExerciseItem[];
    readonly recommended_repertoire: readonly string[];
    readonly resources: readonly string[];
    readonly assessment: AssessmentDetails;
}

export interface AcademyDiscipline {
    readonly id: string;
    readonly name: string;
    readonly imageUrl: string;
    readonly videoId?: string;
    readonly levels: readonly AcademyLevel[];
}


export interface Price {
    readonly eur: number;
    readonly xaf: number;
}

export interface AcademyFormula {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly price?: Price;
    readonly billingCycle?: 'mois' | 'unique';
    readonly customPriceText?: string;
    readonly icon: React.ElementType;
    readonly features: readonly string[];
}


export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  category: 'Événements' | 'Formation' | 'Musique & Culture' | 'Conseils pour artistes';
  content: string; 
  likes?: number;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  date: string;
  content: string;
}

export interface Testimonial {
    id: number;
    author: string;
    role: string;
    quote: string;
    type: 'client' | 'student';
}

export interface Event {
  id: number;
  title: string;
  date: string; // Format YYYY-MM-DD
  type: 'Concert' | 'Masterclass' | 'Événement Spécial';
  description: string;
  time: string; // Format HH:mm
  location: string;
  intervenant?: string;
}

export interface PortfolioItem {
    readonly id: number;
    readonly title: string;
    readonly year: number;
    readonly cover_image: string;
    readonly type: 'clip' | 'live' | 'EP' | 'single' | 'session' | 'album';
    readonly artists: readonly string[];
    readonly description: string;
    readonly credits: {
        readonly producer: string;
        readonly engineer: string;
        readonly director: string;
    };
    readonly media: {
        readonly video_url: string | null;
        readonly audio_url: string | null;
    };
    readonly duration: string;
    readonly tags: readonly string[];
    readonly license: string;
    readonly downloadable_assets: readonly string[];
    readonly case_study: string;
}


export interface Creation {
  id: number;
  prompt: string;
  url: string;
  date: string;
  userName?: string;
  likes?: number;
}

export interface Notification {
  id: number;
  text: string;
  link: string;
  date: string;
  read: boolean;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'Élève' | 'Artiste' | 'Admin';
  courses?: string[]; // array of AcademyFormula ids
  creations?: Creation[];
  preferences?: {
    notifications: {
      newBlog: boolean;
      newEvents: boolean;
      recommendations: boolean;
    }
  }
}

export interface LabelAbout {
    readonly mission: string;
    readonly histoire: string;
    readonly valeurs: readonly string[];
}

export interface NewsItem {
    readonly title: string;
    readonly summary: string;
    readonly date: string;
    readonly link: string;
}

export interface PressKit {
    readonly headline: string;
    readonly short_text: string;
    readonly assets: readonly string[];
}

export interface BookingBlock {
    readonly title: string;
    readonly cta_text: string;
    readonly contact_email: string;
}
