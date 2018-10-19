import React from 'react'
import ExecutiveUI from '../components/Layout/TableroDeControlUI/Executive/ExecutiveUI'
import StatisticsUI from '../components/Layout/TableroDeControlUI/Statistics/StatisticsUI'
import WellViewUI from '../components/Layout/TableroDeControlUI/WellView/WellViewUI'
import JobViewUI from '../components/Layout/TableroDeControlUI/JobView/JobViewUI'

const routes = () => [
  {
    path: '/tablero_control/executive',
    exact: true,
    name: 'executive',
    class: 'tablero_control',
    component: () => <ExecutiveUI />,
  },
  {
    path: '/tablero_control/statistics',
    exact: true,
    name: 'statistics',
    class: 'tablero_control',
    component: () => <StatisticsUI />,
  },
  {
    path: '/tablero_control/wellView',
    exact: true,
    name: 'wellView',
    class: 'tablero_control',
    component: () => <WellViewUI />,
  },
  {
    path: '/tablero_control/jobView',
    exact: true,
    name: 'jobView',
    class: 'tablero_control',
    component: () => <JobViewUI />,
  },
]
export default routes