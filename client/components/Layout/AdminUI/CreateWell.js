import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import { sortLabels } from '../../../lib/formatters'
import { filter as fuzzy } from 'fuzzaldrin'

const uniq = (arr, value, upperLevel, currentLevel) => {
  const unique = {}
  return arr.filter((elem) => {
    if (elem[upperLevel] !== value || unique[elem[currentLevel]]) {
      return false
    }
    return unique[elem[currentLevel]] = true
  })
}

@autobind class CreateWell extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef()
    this.state = {
      subdireccion: null,
      activo: null,
      field: null,
      well: null,
      subdirecciones: {},
      subdireccionOptions: [],
      activoOptions: [],
      fieldWellOptions: [],
      wellOptions: [],
      wellName: '',
      wellNameMeetsCriteria: false,
      fuzzyResult: [],
      selectionStart: 0,
      selectionEnd: 0,
    }
  }

  async componentDidMount() {
    const { token } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }

    const fieldWellOptions = await fetch('/api/getFieldWellMapping', { headers }).then(r => r.json())
    if (fieldWellOptions.length > 0) {
      const unique = {}
      const subdireccionOptions = fieldWellOptions.filter((elem) => {
        if (unique[elem.SUBDIRECCION_ID]) {
          return false
        }
        return unique[elem.SUBDIRECCION_ID] = true
      }).map((elem) => ({
        label: elem.SUBDIRECCION_NAME,
        value: elem.SUBDIRECCION_ID,
      })).sort(sortLabels)
      this.setState({ subdireccionOptions, fieldWellOptions })
    }
  }

  handleSubdireccionSelect(e) {
    const newState = {
      subdireccion: e,
      activo: null,
      field: null,
      wellOptions: null,
    }
    if (e !== null) {
      const { fieldWellOptions } = this.state
      newState.activoOptions = uniq(fieldWellOptions, e.value, 'SUBDIRECCION_ID', 'ACTIVO_ID').map((elem) => ({
        label: elem.ACTIVO_NAME,
        value: elem.ACTIVO_ID,
      })).sort(sortLabels)
    }
    this.setState(newState)
  }

  handleActivoSelect(e) {
    const newState = {
      activo: e,
      field: null,
      wellOptions: null,
    }
    if (e !== null) {
      const { fieldWellOptions } = this.state
      newState.fieldOptions = uniq(fieldWellOptions, e.value, 'ACTIVO_ID', 'FIELD_FORMACION_ID').map((elem) => ({
          label: elem.FIELD_NAME,
          value: elem.FIELD_FORMACION_ID,
        })).sort(sortLabels)
    }
    this.setState(newState)
  }

  handleFieldSelect(e) {
    const newState = {
      field: e,
    }
    if (e !== null) {
      const { fieldWellOptions } = this.state
      newState.wellOptions = uniq(fieldWellOptions, e.value, 'FIELD_FORMACION_ID', 'WELL_FORMACION_ID').map((elem) => elem.WELL_NAME)
    }
    this.setState(newState)
  }

  handleWellName(e) {
    const { wellOptions } = this.state
    const { value, selectionStart, selectionEnd } = e.target
    const regex = /^[A-Za-z0-9? ,-]+$/ //alphanumeric+space+hyphen
    const wellNameMeetsCriteria = regex.test(value) && value.length > 3
    const finalValue = value.toUpperCase()
    const fuzzyResult = fuzzy(wellOptions, finalValue)
    const isNotUnique = wellOptions.some(elem => {
      return elem === finalValue
    })
    this.setState({
      wellName: finalValue,
      wellNameMeetsCriteria,
      fuzzyResult,
      isNotUnique,
    }, () => {
      // Set cursor to correct position
      this.inputRef.current.setSelectionRange(selectionStart, selectionEnd)
    })
  }

  renderWellNameUnique() {
    const { isNotUnique, wellName } = this.state
    const comparison = isNotUnique || wellName.length === 0
    const color = comparison ? '#d84040' : 'green' 
    const figure = comparison ? 'fas fa-times' : 'fas fa-check'
    return <i style={{ color }} className={figure} />
  }

  renderWellNameMeetsCriteria() {
    const { wellNameMeetsCriteria } = this.state
    const color = wellNameMeetsCriteria ? 'green' : '#d84040'
    const figure = wellNameMeetsCriteria ? 'fas fa-check' : 'fas fa-times'
    return <i style={{ color }} className={figure} />
  }

  renderSimilarWells() {
    const { fuzzyResult } = this.state
    if (fuzzyResult.length > 0) {
      return fuzzyResult.map((elem) => {
        return (
          <li key={`fuzz_${elem}`}>
            {elem}
          </li>
        )
      })
    }
  }

  getCanSubmitNewWell() {
    const { isNotUnique, wellNameMeetsCriteria } = this.state
    const wellNameIsUnique = !isNotUnique
    if(wellNameIsUnique && wellNameMeetsCriteria) {
      return true
    }
    return false
  }

  createNewWell() {
    console.log('creating new well')
  }

  render() {
    const { subdireccionOptions, activo, subdireccion, field, activoOptions, fieldOptions, wellName, selectionStart, selectionEnd } = this.state

    const canSubmit = this.getCanSubmitNewWell()
    return (
    <div className="createUser">
        <h3>Crear Pozo</h3>
        <div className="adminContainer">
          <ul className="createUserForm">
            <li>
              <label htmlFor="">Subdirección</label>
              <Select 
                placeholder='Seleccionar...'
                className='input'
                options={subdireccionOptions}
                value={subdireccion}
                onChange={this.handleSubdireccionSelect}
                isClearable
              />
            </li>
            <li>
              <label htmlFor="">Activo</label>
              <Select 
                placeholder='Seleccionar...'
                className='input'
                options={activoOptions}
                value={activo}
                onChange={this.handleActivoSelect}
                isClearable
              />
            </li>
            <li>
              <label htmlFor="">Campo</label>
              <Select 
                placeholder='Seleccionar...'
                className='input'
                options={fieldOptions}
                value={field}
                onChange={this.handleFieldSelect}
                isClearable
              />
            </li>
            <li>
              <label htmlFor="">Nombre del Pozo</label>
              <input
                ref={this.inputRef}
                autoComplete="off"
                type="text"
                value={wellName}
                onChange={this.handleWellName}
              />
            </li>
          </ul>
          <ul>
            <label>Pozos con nombres similares</label>
            {this.renderSimilarWells()}
          </ul>
          <ul>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                  {this.renderWellNameUnique()}
                </div>
                <div className="validationExplanation">
                  <p>Nombre del pozo es único</p>
                </div>
              </div>
            </li>
            <li>
              <div className="validationContainer">
                <div className="validationCheck">
                  {this.renderWellNameMeetsCriteria()}
                </div>
                <div className="validationExplanation">
                  <p>Nombre del pozo solo contiene al menos tres caracteres alfa-numéricos, espacio, y o guión</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <button className="cta" disabled={!canSubmit} onClick={this.createNewWell}>Crear Pozo</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  token: state.getIn(['user', 'token']),
})

export default connect(mapStateToProps)(CreateWell)
