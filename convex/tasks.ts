import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Get tasks by employee
export const getByEmployee = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, { employeeId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_employee", (q) => q.eq("assignedTo", employeeId))
      .collect();
  },
});

// Get pending tasks
export const getPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("isCompleted", false))
      .collect();
  },
});

// Add new task
export const add = mutation({
  args: {
    text: v.string(),
    assignedTo: v.optional(v.id("employees")),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      ...args,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    });
  },
});

// Update task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    text: v.optional(v.string()),
    isCompleted: v.optional(v.boolean()),
    assignedTo: v.optional(v.id("employees")),
    dueDate: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    return await ctx.db.patch(id, updates);
  },
});

// Toggle task completion
export const toggle = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    if (!task) {
      throw new Error("Task not found");
    }

    return await ctx.db.patch(id, {
      isCompleted: !task.isCompleted,
    });
  },
});

// Delete task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});