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

const convertDates = (data, headers) => {
  return data.map((elem, index) => {
    headers.forEach(header => {
      const { type, name } = header
      if (type === 'date') {
        console.log('index', index, elem[name], Number.isInteger(elem[name]), typeof elem[name], Number.isSafeInteger(elem[name]))
        if (Number.isInteger(elem[name])) {
          const jsDate = moment(jsDateFromExcel(elem[name])).format('DD/MM/YYYY')
          console.log('ici', index, jsDate)
          elem[name] = jsDate
          // elem[name] = moment(jsDate).format('DD/MM/YYYY')
        }
      }
    })
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
          const isInvalidDate = !moment(elem[name], 'DD/MM/YYYY').isValid()
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

  test(e) {
    const { headers } = this.props
    const file = e.target.files[0]
    if (file.type !== this.acceptedFileType) {
      return this.setState({ isAccepted: false })
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log('e?', e)
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      let parsedData = XLSX.utils.sheet_to_json(sheet, { header: headers.map(elem => elem.name) })
      parsedData.shift()
      if (headers.findIndex(elem => elem.type === 'date') !== -1) {
        console.log('converting dates')
        parsedData = convertDates(parsedData, headers)
      }
      const errors = getErrors(parsedData, headers)
      console.log('data', parsedData)
      if (errors.length > 0) {
        return this.setState({ errors, isAccepted: false, modalIsOpen: true })
      }
      return this.setState({ isAccepted: true })
    }
    reader.onerror = function(err) {
      return this.setState({ isAccepted: false })
    }
    reader.readAsBinaryString(file)
  }

  deactivateModal() {
    this.setState({ isModalOpen: false })
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
      <div>
        <input
          type="file"
          accept={this.acceptedFileType}
          onChange={this.test}
        />
        {/* <input type='file' accept="image/*" onChange={(e) => this.handleFileUpload(e, setImgBoreDiagramURL)}></input> */}
        Welcome to the Machine
        {!this.state.isAccepted && <div>Bad file</div>}
        {this.buildModal()}
      </div>
    )
  }
}

export default ExcelUpload
