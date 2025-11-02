import { assets } from '@/Assets/assets'
import Image from 'next/image'
import React from 'react'

function BlogTableItem({ mongoId, title, author, authorImg, date ,deleteBlog}) {
    const BlogDate=new Date(date)
  return (
    <tr className='bg-white border-b'>
      {/* Author image */}
      <th
        scope='row'
        className='items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap'
      >
        <Image
          src={authorImg ? authorImg : assets.profile_icon}
          alt={author || 'Author'}
          width={40}
          height={40}
          className='rounded-full'
        />
        <span className='ml-2'>{author ? author : 'Unknown Author'}</span>
      </th>

      {/* Blog title */}
      <td className='px-6 py-4'>
        {title ? title : 'Untitled Blog'}
      </td>

      {/* Date */}
      <td className='px-6 py-4'>
        {BlogDate.toDateString()}
      </td>

      {/* Example delete or edit cell */}
      <td onClick={()=>deleteBlog(mongoId)} className='px-6 py-4 cursor-pointer'>
        x
      </td>
    </tr>
  )
}

export default BlogTableItem
