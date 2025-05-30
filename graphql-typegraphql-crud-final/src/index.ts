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

  server.applyMiddleware({ app });

  const port = 8000;
  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

bootstrap();
