import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { handleSelectValue, selectSimpleValue } from '../../../../lib/formatters'
import { checkForDifferencesInObjects } from '../../../../lib/helpers'
import { setGroupByAndGroups } from '../../../../redux/actions/global'

// Need to make groups update!
function arrayDiff(a, b) {
  return [
    ...a.filter(x => !b.includes(x)),
    ...b.filter(x => !a.includes(x)),
  ]
}

@autobind class GroupBy extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate(prevProps) {
    let { filters, globalAnalysis, setGeneral } = this.props
    filters = filters.toJS()
    globalAnalysis = globalAnalysis.toJS()
    const { groupBy } = globalAnalysis
    let prevFilters = prevProps.filters.toJS()
    let prevGlobalAnalysis = prevProps.globalAnalysis.toJS()
    const prevGroupBy = prevGlobalAnalysis.groupBy
    if (groupBy && groupBy === prevGroupBy) {
      const options = filters[groupBy]
      const prevOptions = prevFilters[groupBy]
      if (options.length !== prevOptions.length) {
        return this.setNewGroups(groupBy, filters)
      }
      const optionsForComparison = options.map(elem => elem.value)
      const prevOptionsForComparison = prevOptions.map(elem => elem.value)
      const diff = arrayDiff(optionsForComparison, prevOptionsForComparison)
      if (diff.length > 0) {
        return this.setNewGroups(groupBy, filters)
      }
    }
  }

  setNewGroups(groupBy, options) {
    const { setGeneral } = this.props
    const groups = groupBy ? options[groupBy].map(elem => elem.label) : []
    setGeneral(groupBy, groups)
  }

  handleChanges(selection) {
    const { filters } = this.props
    const groupBy = handleSelectValue(selection)
    const options = filters.toJS()
    this.setNewGroups(groupBy, options)
  }
  
  render() {
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    const { groupBy } = globalAnalysis
    const options = [
      { value: 'subdireccion', label: 'Subdirección' },
      { value: 'activo', label: 'Activo' },
      { value: 'field', label: 'Campo' },
      { value: 'well', label: 'Pozo' },
      { value: 'formation', label: 'Formación' },
      { value: 'company', label: 'Compañia' },
      { value: 'interventionType', label: 'Tipo de Intervención' },
      { value: 'terminationType', label: 'Tipo de Terminación' },
    ]
    return (
      <Select
        isClearable
        className="export-select"
        placeholder="Grupos"
        options={options}
        onChange={this.handleChanges}
        value={selectSimpleValue(groupBy, options)}
      />
    )
  }
}


const mapStateToProps = state => ({
  filters: state.get('filters'),
  groupBy: state.getIn(['globalAnalysis', 'groupBy']),
  globalAnalysis: state.get('globalAnalysis'),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (groupBy, groups) => dispatch(setGroupByAndGroups(groupBy, groups)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupBy)
