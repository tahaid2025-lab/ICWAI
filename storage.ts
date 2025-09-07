import { type Creation, type InsertCreation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCreation(id: string): Promise<Creation | undefined>;
  getAllCreations(): Promise<Creation[]>;
  getCreationsByType(type: string): Promise<Creation[]>;
  createCreation(creation: InsertCreation): Promise<Creation>;
  deleteCreation(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private creations: Map<string, Creation>;

  constructor() {
    this.creations = new Map();
  }

  async getCreation(id: string): Promise<Creation | undefined> {
    return this.creations.get(id);
  }

  async getAllCreations(): Promise<Creation[]> {
    return Array.from(this.creations.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCreationsByType(type: string): Promise<Creation[]> {
    return Array.from(this.creations.values())
      .filter((creation) => creation.type === type)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createCreation(insertCreation: InsertCreation): Promise<Creation> {
    const id = randomUUID();
    const creation: Creation = {
      ...insertCreation,
      id,
      createdAt: new Date(),
    };
    this.creations.set(id, creation);
    return creation;
  }

  async deleteCreation(id: string): Promise<boolean> {
    return this.creations.delete(id);
  }
}

export const storage = new MemStorage();
