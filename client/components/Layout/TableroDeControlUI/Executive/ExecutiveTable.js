import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'


@autobind class ExecutiveTable extends PureComponent {
  render() {
    let { aforosData, costData, countData, estIncData } = this.props
   
    aforosData = [{
        type: 'acido',
        qo: aforosData.filter(i => i.type === 'acido').reduce((sum, curr) => sum + curr.qoResult, 0)
    }, {
        type: 'apuntalado',
        qo: aforosData.filter(i => i.type === 'apuntalado').reduce((sum, curr) => sum + curr.qoResult, 0)
    }, {
        type: 'estimulacion',
        qo: aforosData.filter(i => i.type === 'estimulacion').reduce((sum, curr) => sum + curr.qoResult, 0)
    },{
        type: 'termico',
        qo: aforosData.filter(i => i.type === 'termico').reduce((sum, curr) => sum + curr.qoResult, 0)
    }]


    costData = [{
        type: 'acido',
        cost: costData.filter(i => i.TIPO_DE_INTERVENCIONES === 'acido').reduce((sum, curr) => sum + curr.TOTAL_COST, 0)
    },{
        type: 'apuntalado',
        cost: costData.filter(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').reduce((sum, curr) => sum + curr.TOTAL_COST, 0)
    },{
        type: 'estimulacion',
        cost: costData.filter(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion').reduce((sum, curr) => sum + curr.TOTAL_COST, 0)
    },{
        type: 'termico',
        cost: costData.filter(i => i.TIPO_DE_INTERVENCIONES === 'termico').reduce((sum, curr) => sum + curr.TOTAL_COST, 0)
    }]

    console.log(aforosData)
    console.log(costData)
    console.log(countData)
    console.log(estIncData)

    let data = [{
        name: 'acido',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'acido').COUNT_RESULTS : null,   
        prodEstimated: estIncData.find(i => i.TYPE === 'acido') ? estIncData.find(i => i.TYPE === 'acido').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'acido') ? aforosData.find(i => i.type === 'acido').qo : null,
        percEstimated: estIncData.find(i => i.TYPE === 'acido') && aforosData.find(i => i.type === 'acido') ? estIncData.find(i => i.TYPE === 'acido').EST_INC_Qo / aforosData.find(i => i.type === 'acido').qo : null,
        cost: costData.find(i => i.type === 'acido') ? costData.find(i => i.type === 'acido').cost : null
    }, {
        name: 'apuntalado',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'apuntalado').COUNT_RESULTS  : null ,
        prodEstimated: estIncData.find(i => i.TYPE === 'apuntalado') ? estIncData.find(i => i.TYPE === 'apuntalado').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'apuntalado') ? aforosData.find(i => i.type === 'apuntalado').qo : null,
        percEstimated: estIncData.find(i => i.TYPE === 'apuntalado') && aforosData.find(i => i.type === 'apuntalado') ? estIncData.find(i => i.TYPE === 'apuntalado').EST_INC_Qo / aforosData.find(i => i.type === 'apuntalado').qo : null,
        cost: costData.find(i => i.type === 'apuntalado') ? costData.find(i => i.type === 'apuntalado').cost : null
    }, {
        name: 'estimulacion',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion').COUNT / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'estimulacion').COUNT_RESULTS  : null, 
        prodEstimated: estIncData.find(i => i.TYPE === 'estimulacion') ? estIncData.find(i => i.TYPE === 'estimulacion').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'estimulacion') ? aforosData.find(i => i.type === 'estimulacion').qo : null,
        percEstimated: estIncData.find(i => i.TYPE === 'estimulacion') && aforosData.find(i => i.type === 'estimulacion') ? estIncData.find(i => i.TYPE === 'estimulacion').EST_INC_Qo / aforosData.find(i => i.type === 'estimulacion').qo : null,
        cost: costData.find(i => i.type === 'estimulacion') ? costData.find(i => i.type === 'estimulacion').cost : null
    }, {
        name: 'termico',
        numProposals: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT : null,
        numResults: countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT_RESULTS : null,
        percResults:  countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico') ? countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT / countData.find(i => i.TIPO_DE_INTERVENCIONES === 'termico').COUNT_RESULTS : null, 
        prodEstimated: estIncData.find(i => i.TYPE === 'termico') ? estIncData.find(i => i.TYPE === 'termico').EST_INC_Qo : null,
        prodReal: aforosData.find(i => i.type === 'termico') ? aforosData.find(i => i.type === 'termico').qo : null,
        percEstimated: estIncData.find(i => i.TYPE === 'termico') && aforosData.find(i => i.type === 'termico') ? estIncData.find(i => i.TYPE === 'termico').EST_INC_Qo / aforosData.find(i => i.type === 'termico').qo : null,
        cost: costData.find(i => i.type === 'termico') ? costData.find(i => i.type === 'termico').cost : null
    }]

    console.log(data)


    return (
    	<div>hi</div>
    )
  }
}


export default ExecutiveTable
