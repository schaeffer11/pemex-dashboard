import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import AriaModal from 'react-aria-modal'
import Select from 'react-select'
import { generatePowerPoint } from '../../../../pptx'
import ProgressBar from '../Common/ProgressBar'

@autobind class ExportExcel extends Component {
  constructor(props){
    super(props)
    this.state = {
      excelOption: '',
      isBuildingPowerpoint: false,
      percentage: 0,
      isModalOpen: false,
      progress: 0,
      hasResults: false,
    }
  }

  async handleExcelExport() {
    const { excelOption } = this.state
    const { token, wellID, fieldID } = this.props

    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }
    const option = excelOption.value
    const id = option === 'historicoPresionCampo' ? fieldID : wellID
    console.log('field id', fieldID, wellID)
    const data = await fetch(`/well/exportData/?option=${option}&id=${id}`, { headers }).then(r => r.text())
    let a = document.createElement('a');
    a.href = 'data:attachment/csv;charset=utf-8,' + data
    a.target = '_blank'
    a.download = `${option}.csv`
    a.id = 'csvExport'
    document.body.appendChild(a)
    a.click()
    document.getElementById('csvExport').outerHTML = ''
  }

  render() {
    const { excelOption } = this.state
    const { jobID } = this.props
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
          <div className="excel-export">
            <label>Generar Excel</label>
            <div>
              <Select
                className="export-select"
                options={excelExportOptions}
                onChange={(excelOption) => this.setState({ excelOption })}
                value={excelOption}
              />
              <button className="cta" onClick={this.handleExcelExport}>Exportar XLXS</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  wellID: state.getIn(['globalAnalysis', 'well']),
  fieldID: state.getIn(['globalAnalysis', 'field']),
})

export default connect(mapStateToProps)(ExportExcel) 