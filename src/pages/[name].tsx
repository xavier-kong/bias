import type { GetStaticProps, NextPage } from "next";
import BiasList from "~/components/biasList";
import Spinner from "~/components/spinner";
import { api } from "~/utils/api";

export const UserPage: NextPage<{ name: string }> = ({ name }) => {
    const biasQuery = api.user.fetchUserBiasesByName.useQuery({ name });

    while (biasQuery.isLoading) {
        return <Spinner />;
    }

    if (biasQuery.error?.message === "user not found") {
        // user not found page
        return (
            <div>use rnot found!</div>
        )
    }

    return (
        <div>
            <div>{`${name}'s biases`}</div>
            <BiasList biases={biasQuery.data} emptyMessage={`${name} has none! Go add your own!`} />
        </div>
    )
}

export default UserPage;

export const getStaticProps: GetStaticProps = (context) => {
    const name = context.params?.name;
    if (typeof name !== "string") throw new Error('no name');

    return {
        props: {
            name
        }
    };
}

export const getStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
}
