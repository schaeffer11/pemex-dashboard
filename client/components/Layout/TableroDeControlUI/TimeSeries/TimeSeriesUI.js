import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import CostBar from './CostBar'
import AforosScatter from './AforosScatter'
import Filters from '../Common/Filters'
import GroupBy from '../Common/GroupBy'
import LocalModal from '../Common/LocalModal'
import VolumeLine from './VolumeLine'
import VolumeGasLine from './VolumeGasLine'
import TimeSlider from './TimeSlider'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'
import ProductionBubble from './ProductionBubble'
import ProductionGasBubble from './ProductionGasBubble'
import VolumeCostBubble from './VolumeCostBubble'
import VolumeGasCostBubble from './VolumeGasCostBubble'
import ProductionTreatmentsBar from './ProductionTreatmentsBar'
import ProductionGasTreatmentsBar from './ProductionGasTreatmentsBar'
import VolumeTreatments from './VolumeTreatments'
import VolumeGasTreatments from './VolumeGasTreatments'

@autobind class timeSeriesUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      costData: [],
      aforosData: [],
      volumeData: [],
      numTreatmentData: [],
      incProdData: []
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
    let incProdQuery = `/timeSeries/incProdData?` + params.join('&')
    let volumesQuery = `/timeSeries/volumeData?` + params.join('&')
    let numTreatmentsQuery = `/timeSeries/numTreatmentData?` + params.join('&')

    const data = await Promise.all([
      fetch(fieldWellOptionsQuery, headers).then(r => r.json()),
      fetch(costQuery, headers).then(r => r.json()),
      // fetch(aforosQuery, headers).then(r => r.json()),
      fetch(incProdQuery, headers).then(r => r.json()),
      fetch(volumesQuery, headers).then(r => r.json()),
      fetch(numTreatmentsQuery, headers).then(r => r.json()),
    ])
      .catch(error => {
        console.log('err', error)
      })


    let newState = {
      fieldWellOptions: data[0],
      costData: data[1],
      incProdData: data[2],
      volumeData: data[3],
      numTreatmentData: data[4]
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
    let { fieldWellOptions, costData, aforosData, volumeData, numTreatmentData, incProdData } = this.state
    let { globalAnalysis } = this.props

    globalAnalysis = globalAnalysis.toJS()

    let { groupBy } = globalAnalysis
    let incProdCarouselData = {}

    if (incProdData.length > 0) {
      if (groupBy) {
        let groups = []

        incProdData.forEach(i => {
          if (!groups.includes(i.groupedName)) {
            groups.push(i.groupedName)
          }
        })


        groups.forEach(name => {
          incProdCarouselData[name] = incProdData.filter(j => j.groupedName === name)
        }) 
      }
      else {
        incProdCarouselData = {
          undefined: incProdData
        }
      }
    }

    return (
      <div className="data statistics">
        <div className='content'>
          <TimeSlider />
          <div>
            <LocalModal title="Filtros">
              <Filters />
            </LocalModal>
            <div className="groupBy-selection">
              <GroupBy />
            </div>
          </div>
          <CardDeck className="content-deck">
            <Card
                id="productionCost"
                title="Producción Incremental vs Costos Reales"
                ref={this.cards[0]}
                width={'50%'}
              >
              <ProductionBubble label='Aceite' data={incProdData} costData={costData} groupBy={groupBy} />
              <ProductionGasBubble label='Gas' data={incProdData} costData={costData} groupBy={groupBy} />
            </Card>
              <Card
                id="volumeCost"
                title="Volúmenes Inyectados vs Costos Reales"
                ref={this.cards[0]}
                width={'50%'}
              >
              <VolumeCostBubble label='Líquidos' data={volumeData} costData={costData} groupBy={groupBy} />
              <VolumeGasCostBubble label='Gases' data={volumeData} costData={costData} groupBy={groupBy} />
            </Card>
              <Card
                id="productionTreatments"
                title="Producción Incremental y Número de Tratamientos"
                ref={this.cards[0]}
                width={'50%'}
                multiplyChartsOnGrouping
              >
              <ProductionTreatmentsBar label='Aceite' data={incProdCarouselData} numTreatmentData={numTreatmentData} groupBy={groupBy} />
              <ProductionGasTreatmentsBar label="Gas" data={incProdCarouselData} numTreatmentData={numTreatmentData} groupBy={groupBy} />
            </Card>
              <Card
                id="volumeTreatments"
                title="Volúmenes Inyectados y Número de Tratamientos"
                ref={this.cards[0]}
                width={'50%'}
                multiplyChartsOnGrouping
              >
              <VolumeTreatments label='Líquidos' data={volumeData} numTreatmentData={numTreatmentData} groupBy={groupBy} />
              <VolumeGasTreatments label='Gases' data={volumeData} numTreatmentData={numTreatmentData} groupBy={groupBy} />
            </Card>
            <Card
                id="costs"
                title="Costos Reales"
                ref={this.cards[1]}
                width={'50%'}
              >
              <CostBar data={costData} />
            </Card>
              <Card
                id="volume"
                title="Volúmenes Inyectados"
                ref={this.cards[2]}
                width={'50%'}
                multiplyChartsOnGrouping
              >
              <VolumeLine label='Líquidos' data={volumeData} />
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
