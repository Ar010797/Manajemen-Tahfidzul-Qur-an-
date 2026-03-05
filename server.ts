import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

const JWT_SECRET = "tahfidz-secret-2026";

let db: Database.Database;

try {
  db = new Database("tahfidz.db");
  db.pragma('foreign_keys = ON');
  // Initialize Database
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      security_question TEXT,
      security_answer TEXT
    );

    CREATE TABLE IF NOT EXISTS institution (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT,
      address TEXT,
      principal_name TEXT,
      coordinator_name TEXT,
      halaqoh_teacher_name TEXT,
      academic_year TEXT DEFAULT '2025/2026',
      logo TEXT,
      watermark TEXT,
      principal_signature TEXT,
      coordinator_signature TEXT
    );

    CREATE TABLE IF NOT EXISTS halaqoh (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      halaqoh_id INTEGER,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (halaqoh_id) REFERENCES halaqoh(id)
    );

    CREATE TABLE IF NOT EXISTS daily_deposits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      type TEXT, -- 'hafalan', 'ummi', 'tilawah'
      date TEXT,
      details TEXT, -- JSON string
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exams_ummi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      level INTEGER,
      scores TEXT, -- JSON string
      date TEXT,
      semester TEXT DEFAULT 'Ganjil',
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exams_hafalan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      surahs TEXT, -- JSON string
      note TEXT,
      date TEXT,
      days_progress TEXT, -- JSON string for 6-day progress
      status TEXT DEFAULT 'ongoing', -- 'ongoing', 'completed'
      semester TEXT DEFAULT 'Ganjil',
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS monthly_recaps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER,
      month TEXT, -- YYYY-MM
      total_hafalan TEXT,
      notes TEXT,
      UNIQUE(student_id, month),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );

    INSERT OR IGNORE INTO institution (id, name) VALUES (1, 'Sekolah Islam Miftahussalam');
  `);

  // Migration: Add order_index to students if it doesn't exist
  const tableInfo = db.prepare("PRAGMA table_info(students)").all();
  const hasOrderIndex = tableInfo.some((col: any) => col.name === 'order_index');
  if (!hasOrderIndex) {
    db.exec("ALTER TABLE students ADD COLUMN order_index INTEGER DEFAULT 0");
  }

  // Migration: Add signature columns to institution if they don't exist
  const instTableInfo = db.prepare("PRAGMA table_info(institution)").all();
  const hasPrincipalSig = instTableInfo.some((col: any) => col.name === 'principal_signature');
  if (!hasPrincipalSig) {
    db.exec("ALTER TABLE institution ADD COLUMN principal_signature TEXT");
    db.exec("ALTER TABLE institution ADD COLUMN coordinator_signature TEXT");
  }

  const hasHalaqohTeacher = instTableInfo.some((col: any) => col.name === 'halaqoh_teacher_name');
  if (!hasHalaqohTeacher) {
    db.exec("ALTER TABLE institution ADD COLUMN halaqoh_teacher_name TEXT");
  }

  const hasAcademicYear = instTableInfo.some((col: any) => col.name === 'academic_year');
  if (!hasAcademicYear) {
    db.exec("ALTER TABLE institution ADD COLUMN academic_year TEXT DEFAULT '2025/2026'");
  }

  // Migration: Add semester to exams if they don't exist
  const ummiTableInfo = db.prepare("PRAGMA table_info(exams_ummi)").all();
  if (!ummiTableInfo.some((col: any) => col.name === 'semester')) {
    db.exec("ALTER TABLE exams_ummi ADD COLUMN semester TEXT DEFAULT 'Ganjil'");
  }
  const hafalanTableInfo = db.prepare("PRAGMA table_info(exams_hafalan)").all();
  if (!hafalanTableInfo.some((col: any) => col.name === 'semester')) {
    db.exec("ALTER TABLE exams_hafalan ADD COLUMN semester TEXT DEFAULT 'Ganjil'");
  }
} catch (err) {
  console.error("Database initialization error:", err);
  process.exit(1);
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketServer(httpServer, {
    cors: { origin: "*" }
  });

  app.use(express.json({ limit: '50mb' }));

  // Socket.io connection
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("join-room", (room) => {
      socket.join(room);
    });
  });

  // Middleware to broadcast changes
  const broadcast = (event: string, data: any) => {
    io.emit(event, data);
  };

  // Request Logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Global Error Handler for JSON parsing and other middleware errors
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }
    next();
  });

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { username, password, role, security_question, security_answer } = req.body;
    console.log(`Registration attempt for username: ${username}`);
    
    if (!username || !password || !role || !security_question || !security_answer) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const stmt = db.prepare("INSERT INTO users (username, password, role, security_question, security_answer) VALUES (?, ?, ?, ?, ?)");
      stmt.run(username, hashedPassword, role, security_question, security_answer);
      console.log(`Registration successful for: ${username}`);
      res.json({ success: true });
    } catch (e: any) {
      console.error("Registration error:", e);
      if (e.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Username sudah terdaftar" });
      } else {
        res.status(500).json({ error: "Terjadi kesalahan pada server saat registrasi" });
      }
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);
    
    try {
      const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
      } else {
        res.status(401).json({ error: "Username atau password salah" });
      }
    } catch (e) {
      console.error("Login error:", e);
      res.status(500).json({ error: "Terjadi kesalahan pada server saat login" });
    }
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { username, security_answer, new_password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (user && user.security_answer === security_answer) {
      const hashedPassword = bcrypt.hashSync(new_password, 10);
      db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashedPassword, user.id);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Incorrect security answer" });
    }
  });

  // Institution Routes
  app.get("/api/institution", (req, res) => {
    const data = db.prepare("SELECT * FROM institution WHERE id = 1").get();
    res.json(data);
  });

  app.post("/api/institution", authenticate, (req, res) => {
    const { name, address, principal_name, coordinator_name, halaqoh_teacher_name, logo, watermark, principal_signature, coordinator_signature } = req.body;
    db.prepare(`
      UPDATE institution 
      SET name = ?, address = ?, principal_name = ?, coordinator_name = ?, halaqoh_teacher_name = ?, logo = ?, watermark = ?, principal_signature = ?, coordinator_signature = ? 
      WHERE id = 1
    `).run(name, address, principal_name, coordinator_name, halaqoh_teacher_name, logo, watermark, principal_signature, coordinator_signature);
    res.json({ success: true });
  });

  // Halaqoh Routes
  app.get("/api/halaqoh", authenticate, (req, res) => {
    const data = db.prepare("SELECT * FROM halaqoh").all();
    res.json(data);
  });

  app.post("/api/halaqoh", authenticate, (req, res) => {
    const { name } = req.body;
    const result = db.prepare("INSERT INTO halaqoh (name) VALUES (?)").run(name);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/halaqoh/:id", authenticate, (req, res) => {
    try {
      db.transaction(() => {
        // Unassign students from this halaqoh instead of deleting them
        db.prepare("UPDATE students SET halaqoh_id = NULL WHERE halaqoh_id = ?").run(req.params.id);
        db.prepare("DELETE FROM halaqoh WHERE id = ?").run(req.params.id);
      })();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/halaqoh/:id", authenticate, (req, res) => {
    const { name } = req.body;
    db.prepare("UPDATE halaqoh SET name = ? WHERE id = ?").run(name, req.params.id);
    res.json({ success: true });
  });

  // Student Routes
  app.get("/api/students", authenticate, (req, res) => {
    const data = db.prepare(`
      SELECT s.*, h.name as halaqoh_name 
      FROM students s 
      LEFT JOIN halaqoh h ON s.halaqoh_id = h.id
      ORDER BY s.order_index ASC, s.name ASC
    `).all();
    res.json(data);
  });

  app.post("/api/students/reorder", authenticate, (req, res) => {
    const { orders } = req.body; // Array of { id, order_index }
    const updateStmt = db.prepare("UPDATE students SET order_index = ? WHERE id = ?");
    
    const transaction = db.transaction((orders: { id: number, order_index: number }[]) => {
      for (const item of orders) {
        updateStmt.run(item.order_index, item.id);
      }
    });

    transaction(orders);
    res.json({ success: true });
  });

  app.post("/api/students", authenticate, (req, res) => {
    const { name, halaqoh_id } = req.body;
    const result = db.prepare("INSERT INTO students (name, halaqoh_id) VALUES (?, ?)").run(name, halaqoh_id);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/students/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.put("/api/students/:id", authenticate, (req, res) => {
    const { name, halaqoh_id } = req.body;
    db.prepare("UPDATE students SET name = ?, halaqoh_id = ? WHERE id = ?").run(name, halaqoh_id, req.params.id);
    res.json({ success: true });
  });

  // Daily Deposit Routes
  app.get("/api/deposits/single", authenticate, (req, res) => {
    const { student_id, type, date } = req.query;
    const data = db.prepare("SELECT * FROM daily_deposits WHERE student_id = ? AND type = ? AND date = ?").get(student_id, type, date);
    if (data) {
      data.details = JSON.parse(data.details);
    }
    res.json(data || null);
  });

  app.post("/api/deposits", authenticate, (req, res) => {
    const { student_id, type, date, details } = req.body;
    // Use INSERT OR REPLACE or check if exists
    const existing = db.prepare("SELECT id FROM daily_deposits WHERE student_id = ? AND type = ? AND date = ?").get(student_id, type, date);
    
    if (existing) {
      db.prepare("UPDATE daily_deposits SET details = ? WHERE id = ?")
        .run(JSON.stringify(details), (existing as any).id);
    } else {
      db.prepare("INSERT INTO daily_deposits (student_id, type, date, details) VALUES (?, ?, ?, ?)")
        .run(student_id, type, date, JSON.stringify(details));
    }
    
    broadcast("deposit-added", { student_id, type, date });
    res.json({ success: true });
  });

  app.get("/api/monthly-recap/settings", authenticate, (req, res) => {
    const { student_id, month } = req.query;
    const data = db.prepare("SELECT * FROM monthly_recaps WHERE student_id = ? AND month = ?").get(student_id, month);
    res.json(data || { total_hafalan: "", notes: "" });
  });

  app.post("/api/monthly-recap/settings", authenticate, (req, res) => {
    const { student_id, month, total_hafalan, notes } = req.body;
    db.prepare(`
      INSERT INTO monthly_recaps (student_id, month, total_hafalan, notes)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(student_id, month) DO UPDATE SET
        total_hafalan = excluded.total_hafalan,
        notes = excluded.notes
    `).run(student_id, month, total_hafalan, notes);
    broadcast("recap-updated", { student_id, month });
    res.json({ success: true });
  });

  app.get("/api/deposits/recap", authenticate, (req, res) => {
    const { month, halaqoh_id } = req.query;
    // Simple recap logic: get all deposits for a month
    const data = db.prepare(`
      SELECT d.*, s.name as student_name 
      FROM daily_deposits d
      JOIN students s ON d.student_id = s.id
      WHERE d.date LIKE ? AND s.halaqoh_id = ?
    `).all(`${month}%`, halaqoh_id);
    res.json(data);
  });

  // Exam Routes
  app.post("/api/exams/ummi", authenticate, (req, res) => {
    const { student_id, level, scores, date, semester } = req.body;
    db.prepare("INSERT INTO exams_ummi (student_id, level, scores, date, semester) VALUES (?, ?, ?, ?, ?)")
      .run(student_id, level, JSON.stringify(scores), date, semester || 'Ganjil');
    res.json({ success: true });
  });

  app.delete("/api/exams/ummi/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM exams_ummi WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/exams/hafalan", authenticate, (req, res) => {
    const { student_id, surahs, note, date, days_progress, status, semester } = req.body;
    db.prepare(`
      INSERT INTO exams_hafalan (student_id, surahs, note, date, days_progress, status, semester)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(student_id, JSON.stringify(surahs), note, date, JSON.stringify(days_progress || {}), status || 'ongoing', semester || 'Ganjil');
    broadcast("exam-hafalan-updated", { student_id });
    res.json({ success: true });
  });

  app.put("/api/exams/hafalan/:id", authenticate, (req, res) => {
    const { surahs, note, days_progress, status, semester } = req.body;
    db.prepare(`
      UPDATE exams_hafalan 
      SET surahs = ?, note = ?, days_progress = ?, status = ?, semester = ?
      WHERE id = ?
    `).run(JSON.stringify(surahs), note, JSON.stringify(days_progress), status, semester || 'Ganjil', req.params.id);
    broadcast("exam-hafalan-updated", { id: req.params.id });
    res.json({ success: true });
  });

  app.delete("/api/exams/hafalan/:id", authenticate, (req, res) => {
    db.prepare("DELETE FROM exams_hafalan WHERE id = ?").run(req.params.id);
    broadcast("exam-hafalan-updated", { id: req.params.id });
    res.json({ success: true });
  });

  app.get("/api/exams/student/:id", authenticate, (req, res) => {
    const ummi = db.prepare("SELECT * FROM exams_ummi WHERE student_id = ? ORDER BY date DESC").all(req.params.id);
    const hafalan = db.prepare("SELECT * FROM exams_hafalan WHERE student_id = ? ORDER BY date DESC").all(req.params.id);
    res.json({ ummi, hafalan });
  });

  // Maintenance
  app.post("/api/maintenance/reset", authenticate, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Only admin can reset data" });
    
    db.transaction(() => {
      db.prepare("DELETE FROM daily_deposits").run();
      db.prepare("DELETE FROM exams_ummi").run();
      db.prepare("DELETE FROM exams_hafalan").run();
      db.prepare("DELETE FROM monthly_recaps").run();
      db.prepare("DELETE FROM students").run();
      db.prepare("DELETE FROM halaqoh").run();
    })();
    
    res.json({ success: true });
  });

  app.get("/api/maintenance/export", authenticate, (req, res) => {
    const data = fs.readFileSync("tahfidz.db");
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=tahfidz_backup.db');
    res.send(data);
  });

  app.post("/api/maintenance/import", authenticate, (req, res) => {
    const { database } = req.body; // base64
    if (!database) return res.status(400).json({ error: "No database provided" });
    const buffer = Buffer.from(database.split(",")[1], 'base64');
    fs.writeFileSync("tahfidz.db", buffer);
    // Re-open DB to apply changes
    db.close();
    // In a real app we'd need to restart the process or re-init the db object
    // For this environment, we'll just tell the user to refresh
    res.json({ success: true, message: "Database imported. Please restart the app." });
  });

  // Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  // Final Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });

  httpServer.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://0.0.0.0:3000");
  });
}

startServer();
