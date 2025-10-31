import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import {writeFile} from 'fs/promises'
import { log } from "console";
import BlogModel from "@/lib/models/BlogModel";
const LoadDB=async()=>{
  await ConnectDB( )
}
LoadDB()

//get all blog
export async function GET(request) {
  try {
    const blogId = request.nextUrl.searchParams.get("id");

    if (blogId) {
      // Fetch one blog by ID
      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, blog });
    }

    
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, blogs });
    
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs", error: error.message },
      { status: 500 }
    );
  }
}


//upload the blog
export async function POST(request) {
  try {
    

    // ✅ Corrected method name
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get("image");
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: imgUrl,
      authorImg: formData.get("authorImg"),
    };

    await BlogModel.create(blogData);
    console.log("✅ Blog Saved");
    console.log("🖼️ Image URL:", imgUrl);

    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (error) {
    console.error("❌ Error adding blog:", error);
    return NextResponse.json({ success: false, msg: "Error adding blog", error: error.message });
  }
}