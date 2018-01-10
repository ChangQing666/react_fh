import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from 'Actions'
import LinesAccordion from '../components/linesAccordion'
import cookie from "react-cookies";
import {Tool} from "../utils";
import {track} from "../utils/track";
const ua = window.navigator.userAgent.toLowerCase();
class FollowLines extends Component {
  constructor(props) {
    super(props);
    track()
  }

  async componentWillMount(){
    // 数据持久化
    this.props.actions.changeTopBarStatus(0)
    this.props.actions.changeTopBarImageStatus(1)

    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      Tool.wxShare({shareInfo: {
          title: '坐地铁，超近道，轻松一查就知道。',
          desc: '快速换乘、快速出站、找厕所、首末班时间，一键查询。',
          link: `https://bbh.jyall.com/hourses/lineIndex/followLines?cityId=${this.props.lineInfo.cityDefault.id}`,
          imgUrl: 'https://bbh.jyall.com/assets/images/icon@3x.png'
        }})
    }
  }
  render() {
    const {lineInfo} = this.props.homeInfo
    const pathName = this.props.location.pathname
    return (
      <div className="followLines">
        <LinesAccordion
          lineInfo={lineInfo}
          getStationDefault={this.props.actions.getStationDefault}
          changeTopBarStatus={this.props.actions.changeTopBarStatus}
          pathName={pathName}
          receivePrevUrl={this.props.actions.receivePrevUrl}
          getLineId={this.props.actions.getLineId}
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
)(FollowLines)