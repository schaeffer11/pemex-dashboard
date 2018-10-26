import React, { Component } from 'react'
import { elastic as Menu } from 'react-burger-menu'
import autobind from 'autobind-decorator'

@autobind class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state ={
      isOpen: false,
    }
  }

  render() {
    const { isOpen } = this.state
    return (
      <div>
        <button onClick={() => this.setState({ isOpen: true })}>burger</button>
        <Menu
          pageWrapId="page-wrap"
          isOpen={isOpen}
          left
          customBurgerIcon={false}
          onStateChange={(state) => !state.isOpen ? this.setState({ isOpen: false }) : null}
        >
          <h1>
            Welcome to the machine
          </h1>
        </Menu>
      </div>
    )
  }
}

export default Sidebar
