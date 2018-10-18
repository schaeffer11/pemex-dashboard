import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import WellSelect from '../Common/WellSelect'

@autobind class wellViewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      wellData: [],
      zoneData: [],
      layerData: [],
      productionData: [],
      pressureData: []
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
      let transactionID = res

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



    })

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
    let { fieldWellOptions, wellData, zoneData, layerData, productionData, pressureData } = this.state

    console.log('well', wellData)
    console.log('zone', zoneData)
    console.log('layer', layerData)
    console.log('production', productionData)
    console.log('pressure', pressureData)

    return (
      <div className="home">
      SOMETHING GOES HERE
        <WellSelect fieldWellOptions={fieldWellOptions}/>
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
