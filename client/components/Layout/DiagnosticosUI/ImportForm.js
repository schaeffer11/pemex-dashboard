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


@autobind class ImportForm extends Component {
    constructor(props) {
        super(props)
        this.initialValues = {
            diagnostico: null
        }
    }


    validate(values){
        let errors = {};

        return errors;
    }

    onSubmit(values, actions ){
        let { setLoading, select } = this.props
        setTimeout(() => {

            select(values.diagnostico)

        }, 400);
    }

    cancel(e){
        this.props.closeImportModal()
        e.preventDefault()
        return false
    }

    render(){
        return(
            <div>
                <Formik
                    initialValues={this.initialValues}
                    validate={this.validate}
                    onSubmit={this.onSubmit}
                >
                    { ({touched, isSubmitting, errors, values, form}) => (
                        <Form>

                            <div className="diagnostico-list">
                                {this.props.diagnosticos.map(diagnostico => (
                                    <Field
                                        name={diagnostico.ID}
                                        render={({ field, form }) => (
                                            <div key={diagnostico.ID}>
                                                <label>
                                                    <input
                                                        name="diagnostico"
                                                        type="radio"
                                                        value={diagnostico.ID}
                                                        checked={values.diagnostico == diagnostico.ID}
                                                        onChange={e => {
                                                            if (e.target.checked) form.setFieldValue('diagnostico', diagnostico.ID);
                                                        }}
                                                    />{" "}
                                                    <span>{diagnostico.asignacion} - {moment(diagnostico.fechaRevision).format('DD/MM/YYYY')}</span>
                                                </label>
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>

                            <div className="button-group">
                                <button className="cancel button" type="submit" onClick={this.cancel}>
                                    Cancelar
                                </button>

                                <button className="submit button" type="submit">
                                    Importar
                                </button>
                            </div>

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


export default connect(mapStateToProps, mapDispatchToProps)(ImportForm);
