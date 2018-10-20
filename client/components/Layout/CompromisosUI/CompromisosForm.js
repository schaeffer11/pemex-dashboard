import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask";
import moment from 'moment'
import { connect } from 'react-redux'
import Notification from '../Common/Notification'
import Loading from '../Common/Loading'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Select from 'react-select'
import { setIsLoading, setShowForms } from '../../../redux/actions/global'


@autobind class CompromisosForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editMode: false
        }

        this.initialValues = {
            descripcion: "",
            activo: "",
            fechaRevision: "",
            fechaCumplimiento: "",
            responsable: "",
            minuta: "",
            notas: ""
        }

    }

    componentDidMount() {
        const { token, id } = this.props
        const headers = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'content-type': 'application/json',
            },
        }


        if(id){
            fetch('/api/compromiso/'+id, {
                headers,
                method: 'GET'
            })
                .then(r => r.json())
                .then((res) => {
                    this.initialValues = res;

                    this.setState({
                        editMode: true
                    })
                })
        }
    }

    isEmpty(val){
        return val === undefined || val === null || val === ""
    }

    validate(values){
        let errors = {};

        /*
        if(!values.asignacion){
            errors.asignacion = "Este campo no puede estar vacio"
        }
        */

        return errors;
    }



    onSubmit(values, actions ){
        let { setLoading, onUpdateData, id } = this.props
        setTimeout(() => {
            const { token, user } = this.props

            const headers = {
                'Authorization': `Bearer ${token}`,
            }

            const formData = new FormData()

            Object.entries(values).forEach(([key,value]) => {
                if(key == 'fechaRevision' || key == 'fechaCumplimiento'){
                    value = moment(value).format('YYYY-MM-DD');
                }
                formData.append(key, value);
            })

            if(id){
                fetch('/api/compromiso/' + id, {
                    headers,
                    method: 'PUT',
                    body: formData,
                })
                    .then(r => r.json())
                    .then((res) => {
                        if (res.success) {
                            setLoading({
                                isLoading: false,
                                showNotification: true,
                                notificationType: 'success',
                                notificationText: `Su información se ha guardado exitosamente`
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
            }else {
                fetch('/api/compromiso', {
                    headers,
                    method: 'POST',
                    body: formData,
                })
                    .then(r => r.json())
                    .then((res) => {
                        if (res.success) {
                            setLoading({
                                isLoading: false,
                                showNotification: true,
                                notificationType: 'success',
                                notificationText: `Su información se ha guardado exitosamente`
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
            }


            onUpdateData()
            actions.setSubmitting(false);
        }, 400);
    }


    render(){
        return(
            <div>
                <Formik
                    enableReinitialize
                    initialValues={this.initialValues}
                    validate={this.validate}
                    onSubmit={this.onSubmit}
                >
                    { ({touched, isSubmitting, errors, values}) => (
                        <Form>

                            <div className="responsable field">
                                <label>Responsable</label>
                                <Dropdown
                                    name="responsable"
                                    options={this.props.users.map( a => {return {value: a.id , label: a.username}} )}
                                />
                                {errors.responsable && touched.responsable && <div class="error">{errors.responsable}</div>}
                            </div>
                            <div className="activo field">
                                <label>Activo</label>
                                <Dropdown
                                    name="activo"
                                    options={this.props.activos.map( a => {return {value: a.ACTIVO_ID , label: a.ACTIVO_NAME}} )}
                                />
                                {errors.activo && touched.activo && <div class="error">{errors.activo}</div>}
                            </div>

                            <div className="fecha field">
                                <label>Fecha De Revision</label>
                                <DateInput name="fechaRevision"/>
                                {errors.fechaRevision && touched.fechaRevision && <div class="error">{errors.fechaRevision}</div>}
                            </div>

                            <div className="fecha field">
                                <label>Fecha De Cumplimiento</label>
                                <DateInput name="fechaCumplimiento"/>
                                {errors.fechaCumplimiento && touched.fechaCumplimiento && <div class="error">{errors.fechaCumplimiento}</div>}
                            </div>

                            <div className="minuta field">
                                <label>No. De Minuta</label>
                                <Field type="text" name="minuta" />
                                {errors.minuta && touched.minuta && <div class="error">{errors.minuta}</div>}
                            </div>

                            <div className="compromiso field">
                                <label>Compromiso</label>
                                <Field component="textarea" name="descripcion" />
                                {errors.descripcion && touched.descripcion && <div class="error">{errors.descripcion}</div>}
                            </div>

                            <div className="notas field">
                                <label>Notas</label>
                                <Field component="textarea" name="notas" />
                                {errors.notas && touched.notas && <div class="error">{errors.notas}</div>}
                            </div>

                            <div className="buttons-group">
                                <button className="cancel button" onClick={this.props.handleClose}>Cancelar</button>
                                <button className="submit button" type="submit">{this.state.editMode ? 'Editar' : 'Crear'}</button>
                            </div>

                            {Object.entries(errors).length > 0 && <div class="error">Esta forma contiene errores.</div>}
                        </Form>
                    )}
                </Formik>
                <Notification />
                <Loading />
            </div>
        )
    }
}

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
                    value={ props.options.find(i => i.value  === field.value) }
                    onChange={selectedOption => {
                        form.setFieldValue(props.name, selectedOption.value)
                    }}
                />
            )}
        </Field>
    )
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
                    isClearable={false}
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

const mapDispatchToProps = dispatch => ({
    setLoading: values => {dispatch(setIsLoading(values))},
})

const mapStateToProps = state => ({
    user: state.getIn(['user', 'id']),
    token: state.getIn(['user', 'token'])
})


export default connect(mapStateToProps, mapDispatchToProps)(CompromisosForm);
