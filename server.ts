import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "tahfidz-secret-2026";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

// Dynamic APP_URL for Vercel
const getAppUrl = (req: Request) => {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `${req.protocol}://${req.get("host")}`;
};

// In-memory user storage for demo purposes (since data is local anyway)
const users: any[] = [];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);

  app.use(express.json({ limit: '50mb' }));

  // Request Logger
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

// Auth Routes - Simplified for local-only mode
  app.post("/api/auth/register", async (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username } = req.body;
    res.json({ 
      token: 'local-token', 
      user: { id: Date.now().toString(), username, role: 'guru' } 
    });
  });

  // Google OAuth Routes
  app.get("/api/auth/google/url", (req, res) => {
    const appUrl = getAppUrl(req);
    const redirectUri = `${appUrl}/auth/callback`;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ url: authUrl });
  });

  app.get(["/auth/callback", "/auth/callback/"], async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("No code provided");

    try {
      const appUrl = getAppUrl(req);
      const redirectUri = `${appUrl}/auth/callback`;
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });

      const { access_token } = tokenResponse.data;
      const userResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const googleUser = userResponse.data;
      const email = googleUser.email;

      let user = users.find(u => u.username === email);
      if (!user) {
        user = { id: Date.now().toString(), username: email, role: "guru" };
        users.push(user);
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  token: '${token}', 
                  user: ${JSON.stringify({ id: user.id, username: user.username, role: user.role })} 
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("OAuth callback error:", error.response?.data || error.message);
      res.status(500).send("Authentication failed");
    }
  });

  // Vite setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    httpServer.listen(3000, "0.0.0.0", () => {
      console.log("Server running on http://0.0.0.0:3000");
    });
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  return app;
}

export const appPromise = startServer();
