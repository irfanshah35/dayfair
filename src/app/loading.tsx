"use client"
// import Loader from '@/components/common/loader'
import React from 'react'
import dynamic from "next/dynamic";

const Loader = dynamic(() => import("../components/common/loader"), {
  loading: () => <></>,
  ssr: false,
});

export default function Loading() {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-9999'>
        <Loader />
    </div>
  )
}
