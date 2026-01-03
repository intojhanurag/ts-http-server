export interface KeepAliveConfig {
  enabled: boolean;
  timeoutMs: number;
  maxRequests: number;
}

export class KeepAliveManager {
  private requestCount = 0;
  private lastActivity = Date.now();

  constructor(
    private config: KeepAliveConfig = {
      enabled: true,
      timeoutMs: 60000,
      maxRequests: 100
    }
  ) {}

  registerRequest() {
    this.requestCount++;
    this.lastActivity = Date.now();
  }

  shouldKeepAlive(): boolean {
    if (!this.config.enabled) return false;
    if (this.requestCount >= this.config.maxRequests) return false;
    if (Date.now() - this.lastActivity > this.config.timeoutMs) return false;
    return true;
  }
}
