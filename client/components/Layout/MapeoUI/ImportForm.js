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
            compromiso: null
        }
    }


    validate(values){
        let errors = {};

        return errors;
    }

    onSubmit(values, actions ){
        let { setLoading, select } = this.props
        setTimeout(() => {
            console.log(values.compromiso)

            select(values.compromiso)

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
                                {this.props.compromisos.map(compromiso => (
                                    <Field
                                        name={compromiso.ID}
                                        render={({ field, form }) => (
                                            <div key={compromiso.ID}>
                                                <label>
                                                    <input
                                                        name="diagnostico"
                                                        type="radio"
                                                        value={diagnostico.ID}
                                                        checked={values.compromiso == compromiso.ID}
                                                        onChange={e => {
                                                            if (e.target.checked) form.setFieldValue('compromiso', compromiso.ID);
                                                        }}
                                                    />{" "}
                                                    <span>{compromiso.asignacion} - {moment(compromiso.fechaRevision).format('DD/MM/YYYY')}</span>
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
