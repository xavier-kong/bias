import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

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
        <table className="table-auto">
            <thead>
                <tr>
                    <th>Group</th>
                    <th>Member</th>
                </tr>
            </thead>
            <tbody>
                {
                    userBiases.map(bias => {
                        return (
                            <tr key={bias.memberId}>
                                <td>{bias.member.group.enName}</td>
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
