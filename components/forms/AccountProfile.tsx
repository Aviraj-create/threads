"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useUploadThing } from '@/lib/uploadthing';
import { UserValidation } from '@/lib/validations/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { isBase64Image } from "@/lib/utils";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";



interface Props {
  user: {
    id: string | undefined,
    username: string | null | undefined,
    bio: string,
    image: string | undefined;
  };
  btnTitle: string;
}

const AccountProfile: React.FC<Props> = ({ user, btnTitle }) => {

  const rtr = useRouter()

  const { startUpload } = useUploadThing("media");
  const [files, setFiles] = useState<File[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string>(user?.image || "");
  const [username, setUsername] = useState<string>(user?.username || "");
  const [bio, setBio] = useState<string>(user?.bio || "");

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
      if (!file.type.includes('image')) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';
        setProfilePhoto(imageDataUrl);
      }
      fileReader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const values = {
      profile_photo: profilePhoto,
      username: username,
      bio: bio
    };

    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    // Your form submission logic here
    console.log("Form values:", values);

    rtr.push("/")

  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-start gap-10">
      <div className="flex items-center gap-4">
        <label className="account-form_image-label">
          {profilePhoto ? (
            <Image
              src={profilePhoto}
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

      <div className="flex flex-col w-full gap-3">
        <label className="text-base-semibold text-light-2">Username</label>
        <Input
          type="text"
          className="account-form_input no-focus"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full gap-3 ">
        <label className="text-base-semibold text-light-2">Bio</label>
        <Textarea
          rows={10}
          className="account-form_input no-focus"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <Button type="submit" className="bg-primary-500">{btnTitle}</Button>
    </form>
  );
}

export default AccountProfile;
