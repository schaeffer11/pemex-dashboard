import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import WellSelect from '../Common/WellSelect'
import ProductionGraph from './ProductionGraph'
import PressureGraph from './PressureGraph'
import AforosGraph from './AforosGraph'
import KPIFichaTecnica from './KPIFichaTecnica'
import KPIMecanico from './KPIMecanico'
import Images from './Images'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import { generatePowerPoint } from '../../../../pptx';

@autobind class wellViewUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      wellData: [],
      zoneData: [],
      layerData: [],
      productionData: [],
      pressureData: [],
      aforosData: [],
      imageData: [],
      interventionDates: [],
    }
    this.cards = []
    for (let i = 0; i < 5; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  fetchData() {
  	console.log('fetching')
    let { globalAnalysis } = this.props
    let { well } = globalAnalysis

    //TODO MAKE PARALLEL
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

    if (well) {
      fetch(`/well/previousTransaction`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            well
          })
        })
      .then(res => res.json())
      .then(res => {
        console.log(res, res.success)
        if (!res.success !== false) {
          console.log('madeit')
          let transactionID = res[0].TRANSACTION_ID

          console.log(transactionID)

          fetch(`/well/wellData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              wellData: res
            })
          })

          fetch(`/well/zoneData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              zoneData: res
            })
          })

          fetch(`/well/layerData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              layerData: res
            })
          })

          fetch(`/well/productionData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              productionData: res
            })
          })

          fetch(`/well/pressureData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              pressureData: res
            })
          })

          fetch(`/well/aforosData`, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              transactionID
            })
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              aforosData: res
            })
          })

          fetch(`/api/getWellImages?transactionID=${transactionID}`, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              imageData: res
            })
          })

          fetch(`/well/getInterventionDates?wellID=${well}`, {
            headers: {
              'content-type': 'application/json',
            },
          })
          .then(res => res.json())
          .then(res => {
            this.setState({
              interventionDates: res
            })
          })

        }
      })     
    }
  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prevGlobalAnalysis = prevProps.globalAnalysis


		let { well } = globalAnalysis
    let wellPrev = prevGlobalAnalysis.well

    if (well !== wellPrev) {
			this.fetchData()	
		}
  }

    makeImages() {
      let { imageData } = this.state

      if (imageData && Object.keys(imageData).length > 0) {
        return Object.keys(imageData).map(i => {
          let obj = imageData[i]
          return <img style={{objectFit: 'contain'}} label={obj.imgName.split('.')[1]} src={obj.imgURL}></img> 
        })
      }
      else {
        return <div></div>
      }
    } 

  render() {
    let { fieldWellOptions, wellData, zoneData, layerData, productionData, pressureData , aforosData, imageData, interventionDates } = this.state
    const { token, globalAnalysis } = this.props
    // console.log('well', wellData)
    // console.log('zone', zoneData)
    // console.log('layer', layerData)
    // console.log('production', productionData)
    // console.log('pressure', pressureData)
    // console.log('aforos', aforosData)
    // console.log('images', imageData, imageData)
    // console.log('interventionDates', interventionDates)

    return (
      <div className="data well-view">
        <div className='header'>
          <WellSelect fieldWellOptions={fieldWellOptions}/>
        </div>
        <div className='content'>
          <CardDeck className="content-deck">
            <Card
                id="kpis"
                title="KPIs"
                ref={this.cards[0]}
                isTable={true}
              >
                <KPIFichaTecnica label='Ficha Tecnica' data={wellData} />
                <KPIMecanico label='Mecanico Data' data={wellData} />
            </Card>
            <Card
                id="production"
                title="Productions"
                ref={this.cards[1]}
              >
               <ProductionGraph data={productionData} />
            </Card>
            <Card
                id="pressure"
                title="Pressure"
                ref={this.cards[2]}
              >
               <PressureGraph data={pressureData} />
            </Card>
            <Card
                id="aforos"
                title="Aforos"
                ref={this.cards[3]}
              >
               <AforosGraph data={aforosData} dates={interventionDates}/>
            </Card>
            <Card
                id="images"
                title="Images"
                ref={this.cards[4]}
                isImage={true}
              >
              {this.makeImages()}
            </Card>
          </CardDeck>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  globalAnalysis: state.get('globalAnalysis').toJS(),
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(wellViewUI)