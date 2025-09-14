import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all employees
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("employees").collect();
  },
});

// Get employees by department
export const getByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, { department }) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_department", (q) => q.eq("department", department))
      .collect();
  },
});

// Get active employees
export const getActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

// Add new employee
export const add = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    department: v.string(),
    position: v.string(),
    salary: v.number(),
    hireDate: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("employees")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("Employee with this email already exists");
    }

    return await ctx.db.insert("employees", {
      ...args,
      status: "active" as const,
    });
  },
});

// Update employee
export const update = mutation({
  args: {
    id: v.id("employees"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    department: v.optional(v.string()),
    position: v.optional(v.string()),
    salary: v.optional(v.number()),
    hireDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"), v.literal("terminated"))),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    // If updating email, check for duplicates
    if (updates.email) {
      const existing = await ctx.db
        .query("employees")
        .withIndex("by_email", (q) => q.eq("email", updates.email))
        .first();

      if (existing && existing._id !== id) {
        throw new Error("Employee with this email already exists");
      }
    }

    // Filter out undefined values to avoid Convex issues
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    return await ctx.db.patch(id, filteredUpdates);
  },
});

// Delete employee
export const remove = mutation({
  args: { id: v.id("employees") },
  handler: async (ctx, { id }) => {
    return await ctx.db.delete(id);
  },
});