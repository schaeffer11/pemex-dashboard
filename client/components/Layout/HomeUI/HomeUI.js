import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { Link, Redirect } from 'react-router-dom'

const LinkButton = ({ text, disabled , width, height, src, to}) => {
  console.log(text)

    let className='link'

    let style = {}

    height ? style.height= height : style.height = '80px'
    width ? style.width = width : style.width = '80px'


    disabled ? className += ' disabled' : null
    return (
    <div className='link-button'>
    <img className='img' style={style} src={src}></img>
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
        <div className="backdrop-title">
          <div className="background-image">
            <div className='head'>
              Pemex Exploración y Producción
            </div>
            <div className='sub-text'>
              Subdirección de Especialidad<br></br>
              Técnica de Explotación
            </div>
            <div className="sub-text-right">
              Gerencia de Producción
            </div>
          </div>
          <div className="text">
            <div className="buttons">
              <LinkButton to="/carga_datos" text={'inserción de datos'} src={'./images/inputNew-dark.png'}/>
              <LinkButton to="/tablero_control/resumen_general" text={'tablero de control'} height='90px' src={'./images/checklistNew-dark.png'} />
              <LinkButton to="/diagnosticos" text={'diagnóstico de productividad'} width='85px' src={'./images/analysisNew-dark.png'}/>
              <LinkButton to="/mapeo" text={'diagnóstico de mapeo'} width='85px' src={'./images/analysisNew-dark.png'}/>
              <LinkButton to="/compromisos" text={'seguimiento de compromisos'} width='105px' src={'./images/diagnosticsNew-dark.png'} />
            </div>
            <div className="text-inner">
              Homologación de Procesos de Estimulación y Fracturamiento
              <br/>
              Coordinación de Productividad de Pozos
            </div>
          </div>
          <div className="footer">
            <span className="left">Optimizar. Estandarizar. Sustentar. Excelencia.</span>

          </div>
        </div>
      </div>
    )
  }
}


export default HomeUI
