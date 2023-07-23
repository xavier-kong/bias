//import { z } from "zod";
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
        const groupArr = [];

        for (const member of members) {
            const name = member.group.enName;
            if (!(name in groups)) {
                groups[name] = true;
                groupArr.push(member.group);
            }
        }

        return {
            members,
            groups: groupArr
        };
    }),
});
