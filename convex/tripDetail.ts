import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateTripDeatils = mutation({
    args: {
        tripId: v.string(),
        userEmail: v.string(),
        tripPlan: v.string(),
        destination: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("TripDetailTable", {
            tripId: args.tripId,
            userEmail: args.userEmail,
            tripDetail: args.tripPlan,
            destination: args.destination || "",
        });

        return id;
    },
});

// ✅ Fixed query
export const getTrip = query({
    args: {
        tripId: v.string(),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.query("TripDetailTable").filter(q => q.eq(q.field("tripId"), args.tripId)).first();
        return trip;
    },
});

export const getTripsByUser = query({
    args: {
        userEmail: v.string(),
    },
    handler: async (ctx, args) => {
        const trips = await ctx.db.query("TripDetailTable").filter(q => q.and(q.eq(q.field("userEmail"), args.userEmail))).collect();
        return trips;
    },
});