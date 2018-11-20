import React, { Component } from 'react'
import { connect } from 'react-redux'
import autobind from 'autobind-decorator'
import objectPath from 'object-path'
import { Card as RSCard, CardBody, CardTitle, Button, ButtonGroup, Modal, ModalHeader, ModalBody, Tooltip, Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import classnames from 'classnames'

import RadioButtons from './RadioButtons'
import { setOptionValue } from '../../../../redux/actions/chartOptions'

const arraysAreEqual = (arr1, arr2) => {
  if (!arr1 || !arr2) {
    return false
  }
  
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i += 1) {
    if (!arr2.includes(arr1[i])) {
      return false
    }
  }
  return true
}

const replaceAll = function(str, search, replacement) {
    return str.split(search).join(replacement);
}

@autobind class Card extends Component {
  ///////////////////////
  // Lifecycle Methods //
  ///////////////////////

  constructor(props) {
    super(props)
    this.state = {
      showing: 0,
      modal: false,
      chartOptionsOpen: false,
      userOptionsOpen: false,
      userOptionsTooltip: false,
      chartOptionsTooltip: false,
      expandTooltip: false,
      groupProps: undefined,
    }

    this.selectedChild = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const prevGroups = prevProps.groups
    const { groups, selectedGrouping } = this.props
    const { groupProps } = this.state

    const hasGroups = groups && groups.length > 0 && selectedGrouping
    const groupsAreDifferent = !arraysAreEqual(prevGroups, groups)
    const groupPropsIsDefined = groupProps !== undefined
    if (hasGroups && (groupsAreDifferent || !groupPropsIsDefined)) {
      this.setState({ groupProps: groups[0] })
    }
  }

  /////////////////////
  // Retrieving Refs //
  /////////////////////

  getChartRef() {
    const innerComponent = this.selectedChild.current.getWrappedInstance
      ? this.selectedChild.current.getWrappedInstance()
      : this.selectedChild.current

    return objectPath.get(innerComponent, 'chart.chart')
  }

  /////////////////////
  // Handle Changes  //
  /////////////////////

  handleChildChange(e) {
    const { children } = this.props
    const { value } = e.target
    if (children) {
      this.setState({ showing: parseInt(value, 10) })
    }
  }

  handleModalToggle() {
    const { modal } = this.state
    this.setState({ modal: !modal })
  }

  handleTogglePopover() {
    this.setState(prevState => ({
        chartOptionsOpen: !prevState.chartOptionsOpen,
      }))
  }

  handleToggleUserPopover() {
    this.setState(prevState => ({
        userOptionsOpen: !prevState.userOptionsOpen,
      }))
  }


  handleCardExportTable(data) {
    let duplicate = []

    data.forEach(row => {
      let newRow = []
      for (var i in row) {
        newRow.push(`"` + row[i] + `"`)
      }
     
      duplicate.push(newRow)
    })

    duplicate.forEach(i => i.join(','))

   
    let dataString = duplicate.join("%0A");

    dataString = replaceAll(dataString, ' ', '%20')


    let a = document.createElement('a');
    a.href = 'data:attachment/csv,' + dataString;
    a.target = '_blank';
    a.download = 'exportData.csv';

    document.body.appendChild(a);
    a.click(); 

  }

  handleCardExport() {
    const chart = this.getChartRef()   

    if (chart) {
      chart.exportChartLocal({
        type: 'application/png',
      })
    } 
    else {
      console.log('Could not find a ReactHighcharts to export')
    }
  }

  handleGroupChangeChevron(direction) {
    const { groupProps } = this.state
    const { groups } = this.props
    const index = groups.indexOf(groupProps)
    let newIndex
    if (direction === 'right') {
      newIndex = index !== groups.length - 1 ? index + 1 : 0
    } else {
      newIndex = index !== 0 ? index - 1 : groups.length - 1
    }
    this.setState({ groupProps: groups[newIndex] })
  }

  handleGroupChangeDot(selectedDot) {
    const { groups } = this.props
    const index = groups.indexOf(selectedDot)
    this.setState({ groupProps: groups[index] })
  }

  ///////////////
  // Rendering //
  ///////////////

  renderChartOptions(chartOptions) {
    const { setOption } = this.props
    return chartOptions.map((option) => {
      if (option.type === 'radio') {
        const { chartOptionsValues, id } = this.props
        const allValues = chartOptionsValues.toJS()
        const selectedValue = allValues[id][option.name]
        return (
          <RadioButtons
            key={`${id}_${option.name}`}
            buttons={option.buttons}
            disabled={false}
            selectedButton={selectedValue}
            onRadioClick={button => setOption([id, option.name], button.value)}
          />
        )
      }
      return null
    })
  }

  renderPopover() {
    const { chartOptionsOpen } = this.state
    const { id, chartOptions } = this.props
    return (
      <div>
        <Popover
          placement="left"
          isOpen={chartOptionsOpen}
          target={`chart_options_${id}`}
          toggle={this.handleTogglePopover}
        >
          <PopoverHeader>
            Options
          </PopoverHeader>
          <PopoverBody>
            {this.renderChartOptions(chartOptions)}
          </PopoverBody>
        </Popover>
      </div>
    )
  }

  renderUserOptions() {
    const { userOptionsOpen, showing } = this.state
    const { id, children, isImage, isTable, isNotGraph } = this.props

    const viewing = Array.isArray(children) ? children[showing] : children

    return (
      <div>
        <Popover
          placement="top"
          isOpen={userOptionsOpen}
          target={`user_options_${id}`}
          toggle={this.handleToggleUserPopover}
        >
          <PopoverHeader>
            User Options
          </PopoverHeader>
          <PopoverBody>
            {isImage 
              ? <a href={viewing.props.src} target="_blank"><Button>Export</Button></a>
              : isTable 
                ? <Button onClick={e => this.handleCardExportTable(viewing.props.exportData)}>
                    Export
                  </Button>
                : isNotGraph 
                  ? null
                  :<Button onClick={this.handleCardExport}>
                    Export
                  </Button> }
          </PopoverBody>
        </Popover>
      </div>
    )
  }


  renderCarousel() {
    const { selectedGrouping, multiplyChartsOnGrouping, id, groups } = this.props
    const { groupProps } = this.state
    if (multiplyChartsOnGrouping && groups.length > 0 && selectedGrouping) {
      return (
        <div className="groupby_carousel">
          <button className="left" type="button" onClick={() => this.handleGroupChangeChevron('left')}>
{/*            <FontAwesomeIcon icon="chevron-left" />*/}
            <i className='fa fa-chevron-left'/>
          </button>
          <div className="center">
            {groups.map((group) => {
              const className = classnames({ selected: group === groupProps }, 'dot')
              return (
                <span
                  key={id + group}
                  className={className}
                  role="button"
                  tabIndex={0}
                  onClick={() => this.handleGroupChangeDot(group)}
                  onKeyPress={() => this.handleGroupChangeDot(group)}
                />
              )
            })}
            <h6>
              {`${selectedGrouping}: ${groupProps}`}
            </h6>
          </div>
          <button className="right" type="button" onClick={() => this.handleGroupChangeChevron('right')}>
{/*            <FontAwesomeIcon icon="chevron-right" />*/}
            <i className='fa fa-chevron-right'/>
          </button>
        </div>
      )
    }
    return null
  }

  renderChildren(viewing) {
    const { multiplyChartsOnGrouping, multipleData, isImage } = this.props
    const { groupProps } = this.state
    const childProps = {
      ...viewing.props,
      ref: this.selectedChild,
    }

    if (objectPath.has(childProps, 'data')) {
      if (childProps.data !== undefined) {
        if (multiplyChartsOnGrouping) {
          // FIXME: Hack - The below alternative bypasses the state of the component to render
          // data properly. This is probably not good practice.
          if (multipleData) {
            childProps.data = { ...viewing.props.data }
            // This means data is holding more than just one array
            Object.keys(childProps.data).forEach((dataKey) => {
              const innerObj = childProps.data[dataKey]
              if (typeof innerObj === 'undefined') { return }
              if (Object.keys(innerObj).indexOf(groupProps) > 0) {
                childProps.data[dataKey] = innerObj[groupProps]
              } else {
                childProps.data[dataKey] = innerObj[Object.keys(childProps.data[dataKey])[0]]
              }
            })
          } else if (Object.keys(childProps.data).indexOf(groupProps) > 0) {
            childProps.data = childProps.data[groupProps]
          } else {
            childProps.data = childProps.data[Object.keys(childProps.data)[0]]
          }
        }
      }
    }
    return React.cloneElement(viewing, childProps)
  }

  render() {
    const {
      chartOptionsOpen,
      chartOptionsTooltip,
      expandTooltip,
      modal,
      showing,
      userOptionsOpen,
      userOptionsTooltip,
    } = this.state
    const { title, id, chartOptions, isImage, isTable, width } = this.props

    let { children } = this.props
    // Only consider children that are react elements and cast result to array
    if (Array.isArray(children)) {
      children = children.filter(child => typeof child !== 'boolean')
    } else {
      children = [children]
    }
    const childrenButtons = Array.isArray(children)
      ? children.map((elem, index) => (
        <Button
          key={elem.props.label}
          onClick={this.handleChildChange}
          value={index}
          className={`option ${index === showing ? 'selected' : ''}`}
        >
          {elem.props.label}
        </Button>))
      : ''
    const viewing = Array.isArray(children) ? children[showing] : children
    const cardHasOptions = Array.isArray(chartOptions)

    let style = width ? {width: width} : isImage || isTable ? {width: '100%'} :  null 

    return (
      <div style={style}>
        <RSCard>
          <CardTitle>
            <span>
              {title}
            </span>
            <ButtonGroup className="float-right">
              {cardHasOptions && (
                <div>
                  <Button
                    disabled={!cardHasOptions}
                    id={`chart_options_${id}`}
                    onClick={this.handleTogglePopover}
                  >
{/*                    <FontAwesomeIcon icon="chart-bar" />*/}
                  </Button>
                  <Tooltip
                    placement="left"
                    target={`chart_options_${id}`}
                    delay={{ show: 300, hide: 100 }}
                    isOpen={chartOptionsTooltip && !chartOptionsOpen}
                    toggle={() => {
                      this.setState(prevState => ({
                        chartOptionsTooltip: !prevState.chartOptionsTooltip,
                      }))
                    }}
                  >
                    Chart Options
                  </Tooltip>
                </div>
              )}
              <div>
                <Button
                  id={`user_options_${id}`}
                  onClick={this.handleToggleUserPopover}
                >
                  <i class="fas fa-ellipsis-v"></i>
                </Button>
                <Tooltip
                  placement="top"
                  target={`user_options_${id}`}
                  delay={{ show: 300, hide: 100 }}
                  isOpen={userOptionsTooltip && !userOptionsOpen}
                  toggle={() => {
                    this.setState(prevState => ({
                      userOptionsTooltip: !prevState.userOptionsTooltip,
                    }))
                  }}
                >
                  User Options
                </Tooltip>
              </div>
              <Button id={`expand_${id}`} onClick={this.handleModalToggle}>
                <i class="fas fa-expand"></i>
              </Button>
              {cardHasOptions && this.renderPopover()}
              {this.renderUserOptions()}
            </ButtonGroup>
          </CardTitle>
          <CardBody>
            {this.renderCarousel()}
            <ButtonGroup>
              {children.length > 1 && childrenButtons}
            </ButtonGroup>
            {this.renderChildren(viewing)}
            <Tooltip
              placement="right"
              target={`expand_${id}`}
              delay={{ show: 300, hide: 100 }}
              isOpen={expandTooltip}
              toggle={() => this.setState({ expandTooltip: !expandTooltip })}
            >
              Expand
            </Tooltip>
          </CardBody>
          <Modal id="plot-blowup" isOpen={modal} toggle={this.handleModalToggle} centered>
            <ModalHeader toggle={this.handleModalToggle}>{title}</ModalHeader>
            <ModalBody>
              <div>
                {this.renderChildren(viewing)}
              </div>
            </ModalBody>
          </Modal>
        </RSCard>
      </div>
    )
  }
}

//////////////////////////
// React Redux Mapping  //
//////////////////////////

const mapStateToProps = state => ({
  chartOptionsValues: state.get('chartOptions'),
  selectedGrouping: state.getIn(['globalAnalysis', 'groupBy']),
  groups: state.getIn(['globalAnalysis', 'groups']).toJS().sort((a, b) => {
    if (b.toLowerCase() === 'undefined') { return -1 }
    if (a.toLowerCase() === 'undefined') { return 1 }
    if (a < b) { return -1 }
    if (a > b) { return 1 }
    return 0
  }),
})

const mapDispatchToProps = dispatch => ({
  setOption: (location, value) => dispatch(setOptionValue(location, value)),
})

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Card)