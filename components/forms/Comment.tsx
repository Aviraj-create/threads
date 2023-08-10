"use client"
import React, { useState } from "react";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";

interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
    const [comment, setComment] = useState("");
    const pathname = usePathname();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (comment.trim() === "") {
            return;
        }

        await addCommentToThread(threadId, comment, currentUserId, pathname);

        setComment("");
    };

    const handleCommentChange = (e: any) => {
        setComment(e.target.value);
    };

    return (
        <form className='comment-form' onSubmit={handleSubmit}>
            <div className='flex w-full items-center gap-4'>
                <div className='comment-user-image'>
                    <Image
                        src={currentUserImg}
                        alt='current_user'
                        width={48}
                        height={48}
                        className='rounded-full object-cover'
                    />
                </div>
                <div className='w-full '>
                    <input
                        type='text'
                        value={comment}
                        onChange={handleCommentChange}
                        placeholder=' Comment...'
                        className='no-focus text-light-1 bg-dark-1 w-full h-10 p-4 rounded-lg outline-none'
                    />
                </div>
            </div>

            <button type='submit' className='comment-form_btn'>
                Reply
            </button>
        </form>
    );
};

export default Comment;
