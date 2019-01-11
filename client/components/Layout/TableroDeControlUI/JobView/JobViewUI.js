import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import AriaModal from 'react-aria-modal'

import WellSelect from '../Common/WellSelect'
import JobSelect from '../Common/JobSelect'
import CostBar from './CostBar'
import VolumeBar from './VolumeBar'
import KPIs from './KPIs'
import SimulationTreatmentTable from './SimulationTreatmentTable'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import AforoScatter from './AforoScatter'
import CedulaTable from './CedulaTable'
import LabTable from './LabTable'
import TimeSlider from '../TimeSeries/TimeSlider'
import LocalModal from './../Common/LocalModal'
import Filters from './../Common/Filters'
import ExportPptx from './ExportPptx';
import { convertLowDate, convertHighDate } from '../../../../lib/formatters';
import { KPI } from '../Common/KPIs'
import MoreKPIs from './MoreKPIs'

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
      imageData: [],
      date: null,
      labData: [],
      specificLabData: [],
      specificLab: null,
      estIncData: [],
      isOpen: false,
      jobData: []
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
    let { globalAnalysis, token } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { well, lowDate, highDate } = globalAnalysis
    lowDate = convertLowDate(globalAnalysis.lowDate)
    highDate = convertHighDate(globalAnalysis.highDate)


    fetch(`/api/getJobs?well=${well}&lowDate=${lowDate}&highDate=${highDate}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    })
      .then(r => r.json())
      .then(r => {
        const proposals = []
        const realJobs = []
        r.forEach((intervention) => {
          const { TIPO_DE_INTERVENCIONES, TRANSACTION_ID, FECHA_PROGRAMADA_INTERVENCION, FECHA_INTERVENCION, HAS_NO_RESULTS } = intervention
          const type = TIPO_DE_INTERVENCIONES
          const transactionID = TRANSACTION_ID
          const dateStr = FECHA_INTERVENCION || FECHA_PROGRAMADA_INTERVENCION
          const date = new Date(dateStr)
          const obj = {
            type,
            transactionID,
            date,
          }
          return HAS_NO_RESULTS ? proposals.push(obj) : realJobs.push(obj)
        })
        const sortByDate = (a, b) => a.date - b.date
        const buildOptions = (option) => {
          const { date, type, transactionID } = option
          const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
          const typeLabel = type.replace(/^\w/, c => c.toUpperCase())
          return {
            label: `${typeLabel} ${dateStr}`,
            value: transactionID,
            type: typeLabel,
          }
        }
        this.setState({
          jobOptions: [
            { label: 'Real', options: realJobs.sort(sortByDate).map(buildOptions) },
            { label: 'Propuesta', options: proposals.sort(sortByDate).map(buildOptions) }
          ],
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
      specificLabData: [],
      specificLab: id,
      isOpen: true
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
    let jobDataQuery = `/job/getJobData?transactionID=${job}`

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
        fetch(estIncQuery, headers).then(r => r.json()),
        fetch(jobDataQuery, headers).then(r => r.json()),
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
        estIncData: data[11],
        jobData: data[12]
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

    if (imageData && Object.keys(imageData).length > 0) {

      let out = []

      Object.keys(imageData).forEach(i => {
        let obj = imageData[i]

        if (!Array.isArray(obj)) {
          out.push(<img style={{objectFit: 'contain'}} label={obj.displayName} src={obj.imgURL}></img>)
        }
      })

      return out.flat()

    }
    else {
      return <div>No Imágenes</div>
    }
  } 

  makeLabModal() {
    let { specificLabData, specificLab, labData, imageData } = this.state
    let lab = labData.find(i => i.id === specificLab)
    let labImage = imageData.pruebasDeLaboratorio


    labImage ? labImage = labImage.find(i => parseInt(i.labID) === specificLab) : null

    lab = lab ? lab : {}

    let columns
    switch(lab.type) {
        case 'pruebasDeCompatibilidad':
          columns = [
                {
                  Header: 'Diseño',
                  accessor: 'DISENO',
                }, {
                  Header: 'Sistema',
                  accessor: 'SISTEMA',
                }, {
                  Header: 'Aceite del pozo',
                  accessor: 'ACEITE_DEL_POZO',
                }, {
                  Header: 'Tiempo de Rompimiento',
                  accessor: 'TIEMPO_DE_ROMPIMIENTO',
                }, {
                  Header: 'Separación de fases',
                  accessor: 'SEPARACION_DE_FASES',
                }, { 
                  Header: 'Solidós',
                  accessor: 'SOLIDOS',
                }, {
                  Header: 'Condición',
                  accessor: 'CONDICION',
                }
              ]
          return (
          <div>
            <div>
              {lab.name}
            </div>
            <KPI className='kpi' header='Compañia' value={lab.compania}/>
            <KPI className='kpi' header='Supervisó' value={lab.superviso}/>
            <KPI className='kpi' header='Observaciones' type={'wide'} value={lab.observaciones}/>
            <ReactTable
              className="-striped"
              data={specificLabData}
              columns={columns}
              showPagination={false}
              showPageSizeOptions={false}
              pageSize={specificLabData.length}
              sortable={false}
            />
            <img style={{objectFit: 'contain'}} src={labImage ? labImage.imgURL: null}></img> 
          </div>
          )
        break;
        case 'caracterizacionFisico':
          return (
          <div>
            <div>
              {lab.name}
            </div>
            <KPI className='kpi' header='Determinación del porcentaje de aceite' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_ACEITE : null} unit='%' />
            <KPI className='kpi' header='Determinación del porcentaje de agua' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_AGUA : null} unit='%' />
            <KPI className='kpi' header='Determinación del porcentaje de emulsión' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_EMULSION : null} unit='%' />
            <KPI className='kpi' header='Determinación del porcentaje de sólidos' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_SOLIDOS : null} unit='%' />
            <KPI className='kpi' header='Determinación del porcentaje de asfaltenos' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_ASFALTENOS : null} unit='%' />
            <KPI className='kpi' header='Determinación del porcentaje de parafinas' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_PARAFINAS : null} unit='%' />
            <KPI className='kpi' header='Determinación del porcentaje de resinas asfalticas' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_RESINAS_ASFALTICAS : null} unit='%' />
            <KPI className='kpi' header='Determinación del porcentaje de contenido de sólidos' value={specificLabData.length > 0 ? specificLabData[0].PORENTAJE_DE_CONTENIDO_DE_SOLIDOS : null} unit='%' />
            <KPI className='kpi' header='Densidad del aceite' value={specificLabData.length > 0 ? specificLabData[0].DENSIDAD_DEL_ACEITE : null} unit={<div>g/cm<sup>3</sup></div>} />
            <KPI className='kpi' header='Densidad del agua' value={specificLabData.length > 0 ? specificLabData[0].DENSIDAD_DEL_AGUA : null} unit={<div>g/cm<sup>3</sup></div>} />
            <KPI className='kpi' header='Densidad de la emulsión' value={specificLabData.length > 0 ? specificLabData[0].DENSIDAD_DE_LA_EMULSION : null} unit={<div>g/cm<sup>3</sup></div>} />
            <KPI className='kpi' header='Viscosidad del aceite' value={specificLabData.length > 0 ? specificLabData[0].VISCOSIDAD_DEL_ACEITE : null} unit='cp' />
            <KPI className='kpi' header='Viscosidad de la emulsión' value={specificLabData.length > 0 ? specificLabData[0].VISCOSIDAD_DE_LA_EMULSION : null} unit='cp' />
            <KPI className='kpi' header='pH del agua' value={specificLabData.length > 0 ? specificLabData[0].PH_DEL_AGUA : null} unit='adim' />
            <KPI className='kpi' header='Salinidad del agua' value={specificLabData.length > 0 ? specificLabData[0].SALINIDAD_DEL_AGUA : null} unit='ppm' />
            <KPI className='kpi' header='Salinidad del aceite' value={specificLabData.length > 0 ? specificLabData[0].SALINIDAD_DEL_ACEITE : null} unit='ppm' />
            <KPI className='kpi' header='Compania' value={lab.compania}/>
            <KPI className='kpi' header='Superviso' value={lab.superviso}/>
            <KPI className='kpi' header='Observaciones' type={'wide'} value={lab.observaciones}/>
            <img style={{objectFit: 'contain'}} src={labImage ? labImage.imgURL : null }></img> 
          </div>
          )
        break;
        case 'pruebasGelDeFractura':
          return (
          <div>
            <div>
              {lab.name}
            </div>
            <KPI className='kpi' header='Hidratación del fluido' value={specificLabData.length > 0 ? specificLabData[0].HIDRATACION : null} unit='' />
            <KPI className='kpi' header='Tiempo de activación del gel' value={specificLabData.length > 0 ? specificLabData[0].TIEMPO_DE_ACTIVACION_DEL_GEL : null} unit='adim' />
            <KPI className='kpi' header='Determinación de pH' value={specificLabData.length > 0 ? specificLabData[0].DETERMINACION_DE_PH : null} unit='psi' />
            <KPI className='kpi' header='Tiempo de rompimiento' value={specificLabData.length > 0 ? specificLabData[0].TIEMPO_DE_ROMPIMIENTO : null} unit='mins' />
            <KPI className='kpi' header='Dosificación de quebradores' value={specificLabData.length > 0 ? specificLabData[0].DOSIFICATION_DE_QUEBRADORES : null} unit='adim' />
            <KPI className='kpi' header='Viscosidad del gel de fractura' value={specificLabData.length > 0 ? specificLabData[0].VISCOSIDAD_DEL_GEL_DE_FRACTURA : null} unit='adim' />
            <KPI className='kpi' header='Compania' value={lab.compania}/>
            <KPI className='kpi' header='Superviso' value={lab.superviso}/>
            <KPI className='kpi' header='Observaciones' type={'wide'} value={lab.observaciones}/>
            <img style={{objectFit: 'contain'}} src={labImage ? labImage.imgURL : null }></img> 
          </div>
          )
        break;
        case 'pruebasDeSolubilidad':
          return (
          <div>
            <div>
              {lab.name}
            </div>
            <KPI className='kpi' header='Tipo de muestra' value={specificLabData.length > 0 ? specificLabData[0].TIPO_DE_MUESTRA : null} unit='' />
            <KPI className='kpi' header='Peso de la muestra' value={specificLabData.length > 0 ? specificLabData[0].PESO_DE_LA_MUESTRA : null} unit='gr' />
            <KPI className='kpi' header='Tipo de sistema químico empleado' value={specificLabData.length > 0 ? specificLabData[0].TIPO_DE_SISTEMA_QUIMICO : null} unit='' />
            <KPI className='kpi' header='Peso final de la muestra' value={specificLabData.length > 0 ? specificLabData[0].PESO_FINAL_DE_LA_MUESTRA : null} unit='gr' />
            <KPI className='kpi' header='Solubilidad' value={specificLabData.length > 0 ? specificLabData[0].SOLUBILIDAD : null} unit='%' />
            <KPI className='kpi' header='Compania' value={lab.compania}/>
            <KPI className='kpi' header='Superviso' value={lab.superviso}/>
            <KPI className='kpi' header='Observaciones' type={'wide'} value={lab.observaciones}/>
            <img style={{objectFit: 'contain'}} src={labImage ? labImage.imgURL : null }></img> 
          </div>
          )
        break;
        case 'pruebasParaApuntalante':
          return (
          <div>
            <div>
              {lab.name}
            </div>
            <KPI className='kpi' header='Esfericidad' value={specificLabData.length > 0 ? specificLabData[0].ESFERICIDAD : null} unit='adim' />
            <KPI className='kpi' header='Redondez' value={specificLabData.length > 0 ? specificLabData[0].REDONDEZ : null} unit='adim' />
            <KPI className='kpi' header='Resistencia a la compresión' value={specificLabData.length > 0 ? specificLabData[0].RESISTENCIA_A_LA_COMPRESION : null} unit='psi' />
            <KPI className='kpi' header='Malla' value={specificLabData.length > 0 ? specificLabData[0].MALLA : null} unit='' />
            <KPI className='kpi' header='Aglutinamiento' value={specificLabData.length > 0 ? specificLabData[0].AGLUTINAMIENTO : null} unit='adim' />
            <KPI className='kpi' header='Turbidez' value={specificLabData.length > 0 ? specificLabData[0].TURBIDEZ : null} unit='adim' />
            <KPI className='kpi' header='Solubilidad' value={specificLabData.length > 0 ? specificLabData[0].SOLUBILIDAD : null} unit='%' />
            <KPI className='kpi' header='Compania' value={lab.compania}/>
            <KPI className='kpi' header='Superviso' value={lab.superviso}/>
            <KPI className='kpi' header='Observaciones' type={'wide'} value={lab.observaciones}/>
            <img style={{objectFit: 'contain'}} src={labImage ? labImage.imgURL : null }></img> 
          </div>
          )
        break;
        case 'pruebasDeGrabado':
          columns = [
            {
              Header: 'Sistema Ácido',
              accessor: 'SISTEMA_ACIDO',
            }, {
              Header: <div>Tiempo de contacto<br></br>(min)</div>,
              accessor: 'TIEMPO_DE_CONTACTO',
            }, {
              Header: 'Grabado',
              accessor: 'GRABADO',
            }
          ]

          return (
          <div>
            <div>
              {lab.name}
            </div>
            <KPI className='kpi' header='Compania' value={lab.compania}/>
            <KPI className='kpi' header='Superviso' value={lab.superviso}/>
            <KPI className='kpi' header='Observaciones' type={'wide'} value={lab.observaciones}/>
            <ReactTable
              className="-striped"
              data={specificLabData}
              columns={columns}
              showPagination={false}
              showPageSizeOptions={false}
              pageSize={specificLabData.length}
              sortable={false}
            />
            <img style={{objectFit: 'contain'}} src={labImage ? labImage.imgURL : null }></img> 
          </div>
          )
        break;
        case 'cromatografiaDelGas':
        case 'pruebaDeDureza':
        case 'determinacionDeLaCalidad':
        case 'curvaDeViscosidad':
        return (
          <div>
            <div>
              {lab.name}
            </div>
            <KPI className='kpi' header='Compania' value={lab.compania}/>
            <KPI className='kpi' header='Superviso' value={lab.superviso}/>
            <KPI className='kpi' header='Observaciones' type={'wide'} value={lab.observaciones}/>
            <img style={{objectFit: 'contain'}} src={labImage ? labImage.imgURL : null }></img> 
          </div>
          )
        break;
        default:
          return (
            <div></div>
            )
    }
  }

  deactivateModal() {
    this.setState({
      isOpen: false,
    })
  }

  activateModal() {
    this.setState({
      isOpen: true,
    })
  }


    buildModal() {
    let { specificLabData, specificLab, labData, imageData } = this.state
    let lab = labData.find(i => i.id === specificLab)
    let name = lab.type

    switch (lab.type) {
      case 'pruebasDeCompatibilidad':
        name = 'Pruebas de compatiblidad por emulsión'
        break;
      case 'caracterizacionFisico':
        name = 'Caracterización fisico-química de fluidos'
        break;
      case 'pruebasGelDeFractura':
        name = 'Pruebas gel de fractura'
        break;
      case 'pruebasDeSolubilidad':
        name = 'Pruebas de solubilidad'
        break;
      case 'pruebasParaApuntalante':
        name = 'Pruebas para apuntalante'
        break;
      case 'pruebasDeGrabado':
        name = 'Pruebas de grabado'
        break;
      case 'cromatografiaDelGas':
        name = 'Cromatografía del gas'
        break;
      case 'pruebaDeDureza':
        name = 'Prueba de dureza'
        break;
      case 'determinacionDeLaCalidad':
        name = 'Determinación de la calidad método de los cloruros'
        break;
      case 'curvaDeViscosidad':
        name = 'Curva De Viscosidad'
        break;
    }

    return (
      <AriaModal
        titleId="save-modal"
        onExit={this.deactivateModal}
        underlayClickExits={true}
        verticallyCenter={true}
        focusDialog={true}
        dialogClass="queryModalPartialReset"
        dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '100px'}}

      >
      <div className="modalTest" >
        <div className="modal-title">
          {name}
        </div>
        <div className="modal-body" >
          {this.makeLabModal()}
        </div> 

      </div>
      </AriaModal>
    )
  }

  render() {
    let { fieldWellOptions, jobOptions, imageData, costData, estCostData, jobData, volumeData, estIncData, estVolumeData, cedulaData, cedulaResultData, date, aforoData, interventionData, interventionResultsData, labData, specificLabData, isOpen } = this.state
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
            item: 'Longitud de agujero de gusano', unit: 'ft', sim: interventionData.LONGITUD_DE_AGUJERO_DE_GUSANO, actual: interventionResultsData.LONGITUD_DE_AGUJERO_DE_GUSANO
          },{
            item: 'Penetración radial', unit: 'ft', sim: interventionData.PENETRACION_RADIAL, actual: interventionResultsData.PENETRACION_RADIAL
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
          <TimeSlider />
          <div className="filtersAndExport">
            <LocalModal title="Filtros">
              <Filters />
            </LocalModal>
            <LocalModal title="Menu de Exportación">
              <ExportPptx />
            </LocalModal>
          </div>
          <div style={{display: 'flex'}}>
           <div className='selectors'>
              <WellSelect fieldWellOptions={fieldWellOptions}/>
              <JobSelect options={jobOptions}/>
            </div>
            <KPIs estData={estCostData} data={costData} estIncData={estIncData} />
          </div>
          <MoreKPIs jobData={jobData} />
          <CardDeck className="content-deck">
            <Card
                id="cedula"
                title="Cédula de Tratamiento"
                ref={this.cards[4]}
                isTable={true}
              >          
              <CedulaTable label='Propuesta' data={cedulaData} exportData={cedulaExportData} type={jobType} />
              <CedulaTable label='Real' data={cedulaResultData} exportData={cedulaResultExportData} type={jobType} />
            </Card>  
            <Card
                id="costs"
                title="Costos Estimados vs Reales"
                ref={this.cards[0]}
                width={'50%'}
              >          
              <CostBar estData={estCostData} data={costData} />
            </Card>
             <Card
                id="volumes"
                title="Volúmenes Inyectados Estimados vs Reales"
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
                title="Pruebas de Laboratorio"
                ref={this.cards[5]}
                isTable={true}
              >
              <LabTable data={labDataFixed} exportData={labExportData} labData={specificLabData} handleChange={this.fetchLabData} />
            </Card> 
             <Card

                id="images"
                title="Imágenes"
                ref={this.cards[6]}
                isImage={true}
              >
              {this.makeImages()}
            </Card> 
          </CardDeck>
          { isOpen ? this.buildModal() : null }
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
