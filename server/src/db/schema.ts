
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);
export const taskStatusEnum = pgEnum('task_status', ['pending', 'in_progress', 'completed', 'cancelled']);
export const recurrencePatternEnum = pgEnum('recurrence_pattern', ['daily', 'weekly', 'monthly', 'yearly']);
export const pomodoroTypeEnum = pgEnum('pomodoro_type', ['work', 'short_break', 'long_break']);
export const themeEnum = pgEnum('theme', ['light', 'dark', 'system']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  is_premium: boolean('is_premium').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Tasks table with self-reference handled properly
export const tasksTable = pgTable('tasks', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  status: taskStatusEnum('status').notNull().default('pending'),
  due_date: timestamp('due_date'),
  estimated_pomodoros: integer('estimated_pomodoros'),
  completed_pomodoros: integer('completed_pomodoros').notNull().default(0),
  is_recurring: boolean('is_recurring').notNull().default(false),
  recurrence_pattern: recurrencePatternEnum('recurrence_pattern'),
  parent_task_id: integer('parent_task_id'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Pomodoro sessions table
export const pomodoroSessionsTable = pgTable('pomodoro_sessions', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  task_id: integer('task_id').references(() => tasksTable.id, { onDelete: 'set null' }),
  type: pomodoroTypeEnum('type').notNull().default('work'),
  duration_minutes: integer('duration_minutes').notNull().default(25),
  completed: boolean('completed').notNull().default(false),
  started_at: timestamp('started_at').defaultNow().notNull(),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// User preferences table
export const userPreferencesTable = pgTable('user_preferences', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull().unique().references(() => usersTable.id, { onDelete: 'cascade' }),
  work_duration: integer('work_duration').notNull().default(25),
  short_break_duration: integer('short_break_duration').notNull().default(5),
  long_break_duration: integer('long_break_duration').notNull().default(15),
  pomodoros_until_long_break: integer('pomodoros_until_long_break').notNull().default(4),
  theme: themeEnum('theme').notNull().default('system'),
  color_scheme: text('color_scheme').notNull().default('blue'),
  minimalist_mode: boolean('minimalist_mode').notNull().default(false),
  notifications_enabled: boolean('notifications_enabled').notNull().default(true),
  sound_enabled: boolean('sound_enabled').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many, one }) => ({
  tasks: many(tasksTable),
  pomodoroSessions: many(pomodoroSessionsTable),
  preferences: one(userPreferencesTable)
}));

export const tasksRelations = relations(tasksTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [tasksTable.user_id],
    references: [usersTable.id]
  }),
  parentTask: one(tasksTable, {
    fields: [tasksTable.parent_task_id],
    references: [tasksTable.id],
    relationName: 'parent_task'
  }),
  subTasks: many(tasksTable, {
    relationName: 'parent_task'
  }),
  pomodoroSessions: many(pomodoroSessionsTable)
}));

export const pomodoroSessionsRelations = relations(pomodoroSessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [pomodoroSessionsTable.user_id],
    references: [usersTable.id]
  }),
  task: one(tasksTable, {
    fields: [pomodoroSessionsTable.task_id],
    references: [tasksTable.id]
  })
}));

export const userPreferencesRelations = relations(userPreferencesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userPreferencesTable.user_id],
    references: [usersTable.id]
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Task = typeof tasksTable.$inferSelect;
export type NewTask = typeof tasksTable.$inferInsert;
export type PomodoroSession = typeof pomodoroSessionsTable.$inferSelect;
export type NewPomodoroSession = typeof pomodoroSessionsTable.$inferInsert;
export type UserPreferences = typeof userPreferencesTable.$inferSelect;
export type NewUserPreferences = typeof userPreferencesTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  users: usersTable,
  tasks: tasksTable,
  pomodoroSessions: pomodoroSessionsTable,
  userPreferences: userPreferencesTable
};
