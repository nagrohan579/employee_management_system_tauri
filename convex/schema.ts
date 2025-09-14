import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  employees: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    department: v.string(),
    position: v.string(),
    salary: v.number(),
    hireDate: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("terminated")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  }).index("by_email", ["email"])
    .index("by_department", ["department"])
    .index("by_status", ["status"]),

  departments: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    managerId: v.optional(v.id("employees")),
  }),

  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    assignedTo: v.optional(v.id("employees")),
    createdAt: v.string(),
    dueDate: v.optional(v.string()),
  }).index("by_employee", ["assignedTo"])
    .index("by_status", ["isCompleted"]),
});