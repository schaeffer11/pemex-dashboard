import React from 'react'
import { connect } from 'react-redux'
import Select from 'react-select'
import { handleSelectValue } from '../../../../lib/formatters'
import { setGroupByAndGroups } from '../../../../redux/actions/global'

// Need to make groups update!

function handleChanges(selection, filters, setGeneral) {
  const groupBy = handleSelectValue(selection)
  const options = filters.toJS()
  const groups = options[groupBy].map(elem => elem.label)
  setGeneral(groupBy, groups)
}

const GroupBy = ({ filters, groupBy, setGeneral }) => {
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
      options={options}
      onChange={(selection) => handleChanges(selection, filters, setGeneral)}
      value={groupBy}
    />
  )
}

const mapStateToProps = state => ({
  filters: state.get('filters'),
  groupBy: state.getIn(['globalAnalysis', 'groupBy']),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (groupBy, groups) => dispatch(setGroupByAndGroups(groupBy, groups)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupBy)