// imports
import React, { Component } from 'react'
import autobind from 'autobind-decorator'
import InputsUI from './InputsUI/InputsUI'
import HomeUI from './HomeUI/HomeUI'

@autobind class Productspace extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
    }
  }

  componentDidMount() {
    let { } = this.props
  }

  render() {
    const onPage = this.props.onPage || 'sample_page'
    const { isLoading } = this.state
    // const uiControls = {
    //   sample_page: <SamplePage />,
    // }

    return (
      <div className="productspace">
        <InputsUI />
      </div>
    )
  }
}

export default Productspace
