import { useUser } from "@clerk/nextjs";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import BiasList from "~/components/biasList";
import Spinner from "~/components/spinner";
import { api } from "~/utils/api";
import Head from "next/head";

export const UserPage: NextPage<{ name: string }> = ({ name }) => {
    const biasQuery = api.user.fetchUserBiasesByName.useQuery({ name });
    const { isSignedIn } = useUser();

    while (biasQuery.isLoading) {
        return <Spinner />;
    }

    if (biasQuery.error?.message === "user not found") {
        // user not found page
        return (
            <div>user not found!</div>
        )
    }

    return (
        <>
            <Head>
                <title>{`${name}'s bias`}</title>
                <meta name="description" content={`${name}'s bias`} />
                <link rel="icon" href="/mark.ico" />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center">
                {
                    biasQuery.error?.message === "user not found" ? <div>user not found!</div> :
                        <div>
                            <div>{`${name}'s biases`}</div>
                            <BiasList biases={biasQuery.data} emptyMessage={`${name} has none! Go add your own!`} />
                        </div>
                }
                <Link href={`/`}>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{ isSignedIn ? 'Click to edit your page' : 'Click to sign up!'}</button>
                </Link>
            </div>
        </>
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
