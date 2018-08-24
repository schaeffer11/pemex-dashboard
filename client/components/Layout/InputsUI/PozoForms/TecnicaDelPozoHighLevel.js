import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless } from '../../Common/InputRow'

@autobind class TechnicaDelPozoHighLevel extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  render() {


    return (
      <form className="form tecnica-del-pozo-high-level">
        <div className='main-form'>
          <InputRowUnitless header="Subdireccion" name='subdireccion' />
          <InputRowUnitless header="Bloque" name='bloque' />
          <InputRowUnitless header="Activo" name='activo' />
          <InputRowUnitless header="Campo" name='campo' />
          <InputRowUnitless header="Pozo" name='pozo' />
          <InputRowUnitless header="Formacion" name='formacion' />
          <div style={{color: 'red'}}>TODO: add logic for new proposal/upload results</div>
          <div style={{color: 'red'}}>TODO: add new well/select well? </div>
        </div>
      </form>
    )
  }
}


export default TechnicaDelPozoHighLevel

