
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { 
  createUserInputSchema, 
  loginInputSchema,
  createTaskInputSchema,
  updateTaskInputSchema,
  getTasksInputSchema,
  startPomodoroInputSchema,
  completePomodoroInputSchema,
  getPomodoroHistoryInputSchema,
  updateUserPreferencesInputSchema
} from './schema';
import { createUser } from './handlers/create_user';
import { loginUser } from './handlers/login_user';
import { createTask } from './handlers/create_task';
import { getTasks } from './handlers/get_tasks';
import { updateTask } from './handlers/update_task';
import { deleteTask } from './handlers/delete_task';
import { startPomodoro } from './handlers/start_pomodoro';
import { completePomodoro } from './handlers/complete_pomodoro';
import { getPomodoroHistory } from './handlers/get_pomodoro_history';
import { getUserPreferences } from './handlers/get_user_preferences';
import { updateUserPreferences } from './handlers/update_user_preferences';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User authentication routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  loginUser: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),

  // Task management routes
  createTask: publicProcedure
    .input(createTaskInputSchema)
    .mutation(({ input }) => createTask(input)),

  getTasks: publicProcedure
    .input(getTasksInputSchema)
    .query(({ input }) => getTasks(input)),

  updateTask: publicProcedure
    .input(updateTaskInputSchema)
    .mutation(({ input }) => updateTask(input)),

  deleteTask: publicProcedure
    .input(z.object({ taskId: z.number() }))
    .mutation(({ input }) => deleteTask(input.taskId)),

  // Pomodoro timer routes
  startPomodoro: publicProcedure
    .input(startPomodoroInputSchema)
    .mutation(({ input }) => startPomodoro(input)),

  completePomodoro: publicProcedure
    .input(completePomodoroInputSchema)
    .mutation(({ input }) => completePomodoro(input)),

  getPomodoroHistory: publicProcedure
    .input(getPomodoroHistoryInputSchema)
    .query(({ input }) => getPomodoroHistory(input)),

  // User preferences routes
  getUserPreferences: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getUserPreferences(input.userId)),

  updateUserPreferences: publicProcedure
    .input(updateUserPreferencesInputSchema)
    .mutation(({ input }) => updateUserPreferences(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
