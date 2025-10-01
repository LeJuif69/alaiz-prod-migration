
import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageWrapper from './components/PageWrapper';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import MusicPlayer from './components/MusicPlayer';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Chatbot from './components/Chatbot';
import { DataProvider } from './contexts/DataContext';
import ScrollToTopButton from './components/ScrollToTopButton';
import { InteractionProvider } from './contexts/InteractionContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';

// Lazy-load all page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LabelPage = lazy(() => import('./pages/LabelPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const ArtistPage = lazy(() => import('./pages/ArtistPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const TutorPage = lazy(() => import('./pages/TutorPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const MentionsLegalesPage = lazy(() => import('./pages/MentionsLegalesPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <AuthProvider>
          <CurrencyProvider>
            <MusicPlayerProvider>
              <InteractionProvider>
                <div className="min-h-screen bg-alaiz-black text-alaiz-cream font-montserrat flex flex-col">
                  <Navbar />
                  <main className="flex-grow pb-24">
                    <Suspense fallback={
                      <div className="min-h-[calc(100vh-300px)] flex items-center justify-center">
                        <Loader />
                      </div>
                    }>
                      <Routes>
                        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                        <Route path="/label" element={<PageWrapper><LabelPage /></PageWrapper>} />
                        <Route path="/portfolio" element={<PageWrapper><PortfolioPage /></PageWrapper>} />
                        <Route path="/artiste/:id" element={<PageWrapper><ArtistPage /></PageWrapper>} />
                        <Route path="/academie" element={<PageWrapper><AcademyPage /></PageWrapper>} />
                        <Route path="/academie/:disciplineId/:courseId" element={<PageWrapper><CoursePage /></PageWrapper>} />
                        <Route path="/tutor" element={<PageWrapper><TutorPage /></PageWrapper>} />
                        <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
                        <Route path="/blog/:id" element={<PageWrapper><ArticlePage /></PageWrapper>} />
                        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
                        
                        {/* Routes d'authentification */}
                        <Route path="/connexion" element={<PageWrapper><LoginPage /></PageWrapper>} />
                        <Route path="/inscription" element={<PageWrapper><SignupPage /></PageWrapper>} />
                        <Route path="/mot-de-passe-oublie" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
                        
                        {/* Routes protégées */}
                        <Route path="/profil" element={<ProtectedRoute><PageWrapper><ProfilePage /></PageWrapper></ProtectedRoute>} />
                        <Route path="/paiement/:formuleId" element={<ProtectedRoute><PageWrapper><CheckoutPage /></PageWrapper></ProtectedRoute>} />
                        
                        {/* Routes Admin */}
                        <Route path="/admin/login" element={<PageWrapper><AdminLoginPage /></PageWrapper>} />
                        <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin"><PageWrapper><AdminDashboardPage /></PageWrapper></ProtectedRoute>} />

                        {/* Route légale */}
                        <Route path="/mentions-legales" element={<PageWrapper><MentionsLegalesPage /></PageWrapper>} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                  <MusicPlayer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </InteractionProvider>
            </MusicPlayerProvider>
          </CurrencyProvider>
        </AuthProvider>
      </DataProvider>
    </HashRouter>
  );
};

export default App;
