import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import Filters from '../Common/Filters'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import CostBar from './CostBar'
import AforosScatter from './AforosScatter'
import VolumeLine from './VolumeLine'

@autobind class timeSeriesUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      costData: [],
      aforosData: [],
      volumeData: []
    }
    this.cards = []
    for (let i = 0; i < 2; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  fetchData() {
  	console.log('fetching')
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { activo, field, well, formation } = globalAnalysis

    //TODO MAKE PARALLEL
    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    fetch('/api/getFieldWellMappingHasData', headers)
      .then(r => r.json())
      .then(r => {

        this.setState({
          fieldWellOptions: r
        })
    })

    fetch(`/timeSeries/costData`, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        costData: res
      })
    })

    fetch(`/timeSeries/aforosData`, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        aforosData: res
      })
    })


    fetch(`/timeSeries/volumeData`, {
      headers: {
        'content-type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(res => {
      this.setState({
        volumeData: res
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


		let { activo, field, well, formation } = globalAnalysis
    let activoPrev = prevGlobalAnalysis.activo
    let fieldPrev = prevGlobalAnalysis.field
    let wellPrev = prevGlobalAnalysis.well
    let formationPrev = prevGlobalAnalysis.formation

    if (activo !== activoPrev || field !== fieldPrev || well !== wellPrev || formation !== formationPrev) {
			this.fetchData()	
		}
  }

  render() {
    let { fieldWellOptions, costData, aforosData, volumeData } = this.state

    console.log('herherhehr', volumeData)
    return (
      <div className="data statistics">
        <div className='header'>
          <Filters fieldWellOptions={fieldWellOptions} />
        </div>
        <div className='content'>
          <CardDeck className="content-deck">
            <Card
                id="something"
                title="Time Series Data"
                ref={this.cards[0]}
              >
              <CostBar label='Costs' data={costData} />
              <AforosScatter label='Production' data={aforosData} />
              <VolumeLine label='Volume Usage' data={volumeData} />
            </Card>
          </CardDeck>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(timeSeriesUI)
