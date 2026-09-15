const dns = require('dns').promises;

/**
 * Checks whether an IPv4 address belongs to a private, loopback, link-local (cloud metadata),
 * or non-routable range.
 * @param {string} ip - IPv4 string (e.g. '192.168.1.1')
 * @returns {boolean} - True if IP is private or restricted, false if public
 */
function isPrivateIPv4(ip) {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(isNaN)) {
        return true; // Malformed IPv4 considered restricted
    }

    const [a, b, c, d] = parts;

    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;

    // 127.0.0.0/8 (Loopback addresses)
    if (a === 127) return true;

    // 10.0.0.0/8 (RFC 1918 Private)
    if (a === 10) return true;

    // 172.16.0.0/12 (RFC 1918 Private: 172.16.0.0 - 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.168.0.0/16 (RFC 1918 Private)
    if (a === 192 && b === 168) return true;

    // 169.254.0.0/16 (Link-Local & Cloud Metadata e.g., AWS 169.254.169.254)
    if (a === 169 && b === 254) return true;

    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;

    // 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24 (Documentation / TEST-NET)
    if (a === 192 && b === 0 && c === 2) return true;
    if (a === 198 && b === 51 && c === 100) return true;
    if (a === 203 && b === 0 && c === 113) return true;

    // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved / Future Use / Broadcast 255.255.255.255)
    if (a >= 224) return true;

    return false;
}

/**
 * Checks whether an IPv6 address is loopback, unique local, or link-local.
 * @param {string} ip - IPv6 string
 * @returns {boolean}
 */
function isPrivateIPv6(ip) {
    const normalized = ip.toLowerCase();
    // ::1 loopback
    if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1' || normalized === '::') return true;
    // fc00::/7 (Unique Local)
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
    // fe80::/10 (Link-Local)
    if (normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) return true;
    // IPv4-mapped IPv6 (::ffff:127.0.0.1)
    if (normalized.startsWith('::ffff:')) {
        const v4Part = normalized.replace('::ffff:', '');
        return isPrivateIPv4(v4Part);
    }
    return false;
}

/**
 * Validates a target URL against SSRF threats.
 * Throws an Error with a user-friendly message if the URL is insecure or attempts to target private subnets.
 * @param {string} targetUrl
 * @returns {Promise<{ parsedUrl: URL, ip: string }>}
 */
async function validateSafeUrl(targetUrl) {
    if (!targetUrl || typeof targetUrl !== 'string') {
        throw new Error('URL is required');
    }

    const trimmed = targetUrl.trim();
    let parsed;
    try {
        parsed = new URL(trimmed);
    } catch {
        throw new Error('Invalid URL format');
    }

    // Protocol check: Only HTTP and HTTPS allowed
    if (!['http:', 'https:'].includes(parsed.protocol.toLowerCase())) {
        throw new Error('URL must use HTTP or HTTPS protocol');
    }

    const hostname = parsed.hostname;
    if (!hostname || hostname.toLowerCase() === 'localhost') {
        throw new Error('Access to localhost or internal network addresses is prohibited');
    }

    // Attempt resolving IP addresses for the hostname
    let addresses = [];
    try {
        // Resolve both IPv4 and IPv6
        addresses = await dns.lookup(hostname, { all: true });
    } catch (dnsErr) {
        if (dnsErr.code === 'ENOTFOUND') {
            throw new Error('Domain name could not be resolved (DNS failure)');
        }
        throw new Error('DNS lookup failed: ' + dnsErr.message);
    }

    if (!addresses || addresses.length === 0) {
        throw new Error('No IP addresses found for hostname');
    }

    for (const record of addresses) {
        const { address, family } = record;
        if (family === 4 && isPrivateIPv4(address)) {
            throw new Error('Access to private or internal network addresses is prohibited');
        }
        if (family === 6 && isPrivateIPv6(address)) {
            throw new Error('Access to private or internal IPv6 addresses is prohibited');
        }
    }

    return { parsedUrl: parsed, ip: addresses[0].address };
}

module.exports = {
    validateSafeUrl,
    isPrivateIPv4,
    isPrivateIPv6,
};
