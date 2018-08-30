import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { InputRow, InputRowUnitless, InputRowSelectUnitless, TextAreaUnitless } from '../../../Common/InputRow'
import { setVolumenDelSistemaAcidoLimpieza, setVolumenDelSistemaNoAcidoLimpieza, setTipoDeColocacion, setTiempoDeContacto, setNumeroDeEtapas, setVolumenDelSistemAcido, setVolumenDelSistemNoAcido, setVolumenDeDivergente, setVolumenDeN2, setCalidadDeEspuma, setVolumenDePrecolchonN2, setVolumenDeDesplazamiento, setPenetracionRadial, setLongitudDeAgujeroDeGusano } from '../../../../../redux/actions/intervencionesEstimulacion'
import { connect } from 'react-redux'

@autobind class ResultadosDeLaSimulacionEstimulacion extends Component {
  constructor(props) {
    super(props)
    this.state = { 
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {

  }

  makeLimpiezaForm() {
    let { setVolumenDelSistemaAcidoLimpieza, setVolumenDelSistemaNoAcidoLimpieza, setTipoDeColocacion, setTiempoDeContacto, formData } = this.props
    formData = formData.toJS()
    let { volumenDelSistemaAcidoLimpieza, volumenDelSistemaNoAcidoLimpieza, tipoDeColocacion, tiempoDeContacto } = formData
    return (
      <div className='limpieza-form' >
        <div className='header'>
          Limpieza
        </div>
        <InputRow header="Volumen del sistema acido" name='' unit="m3" value={volumenDelSistemaAcidoLimpieza} onChange={setVolumenDelSistemaAcidoLimpieza}/>
        <InputRow header="Volumen del sistema no acido" name='' unit="m3" value={volumenDelSistemaNoAcidoLimpieza} onChange={setVolumenDelSistemaNoAcidoLimpieza}/>
        <InputRowUnitless header="Tipo de colocacion" name='' value={tipoDeColocacion} onChange={setTipoDeColocacion}/>
        <InputRow header="Tiempo de contacto" name='' unit="min" value={tiempoDeContacto} onChange={setTiempoDeContacto}/>
      </div>
    )
  }

  makeMatricialForm() {
    let { setNumeroDeEtapas, setVolumenDelSistemAcido, setVolumenDelSistemNoAcido, setVolumenDeDivergente, setVolumenDeN2, setCalidadDeEspuma, setVolumenDePrecolchonN2, setVolumenDeDesplazamiento, setPenetracionRadial, setLongitudDeAgujeroDeGusano, formData } = this.props
    formData = formData.toJS()
    let { numeroDeEtapas, volumenDelSistemAcido, volumenDelSistemNoAcido, volumenDeDivergente, volumenDeN2, calidadDeEspuma, volumenDePrecolchonN2, volumenDeDesplazamiento, penetracionRadial, longitudDeAgujeroDeGusano } = formData
    return (
      <div className='matricail-form' >
        <div className='header'>
          Matricial
        </div>
        <InputRow header="Numero de etapas" name='' unit="Numero" value={numeroDeEtapas} onChange={setNumeroDeEtapas}/>
        <InputRow header="Volumen del sistema acido" name='' unit="m3" value={volumenDelSistemAcido} onChange={setVolumenDelSistemAcido}/>
        <InputRow header="Volumen del sistema no acido" name='' unit="m3" value={volumenDelSistemNoAcido} onChange={setVolumenDelSistemNoAcido}/>
        <InputRow header="Volumen de divergente" name='' unit="m3" value={volumenDeDivergente} onChange={setVolumenDeDivergente}/>
        <InputRow header="Volumen de N2" name='' unit="m3" value={volumenDeN2} onChange={setVolumenDeN2}/>
        <InputRow header="Calidad de Espuma" name='' unit="%" value={calidadDeEspuma} onChange={setCalidadDeEspuma}/>
        <InputRow header="Volumen de precolchon N2" name='' unit="m3" value={volumenDePrecolchonN2} onChange={setVolumenDePrecolchonN2}/>
        <InputRow header="Volumen de desplazamiento (N2 o liquido)" name='' unit="m3" value={volumenDeDesplazamiento} onChange={setVolumenDeDesplazamiento}/>
        <InputRow header="Penetracion radial" name='' unit="pg" value={penetracionRadial} onChange={setPenetracionRadial}/>
        <InputRow header="Longitud de agujero de gusano" name='' unit="pg" value={longitudDeAgujeroDeGusano} onChange={setLongitudDeAgujeroDeGusano}/>
      </div>
    )
  }


  render() {

    return (
      <div className="form resultados-de-simulacion">
          { this.makeLimpiezaForm() }
          { this.makeMatricialForm() }
          <div style={{color: 'red'}}>TODO add uevidence of simulation</div>

      </div>
    )
  }
}


const mapStateToProps = state => ({
  formData: state.get('resultadosSimulacionEstimulacion'),
})

const mapDispatchToProps = dispatch => ({
  setVolumenDelSistemaAcidoLimpieza: val => dispatch(setVolumenDelSistemaAcidoLimpieza(val)),
  setVolumenDelSistemaNoAcidoLimpieza: val => dispatch(setVolumenDelSistemaNoAcidoLimpieza(val)),
  setTipoDeColocacion: val => dispatch(setTipoDeColocacion(val)),
  setTiempoDeContacto: val => dispatch(setTiempoDeContacto(val)),
  setNumeroDeEtapas: val => dispatch(setNumeroDeEtapas(val)),
  setVolumenDelSistemAcido: val => dispatch(setVolumenDelSistemAcido(val)),
  setVolumenDelSistemNoAcido: val => dispatch(setVolumenDelSistemNoAcido(val)),
  setVolumenDeDivergente: val => dispatch(setVolumenDeDivergente(val)),
  setVolumenDeN2: val => dispatch(setVolumenDeN2(val)),
  setCalidadDeEspuma: val => dispatch(setCalidadDeEspuma(val)),
  setVolumenDePrecolchonN2: val => dispatch(setVolumenDePrecolchonN2(val)),
  setVolumenDeDesplazamiento: val => dispatch(setVolumenDeDesplazamiento(val)),
  setPenetracionRadial: val => dispatch(setPenetracionRadial(val)),
  setLongitudDeAgujeroDeGusano: val => dispatch(setLongitudDeAgujeroDeGusano(val)),

})

export default connect(mapStateToProps, mapDispatchToProps)(ResultadosDeLaSimulacionEstimulacion)