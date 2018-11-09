import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import { setGeneralGlobalAnalysis } from '../../../../redux/actions/global'
import Slider from 'rc-slider'
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import 'rc-slider/assets/index.css';

@autobind class timeSlider extends Component {
  constructor(props) {
    super(props)
  }

  handleChange(value) {
    let { setGeneral } = this.props

    setGeneral(['lowDate'], value[0])
    setGeneral(['highDate'], value[1]) 
  }

  formatDate(value) {
    let year = Math.floor((value - 1) / 12)
    let month = value % 12

    switch (month) {
      case 1:
        month = 'Jan'
        break
      case 2:
        month = 'Feb'
        break
      case 3:
        month = 'Mar'
        break
      case 4:
        month = 'Apr'
        break
      case 5:
        month = 'May'
        break
      case 6:
        month = 'Jun'
        break
      case 7:
        month = 'Jul'
        break
      case 8:
        month = 'Aug'
        break
      case 9:
        month = 'Sep'
        break
      case 10:
        month = 'Oct'
        break
      case 11:
        month = 'Nov'
        break
      case 0:
        month = 'Dec'  
        break
    }

    return `${month} ${year}`
  }

  render() {
    let { minDate, maxDate, lowDate, highDate } = this.props

    return (
      <div>
        <Range
          min={minDate}
          max={maxDate}
          defaultValue={[lowDate, highDate]}
          onAfterChange={this.handleChange}
          tipFormatter={this.formatDate}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  minDate: state.getIn(['globalAnalysis', 'minDate']),
  maxDate: state.getIn(['globalAnalysis', 'maxDate']),
  lowDate: state.getIn(['globalAnalysis', 'lowDate']),
  highDate: state.getIn(['globalAnalysis', 'highDate']),
})

const mapDispatchToProps = dispatch => ({
  setGeneral: (location, value) => dispatch(setGeneralGlobalAnalysis(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(timeSlider)
