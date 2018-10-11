import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import HistoricoDeAforosResults from './HistoricoDeAforosResults' 
import EstimacionCostosResults from './EstimacionCostosResults'

import { setIsLoading, setShowForms } from '../../../../redux/actions/global'


const forms = [
  {'title' : 'Graph of Treatment', 'content': <div>Treatment Image Component</div> },
  {'title' : 'Aforos', 'content': <HistoricoDeAforosResults /> },
  {'title' : 'Real Treatment', 'content': <div>Treatment Component </div> },
  {'title' : 'Geometry', 'content': <div>Geometry Component </div> },
  {'title' : 'Real Costs', 'content': <EstimacionCostosResults /> }
]


@autobind class ResultsMultiStepForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0
    }
  }

  handleClick(i){
    this.setState({
      currentStep: i
    })
  }

  handleNextSubtab(){
    if(forms.length > this.state.currentStep + 1){
      this.setState({
        currentStep: this.state.currentStep + 1
      }) 
    }
  }

  handlePrevSubtab(){
    if( this.state.currentStep - 1 >= 0){
      this.setState({
        currentStep: this.state.currentStep - 1
      })
    }
  }


  render() {
    let { setShowForms, hasSubmitted, hasErrorsHistoricoDeAforosResults } = this.props
     let className = 'subtab'

   let errors = [false, hasErrorsHistoricoDeAforosResults, false, false, false, false]

     let title = forms[this.state.currentStep].title

     return (
         <div className={`multistep-form`}>
          <div className="subtabs">
              {forms.map( (tab, index) => {
                let active = this.state.currentStep === index ? 'active' : '';
                let error = errors[index]
                const errorClass = (error && hasSubmitted) ? 'error' : ''; 

                   return <div className={`${className} ${active} ${errorClass}`} onClick={() => this.handleClick(index)} key={index}><span></span> {tab.title} </div>
                 }
              )}
          </div>
          <div className="content">
            <div className="tab-title">
              <i className="far fa-caret-square-left" style={{position: 'relative', fontSize: '50px', left: '-20px', top: '7px', color: '#70AC46'}} onClick={(e) => setShowForms(false)}></i>
              { title }
              <button className="cta next" onClick={this.handleNextSubtab}>Siguiente</button>
              <button className="cta prev" onClick={this.handlePrevSubtab}>Anterior</button> 
            </div>

            {forms[this.state.currentStep].content}

          </div>
         </div>
     );
  }
}

const mapDispatchToProps = dispatch => ({
    setShowForms : values => { dispatch(setShowForms(values))},
})

const mapStateToProps = state => ({
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
  hasErrorsHistoricoDeAforosResults: state.getIn(['historicoDeAforosResults', 'hasErrors']),
})

export default connect(mapStateToProps, mapDispatchToProps)(ResultsMultiStepForm)

