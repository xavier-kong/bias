import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
    fetchAllMembers: publicProcedure
    .query(async ({ ctx }) => {
        const members = await ctx.prisma.member.findMany({ 
            include: {
                group: true
            }
        });

        const groups = {} as Record<string, any>;

        for (const member of members) {
            if (!(member.group.name in groups)) {
                groups[member.group.name] = member.group;
            }
        }

        return {
            members,
            groups
        };
    }),
});
