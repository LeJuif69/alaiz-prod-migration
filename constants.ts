import type { Artist, Service, BlogPost, Testimonial, AcademyDiscipline, AcademyFormula, Event, PortfolioItem, Creation, LabelAbout, NewsItem, PressKit, BookingBlock } from './types';
import { 
    PianoIcon, MusicIcon, EventsIcon, RentalIcon, 
    PackIndividuelIcon, PackDuoIcon, FormationHybrideIcon, MoocIcon, MasterclassIcon, CertificationIcon,
    CheckCircleIcon
} from './components/Icons';

// --- Date Helpers for Dynamic Events ---
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed

// Helper to format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

const eventDate1 = new Date(currentYear, currentMonth, 12);
const eventDate2 = new Date(currentYear, currentMonth, 25);
const eventDate3 = new Date(currentYear, currentMonth + 1, 5);
// --- End Date Helpers ---


export const ALAIZ_DATA = {
  labelInfo: {
    name: "A Laiz Prod",
    slogan: "Tradition. Innovation. Émotion.",
    director: "Hervé Nanfang",
    publicationDirector: "Hervé Nanfang",
    legalForm: "Association (Loi 1901)",
    founded: 2010,
    address: "Rue Nachtigall, Quartier Melen, Yaoundé, Cameroun",
    emails: {
      contact: "contact@alaizprod.art",
      booking: "booking@alaizprod.art",
      training: "formation@alaizprod.art",
    },
    phones: ["+237 694 723 492", "+237 682 180 266"],
    website: "www.alaizprod.art",
    socials: {
        facebook: "https://www.facebook.com/alaizopays/",
        instagram: "https://www.instagram.com/alaiz_prod/",
        youtube: "https://www.youtube.com/@alaizprod",
        whatsapp: "https://wa.me/237694723492"
    }
  },
  hostingInfo: {
      name: "Vercel Inc.",
      address: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
      contact: "privacy@vercel.com"
  },
  pageSlogans: {
    label: "Au cœur de la création musicale.",
    academy: "L'excellence musicale à votre portée.",
    blog: "Le rythme de nos actualités.",
  },
  labelAbout: {
    mission: "Notre mission est de découvrir, développer et promouvoir des talents musicaux qui portent l'héritage africain tout en dialoguant avec le monde. Nous créons une musique authentique, innovante et riche en émotions.",
    histoire: "Fondé en 2010 par Hervé Nanfang, A Laiz Prod est né d'une vision : créer un écosystème où l'excellence artistique et les valeurs humaines se rejoignent. D'abord un simple studio d'enregistrement à Yaoundé, le label a grandi pour devenir une maison pour des artistes de divers horizons, tous unis par une passion commune pour la qualité et l'authenticité. Au fil des ans, nous avons produit des albums acclamés, organisé des concerts mémorables et lancé notre propre académie pour former la prochaine génération de musiciens. Notre histoire est celle d'une passion transformée en une plateforme pour la créativité, fermement enracinée au Cameroun mais avec une portée résolument internationale.",
    valeurs: ["Authenticité", "Excellence", "Innovation", "Transmission", "Communauté"]
  },
  news: [
      {
        title: "Nouveau Single : Léo T. enflamme les ondes avec 'Ma Go'",
        summary: "Le premier single de notre nouvelle signature Afro-pop, Léo T., est enfin disponible partout ! Un hit en puissance qui vous fera danser tout l'été.",
        date: "2024-06-01",
        link: "/blog/leo-t-ma-go-release"
      },
      {
        title: "Kemi Alade dévoile son EP 'Lagos Nights'",
        summary: "Plongez dans l'univers Amapiano-Soul de Kemi Alade avec son nouvel EP 5 titres. Une exploration sonore de la vie nocturne trépidante de Lagos.",
        date: "2024-05-10",
        link: "/blog/kemi-alade-lagos-nights-ep"
      },
      {
        title: "A Laiz Academy : Les inscriptions sont ouvertes !",
        summary: "Notre académie de musique ouvre ses portes pour la nouvelle saison. Cours de piano, chant, MAO... Réservez votre place dès maintenant.",
        date: "2024-04-25",
        link: "/academie"
      },
      {
        title: "The Douala Collective en concert exceptionnel au Jazz Café",
        summary: "Ne manquez pas le retour sur scène de The Douala Collective pour une soirée Afro-Jazz qui s'annonce inoubliable. Billets limités.",
        date: "2024-04-15",
        link: "/contact"
      },
      {
        title: "Les Étoiles du Gospel sortent un single live émouvant",
        summary: "Revivez la magie de leur dernier concert avec la sortie de 'Yesu Azali Awa', un single live capté lors du Festival des Voix Sacrées.",
        date: "2024-03-29",
        link: "/blog/etoiles-gospel-live-single"
      },
      {
        title: "DJ N'Goma collabore avec l'artiste ghanéen Kwame Appiah",
        summary: "Une rencontre au sommet entre l'Afro-Tech et le Highlife. Découvrez 'Accra Waves', le fruit de la collaboration entre DJ N'Goma et Kwame Appiah.",
        date: "2024-03-05",
        link: "/blog/ngoma-kwame-collab"
      }
  ],
  pressKit: {
      headline: "A Laiz Prod : Le Son de l'Afrique Moderne",
      short_text: "Téléchargez notre kit presse pour accéder aux biographies de nos artistes, à nos logos officiels et à une sélection de photos en haute résolution pour vos publications.",
      assets: ["alaiz_prod_logo_noir.png", "alaiz_prod_logo_or.png", "biographies_artistes_alaiz_prod_2024.pdf", "photos_presse_artistes.zip"]
  },
  bookingBlock: {
      title: "Booking & Partenariats",
      cta_text: "Demander un devis",
      contact_email: "booking@alaizprod.art"
  },
  // FIX: Added 'as const' to infer literal types for properties like 'type', resolving multiple type errors.
  artists: [
    {
      id: 1,
      name: "Hervé Nanfang",
      role: "Fondateur, Directeur Artistique, Pianiste & Chanteur",
      bio: "Pasteur, artiste et visionnaire, Hervé Nanfang est l'âme d'A Laiz Prod. Sa musique est un pont entre le sacré du gospel, la complexité du jazz et l'authenticité des rythmes africains.",
      imageUrl: "https://images.pexels.com/photos/4058411/pexels-photo-4058411.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&q=80",
      isFounder: true,
      detailedBio: "Pasteur, artiste et visionnaire, Hervé Nanfang est l'âme d'A Laiz Prod. Sa musique est un pont entre le sacré du gospel, la complexité du jazz et l'authenticité des rythmes africains. Depuis son plus jeune âge, il explore les harmonies au piano, développant un style unique qui fusionne les influences continentales et occidentales.\n\nSon parcours est jalonné de collaborations prestigieuses et de projets qui ont marqué la scène musicale camerounaise. En fondant A Laiz Prod en 2010, il a souhaité créer un espace où l'excellence artistique et les valeurs humaines se rencontrent, un lieu pour former et accompagner les talents de demain.",
      discography: [
        { title: 'Racines', year: 2022, type: 'Album', coverUrl: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { title: 'Échos de la Forêt', year: 2019, type: 'Album', coverUrl: 'https://images.pexels.com/photos/1528660/pexels-photo-1528660.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { title: 'Unisson (Live)', year: 2017, type: 'EP', coverUrl: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { title: 'Prélude', year: 2015, type: 'Single', coverUrl: 'https://images.pexels.com/photos/326461/pexels-photo-326461.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      ],
      videos: [
        { title: 'Live au Jazz Club - "Nostalgie"', youtubeId: '_x5_h24tW1I' },
        { title: 'Clip Officiel - "Renaissance"', youtubeId: '8_4Vt9yo-s8' },
      ],
      socials: { 
          facebook: "https://www.facebook.com/alaizopays/",
          instagram: "https://www.instagram.com/alaiz_prod/",
          youtube: "https://www.youtube.com/@alaizprod"
      }
    },
    {
      id: 2,
      name: "Kemi Alade",
      role: "Chanteuse, Auteure-compositrice",
      bio: "Surnommée la 'Reine de l'Amapiano-Soul', Kemi Alade fusionne les rythmes hypnotiques de l'Amapiano avec la chaleur de la soul nigériane.",
      imageUrl: "https://images.pexels.com/photos/3775164/pexels-photo-3775164.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&q=80",
      detailedBio: "Surnommée la 'Reine de l'Amapiano-Soul', Kemi Alade fusionne les rythmes hypnotiques de l'Amapiano sud-africain avec la chaleur de la soul nigériane et les vibrations de l'Afrobeat. Originaire de Lagos, sa voix puissante et ses textes poétiques explorent les complexités de la vie urbaine, l'amour et l'émancipation. Après avoir fait sensation sur la scène underground, son premier EP 'Lagos Nights' l'a propulsée sur le devant de la scène continentale. Kemi est plus qu'une chanteuse ; c'est une conteuse d'histoires dont chaque morceau est une invitation à danser et à réfléchir, portée par des productions impeccables qui respectent la tradition tout en étant résolument tournées vers l'avenir.",
      genres: ["Amapiano", "Afro-soul", "Afrobeat", "Alté"],
      discography: [
        { title: 'Lagos Nights', year: 2024, type: 'EP', coverUrl: 'https://images.pexels.com/photos/316902/pexels-photo-316902.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
        { title: 'Soro', year: 2023, type: 'Single', coverUrl: 'https://images.pexels.com/photos/1484806/pexels-photo-1484806.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      ],
      videos: [],
      pressQuote: "La voix qui manquait à l'Amapiano pour conquérir le monde.",
      socials: { instagram: "https://instagram.com/kemi_alade_music", facebook: "https://facebook.com/kemialade", youtube: "https://youtube.com/channel/UCkemiAlade" },
      bookingContact: { email: "booking.kemi@alaizprod.art", phone: "+237 682 180 266" },
      tags: ["headliner", "émergent"]
    },
    {
      id: 3,
      name: "The Douala Collective",
      role: "Ensemble Afro-Jazz",
      bio: "Un collectif de virtuoses qui réinvente le dialogue entre le jazz et les musiques traditionnelles camerounaises.",
      imageUrl: "https://images.pexels.com/photos/154147/pexels-photo-154147.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&q=80",
      detailedBio: "The Douala Collective est un ensemble virtuose d'instrumentistes qui réinvente le dialogue entre le jazz et les musiques traditionnelles camerounaises. Mené par le saxophoniste légendaire Femi Ekotto, le groupe explore les polyrythmies du Makossa et du Bikutsi à travers le prisme de l'improvisation jazz. Leur musique est un voyage sonore sophistiqué, à la fois cérébral et profondément ancré dans le groove. Leurs performances live sont des expériences uniques où l'énergie brute de la tradition rencontre l'élégance harmonique du jazz moderne. Ils sont la preuve vivante que la musique est un langage universel, capable de transcender les frontières et les générations.",
      genres: ["Afro-Jazz", "Makossa Fusion", "Jazz modal", "Musique instrumentale"],
      discography: [
        { title: 'Cross-Currents', year: 2023, type: 'Album', coverUrl: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
        { title: 'Wouri River Jam', year: 2022, type: 'Single', coverUrl: 'https://images.pexels.com/photos/1172207/pexels-photo-1172207.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
      ],
      videos: [],
      pressQuote: "Un pont musical parfait entre New York et Douala.",
      socials: { instagram: "https://instagram.com/thedoualacollective", facebook: "https://facebook.com/thedoualacollective", youtube: "https://youtube.com/channel/UCtdcCollective" },
      bookingContact: { email: "booking.tdc@alaizprod.art", phone: "+237 694 723 492" },
      tags: ["headliner", "collab"]
    },
    {
      id: 4,
      name: "Les Étoiles du Gospel",
      role: "Chœur Gospel",
      bio: "Une force de la nature qui allie la ferveur du gospel afro-américain à la richesse des harmonies polyphoniques d'Afrique centrale.",
      imageUrl: "https://images.pexels.com/photos/2531728/pexels-photo-2531728.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&q=80",
      detailedBio: "Sous la direction charismatique d'Hervé Nanfang, Les Étoiles du Gospel sont bien plus qu'une chorale : c'est une force de la nature. Cet ensemble vocal puissant allie la ferveur du gospel afro-américain à la richesse des harmonies polyphoniques d'Afrique centrale. Leur répertoire s'étend des hymnes intemporels revisités avec une touche unique à des compositions originales vibrantes d'espoir et de foi. Chaque concert est une célébration, un moment de communion intense où les voix s'élèvent pour toucher les âmes. Leur énergie contagieuse et leur précision vocale en font l'un des chœurs les plus demandés pour les festivals et les événements majeurs.",
      genres: ["Gospel contemporain", "Afro-Gospel", "Chorale", "Musique spirituelle"],
      discography: [
        { title: 'Yesu Azali Awa (Live)', year: 2024, type: 'Single', coverUrl: 'https://images.pexels.com/photos/3807275/pexels-photo-3807275.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
        { title: 'My Hope', year: 2022, type: 'Album', coverUrl: 'https://images.pexels.com/photos/2272854/pexels-photo-2272854.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
      ],
      videos: [],
      pressQuote: "Une vague d'émotion pure qui vous submerge.",
      socials: { instagram: "https://instagram.com/lesetoilesdugospel", facebook: "https://facebook.com/lesetoilesdugospel", youtube: "https://youtube.com/@alaizprod" },
      bookingContact: { email: "booking.gospel@alaizprod.art", phone: "+237 694 723 492" },
      tags: ["headliner"]
    },
    {
      id: 5,
      name: "Léo T.",
      role: "Chanteur Afro-pop",
      bio: "Le nouveau visage de l'Afro-pop camerounaise, capturant l'esprit de la jeunesse de Yaoundé avec son énergie débordante.",
      imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&q=80",
      detailedBio: "À seulement 22 ans, Léo T. est le nouveau visage de l'Afro-pop camerounaise. Avec son énergie débordante, ses mélodies accrocheuses et son sens inné du style, il capture l'esprit de la jeunesse de Yaoundé. Ses chansons, cocktail irrésistible de Pop, de R&B et de rythmes locaux, parlent d'amour, d'ambition et des défis de sa génération. Repéré par A Laiz Prod pour son talent brut d'auteur-compositeur et sa présence scénique captivante, Léo T. est en pleine ascension. Son premier single 'Ma Go' est rapidement devenu un hymne viral sur les réseaux sociaux, annonçant l'arrivée d'un futur grand de la musique urbaine.",
      genres: ["Afro-pop", "R&B", "Dancehall"],
      discography: [
        { title: 'Ma Go', year: 2024, type: 'Single', coverUrl: 'https://images.pexels.com/photos/1484806/pexels-photo-1484806.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
      ],
      videos: [],
      pressQuote: "Le prince de la pop camerounaise est arrivé.",
      socials: { instagram: "https://instagram.com/leot.officiel", facebook: "https://facebook.com/leot.officiel", youtube: "https://youtube.com/channel/UCleoTOfficiel" },
      bookingContact: { email: "booking.leo@alaizprod.art", phone: "+237 682 180 266" },
      tags: ["émergent"]
    },
    {
      id: 6,
      name: "DJ N'Goma",
      role: "DJ, Producteur Afro-Tech",
      bio: "Un architecte sonore à l'avant-garde de la scène électronique africaine, créant des paysages sonores immersifs.",
      imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop&q=80",
      detailedBio: "DJ N'Goma est un architecte sonore. Producteur et DJ, il est à l'avant-garde de la scène électronique africaine, créant des paysages sonores où les instruments traditionnels (balafon, kora, djembé) rencontrent la puissance des basses et des synthétiseurs de la musique électronique. Ses sets sont des expériences immersives, un pont entre le village et le club, l'ancestral et le futuriste. En studio, il est un collaborateur recherché, capable d'apporter une texture unique et une profondeur rythmique à n'importe quel projet. Sa musique, qualifiée d' 'Afro-Futurist Tech', repousse les frontières et défie les classifications.",
      genres: ["Afro-Tech", "Electronic", "World Music", "Ambient"],
      discography: [
        { title: 'Digital Griot', year: 2023, type: 'Album', coverUrl: 'https://images.pexels.com/photos/5071171/pexels-photo-5071171.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
        { title: 'Bikutsi Transmission', year: 2023, type: 'Single', coverUrl: 'https://images.pexels.com/photos/316902/pexels-photo-316902.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&q=80', audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
      ],
      videos: [],
      pressQuote: "Le son du futur, avec les racines du passé.",
      socials: { instagram: "https://instagram.com/dj_ngoma", facebook: "https://facebook.com/djngoma", youtube: "https://youtube.com/channel/UCdjNgoma" },
      bookingContact: { email: "booking.ngoma@alaizprod.art", phone: "+237 682 180 266" },
      tags: ["collab", "émergent"]
    }
  ] as const,
  services: [
    { id: 1, title: "Production Musicale", description: "De l'arrangement à la post-production, nous donnons vie à vos projets musicaux avec une qualité professionnelle.", icon: MusicIcon },
    { id: 2, title: "Prestations Live", description: "Concerts, événements privés, cérémonies. Des performances live inoubliables pour tous vos moments importants.", icon: EventsIcon },
    { id: 3, title: "Formation & Coaching", description: "Développez vos talents avec nos formations en piano, chant et MAO au sein de l'A Laiz Academy.", icon: PianoIcon },
    { id: 4, title: "Location de Studio", description: "Accédez à un espace de répétition et d'enregistrement entièrement équipé pour vos projets créatifs.", icon: RentalIcon },
  ],
  // FIX: Added 'as const' to the academy object to infer literal types for properties like 'billingCycle', resolving type errors.
  academy: {
    disciplines: [
      {
        id: 'piano',
        name: 'Piano & Claviers',
        imageUrl: 'https://images.pexels.com/photos/164745/pexels-photo-164745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        videoId: 't3532s_i5Ng',
        levels: [
          {
            level_name: "Débutant - Les Fondations",
            duration_weeks: 12,
            hours_per_week: 2,
            learning_objectives: [
              "Adopter une posture correcte et une bonne position des mains",
              "Lire les notes sur les clés de Sol et de Fa",
              "Comprendre et jouer les rythmes de base (rondes, blanches, noires, croches)",
              "Jouer les gammes majeures et mineures simples",
              "Construire et jouer les accords parfaits majeurs et mineurs",
              "Accompagner une mélodie simple avec des accords de base"
            ],
            syllabus: [
              { lesson: 1, title: "Découverte du clavier et posture", content: "Se familiariser avec le clavier, le nom des notes (système international et latin), la posture correcte du corps et des mains pour éviter les tensions." },
              { lesson: 2, title: "Initiation au rythme", content: "Introduction aux figures de notes et de silences. Exercices de frappé et de lecture rythmique simple." },
              { lesson: 3, title: "Lecture de notes - Clé de Sol", content: "Apprendre à identifier et à jouer les notes sur la portée en clé de Sol (main droite)." },
              { lesson: 4, title: "Lecture de notes - Clé de Fa", content: "Apprendre à identifier et à jouer les notes sur la portée en clé de Fa (main gauche)." },
              { lesson: 5, title: "Les gammes majeures", content: "Construction et doigté de la gamme de Do Majeur. Introduction à la structure des gammes majeures (tons et demi-tons)." },
              { lesson: 6, title: "Les accords de base (Majeurs)", content: "Construction des triades majeures. Enchaînement d'accords simples (I-IV-V)." },
              { lesson: 7, title: "Coordination des deux mains", content: "Exercices simples pour développer l'indépendance des mains. Jouer une mélodie à la main droite et des notes tenues à la main gauche." },
              { lesson: 8, title: "Les accords mineurs", content: "Construction des triades mineures. Introduction à la cadence parfaite mineure." },
              { lesson: 9, title: "Premiers accompagnements", content: "Apprendre à jouer des accompagnements simples (accords plaqués, arpèges basiques) sur des grilles d'accords." },
              { lesson: 10, title: "Lecture à vue et déchiffrage", content: "Techniques pour aborder une partition inconnue. Exercices de déchiffrage progressifs." },
              { lesson: 11, title: "Introduction à l'improvisation", content: "Explorer la gamme pentatonique et improviser ses premières mélodies sur un accord simple." },
              { lesson: 12, title: "Bilan et préparation du répertoire", content: "Révision des concepts. Préparation et interprétation de deux morceaux simples." }
            ],
            exercises: [
              { title: "Ex 1 - Indépendance des doigts", instructions: "Jouer l'exercice de Hanon n°1 lentement, en veillant à la régularité et à la force de chaque doigt.", solution: "Partition de l'exercice fournie en PDF." },
              { title: "Ex 2 - Enchaînement d'accords", instructions: "Jouer la progression I-vi-IV-V (Do-Lam-Fa-Sol) en accords plaqués à la main droite, en respectant le rythme.", solution: "Démonstration audio fournie." }
            ],
            recommended_repertoire: ["\"Imagine\" - John Lennon", "\"Someone Like You\" - Adele (version simplifiée)", "\"Malaïka\" - Miriam Makeba (mélodie et accords de base)"],
            resources: ["pdf:tableau_des_accords_majeurs_mineurs.pdf", "pdf:les_gammes_essentielles.pdf", "mp3:accompagnement_pop_simple.mp3"],
            assessment: { type: "Pratique (interprétation d'un morceau) + QCM de théorie", passing_criteria: "75% de réussite globale" }
          },
          {
            level_name: "Intermédiaire - Harmonie & Styles",
            duration_weeks: 16,
            hours_per_week: 3,
            learning_objectives: ["Maîtriser toutes les gammes majeures et mineures (harmonique, mélodique)", "Construire et utiliser les accords de septième (maj7, m7, 7, m7b5)", "Comprendre et jouer les cadences harmoniques courantes (II-V-I)", "Lire une grille d'accords (lead sheet) et réaliser un accompagnement simple", "S'initier à l'improvisation (gamme blues, modes)", "Aborder différents styles : Jazz, Blues, Gospel, Pop"],
            syllabus: [
              { lesson: 1, title: "Les renversements d'accords", content: "Apprendre à jouer les accords dans toutes leurs positions pour fluidifier les enchaînements." },
              { lesson: 2, title: "Les accords de septième", content: "Construction, sonorité et fonction des accords de 4 sons (maj7, m7, 7)." },
              { lesson: 3, title: "Le cycle des quintes", content: "Comprendre le cycle des quintes comme un outil pour l'harmonie et l'improvisation." },
              { lesson: 4, title: "La cadence II-V-I majeure", content: "La progression la plus importante du Jazz et du Gospel. Analyse et pratique dans plusieurs tonalités." },
              { lesson: 5, title: "Introduction au Blues", content: "La structure du Blues en 12 mesures, la gamme Blues et les 'blue notes'." },
              { lesson: 6, title: "Accompagnement Gospel et Pop", content: "Rythmiques et voicings spécifiques. Apprendre à créer un arrangement simple." },
              { lesson: 7, title: "Les gammes mineures", content: "Différences et utilisations des gammes mineures naturelle, harmonique et mélodique." },
              { lesson: 8, title: "La cadence II-V-I mineure", content: "Analyse et pratique de la résolution sur un accord mineur." },
              { lesson: 9, title: "Lecture de 'Lead Sheets'", content: "Comment interpréter une partition qui contient uniquement la mélodie et les chiffrages d'accords." },
              { lesson: 10, title: "Improvisation modale (bases)", content: "Introduction aux modes de la gamme majeure (ionien, dorien, etc.) et leur application." },
              { lesson: 11, title: "Technique avancée : arpèges et gammes en sextolets", content: "Exercices pour développer la vélocité et la précision." },
              { lesson: 12, title: "Les claviers modernes", content: "Introduction aux sons de piano électrique (Rhodes, Wurlitzer) et d'orgue Hammond. Utilisation de la molette de modulation et du pitch bend." }
            ],
            exercises: [
              { title: "Ex 1 - II-V-I dans toutes les tonalités", instructions: "Jouer la cadence II-V-I majeure en suivant le cycle des quintes, main gauche pour la basse, main droite pour les accords.", solution: "PDF avec les doigtés et voicings recommandés." },
              { title: "Ex 2 - Improvisation Blues", instructions: "Improviser une mélodie en utilisant la gamme Blues sur une grille de Blues en Sol, fournie en audio.", solution: "Exemple d'improvisation en MP3 pour inspiration." }
            ],
            recommended_repertoire: ["\"Autumn Leaves\" - Joseph Kosma", "\"No Woman, No Cry\" - Bob Marley", "\"Pata Pata\" - Miriam Makeba"],
            resources: ["pdf:grilles_jazz_standards_simples.pdf", "pdf:voicings_gospel_essentiels.pdf", "mp3:backing_track_blues_en_G.mp3"],
            assessment: { type: "Pratique (improvisation sur une grille + interprétation d'un standard)", passing_criteria: "Maîtrise technique et créativité" }
          },
          {
            level_name: "Avancé - Maîtrise & Création",
            duration_weeks: 20,
            hours_per_week: 4,
            learning_objectives: ["Maîtriser les techniques d'harmonie avancée (accords altérés, substitutions tritoniques)", "Analyser et jouer des standards de jazz complexes", "Développer une forte identité en improvisation", "Composer et arranger des morceaux originaux", "Comprendre et appliquer les polyrythmies et les mesures impaires", "Jouer en groupe et interagir avec d'autres musiciens"],
            syllabus: [
              { lesson: 1, title: "Harmonie avancée : les accords altérés", content: "Utilisation des tensions (b9, #9, #11, b13) sur les accords de dominante pour créer de la couleur et de la tension." },
              { lesson: 2, title: "La substitution tritonique", content: "Comprendre et appliquer la substitution d'un accord de dominante par celui situé à un triton." },
              { lesson: 3, title: "Analyse de standards complexes", content: "Étude harmonique de morceaux comme 'Giant Steps' (John Coltrane) ou 'Spain' (Chick Corea)." },
              { lesson: 4, title: "Techniques de réharmonisation", content: "Apprendre à remplacer les accords d'une grille existante pour lui donner une nouvelle couleur harmonique." },
              { lesson: 5, title: "Improvisation 'Out'", content: "Techniques pour jouer en dehors de l'harmonie de manière contrôlée et musicale." },
              { lesson: 6, title: "Polyrythmies et mesures asymétriques", content: "Introduction aux rythmes africains et des Balkans. Superposition de rythmes (3 sur 4) et travail en 5/4, 7/8." },
              { lesson: 7, title: "Arrangement pour petite formation", content: "Écrire des parties pour basse, batterie et un soliste à partir d'une composition au piano." },
              { lesson: 8, title: "Le jeu en groupe", content: "Ateliers pratiques : l'écoute, l'interaction, le rôle du pianiste dans un trio ou un quartet." }
            ],
            exercises: [
              { title: "Ex 1 - Réharmoniser 'Autumn Leaves'", instructions: "Proposer une nouvelle grille harmonique pour les 8 premières mesures du standard, en utilisant des substitutions et des accords de passage.", solution: "Plusieurs exemples de réharmonisation fournis pour comparaison." },
              { title: "Ex 2 - Composition", instructions: "Composer un thème de 16 mesures sur une grille d'accords modale (ex: 8 mesures en Do dorien, 8 mesures en Mib lydien).", solution: "Accompagnement personnalisé et analyse de la composition en cours." }
            ],
            recommended_repertoire: ["\"Giant Steps\" - John Coltrane", "\"Watermelon Man\" - Herbie Hancock", "Tout standard de Jazz au choix de l'élève"],
            resources: ["pdf:analyse_harmonique_giant_steps.pdf", "pdf:guide_des_substitutions.pdf", "mp3:backing_track_modal_C_dorian.mp3"],
            assessment: { type: "Concert de fin de cursus (interprétation d'un standard arrangé et d'une composition originale)", passing_criteria: "Obtention du Certificat de Maîtrise de l'A Laiz Academy" }
          }
        ]
      },
      {
        id: 'chant',
        name: 'Chant & Technique Vocale',
        imageUrl: 'https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        videoId: '3a-20-9444k',
        levels: [
          {
            level_name: "Débutant - Découverte de la Voix",
            duration_weeks: 12,
            hours_per_week: 2,
            learning_objectives: ["Comprendre et maîtriser la respiration diaphragmatique", "Adopter une posture saine pour le chant", "Chanter juste sur une tessiture confortable", "Développer une conscience de la résonance vocale", "Articuler clairement et travailler les voyelles", "Interpréter une chanson simple avec confiance"],
            syllabus: [
              { lesson: 1, title: "Anatomie de la voix et posture", content: "Comprendre le fonctionnement de l'appareil vocal (larynx, cordes vocales, etc.). Exercices de relaxation et d'alignement du corps." },
              { lesson: 2, title: "La respiration du chanteur", content: "Apprentissage de la respiration diaphragmatique. Exercices pour contrôler le flux d'air (soutien)." },
              { lesson: 3, title: "La justesse et l'écoute", content: "Exercices pour développer l'oreille musicale et chanter des notes précises. Travail sur des intervalles simples." },
              { lesson: 4, title: "Les résonateurs", content: "Découvrir où placer sa voix pour qu'elle sonne sans effort (résonance de masque, de poitrine)." },
              { lesson: 5, title: "Les voyelles et l'articulation", content: "Travail sur la pureté des voyelles et la clarté des consonnes pour une meilleure intelligibilité." },
              { lesson: 6, title: "Connexion voix-corps", content: "Utiliser le corps pour soutenir l'émotion et l'énergie du chant." }
            ],
            exercises: [
              { title: "Ex 1 - Le 'S' tenu", instructions: "Inspirer profondément par le diaphragme, puis expirer le plus lentement et régulièrement possible sur un son 'S'.", solution: "Démonstration audio avec objectif de durée (ex: 20 secondes)." },
              { title: "Ex 2 - Vocalises sur 5 notes", instructions: "Chanter des gammes de 5 notes (Do-Ré-Mi-Fa-Sol) sur différentes voyelles, en montant et descendant par demi-tons.", solution: "Accompagnement piano en MP3." }
            ],
            recommended_repertoire: ["\"Hallelujah\" - Leonard Cohen", "\"Three Little Birds\" - Bob Marley", "Une chanson traditionnelle simple au choix"],
            resources: ["pdf:routine_echauffement_vocal.pdf", "mp3:vocalises_debutant_piano.mp3"],
            assessment: { type: "Interprétation d'une chanson simple a cappella et avec accompagnement.", passing_criteria: "Justesse, rythme et posture corrects (70%)" }
          },
          {
            level_name: "Intermédiaire - Maîtrise & Interprétation",
            duration_weeks: 16,
            hours_per_week: 3,
            learning_objectives: ["Étendre sa tessiture vocale de manière saine", "Maîtriser les transitions entre voix de poitrine et voix de tête (passaggio)", "Introduire différentes qualités vocales (belting, twang, voix mixte)", "Développer l'interprétation et l'expression des émotions", "Chanter des harmonies simples et se placer dans un chœur", "S'initier à l'improvisation vocale (scat de base)"],
            syllabus: [],
            exercises: [],
            recommended_repertoire: [],
            resources: [],
            assessment: { type: "", passing_criteria: "" }
          }
        ]
      },
      {
        id: 'mao',
        name: 'MAO & Production',
        imageUrl: 'https://images.pexels.com/photos/3750777/pexels-photo-3750777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        levels: [
           {
            level_name: "Débutant - Home Studio",
            duration_weeks: 12,
            hours_per_week: 3,
            learning_objectives: ["Choisir et configurer son matériel (carte son, micro, clavier MIDI)", "Maîtriser les bases d'un séquenceur (DAW) : pistes, tempo, enregistrement", "Enregistrer une source audio (voix, guitare) et MIDI", "Comprendre et utiliser les effets de base (EQ, compression, réverbération)", "Programmer une rythmique simple avec une boîte à rythmes virtuelle", "Exporter son premier morceau au format MP3"],
            syllabus: [],
            exercises: [],
            recommended_repertoire: [],
            resources: [],
            assessment: { type: "", passing_criteria: "" }
          }
        ]
      },
       {
        id: 'musicologie',
        name: 'Musicologie & Culture',
        imageUrl: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        levels: [
          {
            level_name: "Initiation - Histoire & Analyse",
            duration_weeks: 10,
            hours_per_week: 2,
            learning_objectives: ["Comprendre les grandes périodes de l'histoire de la musique occidentale", "Analyser une œuvre simple (forme, harmonie, orchestration)", "S'initier à l'ethnomusicologie et aux musiques du monde", "Découvrir les liens entre musique et société", "Développer une écoute critique et analytique"],
            syllabus: [],
            exercises: [],
            recommended_repertoire: [],
            resources: [],
            assessment: { type: "", passing_criteria: "" }
          }
        ]
      }
    ],
    formulas: [
        { id: 'indiv', name: "Pack Individuel", description: "Un suivi personnalisé avec un professeur pour une progression optimale.", price: { eur: 120, xaf: 80000 }, billingCycle: 'mois', icon: PackIndividuelIcon, features: ["1h de cours individuel / semaine", "Accès illimité aux ressources en ligne", "Suivi personnalisé par e-mail", "Participation aux ateliers de groupe"] },
        { id: 'duo', name: "Pack Duo", description: "Apprenez avec un ami ou un membre de votre famille et bénéficiez d'un tarif préférentiel.", price: { eur: 200, xaf: 130000 }, billingCycle: 'mois', icon: PackDuoIcon, features: ["1h de cours en duo / semaine", "Idéal pour les couples ou amis", "Mêmes avantages que le pack individuel", "Motivation accrue"] },
        { id: 'hybride', name: "Formation Hybride", description: "La flexibilité du MOOC alliée à l'efficacité des cours individuels pour un apprentissage complet.", price: { eur: 180, xaf: 120000 }, billingCycle: 'mois', icon: FormationHybrideIcon, features: ["Accès complet au MOOC", "2h de cours individuel / mois", "Le meilleur des deux mondes", "Plan de travail personnalisé"] },
        { id: 'mooc', name: "MOOC Complet", description: "Accédez à l'ensemble de nos cours vidéo et supports pédagogiques en ligne, à votre rythme.", price: { eur: 250, xaf: 165000 }, billingCycle: 'unique', icon: MoocIcon, features: ["Accès à vie à tous les niveaux", "Apprentissage 100% autonome", "Supports de cours téléchargeables", "Certificat de fin de formation"] },
        { id: 'masterclass', name: "Masterclass & Ateliers", description: "Des sessions intensives avec des artistes et experts renommés sur des thèmes spécifiques.", customPriceText: "Prix variable", icon: MasterclassIcon, features: ["Sessions ponctuelles", "Thèmes variés (improvisation, composition, etc.)", "Intervenants de haut niveau", "Places limitées"] },
        { id: 'certification', name: "Parcours Certifiant", description: "Un programme complet et exigeant pour les futurs professionnels de la musique.", customPriceText: "Sur devis", icon: CertificationIcon, features: ["Cursus de 2 ans", "Préparation aux métiers de la musique", "Stage en studio inclus", "Diplôme A Laiz Academy"] },
    ],
    whyChooseUs: [
        "Une pédagogie qui allie la rigueur de la théorie musicale classique à la richesse des traditions africaines.",
        "Des professeurs qui sont avant tout des artistes actifs et passionnés, ancrés dans la scène musicale actuelle.",
        "Un environnement bienveillant et stimulant qui favorise la créativité et l'expression personnelle.",
        "Des formations flexibles adaptées à tous les âges, tous les niveaux et tous les objectifs.",
        "Plus qu'une école, une communauté où les élèves peuvent se rencontrer, collaborer et grandir ensemble.",
        "L'opportunité unique d'apprendre au sein d'un label de musique professionnel et de côtoyer des artistes."
    ],
  } as const,
  // FIX: Added 'as const' to infer literal types for properties like 'category', resolving type errors.
  blogPosts: [
    {
      id: 1,
      title: "Les 5 secrets d'un bon mixage audio en home studio",
      author: "Hervé Nanfang",
      date: "2024-05-15",
      excerpt: "Vous enregistrez à la maison mais vos morceaux manquent de clarté et de punch ? Découvrez 5 techniques essentielles pour transformer vos productions.",
      imageUrl: "https://images.pexels.com/photos/3750777/pexels-photo-3750777.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: 'Conseils pour artistes',
      likes: 42,
      content: "## L'importance de l'EQ\nL'égalisation (EQ) est votre outil le plus puissant. Pensez-y comme à de la sculpture sonore. Avant d'augmenter une fréquence, essayez d'abord de couper celles qui sont inutiles. Donnez à chaque instrument sa propre place dans le spectre sonore pour éviter les conflits.\n\n### La compression, votre meilleure amie\nLa compression réduit la différence entre les parties les plus fortes et les plus faibles d'un son. Utilisée avec modération, elle peut donner du liant et de la consistance à votre mix. Attention à ne pas en abuser, au risque d'écraser toute la dynamique !\n\n*Une astuce : utilisez un compresseur avec une attaque lente pour laisser passer les transitoires et garder du punch.*\n\n## La magie de la réverbération et du delay\nCes effets créent de l'espace et de la profondeur. Utilisez-les sur des pistes 'auxiliaires' pour pouvoir envoyer plusieurs instruments dans le même espace virtuel. Moins, c'est souvent plus : une réverbération subtile peut faire des merveilles.\n\n### Pensez en 3D : le Panning\nVotre mix n'est pas qu'une question de volume et de fréquences, mais aussi de placement dans l'espace stéréo. N'hésitez pas à placer certains éléments sur les côtés pour aérer votre mix. La basse et la voix principale restent généralement au centre.\n\n## La référence, toujours la référence\nÉcoutez régulièrement des morceaux professionnels que vous aimez dans le même style. Cela vous aidera à calibrer vos oreilles et à prendre de meilleures décisions de mixage. Faites des pauses régulières pour reposer vos oreilles.\n\nEn appliquant ces 5 principes, vous verrez une nette amélioration dans la qualité de vos productions. Bon mixage ! Pour en savoir plus, découvrez notre [formation MAO](/academie/mao/debutant---home-studio)."
    },
    {
      id: 2,
      title: "Kemi Alade en résidence de création pour son prochain album",
      author: "A Laiz Prod",
      date: "2024-06-02",
      excerpt: "Notre reine de l'Amapiano-Soul, Kemi Alade, s'est retirée dans un lieu tenu secret pour préparer son très attendu premier album. Premières infos exclusives.",
      imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: 'Événements',
      likes: 78,
      content: "Depuis la sortie de son EP **Lagos Nights**, Kemi Alade n'a cessé de faire parler d'elle. Aujourd'hui, nous sommes fiers de vous annoncer qu'elle est entrée en résidence de création pour préparer ce qui s'annonce comme l'un des albums Afro-soul les plus attendus de l'année.\n\n## Un retour aux sources\nPour ce projet, Kemi a souhaité s'isoler pour se reconnecter à ses racines. Elle explore des sonorités traditionnelles Yoruba, les fusionnant avec les productions modernes et audacieuses qui la caractérisent. Attendez-vous à des collaborations surprenantes et à des textes encore plus personnels.\n\n*\"Je veux que cet album soit un voyage, une célébration de qui je suis et d'où je viens\"*, nous a-t-elle confié. L'album est co-produit par notre directeur artistique [Hervé Nanfang](/artiste/1) et le célèbre producteur nigérian **Masterkraft**.\n\nLa sortie est prévue pour la fin de l'année. Restez connectés pour plus d'informations et peut-être un premier single très bientôt !"
    },
    {
      id: 3,
      title: "L'héritage de Manu Dibango : le Makossa au cœur du monde",
      author: "Hervé Nanfang",
      date: "2024-06-18",
      excerpt: "Retour sur la carrière et l'influence d'un géant de la musique camerounaise et mondiale. Comment le 'Soul Makossa' a-t-il conquis la planète ?",
      imageUrl: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: 'Musique & Culture',
      likes: 102,
      content: "Manu Dibango, ou 'Papa Manu', n'était pas seulement un saxophoniste de génie. Il était un ambassadeur, un pont entre les cultures. Son titre 'Soul Makossa', né sur la face B d'un 45 tours en 1972, est devenu un phénomène planétaire, samplé par les plus grands, de Michael Jackson à Rihanna.\n\nCe morceau a ouvert les portes du monde au Makossa, un rythme né dans les rues de Douala. Il a montré que la musique camerounaise pouvait être universelle, qu'elle pouvait faire danser les gens de New York à Tokyo. C'est cet héritage qui nous inspire chaque jour chez A Laiz Prod. Nous croyons en une musique qui, tout en étant fièrement africaine, parle à tout le monde. The Douala Collective, notre ensemble [Afro-Jazz](/artiste/3), s'inscrit directement dans cette lignée, explorant les fusions que Papa Manu a initiées."
    },
    {
      id: 4,
      title: "Technique vocale : 3 exercices pour mieux maîtriser sa respiration",
      author: "Hervé Nanfang",
      date: "2024-07-01",
      excerpt: "Le soutien respiratoire est le fondement du chant. Que vous soyez débutant ou confirmé, ces 3 exercices vous aideront à construire une base solide.",
      imageUrl: "https://images.pexels.com/photos/4058411/pexels-photo-4058411.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: 'Conseils pour artistes',
      likes: 65,
      content: "## 1. La Paille\nPrenez une paille et soufflez dans un verre d'eau. Le but est de créer un flux de bulles constant et régulier, sans forcer. Cet exercice vous apprend à gérer votre flux d'air de manière économique et stable.\n\n## 2. Le 'S' Tenu\nInspirez profondément par le ventre (respiration diaphragmatique), puis expirez le plus longtemps et le plus régulièrement possible sur un son 'Ssssss...'. Essayez de tenir de plus en plus longtemps sans que le son ne faiblisse. Cela renforce votre diaphragme.\n\n## 3. Le Livre sur le Ventre\nAllongez-vous sur le dos, placez un livre sur votre ventre. À l'inspiration, le livre doit monter. À l'expiration, il doit descendre. Cet exercice vous aide à visualiser et à ressentir la respiration abdominale, essentielle pour un bon soutien.\n\nPratiquez ces exercices 5 à 10 minutes chaque jour et vous sentirez une différence notable dans la puissance et le contrôle de votre voix. Envie d'aller plus loin ? Découvrez notre [cursus de chant](/academie/chant/debutant---decouverte-de-la-voix) !"
    },
    {
      id: 16,
      title: "Activisme dans les paroles, justice sociale : Quand la musique africaine devient résistance",
      author: "Hervé Nanfang",
      date: "2024-07-28",
      excerpt: "La musique africaine a toujours été un puissant vecteur de changement social. De Fela Kuti à Angélique Kidjo, les artistes utilisent leurs voix pour dénoncer l'injustice et inspirer l'espoir. Cet article explore l'héritage et l'impact de la musique engagée sur le continent.",
      imageUrl: "/A%20laiz%20Prod%20-%20Music%20etactivisme.jpg",
      category: 'Musique & Culture',
      // FIX: Added missing 'likes' property to ensure type consistency within the array.
      likes: 95,
      content: "## Une tradition de contre-pouvoir\n\nBien avant l'ère des superstars mondiales, la musique en Afrique a toujours joué un rôle social et politique. Les griots d'Afrique de l'Ouest, par exemple, étaient bien plus que de simples musiciens ; ils étaient les gardiens de l'histoire, des conseillers pour les rois et, parfois, la voix du peuple contre le pouvoir. Cette tradition de la parole chantée comme outil de cohésion sociale et de critique s'est transformée au contact de la colonisation et des luttes pour l'indépendance.\n\n## L'âge d'or des icônes de la protestation\n\nLe XXe siècle a vu l'émergence de figures emblématiques qui ont porté la musique de protestation africaine sur la scène mondiale. **Fela Kuti** au Nigeria, avec l'Afrobeat, a créé une véritable arme musicale contre la corruption et la dictature militaire. Ses morceaux, souvent longs de plus de 15 minutes, étaient des réquisitoires virulents contre l'injustice, enveloppés dans des rythmes hypnotiques.\n\nEn Afrique du Sud, la musique est devenue la bande-son de la lutte contre l'apartheid. Des artistes comme **Miriam Makeba**, surnommée 'Mama Africa', et **Hugh Masekela** ont utilisé leur exil pour sensibiliser le monde entier à la brutalité du régime ségrégationniste. Leurs chansons, comme *'Soweto Blues'* ou *'Bring Him Back Home (Nelson Mandela)'*, sont devenues des hymnes de résistance et d'espoir pour des millions de personnes.\n\n## La nouvelle génération : des combats diversifiés\n\nAujourd'hui, la flamme de la musique engagée brûle toujours, mais les combats ont évolué. La nouvelle génération d'artistes africains s'attaque à un éventail plus large de problématiques sociales.\n\nLe rappeur sénégalais **Didier Awadi** s'attaque aux thèmes du néocolonialisme et de la mal gouvernance. Au Ghana, **Blitz the Ambassador** mêle hip-hop et highlife pour parler d'identité et de diaspora. Des artistes comme la Béninoise **Angélique Kidjo**, ambassadrice de l'UNICEF, utilisent leur renommée pour défendre l'éducation des filles et les droits des femmes.\n\nLe combat pour la justice sociale s'exprime également à travers des thèmes comme la protection de l'environnement, les droits LGBTQ+ ou la lutte contre les violences policières, trouvant un écho particulier auprès de la jeunesse urbaine du continent.\n\n## Conclusion : une voix qui ne s'éteint jamais\n\nChez A Laiz Prod, nous croyons profondément au pouvoir de la musique pour inspirer le changement. C'est une force qui peut unir les gens, guérir les blessures et donner le courage de se battre pour un monde meilleur. De l'Afrobeat contestataire au rap conscient, la musique africaine continue d'être un puissant instrument de résistance, prouvant que même face à l'adversité, la mélodie de la justice ne peut être réduite au silence. C'est cet esprit que nous cherchons à cultiver chez nos [artistes](/label)."
    }
  ] as const,
  // FIX: Added 'as const' to infer literal types for properties like 'type', resolving type errors.
  testimonials: [
    { id: 1, author: "Jean-Claude B.", role: "Client - Mariage", quote: "La prestation live de Hervé Nanfang et son groupe a rendu notre mariage inoubliable. Un professionnalisme et une émotion rares. Merci !", type: 'client' },
    { id: 2, author: "Sarah M.", role: "Élève - Piano", quote: "En six mois à l'A Laiz Academy, j'ai plus progressé qu'en trois ans de cours classiques. La méthode est incroyable et les profs sont passionnants.", type: 'student' },
    { id: 3, author: "Fatou K.", role: "Cliente - Événement d'entreprise", quote: "The Douala Collective a apporté une touche de classe et d'authenticité à notre soirée de gala. Nos partenaires internationaux ont été conquis.", type: 'client' },
    { id: 4, author: "David E.", role: "Élève - MAO", quote: "Le cours de MAO m'a ouvert les yeux. Je peux enfin créer les sons que j'ai en tête. C'est une formation très concrète et de grande qualité.", type: 'student' },
    { id: 5, author: "Festival Afropulse", role: "Partenaire", quote: "Collaborer avec A Laiz Prod est un gage de qualité. Des artistes exceptionnels et une équipe de booking très professionnelle.", type: 'client' }
  ] as const,
  // FIX: Added 'as const' to infer literal types for properties like 'type', resolving type errors.
  events: [
    { 
      id: 1, 
      title: "Concert 'Jazz & Racines'", 
      date: formatDate(eventDate1), 
      type: 'Concert', 
      description: "Hervé Nanfang et The Douala Collective vous invitent à un voyage musical unique, aux confluents du jazz et des sonorités camerounaises.",
      time: '20:30',
      location: 'Jazz Club de Yaoundé'
    },
    { 
      id: 2, 
      title: "Masterclass 'Le Chant Gospel'", 
      date: formatDate(eventDate2), 
      type: 'Masterclass', 
      description: "Une journée intensive pour explorer les techniques et l'esprit du chant gospel, animée par Hervé Nanfang.",
      time: '09:00 - 17:00',
      location: 'A Laiz Academy, Yaoundé',
      intervenant: "Hervé Nanfang"
    },
    { 
      id: 3, 
      title: "Scène Ouverte A Laiz Prod", 
      date: formatDate(eventDate3), 
      type: 'Événement Spécial', 
      description: "Nos élèves et artistes partagent la scène pour une soirée de découvertes et de partage. Entrée libre.",
      time: '19:00',
      location: 'A Laiz Prod Studio'
    }
  ] as const,
  // FIX: Added 'as const' to infer literal types for properties like 'type', resolving type errors.
  portfolio: [
    {
      id: 1,
      title: "Renaissance",
      year: 2023,
      cover_image: "https://images.pexels.com/photos/1484806/pexels-photo-1484806.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
      type: 'clip',
      artists: ["Hervé Nanfang"],
      description: "Le clip officiel du morceau 'Renaissance', tiré de l'album 'Racines'. Une ode visuelle à la résilience et au renouveau, tournée dans les paysages luxuriants de l'Ouest Cameroun.",
      credits: {
        producer: "A Laiz Prod",
        engineer: "Simon 'Sy' M.",
        director: "Kameni Films"
      },
      media: {
        video_url: "8_4Vt9yo-s8",
        audio_url: null
      },
      duration: "4:12",
      tags: ["gospel", "clip officiel", "nature"],
      license: "Tous droits réservés",
      downloadable_assets: ["dossier_presse_renaissance.pdf"],
      case_study: "Pour 'Renaissance', l'objectif était de traduire visuellement le thème de la renaissance personnelle et spirituelle. Nous avons opté pour un tournage en extérieur pour symboliser le retour aux sources. Le défi principal était la logistique dans des zones reculées. Le résultat est un clip authentique qui a cumulé plus de 100 000 vues en un mois, renforçant l'image d'Hervé Nanfang comme un artiste profondément connecté à ses racines."
    },
    {
        id: 2,
        title: "Cross-Currents",
        year: 2023,
        cover_image: "https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
        type: 'album',
        artists: ["The Douala Collective"],
        description: "L'album qui redéfinit l'Afro-Jazz. 'Cross-Currents' est une exploration audacieuse des rythmes Makossa et Bikutsi à travers le langage harmonique du jazz moderne. Un dialogue musical captivant.",
        credits: {
            producer: "Hervé Nanfang",
            engineer: "David 'Davy' K.",
            director: "N/A"
        },
        media: {
            video_url: null,
            audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
        },
        duration: "45:30",
        tags: ["afro-jazz", "album", "instrumental"],
        license: "A Laiz Prod / Sacem",
        downloadable_assets: ["livret_album_cross_currents.pdf"],
        case_study: "La production de 'Cross-Currents' visait à capturer l'énergie live du Douala Collective tout en offrant une qualité sonore de studio. Nous avons utilisé des techniques d'enregistrement 'live-in-studio', avec tous les musiciens jouant ensemble. L'album a été salué par la critique internationale, recevant une nomination aux 'Victoires du Jazz' en France, et a permis au groupe de se produire dans plusieurs festivals européens majeurs."
    }
  ] as const,
   publicCreations: [
    {
        id: 101,
        prompt: "Une piste de jazz entraînante pour une soirée cocktail",
        url: "https://cdn.pixabay.com/download/audio/2022/01/24/audio_99b35b659c.mp3",
        date: "2024-07-10T10:00:00Z",
        userName: "JazzFan33",
        likes: 15
    },
    {
        id: 102,
        prompt: "Beat Lo-fi pour se concentrer et travailler",
        url: "https://cdn.pixabay.com/download/audio/2024/05/29/audio_b4b3b3a2ce.mp3",
        date: "2024-07-09T15:30:00Z",
        userName: "StudyGirl",
        likes: 28
    },
    {
        id: 103,
        prompt: "Hymne gospel puissant avec des chœurs et un piano",
        url: "https://cdn.pixabay.com/download/audio/2022/11/17/audio_3138fd9f49.mp3",
        date: "2024-07-10T11:00:00Z",
        userName: "PraiseBeats",
        likes: 8
    }
  ] as const
};
