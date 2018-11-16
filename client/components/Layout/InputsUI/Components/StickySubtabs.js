import React, { Component } from 'react'
import autobind from 'autobind-decorator'

@autobind class StickySubtabs extends Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.subtabs = React.createRef();
    }

    componentDidMount() {
        this.pageWrap = document.querySelector("#page-wrap")
        this.pageWrap.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        this.pageWrap.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let parentOffset = this.subtabs.current.parentElement.offsetTop
        let tabRect  = this.subtabs.current.getBoundingClientRect()
        let relativeOffset = tabRect.top - parentOffset

        if( relativeOffset  <= 0 ){
            this.subtabs.current.classList.add("stick")
        }else {
            this.subtabs.current.classList.remove("stick")
        }
    }

    render() {
        return (
            <div ref={this.subtabs} className="subtabs">
                {this.props.children}
            </div>
        )
    }
}


export default StickySubtabs
