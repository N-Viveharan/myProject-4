'use client'
import { assets} from '@/Assets/assets'
import Fooder from '@/Components/Fooder'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useParams } from "next/navigation";

const page = () => {
   const [data, setData] = useState(null);
  const { id } = useParams(); // ✅ get dynamic route parameter

  const fetchBlogData = async () => {
    try {
      const response = await axios.get("/api/blog", {
        params: { id }, // ✅ use the id from useParams
      });

      if (response.data.success) {
        setData(response.data.blog);
      } else {
        console.error("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  useEffect(() => {
    if (id) fetchBlogData(); // ✅ fetch only if id exists
  }, [id]);

  return (data?<>
    <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
      <div className='flex justify-between items-center'>
        <Link href={'/'}>
        <Image src={assets.logo} alt='' width={180} className='w-[130px] sm:w-auto'/>
        </Link>
        <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 
        sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
          Get started <Image src={assets.arrow} alt=''/>
          </button>
      </div>
      <div className='text-center my-24'>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px]
        mx-auto'>{data.title}</h1>
        <Image src={assets.profile_icon} width={60} height={60} alt=''
        className='mx-auto mt-6 border border-white rounded-full '/>
        <p className='mt-1 pd-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
      </div>

    </div>
    <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
      <Image src={data.image} width={1280} height={720} alt=''
      className='border-4 border-white'/>
      <h1 className='my-8 text-[26px] font-semibold'>Introduction</h1>
     

      <div className='blog-content' dangerouslySetInnerHTML={{__html:data.description}}></div>
  
         <div className='my-24'>
           <p className='text-black font font-semibold my-4'>Share this article on social media</p>
           <div className='flex'>
            <Image src={assets.facebook_icon} width={50} alt=''/>
            <Image src={assets.twitter_icon} width={50} alt=''/>
            <Image src={assets.googleplus_icon} width={50} alt=''/>
           </div>
         </div>
    </div>
    <Fooder/>
    </>:<></>
  )
}

export default page