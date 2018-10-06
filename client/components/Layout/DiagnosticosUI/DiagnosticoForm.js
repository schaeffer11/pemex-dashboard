import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask";
import moment from 'moment'
import { connect } from 'react-redux'

import { Formik, Form, Field, ErrorMessage } from 'formik';

@autobind class DiagnosticoForm extends Component {
    constructor(props) {
        super(props)
        this.initialValues = {
           email: '', password: ''
        }
    }

    isEmpty(val){
        return val == undefined || val == null || val == ""
    }

    validate(values){
        let errors = {};

        if(!values.asignacion){
            errors.asignacion = "Este campo no puede estar vacio"
        }

        if(!values.fechaRevision){
            errors.fechaRevision = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.disenaYConstruye)){
            errors.disenaYConstruye = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.analisisNodal)){
            errors.analisisNodal = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.ajusteDiario)){
            errors.ajusteDiario = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.frequenciaAforo)){
            errors.frequenciaAforo = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.cuentaPVT)){
            errors.cuentaPVT = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.cuentaEstadosMecanico)){
            errors.cuentaEstadosMecanico = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.softwareModelPozoObs)){
            errors.softwareModelPozoObs = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.caracterizacionFluidos)){
            errors.caracterizacionFluidos = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.frequenciaFluidosObs)){
            errors.frequenciaFluidosObs = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.caracterizacionPEMEX)){
            errors.caracterizacionPEMEX = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.viscosidadAceite)){
            errors.viscosidadAceite = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.indiceColoidal)){
            errors.indiceColoidal = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.densidadEmulsion)){
            errors.densidadEmulsion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.estabilidadElectrica)){
            errors.estabilidadElectrica = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.analisisStriffDavis)){
            errors.analisisStriffDavis = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.problemasDepositosOrganicos)){
            errors.problemasDepositosOrganicos = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.problemasInorganicas)){
            errors.problemasInorganicas = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.problemasMovilidad)){
            errors.problemasMovilidad = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.identificadoProblemas)){
            errors.identificadoProblemas = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.procedimientoRemocion)){
            errors.procedimientoRemocion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.calibraciones)){
            errors.calibraciones = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.limpiezaAparejo)){
            errors.limpiezaAparejo = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.estimulacionMatricial)){
            errors.estimulacionMatricial = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.fracturamientoAcidos)){
            errors.fracturamientoAcidos = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.fracturamientoApuntalados)){
            errors.fracturamientoApuntalados = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.refracturas)){
            errors.refracturas = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.procesosInhibicion)){
            errors.procesosInhibicion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.mejoradoresFlujo)){
            errors.mejoradoresFlujo = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.controlAgua)){
            errors.controlAgua = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.controlGas)){
            errors.controlGas = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.controlArena)){
            errors.controlArena = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.realizaDisenoEstimulacion)){
            errors.realizaDisenoEstimulacion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.softwareEstimulacionObs)){
            errors.softwareEstimulacionObs = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.efectuaEvaluacion)){
            errors.efectuaEvaluacion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.supervisaPruebas)){
            errors.supervisaPruebas = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.supervisorObs)){
            errors.supervisorObs = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.validaPropuestasObs)){
            errors.validaPropuestasObs = "Este campo no puede estar vacio"
        }


        if(this.isEmpty(values.baseDisenos)){
            errors.baseDisenos = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.cuentaMatriz)){
            errors.cuentaMatriz = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.criterioOptimaTratamiento)){
            errors.criterioOptimaTratamiento = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.evaluacionPostratamiento)){
            errors.evaluacionPostratamiento = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.promedioEfectividad)){
            errors.promedioEfectividad = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.costoPromedioEstimulacion)){
            errors.costoPromedioEstimulacion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.gastoMinimoEstimulacion)){
            errors.gastoMinimoEstimulacion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.gastoPromedioEstimulacion)){
            errors.gastoPromedioEstimulacion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.disenaControlAgua)){
            errors.disenaControlAgua = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.disenaControlArena)){
            errors.disenaControlArena = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.monitoreoPozo)){
            errors.monitoreoPozo = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.frequenciaMonitoreo)){
            errors.frequenciaMonitoreo = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.operacionMayorFrequencia)){
            errors.operacionMayorFrequencia = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.baseUsuario)){
            errors.baseUsuario = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.programaTomaInformacion)){
            errors.programaTomaInformacion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.sensoresPresionFondo)){
            errors.sensoresPresionFondo = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.numeroOperacionesMes)){
            errors.numeroOperacionesMes = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.registrosFondoCerrado)){
            errors.registrosFondoCerrado = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.registrosFondoFluyente)){
            errors.registrosFondoFluyente = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.registrosProduccion)){
            errors.registrosProduccion = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.aforos)){
            errors.aforos = "Este campo no puede estar vacio"
        }

        if(this.isEmpty(values.personalTomaInformacion)){
            errors.personalTomaInformacion = "Este campo no puede estar vacio"
        }


        return errors;
    }

    onSubmit(values, actions ){
        setTimeout(() => {
            const { token, user } = this.props

            const headers = {
                'Authorization': `Bearer ${token}`,
            }

            const formData = new FormData()

            Object.entries(values).forEach(([key,value]) => {
                formData.append(key, value);
            })

            fetch('/api/diagnostico', {
                headers,
                method: 'POST',
                body: formData,
            })
                .then(r => r.json())
                .then((res) => {
                    if (res.success) {
                        this.setState({
                            bugResponseError: false,
                            bugResponseSuccess: true,
                        })
                    } else {
                        this.setState({
                            bugResponseError: true,
                            bugResponseSuccess: false,
                        })
                    }
                })

            actions.setSubmitting(false);
        }, 400);
    }


    render(){
        return(
          <div>
            <Formik
                initialValues={this.initialValues}
                validate={this.validate}
                onSubmit={this.onSubmit}
            >
                { ({touched, isSubmitting, errors}) => (
                    <Form>
                        <div className="title">Diagnóstico de Productividad</div>

                        <div className="heading">
                            <div className="name">
                              <label>Nombre de la Asignación</label>
                              <Field type="text" name="asignacion" />
                                {errors.asignacion && <div class="error">{errors.asignacion}</div>}
                            </div>

                            <div className="fecha">
                                <label>Fecha de revisión</label>
                                <DateInput name="fechaRevision"/>
                                {errors.fechaRevision && <div class="error">{errors.fechaRevision}</div>}
                            </div>
                        </div>

                        <div className="table">
                            <div className="header">
                                <div className="description">Descripción</div>
                                <div className="bool">Si/No</div>
                                <div className="observations">Observaciones</div>
                            </div>
                            <div className="row-title">I. Modelo de Pozos</div>
                            <div className="body">
                                <div className="trow">
                                    <div className="description">Diseña y Construye el Modelo de Pozo</div>
                                    <div className="bool"><BoolInput name="disenaYConstruye" /></div>
                                    <div className="observations"><Field component="textarea" name="disenaYConstruyeObs" /></div>
                                    {errors.disenaYConstruye && <div class="error">{errors.disenaYConstruye}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Se cuenta con análisis Nodal de pozos</div>
                                    <div className="bool"><BoolInput name="analisisNodal" /></div>
                                    <div className="observations"><Field component="textarea" name="analisisNodalObs" /></div>
                                    {errors.analisisNodal && <div class="error">{errors.analisisNodal}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Diseña y Construye el Modelo de Pozo</div>
                                    <div className="bool"><BoolInput name="ajusteDiario" /></div>
                                    <div className="observations"><Field component="textarea" name="ajusteDiarioObs" /></div>
                                    {errors.ajusteDiario && <div class="error">{errors.ajusteDiario}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Se cuenta con análisis Nodal de pozos</div>
                                    <div className="bool"><BoolInput name="frequenciaAforo" /></div>
                                    <div className="observations"><Field component="textarea" name="frequenciaAforoObs" /></div>
                                    {errors.frequenciaAforo && <div class="error">{errors.frequenciaAforo}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Diseña y Construye el Modelo de Pozo</div>
                                    <div className="bool"><BoolInput name="cuentaPVT" /></div>
                                    <div className="observations"><Field component="textarea" name="cuentaPVTObs" /></div>
                                    {errors.cuentaPVT && <div class="error">{errors.cuentaPVT}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Se cuenta con análisis Nodal de pozos</div>
                                    <div className="bool"><BoolInput name="cuentaEstadosMecanico" /></div>
                                    <div className="observations"><Field component="textarea" name="cuentaEstadosMecanicoObs" /></div>
                                    {errors.cuentaEstadosMecanico && <div class="error">{errors.cuentaEstadosMecanico}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Que software utiliza para el modelo de pozo</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="softwareModelPozoObs" /></div>
                                    {errors.softwareModelPozoObs && <div class="error">{errors.softwareModelPozoObs}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="table">
                            <div className="header">
                                <div className="description">Descripción</div>
                                <div className="bool">Si/No</div>
                                <div className="observations">Observaciones</div>
                            </div>
                            <div className="row-title">II. Caracterización de Fluidos producidos</div>
                            <div className="body">
                                <div className="trow">
                                    <div className="description">Se cuenta con una base de la caracterización de los fluidos producidos por pozo actualizada</div>
                                    <div className="bool"><BoolInput name="caracterizacionFluidos" /></div>
                                    <div className="observations"><Field component="textarea" name="caracterizacionFluidosObs" /></div>
                                    {errors.caracterizacionFluidos && <div class="error">{errors.caracterizacionFluidos}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Con que frecuencia se toman muestras de fluidos producidos para su caracterización.</div>
                                    <div className="bool"></div>
                                    <div className="observations">Cantidad: <Field type="text" name="frequenciaFluidosObs" /></div>
                                    {errors.frequenciaFluidosObs && <div class="error">{errors.frequenciaFluidosObs}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">La caracterización es realizada por laboratorio de PEMEX(Si su respuesta es No, especifique compañia de servicio) </div>
                                    <div className="bool"><BoolInput name="caracterizacionPEMEX" /></div>
                                    <div className="observations"><Field component="textarea" name="caracterizacionPEMEXObs" /></div>
                                    {errors.caracterizacionPEMEX && <div class="error">{errors.caracterizacionPEMEX}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Su caracterización de fluidos incluye:</div>
                                </div>
                                <div className="trow">
                                    <div className="description">Viscosidad del aceite (cp)</div>
                                    <div className="bool"><BoolInput name="viscosidadAceite" /></div>
                                    <div className="observations"><Field component="textarea" name="viscosidadAceiteObs" /></div>
                                    {errors.viscosidadAceite && <div class="error">{errors.viscosidadAceite}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Indice de estabilidad Coloidal (SARA)</div>
                                    <div className="bool"><BoolInput name="indiceColoidal" /></div>
                                    <div className="observations"><Field component="textarea" name="indiceColoidalObs" /></div>
                                    {errors.indiceColoidal && <div class="error">{errors.indiceColoidal}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Densidad de la emulsión (gr/cm3)</div>
                                    <div className="bool"><BoolInput name="densidadEmulsion" /></div>
                                    <div className="observations"><Field component="textarea" name="densidadEmulsionObs" /></div>
                                    {errors.densidadEmulsion && <div class="error">{errors.densidadEmulsion}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Estabilidad eléctrica de la emulsión</div>
                                    <div className="bool"><BoolInput name="estabilidadElectrica" /></div>
                                    <div className="observations"><Field component="textarea" name="estabilidadElectricaObs" /></div>
                                    {errors.estabilidadElectrica && <div class="error">{errors.estabilidadElectrica}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Análisis Striff & Davis (Indice de estabilidad del agua)</div>
                                    <div className="bool"><BoolInput name="analisisStriffDavis" /></div>
                                    <div className="observations"><Field component="textarea" name="analisisStriffDavisObs" /></div>
                                    {errors.analisisStriffDavis && <div class="error">{errors.analisisStriffDavis}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="table">
                            <div className="header">
                                <div className="description">Descripción</div>
                                <div className="bool">Si/No</div>
                                <div className="observations">Observaciones</div>
                            </div>
                            <div className="row-title">III. Aseguramiento de flujo</div>
                            <div className="body">
                                <div className="trow">
                                    <div className="description">Tiene problemas de depósitos orgánicos</div>
                                    <div className="bool"><BoolInput name="problemasDepositosOrganicos" /></div>
                                    <div className="observations"><Field component="textarea" name="problemasDepositosOrganicosObs" /></div>
                                    {errors.problemasDepositosOrganicos && <div class="error">{errors.problemasDepositosOrganicos}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Tiene problemas de incrustaciones inorgánicas</div>
                                    <div className="bool"><BoolInput name="problemasInorganicas" /></div>
                                    <div className="observations"><Field component="textarea" name="problemasInorganicasObs" /></div>
                                    {errors.problemasInorganicas && <div class="error">{errors.problemasInorganicas}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Tiene problemas de movilidad de fluidos producidos (crudo pesado y/o extrapesado)</div>
                                    <div className="bool"><BoolInput name="problemasMovilidad" /></div>
                                    <div className="observations"><Field component="textarea" name="problemasMovilidadObs" /></div>
                                    {errors.problemasMovilidad && <div class="error">{errors.problemasMovilidad}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Tiene identificado los pozos con problemas de dépositos y/o incrustaciones</div>
                                    <div className="bool"><BoolInput name="identificadoProblemas" /></div>
                                    <div className="observations"><Field component="textarea" name="identificadoProblemasObs" /></div>
                                    {errors.identificadoProblemas && <div class="error">{errors.identificadoProblemas}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Cuenta con un procedimiento para la remoción de depósitos y/o incrustaciones</div>
                                    <div className="bool"><BoolInput name="procedimientoRemocion" /></div>
                                    <div className="observations"><Field component="textarea" name="procedimientoRemocionObs" /></div>
                                    {errors.procedimientoRemocion && <div class="error">{errors.procedimientoRemocion}</div>}
                                </div>
                                <div className="trow row-title">
                                    <div className="description">Indique el numero de operaciones que realiza al mes de:</div>
                                    <div className="bool"></div>
                                    <div className="observations">Cantidad</div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Calibraciones.</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="calibraciones" /></div>
                                    {errors.calibraciones && <div class="error">{errors.calibraciones}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Limpieza de aparejo</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="limpiezaAparejo" /></div>
                                    {errors.limpiezaAparejo && <div class="error">{errors.limpiezaAparejo}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Estimulación matricial</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="estimulacionMatricial" /></div>
                                    {errors.estimulacionMatricial && <div class="error">{errors.estimulacionMatricial}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Fracturamiento ácidos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="fracturamientoAcidos" /></div>
                                    {errors.fracturamientoAcidos && <div class="error">{errors.fracturamientoAcidos}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Fracturamiento apuntalados</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="fracturamientoApuntalados" /></div>
                                    {errors.fracturamientoApuntalados && <div class="error">{errors.fracturamientoApuntalados}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Refracturas</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="refracturas" /></div>
                                    {errors.refracturas && <div class="error">{errors.refracturas}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Procesos de inhibición</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="procesosInhibicion" /></div>
                                    {errors.procesosInhibicion && <div class="error">{errors.procesosInhibicion}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Mejoradores de flujo</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="mejoradoresFlujo" /></div>
                                    {errors.mejoradoresFlujo && <div class="error">{errors.mejoradoresFlujo}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Control de agua</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="controlAgua" /></div>
                                    {errors.controlAgua && <div class="error">{errors.controlAgua}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Control de gas</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="controlGas" /></div>
                                    {errors.controlGas && <div class="error">{errors.controlGas}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Control de arena</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="controlArena" /></div>
                                    {errors.controlArena && <div class="error">{errors.controlArena}</div>}
                                </div>
                            </div>
                            <div className="trow">
                                <div className="description">Realiza diseño y cédula de tratamiento de estimulación</div>
                                <div className="bool"><BoolInput name="realizaDisenoEstimulacion" /></div>
                                <div className="observations"><Field component="textarea" name="realizaDisenoEstimulacionObs" /></div>
                                {errors.realizaDisenoEstimulacion && <div class="error">{errors.realizaDisenoEstimulacion}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Qué software utiliza para el diseño de tratamientos de estimulación (matriciales y fracturas)</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="softwareEstimulacionObs" /></div>
                                {errors.softwareEstimulacionObs && <div class="error">{errors.softwareEstimulacionObs}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Efectua evaluación economica del tratamiento de estimulación</div>
                                <div className="bool"><BoolInput name="efectuaEvaluacion" /></div>
                                <div className="observations"><Field component="textarea" name="efectuaEvaluacionObs" /></div>
                                {errors.observations && <div class="error">{errors.observations}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Supervisa pruebas de laboratorio para la selección de sistemas quìmicos</div>
                                <div className="bool"><BoolInput name="supervisaPruebas" /></div>
                                <div className="observations"><Field component="textarea" name="supervisaPruebasObs" /></div>
                                {errors.supervisaPruebas && <div class="error">{errors.supervisaPruebas}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Quién supervisa en campo los tratamientos de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="supervisorObs" /></div>
                                {errors.supervisorObs && <div class="error">{errors.supervisorObs}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Quién valida las propuestas de tratamiento de estimulación realizada por compañias de servicio</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="validaPropuestasObs" /></div>
                                {errors.validaPropuestasObs && <div class="error">{errors.validaPropuestasObs}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Cuenta con una base de los diseños de tratamientos de estimulación actualizada</div>
                                <div className="bool"><BoolInput name="baseDisenos" /></div>
                                <div className="observations"><Field component="textarea" name="baseDisenosObs" /></div>
                                {errors.baseDisenos && <div class="error">{errors.baseDisenos}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Cuenta con una matriz de evaluación de las compañias de servicio que proporcionan tratamientos de estimulación</div>
                                <div className="bool"><BoolInput name="cuentaMatriz" /></div>
                                <div className="observations"><Field component="textarea" name="cuentaMatrizObs" /></div>
                                {errors.cuentaMatriz && <div class="error">{errors.cuentaMatriz}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Cual es el criterio que utiliza para seleccionar la compañia óptima para el tratamiento</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="criterioOptimaTratamiento" /></div>
                                {errors.criterioOptimaTratamiento && <div class="error">{errors.criterioOptimaTratamiento}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Efectua evaluación postratamiento (técnico-económica) de la estimulación</div>
                                <div className="bool"><BoolInput name="evaluacionPostratamiento" /></div>
                                <div className="observations"><Field component="textarea" name="evaluacionPostratamientoObs" /></div>
                                {errors.evaluacionPostratamiento && <div class="error">{errors.evaluacionPostratamiento}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Tiempo promedio de efectividad del tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Tiempo: <Field name="promedioEfectividad" /></div>
                                {errors.promedioEfectividad && <div class="error">{errors.promedioEfectividad}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Costo promedio de un tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Costo: <Field name="costoPromedioEstimulacion" /></div>
                                {errors.costoPromedioEstimulacion && <div class="error">{errors.costoPromedioEstimulacion}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Gasto de producción mìnimo requerido para realizar el tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Gasto minimo:<Field name="gastoMinimoEstimulacion" /></div>
                                {errors.gastoMinimoEstimulacion && <div class="error">{errors.gastoMinimoEstimulacion}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Gasto promedio de producción obtenido después del tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Gasto prom:<Field name="gastoPromedioEstimulacion" /></div>
                                {errors.observations && <div class="error">{errors.observations}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Diseña y efectua operaciones de control de agua y/o gas</div>
                                <div className="bool"><BoolInput name="disenaControlAgua" /></div>
                                <div className="observations"><Field component="textarea" name="disenaControlAguaObs" /></div>
                                {errors.disenaControlAgua && <div class="error">{errors.disenaControlAgua}</div>}
                            </div>
                            <div className="trow">
                                <div className="description">Diseña y efectua operaciones de control de arena</div>
                                <div className="bool"><BoolInput name="disenaControlArena" /></div>
                                <div className="observations"><Field component="textarea" name="disenaControlArenaObs" /></div>
                                {errors.disenaControlArena && <div class="error">{errors.disenaControlArena}</div>}
                            </div>
                        </div>

                        <div className="table">
                            <div className="header">
                                <div className="description">Descripción</div>
                                <div className="bool">Si/No</div>
                                <div className="observations">Observaciones</div>
                            </div>
                            <div className="row-title">IV. Optimización de Pozos</div>
                            <div className="body">
                                <div className="trow">
                                    <div className="description">Cuenta con una base de datos de producción para el monitoreo de sus pozos</div>
                                    <div className="bool"><BoolInput name="monitoreoPozo" /></div>
                                    <div className="observations"><Field component="textarea" name="monitoreoPozoObs" /></div>
                                    {errors.monitoreoPozo && <div class="error">{errors.monitoreoPozo}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Con que frecuencia realiza el monitoreo de sus pozos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="frequenciaMonitoreo" /></div>
                                    {errors.frequenciaMonitoreo && <div class="error">{errors.frequenciaMonitoreo}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Cuál es la operación que realiza con mayor frequencia para la optimización de los pozos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="operacionMayorFrequencia" /></div>
                                    {errors.operacionMayorFrequencia && <div class="error">{errors.operacionMayorFrequencia}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Quien realiza la base de usuario</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="baseUsuario" /></div>
                                    {errors.baseUsuario && <div class="error">{errors.baseUsuario}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="table">
                            <div className="header">
                                <div className="description">Descripción</div>
                                <div className="bool">Si/No</div>
                                <div className="observations">Observaciones</div>
                            </div>
                            <div className="row-title">V. Toma de Informacion</div>
                            <div className="body">
                                <div className="trow">
                                    <div className="description">Cuenta con un programa de toma de información</div>
                                    <div className="bool"><BoolInput name="programaTomaInformacion" /></div>
                                    <div className="observations"><Field component="textarea" name="programaTomaInformacionObs" /></div>
                                    {errors.programaTomaInformacion && <div class="error">{errors.programaTomaInformacion}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Cuenta con sensores de presión de fondo permanente en los pozos</div>
                                    <div className="bool"><BoolInput name="sensoresPresionFondo" /></div>
                                    <div className="observations"><Field component="textarea" name="sensoresPresionFondoObs" /></div>
                                    {errors.sensoresPresionFondo && <div class="error">{errors.sensoresPresionFondo}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Indique el numero de operaciones que realiza al mes de:</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="numeroOperacionesMes" /></div>
                                    {errors.numeroOperacionesMes && <div class="error">{errors.numeroOperacionesMes}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Registros de presión de fondo cerrado</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="registrosFondoCerrado" /></div>
                                    {errors.registrosFondoCerrado && <div class="error">{errors.registrosFondoCerrado}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Registros de presión de fondo fluyente</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="registrosFondoFluyente" /></div>
                                    {errors.registrosFondoFluyente && <div class="error">{errors.registrosFondoFluyente}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Registros de producción (Presión - Temperatura, PLT)</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="registrosProduccion" /></div>
                                    {errors.registrosProduccion && <div class="error">{errors.registrosProduccion}</div>}
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Aforos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="aforos" /></div>
                                    {errors.aforos && <div class="error">{errors.aforos}</div>}
                                </div>
                                <div className="trow">
                                    <div className="description">Personal de Productividad supervisa de la toma de información</div>
                                    <div className="bool"><BoolInput name="personalTomaInformacion" /></div>
                                    <div className="observations"><Field component="textarea" name="personalTomaInformacionObs" /></div>
                                    {errors.personalTomaInformacion && <div class="error">{errors.personalTomaInformacion}</div>}
                                </div>
                            </div>
                        </div>

                        <button className="submit button" type="submit">
                            Enviar
                        </button>

                        {Object.entries(errors).length > 0 && <div class="error">Esta forma contiene errores.</div>}
                    </Form>
                )}
            </Formik>
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
                        if(date)
                            form.setFieldValue(props.name, date.format('YYYY-MM-DD'))
                    }}
                    selected={field.value ? moment(field.value) : null }
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
                    </label>
                    <label>
                        <input
                            {...props}
                            type="radio"
                            value={false}
                            checked={field.value == 0}
                            onChange={() => {
                                form.setFieldValue(props.name,0)
                            }}
                        />
                    </label>
                </div>
            )}
        </Field>
    );
};

const mapStateToProps = state => ({
    user: state.getIn(['user', 'id']),
    token: state.getIn(['user', 'token'])
})


export default connect(mapStateToProps, null)(DiagnosticoForm);
