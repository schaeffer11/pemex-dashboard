import React from 'react'
import ExecutiveUI from '../components/Layout/TableroDeControlUI/Executive/ExecutiveUI'
import TimeSeriesUI from '../components/Layout/TableroDeControlUI/TimeSeries/TimeSeriesUI'
import WellViewUI from '../components/Layout/TableroDeControlUI/WellView/WellViewUI'
import JobViewUI from '../components/Layout/TableroDeControlUI/JobView/JobViewUI'
import OverviewUI from '../components/Layout/TableroDeControlUI/Overview/OverviewUI'

const routes = () => [
  {
    path: '/tablero_control/resumen_general',
    exact: true,
    name: 'Resumen General',
    class: 'tablero_control',
    component: () => <OverviewUI />,
  },
  {
    path: '/tablero_control/analisis_ejecutivo',
    exact: true,
    name: 'Análisis Ejecutivo',
    class: 'tablero_control',
    component: () => <ExecutiveUI />,
  },
  {
    path: '/tablero_control/analisis_cronologico',
    exact: true,
    name: 'Análisis Cronológico',
    class: 'tablero_control',
    component: () => <TimeSeriesUI />,
  },
  {
    path: '/tablero_control/pozo',
    exact: true,
    name: 'Pozos',
    class: 'tablero_control',
    component: () => <WellViewUI />,
  },
  {
    path: '/tablero_control/intervenciones',
    exact: true,
    name: 'Intervenciones',
    class: 'tablero_control',
    component: () => <JobViewUI />,
  },
]
export default routes