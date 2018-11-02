import React from 'react'
import ExecutiveUI from '../components/Layout/TableroDeControlUI/Executive/ExecutiveUI'
import TimeSeriesUI from '../components/Layout/TableroDeControlUI/TimeSeries/TimeSeriesUI'
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
    path: '/tablero_control/timeSeries',
    exact: true,
    name: 'Time Series',
    class: 'tablero_control',
    component: () => <TimeSeriesUI />,
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