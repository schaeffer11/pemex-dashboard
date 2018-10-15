import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import { setGeneralGraficaTratamiento } from '../../../../redux/actions/results'

@autobind class GraficaTratamiento extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: {}
    }
  }

  componentDidMount(){
  }

  componentDidUpdate(prevProps) {
  }

  handleFileUpload(e) {
    const { setGeneralGraficaTratamiento } = this.props
    let { files } = e.target
    let localImgUrl = window.URL.createObjectURL(files[0])
    setGeneralGraficaTratamiento(['imgURL'], localImgUrl)
  }

  render() {
    const { formData } = this.props
    const { imgURL } = formData
    return (
      <div style={{marginBot: '20px'}}>
        <div className='header'>
          Cargar gráfica de tratamiento
        </div>
        <input
          type='file'
          accept="image/*"
          onChange={(e) => this.handleFileUpload(e)}
        />
        {imgURL ? <img className='img-preview' src={imgURL} /> : null }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  formData: state.get('graficaTratamiento').toJS(),
  hasSubmitted: state.getIn(['global', 'hasSubmitted']),
})

const mapDispatchToProps = dispatch => ({
  setGeneralGraficaTratamiento: (location, value) => dispatch(setGeneralGraficaTratamiento(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(GraficaTratamiento)


