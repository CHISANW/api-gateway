import { Request } from 'express';

const IP_HEADER_CANDIDATES = [
  'x-forwarded-for',
  'proxy-client-ip',
  'wl-proxy-client-ip',
  'http_client_ip',
  'http_x_forwarded_for',
] as const;

export function getClientIp(request: Request): string {
  for (const header of IP_HEADER_CANDIDATES) {
    const raw = request.headers[header];

    if (typeof raw === 'string' && raw.trim() && raw.toLowerCase() !== 'unknown') {
      return normalizeIp(raw);
    }

    if (Array.isArray(raw) && raw.length > 0) {
      const candidate = raw[0];
      if (candidate && candidate.toLowerCase() !== 'unknown') {
        return normalizeIp(candidate);
      }
    }
  }

  if (request.socket.remoteAddress) {
    return normalizeIp(request.socket.remoteAddress);
  }

  return 'unknown';
}

function normalizeIp(ip: string): string {
  if (ip.includes(',')) {
    return ip.split(',')[0].trim();
  }

  return ip.trim();
}
