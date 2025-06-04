import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PrismaClient } from "@prisma/client";

import { TodoResolver } from "./resolvers/TodoResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { CompanyResolver } from "./resolvers/CompanyResolver";
import { ContactResolver } from "./resolvers/ContactResolver";
import { NoteResolver } from "./resolvers/NoteResolver";
import { NotificationResolver } from "./resolvers/NotificationResolver";
import { TokenResolver } from "./resolvers/TokenResolver";
import { TaskStageResolver } from "./resolvers/TaskStageResolver";
import { TaskResolver } from "./resolvers/TaskResolver";
import { CategoryResolver } from "./resolvers/CategoryResolver";
import { EventCategoryResolver } from "./resolvers/EventCategoryResolver";
import { ChecklistResolver } from "./resolvers/ChecklistResolver";
import { AuditResolver } from "./resolvers/AuditResolver";
import { ProductResolver } from "./resolvers/ProductResolver";
import { QuoteResolver } from "./resolvers/QuoteResolver";
import { DealStageResolver } from "./resolvers/DealStageResolver";
import { DealResolver } from "./resolvers/DealResolver";
import { ProjectResolver } from "./resolvers/ProjectResolver";
import { EventResolver } from "./resolvers/EventResolver";
import { CommentResolver } from "./resolvers/CommentResolver";
import { DashboardResolver } from "./resolvers/DashboardResolver";

const prisma = new PrismaClient();

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [
      TodoResolver,
      UserResolver,
      CompanyResolver,
      ContactResolver,
      NoteResolver,
      NotificationResolver,
      TokenResolver,
      TaskStageResolver,
      TaskResolver,
      CategoryResolver,
      EventCategoryResolver,
      ChecklistResolver,
      AuditResolver,
      ProductResolver,
      QuoteResolver,
      DealStageResolver,
      DealResolver,
      DashboardResolver,
      ProjectResolver,
      EventResolver,
      CommentResolver,
    ],
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  });

  await server.start();

  const app = express();
  app.use(express.json());

  // GET /dashboard/counts
  app.get("/dashboard/counts", async (_req, res) => {
    const [companies, contacts, deals] = await Promise.all([
      prisma.company.count(),
      prisma.contact.count(),
      prisma.deal.count(),
    ]);
    res.json({ companies, contacts, deals });
  });

  // GET /users
  app.get("/users", async (_req, res) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        jobTitle: true,
        role: true,
        avatarUrl: true,
      },
    });
    res.json(users);
  });

  // GET /task/:id
  app.get("/task/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    try {
      const task = await prisma.task.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          dueDate: true,
          completed: true,
          stage: {
            select: {
              id: true,
              title: true,
            },
          },
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          checklists: {
            select: {
              id: true,
              title: true,
              checked: true,
            },
          },
        },
      });

      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }

      res.json(task);
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // GET /tasks
  app.get("/tasks", async (_req, res) => {
    const tasks = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        completed: true,
        stageId: true,
        checklists: {
          select: { title: true, checked: true },
        },
        users: {
          select: { id: true, name: true, avatarUrl: true },
        },
        comments: { select: { id: true } },
      },
    });

    const formatted = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: task.completed,
      stageId: task.stageId,
      checklist: task.checklists,
      users: task.users,
      comments: { totalCount: task.comments.length },
    }));

    res.json(formatted);
  });

  // GET /events
  app.get("/events", async (_req, res) => {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        color: true,
        startDate: true,
        endDate: true,
      },
    });

    res.setHeader("Content-Type", "application/json");
    res.json({ nodes: events, totalCount: events.length });
  });

  // GET /quotes
  app.get("/quotes", async (_req, res) => {
    const quotes = await prisma.quote.findMany({
      include: {
        company: true,
        salesOwner: true,
        contact: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = quotes.map((quote) => ({
      ...quote,
      items: quote.items.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        discount: item.discount,
        totalPrice: item.totalPrice,
      })),
    }));

    res.json(formatted);
  });

  // GET /quotes/:id
  app.get("/quotes/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    try {
      const quote = await prisma.quote.findUnique({
        where: { id },
        include: {
          company: true,
          salesOwner: true,
          contact: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!quote) {
        res.status(404).json({ message: "Quote not found" });
        return;
      }

      const formatted = {
        ...quote,
        items: quote.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          discount: item.discount,
          totalPrice: item.totalPrice,
        })),
      };

      res.json(formatted);
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // POST /quotes
  app.post("/quotes", async (req, res) => {
    try {
      const data = req.body;
      const quote = await prisma.quote.create({
        data,
        include: {
          company: true,
          salesOwner: true,
          contact: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      const formatted = {
        ...quote,
        items: quote.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          discount: item.discount,
          totalPrice: item.totalPrice,
        })),
      };

      res.status(201).json(formatted);
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // PUT /quotes/:id
  app.put("/quotes/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    try {
      const updateData = req.body;
      const quote = await prisma.quote.update({
        where: { id },
        data: updateData,
        include: {
          company: true,
          salesOwner: true,
          contact: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      const formatted = {
        ...quote,
        items: quote.items.map((item) => ({
          id: item.id,
          product: item.product,
          quantity: item.quantity,
          discount: item.discount,
          totalPrice: item.totalPrice,
        })),
      };

      res.json(formatted);
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // DELETE /quotes/:id
  app.delete("/quotes/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid id" });
      return;
    }

    try {
      await prisma.quote.delete({ where: { id } });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  });

  server.applyMiddleware({ app });

  const port = 8000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

bootstrap();
