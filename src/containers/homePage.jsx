import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../redux/actions/'
import cookie from 'react-cookies'
import HomeTop from '../components/homeTop'
import Point from '../components/point'
import HomeSearchBtn from '../components/homeSearchBtn'
import { Tool } from '../utils/'
import config from '../config/'
import {track} from '../utils/track'
import 'Styles/homePage.scss'
require('../assets/images/icon@3x.png')

const ua = window.navigator.userAgent.toLowerCase();
const { history } = config

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchState: 0,
      cityStatus: 0,
      pointMark:false,
      shareInfo: {
        title: '坐地铁，超近道，轻松一查就知道。',
        desc: '快速换乘、快速出站、找厕所、首末班时间，一键查询。',
        link: 'https://bbh.jyall.com/line',
        imgUrl: 'https://bbh.jyall.com/assets/images/icon@3x.png'
      }
    }
    let metaEl = document.getElementsByTagName('meta');
    metaEl[0].content = this.state.shareInfo.title;
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      Tool.wxShare(this.state)
    }
    if (this.props.homeInfo.prevUrl !== '/hourses/cities') {
      cookie.save('cityDefault', '')
    }
  }
  componentWillMount () {
    if (cookie.load('cityDefault')) {
      // citydefault,cookie
      this.props.actions.fetchCityList(cookie.load('cityDefault'))
    } else {
      this.props.actions.fetchCityList()
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
      const citylocation = new qq.maps.CityService();
      // 请求成功回调函数

      citylocation.setComplete(function(result) {

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
          // 定位失敗默認北京
           that.props.actions.fetchCityList('北京')
        }
        // 獲取城市站點 ,線路
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
  yongjidu = ()=>{
    window.location.href = 'http://map.bjsubway.com:8080/subwaymap2/public/mobile'
  }
  searchPage = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    history.push('/searchPage')
  }

  selectCity = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    const PathName = this.props.location.pathname
    this.props.actions.receivePrevUrl(PathName)
    this.props.actions.changeTopBarStatus(0)
    this.props.actions.changeTopBarImageStatus(0)
    history.push('/hourses/cities')

  }
  maidian= (e) => {
    e.nativeEvent.stopImmediatePropagation()
  }
  pointClose = () =>{
    this.setState({
      pointMark:false
    })
  }
  pointShow = () =>{
    this.setState({
      pointMark:true
    })
  }
  render () {
    const { cityDefault } = this.props.lineInfo

    // if(!cookie.load('wxlogin') && ua.match(/MicroMessenger/i) == 'micromessenger'){
    //   console.log('wxlogin')
    //   return (<div></div>)
    // }else{
      return (
        <div className="homePage">
          {this.state.pointMark?<Point pointClose={this.pointClose}/>:''}
          <HomeTop
            cityName={this.props.lineInfo.cityDefault.cityName}
            searchState = {this.state.searchState}
            changeTopBarStatus = {this.props.actions.changeTopBarStatus}
            changeTopBarImageStatus={this.props.actions.changeTopBarImageStatus}
            selectCity={this.selectCity}
          />
          <div className="homeBody">
            <div className="hb-main">
              <div className="hb_body">
                <div className="logo">
                  <div className="point" onClick={this.pointShow}>小提示</div>
                </div>
                <div className="searchWrapper">
                  <div className="homeSearch" onClick={this.searchPage} data-trackevtid="M_CJDSY_201712_AN_1_002">
                    <img src={require('../assets/images/search_orange@2x.png')} />
                    输入地铁站，换乘省时间
                  </div>
                  <HomeSearchBtn
                    changeTopBarStatus={this.props.actions.changeTopBarStatus}
                    changeTopBarImageStatus={this.props.actions.changeTopBarImageStatus}
                    fetchCityStationsInfo={this.props.actions.fetchCityStationsInfo}
                    fetchCityLinesInfo={this.props.actions.fetchCityLinesInfo}
                    cityName={this.props.lineInfo.cityDefault?cityDefault.citySpell.toLowerCase():''}
                  />
                  {this.props.lineInfo.cityDefault.cityName==="北京"?
                    <div className="yongjdu" onClick={this.yongjidu}>
                      <div className="left">
                        <img src={require('../assets/images/yongjidu@2x.png')} />
                      </div>
                      <div className="mid" onClick={this.maidian} data-trackevtid="M_CJDSY_201712_AN_1_007">
                        拥挤度查询
                      </div>
                      <div className="right">
                        <img src={require('../assets/images/xiangyou@2x.png')} />
                      </div>
                    </div>
                    :''}
                </div>
              </div>

            </div>
          </div>
        </div>

      );
    // }
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
)(HomePage)
