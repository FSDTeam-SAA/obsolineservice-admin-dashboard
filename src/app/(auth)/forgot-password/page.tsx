import Image from 'next/image'
import React from 'react'
import ForgotPasswordForm from './_components/forgot-password-form'

import authImg from '../../../../public/assets/images/auth_sidebar.png'
const ForgotPasswordPage = () => {
  return (
    <div className='w-full min-h-screen grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0'>
      <div className='md:col-span-1'>
        <Image src={authImg} alt="Auth Image" width={1000} height={1000} className='object-cover w-full h-[400px] md:h-screen' />
      </div>
      <div className='md:col-span-1 w-full flex items-center justify-center'>
        <ForgotPasswordForm />
      </div>
    </div>)
}
export default ForgotPasswordPage