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
        <div className='title'>
        </div>
        <div className="backdrop">
          <div className="background-image">
            <div className='head'>
              Pemex Exploracion y Produccion
            </div>
            <div className='sub-text'>
              Subdirección de Especialidad<br></br>
              Técnica de Explotación
            </div>

          </div>
          <div className="text">
            <div className="buttons">
              <LinkButton to="/inputs" text={'inserción de datos'} src={'./images/inputNew.png'}/>
              <LinkButton to="/" text={'tablero de control'} width='85px' src={'./images/analysisNew.png'} disabled={true}/>
              <LinkButton to="/" text={'diagnóstico de productividad'} width='105px' src={'./images/diagnosticsNew.png'} disabled={true}/>
              <LinkButton to="/" text={'seguimiento de compromisos'} height='90px' src={'./images/checklistNew.png'} disabled={true}/>
            </div>
            <div className="text-inner">
              Homologación de Procesos de Estimulación y Fracturamiento
              <br/>
              Coordinación de Productividad y Pozos
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
