import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import AriaModal from 'react-aria-modal'
import Select from 'react-select'
import { generatePowerPoint } from '../../../../pptx'
import ProgressBar from '../Common/ProgressBar'

@autobind class Export extends Component {
  constructor(props){
    super(props)
    this.state = {
      excelOption: '',
      isBuildingPowerpoint: false,
      percentage: 0,
      isModalOpen: false,
      firstHalf: {
        objectivoYAlcances: { text: 'Objectivo y alcances', isComplete: false, error: null },
        fichaTecnicalDelCampo: { text:'Ficha técnica - campo', isComplete: false, error: null },
        historicoPresionCampo: { text: 'Histórico de presión - campo', isComplete: false, error: null },
        fichaTecnicaDelPozo: { text: 'Ficha técnica - pozo', isComplete: false, error: null },
        historialDeIntervenciones: { text: 'Historial de intervenciones', isComplete: false, error: null },
        estadoMecanicoYAparejo: { text: 'Edo. mecánico y aparejo de producción', isComplete: false, error: null },
        sistemasArtificialesDeProduccion: { text: 'Información de Sistemas Artificiales de Producción', isComplete: false, error: null },
        evaluacionPetrofisica: { text: 'Evaluación petrofísica', isComplete: false, error: null },
        analisisDeAgua: { text: 'Análisis del agua', isComplete: false, error: null },
        historicoDeProduccion: { text: 'Histórico de producción', isComplete: false, error: null },
        historicoDeAforo: { text: 'Histórico de aforos - propuesta', isComplete: false, error: null },
        historicoDePresionPozo: { text: 'Histórico de presión - pozo', isComplete: false, error: null },
        propuestaCedula: { text: 'Cédula de tratamiento - propuesta', isComplete: false, error: null },
        propuesta: { text: 'Propuesta de tratamiento', isComplete: false, error: null },
        laboratorios: { text: 'Pruebas de laboratorio', isComplete: false, error: null },
      },
      secondHalf: {},
      progress: 0,
    }
  }

  componentDidMount() {}

  // buildTasks(name, taskSequence, hasResults, error) {
  //   const { firstHalf, secondHalf } = this.state
  //   let firstHalfTasks = Object.keys(firstHalf).map(task => {
  //     const { error, text } = firstHalf[task]
  //     return (
  //       <li>{error ? 'sad' : 'happy'} - {text}</li>
  //     )
  //   })

  // }

  updateProgress(index, name, hasResults, error) {
    console.log('updating progress')
    const { firstHalf, secondHalf } = this.state
    let total = Object.keys(firstHalf).length
    if (hasResults) {
      total += Object.keys(secondHalf).length
    }
    const progress = (index / total) * 100
    this.setState({ progress })
    // console.log('what is the progress?', progress)
    // return (
    //   <div>
    //     <ProgressBar percentage={progress} />
    //     <ul>
    //       {/* {this.buildTasks(name, hasResults, error)} */}
    //     </ul>
    //   </div>
    // )
  }

  handlePptxClick() {
    const { token, jobID, jobType } = this.props
    this.setState({
      isBuildingPowerpoint: true,
    })
    generatePowerPoint(token, jobID, jobType, this.updateProgress)
  }

  powerPointExport() {
    const { isBuildingPowerpoint, progress } = this.state
    if (isBuildingPowerpoint) {
      return (
        <div>
        <ProgressBar percentage={progress} />
        <ul>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
          <p>one</p>
        </ul>
        </div>
      )
    }
    return null
  }

  render() {
    const { excelOption } = this.state
    const excelExportOptions = [
      { label: 'Histórico de produccion', value: 'historicoProduccion' },
      { label: 'Histórico de Presión - Campo ', value: 'historicoPresionCampo' },
      { label: 'Histórico de Presión - Pozo', value: 'historicoPresionPozo' },
      { label: 'Histórico de Aforos', value: 'historicoAforos' },
      { label: 'Desviación', value: 'desviacion' },
    ]
    return (
      <div className='export-modal'>
        <div className='export-buttons'>
          <div className="pptx-export">
            <label>Generar Presentacion</label>
            <div>
              <button className="cta" onClick={() => this.handlePptxClick()}>Exportar PPTX</button>
            </div>
          </div>
          <div className="excel-export">
            <label>Generar Excel</label>
            <div>
              <Select
                className="export-select"
                options={excelExportOptions}
                onChange={(excelOption) => this.setState({ excelOption, isBuildingPowerpoint: false })}
                value={excelOption}
              />
              <button className="cta">Exportar XLXS</button>
            </div>
          </div>
        </div>
        {this.powerPointExport()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  jobID: state.getIn(['globalAnalysis', 'job']),
  jobType: state.getIn(['globalAnalysis', 'jobType']),
})

export default connect(mapStateToProps)(Export) 