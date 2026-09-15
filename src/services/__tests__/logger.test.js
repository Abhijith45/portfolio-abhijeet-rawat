import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logErrorToWebhook, frontendLogger } from '../logger';

describe('Frontend Logger & Webhook Dispatcher', () => {
    let originalFetch;
    let originalSendBeacon;
    let fetchMock;
    let sendBeaconMock;

    beforeEach(() => {
        frontendLogger.clearDeduplication();

        originalFetch = globalThis.fetch;
        originalSendBeacon = navigator.sendBeacon;

        fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ status: 'success' }),
        });
        globalThis.fetch = fetchMock;

        sendBeaconMock = vi.fn().mockReturnValue(true);
        Object.defineProperty(navigator, 'sendBeacon', {
            value: sendBeaconMock,
            writable: true,
            configurable: true,
        });
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        if (originalSendBeacon !== undefined) {
            Object.defineProperty(navigator, 'sendBeacon', {
                value: originalSendBeacon,
                writable: true,
                configurable: true,
            });
        }
        vi.restoreAllMocks();
    });

    it('formats payload with required contract properties using sendBeacon', () => {
        logErrorToWebhook({
            severity: 'ERROR',
            component: 'TestComponent',
            stack: 'Error: Test error\n  at testFunction',
            statusCode: 500,
            message: 'Critical rendering error simulation',
        });

        expect(sendBeaconMock).toHaveBeenCalledTimes(1);
        const [targetUrl, blob] = sendBeaconMock.mock.calls[0];

        expect(targetUrl).toContain('script.google.com/macros/s/');
        expect(blob).toBeInstanceOf(Blob);
    });

    it('falls back to fetch when sendBeacon is not available or returns false', async () => {
        // Mock sendBeacon returning false (e.g. queue full or unsupported)
        sendBeaconMock.mockReturnValue(false);

        logErrorToWebhook({
            severity: 'ERROR',
            component: 'FetchFallbackComponent',
            stack: 'Custom stack trace',
            statusCode: 503,
            message: 'Service unavailable error',
        });

        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [targetUrl, options] = fetchMock.mock.calls[0];

        expect(targetUrl).toContain('script.google.com/macros/s/');
        expect(options.method).toBe('POST');
        expect(options.headers['Content-Type']).toBe('application/json');

        const parsedBody = JSON.parse(options.body);
        expect(parsedBody).toMatchObject({
            token: expect.any(String),
            severity: 'ERROR',
            component: 'FetchFallbackComponent',
            stack: 'Custom stack trace',
            statusCode: 503,
            message: 'Service unavailable error',
        });
        expect(parsedBody).toHaveProperty('timestamp');
        expect(parsedBody).toHaveProperty('environment');
    });

    it('deduplicates identical errors within the cooldown window', () => {
        logErrorToWebhook({
            severity: 'ERROR',
            component: 'RepeatedComponent',
            message: 'Repeated render loop crash',
        });

        logErrorToWebhook({
            severity: 'ERROR',
            component: 'RepeatedComponent',
            message: 'Repeated render loop crash',
        });

        // Should only have called sendBeacon once due to deduplication
        expect(sendBeaconMock).toHaveBeenCalledTimes(1);

        // Forcing should bypass deduplication
        logErrorToWebhook({
            severity: 'ERROR',
            component: 'RepeatedComponent',
            message: 'Repeated render loop crash',
            force: true,
        });

        expect(sendBeaconMock).toHaveBeenCalledTimes(2);
    });

    it('safely catches network errors without throwing or blocking UI execution', () => {
        sendBeaconMock.mockReturnValue(false);
        fetchMock.mockRejectedValue(new Error('Network offline'));

        expect(() => {
            frontendLogger.error('Failed network call log', {
                component: 'OfflineTest',
                statusCode: 0,
            });
        }).not.toThrow();
    });

    it('frontendLogger helper methods (error, warn, info) dispatch properly', () => {
        frontendLogger.warn('Warning log message', {
            component: 'WarnComponent',
            statusCode: 400,
        });

        expect(sendBeaconMock).toHaveBeenCalledTimes(1);

        frontendLogger.info('Informational log message', {
            component: 'InfoComponent',
            statusCode: 200,
        });

        expect(sendBeaconMock).toHaveBeenCalledTimes(2);
    });
});
