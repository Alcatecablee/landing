import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db, isPostgres } from "./db";
import crypto from "crypto";

import { cliRoutes } from "./routes/cli";
import { apiDocsRoutes } from "./routes/api-docs";
import teamRoutes from "./routes/teams";
import supabaseTestRoutes from "./routes/supabase-test";
import enterpriseRoutes from "./routes/enterprise";

// Import schema for database tables
import * as pgSchema from "../shared/schema.js";
import * as sqliteSchema from "../shared/schema-sqlite.js";

// Use appropriate schema based on database type
const schema = isPostgres ? pgSchema : sqliteSchema;
const { transformations, users } = schema;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: db ? (isPostgres ? "postgresql" : "sqlite") : "none",
    });
  });

  // Database test endpoint
  app.get("/api/db/test", async (req, res) => {
    try {
      if (!db) {
        return res.status(500).json({
          error: "Database not initialized",
          status: "disconnected",
        });
      }

      // Test database connection with a simple query
      let testResult;
      if (isPostgres) {
        testResult = await db.execute("SELECT 1");
      } else {
        // For SQLite, test by counting users table
        const schema = await import("../shared/schema-sqlite.js");
        testResult = await db.select().from(schema.users).limit(1);
      }

      res.json({
        status: "connected",
        type: isPostgres ? "postgresql" : "sqlite",
        timestamp: new Date().toISOString(),
        test_successful: true,
      });
    } catch (error: any) {
      console.error("Database test failed:", error);
      res.status(500).json({
        error: "Database connection failed",
        message: error.message,
        status: "error",
      });
    }
  });

  // Load current environment variables endpoint
  app.get("/api/admin/load-env", async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");

      // Read the .env file directly
      const envPath = path.join(process.cwd(), ".env");
      let envContent = "";

      try {
        envContent = fs.readFileSync(envPath, "utf8");
      } catch (error) {
        console.warn(".env file not found, using default values");
      }

      // Parse the .env file content
      const envVars = {
        VITE_SUPABASE_URL: "",
        VITE_SUPABASE_ANON_KEY: "",
        SUPABASE_SERVICE_ROLE_KEY: "",
        DATABASE_URL: "",
        PAYPAL_CLIENT_ID: "",
        PAYPAL_CLIENT_SECRET: "",
        PAYPAL_ENVIRONMENT: "sandbox",
        API_URL: "http://localhost:5000",
      };

      // Parse environment variables from .env file
      const envLines = envContent.split("\n");
      for (const line of envLines) {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#")) {
          const [key, ...valueParts] = trimmedLine.split("=");
          const value = valueParts.join("=");
          if (key && value !== undefined && envVars.hasOwnProperty(key)) {
            envVars[key as keyof typeof envVars] = value;
          }
        }
      }

      res.json({ success: true, envVars });
    } catch (error: any) {
      console.error("Failed to load env vars:", error);
      res.status(500).json({
        error: "Failed to load environment variables",
        message: error.message,
      });
    }
  });

  // Save environment variables endpoint
  app.post("/api/admin/save-env", async (req, res) => {
    try {
      const { envVars } = req.body;
      const fs = await import("fs");
      const path = await import("path");

      // Read current .env file
      const envPath = path.join(process.cwd(), ".env");
      let envContent = "";

      try {
        envContent = fs.readFileSync(envPath, "utf8");
      } catch (error) {
        // .env file doesn't exist, create new content
        envContent = "";
      }

      // Update or add environment variables
      const envLines = envContent.split("\n");
      const updatedVars = { ...envVars };

      // Update existing variables
      for (let i = 0; i < envLines.length; i++) {
        const line = envLines[i].trim();
        if (line && !line.startsWith("#")) {
          const [key] = line.split("=");
          if (key && updatedVars[key] !== undefined) {
            envLines[i] = `${key}=${updatedVars[key]}`;
            delete updatedVars[key];
          }
        }
      }

      // Add new variables
      Object.entries(updatedVars).forEach(([key, value]) => {
        if (value) {
          envLines.push(`${key}=${value}`);
        }
      });

      // Write back to .env file
      fs.writeFileSync(envPath, envLines.join("\n"));

      res.json({
        success: true,
        message: "Environment variables saved successfully",
        restart_required: true,
      });
    } catch (error: any) {
      console.error("Failed to save env vars:", error);
      res.status(500).json({
        error: "Failed to save environment variables",
        message: error.message,
      });
    }
  });

  // Debug endpoint to check sample data
  app.get("/api/debug/sample-data", async (req, res) => {
    try {
      if (!db) {
        return res.json({ error: "Database not initialized" });
      }

      const schema = await import("../shared/schema-sqlite.js");

      // Get sample user
      const users = await db.select().from(schema.users).limit(5);

      // Get sample teams
      const teams = await db.select().from(schema.teams).limit(5);

      // Get sample team members
      const members = await db.select().from(schema.teamMembers).limit(5);

      res.json({
        users: users.map(
          (u: {
            id: string;
            email: string | null;
            fullName: string | null;
          }) => ({
            id: u.id,
            email: u.email,
            name: u.fullName,
          }),
        ),
        teams: teams.map(
          (t: { id: string; name: string | null; ownerId: string | null }) => ({
            id: t.id,
            name: t.name,
            ownerId: t.ownerId,
          }),
        ),
        members: members.map(
          (m: {
            id: string;
            teamId: string | null;
            userId: string | null;
            role: string | null;
          }) => ({
            id: m.id,
            teamId: m.teamId,
            userId: m.userId,
            role: m.role,
          }),
        ),
        message: "Real database statistics from Supabase",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred" });
      }
    }
  });

  // Database info endpoint
  app.get("/api/db/info", async (req, res) => {
    try {
      if (!db) {
        return res.json({
          status: "disconnected",
          type: "none",
          location: "in-memory",
        });
      }

      const dbType = isPostgres ? "postgresql" : "sqlite";
      const location = isPostgres ? "remote" : "./data/neurolint.db";

      // Get table counts
      let stats = {};
      try {
        if (isPostgres) {
          // PostgreSQL stats would go here
          stats = { message: "PostgreSQL connected" };
        } else {
          // SQLite stats
          const schema = await import("../shared/schema-sqlite.js");
          const userCount = await db.select().from(schema.users).all();
          const transformationCount = await db
            .select()
            .from(schema.transformations)
            .all();

          stats = {
            users: userCount.length,
            transformations: transformationCount.length,
            tables_initialized: true,
          };
        }
      } catch (statError) {
        stats = { error: "Could not retrieve stats" };
      }

      res.json({
        status: "connected",
        type: dbType,
        location,
        stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Database info failed",
        message: error.message,
      });
    }
  });

  // Register team routes
  app.use(teamRoutes);

  // Register Supabase test routes
  app.use(supabaseTestRoutes);

  // Register CLI routes
  app.use(cliRoutes);

  // Register API documentation routes
  app.use(apiDocsRoutes);

  // Register enterprise routes
  app.use(enterpriseRoutes);

  // Sessions API for live collaboration
  app.use("/api/sessions", (await import("./routes/sessions")).default);

  // User management routes
  app.get("/api/user/:supabaseId", async (req, res) => {
    try {
      const user = await storage.getUserBySupabaseId(req.params.supabaseId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const { supabaseId, email, fullName } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserBySupabaseId(supabaseId);
      if (existingUser) {
        return res.json(existingUser);
      }

      const user = await storage.createUser({ supabaseId, email, fullName });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // PayPal subscription route (replacing Supabase Edge Function)
  app.post("/api/create-paypal-subscription", async (req, res) => {
    try {
      const { plan_type, amount, user_id } = req.body;

      const paypalClientId = process.env.PAYPAL_CLIENT_ID;
      const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const paypalEnvironment = process.env.PAYPAL_ENVIRONMENT || "sandbox";

      if (!paypalClientId || !paypalClientSecret) {
        return res
          .status(500)
          .json({ error: "PayPal credentials not configured" });
      }

      const paypalBaseUrl =
        paypalEnvironment === "production"
          ? "https://api.paypal.com"
          : "https://api.sandbox.paypal.com";

      // Get PayPal access token
      const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      });

      const authData = await authResponse.json();

      // Create subscription
      const subscriptionData = {
        plan_id: `neurolint-${plan_type}`,
        custom_id: user_id, // Include user ID for webhook handling
        application_context: {
          brand_name: "NeuroLint",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${req.get("origin")}/billing?success=true`,
          cancel_url: `${req.get("origin")}/billing?cancelled=true`,
        },
        subscriber: {
          name: {
            given_name: "User",
            surname: "Name",
          },
        },
      };

      const subscriptionResponse = await fetch(
        `${paypalBaseUrl}/v1/billing/subscriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.access_token}`,
          },
          body: JSON.stringify(subscriptionData),
        },
      );

      const subscription = await subscriptionResponse.json();

      res.json({
        subscription_id: subscription.id,
        approve_link: subscription.links?.find(
          (link: any) => link.rel === "approve",
        )?.href,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create subscription",
      });
    }
  });

  // Get user usage statistics
  app.get("/api/auth/usage", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "No authorization token provided" });
      }

      // TODO: Extract user ID from Supabase JWT token
      // For now, get all transformations data from database
      const transformationsQuery = await db.select().from(transformations);

      const totalTransformations = transformationsQuery.length;
      const successfulTransformations = transformationsQuery.filter(
        (t: { success: boolean }) => t.success,
      ).length;
      const totalExecutionTime = transformationsQuery.reduce(
        (sum: number, t: { executionTimeMs: number | null }) =>
          sum + (t.executionTimeMs || 0),
        0,
      );
      const successRate =
        totalTransformations > 0
          ? (successfulTransformations / totalTransformations) * 100
          : 0;

      res.json({
        totalTransformations,
        successfulTransformations,
        totalExecutionTime,
        successRate,
      });
    } catch (error) {
      console.error("Failed to fetch usage statistics:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch usage statistics",
      });
    }
  });

  // Get current user profile from Supabase auth
  app.get("/api/auth/user", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "No authorization token provided" });
      }

      // TODO: Decode Supabase JWT token to get user ID
      // For now, get user data from database
      const usersQuery = await db.select().from(users).limit(1);

      if (usersQuery.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = usersQuery[0];
      const userProfile = {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.fullName,
          avatar_url: null,
        },
        app_metadata: {
          plan_type: user.planType || "free",
          monthly_transformations_used: user.monthlyTransformationsUsed || 0,
          monthly_limit: user.monthlyLimit || 25,
        },
      };

      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  // Create or update user in our database when they sign up/sign in with Supabase
  app.post("/api/auth/sync-user", async (req, res) => {
    try {
      const { id, email, user_metadata } = req.body;

      if (!id || !email) {
        return res
          .status(400)
          .json({ error: "User ID and email are required" });
      }

      // Check if user already exists in our database
      let user = await storage.getUserBySupabaseId(id);

      if (!user) {
        try {
          // Create new user in our database
          user = await storage.createUser({
            supabaseId: id, // This will be mapped to clerkId in storage
            email,
            fullName: user_metadata?.full_name || email.split("@")[0],
          });
        } catch (error) {
          console.error("Error creating user:", error);
          // If user creation fails due to duplicate, try to get the existing user
          user = await storage.getUserBySupabaseId(id);
          if (!user) {
            throw error instanceof Error
              ? error
              : new Error("Failed to create user");
          }
        }
      }

      res.json(user);
    } catch (error) {
      console.error("Failed to sync user:", error);
      res.status(500).json({
        error: "Failed to sync user",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Transformation usage tracking
  app.post("/api/increment-usage", async (req, res) => {
    try {
      const { supabaseId } = req.body;
      const success = await storage.incrementUsage(supabaseId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ error: "Failed to increment usage" });
    }
  });

  // Track transformations
  app.post("/api/transformations", async (req, res) => {
    try {
      const transformation = await storage.createTransformation(req.body);
      res.json(transformation);
    } catch (error) {
      res.status(500).json({ error: "Failed to save transformation" });
    }
  });

  // Record payments
  app.post("/api/payments", async (req, res) => {
    try {
      const {
        userId,
        paypalPaymentId,
        amountCents,
        currency,
        status,
        paymentType,
        description,
      } = req.body;

      // Validate required fields
      if (!userId || !paypalPaymentId || !amountCents) {
        return res
          .status(400)
          .json({ error: "Missing required payment fields" });
      }

      const sqlite = getSQLiteDatabase();

      // Check for duplicate payments
      const existingPayment = sqlite
        .prepare(
          `
        SELECT id FROM payments WHERE paypal_payment_id = ?
      `,
        )
        .get(paypalPaymentId);

      if (existingPayment) {
        return res.status(409).json({
          error: "Payment already recorded",
          id: existingPayment.id,
        });
      }

      const paymentId = crypto.randomUUID();
      const now = Date.now();

      // Insert payment record
      sqlite
        .prepare(
          `
        INSERT INTO payments (
          id, user_id, paypal_payment_id, amount_cents,
          currency, status, payment_type, description,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        )
        .run(
          paymentId,
          userId,
          paypalPaymentId,
          amountCents,
          currency || "USD",
          status || "completed",
          paymentType || "subscription",
          description,
          now,
          now,
        );

      // Update user plan if payment successful
      if (status === "completed" && paymentType === "subscription") {
        let planType = "free";
        let monthlyLimit = 25;

        if (amountCents >= 19900) {
          // $199 = Enterprise
          planType = "enterprise";
          monthlyLimit = 999999;
        } else if (amountCents >= 2900) {
          // $29 = Pro
          planType = "pro";
          monthlyLimit = 999999;
        }

        console.log(
          `Updating user ${userId} to plan ${planType} with limit ${monthlyLimit}`,
        );

        sqlite
          .prepare(
            `
          UPDATE users
          SET plan_type = ?, monthly_limit = ?, updated_at = ?
          WHERE id = ?
        `,
          )
          .run(planType, monthlyLimit, now, userId);
      }

      res.json({ success: true, id: paymentId, paypal_id: paypalPaymentId });
    } catch (error) {
      console.error("Payment recording error:", error);
      res.status(500).json({
        error: "Failed to record payment",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // PayPal webhook handler
  app.post("/api/paypal-webhook", async (req, res) => {
    try {
      const event = req.body;
      const eventType = event.event_type;

      console.log("PayPal webhook received:", eventType);

      const sqlite = getSQLiteDatabase();
      const now = Date.now();

      switch (eventType) {
        case "BILLING.SUBSCRIPTION.ACTIVATED":
          // Subscription successfully activated
          const subscription = event.resource;
          const customId = subscription.custom_id; // Should contain user_id

          if (customId) {
            sqlite
              .prepare(
                `
              UPDATE users
              SET plan_type = ?, monthly_limit = ?, updated_at = ?
              WHERE id = ?
            `,
              )
              .run("pro", 999999, now, customId);
          }
          break;

        case "BILLING.SUBSCRIPTION.CANCELLED":
        case "BILLING.SUBSCRIPTION.SUSPENDED":
          // Downgrade user to free plan
          const cancelledSub = event.resource;
          const cancelledUserId = cancelledSub.custom_id;

          if (cancelledUserId) {
            sqlite
              .prepare(
                `
              UPDATE users
              SET plan_type = ?, monthly_limit = ?, updated_at = ?
              WHERE id = ?
            `,
              )
              .run("free", 25, now, cancelledUserId);
          }
          break;

        case "PAYMENT.SALE.COMPLETED":
          // Record successful payment
          const payment = event.resource;
          const paymentUserId = payment.custom; // User ID should be in custom field

          if (paymentUserId && payment.amount) {
            const paymentId = crypto.randomUUID();

            sqlite
              .prepare(
                `
              INSERT INTO payments (
                id, user_id, paypal_payment_id, amount_cents,
                currency, status, payment_type, description,
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
              )
              .run(
                paymentId,
                paymentUserId,
                payment.id,
                Math.round(parseFloat(payment.amount.total) * 100),
                payment.amount.currency,
                "completed",
                "subscription",
                "PayPal subscription payment",
                now,
                now,
              );
          }
          break;

        case "PAYMENT.SALE.DENIED":
        case "PAYMENT.SALE.REFUNDED":
          // Handle failed/refunded payments
          console.log("Payment failed or refunded:", event.resource.id);
          break;

        default:
          console.log("Unhandled webhook event:", eventType);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("PayPal webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // Get user billing history
  app.get("/api/billing/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const sqlite = getSQLiteDatabase();

      const payments = sqlite
        .prepare(
          `
        SELECT * FROM payments
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
      `,
        )
        .all(userId);

      const formattedPayments = payments.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount_cents / 100,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        date: new Date(payment.created_at).toISOString(),
        invoice_url: `/api/billing/invoice/${payment.id}`,
      }));

      res.json({ payments: formattedPayments });
    } catch (error) {
      console.error("Billing history error:", error);
      res.status(500).json({ error: "Failed to fetch billing history" });
    }
  });

  // Cancel subscription endpoint
  app.post("/api/billing/cancel-subscription", async (req, res) => {
    try {
      const { userId, subscriptionId } = req.body;

      if (!userId || !subscriptionId) {
        return res
          .status(400)
          .json({ error: "Missing userId or subscriptionId" });
      }

      const paypalClientId = process.env.PAYPAL_CLIENT_ID;
      const paypalClientSecret = process.env.PAYPAL_CLIENT_SECRET;
      const paypalEnvironment = process.env.PAYPAL_ENVIRONMENT || "sandbox";

      if (!paypalClientId || !paypalClientSecret) {
        return res
          .status(500)
          .json({ error: "PayPal credentials not configured" });
      }

      const paypalBaseUrl =
        paypalEnvironment === "production"
          ? "https://api.paypal.com"
          : "https://api.sandbox.paypal.com";

      // Get PayPal access token
      const authResponse = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalClientSecret}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      });

      const { access_token } = await authResponse.json();

      // Cancel the subscription
      const cancelResponse = await fetch(
        `${paypalBaseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify({
            reason: "User requested cancellation",
          }),
        },
      );

      if (cancelResponse.ok) {
        // Update user plan in database
        const sqlite = getSQLiteDatabase();
        const now = Date.now();

        sqlite
          .prepare(
            `
          UPDATE users
          SET plan_type = ?, monthly_limit = ?, updated_at = ?
          WHERE id = ?
        `,
          )
          .run("free", 25, now, userId);

        res.json({ success: true });
      } else {
        throw new Error("Failed to cancel subscription with PayPal");
      }
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
