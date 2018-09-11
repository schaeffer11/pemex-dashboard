import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setContenidoDeAceite, setContenidoDeAgua, setContenidoDeEmulsion, setContenidoDeSolidos, setTipoDeSolidos, setDensidadDelAceite, setDensidadDelAgua, setDensidadDeLaEmulsion, setContenidoDeAsfaltenos, setContenidoDeParafinas, setContenidoDeResinas, setIndiceDeEstabilidadDelColoidal, setIndiceDeEstabilidadDelAgua, setPH, setSalinidad, setViscosidadDelAceite, setSistemAcido, setPesoMuestraInicial, setPesoMuestraFinal, setSolubilidad, setSistemaAcidoGrabado, setNucleoDeFormacion, setGrabado, setTipoDeGelLineal, setViscosidadDelGelLineal, setTiempoDeReticulacion, setPHGelLineal, setTiempoDeRompedorDelGel, setObervacionesPruebasLabAcido } from '../../../../../redux/actions/intervencionesAcido'
import { setPruebasDeLaboratorioData } from '../../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'

@autobind class PruebasDeLaboratorioAcidoExtra extends Component {
  constructor(props) {
    super(props)

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    let pruebas = []

    pruebasDeLaboratorioData.map((prueba, i) => {
      if(!prueba.hasOwnProperty('edited')){
        pruebas.push({ ...prueba,
          edited: '',        
          contenidoDeAceite: '',
          contenidoDeAgua: '',
          contenidoDeEmulsion: '',
          contenidoDeSolidos: '',
          tipoDeSolidos: '',
          densidadDelAceite: '',
          densidadDelAgua: '',
          densidadDeLaEmulsion: '',
          contenidoDeAsfaltenos: '',
          contenidoDeParafinas: '',
          contenidoDeResinas: '',
          indiceDeEstabilidadDelColoidal: '',
          indiceDeEstabilidadDelAgua: '',
          pH: '',
          salinidad: '',
          viscosidadDelAceite: '',
          sistemAcido: '',
          pesoMuestraInicial: '',
          pesoMuestraFinal: '',
          solubilidad: '',
          sistemaAcidoGrabado: '',
          nucleoDeFormacion: '',
          grabado: '',
          tipoDeGelLineal: '',
          viscosidadDelGelLineal: '',
          tiempoDeReticulacion: '',
          pHGelLineal: '',
          tiempoDeRompedorDelGel: ''          
        })
      }else {
        pruebas.push(prueba)
      }
    })

    setPruebasDeLaboratorioData(pruebas)
  }

  componentDidMount() {
   console.log('here')
  }

  componentDidUpdate(prevProps) {
   console.log('here')
  }

  

  updateValue(value, event){
    if(event === undefined)
      return 

    let { setPruebasDeLaboratorioData, pruebasDeLaboratorio } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()

    let index = event.target.getAttribute('index')
    let pruebas = {...pruebasDeLaboratorio}
    pruebas.pruebasDeLaboratorioData[index][event.target.name] = event.target.value

    setPruebasDeLaboratorioData(pruebas.pruebasDeLaboratorioData)
  }

  makeCaracterizacionForm(index) {
    let { formData, pruebasDeLaboratorio } = this.props
    formData = formData.toJS()
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio
    let { contenidoDeAceite, contenidoDeAgua, contenidoDeEmulsion, contenidoDeSolidos, tipoDeSolidos, densidadDelAceite, densidadDelAgua, densidadDeLaEmulsion, contenidoDeAsfaltenos, contenidoDeParafinas, contenidoDeResinas, indiceDeEstabilidadDelColoidal, indiceDeEstabilidadDelAgua, pH, salinidad, viscosidadDelAceite } = formData

    return (
      <div className='caracterizacion-form' >
        <div className='header'>
          Caracterización de los Fluidos Producidos
        </div>
        <InputRow header="Contenido de aceite" name='contenidoDeAceite' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAceite} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de agua" name='contenidoDeAgua' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAgua} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de emulsión" name='contenidoDeEmulsion' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeEmulsion} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de sólidos" name='contenidoDeSolidos' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeSolidos} onChange={this.updateValue} index={index}/>
        <InputRow header="Tipo de sólidos" name='tipoDeSolidos' value={pruebasDeLaboratorioData[index].tipoDeSolidos} onChange={this.updateValue} index={index}/>
        <InputRow header="Densidad del aceite" name='densidadDelAceite' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDelAceite} onChange={this.updateValue} index={index}/>
        <InputRow header="Densidad del agua" name='densidadDelAgua' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDelAgua} onChange={this.updateValue} index={index}/>
        <InputRow header="Densidad de la emulsión" name='densidadDeLaEmulsion' unit="g/cm3" value={pruebasDeLaboratorioData[index].densidadDeLaEmulsion} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de asfaltenos" name='contenidoDeAsfaltenos' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeAsfaltenos} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de parafinas" name='contenidoDeParafinas' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeParafinas} onChange={this.updateValue} index={index}/>
        <InputRow header="Contenido de resinas" name='contenidoDeResinas' unit="%" value={pruebasDeLaboratorioData[index].contenidoDeResinas} onChange={this.updateValue} index={index}/>
        <InputRow header="Índice de estabilidad coloidal" name='indiceDeEstabilidadDelColoidal' unit="adim" value={pruebasDeLaboratorioData[index].indiceDeEstabilidadDelColoidal} onChange={this.updateValue} index={index}/>
        <InputRow header="Índice de estabilidad del agua" name='indiceDeEstabilidadDelAgua' unit="adim" value={pruebasDeLaboratorioData[index].indiceDeEstabilidadDelAgua} onChange={this.updateValue} index={index}/>
        <InputRow header="pH" name='pH' unit="adim" value={pruebasDeLaboratorioData[index].pH} onChange={this.updateValue} index={index}/>
        <InputRow header="Salinidad" name='salinidad' unit="ppm" value={pruebasDeLaboratorioData[index].salinidad} onChange={this.updateValue} index={index}/>
        <InputRow header="Viscosidad del aceite" name='viscosidadDelAceite' unit="cp" value={pruebasDeLaboratorioData[index].viscosidadDelAceite} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  makeSolubilidadForm(index) {
    let { pruebasDeLaboratorio, formData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio 
    
    return (
      <div className='solubilidad-form' >
        <div className='header'>
          Prueba de Solubilidad (Recorte de Canal o Nucleo)
        </div>
        <InputRowUnitless header="Sistema Ácido" name='sistemAcido' value={pruebasDeLaboratorioData[index].sistemAcido} onChange={this.updateValue} index={index}/>
        <InputRow header="Peso muestra inicial" name='pesoMuestraInicial' unit="gr" value={pruebasDeLaboratorioData[index].pesoMuestraInicial} onChange={this.updateValue} index={index}/>
        <InputRow header="Peso muestra final" name='pesoMuestraFinal' unit="gr" value={pruebasDeLaboratorioData[index].pesoMuestraFinal} onChange={this.updateValue} index={index}/>
        <InputRow header="Solubilidad" name='solubilidad' unit="%" value={pruebasDeLaboratorioData[index].solubilidad} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  makeGrabadoNucleosForm(index) {
    let { pruebasDeLaboratorio, formData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio
    
    return (
      <div className='grabado-nucleos-form' >
        <div className='header'>
          Prueba de Grabado de Nucleos
        </div>
        <InputRowUnitless header="Sistema ácido" name='sistemAcido' value={pruebasDeLaboratorioData[index].sistemAcido} onChange={this.updateValue} index={index}/>
        <InputRowUnitless header="Nucleo de formación" name='nucleoDeFormacion' value={pruebasDeLaboratorioData[index].nucleoDeFormacion} onChange={this.updateValue} index={index}/>
        <InputRow header="Grabado" name='grabado' unit="gr" value={pruebasDeLaboratorioData[index].grabado} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  makeGelLinealForm(index) {
    let { pruebasDeLaboratorio, formData } = this.props
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio
    
    return (
      <div className='gel-lineal-form' >
        <div className='header'>
          Prueba Para Gel Lineal
        </div>
        <InputRowUnitless header="Tipo de gel lineal" name='tipoDeGelLineal' value={pruebasDeLaboratorioData[index].tipoDeGelLineal} onChange={this.updateValue} index={index}/>
        <InputRow header="Viscosidad del gel lineal" name='viscosidadDelGelLineal' unit="cp" value={pruebasDeLaboratorioData[index].viscosidadDelGelLineal} onChange={this.updateValue} index={index}/>
        <InputRow header="Tiempo de reticulación" name='tiempoDeReticulacion' unit="min" value={pruebasDeLaboratorioData[index].tiempoDeReticulacion} onChange={this.updateValue} index={index}/>
        <InputRow header="pH gel lineal" name='pHGelLineal' unit="adim" value={pruebasDeLaboratorioData[index].pHGelLineal} onChange={this.updateValue} index={index}/>
        <InputRow header="Tiempo de rompedor del gel" name='tiempoDeRompedorDelGel' unit="min" value={pruebasDeLaboratorioData[index].tiempoDeRompedorDelGel} onChange={this.updateValue} index={index}/>
      </div>
    )
  }

  render() {
    let { setObervacionesPruebasLabAcido, formData, pruebasDeLaboratorio } = this.props
    formData = formData.toJS()
    pruebasDeLaboratorio = pruebasDeLaboratorio.toJS()

    let { obervacionesPruebasLabAcido} = formData
    let { pruebasDeLaboratorioData } = pruebasDeLaboratorio

    return pruebasDeLaboratorioData.map((form, i) =>      
      <div className="form pruebas-de-laboratorio-acido-extra">
          <div className='left'>
          { this.makeCaracterizacionForm(i) }
          </div>
          <div className='right'>
          { this.makeSolubilidadForm(i) }
          { this.makeGrabadoNucleosForm(i) }
          { this.makeGelLinealForm(i) }
            <TextAreaUnitless header="Observaciones" name='' className={'obervaciones'} value={obervacionesPruebasLabAcido} onChange={setObervacionesPruebasLabAcido}/> 
          </div>

          <div style={{color: 'red'}}>TODO: agregar opcion para subir evidencia de la prueba de laboratorio (add upload evidence of lab test)</div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('pruebasDeLaboratorioAcido'),
  pruebasDeLaboratorio: state.get('pruebasDeLaboratorio'),
})

const mapDispatchToProps = dispatch => ({
  setPruebasDeLaboratorioData: val => dispatch(setPruebasDeLaboratorioData(val)),
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

