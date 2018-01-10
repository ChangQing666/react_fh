import React, { Component }from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../redux/actions/'
import cookie from 'react-cookies'
import { track } from '../utils/track'
import { Tool } from '../utils/'
import config from '../config/'
const { history } = config
import FollowStations from './followStations'

class LineIndex extends Component {
  constructor (props) {
    super(props);
    this.state = {
      nav: 0
    }
  }
  componentWillMount(){
    this.props.actions.searchStatus(0)
    this.props.actions.changeTopBarStatus(0)//控制头部右侧搜索图标
    if(this.props.location.pathname == "/hourses/lineIndex/followLines"){
      this.setState({
        nav: 1
      })
    }
  }
  stationsBtnHref = () => {
    history.push('/hourses/lineIndex/followStations')
    this.setState({
      nav: 0
    })
  }
  linesBtnHref = () => {
    history.push('/hourses/lineIndex/followLines')
    this.setState({
      nav: 1
    })
  }

  render() {
    const {cityDefault} = this.props.lineInfo
    return (
      <div className="lineIndex">
        <div className="indexLeft">
          <div onClick={this.stationsBtnHref} className={this.state.nav == 0 ? "active" : '' }>按站点</div>
          <div onClick={this.linesBtnHref} className={this.state.nav == 1 ? "active" : '' }>按线路</div>
        </div>
        <div className="indexRight">
          {this.props.children?this.props.children: <FollowStations/>}
        </div>
      </div>
    )
  }
}
function mapStateToProps(state) {
  return {
    lineInfo: state.lineInfo.toJS()
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(LineIndex)
