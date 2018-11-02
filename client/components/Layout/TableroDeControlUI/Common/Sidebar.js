import React, { Component } from 'react'
import { connect } from 'react-redux'
import objectPath from 'object-path'
import { slide as Menu } from 'react-burger-menu'
import Select from 'react-select'
import autobind from 'autobind-decorator'
import Filters from './Filters'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'
import { selectSimpleValue } from '../../../../lib/formatters';


const getOptions = (key, arr) => arr.map((elem) => {
  const val = elem[key]
  return {
    label: val,
    value: val,
  }
})

@autobind class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state ={
      isOpen: false,
      fieldWellOptions: [],
    }
  }

  componentDidMount() {
    const { token } = this.props
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

    fetch('/api/getTreatmentCompanies', headers)
      .then(r => r.json())
      .then(r => {
        const companyOptions = getOptions('COMPANIA', r)
        this.setState({ companyOptions })
      })
    
    fetch('/api/getInterventionTypes', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({ interventionOptions: getOptions('TIPO_DE_INTERVENCIONES', r) })
      })
    
    fetch('/api/getTerminationTypes', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({ terminationOptions: getOptions('TIPO_DE_TERMINACION', r) })
      })
  }

  handleSelect(selection, location) {
    const { setGeneral } = this.props
    const value = objectPath.has(selection, 'value') ? selection.value : null
    setGeneral([location], value)
  }

  render() {
    const { isOpen, fieldWellOptions, companyOptions, interventionOptions, terminationOptions } = this.state
    const { company, interventionType, terminationType, groupBy } = this.props
    const groupByOptions = [
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
      <div>
        <button className="bm-burger-button" onClick={() => this.setState({ isOpen: true })}><i className="fa fa-bars" /></button>
        <Menu
          isOpen={isOpen}
          right
          customBurgerIcon={false}
          onStateChange={(state) => !state.isOpen ? this.setState({ isOpen: false }) : null}
        >
          <Filters fieldWellOptions={fieldWellOptions} />
          <div className='formation-selector'>
            Company
            <Select
              value={selectSimpleValue(company, companyOptions)}
              options={companyOptions}
              onChange={c => this.handleSelect(c, 'company')}
              isClearable={true}
            />
          </div>
          <div className='formation-selector'>
            Intervention
            <Select
              value={selectSimpleValue(interventionType, interventionOptions)}
              options={interventionOptions}
              onChange={c => this.handleSelect(c, 'interventionType')}
              isClearable = {true}
            />
          </div>
          <div className='formation-selector'>
            Termination
            <Select
              value={selectSimpleValue(terminationType, terminationOptions)}
              options={terminationOptions}
              onChange={c => this.handleSelect(c, 'terminationType')}
              isClearable={true}
            />
          </div>
          <div className='formation-selector'>
            Group By
            <Select
              value={selectSimpleValue(groupBy, groupByOptions)}
              options={groupByOptions}
              onChange={c => this.handleSelect(c, 'groupBy')}
              isClearable={true}
            />
          </div>
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  company: state.getIn(['globalAnalysis', 'company']),
  interventionType: state.getIn(['globalAnalysis', 'interventionType']),
  terminationType: state.getIn(['globalAnalysis', 'terminationType']),
  groupBy: state.getIn(['globalAnalysis', 'groupBy']),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
