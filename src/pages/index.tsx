import Head from "next/head";
import { api } from "~/utils/api";
import { useUser, SignIn } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Spinner from "~/components/spinner";
import BiasList from "~/components/biasList";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../utils/cn";
import { Button } from "../components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover"

type RouterOutput = inferRouterOutputs<AppRouter>;
type Member = RouterOutput["group"]["fetchAllMembers"]["members"][0];
type Bias = RouterOutput['user']['fetchUserBiases']['userBiases'][0];

function ProfileNameForm() {
    const [profileName, setProfileName] = useState("");
    const mutation = api.user.addProfileName.useMutation({
        onSuccess: () => {
            window.location.reload();
        }
    });

    const onNameChange = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        setProfileName(e.currentTarget.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const editedProfileName = profileName.replaceAll(" ", "-");
        mutation.mutate({ profileName: editedProfileName });
    }

    return (
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
            <div>Enter your nickname!</div><br />
            <div className="flex items-center border-b border-teal-500 py-2">
                <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Enter your nickname here!" aria-label="Full name" value={profileName} onChange={onNameChange}/>
                {
                    mutation.isLoading ? <Spinner /> : <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded" type="submit">
                        Enter
                    </button>
                }
            </div>
            {mutation.error ? <div>{mutation.error.message}</div> : <></>}
        </form>        
    )
}

function AddBiasForm({ addBias }: { addBias: (memberId: number, groupId: number) => void }) {
    const membersQuery = api.group.fetchAllMembers.useQuery();
    const [ openSelectGroup, setOpenSelectGroup ] = useState(false);
    const [ selectedGroup, setSelectedGroup ] = useState("");
    const [ selectedGroupId, setSelectedGroupId ] = useState<number | undefined>();

    const [ openSelectMember, setOpenSelectMember ] = useState(false);
    const [ selectedMember, setSelectedMember ] = useState<string | undefined>();
    const [ selectedMemberId, setSelectedMemberId ] = useState<number | undefined>();

    while (membersQuery.isLoading) {
        return <Spinner />;
    }

    const groups = membersQuery.data?.groups;
    if (!groups || groups.length === 0) throw new Error('no groups');

    const members = membersQuery.data?.members;
    if (!members) throw new Error('no members');

    return (
        <div>
            <div>
                <Popover open={openSelectGroup} onOpenChange={setOpenSelectGroup}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSelectGroup}
                            className="w-[250px] justify-between"
                        >
                            {selectedGroup
                                ? selectedGroup
                                : "Select group..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0">
                        <Command>
                            <CommandInput placeholder="Search group..." />
                            <CommandEmpty>No group found.</CommandEmpty>
                            <CommandGroup>
                                {groups.map((group) => (
                                    <CommandItem
                                        key={group.id}
                                        onSelect={() => {
                                            setSelectedGroup(group.enName);
                                            setSelectedGroupId(group.id);
                                            setOpenSelectGroup(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedGroup === group.enName ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {group.enName}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
            {
                selectedGroup ?             
                    <div className="py-2">
                        <Popover open={openSelectMember} onOpenChange={setOpenSelectMember} >
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openSelectMember}
                                    className="w-[250px] justify-between"
                                >
                                    {selectedMember
                                        ? selectedMember
                                        : "Select member..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search member..." />
                                    <CommandEmpty>No members found.</CommandEmpty>
                                    <CommandGroup>
                                        {
                                            members
                                            .filter((member: Member) => member.group.enName === selectedGroup)
                                            .map((member: Member) => (
                                                <CommandItem
                                                    key={member.id}
                                                    onSelect={() => {
                                                        setSelectedMember(member.enName);
                                                        setSelectedMemberId(member.id);
                                                        setOpenSelectMember(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedMember === member.enName ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {member.enName}
                                                </CommandItem>
                                            ))
                                        }
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>





                        {/*
                        <div className="relative w-full lg:max-w-sm">
                            <select className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600" onChange={
                                e => {
                                    e.preventDefault();
                                    const member = members
                                        .filter((member: Member) => member.groupId === selectedGroupId)
                                        .find((member: Member) => member.enName === e.target.value)

                                    setSelectedMember(member?.enName);
                                    setSelectedMemberId(member?.id);
                                }}
                                value={selectedMember}>
                                <option key="empty">Select a member...</option>
                                {
                                    members
                                    .filter((member: Member) => member.group.enName === selectedGroup)
                                    .map((member: Member) => (
                                        <option key={member.id} id={member.id.toString()}>{member.enName}</option>
                                    ))
                                }
                            </select>
                        </div> 
                          */}


                    </div>: <div></div>
            }

            <div className="items-center">
                {
                    selectedMember ? 
                        <button onClick={() => {
                            if (selectedMemberId && selectedGroupId) {
                                addBias(selectedMemberId, selectedGroupId);
                                setSelectedGroup("");
                                setSelectedMember(undefined);
                            } else {
                                // error
                            }
                            }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add
                        </button> : <div></div>
                }
            </div>
        </div>
    )

}

const useOutsideClick = (callback: () => void) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback]);

    return ref;
};

export default function Home() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [ showAddForm, setShowAddFrom ] = useState(false);
    const ctx = api.useContext();
    {/*const outsideClickRef = useOutsideClick(() => {
        setShowAddFrom(false);
    });*/}

    const biases = api.user.fetchUserBiases.useQuery();
    const { mutate: updateUserBiasMutation, isLoading: updateUserBiasMutationLoading } = api.user.updateUserBias.useMutation({
        onSuccess: () => {
            void ctx.user.fetchUserBiases.invalidate();
        }
    });
    const { mutate: addUserBiasMutation, isLoading: addUserBiasMutationLoading } = api.user.addUserBias.useMutation({
        onSuccess: () => {
            void ctx.user.fetchUserBiases.invalidate();
        }
    });

    while (!isLoaded) {
        return <Spinner />;
    }

    if (!isSignedIn) {
        return (<div><SignIn /></div>)
    }

    if (isSignedIn && user && !user.publicMetadata?.profileName) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center"><ProfileNameForm /></div>)
    }

    while (biases.isLoading || addUserBiasMutationLoading || updateUserBiasMutationLoading) {
        return <Spinner />
    }

    const addBias = (memberId: number, groupId: number) => {
        const bias = biases.data?.userBiases.find((bias: Bias) => bias.member.groupId === groupId);
        if (bias) {
            updateUserBiasMutation({ memberId, biasId: bias.id });
        } else {
            addUserBiasMutation({ memberId });
        }
        setShowAddFrom(false);
    }

    return (
        <>
            <Head>
                <title>My Page</title>
                <meta name="description" content="Edit my page" />
                <link rel="icon" href="/mark.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center">
                {
                    showAddForm ? <></> : <BiasList biases={biases.data} emptyMessage="Click the add button below to add" />
                }
                {
                    showAddForm ? 
                        //<div ref={outsideClickRef}>
                        <AddBiasForm addBias={addBias} /> 
                        //</div>
                        : <div></div>
                }
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={() => setShowAddFrom(!showAddForm)}>{showAddForm ? "Close" : "Add"}</button>
            </main>
        </>
    );
}
