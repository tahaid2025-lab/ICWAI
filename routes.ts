import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateImage } from "./services/gemini";
import { insertCreationSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all creations
  app.get("/api/creations", async (_req, res) => {
    try {
      const creations = await storage.getAllCreations();
      res.json(creations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creations" });
    }
  });

  // Get creations by type
  app.get("/api/creations/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const creations = await storage.getCreationsByType(type);
      res.json(creations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch creations" });
    }
  });

  // Generate drawing assistant image
  app.post("/api/generate/drawing", async (req, res) => {
    try {
      const { prompt, style, type: drawingType } = req.body;
      
      let fullPrompt = "";
      if (drawingType === "text-to-image") {
        fullPrompt = `Create a ${style} style artwork: ${prompt}`;
      } else if (drawingType === "style-transfer") {
        fullPrompt = `Transform this image in ${style} artistic style: ${prompt}`;
      }

      const imageId = randomUUID();
      const imagePath = path.join(process.cwd(), "generated_images", `${imageId}.png`);
      
      // Ensure directory exists
      const dir = path.dirname(imagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await generateImage(fullPrompt, imagePath);

      const creation = await storage.createCreation({
        type: "drawing",
        title: `${style} Artwork`,
        prompt: prompt,
        imageUrl: `/api/images/${imageId}.png`,
        metadata: { style, drawingType }
      });

      res.json(creation);
    } catch (error) {
      console.error("Drawing generation error:", error);
      res.status(500).json({ message: "Failed to generate drawing" });
    }
  });

  // Generate LEGO creation
  app.post("/api/generate/lego", async (req, res) => {
    try {
      const { prompt, colors, size, complexity, theme, features } = req.body;
      
      const colorList = colors.join(", ");
      const featureList = features.join(", ");
      const fullPrompt = `Create a detailed LEGO design: ${prompt}. Use primarily ${colorList} colors. Size: ${size}. Complexity: ${complexity}. Theme: ${theme}. Special features: ${featureList}. Show the LEGO creation as a realistic 3D rendered model with proper LEGO brick textures and connections.`;

      const imageId = randomUUID();
      const imagePath = path.join(process.cwd(), "generated_images", `${imageId}.png`);
      
      const dir = path.dirname(imagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await generateImage(fullPrompt, imagePath);

      const creation = await storage.createCreation({
        type: "lego",
        title: `${theme} LEGO Creation`,
        prompt: prompt,
        imageUrl: `/api/images/${imageId}.png`,
        metadata: { colors, size, complexity, theme, features }
      });

      res.json(creation);
    } catch (error) {
      console.error("LEGO generation error:", error);
      res.status(500).json({ message: "Failed to generate LEGO creation" });
    }
  });

  // Generate playground artwork
  app.post("/api/generate/playground", async (req, res) => {
    try {
      const { emojis, background, style } = req.body;
      
      const emojiList = emojis.join(" ");
      const fullPrompt = `Create a whimsical, magical artwork featuring these emojis: ${emojiList}. Background style: ${background}. Art style: ${style}. Make it playful, colorful, and imaginative like Apple's Playground style with smooth gradients and dreamy effects.`;

      const imageId = randomUUID();
      const imagePath = path.join(process.cwd(), "generated_images", `${imageId}.png`);
      
      const dir = path.dirname(imagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await generateImage(fullPrompt, imagePath);

      const creation = await storage.createCreation({
        type: "playground",
        title: "Playground Artwork",
        prompt: `Emojis: ${emojiList}`,
        imageUrl: `/api/images/${imageId}.png`,
        metadata: { emojis, background, style }
      });

      res.json(creation);
    } catch (error) {
      console.error("Playground generation error:", error);
      res.status(500).json({ message: "Failed to generate playground artwork" });
    }
  });

  // Delete creation
  app.delete("/api/creations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCreation(id);
      
      if (success) {
        // Also delete the image file
        const creation = await storage.getCreation(id);
        if (creation?.imageUrl) {
          const imagePath = path.join(process.cwd(), "generated_images", path.basename(creation.imageUrl));
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Creation not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete creation" });
    }
  });

  // Serve generated images
  app.get("/api/images/:filename", (req, res) => {
    const { filename } = req.params;
    const imagePath = path.join(process.cwd(), "generated_images", filename);
    
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ message: "Image not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
