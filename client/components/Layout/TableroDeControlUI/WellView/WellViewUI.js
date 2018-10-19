import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import WellSelect from '../Common/WellSelect'
import ProductionGraph from './ProductionGraph'
import PressureGraph from './PressureGraph'
import AforosGraph from './AforosGraph'
import KPIGroup from './KPIGroup'
import Images from './Images'

@autobind class wellViewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      wellData: [],
      zoneData: [],
      layerData: [],
      productionData: [],
      pressureData: [],
      aforosData: []
    }
  }

  fetchData() {
  	console.log('fetching')
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { well } = globalAnalysis

    //TODO MAKE PARALLEL
    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    fetch('/api/getFieldWellMapping', headers)
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r
        })
    })

    if (well) {
      console.log('this shouldnt be null', well)
      fetch(`/well/previousTransaction`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            well
          })
        })
      .then(res => res.json())
      .then(res => {
        console.log(res, res.success)
        if (!res.success !== false) {
          console.log('madeit')
          let transactionID = res[0].TRANSACTION_ID

          console.log(transactionID)

          fetch(`/well/wellData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              wellData: res
            })
          })

          fetch(`/well/zoneData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              zoneData: res
            })
          })

          fetch(`/well/layerData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              layerData: res
            })
          })

          fetch(`/well/productionData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              productionData: res
            })
          })

          fetch(`/well/pressureData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              pressureData: res
            })
          })

          fetch(`/well/aforosData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              aforosData: res
            })
          })

        }
      })     
    }
  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prevGlobalAnalysis = prevGlobalAnalysis.toJS()

		let { well } = globalAnalysis
    let wellPrev = prevGlobalAnalysis.well

    if (well !== wellPrev) {
			this.fetchData()	
		}
  }

  render() {
    let { fieldWellOptions, wellData, zoneData, layerData, productionData, pressureData , aforosData} = this.state

    console.log('well', wellData)
    console.log('zone', zoneData)
    console.log('layer', layerData)
    console.log('production', productionData)
    console.log('pressure', pressureData)
    console.log('aforos', aforosData)

    return (
      <div className="home">
        <WellSelect fieldWellOptions={fieldWellOptions}/>
        <KPIGroup data={wellData} />
        <ProductionGraph data={productionData} />
        <PressureGraph data={pressureData} />
        <AforosGraph data={aforosData} />
        <Images data={[]} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  globalAnalysis: state.get('globalAnalysis'),
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(wellViewUI)
