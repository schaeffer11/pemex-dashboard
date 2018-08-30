import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setContenidoDeAceite, setContenidoDeAgua, setContenidoDeEmulsion, setContenidoDeSolidos, setTipoDeSolidos, setDensidadDelAceite, setDensidadDelAgua, setDensidadDeLaEmulsion, setContenidoDeAsfaltenos, setContenidoDeParafinas, setContenidoDeResinas, setIndiceDeEstabilidadDelColoidal, setIndiceDeEstabilidadDelAgua, setPH, setSalinidad, setViscosidadDelAceite, setSistemAcido, setPesoMuestraInicial, setPesoMuestraFinal, setSolubilidad, setSistemaAcidoGrabado, setNucleoDeFormacion, setGrabado, setTipoDeGelLineal, setViscosidadDelGelLineal, setTiempoDeReticulacion, setPHGelLineal, setTiempoDeRompedorDelGel, setObervacionesPruebasLabAcido } from '../../../../../redux/actions/intervencionesAcido'
import { connect } from 'react-redux'

@autobind class PruebasDeLaboratorioAcidoExtra extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeCaracterizacionForm() {
    let { setContenidoDeAceite, setContenidoDeAgua, setContenidoDeEmulsion, setContenidoDeSolidos, setTipoDeSolidos, setDensidadDelAceite, setDensidadDelAgua, setDensidadDeLaEmulsion, setContenidoDeAsfaltenos, setContenidoDeParafinas, setContenidoDeResinas, setIndiceDeEstabilidadDelColoidal, setIndiceDeEstabilidadDelAgua, setPH, setSalinidad, setViscosidadDelAceite, formData } = this.props
    formData = formData.toJS()
    let { contenidoDeAceite, contenidoDeAgua, contenidoDeEmulsion, contenidoDeSolidos, tipoDeSolidos, densidadDelAceite, densidadDelAgua, densidadDeLaEmulsion, contenidoDeAsfaltenos, contenidoDeParafinas, contenidoDeResinas, indiceDeEstabilidadDelColoidal, indiceDeEstabilidadDelAgua, pH, salinidad, viscosidadDelAceite } = formData

    return (
      <div className='caracterizacion-form' >
        <div className='header'>
          Caracterización de los Fluidos Producidos
        </div>
        <InputRow header="Contenido de aceite" name='' unit="%" value={contenidoDeAceite} onChange={setContenidoDeAceite}/>
        <InputRow header="Contenido de agua" name='' unit="%" value={contenidoDeAgua} onChange={setContenidoDeAgua}/>
        <InputRow header="Contenido de emulsión" name='' unit="%" value={contenidoDeEmulsion} onChange={setContenidoDeEmulsion}/>
        <InputRow header="Contenido de sólidos" name='' unit="%" value={contenidoDeSolidos} onChange={setContenidoDeSolidos}/>
        <InputRow header="Tipo de sólidos" name='' value={tipoDeSolidos} onChange={setTipoDeSolidos}/>
        <InputRow header="Densidad del aceite" name='' unit="g/cm3" value={densidadDelAceite} onChange={setDensidadDelAceite}/>
        <InputRow header="Densidad del agua" name='' unit="g/cm3" value={densidadDelAgua} onChange={setDensidadDelAgua}/>
        <InputRow header="Densidad de la emulsión" name='' unit="g/cm3" value={densidadDeLaEmulsion} onChange={setDensidadDeLaEmulsion}/>
        <InputRow header="Contenido de asfaltenos" name='' unit="%" value={contenidoDeAsfaltenos} onChange={setContenidoDeAsfaltenos}/>
        <InputRow header="Contenido de parafinas" name='' unit="%" value={contenidoDeParafinas} onChange={setContenidoDeParafinas}/>
        <InputRow header="Contenido de resinas" name='' unit="%" value={contenidoDeResinas} onChange={setContenidoDeResinas}/>
        <InputRow header="Índice de estabilidad coloidal" name='' unit="adim" value={indiceDeEstabilidadDelColoidal} onChange={setIndiceDeEstabilidadDelColoidal}/>
        <InputRow header="Índice de estabilidad del agua" name='' unit="adim" value={indiceDeEstabilidadDelAgua} onChange={setIndiceDeEstabilidadDelAgua}/>
        <InputRow header="pH" name='' unit="adim" value={pH} onChange={setPH}/>
        <InputRow header="Salinidad" name='' unit="ppm" value={salinidad} onChange={setSalinidad}/>
        <InputRow header="Viscosidad del aceite" name='' unit="cp" value={viscosidadDelAceite} onChange={setViscosidadDelAceite}/>
      </div>
    )
  }

  makeSolubilidadForm() {
    let { setSistemAcido, setPesoMuestraInicial, setPesoMuestraFinal, setSolubilidad, formData } = this.props
    formData = formData.toJS()
    let { sistemAcido, pesoMuestraInicial, pesoMuestraFinal, solubilidad } = formData
    
    return (
      <div className='solubilidad-form' >
        <div className='header'>
          Prueba de Solubilidad (Recorte de Canal o Nucleo)
        </div>
        <InputRowUnitless header="Sistema Ácido" name='' value={sistemAcido} onChange={setSistemAcido}/>
        <InputRow header="Peso muestra inicial" name='' unit="gr" value={pesoMuestraInicial} onChange={setPesoMuestraInicial}/>
        <InputRow header="Peso muestra final" name='' unit="gr" value={pesoMuestraFinal} onChange={setPesoMuestraFinal}/>
        <InputRow header="Solubilidad" name='' unit="%" value={solubilidad} onChange={setSolubilidad}/>
      </div>
    )
  }

  makeGrabadoNucleosForm() {
    let { setSistemaAcidoGrabado, setNucleoDeFormacion, setGrabado, formData } = this.props
    formData = formData.toJS()
    let { sistemaAcidoGrabado, nucleoDeFormacion, grabado } = formData
    
    return (
      <div className='grabado-nucleos-form' >
        <div className='header'>
          Prueba de Grabado de Nucleos
        </div>
        <InputRowUnitless header="Sistema ácido" name='' value={sistemaAcidoGrabado} onChange={setSistemaAcidoGrabado}/>
        <InputRowUnitless header="Nucleo de formación" name='' value={nucleoDeFormacion} onChange={setNucleoDeFormacion}/>
        <InputRow header="Grabado" name='' unit="gr" value={grabado} onChange={setGrabado}/>
      </div>
    )
  }

  makeGelLinealForm() {
    let { setTipoDeGelLineal, setViscosidadDelGelLineal, setTiempoDeReticulacion, setPHGelLineal, setTiempoDeRompedorDelGel, formData } = this.props
    formData = formData.toJS()
    let { tipoDeGelLineal, viscosidadDelGelLineal, tiempoDeReticulacion, pHGelLineal, tiempoDeRompedorDelGel } = formData
    
    return (
      <div className='gel-lineal-form' >
        <div className='header'>
          Prueba Para Gel Lineal
        </div>
        <InputRowUnitless header="Tipo de gel lineal" name='' value={tipoDeGelLineal} onChange={setTipoDeGelLineal}/>
        <InputRow header="Viscosidad del gel lineal" name='' unit="cp" value={viscosidadDelGelLineal} onChange={setViscosidadDelGelLineal}/>
        <InputRow header="Tiempo de reticulación" name='' unit="min" value={tiempoDeReticulacion} onChange={setTiempoDeReticulacion}/>
        <InputRow header="pH gel lineal" name='' unit="adim" value={pHGelLineal} onChange={setPHGelLineal}/>
        <InputRow header="Tiempo de rompedor del gel" name='' unit="min" value={tiempoDeRompedorDelGel} onChange={setTiempoDeRompedorDelGel}/>
      </div>
    )
  }

  render() {
    let { setObervacionesPruebasLabAcido, formData } = this.props
    formData = formData.toJS()
    let { obervacionesPruebasLabAcido} = formData
    
    return (
      <div className="form pruebas-de-laboratorio-acido-extra">
          <div className='left'>
          { this.makeCaracterizacionForm() }
          </div>
          <div className='right'>
          { this.makeSolubilidadForm() }
          { this.makeGrabadoNucleosForm() }
          { this.makeGelLinealForm() }
            <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} value={obervacionesPruebasLabAcido} onChange={setObervacionesPruebasLabAcido}/> 
          </div>

          <div style={{color: 'red'}}>TODO: agregar opcion para subir evidencia de la prueba de laboratorio (add upload evidence of lab test)</div>

      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorioAcido'),
})

const mapDispatchToProps = dispatch => ({
  setContenidoDeAceite: val => dispatch(setContenidoDeAceite(val)),
  setContenidoDeAgua: val => dispatch(setContenidoDeAgua(val)),
  setContenidoDeEmulsion: val => dispatch(setContenidoDeEmulsion(val)),
  setContenidoDeSolidos: val => dispatch(setContenidoDeSolidos(val)),
  setTipoDeSolidos: val => dispatch(setTipoDeSolidos(val)),
  setDensidadDelAceite: val => dispatch(setDensidadDelAceite(val)),
  setDensidadDelAgua: val => dispatch(setDensidadDelAgua(val)),
  setDensidadDeLaEmulsion: val => dispatch(setDensidadDeLaEmulsion(val)),
  setContenidoDeAsfaltenos: val => dispatch(setContenidoDeAsfaltenos(val)),
  setContenidoDeParafinas: val => dispatch(setContenidoDeParafinas(val)),
  setContenidoDeResinas: val => dispatch(setContenidoDeResinas(val)),
  setIndiceDeEstabilidadDelColoidal: val => dispatch(setIndiceDeEstabilidadDelColoidal(val)),
  setIndiceDeEstabilidadDelAgua: val => dispatch(setIndiceDeEstabilidadDelAgua(val)),
  setPH: val => dispatch(setPH(val)),
  setSalinidad: val => dispatch(setSalinidad(val)),
  setViscosidadDelAceite: val => dispatch(setViscosidadDelAceite(val)),
  setSistemAcido: val => dispatch(setSistemAcido(val)),
  setPesoMuestraInicial: val => dispatch(setPesoMuestraInicial(val)),
  setPesoMuestraFinal: val => dispatch(setPesoMuestraFinal(val)),
  setSolubilidad: val => dispatch(setSolubilidad(val)),
  setSistemaAcidoGrabado: val => dispatch(setSistemaAcidoGrabado(val)),
  setNucleoDeFormacion: val => dispatch(setNucleoDeFormacion(val)),
  setGrabado: val => dispatch(setGrabado(val)),
  setTipoDeGelLineal: val => dispatch(setTipoDeGelLineal(val)),
  setViscosidadDelGelLineal: val => dispatch(setViscosidadDelGelLineal(val)),
  setTiempoDeReticulacion: val => dispatch(setTiempoDeReticulacion(val)),
  setPHGelLineal: val => dispatch(setPHGelLineal(val)),
  setTiempoDeRompedorDelGel: val => dispatch(setTiempoDeRompedorDelGel(val)),
  setObervacionesPruebasLabAcido: val => dispatch(setObervacionesPruebasLabAcido(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioAcidoExtra)

