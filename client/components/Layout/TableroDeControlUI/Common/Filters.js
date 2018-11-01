
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { connect } from 'react-redux'

import { InputRowSelectUnitless } from '../../Common/InputRow'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'
import { sortLabels, selectSimpleValue } from '../../../../lib/formatters'

@autobind class filters extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    	activoOptions: [],
    	fieldOptions: [],
    	formationOptions: [],
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {

  }

  handleSelectSubdireccion(val) {
  	let { setActivo, setField, setWell,setGeneral } = this.props
    const value = val ? val.value : null
    setGeneral(['subdireccion'], value)
    setGeneral(['activo'], null)
    setGeneral(['field'], null)
    setGeneral(['well'], null)
  }
  handleSelectActivo(val) {
  	let { setActivo, setField, setWell,setGeneral } = this.props
    const value = val ? val.value : null
    setGeneral(['activo'], value)
    setGeneral(['field'], null)
    setGeneral(['well'], null)
  }

  handleSelectField(val) {
  	let { setField, setWell, fieldWellOptions, globalAnalysis, setGeneral } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { activo } = globalAnalysis

  	let value = val ? val.value : null
    let row = fieldWellOptions.find(i => i.FIELD_FORMACION_ID === val.value)
    if (!activo) {
      setGeneral(['activo'], val)
      setActivo(val)
    }
    setGeneral(['field'], value)
    setGeneral(['well'], null)
  }

  handleSelectWell(val) {
  	let { setWell, setField, setActivo, setJob, fieldWellOptions, globalAnalysis, setGeneral } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { field, activo } = globalAnalysis
  	let value = val ? val.value : null

    if (val === null) {
      setGeneral(['field'], null)
      setGeneral(['activo'], null)
      setGeneral(['job'], null)
      setGeneral(['well'], null)
    }
    else {
      let row = fieldWellOptions.find(i => i.WELL_FORMACION_ID === val.value)
      if (!field) {
        setGeneral(['field'], row.FIELD_FORMACION_ID)
      }
      if (!activo) {
        setGeneral(['activo'], row.ACTIVO_ID)
      }
      setGeneral(['job'], null)
      setGeneral(['well'], value)
    }
  }

  handleSelectFormation(val) {
  	let { setFormation, setGeneral } = this.props
    let value = val ? val.value : null
    setGeneral(['formation'], value)
  }


  render() {
    let { fieldWellOptions, globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { activo, subdireccion, field, well, formation } = globalAnalysis

    let subdireccionOptions = []
    let activoOptions = []
    let fieldOptions = []
    let wellOptions = []

    if (fieldWellOptions.length > 0) {
      let usedSubdirecciones = []
      let subdirecciones = []
      let usedActivos = []
      let activos = []
      let usedFields = []
      let fields = []
      let usedWells = []
      let wells = []
      // console.log('field well options?', fieldWellOptions)
      fieldWellOptions.forEach(i => {
        if (!usedSubdirecciones.includes(i.SUBDIRECCION_ID)) {
          usedSubdirecciones.push(i.SUBDIRECCION_ID)
          subdirecciones.push(i)
        }
        if (!usedActivos.includes(i.ACTIVO_ID)) {
          usedActivos.push(i.ACTIVO_ID)
          activos.push(i)
        }
        if (!usedFields.includes(i.FIELD_FORMACION_ID)) {
          usedFields.push(i.FIELD_FORMACION_ID)
          fields.push(i)
        }
        if (!usedWells.includes(i.WELL_FORMACION_ID)) {
          usedWells.push(i.WELL_FORMACION_ID)
          wells.push(i)
        }
      })

      subdireccionOptions = subdirecciones.map(i => ({label: i.SUBDIRECCION_NAME, value: i.SUBDIRECCION_ID
      })).sort(sortLabels)
      activoOptions = activos.map(i => ({label: i.ACTIVO_NAME, value: i.ACTIVO_ID})).sort(sortLabels)

      // console.log('activo', activoOptions, 'subdireccion', subdireccionOptions)
      fieldOptions = fields.map(i => ({label: i.FIELD_NAME, value: i.FIELD_FORMACION_ID})).sort(sortLabels)
      wellOptions = wells.map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})).sort(sortLabels)

      if (subdireccion) {
        let fieldSubset = fieldWellOptions.filter(i => i.SUBDIRECCION_ID === parseInt(subdireccion))
        usedActivos = []
        activos = []
        usedFields = []
        fields = []
        usedWells = []
        wells = []
        fieldSubset.forEach(i => {
          if (!usedActivos.includes(i.ACTIVO_ID)) {
            usedActivos.push(i.ACTIVO_ID)
            activos.push(i)
          }
          if (!usedFields.includes(i.FIELD_FORMACION_ID)) {
            usedFields.push(i.FIELD_FORMACION_ID)
            fields.push(i)
          }
          if (!usedWells.includes(i.WELL_FORMACION_ID)) {
            usedWells.push(i.WELL_FORMACION_ID)
            wells.push(i)
          }
        })

        fieldOptions = fields.map(i => ({label: i.FIELD_NAME, value: i.FIELD_FORMACION_ID})).sort(sortLabels)
        wellOptions = wells.map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})).sort(sortLabels)
      }

      if (activo) {
        let fieldSubset = fieldWellOptions.filter(i => i.ACTIVO_ID === parseInt(activo))
        usedFields = []
        fields = []
        usedWells = []
        wells = []
        fieldSubset.forEach(i => {
          if (!usedFields.includes(i.FIELD_FORMACION_ID)) {
            usedFields.push(i.FIELD_FORMACION_ID)
            fields.push(i)
          }
          if (!usedWells.includes(i.WELL_FORMACION_ID)) {
            usedWells.push(i.WELL_FORMACION_ID)
            wells.push(i)
          }
        })

        fieldOptions = fields.map(i => ({label: i.FIELD_NAME, value: i.FIELD_FORMACION_ID})).sort(sortLabels)
        wellOptions = wells.map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})).sort(sortLabels)
      }


      if (field) {
        let wellSubset = fieldWellOptions.filter(i => i.FIELD_FORMACION_ID === parseInt(field))
        usedWells = []
        wells = []
        wellSubset.forEach(i => {
          if (!usedWells.includes(i.WELL_FORMACION_ID)) {
            usedWells.push(i.WELL_FORMACION_ID)
            wells.push(i)
          }
        })

        wellOptions = wells.map(i => ({ label: i.WELL_NAME, value: i.WELL_FORMACION_ID})).sort(sortLabels)
      }
    }

    let formationOptions = [
      {label: 'JSO', value: 'JSO'},
      {label: 'JSK', value: 'JSK'},
      {label: 'JST', value: 'JST'},
      {label: 'KI', value: 'KI'},
      {label: 'KM', value: 'KM'},
      {label: 'KS', value: 'KS'},
      {label: 'Paleoceno', value: 'paleoceno'},
      {label: 'Eoceno', value: 'eoceno'},
      {label: 'Mioceno', value: 'Mioceno'},
      {label: 'Mioceno Inferior', value: 'Mioceno Inferior'},
      {label: 'Mioceno Medio', value: 'Mioceno Medio'},
      {label: 'Encanto', value: 'Encanto'},
      {label: 'Concepción Inferior', value: 'Concepción Inferior'},
      {label: 'Concepción Superior', value: 'Concepción Superior'},
      {label: 'Filisola', value: 'Filisola'},
      {label: 'CCE', value: 'CCE'},
      {label: 'KS-KM-KI', value: 'KS-KM-KI'},
      {label: 'KS-KM', value: 'KS-KM'},
      {label: 'KM-KI', value: 'KM-KI'},
    ]

  	// const realActivo = activoOptions.find(i=>i.value === activo) || null
  	// const realField = fieldOptions.find(i=>i.value === field) || null
  	// const realWell = wellOptions.find(i=>i.value === well) || null
    // const realFormation = formationOptions.find(i=>i.value === formation) || null
    return (
      <div className="filters">
	      <div className='activo-selector' >
	        Subdireccion
	        <Select
	          value={selectSimpleValue(subdireccion, subdireccionOptions)}
	          options={subdireccionOptions}
	          onChange={this.handleSelectSubdireccion}
	          isClearable = {true}
	        />
	      </div>
	      <div className='activo-selector' >
	        Activo
	        <Select
	          value={selectSimpleValue(activo, activoOptions)}
	          options={activoOptions}
	          onChange={this.handleSelectActivo}
	          isClearable = {true}
	        />
	      </div>
	      <div className='field-selector' >
	        Field
	        <Select
	          value={selectSimpleValue(field, fieldOptions)}
	          options={fieldOptions}
	          onChange={this.handleSelectField}
	          isClearable = {true}
	        />
	      </div>
	      <div className='well-selector' >
	        Well
	        <Select
	          value={selectSimpleValue(well, wellOptions)}
	          options={wellOptions}
	          onChange={this.handleSelectWell}
	          isClearable = {true}
	        />
	      </div>
	      <div className='formation-selector'>
	        Formation
	        <Select
	          value={selectSimpleValue(formation, formationOptions)}
	          options={formationOptions}
	          onChange={this.handleSelectFormation}
	          isClearable = {true}
	        />
	      </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
	globalAnalysis: state.get('globalAnalysis'),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(filters)

