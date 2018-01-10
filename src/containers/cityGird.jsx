import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from 'Actions'
import { Grid } from 'antd-mobile';
import config from '../config/'
import { Tool } from '../utils/'
import cookie from "react-cookies";
import 'Styles/cityGird.scss'
const {history} = config
import {track} from '../utils/track'

const ua = window.navigator.userAgent.toLowerCase();
class CityGird extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    track()
  }
  async componentWillMount() {
    this.props.actions.changeTopBarStatus(0)
    this.props.actions.changeTopBarImageStatus(0)
    await this.props.actions.fetchCityList()
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      Tool.wxShare({shareInfo: {
          title: '坐地铁，超近道，轻松一查就知道。',
          desc: '快速换乘、快速出站、找厕所、首末班时间，一键查询。',
          link: `https://bbh.jyall.com/hourses/cities?cityId=${this.props.lineInfo.cityDefault.id}`,
          imgUrl: 'https://bbh.jyall.com/assets/images/icon@3x.png'
        }})
    }
}
  selectCity = (el,i) => {
    // e.nativeEvent.stopImmediatePropagation()
    let path = this.props.location.pathname
    let cityName = el.text
    this.props.actions.fetchCityList(cityName)
    if (this.props.homeInfo.prevUrl==='/hourses/cities'){
      history.goBack()
    }else{
      history.push(this.props.homeInfo.prevUrl)
    }
    this.props.actions.receivePrevUrl(path)
  }
  render() {
    if(this.props.lineInfo.cityList.length>0){
      const data = this.props.lineInfo.cityList.map((val, i) => ({
        icon: val.cityIcon,
        text: val.cityName,
      }));
      const currentCity = () =>{
        return this.props.lineInfo.cityList.map((item,i)=>{
          if (item.cityName === this.props.lineInfo.cityDefault.cityName ){
            return (
              <div className="currentCity" key={i}>
                <span className="current">当前城市：</span><img src={item.cityIcon} />
                <span className="city">{item.cityName || cookie.load('cityDefault')}</span>
              </div>
            )
          }
        })
      }
      return (
        <div>
          {currentCity()}
          <Grid data={data} hasLine={false} columnNum={4} onClick={this.selectCity} data-trackevtid="M_CJDCSLB_201712_AN_1_001"
          />
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
    homeInfo: state.homeInfo.toJS(),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(
  mapStateToProps, mapDispatchToProps
)(CityGird)