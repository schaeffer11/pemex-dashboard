
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { connect } from 'react-redux'

import { InputRowSelectUnitless } from '../../Common/InputRow'
import { setActivo, setField, setWell, setFormation } from '../../../../redux/actions/global'
import { sortLabels } from '../../../../lib/formatters'

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

  handleSelectActivo(val) {
  	let { setActivo, setField, setWell } = this.props
  	let value = val ? val.value : null
  	setActivo(value)
  	setField(null)
  	setWell(null)
  }

  handleSelectField(val) {
  	let { setField, setWell } = this.props
  	let value = val ? val.value : null

  	setField(value)
  	setWell(null)
  }

  handleSelectWell(val) {
  	let { setWell } = this.props
  	let value = val ? val.value : null

  	setWell(value)
  }

  handleSelectFormation(val) {
  	let { setFormation } = this.props
  	let value = val ? val.value : null

  	setFormation(value)
  }


  render() {
    let { fieldWellOptions, globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { activo, field, well, formation } = globalAnalysis

    let activoOptions = []
    let fieldOptions = []
    let wellOptions = []



    let fieldSubset = []
    let wellSubset = []

    if (fieldWellOptions.length > 0) {

      let usedActivos = []

      let activos = []
      fieldWellOptions.forEach(i => {
        if (!usedActivos.includes(i.ACTIVO_ID)) {
          usedActivos.push(i.ACTIVO_ID)
          activos.push(i)
        }

      })
      activoOptions = activos.map(i => ({label: i.ACTIVO_NAME, value: i.ACTIVO_ID})).sort(sortLabels)


      if (activo) {
        fieldSubset = fieldWellOptions.filter(i => i.ACTIVO_ID === parseInt(activo))
        let usedFields = []
        let fields = []
        fieldSubset.forEach(i => {
          if (!usedFields.includes(i.FIELD_FORMACION_ID)) {
            usedFields.push(i.FIELD_FORMACION_ID)
            fields.push(i)
          }
        })

        fieldOptions = fields.map(i => ({label: i.FIELD_NAME, value: i.FIELD_FORMACION_ID})).sort(sortLabels)
      }

      if (field) {
        wellSubset = fieldSubset.filter(i => i.FIELD_FORMACION_ID === parseInt(field))
        let usedWells = []
        let wells = []
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

  	const realActivo = activoOptions.find(i=>i.value === activo) || null
  	const realField = fieldOptions.find(i=>i.value === field) || null
  	const realWell = wellOptions.find(i=>i.value === well) || null
  	const realFormation = formationOptions.find(i=>i.value === formation) || null

    return (
      <div className="filters">
	      <div className='activo-selector' >
	        Activo
	        <Select
	          value={realActivo}
	          options={activoOptions}
	          onChange={this.handleSelectActivo}
	          isClearable = {true}
	        />
	      </div>
	      <div className='field-selector' >
	        Field
	        <Select
	          value={realField}
	          options={fieldOptions}
	          onChange={this.handleSelectField}
	          isClearable = {true}
	        />
	      </div>
	      <div className='well-selector' >
	        Well
	        <Select
	          value={realWell}
	          options={wellOptions}
	          onChange={this.handleSelectWell}
	          isClearable = {true}
	        />
	      </div>
	      <div className='formation-selector' >
	        Formation
	        <Select
            isDisabled
	          value={realFormation}
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
	setActivo: val => dispatch(setActivo(val)),
	setField: val => dispatch(setField(val)),
	setWell: val => dispatch(setWell(val)),
	setFormation: val => dispatch(setFormation(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(filters)

