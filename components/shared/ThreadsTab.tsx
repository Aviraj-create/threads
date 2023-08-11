"use client"

import { fetchUserPost } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {

    currentUserId: string;
    accountId: string;
    accountType: string;

}
const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
    //TODO FETCH PROFILE THREADS

    let result = await fetchUserPost(accountId);
    if (!result) redirect('/')


    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((thread: any) => (

                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}//todo
                    community={thread.community}//todo
                    createdAt={thread.createAt}
                    comments={thread.children}
                />





            ))}
        </section>
    )
}
export default ThreadsTab