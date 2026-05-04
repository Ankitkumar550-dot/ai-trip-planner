import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        subscription: v.string(),
    }),
    TripDetailTable: defineTable({
        tripId: v.string(),
        userEmail: v.string(),
        tripDetail: v.string(),
        destination: v.string(),
    })
});