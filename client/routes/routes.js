import React from 'react'
import Test from '../components/Layout/TableroDeControlUI/Test'
import Test2 from '../components/Layout/TableroDeControlUI/Test2'


const routes = () => [
  {
    path: '/tablero_control/test',
    exact: true,
    name: 'test',
    class: 'tablero_control',
    component: () => <Test />,
  },
  {
    path: '/tablero_control/test2',
    exact: true,
    name: 'test2',
    class: 'tablero_control',
    component: () => <Test2 />,
  },
]
export default routes