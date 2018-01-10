import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from 'Actions'
import { SearchBar, List } from 'antd-mobile';
import config from '../config/'
const { history } = config
import 'Styles/searchPage.scss'
const Item = List.Item
import cookie from 'react-cookies'
class DetailSearchPage extends Component {
  constructor(props) {
    super(props);
  }

  searchClear = () => {
    this.props.actions.fetchAboutKeyWords()
  }
  cancel = () => {
    this.props.actions.changeDetailSearch(0)
    this.props.actions.fetchAboutKeyWords()
  }
  onSearchChange = (value) => {
    // this.props.shareCityId
    if(this.props.shareCityId){
      this.props.actions.fetchAboutKeyWords(value,this.props.shareCityId)
    }else{
      this.props.actions.fetchAboutKeyWords(value)
    }
  }

  selectSearchResult = (item) => {
    // 判断是否为分享链接进入详情的搜索
    if(this.props.shareCityId){
      this.props.actions.fetchStationDetail(item,this.props.shareCityId)
    }else{
      this.props.actions.fetchStationDetail(item)
    }
    this.props.actions.getStationDefault(item)
    // this.props.actions.selectSearchResults(item)
    this.props.actions.changeTopBarStatus(1)
    this.props.actions.fetchAboutKeyWords()
    this.props.actions.changeDetailSearch(0)
    cookie.save('searchRadioStatus',1)
    // this.props.homeInfo.refsFun()
  }
  render() {
    const listExtra = (item) =>{
      return item.lines.map((line,i) => {
        return (
          <div className="extraCircle" style={{backgroundColor:line.lineColor||''}}>
            {line.lineCode.slice(0,3)||''}
          </div>
        )
      })
    }
    const serchList = () => {
      if (this.props.homeInfo.fuzzy_station_list.length>0){
        return this.props.homeInfo.fuzzy_station_list.map((item, index) => {
          return (
            <Item onClick={() => this.selectSearchResult(item.stationName)} extra={listExtra(item)} key={item.id}>{item.stationName}</Item>
          )
        })
      }else {
        return ''
      }
    }
    const searcResult = () =>{
        if(this.props.homeInfo.fuzzy_station_list.length>0){
          return (
              <List>
                {serchList()}
              </List>
          )
        }
    }
    return (
      <div className="searchDetail">
        <SearchBar
          placeholder={'输入地铁站，换乘省时间'}
          onSubmit={value => console.log(value, 'onSubmit')}
          onClear={this.searchClear}
          showCancelButton
          cancelText={'取消'}
          onChange={this.onSearchChange}
          data-trackevtid="M_SS_201712_AN_1_001"
          onCancel={this.cancel}
          maxLength={15}
          onFocus={() => {
            _btn_click('M_SS_201712_AN_1_001');
          }}
        />
        <div id="theSearchWap" style={{minHeight:'426px',maxHeight:'758px',overflow:'auto','WebkitOverflowScrolling':'touch'}}>
        {searcResult()}
        </div>
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
)(DetailSearchPage)