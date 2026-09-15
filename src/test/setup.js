import '@testing-library/jest-dom';

// Polyfill or mock matchMedia and element animate if missing in happy-dom
if (typeof window !== 'undefined') {
    if (!window.matchMedia) {
        window.matchMedia = (query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        });
    }

    // Silence happy-dom unhandled animation rejection during unmount
    if (window.Element && window.Element.prototype) {
        const originalAnimate = window.Element.prototype.animate;
        window.Element.prototype.animate = function (...args) {
            const anim = originalAnimate ? originalAnimate.apply(this, args) : {};
            return {
                finished: Promise.resolve(),
                cancel: () => {},
                play: () => {},
                pause: () => {},
                reverse: () => {},
                finish: () => {},
                currentTime: 0,
                playbackRate: 1,
                ...anim,
            };
        };
    }

    if (!window.alert) {
        window.alert = () => {};
    }
}
