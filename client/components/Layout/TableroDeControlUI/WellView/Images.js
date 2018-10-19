import React, { PureComponent } from 'react'
import autobind from 'autobind-decorator'
import ReactHighCharts from 'react-highcharts'
import Slider from 'react-slick'
import ReactImageMagnify from 'react-image-magnify'

import { KPI } from '../Common/KPIs'

@autobind class Images extends PureComponent {

  render() {
    let { data } = this.props

    console.log(data)
    var settings = {
        dots: true,
    }

    return (        
      <div className="images" style={{padding: '40px', background: 'grey', width: '800px'}}>
        <Slider {...settings}>
            <div style={{width: '100%'}}>
                <img width='200' src='https://img-new.cgtrader.com/items/718625/510c3f7c86/large/old-stone-well-model-3d-model-low-poly-max-obj-3ds-fbx-c4d-ma-mb.jpg'/>
            </div>
            <div style={{width: '100%'}}>
              <ReactImageMagnify {...{
                smallImage: {
                    src: 'https://img-new.cgtrader.com/items/718625/510c3f7c86/large/old-stone-well-model-3d-model-low-poly-max-obj-3ds-fbx-c4d-ma-mb.jpg',
                    width: 200,
                    height: 200, 
                },
                largeImage: {
                    src: 'https://img-new.cgtrader.com/items/718625/510c3f7c86/large/old-stone-well-model-3d-model-low-poly-max-obj-3ds-fbx-c4d-ma-mb.jpg',
                    width: 1200,
                    height: 1200,
                }
              }} />
            </div>
            <div style={{width: '100%'}}>
                Third IMAGE
            </div>
            <div style={{width: '100%'}}>
                Fourth IMAGE
            </div>
        </Slider>
      </div>
    )
  }
}

export default Images

