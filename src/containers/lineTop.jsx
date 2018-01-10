import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../redux/actions/'
import 'Styles/line'
import { Tool } from '../utils/'
import config from '../config/'
import cookie from 'react-cookies'
import { MapLine } from '../components/'
import LineTopBar from '../components/lineTopBar'
import 'Styles/lineTop'
import DetailSearchPage from '../containers/detailSearchPage'
import {track} from "../utils/track";
import Point from '../components/point'

const ua = window.navigator.userAgent.toLowerCase();
const { history } = config
/*window.onresize = function(){
  window.innerHeight
  //alert(window.innerHeight)
}*/
class LineTop extends Component {
  constructor(props) {
    super(props);
    track()
    this.state = {
      shareCityId: '',
      pointMark:false
    }
  }
  pointClose = () =>{
    this.setState({
      pointMark:false
    })
    document.getElementsByClassName("lineBody")[0].style.height = 'initial'
    document.getElementsByClassName("lineBody")[0].style.overflow = 'initial'
  }
  pointShow = () =>{
    this.setState({
      pointMark:true
    })
    document.getElementsByClassName("lineBody")[0].style.height = window.innerHeight - 50 + 'px'
    document.getElementsByClassName("lineBody")[0].style.overflow = 'hidden'
  }
  componentWillMount(){
    let pathName = this.props.pathname
  }
  async componentDidMount () {
      let cityId = Tool.getUrlParam('cityId')
      let params = cityId.split('and')
      let theParam = params[0]
      let siteId = params[1]
      let lineId = params[2]
      // 如果从分享详情进入
    if(theParam && siteId){
      // 城市详情
      await this.props.actions.fetchStationDetailMongoId(theParam,lineId)
      if(this.props.lineInfo.stationDetail){
        this.props.actions.getStationDefault(this.props.lineInfo.stationDetail.stationName)
        // this.props.actions.selectSearchResults(this.props.lineInfo.stationDetail.stationName)
      }
      this.setState({
        shareCityId: siteId
      })
      console.log(this.state.shareCityId)
    }else{
        this.props.actions.fetchCityList()
        // 请求成功回调函数
        const that = this
        let latitude,longitude,accuracy
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          wx.ready(function () {
            wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                  latitude = parseFloat(res.latitude); // 纬度，浮点数，范围为90 ~ -90
                  longitude = parseFloat(res.longitude); // 经度，浮点数，范围为180 ~ -180。
                  accuracy = res.accuracy; // 位置精度
                  that.Location(latitude,longitude)
              },
              fail:function(){
                that.Location()
              }
            });
          })
        }else{
          this.Location()
        }
      }
  }
  Location = (latitude,longitude) =>{
      const that = this
      let itemHas = false
      let _cityName

      let cityId = Tool.getUrlParam('cityId')
      let params = cityId.split('and')
      let theParam = params[0]
      let siteId = params[1]

      const citylocation = new qq.maps.CityService();
      // 请求成功回调函数
      
      citylocation.setComplete(function(result) {
          // 如果有参数重新定位
        if(theParam){
          that.props.lineInfo.cityList.map( item => {
          if(!latitude){
            _cityName = result.detail.name.replace('市','')
          }else{
            _cityName = result.detail.detail.split(",")[1].replace('市','')
          }
          //console.log(item.cityName,_cityName);
          if(item.cityName == _cityName){
              // 設置citydefault
              that.props.actions.getCityDefault(item)
              cookie.save('cityDefault', item)
              itemHas = true
            }
          })
          if(!itemHas){
            // 定位失败默认
            that.props.actions.fetchCityList('北京')
          }
        }
        // 获取城市站点线路
        if(cookie.load('cityDefault')){
          that.props.actions.getCityDefault(cookie.load('cityDefault'))
        }
        that.props.actions.fetchCityLinesInfo()
        that.props.actions.fetchCityStationsInfo()
      });

      // 请求失败回调函数
      citylocation.setError(function () {
        that.props.actions.fetchCityList('定位失败')
        // alert("地理位置获取失败！！！");
      });
      if(!latitude){
        citylocation.searchLocalCity();
      }else{
        const latLng = new qq.maps.LatLng(latitude, longitude);
        citylocation.searchCityByLatLng(latLng)
      }
  }
  componentWillUnmount(){
    this.props.actions.changeTopBarStatus(1)
    this.props.actions.changeDetailSearch(0)
    this.props.actions.changeTopBarImageStatus(0)
  }
  render () {
    if(this.props.lineInfo){
      const { cityDefault, siteDefault, cityList } = this.props.lineInfo
      const PathName = this.props.location.pathname
      const detailSearchState =() =>{
        if (this.props.homeInfo.detailSearch){
          return (
            <DetailSearchPage shareCityId={this.state.shareCityId}/>
          )
        }else {
          return ''
        }
      }
      return (
        <div className="route-div" id="route_div">
          <LineTopBar
            topBarImageStatus={cookie.load('topBarImageStatus')||1}
            lineTopBarStatus={cookie.load('lineTopBarStatus')||1}
            selectSearchResult={siteDefault}
            cityName={cityDefault.cityName}
            cityList = {cityList}
            changeTopBarStatus={this.props.actions.changeTopBarStatus}
            changeTopBarImageStatus={this.props.actions.changeTopBarImageStatus}
            cityName_citySpell={this.props.lineInfo.cityDefault?cityDefault.citySpell.toLowerCase():''}
            changeDetailSearch = {this.props.actions.changeDetailSearch}
            PathName={PathName}
            receivePrevUrl = {this.props.actions.receivePrevUrl}
            prevUrl = {this.props.homeInfo.prevUrl}
          />
          <div className="lineBody" style={{'WebkitOverflowScrolling':'touch'}}>
            {this.props.children}
          </div>
          {detailSearchState()}
          {Number(cookie.load('lineTopBarStatus')||1)?<div className="littlePoint" onClick={this.pointShow}>小提示</div>:''}
          {this.state.pointMark?<Point pointClose={this.pointClose}/>:''}
        </div>
      )
    }else{
      return <div></div>
    }
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
)(LineTop)
