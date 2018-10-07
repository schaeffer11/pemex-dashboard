import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { Link, Redirect } from 'react-router-dom'

import DiagnosticoForm from './DiagnosticoForm'


@autobind class DiagnosticosUI extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

    }


    render() {
        const { referer } = this.props.location.state || {}
        return (
            <div className="diagnostico">
                <DiagnosticoForm/>
            </div>
        )
    }
}


export default DiagnosticosUI
