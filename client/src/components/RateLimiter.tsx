// Rate limiting for game requests
export class GameRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests = 10; // Max requests per minute
  private readonly timeWindow = 60000; // 1 minute in milliseconds

  canMakeRequest(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests outside time window
    const validRequests = userRequests.filter(timestamp => now - timestamp < this.timeWindow);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    
    return true;
  }
  
  getRemainingRequests(userId: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    const validRequests = userRequests.filter(timestamp => now - timestamp < this.timeWindow);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

export const gameRateLimiter = new GameRateLimiter();