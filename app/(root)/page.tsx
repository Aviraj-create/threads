"use server"
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from '@clerk/nextjs';


export default async function Home() {
  const result = await fetchPosts(1, 30);
  const user = await currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Threads Found</p>
        ) : (
          // Use parentheses to group content inside the condition
          <>
            {result.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={post.parentId}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
                imageUrl={post.imageUrl}
                caption={post.caption}
              />
            ))}
            {/* {JSON.stringify(result)} */}

          </>
        )}
      </section>
    </>
  );
}
