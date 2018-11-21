import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import Slider from 'rc-slider'
import { setTimeSlider, setGeneralFilters } from '../../../../redux/actions/global'
import { fetchFilterData, buildFiltersOptions } from '../../../../lib/filters'
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

@autobind class timeSlider extends Component {
  constructor(props) {
    super(props)

    this.state = {
      lowDateState: null,
      highDateState: null
    }
  }

  async componentDidUpdate(prevProps) {
    let { globalAnalysis, setGeneralFilters, token, lowDate, highDate } = this.props
    const prevLowDate = prevProps.lowDate
    const prevHighDate = prevProps.highDate
    if (lowDate !== prevLowDate || highDate !== prevHighDate) {
      this.setState({
        lowDateState: this.props.lowDate,
        highDateState: this.props.highDate
      })
      const data = await fetchFilterData(token, globalAnalysis.toJS())
      const filterOptions = buildFiltersOptions(data)
      setGeneralFilters(filterOptions)
    }
  }

  async handleChange(value) {
    let { setSlider, token, globalAnalysis } = this.props
    this.setState({ test: true })
    const lowDate = value[0]
    const highDate = value[1]
    setSlider(lowDate, highDate)
    // const data = await fetchFilterData(token, globalAnalysis.toJS())
    // const filterOptions = buildFiltersOptions(data)
    // setGeneralFilters(filterOptions)
  }


  handleChangeState(value) {
    this.setState({
      lowDateState: value[0],
      highDateState: value[1]
    })
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

  componentDidMount() {
    let { lowDate, highDate } = this.props

    this.setState({
      lowDateState: lowDate,
      highDateState: highDate
    })
  }

  render() {
    let { minDate, maxDate, lowDate, highDate } = this.props
    let { lowDateState, highDateState } = this.state
    
    return (
      <div>
        <Range
          min={minDate}
          max={maxDate}
          value={[lowDateState, highDateState]}
          onChange={this.handleChangeState}
          onAfterChange={this.handleChange}
          tipFormatter={this.formatDate}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  token: state.getIn(['user', 'token']),
  globalAnalysis: state.get('globalAnalysis'),
  minDate: state.getIn(['globalAnalysis', 'minDate']),
  maxDate: state.getIn(['globalAnalysis', 'maxDate']),
  lowDate: state.getIn(['globalAnalysis', 'lowDate']),
  highDate: state.getIn(['globalAnalysis', 'highDate']),
})

const mapDispatchToProps = dispatch => ({
  setSlider: (lowDate, highDate) => dispatch(setTimeSlider(lowDate, highDate)),
  setGeneralFilters: (value) => dispatch(setGeneralFilters(value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(timeSlider)
