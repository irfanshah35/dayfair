"use client"
import Loader from '@/components/common/loader'
import React from 'react'

export default function Loading() {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-white/60 z-9999'>
        <Loader />
    </div>
  )
}
