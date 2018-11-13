import React, { Component } from 'react'
import { connect } from 'react-redux'
import objectPath from 'object-path'
import { slide as Menu } from 'react-burger-menu'
import Select from 'react-select'
import autobind from 'autobind-decorator'
import Filters from './Filters'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'
import { selectSimpleValue } from '../../../../lib/formatters'
import { generatePowerPoint } from '../../../../pptx/index'


// const getOptions = (key, arr) => arr.map((elem) => {
//   const val = elem[key]
//   return {
//     label: val,
//     value: val,
//   }
// })

const getOptions = val => val.map(i => {
  return {
    label: i,
    value: i
  }
})

const filterArr = arr => {
  return arr.filter((arr, index, self) => self.findIndex(t => t.label === arr.label && t.value === arr.value) === index)
}


@autobind class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state ={
      isOpen: false,
      fieldWellOptions: [],
      companyOptions: [],
      interventionOptions: [],
      terminationOptions: [],
      formationOptions: [],
      subdireccionOptions: [],
      activoOptions: [],
      fieldOptions: [],
      wellOptions: [],
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
          fieldWellOptions: r,
          subdireccionOptions: filterArr(r.map(i => ({label: i.SUBDIRECCION_NAME, value: i.SUBDIRECCION_ID}))),
          activoOptions: filterArr(r.map(i => ({label: i.ACTIVO_NAME, value: i.ACTIVO_ID}))),
          fieldOptions: filterArr(r.map(i => ({label: i.FIELD_NAME, value: i.FIELD_FORMACION_ID}))),
          wellOptions: filterArr(r.map(i => ({label: i.WELL_NAME, value: i.WELL_FORMACION_ID})))
        })
    })

    fetch('/api/getTreatmentCompanies', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({ companyOptions: getOptions(r) })
      })
    
    fetch('/api/getInterventionTypes', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({ interventionOptions: getOptions(r) })
      })
    
    fetch('/api/getTerminationTypes', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({ terminationOptions: getOptions(r) })
      })

    fetch('/api/getFormationTypes', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({ formationOptions: getOptions(r) })
      })
  }

  handleSelect(selection, location) {
    const { fieldWellOptions, companyOptions, interventionOptions, terminationOptions, 
      formationOptions, activoOptions, fieldOptions, wellOptions } = this.state
    const { setGeneral, groupBy } = this.props
    const value = objectPath.has(selection, 'value') ? selection.value : null
    setGeneral([location], value)



    console.log(companyOptions, interventionOptions, terminationOptions, formationOptions, activoOptions, fieldOptions, wellOptions)

    switch(location) {
      case 'subdireccion':
        setGeneral(['activo'], null)
        setGeneral(['field'], null)
        setGeneral(['well'], null)
        break
      case 'activo':
        setGeneral(['field'], null)
        setGeneral(['well'], null)
        break
      case 'field':
        setGeneral(['well'], null)
        break
      default:
        break
    }

    if (location === groupBy) {
      switch(groupBy) {
       case 'subdireccion':
          setGeneral(['groups'], value ? [subdireccionOptions.find(i => i.value === value).label] : subdireccionOptions.map(i => i.label))
          break
        case 'activo':
          setGeneral(['groups'], value ? [activoOptions.find(i => i.value === value).label] : activoOptions.map(i => i.label))
          break
        case 'field':
          setGeneral(['groups'], value ? [fieldOptions.find(i => i.value === value).label] : fieldOptions.map(i => i.label))
          break
        case 'well':
          setGeneral(['groups'], value ? [wellOptions.find(i => i.value === value).label] : wellOptions.map(i => i.label))
          break
        case 'formation':
          setGeneral(['groups'], value ? [formationOptions.find(i => i.value === value).label] : formationOptions.map(i => i.label))
          break
        case 'company':
          setGeneral(['groups'], value ? [companyOptions.find(i => i.value === value).label] : companyOptions.map(i => i.label))
          break
        case 'interventionType':
          setGeneral(['groups'], value ? [interventionOptions.find(i => i.value === value).label] : interventionOptions.map(i => i.label))
          break
        case 'terminationType':
          setGeneral(['groups'], value ? [terminationOptions.find(i => i.value === value).label] : terminationOptions.map(i => i.label)) 
          break
        default:
          break
      }
    }
  }

  handleSelectGroups(selection) {
    const { subdireccionOptions, fieldWellOptions, companyOptions, interventionOptions, terminationOptions, 
      formationOptions, activoOptions, fieldOptions, wellOptions } = this.state
    const { company, interventionType, terminationType, setGeneral, formation, subdireccion, activo, field, well } = this.props
    const value = objectPath.has(selection, 'value') ? selection.value : null

    switch(value) {
      case 'subdireccion':
        setGeneral(['groups'], subdireccion ? [subdireccionOptions.find(i => i.value === subdireccion).label] : subdireccionOptions.map(i => i.label))
        break
      case 'activo':
        setGeneral(['groups'], activo ? [activoOptions.find(i => i.value === activo).label] : activoOptions.map(i => i.label))
        break
      case 'field':
        setGeneral(['groups'], field ? [fieldOptions.find(i => i.value === field).label] : fieldOptions.map(i => i.label))
        break
      case 'well':
        setGeneral(['groups'], well ? [wellOptions.find(i => i.value === well).label] : wellOptions.map(i => i.label))
        break
      case 'formation':
        setGeneral(['groups'], formation ? [formationOptions.find(i => i.value === formation).label] : formationOptions.map(i => i.label))
        break
      case 'company':
        setGeneral(['groups'], company ? [companyOptions.find(i => i.value === company).label] : companyOptions.map(i => i.label))
        break
      case 'interventionType':
        setGeneral(['groups'], interventionType ? [interventionOptions.find(i => i.value === interventionType).label] : interventionOptions.map(i => i.label))
        break
      case 'terminationType':
        setGeneral(['groups'], terminationType ? [terminationOptions.find(i => i.value === terminationType).label] : terminationOptions.map(i => i.label)) 
        break
      default:
        break
    }

    setGeneral(['groupBy'], value)
  }



  render() {
    const { isOpen, fieldWellOptions, companyOptions, interventionOptions, terminationOptions, 
      formationOptions, subdireccionOptions, activoOptions, fieldOptions, wellOptions } = this.state
    const { company, interventionType, terminationType, formation, groupBy, subdireccion, activo, field, well, job, token, jobType } = this.props
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
        <div className='activo-selector' >
          Subdireccion
          <Select
            value={selectSimpleValue(subdireccion, subdireccionOptions)}
            options={subdireccionOptions}
            onChange={c => this.handleSelect(c, 'subdireccion')}
            isClearable = {true}
          />
        </div>
        <div className='activo-selector' >
          Activo
          <Select
            value={selectSimpleValue(activo, activoOptions)}
            options={activoOptions}
            onChange={c => this.handleSelect(c, 'activo')}
            isClearable = {true}
          />
        </div>
        <div className='field-selector' >
          Field
          <Select
            value={selectSimpleValue(field, fieldOptions)}
            options={fieldOptions}
            onChange={c => this.handleSelect(c, 'field')}
            isClearable = {true}
          />
        </div>
        <div className='well-selector' >
          Well
          <Select
            value={selectSimpleValue(well, wellOptions)}
            options={wellOptions}
            onChange={c => this.handleSelect(c, 'well')}
            isClearable = {true}
          />
        </div>
        <div className='formation-selector'>
          Formation
          <Select
            value={selectSimpleValue(formation, formationOptions)}
            options={formationOptions}
            onChange={c => this.handleSelect(c, 'formation')}
            isClearable = {true}
          />
        </div>
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
              onChange={this.handleSelectGroups}
              isClearable={true}
            />
          </div>
          <div>
            <button disabled={!job} onClick={() => generatePowerPoint(token, job, well, jobType)}>generar presentacion</button>
          </div>
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  subdireccion: state.getIn(['globalAnalysis', 'subdireccion']),
  activo: state.getIn(['globalAnalysis', 'activo']),
  field: state.getIn(['globalAnalysis', 'field']),
  well: state.getIn(['globalAnalysis', 'well']),
  company: state.getIn(['globalAnalysis', 'company']),
  interventionType: state.getIn(['globalAnalysis', 'interventionType']),
  terminationType: state.getIn(['globalAnalysis', 'terminationType']),
  formation: state.getIn(['globalAnalysis', 'formation']),
  groupBy: state.getIn(['globalAnalysis', 'groupBy']),
  job: state.getIn(['globalAnalysis', 'job']),
  jobType: state.getIn(['globalAnalysis', 'jobType']),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
