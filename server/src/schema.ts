
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  password_hash: z.string(),
  is_premium: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Task priority enum
export const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

// Task status enum
export const taskStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled']);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

// Recurrence pattern enum
export const recurrencePatternSchema = z.enum(['daily', 'weekly', 'monthly', 'yearly']);
export type RecurrencePattern = z.infer<typeof recurrencePatternSchema>;

// Task schema
export const taskSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  priority: taskPrioritySchema,
  status: taskStatusSchema,
  due_date: z.coerce.date().nullable(),
  estimated_pomodoros: z.number().int().nullable(),
  completed_pomodoros: z.number().int(),
  is_recurring: z.boolean(),
  recurrence_pattern: recurrencePatternSchema.nullable(),
  parent_task_id: z.number().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Task = z.infer<typeof taskSchema>;

// Pomodoro session type enum
export const pomodoroTypeSchema = z.enum(['work', 'short_break', 'long_break']);
export type PomodoroType = z.infer<typeof pomodoroTypeSchema>;

// Pomodoro session schema
export const pomodoroSessionSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  task_id: z.number().nullable(),
  type: pomodoroTypeSchema,
  duration_minutes: z.number().int(),
  completed: z.boolean(),
  started_at: z.coerce.date(),
  completed_at: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type PomodoroSession = z.infer<typeof pomodoroSessionSchema>;

// User preferences schema
export const userPreferencesSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  work_duration: z.number().int(),
  short_break_duration: z.number().int(),
  long_break_duration: z.number().int(),
  pomodoros_until_long_break: z.number().int(),
  theme: z.enum(['light', 'dark', 'system']),
  color_scheme: z.string(),
  minimalist_mode: z.boolean(),
  notifications_enabled: z.boolean(),
  sound_enabled: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type UserPreferences = z.infer<typeof userPreferencesSchema>;

// Input schemas for user operations
export const createUserInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6)
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Input schemas for task operations
export const createTaskInputSchema = z.object({
  user_id: z.number(),
  title: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  priority: taskPrioritySchema.default('medium'),
  due_date: z.coerce.date().nullable().optional(),
  estimated_pomodoros: z.number().int().positive().nullable().optional(),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: recurrencePatternSchema.nullable().optional(),
  parent_task_id: z.number().nullable().optional()
});

export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
  due_date: z.coerce.date().nullable().optional(),
  estimated_pomodoros: z.number().int().positive().nullable().optional(),
  is_recurring: z.boolean().optional(),
  recurrence_pattern: recurrencePatternSchema.nullable().optional()
});

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const getTasksInputSchema = z.object({
  user_id: z.number(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  parent_task_id: z.number().nullable().optional()
});

export type GetTasksInput = z.infer<typeof getTasksInputSchema>;

// Input schemas for Pomodoro operations
export const startPomodoroInputSchema = z.object({
  user_id: z.number(),
  task_id: z.number().nullable().optional(),
  type: pomodoroTypeSchema.default('work'),
  duration_minutes: z.number().int().positive().default(25)
});

export type StartPomodoroInput = z.infer<typeof startPomodoroInputSchema>;

export const completePomodoroInputSchema = z.object({
  session_id: z.number()
});

export type CompletePomodoroInput = z.infer<typeof completePomodoroInputSchema>;

export const getPomodoroHistoryInputSchema = z.object({
  user_id: z.number(),
  task_id: z.number().optional(),
  from_date: z.coerce.date().optional(),
  to_date: z.coerce.date().optional()
});

export type GetPomodoroHistoryInput = z.infer<typeof getPomodoroHistoryInputSchema>;

// Input schemas for user preferences
export const updateUserPreferencesInputSchema = z.object({
  user_id: z.number(),
  work_duration: z.number().int().positive().optional(),
  short_break_duration: z.number().int().positive().optional(),
  long_break_duration: z.number().int().positive().optional(),
  pomodoros_until_long_break: z.number().int().positive().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  color_scheme: z.string().optional(),
  minimalist_mode: z.boolean().optional(),
  notifications_enabled: z.boolean().optional(),
  sound_enabled: z.boolean().optional()
});

export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesInputSchema>;
