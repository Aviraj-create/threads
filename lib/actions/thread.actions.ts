"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { ThreadValidation } from "../validations/thread";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({ text, author, communityId, path }: Params) {

  try {

    await connectToDB();

    console.log(text,author);
    
  
  const createdThread = await Thread.create({
    text,
    author,
    community: null,
  });

  // Update user models
  await User.findByIdAndUpdate(author, {
    $push: { threads: createdThread._id } // Use createdThread._id here
  });

  revalidatePath(path);
    
  } catch (error:any) {
    throw new Error(`Error creating thread:${error.message}`)
    
  }
  
}

export async function fetchPosts(pageNumber=1,pageSize=20){
  await connectToDB();

  const skipAmount=(pageNumber-1)*pageSize;

  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
  .sort({ createdAt: 'desc' })
  .skip(skipAmount)
  .limit(pageSize)
  .populate({ path: 'author', model: 'User' }) // Fix the model value here
  .populate({
    path: 'children',
    populate: {
      path: 'author',
      model: 'User', // Fix the model value here
      select: '_id name parentId image'
    }
  })

  const totalPostsCount=await Thread.countDocuments({parentId:{$in:[null,undefined]}})
  const posts=await postsQuery.exec();
  const isNext=totalPostsCount>skipAmount+posts.length;
  return {posts,isNext};

}

export async function fetchThreadById(id:string) {

  await connectToDB();

  try {

    //TODO POP COMMUNITY

    const thread=await Thread.findById(id)
    .populate({
      path:'author',
      model:User,
      select:"_id id name image"
    })
    .populate({
      path:'children',
      populate:[
        {
          path:'author',
          model:User,
          select:"_id id name parentId image"
        },
        {
          path:'children',
          model:Thread,
          populate:{
            path:'author',
            model:User,
            select:"_id id name parentId image"
          }
        }
      ]
    }).exec();
    return thread;
    
  } catch (error:any) {
    throw new Error(`Error fetching thread:${error.message}`)
    
  }
  
}
