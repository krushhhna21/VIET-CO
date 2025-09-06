import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertFacultySchema, insertNewsSchema, insertEventSchema, insertNoteSchema, insertMediaSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for authentication
const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

// Middleware for admin authentication
const authenticateAdmin = (req: Request, res: Response, next: any) => {
  authenticateToken(req, res, () => {
    if ((req as any).user.role !== 'admin') {
      return res.sendStatus(403);
    }
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      res.status(201).json({ 
        message: "User created successfully",
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          role: user.role 
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Faculty routes
  app.get("/api/faculty", async (req: Request, res: Response) => {
    try {
      const facultyList = await storage.getAllFaculty();
      res.json(facultyList);
    } catch (error) {
      console.error("Get faculty error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/faculty", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const facultyData = insertFacultySchema.parse(req.body);
      const faculty = await storage.createFaculty(facultyData);
      res.status(201).json(faculty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create faculty error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/faculty/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const faculty = await storage.updateFaculty(id, updateData);
      
      if (!faculty) {
        return res.status(404).json({ message: "Faculty member not found" });
      }
      
      res.json(faculty);
    } catch (error) {
      console.error("Update faculty error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/faculty/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFaculty(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Faculty member not found" });
      }
      
      res.json({ message: "Faculty member deleted successfully" });
    } catch (error) {
      console.error("Delete faculty error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // News routes
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const { published } = req.query;
      const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;
      const newsList = await storage.getAllNews(publishedFilter);
      res.json(newsList);
    } catch (error) {
      console.error("Get news error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/news/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await storage.getNewsById(id);
      
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Get news by id error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/news", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const newsData = insertNewsSchema.parse(req.body);
      const article = await storage.createNews(newsData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create news error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/news/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const article = await storage.updateNews(id, updateData);
      
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Update news error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/news/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteNews(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "News article not found" });
      }
      
      res.json({ message: "News article deleted successfully" });
    } catch (error) {
      console.error("Delete news error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Event routes
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const { published } = req.query;
      const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;
      const eventsList = await storage.getAllEvents(publishedFilter);
      res.json(eventsList);
    } catch (error) {
      console.error("Get events error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Get event by id error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/events", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const eventData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create event error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/events/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const event = await storage.updateEvent(id, updateData);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/events/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEvent(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Notes routes
  app.get("/api/notes", async (req: Request, res: Response) => {
    try {
      const { published, semester } = req.query;
      
      if (semester) {
        const notesList = await storage.getNotesBySemester(semester as string);
        return res.json(notesList);
      }
      
      const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;
      const notesList = await storage.getAllNotes(publishedFilter);
      res.json(notesList);
    } catch (error) {
      console.error("Get notes error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/notes", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const noteData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(noteData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create note error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/notes/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const note = await storage.updateNote(id, updateData);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json(note);
    } catch (error) {
      console.error("Update note error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/notes/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteNote(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Delete note error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Media routes
  app.get("/api/media", async (req: Request, res: Response) => {
    try {
      const { published, category } = req.query;
      
      if (category) {
        const mediaList = await storage.getMediaByCategory(category as string);
        return res.json(mediaList);
      }
      
      const publishedFilter = published === 'true' ? true : published === 'false' ? false : undefined;
      const mediaList = await storage.getAllMedia(publishedFilter);
      res.json(mediaList);
    } catch (error) {
      console.error("Get media error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/media", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const mediaData = insertMediaSchema.parse(req.body);
      const media = await storage.createMedia(mediaData);
      res.status(201).json(media);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create media error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/media/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const media = await storage.updateMedia(id, updateData);
      
      if (!media) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.json(media);
    } catch (error) {
      console.error("Update media error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/media/:id", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMedia(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Media not found" });
      }
      
      res.json({ message: "Media deleted successfully" });
    } catch (error) {
      console.error("Delete media error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contact routes
  app.get("/api/contacts", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Get contacts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/contacts", async (req: Request, res: Response) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json({ message: "Message sent successfully", contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create contact error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/contacts/:id/status", authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const contact = await storage.updateContactStatus(id, status);
      
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      
      res.json(contact);
    } catch (error) {
      console.error("Update contact status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
