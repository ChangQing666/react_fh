import React, {Component} from 'react'
import config from '../config/'
import 'Styles/homeTop.scss'

const {history} = config
export default class HomeTop extends Component {
  constructor (props) {
    super(props);
    console.log('首页===',props)
  }

  render () {
    const {cityName} = this.props
      return <div className="homeTop">
        <div className="cityPosition" onClick={this.props.selectCity} data-trackevtid="M_CJDSY_201712_AN_1_001">
          <span>当前城市：</span>
          <em className="city-mark">{' ' + (cityName || '定位中')}</em>
        </div>
      </div>
  }
}