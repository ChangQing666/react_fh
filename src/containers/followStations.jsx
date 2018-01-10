import React, {Component} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../redux/actions/'
import { ListView, List } from 'antd-mobile';
import config from '../config/'
const { history } = config
import { track } from '../utils/track'
import cookie from "react-cookies";
import {Tool} from "../utils";
const { Item } = List;

const ua = window.navigator.userAgent.toLowerCase();
class FollowStations extends Component {
  constructor(props) {
    super(props);
    track()
  }

  async componentWillMount(){
    this.props.actions.changeTopBarStatus(0)
    this.props.actions.changeTopBarImageStatus(1)

    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      Tool.wxShare({shareInfo: {
          title: '坐地铁，超近道，轻松一查就知道。',
          desc: '快速换乘、快速出站、找厕所、首末班时间，一键查询。',
          link: `https://bbh.jyall.com/hourses/lineIndex/followStations?cityId=${this.props.lineInfo.cityDefault.id}`,
          imgUrl: 'https://bbh.jyall.com/assets/images/icon@3x.png'
        }})
    }
 }
  getDataSource = () =>{
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
    let province = this.props.homeInfo.stationInfo
    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    province.forEach((item, index) => {
      sectionIDs.push(item.capital);
      dataBlob[item.capital] = item.capital
      rowIDs[index] = [];
      item.stations.forEach((jj) => {
        rowIDs[index].push(jj.stationName);
        dataBlob[jj.stationName] = jj;
      });
    })
    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    return dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
  }
  handleResult = (stationInfo) => {
    this.props.actions.getStationDefault(stationInfo)
    // this.props.actions.fetchStationDetail(stationInfo)
    // this.props.actions.selectSearchResults(stationInfo)
    this.props.actions.receivePrevUrl(this.props.location.pathname)
    history.push('/hourses/Detail')
  }

  render() {
    const lineName = (data)=>{
      return data.map((item, index) => {
        return (
          <span className="lineName" key={index} style={{backgroundColor: item.lineColor}}>{item.lineCode}</span>
        )
      })
    }
    return (
      //renderFooter={() => <span>没有更多了</span>}
      <div className="followStations">
        <ListView.IndexedList
          useBodyScroll
          initialListSize={15}
          dataSource={this.getDataSource()}
          renderHeader={() => <span className='lineTitle'>线路</span>}
          renderSectionHeader={(sectionData) =>{
            return (<div className="ih">{sectionData}</div>)
          }}
          renderRow={rowData => (
            <Item onClick={()=>this.handleResult(rowData.stationName)}>{rowData.stationName}
              <div className="linelist">{lineName(rowData.lines)}</div>
            </Item>)
          }
          className="fortest"
          style={{
            overflow: 'auto',
          }}
          quickSearchBarStyle={{
            position: 'absolute',
            top: 120,
          }}
          delayTime={10}
        />
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
)(FollowStations)
