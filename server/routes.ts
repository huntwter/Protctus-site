import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validation = insertWaitlistSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          error: fromZodError(validation.error).toString(),
        });
      }

      const existing = await storage.getWaitlistByEmail(validation.data.email);
      
      if (existing) {
        return res.status(409).json({
          error: "This email is already on the waitlist",
        });
      }

      const entry = await storage.addToWaitlist(validation.data);
      
      return res.status(201).json(entry);
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      return res.status(500).json({
        error: "Failed to join waitlist. Please try again.",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
