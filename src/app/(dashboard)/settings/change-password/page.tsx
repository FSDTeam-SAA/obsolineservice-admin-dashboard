import React from 'react'
import SettingSidebar from '../_components/settings-sidebar'
import DashboardHeader from '@/components/ui/dashboard-header'
import ChangePasswordForm from './_components/change-password-form'

const ChangePasswordPage = () => {
  return (
    <div>
      <DashboardHeader title="Settings" desc="Ready to compete in your next match?" />
       <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-5">
        <div className="md:col-span-2 ">

          <SettingSidebar />
        </div>
        <div className="md:col-span-5 ">

          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage