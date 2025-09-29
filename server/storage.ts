import { 
  type User, 
  type InsertUser,
  type Faculty,
  type InsertFaculty,
  type News,
  type InsertNews,
  type Event,
  type InsertEvent,
  type Note,
  type InsertNote,
  type Media,
  type InsertMedia,
  type Contact,
  type InsertContact,
  type HeroSlide,
  type InsertHeroSlide,
  users,
  faculty,
  news,
  events,
  notes,
  media,
  contacts,
  heroSlides
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like } from "drizzle-orm";

export interface IStorage {
  // Hero Slide methods
  getAllHeroSlides(): Promise<HeroSlide[]>;
  getHeroSlideById(id: string): Promise<HeroSlide | undefined>;
  createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide>;
  updateHeroSlide(id: string, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined>;
  deleteHeroSlide(id: string): Promise<boolean>;
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Faculty methods
  getAllFaculty(): Promise<Faculty[]>;
  getFacultyById(id: string): Promise<Faculty | undefined>;
  createFaculty(faculty: InsertFaculty): Promise<Faculty>;
  updateFaculty(id: string, faculty: Partial<InsertFaculty>): Promise<Faculty | undefined>;
  deleteFaculty(id: string): Promise<boolean>;
  
  // News methods
  getAllNews(published?: boolean): Promise<News[]>;
  getNewsById(id: string): Promise<News | undefined>;
  createNews(article: InsertNews): Promise<News>;
  updateNews(id: string, article: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: string): Promise<boolean>;
  
  // Event methods
  getAllEvents(published?: boolean): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Note methods
  getAllNotes(published?: boolean): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | undefined>;
  getNotesBySemester(semester: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;
  
  // Media methods
  getAllMedia(published?: boolean): Promise<Media[]>;
  getMediaById(id: string): Promise<Media | undefined>;
  getMediaByCategory(category: string): Promise<Media[]>;
  createMedia(media: InsertMedia): Promise<Media>;
  updateMedia(id: string, media: Partial<InsertMedia>): Promise<Media | undefined>;
  deleteMedia(id: string): Promise<boolean>;
  
  // Contact methods
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: string, status: string): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Hero Slide methods
  async getAllHeroSlides(): Promise<HeroSlide[]> {
    return await db.select().from(heroSlides).orderBy(heroSlides.order);
  }

  async getHeroSlideById(id: string): Promise<HeroSlide | undefined> {
    const [slide] = await db.select().from(heroSlides).where(eq(heroSlides.id, id));
    return slide || undefined;
  }

  async createHeroSlide(slide: InsertHeroSlide): Promise<HeroSlide> {
    const [created] = await db.insert(heroSlides).values(slide).returning();
    return created;
  }

  async updateHeroSlide(id: string, slide: Partial<InsertHeroSlide>): Promise<HeroSlide | undefined> {
    const [updated] = await db.update(heroSlides).set(slide).where(eq(heroSlides.id, id)).returning();
    return updated || undefined;
  }

  async deleteHeroSlide(id: string): Promise<boolean> {
    const result = await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Faculty methods
  async getAllFaculty(): Promise<Faculty[]> {
    return await db.select().from(faculty).orderBy(desc(faculty.createdAt));
  }

  async getFacultyById(id: string): Promise<Faculty | undefined> {
    const [facultyMember] = await db.select().from(faculty).where(eq(faculty.id, id));
    return facultyMember || undefined;
  }

  async createFaculty(insertFaculty: InsertFaculty): Promise<Faculty> {
    const [facultyMember] = await db.insert(faculty).values(insertFaculty).returning();
    return facultyMember;
  }

  async updateFaculty(id: string, updateData: Partial<InsertFaculty>): Promise<Faculty | undefined> {
    const [facultyMember] = await db.update(faculty).set(updateData).where(eq(faculty.id, id)).returning();
    return facultyMember || undefined;
  }

  async deleteFaculty(id: string): Promise<boolean> {
    const result = await db.delete(faculty).where(eq(faculty.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // News methods
  async getAllNews(published?: boolean): Promise<News[]> {
    const conditions = published !== undefined ? eq(news.published, published) : undefined;
    return await db.select().from(news)
      .where(conditions)
      .orderBy(desc(news.createdAt));
  }

  async getNewsById(id: string): Promise<News | undefined> {
    const [article] = await db.select().from(news).where(eq(news.id, id));
    return article || undefined;
  }

  async createNews(insertNews: InsertNews): Promise<News> {
    const [article] = await db.insert(news).values(insertNews).returning();
    return article;
  }

  async updateNews(id: string, updateData: Partial<InsertNews>): Promise<News | undefined> {
    const [article] = await db.update(news).set(updateData).where(eq(news.id, id)).returning();
    return article || undefined;
  }

  async deleteNews(id: string): Promise<boolean> {
    const result = await db.delete(news).where(eq(news.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Event methods
  async getAllEvents(published?: boolean): Promise<Event[]> {
    const conditions = published !== undefined ? eq(events.published, published) : undefined;
    return await db.select().from(events)
      .where(conditions)
      .orderBy(desc(events.eventDate));
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  async updateEvent(id: string, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const [event] = await db.update(events).set(updateData).where(eq(events.id, id)).returning();
    return event || undefined;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Note methods
  async getAllNotes(published?: boolean): Promise<Note[]> {
    const conditions = published !== undefined ? eq(notes.published, published) : undefined;
    return await db.select().from(notes)
      .where(conditions)
      .orderBy(desc(notes.createdAt));
  }

  async getNoteById(id: string): Promise<Note | undefined> {
    const [note] = await db.select().from(notes).where(eq(notes.id, id));
    return note || undefined;
  }

  async getNotesBySemester(semester: string): Promise<Note[]> {
    return await db.select().from(notes)
      .where(and(eq(notes.semester, semester), eq(notes.published, true)))
      .orderBy(desc(notes.createdAt));
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const [note] = await db.insert(notes).values(insertNote).returning();
    return note;
  }

  async updateNote(id: string, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const [note] = await db.update(notes).set(updateData).where(eq(notes.id, id)).returning();
    return note || undefined;
  }

  async deleteNote(id: string): Promise<boolean> {
    const result = await db.delete(notes).where(eq(notes.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Media methods
  async getAllMedia(published?: boolean): Promise<Media[]> {
    const conditions = published !== undefined ? eq(media.published, published) : undefined;
    return await db.select().from(media)
      .where(conditions)
      .orderBy(desc(media.createdAt));
  }

  async getMediaById(id: string): Promise<Media | undefined> {
    const [mediaItem] = await db.select().from(media).where(eq(media.id, id));
    return mediaItem || undefined;
  }

  async getMediaByCategory(category: string): Promise<Media[]> {
    return await db.select().from(media)
      .where(and(eq(media.category, category), eq(media.published, true)))
      .orderBy(desc(media.createdAt));
  }

  async createMedia(insertMedia: InsertMedia): Promise<Media> {
    const [mediaItem] = await db.insert(media).values(insertMedia).returning();
    return mediaItem;
  }

  async updateMedia(id: string, updateData: Partial<InsertMedia>): Promise<Media | undefined> {
    const [mediaItem] = await db.update(media).set(updateData).where(eq(media.id, id)).returning();
    return mediaItem || undefined;
  }

  async deleteMedia(id: string): Promise<boolean> {
    const result = await db.delete(media).where(eq(media.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContactById(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const [contact] = await db.update(contacts).set({ status }).where(eq(contacts.id, id)).returning();
    return contact || undefined;
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
