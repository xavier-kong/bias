import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import Image from 'next/image';

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
                                        <Image src={bias.member.group.logoUrl} alt={`logo for ${bias.member.group.enName}`} width={32} height={32} className="" />
                                        <div>{bias.member.group.enName}</div>
                                    </div>
                                </td>
                                <td className="flex space-x-7 justify-between items-center">
                                    <div className="">{bias.member.enName}</div>
                                    <Image src={bias.member.picUrl} alt={`pic for for ${bias.member.enName}`} width={99999} height={99999} className="rounded-full shrink-0 grow-0 h-12 w-12 float-right" />
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default BiasList;
