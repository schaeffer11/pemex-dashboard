import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import WellSelect from '../Common/WellSelect'
import JobSelect from '../Common/JobSelect'
import Images from './Images'
import CostBar from './CostBar'
import VolumeBar from './VolumeBar'
import KPIs from './KPIs'
import SimulationTreatmentTable from './SimulationTreatmentTable'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import AforoScatter from './AforoScatter'
import CedulaTable from './CedulaTable'
import LabTable from './LabTable'
import Export from './ExportPptx'
import LocalModal from './../Common/LocalModal'
import ExportPptx from './ExportPptx';

@autobind class jobViewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      jobOptions: [],
      costData: [],
      estCostData: [],
      cedulaResultData: [],
      cedulaData: [],
      interventionData: [],
      interventionResultsData: [],
      aforoData: [],
      volumeData: [],
      estVolumeData: [],
      date: null,
      labData: [],
      specificLabData: [],
      estIncData: []
    }    
    this.cards = []
    for (let i = 0; i < 7; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  makeCedulaExportData(data) {
    let exportData = []

    exportData.push([
      `Etapa`,
      `Sistema`,
      `Nombre Comercial`,
      `Vol. Liq. (m3)`,
      `Gasto Líquido (bpm)`,
      `Rel. N2/Liq (m3std/m3)`,
      `Calidad (%)`,
      `Gasto en fondo (bpm)`,
      `Gasto N2 (m3/min)`,
      `Vol. N2 (m3 std)`,
      `Vol. Liq. Acum (m3)`,
      `Vol. N2 Acum (m3 std)`,
      `Tiempo (min)`
    ])


    data.forEach(i => {
      exportData.push([
        i.etapa,
        i.sistema,
        i.nombreComercial,
        i.volLiquid,
        i.gastoLiqudo,
        i.relN2Liq,
        i.calidad,
        i.gastoEnFondo,
        i.gastoN2,
        i.volN2,
        i.volLiquidoAcum,
        i.volN2Acum,
        i.tiempo
      ])
    })

    return exportData
  }

  makeLabExportData(data) {
    let exportData = []

    exportData.push([
      `Tipo de Analisis`,
      `Fecha de Muestreo`,
      `Fecha de prueba`,
      `Compañía`,
      `Personal de Pemex que supervisó`,
    ])


    data.forEach(i => {
      exportData.push([
        i.type,
        i.fechaMuestreo,
        i.fechaPrueba,
        i.compania,
        i.superviso,
      ])
    })

    return exportData
  }

  makeSimulationExportData(data) {
    let exportData = []

    exportData.push([
      `Concepto`,
      `Unidad`,
      `Simulación`,
      `Real`,
    ])


    data.forEach(i => {
      exportData.push([
        i.item,
        i.unit,
        i.sim,
        i.actual,
      ])
    })

    return exportData
  }

  fetchJobs() {
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { well } = globalAnalysis

    let { token } = this.props

    fetch(`/api/getJobs?well=${well}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
      .then(r => r.json())
      .then(r => {
        let jobs = []

        r = r.sort((a, b) => {
          return a.FECHA_PROGRAMADA_INTERVENCION - b.FECHA_PROGRAMADA_INTERVENCION
        })

        r.forEach(i => {
          let date = new Date(i.FECHA_PROGRAMADA_INTERVENCION)
          date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
          let type = i.TIPO_DE_INTERVENCIONES
          type = type.charAt(0).toUpperCase() + type.substr(1)
          jobs.push({
            type: type,
            date: date,
            transID: i.TRANSACTION_ID,
          })
        })
        
        jobs = jobs.map(i => ({
          label: `${i.type} ${i.date}`, value: i.transID, type: i.type
        }))

        this.setState({
          jobOptions: jobs
        })
    })
  }




  async fetchLabData(id, type) {
    let { token } = this.props
    let specificLabQuery = `/job/getLabData?labID=${id}&type=${type}` 
    
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      }
    }

    this.setState({
      specificLabData: []
    })

      fetch(specificLabQuery, headers)
        .then(r => r.json())
        .then(r => {

          this.setState({
            specificLabData: r
          })
      })

  }


  async fetchData() {
  	console.log('fetching')
    let { globalAnalysis, token } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { job, jobType } = globalAnalysis

    this.setState({
      estCostData: [],
      costData: [],
      imageData: null,
      cedulaData: [],
      cedulaResultData: [],
      interventionData: [],
      interventionResultsData: [],
      aforoData: [],
      date: null,
      volumeData: [],
      estVolumeData: [],
      labData: [],
      estIncData: []
    })

    let fieldWellOptionsQuery = `/api/getFieldWellMappingHasData`
    let estCostQuery = `/job/getEstCostData?transactionID=${job}`
    let costQuery = `/job/getCostData?transactionID=${job}`
    let cedulaQuery = `/job/getCedula?transactionID=${job}&type=${jobType}`
    let cedulaResultQuery = `/job/getCedulaResults?transactionID=${job}&type=${jobType}`
    let imageQuery = `/api/getInterventionImages?transactionID=${job}`
    let interventionQuery = `/job/getInterventionData?transactionID=${job}&type=${jobType}`
    let interventionResultsQuery = `/job/getInterventionResultsData?transactionID=${job}&type=${jobType}`
    let aforosQuery = `/job/getAforoData?transactionID=${job}`
    let volumeQuery = `/job/getVolumeData?transactionID=${job}&type=${jobType}`
    let estVolumeQuery = `/job/getEstimatedVolumeData?transactionID=${job}&type=${jobType}`
    let labsQuery = `/job/getLabs?transactionID=${job}`
    let estIncQuery = `/job/getEstIncData?transactionID=${job}&type=${jobType}`

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

    if (job) {
      const data = await Promise.all([
        fetch(estCostQuery, headers).then(r => r.json()),
        fetch(costQuery, headers).then(r => r.json()),
        fetch(cedulaQuery, headers).then(r => r.json()),
        fetch(cedulaResultQuery, headers).then(r => r.json()),
        fetch(imageQuery, headers).then(r => r.json()),
        fetch(interventionQuery, headers).then(r => r.json()),
        fetch(interventionResultsQuery, headers).then(r => r.json()),
        fetch(aforosQuery, headers).then(r => r.json()),
        fetch(volumeQuery, headers).then(r => r.json()),
        fetch(estVolumeQuery, headers).then(r => r.json()),
        fetch(labsQuery, headers).then(r => r.json()),
        fetch(estIncQuery, headers).then(r => r.json())
      ])
        .catch(error => {
          console.log('err', error)
        })

      let newState = {
        estCostData: data[0],
        costData: data[1],
        cedulaData: data[2],
        cedulaResultData: data[3],
        imageData: data[4],
        interventionData: data[5],
        interventionResultsData: data[6],
        aforoData: data[7],
        data: data[6] ? data[6].FECHA_INTERVENCION : null,
        volumeData: data[8],
        estVolumeData: data[9],
        labData: data[10],
        estIncData: data[11]
      }

      this.setState(newState) 
    }

  }

  componentDidMount() {
  	this.fetchData()
    this.fetchJobs()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prevGlobalAnalysis = prevGlobalAnalysis.toJS()

		let { well, job } = globalAnalysis
    let wellPrev = prevGlobalAnalysis.well
    let jobPrev = prevGlobalAnalysis.job

    if (well !== wellPrev) {
			this.fetchJobs()	
		}
    if (job !== jobPrev) {
      this.fetchData()
    }
  }

  makeImages() {
    let { imageData } = this.state

    console.log('im hereeeeee', imageData)
    if (imageData && Object.keys(imageData).length > 0) {

      let out = Object.keys(imageData).map(i => {
        let obj = imageData[i]

        if (Array.isArray(obj)) {
          return obj.map(j => {
            return <img style={{objectFit: 'contain'}} label={`Lab - ${j.imgName.split('.')[2]}`} src={j.imgURL}></img> 
          })
        }
        else {
          return <img style={{objectFit: 'contain'}} label={obj.imgName.split('.')[1]} src={obj.imgURL}></img>     
        }
      })

      return out.flat()

    }
    else {
      return <div>hi</div>
    }
  } 

  render() {
    let { fieldWellOptions, jobOptions, imageData, costData, estCostData, volumeData, estIncData, estVolumeData, cedulaData, cedulaResultData, date, aforoData, interventionData, interventionResultsData, labData, specificLabData } = this.state
    let { globalAnalysis } = this.props

    globalAnalysis = globalAnalysis.toJS()
    let { job, jobType } = globalAnalysis
    let simulationData = []
    let hide = false
    interventionData ? interventionData = interventionData[0] : null
    interventionResultsData ? interventionResultsData = interventionResultsData[0] : null

    if (interventionData && interventionResultsData)  {
      if (jobType === 'Estimulacion') {
        if (!interventionData.LONGITUD_DE_AGUJERO_DE_GUSANO || !interventionData.PENETRACION_RADIAL) {
          hide = true
        }
        else {
          simulationData = [{
            item: 'Longitud de agujero de gusano', unit: 'pg', sim: interventionData.LONGITUD_DE_AGUJERO_DE_GUSANO, actual: interventionResultsData.LONGITUD_DE_AGUJERO_DE_GUSANO
          },{
            item: 'Penetración radial', unit: 'pg', sim: interventionData.PENETRACION_RADIAL, actual: interventionResultsData.PENETRACION_RADIAL
          }]
        }
      }
      else if (jobType === 'Acido') {
        simulationData = [{
          item: 'Longitud total', unit: 'm', sim: interventionData.LONGITUD_TOTAL, actual: interventionResultsData.LONGITUD_TOTAL
        },{
          item: 'Longitud efectiva grabada', unit: 'm', sim: interventionData.LONGITUD_EFECTIVA_GRABADA, actual: interventionResultsData.LONGITUD_EFECTIVA_GRABADA
        },{
          item: 'Altura grabada', unit: 'm', sim: interventionData.ALTURA_GRABADA, actual: interventionResultsData.ALTURA_GRABADA
        },{
          item: 'Ancho promedio', unit: 'pg', sim: interventionData.ANCHO_PROMEDIO, actual: interventionResultsData.ANCHO_PROMEDIO
        },{
          item: 'Concentración del ácido', unit: <div>lb/pg<sup>2</sup></div>, sim: interventionData.CONCENTRACION_DEL_ACIDO, actual: interventionResultsData.CONCENTRACION_DEL_ACIDO
        },{
          item: 'Conductividad', unit: 'mD*ft', sim: interventionData.CONDUCTIVIDAD, actual: interventionResultsData.CONDUCTIVIDAD
        },{
          item: 'FCD', unit: 'adim.', sim: interventionData.FCD, actual: interventionResultsData.FCD
        },{
          item: 'Presión neta', unit: 'psi', sim: interventionData.PRESION_NETA, actual: interventionResultsData.PRESION_NETA
        },{
          item: 'Eficiencia de fluido de fractura', unit: '%', sim: interventionData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA, actual: interventionResultsData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA
        }]
      }
      else if (jobType === 'Apuntalado') {
        simulationData = [{
          item: 'Longitud apuntalada', unit: 'm', sim: interventionData.LONGITUD_APUNTALADA, actual: interventionResultsData.LONGITUD_APUNTALADA
        },{
          item: 'Altura total de fractura', unit: 'm', sim: interventionData.ALTURA_TOTAL_DE_FRACTURA, actual: interventionResultsData.ALTURA_TOTAL_DE_FRACTURA
        },{
          item: 'Ancho promedio', unit: 'pg', sim: interventionData.ANCHO_PROMEDIO, actual: interventionResultsData.ANCHO_PROMEDIO
        },{
          item: 'Concentración areal', unit: <div>lb/pg<sup>2</sup></div>, sim: interventionData.CONCENTRACION_AREAL, actual: interventionResultsData.CONCENTRACION_AREAL
        },{
          item: 'Conductividad', unit: 'mD*ft', sim: interventionData.CONDUCTIVIDAD, actual: interventionResultsData.CONDUCTIVIDAD
        },{
          item: 'FCD', unit: 'adim.', sim: interventionData.FCD, actual: interventionResultsData.FCD
        },{
          item: 'Presión neta', unit: 'psi', sim: interventionData.PRESION_NETA, actual: interventionResultsData.PRESION_NETA
        },{
          item: 'Eficiencia de fluido  de fractura', unit: '%', sim: interventionData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA, actual: interventionResultsData.EFICIENCIA_DE_FLUIDO_DE_FRACTURA
        }]
      }
      else {
        hide = true
      }  
    }


    let labDataFixed = []

      labData.forEach(i => {
       let muestreoDate = new Date(i.fechaMuestreo)
        muestreoDate = `${muestreoDate.getDate()}/${muestreoDate.getMonth() + 1}/${muestreoDate.getFullYear()}`
       
       let pruebaDate = new Date(i.fechaPrueba)
        pruebaDate = `${pruebaDate.getDate()}/${pruebaDate.getMonth() + 1}/${pruebaDate.getFullYear()}`

        labDataFixed.push({
            id: i.id,
            type: i.type,
            fechaMuestreo: muestreoDate,
            fechaPrueba: pruebaDate,
            compania: i.compania,
            superviso: i.superviso,
            observaciones: i.observaciones,
        })
  
      
    })

    let cedulaExportData = this.makeCedulaExportData(cedulaData)
    let cedulaResultExportData = this.makeCedulaExportData(cedulaResultData)
    let labExportData = this.makeLabExportData(labDataFixed)
    let simulationExportData = this.makeSimulationExportData(simulationData)

    return (
      <div className="data job-view">
        <div className='content tablero-content'>
         <div className='selectors'>
            <WellSelect fieldWellOptions={fieldWellOptions}/>
            <JobSelect options={jobOptions}/>
          </div>
          <KPIs estData={estCostData} data={costData} estIncData={estIncData}/>
          <LocalModal title="Menu de Exportación">
            <ExportPptx />
          </LocalModal>
          <CardDeck className="content-deck">
            <Card
                id="cedula"
                title="Cedulas"
                ref={this.cards[4]}
                isTable={true}
              >          
              <CedulaTable label='Proposed' data={cedulaData} exportData={cedulaExportData} type={jobType} />
              <CedulaTable label='Actual' data={cedulaResultData} exportData={cedulaResultExportData} type={jobType} />
            </Card>  
            <Card
                id="costs"
                title="Estimated Vs Actual Costs"
                ref={this.cards[0]}
                width={'50%'}
              >          
              <CostBar estData={estCostData} data={costData} />
            </Card>
             <Card
                id="volumes"
                title="Estimated Vs Actual Volumes"
                ref={this.cards[1]}
                width={'50%'}
              >          
              <VolumeBar estData={estVolumeData} data={volumeData} />
            </Card>
            <Card
                id="simulationResults"
                title="Simulación vs Resultados"
                ref={this.cards[2]}
                isTable={true}
                width={'50%'}
              >          
              <SimulationTreatmentTable hide={hide} data={simulationData} exportData={simulationExportData} />
            </Card>
            <Card
                id="aforos"
                title="Aforos"
                ref={this.cards[3]}
                width={'50%'}
              >          
              <AforoScatter data={aforoData} interventionDate={date}/>   
            </Card> 
            <Card
                id="labs"
                title="Lab Tests"
                ref={this.cards[5]}
                isTable={true}
              >
              <LabTable data={labDataFixed} exportData={labExportData} labData={specificLabData} handleChange={this.fetchLabData} />
            </Card> 
             <Card

                id="images"
                title="Images"
                ref={this.cards[6]}
                isImage={true}
              >
              {this.makeImages()}
            </Card> 
          </CardDeck>
          <div style={{height: '500px'}}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(jobViewUI)
