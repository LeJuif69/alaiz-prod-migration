import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type OgType = 'website' | 'article' | 'profile';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string; // Appended to default keywords
  ogImage?: string;
  ogType?: OgType;
}

const BASE_URL = "https://www.alaizopays.art";
const DEFAULT_TITLE = 'A Laiz Prod - Tradition. Innovation. Émotion.';
const DEFAULT_DESCRIPTION = "A Laiz Prod, label musical fondé par Hervé Nanfang à Yaoundé. Découvrez nos artistes, prestations, formations musicales (piano, chant, MAO) et notre blog.";
const DEFAULT_KEYWORDS = "A Laiz Prod, Hervé Nanfang, label musical, Cameroun, Yaoundé, gospel, jazz, musique africaine, cours de piano, cours de chant";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=630&fit=crop&q=80";
const OG_LOCALE = 'fr_FR';

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, keywords, ogImage, ogType }) => {
  const location = useLocation();

  useEffect(() => {
     // Determine OpenGraph type based on location if not explicitly provided
    let determinedOgType: OgType = 'website';
    if (ogType) {
        determinedOgType = ogType;
    } else {
        if (location.pathname.startsWith('/blog/')) {
            determinedOgType = 'article';
        } else if (location.pathname.startsWith('/artiste/')) {
            determinedOgType = 'profile';
        }
    }

    // Construct final values, falling back to defaults
    const finalTitle = title ? `${title} | A Laiz Prod` : DEFAULT_TITLE;
    const finalDescription = description || DEFAULT_DESCRIPTION;
    const finalKeywords = keywords ? `${DEFAULT_KEYWORDS}, ${keywords}` : DEFAULT_KEYWORDS;
    const finalOgImage = ogImage || DEFAULT_OG_IMAGE;
    const finalOgType = determinedOgType;
    const currentUrl = `${BASE_URL}${location.pathname}`;

    // Helper to update a meta tag by its selector
    const updateMetaTag = (selector: string, content: string) => {
      const element = document.querySelector(selector) as HTMLMetaElement | null;
      if (element) {
        element.content = content;
      }
    };
    
    // Update Title
    document.title = finalTitle;

    // Update Meta tags
    updateMetaTag('meta[name="description"]', finalDescription);
    updateMetaTag('meta[name="keywords"]', finalKeywords);

    // Update OpenGraph tags
    updateMetaTag('meta[property="og:title"]', finalTitle);
    updateMetaTag('meta[property="og:description"]', finalDescription);
    updateMetaTag('meta[property="og:image"]', finalOgImage);
    updateMetaTag('meta[property="og:url"]', currentUrl);
    updateMetaTag('meta[property="og:type"]', finalOgType);
    updateMetaTag('meta[property="og:locale"]', OG_LOCALE);

  }, [title, description, keywords, ogImage, ogType, location]);

  return null;
};

export default MetaTags;