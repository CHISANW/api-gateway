import { Request } from 'express';

const IP_HEADER_CANDIDATES = [
  'x-forwarded-for',
  'x-real-ip',
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
  // x-forwarded-for는 콤마로 구분된 체인일 수 있음 (첫 번째가 실제 클라이언트)
  const candidate = ip.includes(',') ? ip.split(',')[0].trim() : ip.trim();

  // IPv6-mapped IPv4 주소 변환: ::ffff:192.168.1.1 → 192.168.1.1
  if (candidate.startsWith('::ffff:')) {
    return candidate.slice(7);
  }

  return candidate;
}
