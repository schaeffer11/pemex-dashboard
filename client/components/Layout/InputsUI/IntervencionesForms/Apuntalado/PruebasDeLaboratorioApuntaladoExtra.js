import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setContenidoDeAceite, setContenidoDeAgua, setContenidoDeEmulsion, setContenidoDeSolidos, setTipoDeSolidos, setDensidadDelAceite, setDensidadDelAgua, setDensidadDeLaEmulsion, setContenidoDeAsfaltenos, setContenidoDeParafinas, setContenidoDeResinas, setIndiceDeEstabilidadDelColoidal, setIndiceDeEstabilidadDelAgua, setPH, setSalinidad, setViscosidadDelAceite, setTipoDeGelLineal, setViscosidadDelGelLineal, setTiempoDeReticulacion, setPHGelLineal, setTiempoDeRompedorDelGel, setTamanoDelApuntalante, setGravedadEspecifica, setEsfericidad, setRedondeo, setTurbidez, setResistencia, setPruebaDeSolubilidadConAcida, setObervacionesPruebasLabApuntalado } from '../../../../../redux/actions/intervencionesApuntalado'
import { connect } from 'react-redux'

@autobind class PruebasDeLaboratorioApuntaladoExtra extends Component {
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
        <InputRow header="Contenido de aceite" name='' unit="%" value={contenidoDeAceite} onChange={setContenidoDeAceite} />
        <InputRow header="Contenido de agua" name='' unit="%" value={contenidoDeAgua} onChange={setContenidoDeAgua} />
        <InputRow header="Contenido de emulsión" name='' unit="%" value={contenidoDeEmulsion} onChange={setContenidoDeEmulsion} />
        <InputRow header="Contenido de solidos" name='' unit="%" value={contenidoDeSolidos} onChange={setContenidoDeSolidos} />
        <InputRow header="Tipo de solidos" name='' value={tipoDeSolidos} onChange={setTipoDeSolidos} />
        <InputRow header="Densidad del aceite" name='' unit="g/cm3" value={densidadDelAceite} onChange={setDensidadDelAceite} />
        <InputRow header="Densidad del agua" name='' unit="g/cm3" value={densidadDelAgua} onChange={setDensidadDelAgua} />
        <InputRow header="Densidad de la emulsion" name='' unit="g/cm3" value={densidadDeLaEmulsion} onChange={setDensidadDeLaEmulsion} />
        <InputRow header="Contenido de asfaltenos" name='' unit="%" value={contenidoDeAsfaltenos} onChange={setContenidoDeAsfaltenos} />
        <InputRow header="Contenido de parafinas" name='' unit="%" value={contenidoDeParafinas} onChange={setContenidoDeParafinas} />
        <InputRow header="Contenido de resinas" name='' unit="%" value={contenidoDeResinas} onChange={setContenidoDeResinas} />
        <InputRow header="Índice de estabilidad coloidal" name='' unit="adim" value={indiceDeEstabilidadDelColoidal} onChange={setIndiceDeEstabilidadDelColoidal} />
        <InputRow header="Índice de estabilidad del agua" name='' unit="adim" value={indiceDeEstabilidadDelAgua} onChange={setIndiceDeEstabilidadDelAgua} />
        <InputRow header="pH" name='' unit="adim" value={pH} onChange={setPH} />
        <InputRow header="Salinidad" name='' unit="ppm" value={salinidad} onChange={setSalinidad} />
        <InputRow header="Viscosidad del aceite" name='' unit="cp" value={viscosidadDelAceite} onChange={setViscosidadDelAceite} />
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
        <InputRowUnitless header="Tipo de gel lineal" name='' value={tipoDeGelLineal} onChange={setTipoDeGelLineal} />
        <InputRow header="Viscosidad del gel lineal" name='' unit="cp" value={viscosidadDelGelLineal} onChange={setViscosidadDelGelLineal} />
        <InputRow header="Tiempo de reticulación" name='' unit="min" value={tiempoDeReticulacion} onChange={setTiempoDeReticulacion} />
        <InputRow header="pH gel lineal" name='' unit="adim" value={pHGelLineal} onChange={setPHGelLineal} />
        <InputRow header="Tiempo de rompedor del gel" name='' unit="min" value={tiempoDeRompedorDelGel} onChange={setTiempoDeRompedorDelGel} />
      </div>
    )
  }


  makeApuntalanteForm() {
    let { setTamanoDelApuntalante, setGravedadEspecifica, setEsfericidad, setRedondeo, setTurbidez, setResistencia, setPruebaDeSolubilidadConAcida, formData } = this.props
    formData = formData.toJS()
    let { tamanoDelApuntalante, gravedadEspecifica, esfericidad, redondeo, turbidez, resistencia, pruebaDeSolubilidadConAcida } = formData

    return (
      <div className='grabado-nucleos-form' >
        <div className='header'>
          Prueba Para Apuntalante
        </div>
        <InputRow header="Tamaño del apuntalante" name='' unit="malla" value={tamanoDelApuntalante} onChange={setTamanoDelApuntalante} />
        <InputRow header="Gravedad específica" name='' unit="adim" value={gravedadEspecifica} onChange={setGravedadEspecifica} />
        <InputRow header="Esfericidad" name='' unit="adim" value={esfericidad} onChange={setEsfericidad} />
        <InputRow header="Redondeo" name='' unit="adim" value={redondeo} onChange={setRedondeo} />
        <InputRow header="Turbidez" name='' unit="FTU" value={turbidez} onChange={setTurbidez} />
        <InputRow header="Resistencia" name='' unit="psi" value={resistencia} onChange={setResistencia} />
        <InputRow header="Prueba de solubilidad con ácido" name='' unit="%" value={pruebaDeSolubilidadConAcida} onChange={setPruebaDeSolubilidadConAcida} />
      </div>
    )
  }


  render() {
    let { setObervacionesPruebasLabApuntalado, formData } = this.props
    formData = formData.toJS()
    let { obervacionesPruebasLabApuntalado } = formData

    return (
      <div className="form pruebas-de-laboratorio-apuntalado-extra">
          <div className='left'>
            { this.makeCaracterizacionForm() }
          </div>
          <div className='right'>
            { this.makeGelLinealForm() }
            { this.makeApuntalanteForm() }
            <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'}  value={obervacionesPruebasLabApuntalado} onChange={setObervacionesPruebasLabApuntalado} /> 
          </div>

          <div style={{color: 'red'}}>TODO: agregar opcion para subir evidencia de prueba de laboratorio. (add upload evidence of lab test)</div>

      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorioApuntalado'),
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
  setTipoDeGelLineal: val => dispatch(setTipoDeGelLineal(val)),
  setViscosidadDelGelLineal: val => dispatch(setViscosidadDelGelLineal(val)),
  setTiempoDeReticulacion: val => dispatch(setTiempoDeReticulacion(val)),
  setPHGelLineal: val => dispatch(setPHGelLineal(val)),
  setTiempoDeRompedorDelGel: val => dispatch(setTiempoDeRompedorDelGel(val)),
  setTamanoDelApuntalante: val => dispatch(setTamanoDelApuntalante(val)),
  setGravedadEspecifica: val => dispatch(setGravedadEspecifica(val)),
  setEsfericidad: val => dispatch(setEsfericidad(val)),
  setRedondeo: val => dispatch(setRedondeo(val)),
  setTurbidez: val => dispatch(setTurbidez(val)),
  setResistencia: val => dispatch(setResistencia(val)),
  setPruebaDeSolubilidadConAcida: val => dispatch(setPruebaDeSolubilidadConAcida(val)),
  setObervacionesPruebasLabApuntalado: val => dispatch(setObervacionesPruebasLabApuntalado(val)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PruebasDeLaboratorioApuntaladoExtra)

