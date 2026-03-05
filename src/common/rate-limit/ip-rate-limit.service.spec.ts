import { IpRateLimitService } from './ip-rate-limit.service';

describe('IpRateLimitService', () => {
  let service: IpRateLimitService;

  beforeEach(() => {
    service = new IpRateLimitService();
  });

  it('allows up to 60 requests per minute for same IP and blocks 61st', () => {
    const ip = '203.0.113.10';
    const now = 1_700_000_000_000;

    for (let i = 0; i < 60; i += 1) {
      const result = service.consume(ip, now);
      expect(result.allowed).toBe(true);
    }

    const blocked = service.consume(ip, now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets quota after 1 minute', () => {
    const ip = '203.0.113.11';
    const now = 1_700_000_000_000;

    for (let i = 0; i < 60; i += 1) {
      service.consume(ip, now);
    }

    const afterWindow = service.consume(ip, now + 60_000);
    expect(afterWindow.allowed).toBe(true);
    expect(afterWindow.remaining).toBe(59);
  });

  it('tracks quota independently by IP', () => {
    const now = 1_700_000_000_000;

    for (let i = 0; i < 60; i += 1) {
      service.consume('198.51.100.1', now);
    }

    const ip1Blocked = service.consume('198.51.100.1', now);
    const ip2Allowed = service.consume('198.51.100.2', now);

    expect(ip1Blocked.allowed).toBe(false);
    expect(ip2Allowed.allowed).toBe(true);
    expect(ip2Allowed.remaining).toBe(59);
  });
});
