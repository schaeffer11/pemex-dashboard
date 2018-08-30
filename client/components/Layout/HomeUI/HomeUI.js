import React, { Component } from 'react'
import autobind from 'autobind-decorator'

const LinkButton = ({ text, disabled , src}) => {
  console.log(text)

    let className='link' 

    disabled ? className += ' disabled' : null
    return (
    <div className='link-button'>
    <img className='img' src={src}></img>
    <button className={className}>
        {text}
      </button>
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
    return (
      <div className="home">
        <div className='title'>
          <div className='head'>
            Pemex Exploracion y Produccion
          </div>
          <div className='sub-text'>
            Subdireccion de Especialidad<br></br>
            Tecnica de Explotacion
          </div>
        </div>
        <div className="backdrop">
          <div className="background-image">


          <div className="buttons">
            <LinkButton text={'insercion de datos'} src={'./images/input.png'}/>
            <LinkButton text={'tablero de control'} src={'./images/analysis.png'} disabled={true}/>
            <LinkButton text={'diagnostico de productividad'} src={'./images/diagnostics.png'} disabled={true}/>
            <LinkButton text={'seguimiento de compromisos'} src={'./images/checklist.png'} disabled={true}/>
          </div>

          </div>
          <div className="text">
            <div className="text-inner">
              Optimizar. Estandiarizar. Sustentar. Excelencia.
            </div>
          </div>
          <div className="footer">
          </div>
        </div>
      </div>
    )
  }
}


export default HomeUI
