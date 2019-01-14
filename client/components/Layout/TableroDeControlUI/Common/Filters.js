import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import Select from 'react-select'
import { selectSimpleValue, convertLowDate, convertHighDate, handleSelectValue } from '../../../../lib/formatters'
import { getFilters, fetchFilterData, buildFiltersOptions } from '../../../../lib/filters'
import { checkForDifferencesInObjects } from '../../../../lib/helpers'
import { setGeneralFilters, setGeneralGlobalAnalysis, setMergeGlobalAnalysis } from '../../../../redux/actions/global'
import GroupBy from './GroupBy'

export const focusInCurrentTarget = ({ relatedTarget, currentTarget }) => {
  if (relatedTarget === null) {
    return false
  }
  let node = relatedTarget.parentNode;
  while (node !== null) {
    if (node === currentTarget) {
      return true
    }
    node = node.parentNode;
  }
  return false;
}

@autobind class Filters extends Component {
  constructor(props) {
    super(props);
    this.modalRef = React.createRef()
    this.state = {}
  }

  async componentDidMount() {
    // On mount we focus on the modal so we can blur if the user clicks elsewhere.
    this.modalRef.current.focus()

    let { setGeneralFilters, options, globalAnalysis, token } = this.props
    options = options.toJS()
    globalAnalysis = globalAnalysis.toJS()
    // check if we already have options. otherwise fetch data and build options
    for (let key in options) {
      if (options[key].length > 0) {
        return
      }
    }
    const data = await fetchFilterData(token, globalAnalysis)
    const filterOptions = buildFiltersOptions(data)
    setGeneralFilters(filterOptions)
  }

  async componentDidUpdate(prevProps) {
    const filters = getFilters()
    let { globalAnalysis, setGeneralFilters, mergeGeneralAnalysis, token } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis
    globalAnalysis = globalAnalysis.toJS()
    prevGlobalAnalysis = prevGlobalAnalysis.toJS()
    const optionKeys = [...Object.keys(filters), 'lowDate', 'highDate']
    const somethingChanged = checkForDifferencesInObjects(optionKeys, globalAnalysis, prevGlobalAnalysis)
    if (somethingChanged) {

      const data = await fetchFilterData(token, globalAnalysis)
      const newOptions = buildFiltersOptions(data)
      // Re-add if you want things to be auto selected
      // const singleValuesFromOptions = {}
      // Object.keys(newOptions).forEach(key => {
      //   const arr = newOptions[key]
      //   if (arr.length === 1) {
      //     singleValuesFromOptions[key] = arr[0].value
      //   }
      // })
      // if (Object.keys(singleValuesFromOptions).length > 0) {
      //   mergeGeneralAnalysis(singleValuesFromOptions)
      // }
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

  clearFilters() {
    const { mergeGeneralAnalysis } = this.props
    mergeGeneralAnalysis({
      subdireccion: null,
      activo: null,
      field: null,
      well: null,
      formation: null,
      company: null,
      interventionType: null,
      terminationType: null,
    })
  }

  buildSelects() {
    const filters = getFilters()
    let { globalAnalysis, options } = this.props
    globalAnalysis = globalAnalysis.toJS()
    options = options.toJS()
    const { groupBy } = globalAnalysis
    return Object.keys(options).map(k => {
      const { title } = filters[k]
      const selectValue = globalAnalysis[k]
      // We can encounter duplicate options (results vs no results), so we remove them here, because we don't need the distinction
      const unique = {}
      const filteredOptions = options[k].filter((elem) => {
        if (unique[elem.value]) {
          return false
        }
        return unique[elem.value] = true
      })

      return (
        <div key={`filter_${k}`} className="filter-individual">
          <label>{title}</label>
          <Select
            isClearable
            placeholder="Seleccionar"
            isDisabled={k === groupBy}
            className="export-select"
            options={filteredOptions}
            onChange={(selection) => this.handleSelect(selection, k)}
            value={selectSimpleValue(selectValue, options[k])}
          />
        </div>
      )
    })
  }

  handleBlur(e) {
    const { relatedTarget } = e
    let targetId = null
    if (relatedTarget) {
      targetId = relatedTarget.id
    }
    if (!focusInCurrentTarget(e) && targetId !== this.props.id) {
      this.props.closeModal()
    }
  }

  render() {
    return (
      <div ref={this.modalRef} className='export-modal filters' tabIndex="1" onClick={this.handleClick} onBlur={this.handleBlur}>
        <div className="filters-tablero">
          {this.buildSelects()}
        </div>
        <button onClick={this.clearFilters}><i className="fas fa-times" /> borrar filtros</button>
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
  mergeGeneralAnalysis: (obj) => dispatch(setMergeGlobalAnalysis(obj)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Filters)
