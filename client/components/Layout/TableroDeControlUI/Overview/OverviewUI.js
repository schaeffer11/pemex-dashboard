import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import ExecutiveTable from './ExecutiveTable'
import TypeKPI from './TypeKPI'
import TimeSlider from '../TimeSeries/TimeSlider'

@autobind class overviewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    	aforosData: [],
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

  	let aforosQuery = `/executive/aforosData?`  + params.join('&')
    let costQuery = `/executive/costData?groupBy=interventionType&`  + params.join('&')
    let estIncQuery = `/executive/estIncData?groupBy=interventionType&`  + params.join('&')
    let countQuery = `/executive/countData?`  + params.join('&')
    let dateDiffQuery = '/executive/dateDiffData?'  + params.join('&')

    const data = await Promise.all([
      fetch(aforosQuery, headers).then(r => r.json()),
      fetch(costQuery, headers).then(r => r.json()),
      fetch(estIncQuery, headers).then(r => r.json()),
      fetch(countQuery, headers).then(r => r.json()),
      fetch(dateDiffQuery, headers).then(r => r.json())
    ])
      .catch(error => {
        console.log('err', error)
      })

    let newState = {
      aforosData: data[0],
      costData: data[1],
      estIncData: data[2],
      countData: data[3],
      dateDiffData: data[4]
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
  	let { aforosData, costData, countData, estIncData, dateDiffData } = this.state

    console.log(costData)

    aforosData = [{
        type: 'total',
        qo: aforosData.reduce((sum, curr) => sum + curr.qoResult, 0)
    }, {
        type: 'acido',
        qo: aforosData.filter(i => i.interventionType === 'acido').reduce((sum, curr) => sum + curr.qoResult, 0)
    }, {
        type: 'apuntalado',
        qo: aforosData.filter(i => i.interventionType === 'apuntalado').reduce((sum, curr) => sum + curr.qoResult, 0)
    }, {
        type: 'estimulacionMatricial',
        qo: aforosData.filter(i => i.interventionType === 'estimulacionMatricial').reduce((sum, curr) => sum + curr.qoResult, 0)
    },{
        type: 'termico',
        qo: aforosData.filter(i => i.interventionType === 'termico').reduce((sum, curr) => sum + curr.qoResult, 0)
    },{
        type: 'estimulacionLimpieza',
        qo: aforosData.filter(i => i.interventionType === 'estimulacionLimpieza').reduce((sum, curr) => sum + curr.qoResult, 0)
    }]


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
        prodEstimated: estIncData.reduce((sum, curr) => sum += curr.EST_INC_Qo, 0),
        prodReal: aforosData.find(i => i.type === 'total').qo,
        percEstimated: aforosData.find(i => i.type === 'total').qo * 100 / estIncData.reduce((sum, curr) => sum += curr.EST_INC_Qo, 0),
        cost: costData.find(i => i.type === 'total').cost,
        estCost: costData.find(i => i.type === 'total').estCost,
        days: dateDiffData.reduce((sum, curr) => sum + (curr.avgDateDiff * curr.COUNT), 0) / dateDiffData.reduce((sum, curr) => sum + curr.COUNT, 0) 
    }, {
        name: 'Fractuarmiento Acido',
        classname: 'Acido',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT * 100: null,   
        prodEstimated: estIncData.find(i => i.groupedName === 'acido') ? estIncData.find(i => i.groupedName === 'acido').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'acido') ? aforosData.find(i => i.type === 'acido').qo : null,
        percEstimated: estIncData.find(i => i.groupedName === 'acido') && aforosData.find(i => i.type === 'acido') ? aforosData.find(i => i.type === 'acido').qo * 100 / estIncData.find(i => i.groupedName === 'acido').EST_INC_Qo : null,
        cost: costData.find(i => i.type === 'acido').cost,
        estCost: costData.find(i => i.type === 'acido').estCost,
        days: dateDiffData.find(i => i.type === 'acido') ? dateDiffData.find(i => i.type === 'acido').avgDateDiff : null
    }, {
        name: 'Fractuaramiento Apuntalado',
        classname: 'Apuntalado',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT * 100 : null ,
        prodEstimated: estIncData.find(i => i.groupedName === 'apuntalado') ? estIncData.find(i => i.groupedName === 'apuntalado').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'apuntalado') ? aforosData.find(i => i.type === 'apuntalado').qo : null,
        percEstimated: estIncData.find(i => i.groupedName === 'apuntalado') && aforosData.find(i => i.type === 'apuntalado') ? aforosData.find(i => i.type === 'apuntalado').qo * 100 / estIncData.find(i => i.groupedName === 'apuntalado').EST_INC_Qo : null,
        cost: costData.find(i => i.type === 'apuntalado').cost,
        estCost: costData.find(i => i.type === 'apuntalado').estCost,
        days: dateDiffData.find(i => i.type === 'apuntalado') ? dateDiffData.find(i => i.type === 'apuntalado').avgDateDiff : null
    }, {
        name: 'Estimulacion Limpieza',
        classname: 'Estimulacion',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionLimpieza').COUNT * 100 : null, 
        prodEstimated: estIncData.find(i => i.groupedName === 'estimulacionLimpieza') ? estIncData.find(i => i.groupedName === 'estimulacionLimpieza').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'estimulacionLimpieza') ? aforosData.find(i => i.type === 'estimulacionLimpieza').qo : null,
        percEstimated: estIncData.find(i => i.groupedName === 'estimulacionLimpieza') && aforosData.find(i => i.type === 'estimulacionLimpieza') ? aforosData.find(i => i.type === 'estimulacionLimpieza').qo * 100 / estIncData.find(i => i.groupedName === 'estimulacionLimpieza').EST_INC_Qo : null,
        cost: costData.find(i => i.type === 'estimulacionLimpieza').cost,
        estCost: costData.find(i => i.type === 'estimulacionLimpieza').estCost,
        days: dateDiffData.find(i => i.type === 'estimulacionLimpieza') ? dateDiffData.find(i => i.type === 'estimulacionLimpieza').avgDateDiff : null
    }, {
        name: 'Estimulacion Matricial',
        classname: 'estimMatricial',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacionMatricial').COUNT * 100 : null, 
        prodEstimated: estIncData.find(i => i.groupedName === 'estimulacionMatricial') ? estIncData.find(i => i.groupedName === 'estimulacionMatricial').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'estimulacionMatricial') ? aforosData.find(i => i.type === 'estimulacionMatricial').qo : null,
        percEstimated: estIncData.find(i => i.groupedName === 'estimulacionMatricial') && aforosData.find(i => i.type === 'estimulacionMatricial') ? aforosData.find(i => i.type === 'estimulacionMatricial').qo * 100 / estIncData.find(i => i.groupedName === 'estimulacionMatricial').EST_INC_Qo : null,
        cost: costData.find(i => i.type === 'estimulacionMatricial').cost,
        estCost: costData.find(i => i.type === 'estimulacionMatricial').estCost,
        days: dateDiffData.find(i => i.type === 'estimulacionMatricial') ? dateDiffData.find(i => i.type === 'estimulacionMatricial').avgDateDiff : null
    }, {
        name: 'Estimulacion Termica',
        classname: 'Termico',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT_RESULTS / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT * 100 : null, 
        prodEstimated: estIncData.find(i => i.groupedName === 'termico') ? estIncData.find(i => i.groupedName === 'termico').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'termico') ? aforosData.find(i => i.type === 'termico').qo : null,
        percEstimated: estIncData.find(i => i.groupedName === 'termico') && aforosData.find(i => i.type === 'termico') ? aforosData.find(i => i.type === 'termico').qo * 100 / estIncData.find(i => i.groupedName === 'termico').EST_INC_Qo : null,
        cost: costData.find(i => i.type === 'termico').cost,
        estCost: costData.find(i => i.type === 'termico').estCost,
        days: dateDiffData.find(i => i.type === 'termico') ? dateDiffData.find(i => i.type === 'termico').avgDateDiff : null
    }]





    console.log(data)

    return (
      <div className='data'>
        <div style={{padding: '40px'}}>
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

