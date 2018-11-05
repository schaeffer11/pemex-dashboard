import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'

import Filters from '../Common/Filters'
import Card from '../Common/Card'
import { CardDeck } from 'reactstrap';
import CostBar from './CostBar'
import AforosScatter from './AforosScatter'
import VolumeLine from './VolumeLine'

@autobind class timeSeriesUI extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      fieldWellOptions: [],
      costData: [],
      aforosData: [],
      volumeData: []
    }
    this.cards = []
    for (let i = 0; i < 3; i += 1) {
      this.cards.push(React.createRef())
    }
  }

  async fetchData() {
    let { globalAnalysis } = this.props
    globalAnalysis = globalAnalysis.toJS()
    let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy } = globalAnalysis

    const { token } = this.props
    const headers = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json',
      },
    }


    let params = []
    let query

    subdir ? params.push(`subdir=${subdir}`) : null
    activo ? params.push(`activo=${activo}`) : null
    field ? params.push(`field=${field}`) : null
    well ? params.push(`activo=${activo}`) : null
    formation ? params.push(`formation=${formation}`) : null
    company ? params.push(`company=${company}`) : null
    tipoDeIntervencion ? params.push(`tipoDeIntervencion=${tipoDeIntervencion}`) : null
    tipoDeTerminacion ? params.push(`tipoDeTerminacion=${tipoDeTerminacion}`) : null
    groupBy ? params.push(`groupBy=${groupBy}`) : null



    let fieldWellOptionsQuery = `/api/getFieldWellMappingHasData`
    let costQuery = `/timeSeries/costData?` + params.join('&')
    let aforosQuery = `/timeSeries/aforosData?` + params.join('&')
    let volumesQuery = `/timeSeries/volumeData?` + params.join('&')


    const data = await Promise.all([
      fetch(fieldWellOptionsQuery, headers).then(r => r.json()),
      fetch(costQuery, headers).then(r => r.json()),
      fetch(aforosQuery, headers).then(r => r.json()),
      fetch(volumesQuery, headers).then(r => r.json()),
    ])
      .catch(error => {
        console.log('err', error)
      })

    console.log(data)

    let newState = {
      fieldWellOptions: data[0],
      costData: data[1],
      aforosData: data[2],
      volumeData: data[3],
    }

    this.setState(newState)
  }

  componentDidMount() {
  	this.fetchData()
  }

  componentDidUpdate(prevProps) {
    let { globalAnalysis } = this.props
    let prev = prevProps.globalAnalysis

    globalAnalysis = globalAnalysis.toJS()
    prev = prev.toJS()

    let { subdir, activo, field, well, formation, company, tipoDeIntervencion, tipoDeTerminacion, groupBy } = globalAnalysis

    if (activo !== prev.activo || field !== prev.field || well !== prev.well || formation !== prev.formation ||
      company !== prev.company || tipoDeIntervencion !== prev.tipoDeIntervencion || tipoDeTerminacion !== prev.tipoDeTerminacion ||
      groupBy !== prev.groupBy) {
      this.fetchData()  
    }
  }


  render() {
    let { fieldWellOptions, costData, aforosData, volumeData } = this.state

    return (
      <div className="data statistics">
        <div className='content'>
          <CardDeck className="content-deck">
            <Card
                id="costs"
                title="Costs"
                ref={this.cards[0]}
              >
              <CostBar data={costData} />
            </Card>
              <Card
                id="aforos"
                title="Production"
                ref={this.cards[1]}
              >
              <AforosScatter  data={aforosData} />
            </Card>
              <Card
                id="volume"
                title="Volume Usage"
                ref={this.cards[2]}
              >
              <VolumeLine data={volumeData} />
            </Card>
          </CardDeck>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  globalAnalysis: state.get('globalAnalysis'),
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(timeSeriesUI)
