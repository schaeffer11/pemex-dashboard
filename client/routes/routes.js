import React from 'react'
import ExecutiveUI from '../components/Layout/TableroDeControlUI/Executive/ExecutiveUI'
import StatisticsUI from '../components/Layout/TableroDeControlUI/Statistics/StatisticsUI'
import WellViewUI from '../components/Layout/TableroDeControlUI/WellView/WellViewUI'
import JobViewUI from '../components/Layout/TableroDeControlUI/JobView/JobViewUI'

const routes = () => [
  {
    path: '/tablero_control/executive',
    exact: true,
    name: 'Executive',
    class: 'tablero_control',
    component: () => <ExecutiveUI />,
  },
  {
    path: '/tablero_control/statistics',
    exact: true,
    name: 'Statistics',
    class: 'tablero_control',
    component: () => <StatisticsUI />,
  },
  {
    path: '/tablero_control/wellView',
    exact: true,
    name: 'Well View',
    class: 'tablero_control',
    component: () => <WellViewUI />,
  },
  {
    path: '/tablero_control/jobView',
    exact: true,
    name: 'Job View',
    class: 'tablero_control',
    component: () => <JobViewUI />,
  },
]
export default routes