import { type User, type InsertUser, type ServiceStatus, type InsertServiceStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service status methods
  createServiceStatus(status: InsertServiceStatus): Promise<ServiceStatus>;
  getLatestServiceStatuses(): Promise<ServiceStatus[]>;
  getServiceHistory(serviceUrl: string, hoursAgo: number): Promise<ServiceStatus[]>;
  getAllServicesHistory(hoursAgo: number): Promise<ServiceStatus[]>;
  calculateServiceUptime(serviceUrl: string, hoursAgo: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private serviceStatuses: ServiceStatus[];

  constructor() {
    this.users = new Map();
    this.serviceStatuses = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createServiceStatus(insertStatus: InsertServiceStatus): Promise<ServiceStatus> {
    const id = randomUUID();
    const status: ServiceStatus = {
      ...insertStatus,
      id,
      responseTime: insertStatus.responseTime ?? null,
      uptime: insertStatus.uptime ?? null,
      checkedAt: new Date(),
    };
    this.serviceStatuses.push(status);
    
    // Keep only last 24 hours of data to prevent memory issues
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.serviceStatuses = this.serviceStatuses.filter(
      s => s.checkedAt >= oneDayAgo
    );
    
    return status;
  }

  async getLatestServiceStatuses(): Promise<ServiceStatus[]> {
    const latestByService = new Map<string, ServiceStatus>();
    
    // Get the most recent status for each service
    for (const status of this.serviceStatuses) {
      const existing = latestByService.get(status.serviceUrl);
      if (!existing || status.checkedAt > existing.checkedAt) {
        latestByService.set(status.serviceUrl, status);
      }
    }
    
    return Array.from(latestByService.values());
  }

  async getServiceHistory(serviceUrl: string, hoursAgo: number): Promise<ServiceStatus[]> {
    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    return this.serviceStatuses
      .filter(s => s.serviceUrl === serviceUrl && s.checkedAt >= cutoffTime)
      .sort((a, b) => a.checkedAt.getTime() - b.checkedAt.getTime());
  }

  async getAllServicesHistory(hoursAgo: number): Promise<ServiceStatus[]> {
    const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    return this.serviceStatuses
      .filter(s => s.checkedAt >= cutoffTime)
      .sort((a, b) => a.checkedAt.getTime() - b.checkedAt.getTime());
  }

  async calculateServiceUptime(serviceUrl: string, hoursAgo: number): Promise<number> {
    const history = await this.getServiceHistory(serviceUrl, hoursAgo);
    if (history.length === 0) return 0; // Return 0 if no history yet
    
    const onlineCount = history.filter(s => s.status === "online" || s.status === "degraded").length;
    return Math.round((onlineCount / history.length) * 100 * 10) / 10; // Round to 1 decimal
  }
}


export const storage = new MemStorage();
