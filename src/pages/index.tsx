import Head from "next/head";
import { api } from "~/utils/api";
import { useUser, SignIn } from "@clerk/nextjs";
import { useRouter } from 'next/router'
import { useState } from "react";

function ProfileNameForm() {
    const [profileName, setProfileName] = useState("");
    const [error, setError] = useState("");
    const mutation = api.user.addProfileName.useMutation();

    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        setProfileName(e.currentTarget.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({ profileName });

        {/*while (mutation.status !== "success" && mutation.status !== "error") {
            console.log("tst");
        }*/}

        if (mutation?.data?.code === "success") {

        } else if (mutation?.data?.code === "exists") {
            setError("This username is already taken. Please try another.");
        } else {

        }
    }

    return (
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div>Enter your profile name</div><br />
            <div className="flex items-center border-b border-teal-500 py-2">
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Enter here!" aria-label="Full name" value={profileName} onChange={onNameChange}/>
                <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                    Enter
                </button>
            </div>
            {mutation.error ? <div>error</div> : <></>}
        </form>        

    )
}

export default function Home() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded) {

    }

    if (!isSignedIn) {
        return (
            <div>
                Test
                <SignIn />
            </div>
        )
    }

    if (isSignedIn && user && !user.publicMetadata?.profileName) {
        return <ProfileNameForm />
    }

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                Edit
            </main>
        </>
    );
}
