import React from 'react'
import FeatureSectionContainer from './_components/feature-section-container'
import DashboardOverviewHeader from '../_components/dashboard-overview-header'

const FeatureSectionPage = () => {
  return (
    <div>
       <DashboardOverviewHeader
        title="Feature Section"
        description="Feature highlights shown in the banner below the hero · 4 items"
      />
      <FeatureSectionContainer/>
    </div>
  )
}

export default FeatureSectionPage
