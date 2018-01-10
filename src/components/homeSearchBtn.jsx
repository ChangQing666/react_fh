import React, {Component} from 'react'
import config from '../config/'
import 'Styles/homeSearchBtn.scss'

const {history} = config
export default class
HomeSearchBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  stationsBtnHref = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    console.log('======',this.props);
    this.props.changeTopBarStatus(0)
    this.props.changeTopBarImageStatus(1)
    history.push('/hourses/lineIndex/followStations')
  }
  linesBtnHref = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    this.props.changeTopBarStatus(0)
    this.props.changeTopBarImageStatus(1)
    history.push('/hourses/lineIndex/followLines')
  }
  linesSubWay = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    location.href='http://map.baidu.com/mobile/webapp/subway/show/city='+this.props.cityName
  }

  render () {
    return (
      <div className="searchBtnWrapper">
        <div className="onStation" onClick={this.stationsBtnHref} data-trackevtid="M_CJDSY_201712_AN_1_003">
          <div className="itemWrapper">
            <div className="btnImage">
              <img src={require('../assets/images/onStation@2x.png')} />
            </div>
            <div className="btnText">
              查站点
            </div>
          </div>
        </div>
        <div className="onLine" onClick={this.linesBtnHref} data-trackevtid="M_CJDSY_201712_AN_1_004">
          <div className="itemWrapper">
            <div className="btnImage">
              <img src={require('../assets/images/xianlu@2x.png')} />
            </div>
            <div className="btnText">
              查线路
            </div>
          </div>
        </div>
        <div className="onSubWay" onClick={this.linesSubWay} data-trackevtid="M_CJDSY_201712_AN_1_006">
          <div className="itemWrapper">
            <div className="btnImage">
              <img src={require('../assets/images/ditiexianlu@2x.png')} />
            </div>
            <div className="btnText">
              查地图
            </div>
          </div>
        </div>
      </div>
    )
  }
}