import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { Link, Redirect } from 'react-router-dom'

const LinkButton = ({ text, disabled , src, to}) => {
  console.log(text)

    let className='link'

    disabled ? className += ' disabled' : null
    return (
    <div className='link-button'>
    <img className='img' src={src}></img>
    <Link to={to} className={className}>
        {text}
      </Link>
    </div>
    )
}



@autobind class HomeUI extends Component {
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
/*
    if(referrer){
      return <Redirect to={referrer} />
    }
*/
    return (
      <div className="home">
        <div className='title'>
          <div className='head'>
            Pemex Exploración y Producción
          </div>
          <div className='sub-text'>
            Subdirección de Especialidad<br></br>
            Técnica de Explotación
          </div>
        </div>
        <div className="backdrop">
          <div className="background-image">


          <div className="buttons">
            <LinkButton to="/inputs" text={'inserción de datos'} src={'./images/input.png'}/>
            <LinkButton to="/" text={'tablero de control'} src={'./images/analysis.png'} disabled={true}/>
            <LinkButton to="/" text={'diagnóstico de productividad'} src={'./images/diagnostics.png'} disabled={true}/>
            <LinkButton to="/" text={'seguimiento de compromisos'} src={'./images/checklist.png'} disabled={true}/>
          </div>

          </div>
          <div className="text">
            <div className="text-inner">
              Homologación de Procesos de Estimulación y Fracturamiento
            </div>
          </div>
          <div className="footer">
            <span className="left">Optimizar. Estandiarizar. Sustentar. Excelencia.</span>
            <span className="right">Gerencia de Producción <br/> Productividad de Pozos</span>
          </div>
        </div>
      </div>
    )
  }
}


export default HomeUI
