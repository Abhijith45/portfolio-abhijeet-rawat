import { useEffect, useRef } from 'react';

/**
 * Custom hook to subscribe active React components to cache invalidation events.
 * Listens for 'portfolio-cache-invalidated' events for the given scope (or 'all').
 * When triggered, invokes callback to re-fetch/revalidate without requiring page reload.
 *
 * @param {string} scope - Resource scope ('projects' | 'technologies' | 'experiences' | 'profile' | 'reviews' | 'all')
 * @param {Function} onInvalidate - Callback to execute when cache is invalidated
 */
export const useCacheSubscription = (scope, onInvalidate) => {
    const callbackRef = useRef(onInvalidate);

    useEffect(() => {
        callbackRef.current = onInvalidate;
    }, [onInvalidate]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleInvalidation = (event) => {
            const eventScope = event.detail?.scope;
            if (!eventScope || eventScope === 'all' || eventScope === scope) {
                if (typeof callbackRef.current === 'function') {
                    callbackRef.current(event.detail);
                }
            }
        };

        window.addEventListener('portfolio-cache-invalidated', handleInvalidation);
        return () => {
            window.removeEventListener('portfolio-cache-invalidated', handleInvalidation);
        };
    }, [scope]);
};

export default useCacheSubscription;
