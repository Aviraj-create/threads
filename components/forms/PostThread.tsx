"use client"

import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { createThread } from "@/lib/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();


  const [threadContent, setThreadContent] = useState("");
  const { organization } = useOrganization();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!organization) {
      await createThread({
        text: threadContent,
        author: userId,
        communityId: null,
        path: pathname,
      });
    }
    else {

      await createThread({
        text: threadContent,
        author: userId,
        communityId: organization.id,
        path: pathname,
      });

    }



    router.push("/");
  };

  return (
    <form
      className='mt-10 flex flex-col justify-start gap-10'
      onSubmit={handleSubmit}
    >
      <div className='flex w-full flex-col gap-3'>
        <label className='text-base-semibold text-light-2'>Content</label>
        <textarea
          rows={15}
          className='no-focus border border-dark-4 bg-dark-3 text-light-1'
          value={threadContent}
          onChange={(e) => setThreadContent(e.target.value)}
        />
      </div>

      <button type='submit' className='bg-primary-500'>
        Post Thread
      </button>
    </form>
  );
}

export default PostThread;
