"use client"

import { ChangeEvent, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { createThread } from "@/lib/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import Image from "next/image";

interface Props {
  userId: string;
}

function PostThread({ userId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // const [threadContent, setThreadContent] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [img, setImg] = useState<string>("");
  const { organization } = useOrganization();
  const { startUpload } = useUploadThing("media");

  console.log(img);


  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes('image')) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        setImg(imageDataUrl)
      }
      fileReader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let tmpImg = img;

    if (isBase64Image(img)) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        tmpImg = imgRes[0].fileUrl;
      }
    }

    if (!organization) {
      await createThread({

        author: userId,
        communityId: null,
        path: pathname,
        imageUrl: tmpImg,
        caption: caption
      });
    }
    else {

      await createThread({
        author: userId,
        communityId: organization.id,
        path: pathname,
        imageUrl: tmpImg,
        caption: caption
      });

    }

    router.push("/");
  };

  return (
    <form
      className='mt-10 flex flex-col justify-start gap-10'
      onSubmit={handleSubmit}
    >
      {/* <div className='flex w-full flex-col gap-3'>
        <label className='text-base-semibold text-light-2'>Content</label>
        <textarea
          rows={15}
          className='no-focus border border-dark-4 bg-dark-3 text-light-1'
          value={threadContent}
          onChange={(e) => setThreadContent(e.target.value)}
        />
      </div> */}

      <div className='flex w-full flex-col gap-3'>


        <label className="account-form_image-label">
          {img ? (
            <Image
              src={img}
              alt='profile photo'
              width={96}
              height={96}
              priority
              className="rounded-full object-contians"
            />
          ) : (
            <Image
              src='/assets/profile.svg'
              alt='profile photo'
              width={24}
              height={24}
              className="object-contians"
            />
          )}
        </label>

        <input
          type="file"
          accept="image/*"
          placeholder="Upload a photo"
          className="account-form_image-input"
          onChange={handleImage}
        />
      </div>

      <div className='flex w-full flex-col gap-3'>
        <label className='text-base-semibold text-light-2'>Caption</label>
        <textarea
          rows={15}
          className='no-focus border border-dark-4 bg-dark-3 text-light-1'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      <button type='submit' className='bg-primary-500'>
        Post Thread
      </button>
    </form>
  );
}

export default PostThread;
