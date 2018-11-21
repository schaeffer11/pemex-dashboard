import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import Select from 'react-select'
import { selectSimpleValue, convertLowDate, convertHighDate, handleSelectValue } from '../../../../lib/formatters'
import { checkForDifferencesInObjects } from '../../../../lib/helpers'
import { setGeneralFilters, setGeneralGlobalAnalysis } from '../../../../redux/actions/global'
import GroupBy from './GroupBy'

@autobind class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {}
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
      formation: {
        title: 'Formación',
        id: 'FORMACION',
        name: 'FORMACION',
      },
      company: {
        title: 'Compañía',
        id: 'COMPANY',
        name: 'COMPANY',
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
    let { setGeneralFilters, options } = this.props
    options = options.toJS()
    // check if we already have options. otherwise fetch data and build options
    for (let key in options) {
      if (options[key].length > 0) {
        return
      }
    }
    const data = await this.getData()
    const filterOptions = this.buildOptions(data)
    setGeneralFilters(filterOptions)
  }

  async componentDidUpdate(prevProps) {
    let { globalAnalysis, setGeneralFilters } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis
    globalAnalysis = globalAnalysis.toJS()
    prevGlobalAnalysis = prevGlobalAnalysis.toJS()
    // let somethingChanged = false
    const optionKeys = [...Object.keys(this.filters), 'lowDate', 'highDate']
    const somethingChanged = checkForDifferencesInObjects(optionKeys, globalAnalysis, prevGlobalAnalysis)
    if (somethingChanged) {
      const data = await this.getData()
      const newOptions = this.buildOptions(data)
      setGeneralFilters(newOptions)
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
    const data = await fetch(url, headers).then(r => r.json())
    return data
  }

  buildQuery() {
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    const filteredFilters = Object.keys(this.filters).filter(f => {
      return globalAnalysis[f]
    })
    globalAnalysis.lowDate = convertLowDate(globalAnalysis.lowDate)
    globalAnalysis.highDate = convertHighDate(globalAnalysis.highDate)
    const queries = [...filteredFilters, 'lowDate', 'highDate'].map(f => `${f}=${globalAnalysis[f]}`)
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
      const { id, name } = this.filters[key]
      options[key] = elem[key].map(i => ({
        label: i[name],
        value: i[id],
      }))
    })
    return options
  }

  handleSelect(selection, type) {
    const { setGeneralAnalysis } = this.props
    const value = handleSelectValue(selection)
    setGeneralAnalysis([type], value)
  }

  buildSelects() {
    let { globalAnalysis, options } = this.props
    globalAnalysis = globalAnalysis.toJS()
    options = options.toJS()
    const { groupBy } = globalAnalysis
    return Object.keys(options).map(k => {
      const { title } = this.filters[k]
      const selectValue = globalAnalysis[k]
      return (
        <div key={`filter_${k}`} className="filter-individual">
          <label>{title}</label>
          <Select
            isClearable
            placeholder="Seleccionar"
            isDisabled={k === groupBy}
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
      <div className='export-modal filters'>
        <div className="filters-tablero">
          {this.buildSelects()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  options: state.get('filters'),
  globalAnalysis: state.get('globalAnalysis'),
})

const mapDispatchToProps = dispatch => ({
  setGeneralFilters: (value) => dispatch(setGeneralFilters(value)),
  setGeneralAnalysis: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
