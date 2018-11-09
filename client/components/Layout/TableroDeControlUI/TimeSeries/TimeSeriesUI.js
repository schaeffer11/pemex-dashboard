import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import Filters from '../Common/Filters'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import CostBar from './CostBar'
import AforosScatter from './AforosScatter'
import VolumeLine from './VolumeLine'
import VolumeGasLine from './VolumeGasLine'
import TimeSlider from './TimeSlider'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'

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
    for (let i = 0; i < 3; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  async fetchData(sequence) {
    let { globalAnalysis, setGeneral } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { subdireccion, activo, field, well, formation, company, interventionType, terminationType, groupBy, lowDate, highDate } = globalAnalysis

    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }

    let params = []

    subdireccion ? params.push(`subdir=${subdireccion}`) : null
    activo ? params.push(`activo=${activo}`) : null
    field ? params.push(`field=${field}`) : null
    well ? params.push(`well=${well}`) : null
    formation ? params.push(`formation=${formation}`) : null
    company ? params.push(`company=${company}`) : null
    interventionType ? params.push(`tipoDeIntervencion=${interventionType}`) : null
    terminationType ? params.push(`tipoDeTerminacion=${terminationType}`) : null
    groupBy ? params.push(`groupBy=${groupBy}`) : null
    lowDate ? params.push(`lowDate=${lowDate}`) : null
    highDate ? params.push(`highDate=${highDate}`) : null



    let fieldWellOptionsQuery = `/api/getFieldWellMappingHasData`
    let costQuery = `/timeSeries/costData?` + params.join('&')
    let aforosQuery = `/timeSeries/aforosData?` + params.join('&')
    let volumesQuery = `/timeSeries/volumeData?` + params.join('&')
     
    const data = await Promise.all([
      fetch(fieldWellOptionsQuery, headers).then(r => r.json()),
      fetch(costQuery, headers).then(r => r.json()),
      fetch(aforosQuery, headers).then(r => r.json()),
      fetch(volumesQuery, headers).then(r => r.json()),
      fetch(`/api/getDates`, headers).then(r => r.json())
    ])
      .catch(error => {
        console.log('err', error)
      })

    console.log(data[4])

    let newState = {
      fieldWellOptions: data[0],
      costData: data[1],
      aforosData: data[2],
      volumeData: data[3]
    }

    if (sequence === 'initial') {
      setGeneral(['minDate'], data[4][0].MIN)
      setGeneral(['maxDate'], data[4][0].MAX) 
      setGeneral(['lowDate'], data[4][0].MIN)
      setGeneral(['highDate'], data[4][0].MAX) 
    }


    this.setState(newState)
  }

  componentDidMount() {
  	this.fetchData('initial')
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prev = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prev = prev.toJS()

    let { subdireccion, activo, field, well, formation, company, interventionType, terminationType, groupBy, lowDate, highDate } = globalAnalysis

    if (subdireccion !== prev.subdireccion || activo !== prev.activo || field !== prev.field || well !== prev.well || formation !== prev.formation ||
      company !== prev.company || interventionType !== prev.interventionType || terminationType !== prev.terminationType ||
      groupBy !== prev.groupBy || lowDate !== prev.lowDate || highDate !== prev.highDate) {
      this.fetchData('other')  
    }
  }


  render() {
    let { fieldWellOptions, costData, aforosData, volumeData } = this.state
    let { globalAnalysis } = this.props

    globalAnalysis = globalAnalysis.toJS()

    let { groupBy } = globalAnalysis

    return (
      <div className="data statistics">
        <div className='content'>
          <TimeSlider />
          <CardDeck className="content-deck">
            <Card
                id="costs"
                title="Costs"
                ref={this.cards[0]}
              >
              <CostBar data={costData} />
            </Card>
              <Card
                id="aforos"
                title="Production"
                ref={this.cards[1]}
              >
              <AforosScatter data={aforosData} groupBy={groupBy} />
            </Card>
              <Card
                id="volume"
                title="Volume Usage"
                ref={this.cards[2]}
                multiplyChartsOnGrouping
              >
              <VolumeLine label='Liquids' data={volumeData} />
              <VolumeGasLine label="Gases" data={volumeData} />
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
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(timeSeriesUI)
