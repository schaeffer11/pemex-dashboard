import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask";
import moment from 'moment'
import { connect } from 'react-redux'
import Notification from '../Common/Notification'
import Loading from '../Common/Loading'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { setIsLoading, setShowForms } from '../../../redux/actions/global'


@autobind class MapeoForm extends Component {
  constructor(props) {
    super(props)
    this.initialValues = {
      activo: null,
      asignacion: null,
      fechaRevision: null,
      cuentanProcesos: null,
      cuentanProcesosObs: "",
      cuantosProcesosObs: "",
      procesoPatentado: null,
      procesoPatentadoObs: "",
      anioDesarrolloObs: "",
      equipoTrabajo: null,
      equipoTrabajoObs: "",
      cuantosEspecialistasObs: "",
      liderGrupoObs: "",
      profesionTieneObs: "",
      experienciaFracsObs: "",
      nombreEspecialistaObs: "",
      experticeEspecialistaObs: "",
      informacionAnalisisPozoObs: "",
      areasInfoObs: "",
      analizaInfObs: "",
      criteriosPozoFracObs: "",
      comoPozoReqFracObs: "",
      estimanDanioObs: "",
      identificanDanioObs: "",
      quienMuestrasPozoObs: "",
      laboratorioPemexObs: "",
      quienProgrLabObs: "",
      quienSuprvLabObs: "",
      informeResPemex: null,
      informeResPemexObs: "",
      seleccionCIAObs: "",
      pruebasQuimicosObs: "",
      pruebasSolubilidad: null,
      pruebasSolubilidadObs: "",
      compatibilidadEmulsion: null,
      compatibilidadEmulsionObs: "",
      caractFisicoQuimicas: null,
      caractFisicoQuimicasObs: "",
      porcentajeAceite: null,
      porcentajeAceiteObs: "",
      porcentajeAgua: null,
      porcentajeAguaObs: "",
      porcentajeEmulsion: null,
      porcentajeEmulsionObs: "",
      porcentajeSolidos: null,
      porcentajeSolidosObs: "",
      porcentajeAsfaltenos: null,
      porcentajeAsfaltenosObs: "",
      porcentajeParafinas: null,
      porcentajeParafinasObs: "",
      porcentajeResinas: null,
      porcentajeResinasObs: "",
      porcentajeContSolidos: null,
      porcentajeContSolidosObs: "",
      densidadAceite: null,
      densidadAceiteObs: "",
      densidadAgua: null,
      densidadAguaObs: "",
      densidadEmulsion: null,
      densidadEmulsionObs: "",
      viscosidadAceite: null,
      viscosidadAceiteObs: "",
      viscosidadEmulsion: null,
      viscosidadEmulsionObs: "",
      phAgua: null,
      phAguaObs: "",
      salinidadAgua: null,
      salinidadAguaObs: "",
      salinidadAceite: null,
      salinidadAceiteObs: "",
      stiffDavis: null,
      stiffDavisObs: "",
      estabilidadAgua: null,
      estabilidadAguaObs: "",
      sara: null,
      saraObs: "",
      estabilidadColoidal: null,
      estabilidadColoidalObs: "",
      gravadoRoca: null,
      gravadoRocaObs: "",
      esfericidad: null,
      esfericidadObs: "",
      redondez: null,
      redondezObs: "",
      resistenciaEsfuerzo: null,
      resistenciaEsfuerzoObs: "",
      tamiz: null,
      tamizObs: "",
      aglutinamiento: null,
      aglutinamientoObs: "",
      turbidez: null,
      turbidezObs: "",
      solubilidadApunt: 0,
      solubilidadApuntObs: "",
      viscosidad: null,
      viscosidadObs: "",
      hidratacionFluido: null,
      hidratacionFluidoObs: "",
      activacionGel: null,
      activacionGelObs: "",
      determinacionPhGel: null,
      determinacionPhGelObs: "",
      rompimientoGel: null,
      rompimientoGelObs: "",
      quebradores: null,
      quebradoresObs: "",
      criteriosSeleccQuimicosObs: "",
      criteriosSeleccGelObs: "",
      criteriosSeleccAcidoObs: "",
      labCertificacion: null,
      labCertificacionObs: "",
      dbLabs: null,
      dbLabsObs: "",
      disenioFracturasObs: "",
      cuentaSoftware: null,
      cuentaSoftwareObs: "",
      determinacionVolumenObs: "",
      yacimientoDepresionados: null,
      yacimientoDepresionadosObs: "",
      rangoTempObs: "",
      carbonatosArenasObs: "",
      beneficioFracObs: "",
      analisisEconomico: null,
      analisisEconomicoObs: "",
      diferentesEscenarios: null,
      diferentesEscenariosObs: "",
      baseUsuarioObs: "",
      quienProgFracObs: "",
      entregaBaseObs: "",
      supervisaEjecObs: "",
      controlCalidad: null,
      controlCalidadObs: "",
      monitoreoEjecucion: null,
      monitoreoEjecucionObs: "",
      ajustesDisenio: null,
      ajustesDisenioObs: "",
      reportePost: null,
      reportePostObs: "",
      abreProdObs: "",
      medicionPozoPost: null,
      medicionPozoPostObs: "",
      programaTomaMuestras: null,
      programaTomaMuestrasObs: "",
      evaluacionPostfrac: null,
      evaluacionPostfracObs: "",
      comoEvalTecnicaObs: "",
      variablesEcoPostObs: "",
      progAccionesMejopra: null,
      progAccionesMejopraObs: ""
    }

    this.state = {
      id: 0,
      activos: [{}],
      update: false
    }
  }

  componentDidMount() {
    const { token } = this.props
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'application/json',
    }

    fetch('/api/activo', { headers })
      .then(r => r.json())
      .then((res) => {
        this.setState({
          activos: res
        })
      })

  }

  componentDidUpdate() {
    if (this.props.id != this.state.id) {
      this.setState({
        id: this.props.id,
        update: true
      })
    }
  }


  isEmpty(val) {
    return val === undefined || val === null || val === ""
  }

  validate(values) {
    let errors = {};


    return errors;
  }

  onSubmit(values, actions) {
    let { setLoading } = this.props
    setTimeout(() => {
      const { token, user } = this.props

      const headers = {
        'Authorization': `Bearer ${token}`,
      }

      const formData = new FormData()

      Object.entries(values).forEach(([key, value]) => {
        // Handle untouched date values loaded from the database
        if (value && key == 'fechaRevision') {
          value = moment(value).format('YYYY-MM-DD');
        }

        formData.append(key, value);
      })

      fetch('/api/mapeo', {
        headers: headers,
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then((res) => {
          if (res.success) {
            this.setState({ update: true }, () => {
              setLoading({
                isLoading: false,
                showNotification: true,
                notificationType: 'success',
                notificationText: `Su información se ha guardado exitosamente`
              })
            })
          } else {
            setLoading({
              isLoading: false,
              showNotification: true,
              notificationType: 'error',
              notificationText: `Su información no se ha podido guardar`
            })
          }
        })

      actions.setSubmitting(false);
    }, 400);
  }

  confirmEdit(e) {
    this.setState({
      update: false
    })

    e.preventDefault()
    return false;
  }

  confirmSubmit() {
    console.log('confirming submit')
    this.setState({ update: true })
    e.preventDefault()
    return false;
  }

  render() {
    return (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={this.props.values ? this.props.values : this.initialValues}
          validate={this.validate}
          onSubmit={this.onSubmit}
        >
          {({ touched, isSubmitting, errors }) => (
            <Form className={this.state.update ? 'disable' : ''}>
              <button type="button" className="import submit" onClick={this.props.openImportModal}>Importar</button>
              <div className="title">Mapeo de Procesos de Fracturamientos Ácidos</div>

              <div className="heading">
                <div className="name">
                  <label>Nombre de la Asignación</label>
                  <Field type="text" name="asignacion" />
                  {errors.asignacion && touched.asignacion && <div class="error">{errors.asignacion}</div>}
                </div>
              </div>

              <div className="activo">
                <label>Activo</label>
                <Dropdown
                  name="activo"
                  options={this.state.activos.map(a => { return { value: a.ACTIVO_ID, label: a.ACTIVO_NAME } })}
                />
                {errors.activo && touched.activo && <div class="error">{errors.activo}</div>}
              </div>

              <div className="table">
                <div className="header">
                  <div className="description">Descripción</div>
                  <div className="bool">Si/No</div>
                  <div className="observations">Observaciones</div>
                </div>
                <div className="row-title">Proceso de Estimulaciones/ Fracturamientos</div>
                <div className="body">
                  <div className="trow">
                    <div className="description">¿Cuentan con un proceso para Fracturamiento?</div>
                    <div className="bool"><BoolInput name="cuentanProcesos" /></div>
                    <div className="observations"><Field component="textarea" name="cuentanProcesosObs" /></div>
                    {errors.cuentanProcesos && touched.cuentanProcesos && <div class="error">{errors.cuentanProcesos}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cuántos subprocesos lo conforman?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="cuantosProcesosObs" /></div>
                    {errors.cuantosProcesosObs && touched.cuantosProcesosObs && <div class="error">{errors.cuantosProcesosObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿El proceso está patentado?</div>
                    <div className="bool"><BoolInput name="procesoPatentado" /></div>
                    <div className="observations"><Field component="textarea" name="procesoPatentadoObs" /></div>
                    {errors.procesoPatentado && touched.procesoPatentado && <div class="error">{errors.procesoPatentado}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Desde que año fue desarrollado?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="anioDesarrolloObs" /></div>
                    {errors.anioDesarrolloObs && touched.anioDesarrolloObs && <div class="error">{errors.anioDesarrolloObs}</div>}
                  </div>
                </div>
              </div>

              <div className="table">
                <div className="header">
                  <div className="description">Descripción</div>
                  <div className="bool">Si/No</div>
                  <div className="observations">Observaciones</div>
                </div>
                <div className="row-title">Equipo de  Fracturamientos</div>
                <div className="body">
                  <div className="trow">
                    <div className="description">¿Cuenta con un equipo de trabajo encargado para estas operaciones?</div>
                    <div className="bool"><BoolInput name="equipoTrabajo" /></div>
                    <div className="observations"><Field component="textarea" name="equipoTrabajoObs" /></div>
                    {errors.equipoTrabajo && touched.equipoTrabajo && <div class="error">{errors.equipoTrabajo}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cuántos especialistas lo conforman?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="cuantosEspecialistasObs" /></div>
                    {errors.cuantosEspecialistasObs && touched.cuantosEspecialistasObs && <div class="error">{errors.cuantosEspecialistasObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Quién es el Líder del Grupo?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="liderGrupoObs" /></div>
                    {errors.liderGrupoObs && touched.liderGrupoObs && <div class="error">{errors.liderGrupoObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Qué profesión tiene?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="profesionTieneObs" /></div>
                    {errors.profesionTieneObs && touched.profesionTieneObs && <div class="error">{errors.profesionTieneObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Experiencia en Fracturamientos (Asistente/Técnico/Especialista/Experto)</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="experienciaFracsObs" /></div>
                    {errors.experienciaFracsObs && touched.experienciaFracsObs && <div class="error">{errors.experienciaFracsObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Nombres de los Especialistas que integran al Equipo y Nivel de Conocimientos</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="nombreEspecialistaObs" /></div>
                    {errors.nombreEspecialistaObs && touched.nombreEspecialistaObs && <div class="error">{errors.nombreEspecialistaObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Expertise de los Especialistas que integran al Equipo (Asistente/Técnico/Especialista/Experto)</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="experticeEspecialistaObs" /></div>
                    {errors.experticeEspecialistaObs && touched.experticeEspecialistaObs && <div class="error">{errors.experticeEspecialistaObs}</div>}
                  </div>
                </div>
              </div>

              <div className="table">
                <div className="header">
                  <div className="description">Descripción</div>
                  <div className="bool">Si/No</div>
                  <div className="observations">Observaciones</div>
                </div>
                <div className="row-title">Recopilación y análisis de la información</div>
                <div className="body">
                  <div className="trow">
                    <div className="description">¿Qué información utiliza para el análisis del pozo?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="informacionAnalisisPozoObs" /></div>
                    {errors.informacionAnalisisPozoObs && touched.informacionAnalisisPozoObs && <div class="error">{errors.informacionAnalisisPozoObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Qué áreas le proporcionan la información?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="areasInfoObs" /></div>
                    {errors.areasInfoObs && touched.areasInfoObs && <div class="error">{errors.areasInfoObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Quién analiza la información?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="analizaInfObs" /></div>
                    {errors.analizaInfObs && touched.analizaInfObs && <div class="error">{errors.analizaInfObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Qué criterios utilizan para seleccionar el pozo candidato a Fracturar?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="criteriosPozoFracObs" /></div>
                    {errors.criteriosPozoFracObs && touched.criteriosPozoFracObs && <div class="error">{errors.criteriosPozoFracObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cómo determinan si el pozo requiere fractura?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="comoPozoReqFracObs" /></div>
                    {errors.comoPozoReqFracObs && touched.comoPozoReqFracObs && <div class="error">{errors.comoPozoReqFracObs}</div>}
                  </div>
                  <div className="trow row-title">
                    <div className="description">¿Cómo estiman el daño?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="estimanDanioObs" /></div>
                    {errors.estimanDanioObs && touched.estimanDanioObs && <div class="error">{errors.estimanDanioObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="indented description">¿Cómo identifican el tipo de daño presente?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="identificanDanioObs" /></div>
                    {errors.identificanDanioObs && touched.identificanDanioObs && <div class="error">{errors.identificanDanioObs}</div>}
                  </div>
                </div>
              </div>

              <div className="table">
                <div className="header">
                  <div className="description">Descripción</div>
                  <div className="bool">Si/No</div>
                  <div className="observations">Observaciones</div>
                </div>
                <div className="row-title">Pruebas de Laboratorio</div>
                <div className="body">
                  <div className="trow">
                    <div className="description">¿Quién es el responsable de la recuperación de las muestras (fluidos, sólidos, etc.)?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="quienMuestrasPozoObs" /></div>
                    {errors.quienMuestrasPozoObs && touched.quienMuestrasPozoObs && <div class="error">{errors.quienMuestrasPozoObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Se cuenta con un laboratorio de PEMEX para las pruebas de laboratorio o quién las hace?</div>
                    <div className="bool"><BoolInput name="laboratorioPemex" /></div>
                    <div className="observations"><Field component="textarea" name="laboratorioPemexObs" /></div>
                    {errors.laboratorioPemex && touched.laboratorioPemex && <div class="error">{errors.laboratorioPemex}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Quién programa las pruebas de laboratorio?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="quienProgrLabObs" /></div>
                    {errors.quienProgrLabObs && touched.quienProgrLabObs && <div class="error">{errors.quienProgrLabObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Quién supervisa las pruebas de laboratorio?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="quienSuprvLabObs" /></div>
                    {errors.quienSuprvLabObs && touched.quienSuprvLabObs && <div class="error">{errors.quienSuprvLabObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Se realiza un informe de los resultados de las pruebas de laboratorio por parte de PEMEX?</div>
                    <div className="bool"><BoolInput name="informeResPemex" /></div>
                    <div className="observations"><Field component="textarea" name="informeResPemexObs" /></div>
                    {errors.informeResPemex && touched.informeResPemex && <div class="error">{errors.informeResPemex}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cómo se selecciona a la compañía?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="seleccionCIAObs" /></div>
                    {errors.seleccionCIAObs && touched.seleccionCIAObs && <div class="error">{errors.seleccionCIAObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Qué tipo de Pruebas realiza para seleccionar los sistemas químicos a emplear?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="pruebasQuimicosObs" /></div>
                    {errors.pruebasQuimicosObs && touched.pruebasQuimicosObs && <div class="error">{errors.pruebasQuimicosObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Pruebas de Solubilidad a recortes y/o núcleos</div>
                    <div className="bool"><BoolInput name="pruebasSolubilidad" /></div>
                    <div className="observations"><Field component="textarea" name="pruebasSolubilidadObs" /></div>
                    {errors.pruebasSolubilidad && touched.pruebasSolubilidad && <div class="error">{errors.pruebasSolubilidad}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Pruebas de Compatibilidad por Emulsión</div>
                    <div className="bool"><BoolInput name="compatibilidadEmulsion" /></div>
                    <div className="observations"><Field component="textarea" name="compatibilidadEmulsionObs" /></div>
                    {errors.compatibilidadEmulsionObs && touched.compatibilidadEmulsionObs && <div class="error">{errors.compatibilidadEmulsionObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Caracterización Físico-química de fluidos</div>
                    <div className="bool"><BoolInput name="caractFisicoQuimicas" /></div>
                    <div className="observations"><Field component="textarea" name="caractFisicoQuimicasObs" /></div>
                    {errors.caractFisicoQuimicas && touched.caractFisicoQuimicas && <div class="error">{errors.caractFisicoQuimicas}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de aceite</div>
                    <div className="bool"><BoolInput name="porcentajeAceite" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeAceiteObs" /></div>
                    {errors.porcentajeAceite && touched.porcentajeAceite && <div class="error">{errors.porcentajeAceite}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de agua</div>
                    <div className="bool"><BoolInput name="porcentajeAgua" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeAguaObs" /></div>
                    {errors.porcentajeAgua && touched.porcentajeAgua && <div class="error">{errors.porcentajeAgua}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de emulsión</div>
                    <div className="bool"><BoolInput name="porcentajeEmulsion" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeEmulsionObs" /></div>
                    {errors.porcentajeEmulsion && touched.porcentajeEmulsion && <div class="error">{errors.porcentajeEmulsion}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de sólidos</div>
                    <div className="bool"><BoolInput name="porcentajeSolidos" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeSolidosObs" /></div>
                    {errors.porcentajeSolidos && touched.porcentajeSolidos && <div class="error">{errors.porcentajeSolidos}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de asfaltenos</div>
                    <div className="bool"><BoolInput name="porcentajeAsfaltenos" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeAsfaltenosObs" /></div>
                    {errors.porcentajeAsfaltenos && touched.porcentajeAsfaltenos && <div class="error">{errors.porcentajeAsfaltenos}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de parafinas</div>
                    <div className="bool"><BoolInput name="porcentajeParafinas" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeParafinasObs" /></div>
                    {errors.porcentajeParafinas && touched.porcentajeParafinas && <div class="error">{errors.porcentajeParafinas}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de resinas asfálticas</div>
                    <div className="bool"><BoolInput name="porcentajeResinas" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeResinasObs" /></div>
                    {errors.porcentajeResinas && touched.porcentajeResinas && <div class="error">{errors.porcentajeResinas}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación del porcentaje de contenido de sólidos</div>
                    <div className="bool"><BoolInput name="porcentajeContSolidos" /></div>
                    <div className="observations"><Field component="textarea" name="porcentajeContSolidosObs" /></div>
                    {errors.porcentajeContSolidos && touched.porcentajeContSolidos && <div class="error">{errors.porcentajeContSolidos}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Densidad del aceite</div>
                    <div className="bool"><BoolInput name="densidadAceite" /></div>
                    <div className="observations"><Field component="textarea" name="densidadAceiteObs" /></div>
                    {errors.densidadAceite && touched.densidadAceite && <div class="error">{errors.densidadAceite}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Densidad del agua</div>
                    <div className="bool"><BoolInput name="densidadAgua" /></div>
                    <div className="observations"><Field component="textarea" name="densidadAguaObs" /></div>
                    {errors.densidadAgua && touched.densidadAgua && <div class="error">{errors.densidadAgua}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Densidad de la emulsión</div>
                    <div className="bool"><BoolInput name="densidadEmulsion" /></div>
                    <div className="observations"><Field component="textarea" name="densidadEmulsionObs" /></div>
                    {errors.densidadEmulsion && touched.densidadEmulsion && <div class="error">{errors.densidadEmulsion}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Viscosidad del aceite</div>
                    <div className="bool"><BoolInput name="viscosidadAceite" /></div>
                    <div className="observations"><Field component="textarea" name="viscosidadAceiteObs" /></div>
                    {errors.viscosidadAceite && touched.viscosidadAceite && <div class="error">{errors.viscosidadAceite}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Viscosidad de la emulsión</div>
                    <div className="bool"><BoolInput name="viscosidadEmulsion" /></div>
                    <div className="observations"><Field component="textarea" name="viscosidadEmulsionObs" /></div>
                    {errors.viscosidadEmulsion && touched.viscosidadEmulsion && <div class="error">{errors.viscosidadEmulsion}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">pH del agua</div>
                    <div className="bool"><BoolInput name="phAgua" /></div>
                    <div className="observations"><Field component="textarea" name="phAguaObs" /></div>
                    {errors.phAgua && touched.phAgua && <div class="error">{errors.phAgua}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Salinidad del agua</div>
                    <div className="bool"><BoolInput name="salinidadAgua" /></div>
                    <div className="observations"><Field component="textarea" name="salinidadAguaObs" /></div>
                    {errors.salinidadAgua && touched.salinidadAgua && <div class="error">{errors.salinidadAgua}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Salinidad del aceite</div>
                    <div className="bool"><BoolInput name="salinidadAceite" /></div>
                    <div className="observations"><Field component="textarea" name="salinidadAceiteObs" /></div>
                    {errors.salinidadAceite && touched.salinidadAceite && <div class="error">{errors.salinidadAceite}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Realiza prueba de Stiff & Davis</div>
                    <div className="bool"><BoolInput name="stiffDavis" /></div>
                    <div className="observations"><Field component="textarea" name="stiffDavisObs" /></div>
                    {errors.stiffDavis && touched.stiffDavis && <div class="error">{errors.stiffDavis}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Índice de Estabilidad del Agua</div>
                    <div className="bool"><BoolInput name="estabilidadAgua" /></div>
                    <div className="observations"><Field component="textarea" name="estabilidadAguaObs" /></div>
                    {errors.estabilidadAgua && touched.estabilidadAgua && <div class="error">{errors.estabilidadAgua}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Realiza análisis SARA</div>
                    <div className="bool"><BoolInput name="sara" /></div>
                    <div className="observations"><Field component="textarea" name="saraObs" /></div>
                    {errors.sara && touched.sara && <div class="error">{errors.sara}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Índice de Estabilidad Coloidal</div>
                    <div className="bool"><BoolInput name="estabilidadColoidal" /></div>
                    <div className="observations"><Field component="textarea" name="estabilidadColoidalObs" /></div>
                    {errors.estabilidadColoidal && touched.estabilidadColoidal && <div class="error">{errors.estabilidadColoidal}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Pruebas para apuntalante</div>
                    <div className="bool"></div>
                    <div className="observations"></div>
                  </div>
                  <div className="trow">
                    <div className="description">Esfericidad</div>
                    <div className="bool"><BoolInput name="esfericidad" /></div>
                    <div className="observations"><Field component="textarea" name="esfericidadObs" /></div>
                    {errors.esfericidad && touched.esfericidad && <div class="error">{errors.esfericidad}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Redondez</div>
                    <div className="bool"><BoolInput name="redondez" /></div>
                    <div className="observations"><Field component="textarea" name="redondezObs" /></div>
                    {errors.redondez && touched.redondez && <div class="error">{errors.redondez}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Resistencia al esfuerzo</div>
                    <div className="bool"><BoolInput name="resistenciaEsfuerzo" /></div>
                    <div className="observations"><Field component="textarea" name="resistenciaEsfuerzoObs" /></div>
                    {errors.resistenciaEsfuerzo && touched.resistenciaEsfuerzo && <div class="error">{errors.resistenciaEsfuerzo}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Tamiz</div>
                    <div className="bool"><BoolInput name="tamiz" /></div>
                    <div className="observations"><Field component="textarea" name="tamizObs" /></div>
                    {errors.tamiz && touched.tamiz && <div class="error">{errors.tamiz}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Aglutinamiento</div>
                    <div className="bool"><BoolInput name="aglutinamiento" /></div>
                    <div className="observations"><Field component="textarea" name="aglutinamientoObs" /></div>
                    {errors.aglutinamiento && touched.aglutinamiento && <div class="error">{errors.aglutinamiento}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Turbidez</div>
                    <div className="bool"><BoolInput name="turbidez" /></div>
                    <div className="observations"><Field component="textarea" name="turbidezObs" /></div>
                    {errors.turbidez && touched.turbidez && <div class="error">{errors.turbidez}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Prueba de gravado</div>
                    <div className="bool"></div>
                    <div className="observations"></div>
                  </div>
                  <div className="trow">
                    <div className="description">Gravado de la roca con diferentes sistemas ácidos</div>
                    <div className="bool"><BoolInput name="gravadoRoca" /></div>
                    <div className="observations"><Field component="textarea" name="gravadoRocaObs" /></div>
                    {errors.gravadoRoca && touched.gravadoRoca && <div class="error">{errors.gravadoRoca}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Gel de Fractura</div>
                    <div className="bool"></div>
                    <div className="observations"></div>
                  </div>
                  <div className="trow">
                    <div className="description">Viscosidad</div>
                    <div className="bool"><BoolInput name="viscosidad" /></div>
                    <div className="observations"><Field component="textarea" name="viscosidadObs" /></div>
                    {errors.viscosidad && touched.viscosidad && <div class="error">{errors.viscosidad}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Hidratación del fluido</div>
                    <div className="bool"><BoolInput name="hidratacionFluido" /></div>
                    <div className="observations"><Field component="textarea" name="hidratacionFluidoObs" /></div>
                    {errors.hidratacionFluidoObs && touched.hidratacionFluidoObs && <div class="error">{errors.hidratacionFluidoObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Tiempo de activación del gel</div>
                    <div className="bool"><BoolInput name="activacionGel" /></div>
                    <div className="observations"><Field component="textarea" name="activacionGelObs" /></div>
                    {errors.activacionGel && touched.activacionGel && <div class="error">{errors.activacionGel}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Determinación de pH</div>
                    <div className="bool"><BoolInput name="determinacionPhGel" /></div>
                    <div className="observations"><Field component="textarea" name="determinacionPhGelObs" /></div>
                    {errors.determinacionPhGel && touched.determinacionPhGel && <div class="error">{errors.determinacionPhGel}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Tiempo de rompimiento</div>
                    <div className="bool"><BoolInput name="rompimientoGel" /></div>
                    <div className="observations"><Field component="textarea" name="rompimientoGelObs" /></div>
                    {errors.rompimientoGel && touched.rompimientoGel && <div class="error">{errors.rompimientoGel}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">Dosificación de quebradores</div>
                    <div className="bool"><BoolInput name="quebradores" /></div>
                    <div className="observations"><Field component="textarea" name="quebradoresObs" /></div>
                    {errors.quebradores && touched.quebradores && <div class="error">{errors.quebradores}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Qué criterios emplea para la selección quimicos?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="criteriosSeleccQuimicosObs" /></div>
                    {errors.criteriosSeleccQuimicosObs && touched.criteriosSeleccQuimicosObs && <div class="error">{errors.criteriosSeleccQuimicosObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Qué criterios emplea para la selección del gel de fractura?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="criteriosSeleccGelObs" /></div>
                    {errors.criteriosSeleccGelObs && touched.criteriosSeleccGelObs && <div class="error">{errors.criteriosSeleccGelObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Qué criterios emplea para la selección del sistema ácido?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="criteriosSeleccAcidoObs" /></div>
                    {errors.criteriosSeleccAcidoObs && touched.criteriosSeleccAcidoObs && <div class="error">{errors.criteriosSeleccAcidoObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿El laboratorio cuenta con certificación?</div>
                    <div className="bool"><BoolInput name="labCertificacion" /></div>
                    <div className="observations"><Field component="textarea" name="labCertificacionObs" /></div>
                    {errors.labCertificacion && touched.labCertificacion && <div class="error">{errors.labCertificacion}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cuenta con una base de datos de pruebas de laboratorio?</div>
                    <div className="bool"><BoolInput name="dbLabs" /></div>
                    <div className="observations"><Field component="textarea" name="dbLabsObs" /></div>
                    {errors.dbLabs && touched.dbLabs && <div class="error">{errors.dbLabs}</div>}
                  </div>
                </div>
              </div>
              <div className="table">
                <div className="header">
                  <div className="description">Descripción</div>
                  <div className="bool">Si/No</div>
                  <div className="observations">Observaciones</div>
                </div>
                <div className="row-title">Diseño</div>
                <div className="body">
                  <div className="trow">
                    <div className="description">¿Quién realiza el Diseño de tratamiento de fracturamiento?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="disenioFracturasObs" /></div>
                    {errors.disenioFracturasObs && touched.disenioFracturasObs && <div class="error">{errors.disenioFracturasObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cuenta con software u otra herramienta para realizar el diseño? Indique cual</div>
                    <div className="bool"><BoolInput name="cuentaSoftware" /></div>
                    <div className="observations"><Field component="textarea" name="cuentaSoftwareObs" /></div>
                    {errors.cuentaSoftware && touched.cuentaSoftware && <div class="error">{errors.cuentaSoftware}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cómo determina el volumen de gel de fractura y sistemas ácidos a emplear?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="determinacionVolumenObs" /></div>
                    {errors.determinacionVolumenObs && touched.determinacionVolumenObs && <div class="error">{errors.determinacionVolumenObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Sus yacimiento están depresionados?</div>
                    <div className="bool"><BoolInput name="yacimientoDepresionados" /></div>
                    <div className="observations"><Field type="text" name="yacimientoDepresionadosObs" /></div>
                    {errors.yacimientoDepresionados && touched.yacimientoDepresionados && <div class="error">{errors.yacimientoDepresionados}</div>}
                  </div>
                  <div className="trow">
                    <div className="indented description">¿Qué rango de temperatura tiene sus formaciones?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="rangoTempObs" /></div>
                    {errors.rangoTempObs && touched.rangoTempObs && <div class="error">{errors.rangoTempObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="indented description">¿Sus formaciones son carbonatos u arenas?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="carbonatosArenasObs" /></div>
                    {errors.carbonatosArenasObs && touched.carbonatosArenasObs && <div class="error">{errors.carbonatosArenasObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cómo determina el beneficio del fracturamiento?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="beneficioFracObs" /></div>
                    {errors.beneficioFracObs && touched.beneficioFracObs && <div class="error">{errors.beneficioFracObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Efectúa análisis económico antes y después del tratamiento?</div>
                    <div className="bool"><BoolInput name="analisisEconomico" /></div>
                    <div className="observations"><Field component="textarea" name="analisisEconomicoObs" /></div>
                    {errors.analisisEconomico && touched.analisisEconomico && <div class="error">{errors.analisisEconomico}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Realiza diferentes escenarios de diseño para la selección del óptimo?</div>
                    <div className="bool"><BoolInput name="diferentesEscenarios" /></div>
                    <div className="observations"><Field component="textarea" name="diferentesEscenariosObs" /></div>
                    {errors.diferentesEscenarios && touched.diferentesEscenarios && <div class="error">{errors.diferentesEscenarios}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Quién realiza la base de usuario para el tratamiento?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="baseUsuarioObs" /></div>
                    {errors.baseUsuarioObs && touched.baseUsuarioObs && <div class="error">{errors.baseUsuarioObs}</div>}
                  </div>
                </div>
              </div>

              <div className="table">
                <div className="header">
                  <div className="description">Descripción</div>
                  <div className="bool">Si/No</div>
                  <div className="observations">Observaciones</div>
                </div>
                <div className="row-title">Ejecución</div>
                <div className="body">
                  <div className="trow">
                    <div className="description">¿Quién programa la ejecución del tratamiento?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="quienProgFracObs" /></div>
                    {errors.quienProgFracObs && touched.quienProgFracObs && <div class="error">{errors.quienProgFracObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿A quien se le entrega la base de usuario para la intervención?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="entregaBaseObs" /></div>
                    {errors.entregaBaseObs && touched.entregaBaseObs && <div class="error">{errors.entregaBaseObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Quién supervisa la ejecución de la intervención?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field type="text" name="supervisaEjecObs" /></div>
                    {errors.supervisaEjecObs && touched.supervisaEjecObs && <div class="error">{errors.supervisaEjecObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Efectúa un control de calidad a los equipos y sistemas antes del tratamiento?</div>
                    <div className="bool"><BoolInput name="controlCalidad" /></div>
                    <div className="observations"><Field type="text" name="controlCalidadObs" /></div>
                    {errors.controlCalidad && touched.controlCalidad && <div class="error">{errors.controlCalidad}</div>}
                  </div>
                  <div className="trow">
                    <div className=" description">¿Efectúa monitoreo durante la ejecución del tratamiento?</div>
                    <div className="bool"><BoolInput name="monitoreoEjecucion" /></div>
                    <div className="observations"><Field type="text" name="monitoreoEjecucionObs" /></div>
                    {errors.monitoreoEjecucion && touched.monitoreoEjecucion && <div class="error">{errors.monitoreoEjecucion}</div>}
                  </div>
                  <div className="trow">
                    <div className=" description">¿Se realizan ajustes al diseño durante la operación?</div>
                    <div className="bool"><BoolInput name="ajustesDisenio" /></div>
                    <div className="observations"><Field type="text" name="ajustesDisenioObs" /></div>
                    {errors.ajustesDisenio && touched.ajustesDisenio && <div class="error">{errors.ajustesDisenio}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Se realiza un reporte pos-tratamiento?</div>
                    <div className="bool"><BoolInput name="reportePost" /></div>
                    <div className="observations"><Field type="text" name="reportePostObs" /></div>
                    {errors.reportePost && touched.reportePost && <div class="error">{errors.reportePost}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Quién abre a producción el pozo?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="abreProdObs" /></div>
                    {errors.abreProdObs && touched.abreProdObs && <div class="error">{errors.abreProdObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Se realiza medición del pozo después del tratamiento?</div>
                    <div className="bool"><BoolInput name="medicionPozoPost" /></div>
                    <div className="observations"><Field component="textarea" name="medicionPozoPostObs" /></div>
                    {errors.medicionPozoPost && touched.medicionPozoPost && <div class="error">{errors.medicionPozoPost}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Se tiene un programa de toma de muestras para su análisis?</div>
                    <div className="bool"><BoolInput name="programaTomaMuestras" /></div>
                    <div className="observations"><Field component="textarea" name="programaTomaMuestrasObs" /></div>
                    {errors.programaTomaMuestras && touched.programaTomaMuestras && <div class="error">{errors.programaTomaMuestras}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Se hace una evaluación pos-tratamiento?</div>
                    <div className="bool"><BoolInput name="evaluacionPostfrac" /></div>
                    <div className="observations"><Field component="textarea" name="evaluacionPostfracObs" /></div>
                    {errors.evaluacionPostfrac && touched.evaluacionPostfrac && <div class="error">{errors.evaluacionPostfrac}</div>}
                  </div>
                </div>
              </div>

              <div className="table">
                <div className="header">
                  <div className="description">Descripción</div>
                  <div className="bool">Si/No</div>
                  <div className="observations">Observaciones</div>
                </div>
                <div className="row-title">Ejecución</div>
                <div className="body">
                  <div className="trow">
                    <div className="description">¿Cómo realiza la evaluación técnica de la efectividad del tratamiento?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="comoEvalTecnicaObs" /></div>
                    {errors.comoEvalTecnicaObs && touched.comoEvalTecnicaObs && <div class="error">{errors.comoEvalTecnicaObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cuáles son las variables económicas con las que realiza la evaluación pos-tratamiento?</div>
                    <div className="bool"></div>
                    <div className="observations"><Field component="textarea" name="variablesEcoPostObs" /></div>
                    {errors.variablesEcoPostObs && touched.variablesEcoPostObs && <div class="error">{errors.variablesEcoPostObs}</div>}
                  </div>
                  <div className="trow">
                    <div className="description">¿Cuenta con un programa de acciones de mejora?</div>
                    <div className="bool"><BoolInput name="progAccionesMejopra" /></div>
                    <div className="observations"><Field type="text" name="progAccionesMejopraObs" /></div>
                    {errors.progAccionesMejopraObs && touched.progAccionesMejopraObs && <div class="error">{errors.progAccionesMejopraObs}</div>}
                  </div>
                </div>
              </div>

              {this.props.isAdmin && <div className="button-group">
              <button disabled={!this.state.update} className="submit button" onClick={this.confirmEdit}>
                  Editar
                </button>
                <button disabled={this.state.update} className="submit button" type="submit">
                  Enviar
                </button>
              </div>}

              {Object.entries(errors).length > 0 && <div class="error">Esta planilla contiene errores.</div>}
            </Form>
          )}
        </Formik>
        <Notification />
        <Loading />
      </div>
    )
  }
}

const DateInput = (props) => {
  return (
    <Field name={props.name}>
      {({ field, form }) => (
        <DatePicker
          customInput={
            <MaskedTextInput
              type="text"
              mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
            />
          }
          isClearable={true}
          dateFormat="L"
          name={props.name}
          onChange={(date, event) => {
            if (date)
              form.setFieldValue(props.name, date.format('YYYY-MM-DD'))
          }}
          selected={field.value ? moment(field.value) : null}
          locale="es-mx"
        />
      )}
    </Field>
  )

}

const BoolInput = (props) => {
  return (
    <Field name={props.name}>
      {({ field, form }) => (
        <div className="bool-field">
          <label>
            <input
              {...props}
              type="radio"
              value={true}
              checked={field.value == 1}
              onChange={() => {
                form.setFieldValue(props.name, 1)
              }}
            />
            <span>Si</span>
          </label>
          <label>
            <input
              {...props}
              type="radio"
              value={false}
              checked={field.value == 0}
              onChange={() => {
                form.setFieldValue(props.name, 0)
              }}
            />
            <span>No</span>
          </label>
        </div>
      )}
    </Field>
  );
};

const Dropdown = (props) => {
  return (
    <Field name={props.name}>
      {({ field, form }) => (
        <Select
          simpleValue
          placeholder="Seleccionar"
          className='input'
          options={props.options}
          name={props.name}
          value={props.options.find(i => i.value === field.value)}
          onChange={selectedOption => {
            form.setFieldValue(props.name, selectedOption.value)
          }}
        />
      )}
    </Field>
  )
}


const mapDispatchToProps = dispatch => ({
  setLoading: values => { dispatch(setIsLoading(values)) },
})

const mapStateToProps = state => ({
  user: state.getIn(['user', 'id']),
  token: state.getIn(['user', 'token']),
  isAdmin: state.getIn(['user', 'isAdmin']),
})


export default connect(mapStateToProps, mapDispatchToProps)(MapeoForm);
