import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import JobBreakdown from './JobBreakdown'
import DeltaOil from './DeltaOil'
import DeltaWater from './DeltaWater'
import DeltaGas from './DeltaGas'
import Filters from '../Common/Filters'
import GroupBy from '../Common/GroupBy'
import LocalModal from '../Common/LocalModal'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import CostBar from './CostBar'
import AvgCostBar from './AvgCostBar'
import DeltaCostBar from './DeltaCostBar'
import AvgDeltaCostBar from './AvgDeltaCostBar'
import ExecutiveTable from './ExecutiveTable'
import TimeSlider from '../TimeSeries/TimeSlider'
import IncProdBar from './IncProdBar'
import AvgIncProdBar from './AvgIncProdBar'
import DeltaIncProdScatter from './DeltaIncProdScatter'
import AvgDeltaIncProdBar from './AvgDeltaIncProdBar'
import ProductionBarOil from './ProductionBarOil'
import ProductionBarGas from './ProductionBarGas'

@autobind class executiveUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    	jobBreakdownData: [],
      aforosData: [],
      aforosCarouselData: [],
      costData: [],
      singularCostData: [],
      execTableData: [],
      estIncData: [],
      volumeData: [],
      singularEstIncData: []
    }

    this.cards = []
    for (let i = 0; i < 7; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  buildExecTableExport(data, groupBy) {
    let exportData = []

    let newRow = []
    groupBy ? newRow.push('Name') : null

    newRow = newRow.concat([
      'Num Treatments', 
      'Num Acido', 
      'Num Apuntalado', 
      'Num Estimulacion Limpieza', 
      'Num Etimulacion Matricial', 
      'Num Termico', 
      'Total Cost', 
      'Est Inc Prod', 
      'Inc Prod', 
      'Date of Last Treatment', 
      'Type of Last Treatment', 
      'Total Sistema No Reactivo (m3)',
      'Total Sistema Reactivo (m3)',
      'Total Sistema Divergente (m3)',
      'Total Desplazamimento Liquido (m3)',
      'Total Desplazamiento N2 (m3)',
      'Total Precolchon N2 (m3)',
      'Total Liquido (m3)',
      'Total Apuntalante (sacos)',
      'Total Gel de Fractura (U.S. gal)',
      'Total Precolchon apuntalante (U.S. gal)',
      'Total Vapor Injected (ton)'])

    exportData.push(newRow)

    data.forEach(i => {
      newRow = []

      groupBy ? newRow.push(i.name) : null

      newRow = newRow.concat([
        i.numTreatments,
        i.numAcido,
        i.numApuntalado,
        i.numEstimulacionLimpieza,
        i.numEstimulacionMatricial,
        i.numTermico,
        i.cost,
        i.estProd,
        i.realProd,
        '-',
        '-',
        i.sistemaNoReactivo,
        i.sistemaReactivo,
        i.sistemaDivergente,
        i.desplazamientoLiquido,
        i.desplazamientoN2,
        i.precolchonN2,
        i.liquido,
        i.apuntalante,
        i.gelDeFractura,
        i.precolchonApuntalante,
        i.vapor
      ])

      exportData.push(newRow)
    })

    return exportData
  }

  async fetchData() {
    let { globalAnalysis } = this.props
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
    let query

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

    //TODO: MAKE PARALLEL
    let jobQuery = `/executive/jobBreakdown?` + params.join('&')
  	let aforosQuery = `/executive/aforosData?` + params.join('&')
    let aforosCarouselQuery = `/executive/aforosData?` + params.join('&') + `&carousel=1`
    let costQuery = `/executive/costData?` + params.join('&')
    let singularCostQuery = `/executive/costData?` + params.join('&') + `&noGroup=1`
    let execTableQuery = `/executive/tableData?` + params.join('&')
    let estIncQuery = `/executive/estIncData?` + params.join('&')
    let singularEstIncQuery = `/executive/estIncData?` + params.join('&') + `&noGroup=1`
    let volumeQuery = `/executive/volumeData?` + params.join('&')

    const data = await Promise.all([
      fetch(jobQuery, headers).then(r => r.json()),
      fetch(aforosQuery, headers).then(r => r.json()),
      fetch(aforosCarouselQuery, headers).then(r => r.json()),
      fetch(costQuery, headers).then(r => r.json()),
      fetch(singularCostQuery, headers).then(r => r.json()),
      fetch(execTableQuery, headers).then(r => r.json()),
      fetch(estIncQuery, headers).then(r => r.json()),
      fetch(volumeQuery, headers).then(r => r.json()),
      fetch(singularEstIncQuery, headers).then(r => r.json())
    ])
      .catch(error => {
        console.log('err', error)
      })


    let newState = {
      jobBreakdownData: data[0],
      aforosData: data[1],
      aforosCarouselData: data[2],
      costData: data[3],
      singularCostData: data[4], 
      execTableData: data[5],
      estIncData: data[6],
      volumeData: data[7],
      singularEstIncData: data[8]
    }

    this.setState(newState)

  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prev = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prev = prev.toJS()

    let { subdireccion, activo, field, well, formation, company, interventionType, terminationType, groupBy, lowDate, highDate } = globalAnalysis

    if (subdireccion !== prev.subdireccion || activo !== prev.activo || field !== prev.field || well !== prev.well || formation !== prev.formation ||
      company !== prev.company || interventionType !== prev.interventionType || terminationType !== prev.terminationType ||
      groupBy !== prev.groupBy || prev.lowDate !== lowDate || highDate !== prev.highDate) {
			this.fetchData()	
		}
  }

  render() {
    let { jobBreakdownData, aforosData, aforosCarouselData, costData, singularCostData, execTableData, estIncData, volumeData, singularEstIncData } = this.state
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { groupBy } = globalAnalysis

    execTableData = execTableData.map(i => {

        let estProd = estIncData.find(j => j.groupedName === i.groupedName) ? estIncData.find(j => j.groupedName === i.groupedName).qo : undefined
        let realProd = estIncData.find(j => j.groupedName === i.groupedName) ? estIncData.find(j => j.groupedName === i.groupedName).qoResult : undefined

        let volumen = groupBy 
                  ? (volumeData.find(j => j.groupedName === i.groupedName) ? volumeData.find(j => j.groupedName === i.groupedName) : {}) 
                  : (volumeData ? volumeData[0] : {})

        return {
            name: i.groupedName,
            numTreatments: i.NUM_TREATMENTS,
            numAcido: i.NUM_ACIDO,
            percAcido: i.NUM_ACIDO / i.NUM_TREATMENTS * 100,
            numApuntalado: i.NUM_APUNTALADO,
            percApuntalado: i.NUM_APUNTALADO / i.NUM_TREATMENTS * 100,
            numEstimulacionLimpieza: i.NUM_ESTIMULACION_LIMPIEZA,
            percEstimulacionLimpieza: i.NUM_ESTIMULACION_LIMPIEZA / i.NUM_TREATMENTS * 100,
            numEstimulacionMatricial: i.NUM_ESTIMULACION_MATRICIAL,
            percEstimulacionMatricial: i.NUM_ESTIMULACION_MATRICIAL / i.NUM_TREATMENTS * 100,
            numTermico: i.NUM_TERMICO,
            percTermico: i.NUM_TERMICO / i.NUM_TREATMENTS * 100,
            cost: i.COST ? i.COST.toFixed(0) : 0 ,
            estProd: estProd,
            realProd: realProd,
            dateType: '-',
            sistemaNoReactivo: volumen ? volumen.TOTAL_SISTEMA_NO_REACTIVO : undefined,
            sistemaReactivo: volumen ? volumen.TOTAL_SISTEMA_REACTIVO : undefined,
            sistemaDivergente: volumen ? volumen.TOTAL_SISTEMA_DIVERGENTE : undefined,
            desplazamientoLiquido: volumen ? volumen.TOTAL_DESPLAZAMIENTO_LIQUIDO : undefined,
            desplazamientoN2: volumen ? volumen.TOTAL_DESPLAZAMIENTO_N2 : undefined,
            precolchonN2: volumen ? volumen.TOTAL_PRECOLCHON_N2 : undefined,
            liquido: volumen ? volumen.TOTAL_LIQUIDO : undefined,
            apuntalante: volumen ? volumen.TOTAL_APUNTALANTE : undefined,
            gelDeFractura: volumen ? volumen.TOTAL_GEL_DE_FRACTURA : undefined,
            precolchonApuntalante: volumen ? volumen.TOTAL_PRECOLCHON_APUNTALANTE : undefined,
            vapor: volumen ? volumen.TOTAL_VAPOR_INJECTED : undefined,
        }
    })

    let exportData = this.buildExecTableExport(execTableData, groupBy)

    console.log(jobBreakdownData)
    console.log(estIncData)
    let productionBarData = {}
    estIncData.forEach(i => {
        let key = i.groupedName === 1 ? undefined : i.groupedName
        productionBarData[key] = i
    })

    console.log(productionBarData)
    return (
      <div className="data executive">
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
                id="execTable"
                title="Análisis de los Trabajos de Estimulación y Fracturamiento"
                ref={this.cards[6]}
                isTable={true}
              >       
              <ExecutiveTable data={execTableData} exportData={exportData} groupBy={groupBy} />
            </Card>
            <Card
                id="productionGraphs"
                title="Cumplimiento de Produccion Programada vs Real"
                ref={this.cards[0]}
                width={'50%'}
              >
              <DeltaOil label='Aceite' data={singularEstIncData} groupBy={groupBy} />
              <DeltaWater label='Agua' data={singularEstIncData} groupBy={groupBy} />
              <DeltaGas label='Gas' data={singularEstIncData} groupBy={groupBy} />
            </Card>
            <Card
                id="classifications"
                title="Clasificación y Producción"
                ref={this.cards[1]}
                width={'50%'}
                multiplyChartsOnGrouping
              >
              <JobBreakdown label='Tipo' data={jobBreakdownData} />
              <ProductionBarOil label='Aceite' data={estIncData} />
              <ProductionBarGas label='Gas' data={estIncData} />
{/*              <JobBreakdown label='Éxito' data={aforosCarouselData} />*/}
            </Card>
            <Card
                id="incProd"
                title="Producción Incremental"
                ref={this.cards[2]}
                width={'50%'}
              >
              <IncProdBar label={'Total'} data={estIncData} groupBy={groupBy} />  
              <AvgIncProdBar label={'Promedio'} data={estIncData} groupBy={groupBy} />  
            </Card>
            <Card
                id="incProdDeviations"
                title="Desviación de Producción Incremental"
                ref={this.cards[3]}
                width={'50%'}
              >       
              <DeltaIncProdScatter label={'Individual'} data={singularEstIncData} groupBy={groupBy} />
              <AvgDeltaIncProdBar label={'Promedio'} data={estIncData} groupBy={groupBy} />
            </Card>
            <Card
                id="costs"
                title="Costos"
                ref={this.cards[4]}
                width={'50%'}
              >
              <CostBar label={'Total'} data={costData} groupBy={groupBy} />  
              <AvgCostBar label={'Promedio'} data={costData} groupBy={groupBy} />  
            </Card>
            <Card
                id="costDeviations"
                title="Desviación de Costos"
                ref={this.cards[5]}
                width={'50%'}
              >       
              <DeltaCostBar label={'Individual'} data={singularCostData} groupBy={groupBy} />
              <AvgDeltaCostBar label={'Promedio'} data={costData} groupBy={groupBy} />
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

export default connect(mapStateToProps, mapDispatchToProps)(executiveUI)
