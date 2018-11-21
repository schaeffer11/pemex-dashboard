import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import Select from 'react-select'
import { selectSimpleValue, convertLowDate, convertHighDate } from '../../../../lib/formatters'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'

@autobind class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        subdireccion: [],
        activo: [],
        field: [],
        well: [],
        company: [],
        formation: [],
        interventionType: [],
        terminationType: [],
      }
    }
    this.filters = {
      subdireccion: {
        title: 'Subdirección',
        id: 'SUBDIRECCION_ID',
        name: 'SUBDIRECCION_NAME',
      },
      activo: {
        title: 'Activo',
        id: 'ACTIVO_ID',
        name: 'ACTIVO_NAME',
      },
      field: {
        title: 'Campo',
        id: 'FIELD_FORMACION_ID',
        name: 'FIELD_NAME',
      },
      well: {
        title: 'Pozo',
        id: 'WELL_FORMACION_ID',
        name: 'WELL_NAME',
      },
      company: {
        title: 'Compañía',
        id: 'COMPANY',
        name: 'COMPANY',
      },
      formation: {
        title: 'Formación',
        id: 'FORMACION',
        name: 'FORMACION',
      },
      interventionType: {
        title: 'Intervención',
        id: 'TIPO_DE_INTERVENCIONES',
        name: 'TIPO_DE_INTERVENCIONES',
      },
      terminationType: {
        title: 'Terminación',
        id: 'TIPO_DE_TERMINACION',
        name: 'TIPO_DE_TERMINACION',
      },
    }
  }

  async componentDidMount() {
    const data = await this.getData()
    const options = this.buildOptions(data)
    this.setState({ options })
  }

  async componentDidUpdate(prevProps) {
    const { options } = this.state
    const { globalAnalysis } = this.props
    const prevGlobalAnalysis = prevProps.globalAnalysis
    let somethingChanged = false
    const optionKeys = [...Object.keys(options), 'lowDate', 'highDate']
    for (let option of optionKeys) {
      if (globalAnalysis[option] !== prevGlobalAnalysis[option]) {
        somethingChanged = true
        break;
      }
    }
    if (somethingChanged) {
      const data = await this.getData()
      const options = this.buildOptions(data)
      this.setState({ options })
    }
  }

  async getData() {
    const { token } = this.props
    const query = this.buildQuery()
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    const url = `/api/filterOptions?${query.join('&')}`
    console.log('url', url)
    const data = await fetch(url, headers).then(r => r.json())
    return data
  }

  buildQuery() {
    const { globalAnalysis } = this.props
    console.log('globalAnalysis', globalAnalysis.lowDate)
    const filteredFilters = Object.keys(this.filters).filter(f => {
      return globalAnalysis[f]
    })
    
    globalAnalysis.lowDate = convertLowDate(globalAnalysis.lowDate)
    globalAnalysis.highDate = convertHighDate(globalAnalysis.highDate)
    const queries = [...filteredFilters, 'lowDate', 'highDate'].map(f => `${f}=${globalAnalysis[f]}`)
    console.log('queries?', queries)
    return queries
  }

  buildOptions(data) {
    const options = {}
    data.filter(elem => {
      const key = Object.keys(elem)[0]
      if (key === 'lowDate' || key === 'highDate') {
        return false
      }
      return true
    }).forEach(elem => {
      const key = Object.keys(elem)[0]
      console.log("key2", key)
      const { id, name } = this.filters[key]
      options[key] = elem[key].map(i => ({
        label: i[name],
        value: i[id],
      }))
    })
    return options
  }

  handleSelect(selection, type) {
    console.log('what is my selection', selection)
    const { setGeneral } = this.props
    let valueToSet
    if (selection === null) {
      valueToSet = null
    } else {
      valueToSet = selection.value
    }
    setGeneral([type], valueToSet)
  }

  buildSelects() {
    const { options } = this.state
    const { setGeneral, globalAnalysis } = this.props
    return Object.keys(options).map(k => {
      const { title } = this.filters[k]
      const selectValue = globalAnalysis[k]
      return (
        <div>
          <label>{title}</label>
          <Select
            isClearable
            className="export-select"
            options={options[k]}
            onChange={(selection) => this.handleSelect(selection, k)}
            value={selectSimpleValue(selectValue, options[k])}
          />
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        WELCOME TO THE MACHINE
        {this.buildSelects()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  globalAnalysis: state.get('globalAnalysis').toJS()
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
