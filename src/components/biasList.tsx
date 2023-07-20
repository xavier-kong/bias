import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import Image from 'next/image';

type RouterOutput = inferRouterOutputs<AppRouter>;
type BiasQueryOutput = RouterOutput['user']['fetchUserBiases'];

function BiasList({ biases, emptyMessage }: { biases: BiasQueryOutput | undefined, emptyMessage: string }) {
    if (!biases) {
        return (
            <div>{emptyMessage}</div>
        )
    }
    const userBiases = biases.userBiases;

    return (
        <table className="table-auto border-separate border-spacing-x-4">
            <thead>
                <tr className="text-left">
                    <th>Group</th>
                    <th>Member</th>
                </tr>
            </thead>
            <tbody>
                {
                    userBiases.map(bias => {
                        return (
                            <tr key={bias.memberId}>
                                <td>
                                    <div className="flex flex-row space-x-4 items-center">
                                        <Image src={bias.member.group.logoUrl} alt={`logo for ${bias.member.group.enName}`} width={64} height={64} className="" />
                                        <div>{bias.member.group.enName}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-row space-x-4 items-center">
                                        <div>{bias.member.enName}</div>
                                        <Image src={bias.member.picUrl} alt={`pic for for ${bias.member.enName}`} width={64} height={64} className="" />
                                    </div>
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
