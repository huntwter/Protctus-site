import { type Waitlist, type InsertWaitlist, waitlist } from "@shared/schema";
import { db } from "../db/index";
import { eq } from "drizzle-orm";

export interface IStorage {
  addToWaitlist(data: InsertWaitlist): Promise<Waitlist>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
}

export class DbStorage implements IStorage {
  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db.insert(waitlist).values(data).returning();
    return entry;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return entry;
  }
}

export const storage = new DbStorage();
