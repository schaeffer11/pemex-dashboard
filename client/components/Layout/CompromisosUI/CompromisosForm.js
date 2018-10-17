import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import DatePicker from 'react-datepicker'
import MaskedTextInput from "react-text-mask";
import moment from 'moment'
import { connect } from 'react-redux'
import Notification from '../Common/Notification'
import Loading from '../Common/Loading'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { setIsLoading, setShowForms } from '../../../redux/actions/global'


@autobind class CompromisosForm extends Component {
    constructor(props) {
        super(props)
        this.initialValues = {
            descripcion: "",
            activo: "",
            fechaRevision: "",
            responsable: "",
            minuta: ""
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
        let { setLoading, updateData } = this.props
        setTimeout(() => {
            const { token, user } = this.props

            const headers = {
                'Authorization': `Bearer ${token}`,
            }

            const formData = new FormData()

            Object.entries(values).forEach(([key,value]) => {
                formData.append(key, value);
            })

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

            updateData()
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
                            <div className="title">Nuevo Compromiso</div>

                            <div className="responsable field">
                                <label>Responsable</label>
                                <Field component="select" name="responsable">
                                    {this.props.users.map(user => {
                                        return <option value={user.id}>{user.username}</option>
                                    })}
                                </Field>
                                {errors.responsable && touched.responsable && <div class="error">{errors.responsable}</div>}
                            </div>
                            <div className="activo field">
                                <label>Activo</label>
                                <Field component="select" name="activo">
                                    {this.props.activos.map(activo => {
                                        return <option value={activo.ACTIVO_ID}>{activo.ACTIVO_NAME}</option>
                                    })}
                                </Field>
                                {errors.activo && touched.activo && <div class="error">{errors.activo}</div>}
                            </div>
                            <div className="compromiso field">
                                <label>Compromiso</label>
                                <Field component="textarea" name="descripcion" />
                                {errors.descripcion && touched.descripcion && <div class="error">{errors.descripcion}</div>}
                            </div>
                            <div className="fecha field">
                                <label>Fecha</label>
                                <DateInput name="fechaRevision"/>
                                {errors.fechaRevision && touched.fechaRevision && <div class="error">{errors.fechaRevision}</div>}
                            </div>
                            <div className="minuta field">
                                <label>No. De Minuta</label>
                                <Field type="text" name="minuta" />
                                {errors.minuta && touched.minuta && <div class="error">{errors.minuta}</div>}
                            </div>

                            <button className="submit button" type="submit">
                                Enviar
                            </button>

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
