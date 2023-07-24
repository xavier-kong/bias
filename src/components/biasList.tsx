import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type RouterOutput = inferRouterOutputs<AppRouter>;
type BiasQueryOutput = RouterOutput['user']['fetchUserBiases'];
type Bias = RouterOutput['user']['fetchUserBiases']['userBiases'][0];

function BiasList({ biases, emptyMessage }: { biases: BiasQueryOutput | undefined, emptyMessage: string }) {
    if (!biases) {
        return (
            <div>{emptyMessage}</div>
        )
    }
    const userBiases = biases.userBiases;

    return (
        <>
            <table className="table-auto border-separate border-spacing-x-4 border-spacing-y-4">
                <thead>
                    <tr className="text-left">
                        <th>Group</th>
                        <th>Member</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userBiases.map((bias: Bias) => {
                            return (
                                <tr key={bias.memberId}>
                                    <td>
                                        <div className="flex flex-row space-x-4 items-center">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={bias.member.group.logoUrl} />
                                                <AvatarFallback>{`logo for ${bias.member.group.enName}`}</AvatarFallback>
                                            </Avatar>
                                            <div>{bias.member.group.enName}</div>
                                        </div>
                                    </td>
                                    <td className="flex space-x-7 justify-between items-center">
                                        <div className="">{bias.member.enName}</div>
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={bias.member.picUrl} />
                                            <AvatarFallback>{`pic for for ${bias.member.enName}`}</AvatarFallback>
                                        </Avatar>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default BiasList;
