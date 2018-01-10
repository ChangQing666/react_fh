import 'Styles/lineTopBar.scss'
import React, {Component} from 'react'
import config from '../config/'
import SearchPage from '../containers/searchPage'
const { history } = config

export default class LineTopBar extends Component {
  constructor(props) {
    super(props);
    this.state={
      toggle:0
    }
  }

  componentDidMount() {
  }
  componentWillReceiveProps(){
     if (this.props.prevUrl ==='/hourses/cities') {
        this.state={
          toggle:0
        }
     };
  }
  theBack = (e) => {
    //e.nativeEvent.stopImmediatePropagation()
    this.props.changeTopBarStatus(0)
    if(this.props.prevUrl===''){
      history.push('/line')
      return
    }
    this.setState({
      toggle:0
    })
    history.goBack()
  }
  linesSubWay = (e) => {
    e.nativeEvent.stopImmediatePropagation()
    location.href='http://map.baidu.com/mobile/webapp/subway/show/city='+this.props.cityName_citySpell
  }
  rmSearch = () => {
    this.props.changeDetailSearch(1)
  }
  render () {
    let {lineTopBarStatus, selectSearchResult, cityName, topBarImageStatus} = this.props
    const topBarContent = () => {
      if(!Number(lineTopBarStatus)) {
        if (!Number(topBarImageStatus)) {
          return <i className="lineTop-icoTop"></i>
        } else {
          return <i></i>
        }
      }
    }
    const topBarEvent = (e) => {
      // 阻止冒泡
       //e.nativeEvent.stopImmediatePropagation()
      // 详情页 移除点击事件

      if(this.props.PathName!=='/hourses/Detail'){
        // 入口是首页，或者其他入口进入，且当前页是城市列表和详情 则跳回主页，否则正常切换列表与城市
        if(this.props.prevUrl==='/line' || this.props.prevUrl==='' && this.props.PathName==='/hourses/cities' || this.props.PathName==='/hourses/Detail'){
          this.props.receivePrevUrl(this.props.PathName)
          location.href = '/line'
          // history.push('/line')
          return
        }
        // 站点线路顶部切换
        this.props.receivePrevUrl(this.props.PathName)
        if(!Number(lineTopBarStatus)){
          if (this.state.toggle) {
            this.setState({
              toggle:0
            })
            this.props.changeTopBarImageStatus(1)

            history.goBack()
          } else {
            this.setState({
              toggle:1
            })
            this.props.changeTopBarImageStatus(0)
            history.push('/hourses/cities')
          }
        }
      }

    }
    const navOrSearch = () =>{
      if(!Number(lineTopBarStatus)){
        return <div className="nav"  onClick={this.linesSubWay}  data-trackevtid="M_CJDSSY_201712_AN_1_002">地铁导航</div>
      }else {
        return <div className="search" onClick={this.rmSearch}><img src={require('../assets/images/search_blue@2x.png')} /></div>
      }
    }
    return (
      <div className="lineTop">
        <div id="toRoot" className="goBack" onClick={this.theBack} data-trackevtid="M_CJDSSY_201712_AN_1_001"></div>
        <div className="city">
          <span onClick={(e) => topBarEvent(e)}>
          {Number(lineTopBarStatus) ? selectSearchResult : cityName}
          {topBarContent()}
          </span>
        </div>
        {navOrSearch()}
      </div>
    )
  }
}
