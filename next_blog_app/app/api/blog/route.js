import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import {writeFile} from 'fs/promises'
import { log } from "console";
import BlogModel from "@/lib/models/BlogModel";
const LoadDB=async()=>{
  await ConnectDB( )
}
LoadDB()

export async function GET(request) {
  console.log("Blog GET Hit");
  return NextResponse.json({ msg: "API Working" });
}

export async function POST(request) {
  const formData=await request.formdata()
  const timestamp=Date.now()

  const image=formData.get('image')
  const imageByteDate=await image.arrayBuffer()
  const buffer =Buffer.from(imageByteDate)
  const path=`./public/${timestamp}_${image.name}`
  await writeFile(path,buffer)
  const imgUrl=`/${timestamp}_${image.name}`

  const blogData={
    title:`${formData.get('title')}`,
    description:`${formData.get('description')}`,
    category:`${formData.get('category')}`,
    author:`${formData.get('author')}`,
    image:`${imgUrl}`,
    authorImg:`${formData.get('authorImg')}`
  }

  await BlogModel.create(blogData)
  console.log("Blog Saved ");
  
  console.log(imgUrl);
  return NextResponse.json({success:true,msg:"Blog Added"})
  
}
