import { useEffect } from 'react';

const SITE_URL = 'https://abhijeet-rawat-portfolio.netlify.app';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

/**
 * useSEO — Lightweight DOM-based SEO hook (no external dependencies).
 * Updates document.title and all critical meta tags on every route change.
 *
 * @param {Object} options
 * @param {string} options.title         - Page title (without site suffix)
 * @param {string} options.description   - Meta description (150–160 chars)
 * @param {string} [options.canonical]   - Canonical URL (defaults to current page)
 * @param {string} [options.ogImage]     - OG image URL (defaults to og-image.jpg)
 * @param {string} [options.ogType]      - OG type (defaults to "website")
 * @param {string} [options.keywords]    - Comma-separated keywords
 */
const useSEO = ({
    title,
    description,
    canonical,
    ogImage = DEFAULT_IMAGE,
    ogType = 'website',
    keywords = 'Full Stack Developer, React Developer, Node.js Developer, MERN Stack, Backend Developer, Software Engineer, Noida, India, JavaScript Developer, REST API, MongoDB',
}) => {
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const SITE_SUFFIX = ' | Abhijeet Rawat';
        const fullTitle = title.includes(SITE_SUFFIX) ? title : `${title}${SITE_SUFFIX}`;

        // ── document.title ──────────────────────────────────────────
        document.title = fullTitle;

        // ── Helper: upsert a <meta> tag ─────────────────────────────
        const setMeta = (selector, attr, value) => {
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement('meta');
                const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
                el.setAttribute(attrName.trim(), attrVal.replace(/"/g, '').trim());
                document.head.appendChild(el);
            }
            el.setAttribute(attr, value);
        };

        // ── Helper: upsert a <link> tag ─────────────────────────────
        const setLink = (rel, href) => {
            let el = document.querySelector(`link[rel="${rel}"]`);
            if (!el) {
                el = document.createElement('link');
                el.setAttribute('rel', rel);
                document.head.appendChild(el);
            }
            el.setAttribute('href', href);
        };

        const canonicalUrl = canonical || `${SITE_URL}${window.location.pathname}`;

        // Standard meta
        setMeta('meta[name="description"]', 'content', description);
        setMeta('meta[name="keywords"]', 'content', keywords);

        // Canonical
        setLink('canonical', canonicalUrl);

        // Open Graph
        setMeta('meta[property="og:title"]', 'content', fullTitle);
        setMeta('meta[property="og:description"]', 'content', description);
        setMeta('meta[property="og:image"]', 'content', ogImage);
        setMeta('meta[property="og:url"]', 'content', canonicalUrl);
        setMeta('meta[property="og:type"]', 'content', ogType);

        // Twitter Card
        setMeta('meta[name="twitter:title"]', 'content', fullTitle);
        setMeta('meta[name="twitter:description"]', 'content', description);
        setMeta('meta[name="twitter:image"]', 'content', ogImage);

    }, [title, description, canonical, ogImage, ogType, keywords]);
};

export default useSEO;
