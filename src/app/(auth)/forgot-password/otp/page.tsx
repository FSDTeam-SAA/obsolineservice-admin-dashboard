import Image from 'next/image'
import React, { Suspense } from 'react'
import OtpForm from './_components/otp-form'
import authImg from '../../../../../public/assets/images/auth_sidebar.png'

const OtpPage = () => {
  return (
    <div className='w-full min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0'>
      <div className='md:col-span-1'>
        <Image src={authImg} alt="Auth Image" width={1000} height={1000} className='object-cover w-full h-[400px] md:h-screen' />
      </div>
      <div className='md:col-span-1 w-full flex items-center justify-center'>
        <Suspense fallback={<div>Loading...</div>}>
          <OtpForm />
        </Suspense>

      </div>
    </div>)
}
export default OtpPage