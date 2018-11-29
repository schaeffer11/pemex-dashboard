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


@autobind class CompleteCompromisoForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            compromiso: [],
            editMode: false
        }
        this.initialValues = {
            aciones: ""
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
            fetch('/api/compromiso/' + id, {
                headers,
                method: 'GET'
            })
                .then(r => r.json())
                .then((res) => {
                    this.setState({
                        compromiso: res,
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
                            <h2>Compromiso No.{this.state.compromiso.id}</h2>
                            <div className="field">
                                <div className="label">Fecha de Compromiso:</div>
                                <div>{moment(this.state.compromiso.fechaCompromiso).format('DD-MM-YYYY')}</div>
                            </div>
                            <div className="field">
                                <div className="label">Fecha de Cumplimiento:</div>
                                <div>{this.state.compromiso.fechaCumplimiento ? moment(this.state.compromiso.fechaCumplimiento).format('DD-MM-YYYY') : 'No disponible'}</div>
                            </div>
                            <div className="field">
                                <div className="label">Descripcion:</div>
                                <div>{this.state.compromiso.descripcion}</div>
                            </div>
                            <div className="field">
                                <div className="label">Activo:</div>
                                <div>{this.state.compromiso.nombreActivo}</div>
                            </div>
                            <div className="field">
                                <div className="label">Minuta: </div>
                                <div>{this.state.compromiso.minuta} </div>
                            </div>
                            <div className="field">
                                <div className="label">Notas: </div>
                                <div>{this.state.compromiso.notas} </div>
                            </div>

                            {/*
                            <div className="aciones field">
                                <label>Compromiso</label>
                                <Field component="textarea" name="aciones" />
                                {errors.aciones && touched.aciones && <div class="error">{errors.aciones}</div>}
                            </div>


                            <div className="buttons-group">
                                <button className="cancel button" onClick={this.props.handleClose}>Cancelar</button>
                                <button className="submit button" type="submit">Completar</button>
                            </div>


                            {Object.entries(errors).length > 0 && <div class="error">Esta forma contiene errores.</div>}
                            */}
                        </Form>
                    )}
                </Formik>
                <Notification />
                <Loading />
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setLoading: values => {dispatch(setIsLoading(values))},
})

const mapStateToProps = state => ({
    user: state.getIn(['user', 'id']),
    token: state.getIn(['user', 'token'])
})


export default connect(mapStateToProps, mapDispatchToProps)(CompleteCompromisoForm);
