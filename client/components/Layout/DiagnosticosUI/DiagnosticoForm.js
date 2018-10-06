import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import DatePicker from 'react-datepicker'
import { connect } from 'react-redux'

// Render Prop
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {submitForm} from "../../../redux/actions/pozoFormActions";

@autobind class DiagnosticoForm extends Component {
    constructor(props) {
        super(props)
        this.initialValues = {
           email: '', password: ''
        }
    }

    validate(values){
        let errors = {};
        /*
        if (!values.email) {
            errors.email = 'Required';
        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
            errors.email = 'Invalid email address';
        }
        */
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
                { formik => (
                    <Form>
                        <div className="title">Diagnóstico de Productividad</div>

                        <div className="heading">
                            <div className="name">
                              <label>Nombre de la Asignación</label>
                              <Field type="text" name="asignacion" />
                              <ErrorMessage name="asignacion" component="div" />
                            </div>

                            <div className="fecha">
                                <label>Fecha de revisión</label>
                                <DatePicker name="fechaRevision" />
                                <ErrorMessage name="fechaRevision" component="div" />
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
                                </div>
                                <div className="trow">
                                    <div className="description">Se cuenta con análisis Nodal de pozos</div>
                                    <div className="bool"><BoolInput name="analisisNodal" /></div>
                                    <div className="observations"><Field component="textarea" name="analisisNodalObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Diseña y Construye el Modelo de Pozo</div>
                                    <div className="bool"><BoolInput name="ajusteDiario" /></div>
                                    <div className="observations"><Field component="textarea" name="ajusteDiarioObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Se cuenta con análisis Nodal de pozos</div>
                                    <div className="bool"><BoolInput name="frequenciaAforo" /></div>
                                    <div className="observations"><Field component="textarea" name="frequenciaAforoObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Diseña y Construye el Modelo de Pozo</div>
                                    <div className="bool"><BoolInput name="cuentaPVT" /></div>
                                    <div className="observations"><Field component="textarea" name="cuentaPVTObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Se cuenta con análisis Nodal de pozos</div>
                                    <div className="bool"><BoolInput name="cuentaEstadosMecanico" /></div>
                                    <div className="observations"><Field component="textarea" name="cuentaEstadosMecanicoObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Que software utiliza para el modelo de pozo</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="softwareModelPozoObs" /></div>
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
                                </div>
                                <div className="trow">
                                    <div className="description">Con que frecuencia se toman muestras de fluidos producidos para su caracterización.</div>
                                    <div className="bool"></div>
                                    <div className="observations">Cantidad: <Field type="text" name="frequenciaFluidosObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">La caracterización es realizada por laboratorio de PEMEX(Si su respuesta es No, especifique compañia de servicio) </div>
                                    <div className="bool"><BoolInput name="caracterizacionPEMEX" /></div>
                                    <div className="observations"><Field component="textarea" name="caracterizacionPEMEXObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Su caracterización de fluidos incluye:</div>
                                </div>
                                <div className="trow">
                                    <div className="description">Viscosidad del aceite (cp)</div>
                                    <div className="bool"><BoolInput name="viscosidadAceite" /></div>
                                    <div className="observations"><Field component="textarea" name="viscosidadAceiteObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Indice de estabilidad Coloidal (SARA)</div>
                                    <div className="bool"><BoolInput name="indiceColoidal" /></div>
                                    <div className="observations"><Field component="textarea" name="indiceColoidalObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Densidad de la emulsión (gr/cm3)</div>
                                    <div className="bool"><BoolInput name="densidadEmulsion" /></div>
                                    <div className="observations"><Field component="textarea" name="densidadEmulsionObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Estabilidad eléctrica de la emulsión</div>
                                    <div className="bool"><BoolInput name="estabilidadElectrica" /></div>
                                    <div className="observations"><Field component="textarea" name="estabilidadElectricaObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Análisis Striff & Davis (Indice de estabilidad del agua)</div>
                                    <div className="bool"><BoolInput name="analisisStriffDavis" /></div>
                                    <div className="observations"><Field component="textarea" name="analisisStriffDavisObs" /></div>
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
                                </div>
                                <div className="trow">
                                    <div className="description">Tiene problemas de incrustaciones inorgánicas</div>
                                    <div className="bool"><BoolInput name="problemasInorganicas" /></div>
                                    <div className="observations"><Field component="textarea" name="problemasInorganicasObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Tiene problemas de movilidad de fluidos producidos (crudo pesado y/o extrapesado)</div>
                                    <div className="bool"><BoolInput name="problemasMovilidad" /></div>
                                    <div className="observations"><Field component="textarea" name="problemasMovilidadObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Tiene identificado los pozos con problemas de dépositos y/o incrustaciones</div>
                                    <div className="bool"><BoolInput name="identificadoProblemas" /></div>
                                    <div className="observations"><Field component="textarea" name="identificadoProblemasObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Cuenta con un procedimiento para la remoción de depósitos y/o incrustaciones</div>
                                    <div className="bool"><BoolInput name="procedimientoRemocion" /></div>
                                    <div className="observations"><Field component="textarea" name="procedimientoRemocionObs" /></div>
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
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Limpieza de aparejo</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="limpiezaAparejo" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Estimulación matricial</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="estimulacionMatricial" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Fracturamiento ácidos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="fracturamientoAcidos" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Fracturamiento apuntalados</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="fracturamientoApuntalados" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Refracturas</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="refracturas" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Procesos de inhibición</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="procesosInhibicion" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Mejoradores de flujo</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="mejoradoresFlujo" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Control de agua</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="controlAgua" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Control de gas</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="controlGas" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Control de arena</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="controlArena" /></div>
                                </div>
                            </div>
                            <div className="trow">
                                <div className="description">Realiza diseño y cédula de tratamiento de estimulación</div>
                                <div className="bool"><BoolInput name="realizaDisenoEstimulacion" /></div>
                                <div className="observations"><Field component="textarea" name="realizaDisenoEstimulacionObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Qué software utiliza para el diseño de tratamientos de estimulación (matriciales y fracturas)</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="softwareEstimulacionObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Efectua evaluación economica del tratamiento de estimulación</div>
                                <div className="bool"><BoolInput name="efectuaEvaluacion" /></div>
                                <div className="observations"><Field component="textarea" name="efectuaEvaluacionObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Supervisa pruebas de laboratorio para la selección de sistemas quìmicos</div>
                                <div className="bool"><BoolInput name="supervisaPruebas" /></div>
                                <div className="observations"><Field component="textarea" name="supervisaPruebasObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Quién supervisa en campo los tratamientos de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="supervisorObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Quién valida las propuestas de tratamiento de estimulación realizada por compañias de servicio</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="validaPropuestasObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Cuenta con una base de los diseños de tratamientos de estimulación actualizada</div>
                                <div className="bool"><BoolInput name="baseDisenos" /></div>
                                <div className="observations"><Field component="textarea" name="baseDisenosObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Cuenta con una matriz de evaluación de las compañias de servicio que proporcionan tratamientos de estimulación</div>
                                <div className="bool"><BoolInput name="cuentaMatriz" /></div>
                                <div className="observations"><Field component="textarea" name="cuentaMatrizObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Cual es el criterio que utiliza para seleccionar la compañia óptima para el tratamiento</div>
                                <div className="bool"></div>
                                <div className="observations"><Field component="textarea" name="criterioOptimaTratamiento" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Efectua evaluación postratamiento (técnico-económica) de la estimulación</div>
                                <div className="bool"><BoolInput name="evaluacionPostratamiento" /></div>
                                <div className="observations"><Field component="textarea" name="evaluacionPostratamientoObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Tiempo promedio de efectividad del tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Tiempo: <Field name="promedioEfectividad" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Costo promedio de un tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Costo: <Field name="costoPromedioEstimulacion" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Gasto de producción mìnimo requerido para realizar el tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Gasto minimo:<Field name="gastoMinimoEstimulacion" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Gasto promedio de producción obtenido después del tratamiento de estimulación</div>
                                <div className="bool"></div>
                                <div className="observations">Gasto prom:<Field name="gastoPromedioEstimulacion" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Diseña y efectua operaciones de control de agua y/o gas</div>
                                <div className="bool"><BoolInput name="disenaControlAgua" /></div>
                                <div className="observations"><Field component="textarea" name="disenaControlAguaObs" /></div>
                            </div>
                            <div className="trow">
                                <div className="description">Diseña y efectua operaciones de control de arena</div>
                                <div className="bool"><BoolInput name="disenaControlArena" /></div>
                                <div className="observations"><Field component="textarea" name="disenaControlArenaObs" /></div>
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
                                </div>
                                <div className="trow">
                                    <div className="description">Con que frecuencia realiza el monitoreo de sus pozos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="frequenciaMonitoreo" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Cuál es la operación que realiza con mayor frequencia para la optimización de los pozos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="operacionMayorFrequencia" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Quien realiza la base de usuario</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field component="textarea" name="baseUsuario" /></div>
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
                                </div>
                                <div className="trow">
                                    <div className="description">Cuenta con sensores de presión de fondo permanente en los pozos</div>
                                    <div className="bool"><BoolInput name="sensoresPresionFondo" /></div>
                                    <div className="observations"><Field component="textarea" name="sensoresPresionFondoObs" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Indique el numero de operaciones que realiza al mes de:</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="numeroOperacionesMes" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Registros de presión de fondo cerrado</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="registrosFondoCerrado" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Registros de presión de fondo fluyente</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="registrosFondoFluyente" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Registros de producción (Presión - Temperatura, PLT)</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="registrosProduccion" /></div>
                                </div>
                                <div className="trow">
                                    <div className="indented description"> - Aforos</div>
                                    <div className="bool"></div>
                                    <div className="observations"><Field type="number" name="aforos" /></div>
                                </div>
                                <div className="trow">
                                    <div className="description">Personal de Productividad supervisa de la toma de información</div>
                                    <div className="bool"><BoolInput name="personalTomaInformacion" /></div>
                                    <div className="observations"><Field component="textarea" name="personalTomaInformacionObs" /></div>
                                </div>
                            </div>
                        </div>

                        <button className="submit button" type="submit" onClick={formik.onSubmit}>
                            Enviar
                        </button>
                    </Form>
                )}
            </Formik>
          </div>
        )
    }
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
