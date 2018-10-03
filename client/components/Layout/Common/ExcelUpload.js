import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import XLSX from 'xlsx'
import AriaModal from 'react-aria-modal'
import moment from 'moment'
import ReactTable from 'react-table'

function jsDateFromExcel(excelDate) {
  const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000)
  const localTime = new Date(date.getTime() + (new Date()).getTimezoneOffset() * 60000)
  return localTime
}

const parseJson = (data, headers) => {
  return data.map((elem, index) => {
    headers.forEach(header => {
      const { type, name } = header
      if (type === 'date') {
        if (Number.isInteger(elem[name])) {
          const jsDate = moment(jsDateFromExcel(elem[name])).format('YYYY-MM-DD')
          elem[name] = jsDate
        } else if(moment(elem[name], 'DD/MM/YYYY').isValid()) {
          elem[name] = moment(elem[name]).format('YYYY-MM-DD')
        }
      }
    })
    elem.length = data.length
    elem.index = index
    return elem
  })
}

const getErrors = (data, headers) => {
  const errors = []
  data.forEach((elem, index) => {
    headers.forEach(k => {
      const { type, name } = k
      switch (type) {
        case 'date':
          const isInvalidDate = !moment(elem[name], 'YYYY-MM-DD').isValid()
          if (isInvalidDate) {
            errors.push({ column: name, row: index + 1, error: 'fecha incorrecta', value: elem[name] })
          }
          break;
        case 'number':
          if (isNaN(elem[name]))
            errors.push({ column: name, row: index + 1, error: 'valor no es numérico', value: elem[name] })
          break;
        default:
          break;
      }
    })
  })
  return errors
}

@autobind class ExcelUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAccepted: true,
      modalIsOpen: false,
      errors: []
    }
    this.acceptedFileType='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }

  handleFile(e) {
    const { headers, setData } = this.props
    const file = e.target.files[0]
    // First we must empty the table
    const initialValues = {}
    headers.forEach(elem => {
      initialValues[elem.name] = ''
    })
    setData([initialValues])
    if (!file) {
      return this.setState({ isAccepted: true, errors: [] })
    }
    if (file.type !== this.acceptedFileType) {
      return this.setState({ isAccepted: false })
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      // Get the data from the Excel file and convert to json
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      let jsonData = XLSX.utils.sheet_to_json(sheet, { header: headers.map(elem => elem.name) })
      /**
       * Remove header from file
       * Parse data to fix dates and add missing data
       * Collect errors from parsed data
       */
      jsonData.shift()
      const parsedData = parseJson(jsonData, headers)
      const errors = getErrors(parsedData, headers)
      // Handle resulting data
      console.log('parsedData',parsedData)
      if (errors.length > 0) {
        return this.setState({ errors, isAccepted: false, modalIsOpen: true })
      }
      setData(parsedData)
      return this.setState({ isAccepted: true })
    }

    reader.onerror = function(err) {
      return this.setState({ isAccepted: false })
    }

    reader.readAsBinaryString(file)
  }

  deactivateModal() {
    console.log('deactivating modal')
    this.setState({ modalIsOpen: false })
  }

  buildModal() {
    const { modalIsOpen, errors } = this.state
    const columns = [
      {
        Header: 'Columna',
        accessor: 'column',
      },
      {
        Header: 'Renglon',
        accessor: 'row',
      },
      {
        Header: 'Valor',
        accessor: 'value',
      },
      {
        Header: 'Error',
        accessor: 'error',
        minWidth: 300,
      },
    ]
    if (modalIsOpen) {
      return (
        <AriaModal
          titleId="error-modal"
          onExit={this.deactivateModal}
          underlayClickExits={true}
          verticallyCenter={true}
          focusDialog={true}
          dialogClass="queryModalPartialReset"
          dialogStyle={{verticalAlign: '', textAlign: 'center', maxHeight: '80%', marginTop: '2%'}}
        >
        <div className="modalTest">
          <ReactTable 
            columns={columns}
            data={errors}
          />
        </div>
        </AriaModal>
      )
    }
    return null
  }

  render() {
    return (
      <div className="excel-upload">
        <button
          className="submit download-template"
          onClick={() => window.location.replace(`/api/get_template/${this.props.template}`)}
        >
          Descarga Plantilla de Esta Página
        </button>
        <input
          type="file"
          accept={this.acceptedFileType}
          onChange={this.handleFile}
        />
        {this.buildModal()}
        {!this.state.isAccepted && <div className="load-error" title="Presionar para ver errores" onClick={() => this.setState({ modalIsOpen: true })}>El archivo contiene errores</div>}
      </div>
    )
  }
}

export default ExcelUpload
