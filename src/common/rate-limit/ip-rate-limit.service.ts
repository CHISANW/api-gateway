import { Injectable } from '@nestjs/common';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

@Injectable()
export class IpRateLimitService {
  private readonly limit = 60;
  private readonly windowMs = 60_000;
  private readonly entries = new Map<string, RateLimitEntry>();
  private hitCount = 0;

  consume(ip: string, now = Date.now()): RateLimitResult {
    this.hitCount += 1;
    this.cleanupExpiredEntries(now);

    const key = ip || 'unknown';
    const existing = this.entries.get(key);

    if (!existing || existing.resetAt <= now) {
      const resetAt = now + this.windowMs;
      this.entries.set(key, { count: 1, resetAt });

      return {
        allowed: true,
        limit: this.limit,
        remaining: this.limit - 1,
        resetAt,
        retryAfterSeconds: 0,
      };
    }

    if (existing.count >= this.limit) {
      return {
        allowed: false,
        limit: this.limit,
        remaining: 0,
        resetAt: existing.resetAt,
        retryAfterSeconds: this.toRetryAfterSeconds(existing.resetAt, now),
      };
    }

    existing.count += 1;
    this.entries.set(key, existing);

    return {
      allowed: true,
      limit: this.limit,
      remaining: this.limit - existing.count,
      resetAt: existing.resetAt,
      retryAfterSeconds: 0,
    };
  }

  private cleanupExpiredEntries(now: number): void {
    // Reduce unbounded memory growth from one-off IPs.
    if (this.hitCount % 1_000 !== 0) {
      return;
    }

    for (const [key, value] of this.entries.entries()) {
      if (value.resetAt <= now) {
        this.entries.delete(key);
      }
    }
  }

  private toRetryAfterSeconds(resetAt: number, now: number): number {
    return Math.max(1, Math.ceil((resetAt - now) / 1_000));
  }
}
