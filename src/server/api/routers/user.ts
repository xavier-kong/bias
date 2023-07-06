import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
        return {
            greeting: `Hello ${input.text}`,
        };
    }),
    addProfileName: privateProcedure
    .input(z.object({ profileName: z.string( )}))
    .query(({ input }) => {
        const inputProfileName = input.profileName;


        return {

        }
    })
});
