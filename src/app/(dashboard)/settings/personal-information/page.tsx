import React from 'react'
import SettingSidebar from '../_components/settings-sidebar'
import PersonalInformationForm from './_components/personal-information-form'
import DashboardHeader from '@/components/ui/dashboard-header'

const PersonalInfoPage = () => {
  return (
    <div className=''>
      <DashboardHeader title="Settings" desc="Ready to compete in your next match?" />
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-5">
        <div className="md:col-span-2">

          <SettingSidebar />
        </div>
        <div className="h-auto md:col-span-5">

          <PersonalInformationForm />
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoPage