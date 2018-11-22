import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import TypeKPI from './TypeKPI'
import TimeSlider from '../TimeSeries/TimeSlider'

@autobind class overviewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    	costData: [],
    	countData: [],
    	estIncData: [],
    	dateDiffData: []
    }

  }

  async fetchData() {
    let { token, globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { lowDate, highDate } = globalAnalysis


    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    let params = []

    lowDate ? params.push(`lowDate=${lowDate}`) : null
    highDate ? params.push(`highDate=${highDate}`) : null

    let costQuery = `/executive/costData?groupBy=interventionType&`  + params.join('&')
    let estIncQuery = `/executive/estIncData?groupBy=interventionType&`  + params.join('&')
    let countQuery = `/executive/countData?`  + params.join('&')
    let dateDiffQuery = '/executive/dateDiffData?'  + params.join('&')

    const data = await Promise.all([
      fetch(costQuery, headers).then(r => r.json()),
      fetch(estIncQuery, headers).then(r => r.json()),
      fetch(countQuery, headers).then(r => r.json()),
      fetch(dateDiffQuery, headers).then(r => r.json())
    ])
      .catch(error => {
        console.log('err', error)
      })

    let newState = {
      costData: data[0],
      estIncData: data[1],
      countData: data[2],
      dateDiffData: data[3]
    }

    this.setState(newState)

  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prev = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prev = prev.toJS()

    let { lowDate, highDate } = globalAnalysis

    if (prev.lowDate !== lowDate || highDate !== prev.highDate) {
      this.fetchData()  
    }
  }

  componentDidMount() {
  	this.fetchData()
  }


  render() {
  	let { costData, countData, estIncData, dateDiffData } = this.state


    costData = [{
        type: 'total',
        cost: costData.reduce((sum, curr) => sum + curr.totalCost, 0),
        estCost: costData.reduce((sum, curr) => sum + curr.totalEstimatedCost, 0)
    },{
        type: 'acido',
        cost: costData.find(i => i.interventionType === 'acido') ? costData.find(i => i.interventionType === 'acido').totalCost : 0,
        estCost: costData.find(i => i.interventionType === 'acido') ? costData.find(i => i.interventionType === 'acido').totalEstimatedCost : 0
    },{
        type: 'apuntalado',
        cost: costData.find(i => i.interventionType === 'apuntalado') ? costData.find(i => i.interventionType === 'apuntalado').totalCost : 0,
        estCost: costData.find(i => i.interventionType === 'apuntalado') ? costData.find(i => i.interventionType === 'apuntalado').totalEstimatedCost : 0
    },{
        type: 'estimulacionLimpieza',
        cost: costData.find(i => i.interventionType === 'estimulacionLimpieza') ? costData.find(i => i.interventionType === 'estimulacionLimpieza').totalCost : 0,
        estCost: costData.find(i => i.interventionType === 'estimulacionLimpieza') ? costData.find(i => i.interventionType === 'estimulacionLimpieza').totalEstimatedCost: 0
    },{
        type: 'estimulacionMatricial',
        cost: costData.find(i => i.interventionType === 'estimulacionMatricial') ? costData.find(i => i.interventionType === 'estimulacionMatricial').totalCost : 0,
        estCost: costData.find(i => i.interventionType === 'estimulacionMatricial') ? costData.find(i => i.interventionType === 'estimulacionMatricial').totalEstimatedCost : 0
    },{
        type: 'termico',
        cost: costData.find(i => i.interventionType === 'termico') ? costData.find(i => i.interventionType === 'termico').totalCost : 0,
        estCost: costData.find(i => i.interventionType === 'termico') ? costData.find(i => i.interventionType === 'termico').totalEstimatedCost : 0
    }]

    let data = [{
        name: 'Total',
        classname: '',
        numProposals: countData.reduce((sum, curr) => sum + curr.COUNT, 0),
        numResults: countData.reduce((sum, curr) => sum + curr.COUNT_RESULTS, 0),
        percResults:  countData.reduce((sum, curr) => sum + curr.COUNT_RESULTS, 0) / countData.reduce((sum, curr) => sum + curr.COUNT, 0) * 100,   
        prodEstimated: estIncData.reduce((sum, curr) => sum += curr.qo, 0),
        prodReal: estIncData.reduce((sum, curr) => sum += curr.qoResult, 0),
        percEstimated: estIncData.reduce((sum, curr) => sum += curr.qoResult, 0) * 100 / estIncData.reduce((sum, curr) => sum += curr.qo, 0),
        cost: costData.find(i => i.type === 'total').cost,
        estCost: costData.find(i => i.type === 'total').estCost,
        days: dateDiffData.reduce((sum, curr) => sum + (curr.avgDateDiff * curr.COUNT), 0) / dateDiffData.reduce((sum, curr) => sum + curr.COUNT, 0) 
    }, {
        name: 'Fracturamiento Ácido',
        classname: 'Acido',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT * 100: null,   
        prodEstimated: estIncData.find(i => i.groupedName === 'acido') ? estIncData.find(i => i.groupedName === 'acido').qo : null,
        prodReal: estIncData.find(i => i.groupedName === 'acido') ? estIncData.find(i => i.groupedName === 'acido').qoResult : null,
        percEstimated: estIncData.find(i => i.groupedName === 'acido') ? estIncData.find(i => i.groupedName === 'acido').qoResult * 100 / estIncData.find(i => i.groupedName === 'acido').qo : null,
        cost: costData.find(i => i.type === 'acido').cost,
        estCost: costData.find(i => i.type === 'acido').estCost,
        days: dateDiffData.find(i => i.type === 'acido') ? dateDiffData.find(i => i.type === 'acido').avgDateDiff : null
    }, {
        name: 'Fracturamiento Apuntalado',
        classname: 'Apuntalado',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT * 100 : null ,
        prodEstimated: estIncData.find(i => i.groupedName === 'apuntalado') ? estIncData.find(i => i.groupedName === 'apuntalado').qo : null,
        prodReal: estIncData.find(i => i.groupedName === 'apuntalado') ? estIncData.find(i => i.groupedName === 'apuntalado').qoResult : null,
        percEstimated: estIncData.find(i => i.groupedName === 'apuntalado') ? estIncData.find(i => i.groupedName === 'apuntalado').qoResult * 100 / estIncData.find(i => i.groupedName === 'apuntalado').qo : null,
        cost: costData.find(i => i.type === 'apuntalado').cost,
        estCost: costData.find(i => i.type === 'apuntalado').estCost,
        days: dateDiffData.find(i => i.type === 'apuntalado') ? dateDiffData.find(i => i.type === 'apuntalado').avgDateDiff : null
    }, {
        name: 'Estimulación Limpiezas',
        classname: 'Estimulacion',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT * 100 : null, 
        prodEstimated: estIncData.find(i => i.groupedName === 'estimulacionLimpieza') ? estIncData.find(i => i.groupedName === 'estimulacionLimpieza').qo : null,
        prodReal: estIncData.find(i => i.groupedName === 'estimulacionLimpieza') ? estIncData.find(i => i.groupedName === 'estimulacionLimpieza').qoResult : null,
        percEstimated: estIncData.find(i => i.groupedName === 'estimulacionLimpieza') ? estIncData.find(i => i.groupedName === 'estimulacionLimpieza').qoResult * 100 / estIncData.find(i => i.groupedName === 'estimulacionLimpieza').qo : null,
        cost: costData.find(i => i.type === 'estimulacionLimpieza').cost,
        estCost: costData.find(i => i.type === 'estimulacionLimpieza').estCost,
        days: dateDiffData.find(i => i.type === 'estimulacionLimpieza') ? dateDiffData.find(i => i.type === 'estimulacionLimpieza').avgDateDiff : null
    }, {
        name: 'Estimulación Matricial',
        classname: 'estimMatricial',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT * 100 : null, 
        prodEstimated: estIncData.find(i => i.groupedName === 'estimulacionMatricial') ? estIncData.find(i => i.groupedName === 'estimulacionMatricial').qo : null,
        prodReal: estIncData.find(i => i.groupedName === 'estimulacionMatricial') ? estIncData.find(i => i.groupedName === 'estimulacionMatricial').qoResult : null,
        percEstimated: estIncData.find(i => i.groupedName === 'estimulacionMatricial') ? estIncData.find(i => i.groupedName === 'estimulacionMatricial').qoResult * 100 / estIncData.find(i => i.groupedName === 'estimulacionMatricial').qo : null,
        cost: costData.find(i => i.type === 'estimulacionMatricial').cost,
        estCost: costData.find(i => i.type === 'estimulacionMatricial').estCost,
        days: dateDiffData.find(i => i.type === 'estimulacionMatricial') ? dateDiffData.find(i => i.type === 'estimulacionMatricial').avgDateDiff : null
    }, {
        name: 'Estimulación Térmica',
        classname: 'Termico',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT * 100 : null, 
        prodEstimated: estIncData.find(i => i.groupedName === 'termico') ? estIncData.find(i => i.groupedName === 'termico').qo : null,
        prodReal: estIncData.find(i => i.groupedName === 'termico') ? estIncData.find(i => i.groupedName === 'termico').qoResult : null,
        percEstimated: estIncData.find(i => i.groupedName === 'termico') ? estIncData.find(i => i.groupedName === 'termico').qoResult * 100 / estIncData.find(i => i.groupedName === 'termico').qo : null,
        cost: costData.find(i => i.type === 'termico').cost,
        estCost: costData.find(i => i.type === 'termico').estCost,
        days: dateDiffData.find(i => i.type === 'termico') ? dateDiffData.find(i => i.type === 'termico').avgDateDiff : null
    }]

    return (
      <div className='data'>
        <div style={{padding: '40px', paddingBottom: '0px'}}>
          <TimeSlider />
        </div>
        <div className="overview">
          <TypeKPI data={data[0]} />
          <TypeKPI data={data[1]} />
          <TypeKPI data={data[2]} />
          <TypeKPI data={data[3]} />
          <TypeKPI data={data[4]} />
          <TypeKPI data={data[5]} />
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

export default connect(mapStateToProps, mapDispatchToProps)(overviewUI)

