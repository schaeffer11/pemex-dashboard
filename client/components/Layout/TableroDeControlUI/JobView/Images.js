import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighCharts from 'react-highcharts'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify'

import { KPI } from '../Common/KPIs'

@autobind class Images extends PureComponent {


    makeImages(data) {
      return Object.keys(data).map(i => {
        let src = data[i].imgURL

        if (true) {

        }

        return (<div style={{width: '100%'}}>
              <ReactImageMagnify {...{
                smallImage: {
                    src,
                    width: 200,
                    height: 200, 
                },
                largeImage: {
                    src,
                    width: 1000,
                    height: 1000,
                },
                enlargedImageContainerDimensions: {
                  width: '200%',
                  height: '100%'
                }
              }} />
            </div>)
      })
    }

  render() {
    let { data } = this.props

    console.log(data)
    var settings = {
        dots: true,
    }


    return (        
      <div className="images" style={{padding: '40px', background: 'grey', width: '100%'}}>
        <Slider {...settings}>
            {this.makeImages(data)}
        </Slider>
      </div>
    )
  }
}

export default Images

