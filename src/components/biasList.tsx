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
                                    <Image src={bias.member.group.logoUrl} alt={`logo for ${bias.member.group.enName}`}/>
                                    {bias.member.group.enName}
                                </td>
                                <td>{bias.member.enName}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default BiasList;
