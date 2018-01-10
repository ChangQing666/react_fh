import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from 'Actions'
import { SearchBar, List } from 'antd-mobile';
import HomeSearchBtn from '../components/homeSearchBtn'
import cookie from 'react-cookies'
import config from '../config/'
import 'Styles/searchPage.scss'
import {Tool} from "../utils";
import {track} from '../utils/track'

const ua = window.navigator.userAgent.toLowerCase();
const Item = List.Item
const { history } = config
class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchState: 0,
      focused: true
    };
    track()
  }

  async componentWillMount() {

    if (cookie.load('cityDefault')) {
      // 設置citydefault,cookie
      await this.props.actions.fetchCityList(cookie.load('cityDefault'))
    } else {
      await this.props.actions.fetchCityList()
      let itemHas = false
      const citylocation = new qq.maps.CityService();
      // 请求成功回调函数
      const that = this
      citylocation.setComplete(async function(result) {
        that.props.lineInfo.cityList.map( item => {
          if(item.cityName == result.detail.name.replace('市','')){
            // 設置citydefault
            that.props.actions.getCityDefault(item)
            cookie.save('cityDefault', item)
            itemHas = true
          }
        })
        if(!itemHas){
          // 定位失敗默認北京
          await that.props.actions.fetchCityList('北京')
        }
        // 獲取城市站點 ,線路
      });
      // 请求失败回调函数
      citylocation.setError(function () {
        // alert("地理位置获取失败！！！");
      });
      citylocation.searchLocalCity();
    }
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      Tool.wxShare({shareInfo: {
          title: '坐地铁，超近道，轻松一查就知道。',
          desc: '快速换乘、快速出站、找厕所、首末班时间，一键查询。',
          link: `https://bbh.jyall.com/searchPage?cityId=${this.props.lineInfo.cityDefault.id}`,
          imgUrl: 'https://bbh.jyall.com/assets/images/icon@3x.png'
        }})
    }
  }
  componentWillUnmount(){
    this.setState({
      focused: false
    })
  }
  searchClear = (event) => {
    this.props.actions.fetchAboutKeyWords()
  }

  onSearchChange = (value) => {
    this.setState({
      searchState: 1
    })
    this.props.actions.fetchAboutKeyWords(value)
  }
  selectSearchResult = (item) => {
    this.props.actions.getStationDefault(item)
    // this.props.actions.fetchStationDetail(item)
    // this.props.actions.selectSearchResults(item)
    // 等待數據同步
    this.props.actions.fetchAboutKeyWords()
    this.props.actions.changeTopBarStatus(1)
    history.push('/hourses/detail')
  }
  cancel = () => {
    this.props.actions.fetchAboutKeyWords()
    history.goBack()
  }
  render() {
    const listExtra = (item) =>{
      return item.lines.map((line,i) => {
        return (
          <div className="extraCircle" style={{backgroundColor:line.lineColor}}>
            {line.lineCode.slice(0,3)}
          </div>
        )
      })
    }

    const serchList = () => {
      if (this.props.homeInfo.fuzzy_station_list.length>0){
        return this.props.homeInfo.fuzzy_station_list.map((item, index) => {
          console.log(item)
          return (
            <Item onClick={() => this.selectSearchResult(item.stationName)} extra={listExtra(item)} key={item.id}>{item.stationName}</Item>
          )
        })
      }else {
        return ''
      }
    }

    const searcResult = () =>{
      if (this.state.searchState){
        if(this.props.homeInfo.fuzzy_station_list.length>0){
          return (
            <List>
              {serchList()}
            </List>
          )
        }else{
          return (
            <div className="noResult">
              <div className="noResultin">
                <img src={require('../assets/images/car@2x.png')} />
                <div>暂无车站信息</div>
              </div>
            </div>
          )
        }
      }else {
        return (
          <div>
            <HomeSearchBtn
              changeTopBarImageStatus={this.props.actions.changeTopBarImageStatus}
              changeTopBarStatus={this.props.actions.changeTopBarStatus}
              fetchCityStationsInfo={this.props.actions.fetchCityStationsInfo}
              fetchCityLinesInfo={this.props.actions.fetchCityLinesInfo}
              cityName={this.props.lineInfo.cityDefault?this.props.lineInfo.cityDefault.citySpell.toLowerCase():''}
            />
          </div>
        )
      }
    }
    return (
      <div className="searchPage">
        <SearchBar
          placeholder={'输入地铁站，换乘省时间'}
          onSubmit={value => console.log(value, 'onSubmit')}
          onClear={this.searchClear}
          showCancelButton
          cancelText={'取消'}
          onChange={this.onSearchChange}
          data-trackevtid="M_CJDCSLB_201712_AN_1_004"
          onCancel={this.cancel}
          maxLength={15}
          focused={this.state.focused}
          onFocus={() => {
            this.setState({
              focused: false
            });
            _btn_click('M_CJDCSLB_201712_AN_1_004');
          }}
        />
        {searcResult()}
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
)(SearchPage)