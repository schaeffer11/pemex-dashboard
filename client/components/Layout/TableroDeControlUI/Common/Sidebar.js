import React, { Component } from 'react'
import { connect } from 'react-redux'
import { slide as Menu } from 'react-burger-menu'
import Select from 'react-select'
import autobind from 'autobind-decorator'
import Filters from './Filters'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'


const getOptions = (key, arr) => arr.map((elem) => {
  const val = elem[key]
  return {
    label: val,
    value: val,
  }
})

@autobind class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state ={
      isOpen: false,
      fieldWellOptions: [],
    }
  }

  componentDidMount() {
    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }
    fetch('/api/getFieldWellMappingHasData', headers)
      .then(r => r.json())
      .then(r => {
        this.setState({
          fieldWellOptions: r
        })
    })

    fetch('/api/getTreatmentCompanies', headers)
      .then(r => r.json())
      .then(r => {
        // const companyOptions = r.map(({ COMPANIA }) => ({
        //   label: COMPANIA,
        //   value: COMPANIA
        // }))
        const companyOptions = getOptions('COMPANIA', r)
        this.setState({ companyOptions })
      })
    
    fetch('/api/getInterventionTypes', headers)
      .then(r => r.json())
      .then(r => {
        // const interventionTypes = getOptions('TIPO_DE_INTERVENCIONES', r)
        this.setState({ interventionOptions: getOptions('TIPO_DE_INTERVENCIONES', r) })
      })
  }

  render() {
    const { isOpen, fieldWellOptions, companyOptions, interventionOptions } = this.state
    const { company, setGeneral, interventionType } = this.props
    return (
      <div>
        <button className="bm-burger-button" onClick={() => this.setState({ isOpen: true })}><i className="fa fa-bars" /></button>
        <Menu
          isOpen={isOpen}
          right
          customBurgerIcon={false}
          onStateChange={(state) => !state.isOpen ? this.setState({ isOpen: false }) : null}
        >
          <Filters fieldWellOptions={fieldWellOptions} />
          <Select
	          value={company}
	          options={companyOptions}
	          onChange={c => setGeneral(['company'], c)}
	          isClearable = {true}
	        />
          <Select
	          value={interventionType}
	          options={interventionOptions}
	          onChange={c => setGeneral(['interventionType'], c)}
	          isClearable = {true}
	        />
        </Menu>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  company: state.getIn(['globalAnalysis', 'company']),
  interventionType: state.getIn(['globalAnalysis', 'interventionType']),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
