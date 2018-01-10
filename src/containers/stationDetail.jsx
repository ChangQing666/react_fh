import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from 'Actions'
import DetailCard from './detailCard'
import 'Styles/stationDetail.scss'
import {track} from '../utils/track'
import {Tool} from "../utils";
import cookie from 'react-cookies'

const ua = window.navigator.userAgent.toLowerCase();

class StationDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    track()
  }
  async componentWillMount(){
    this.props.actions.receiveTonggao(1)
    this.props.actions.changeTopBarStatus(1)

    // 获取城市\选中站点，
    let cityId = Tool.getUrlParam('cityId')
    let params = cityId.split('and')
    let theParam = params[0]
    let siteId = params[1]
    if(theParam||siteId){
      console.log('')
    }else{
      let lineId = this.props.params.name
      this.props.actions.getCityDefault(cookie.load('cityDefault'))
      this.props.actions.getStationDefault(cookie.load('siteDefault'))
      this.props.actions.fetchStationDetail(cookie.load('siteDefault'),'',lineId)
    }

    // this.props.actions.selectSearchResults(cookie.load('siteDefault'))

    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      var that = this
      var timer =setInterval(function () {
        if(that.props.lineInfo.stationDetail||theParam && that.props.lineInfo.cityDefault||siteId){
          let stationId = that.props.lineInfo.stationDetail.id||theParam
          let siteId = that.props.lineInfo.cityDefault.id||siteId
          Tool.wxShare({shareInfo: {
              title: `${that.props.lineInfo.siteDefault}(${that.props.lineInfo.cityDefault.cityName}-地铁站)站点详情都在这里呦`,
              desc: '快速出站、找厕所、首末班时间，地铁便民信息全知道',
              link: `https://bbh.jyall.com/hourses/detail?cityId=${stationId}and${siteId}${that.props.params.name?'and'+that.props.params.name:''}`,
              imgUrl: 'https://bbh.jyall.com/assets/images/icon@3x.png'
            }})
          clearInterval(timer)
        }
      },20)

    }
  }
  componentDidMount(){
  }
  render() {
    console.log('-----------again--------')
    const { stationDetail } = this.props.lineInfo
    const stationInfo = () => {
    if (stationDetail){

      return stationDetail.data.lineInfoGroup.map((item, index) => {
        switch (index) {
          case 0:
            var cardColor =  '#42ABF9';
            break;
          case 1:
            var cardColor =  '#8DD9BC';
            break;
          case 2:
            var cardColor =  '#FFD584';
            break;
          case 3:
            var cardColor =  '#B5ABF8';
            break;
          default:
            var cardColor =  '#B5ABF8';

        }
        return <DetailCard key={index} cardColor={cardColor} item={item} index={index} stationDetail={stationDetail}/>
      })
    }
    }
    const tonggao = () => {
      if(stationDetail){
        if(stationDetail.data.lineInfoGroup.length>2 && this.props.homeInfo.tonggaoStatus){
          return <div className="tonggao">选择地铁开往的方向，即可查看内容！</div>
        }else {
          return <div></div>
        }
      }
    }

    return (
      <div>
        {tonggao()}
        {stationInfo()}
        {stationDetail?
        <div className="findHourseCode">
          <img src={require("../assets/images/chaojindao@2.png")} alt=""/>
          <div>
            识别二维码，关注“超近道”公众号
          </div>
        </div>:''
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    lineInfo: state.lineInfo.toJS(),
    homeInfo: state.homeInfo.toJS()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(StationDetail)