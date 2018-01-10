import React, {Component} from 'react'
import config from '../config/'
import 'Styles/point.scss'

const {history} = config
export default class Point extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount(){
    document.getElementsByClassName('pointMark')[0].addEventListener('touchmove',function (e) {
      e.preventDefault();
    },false)
    document.getElementsByClassName('title')[0].addEventListener('touchmove',function (e) {
      e.preventDefault();
    },false)
    document.getElementsByClassName('close')[0].addEventListener('touchmove',function (e) {
      e.preventDefault();
    },false)
  }
  render () {
    return (
      <div>
        <div  className="mainWrapper">
          <div className="markMain">
            <div className="title">小提示</div>
            <div className="mainBody" style={{height:window.innerHeight-36-42-79 + 'px'}}>
              {/*----/*/}
              <div className="scrollWrapper">
                <div className="biaoti">
                  地铁神器“超近道”使用说明：
                </div>
                <div className="textGray">
                  地铁神器“超近道”为您提供全国21个城市，108条地铁线，2292个地铁站的快速“换乘/出站”和查询站内“便民设施”的服务。
                </div>
                {/*----/*/}
                <div className="biaoti">
                  快速换乘
                </div>
                <div className="textGray">
                  上车前查一查您要去的换乘站，按照“超近道”提示的屏蔽门号上车，下车时便可快速换乘。
                </div>
                <div className="example">
                  <span style={{color:'#EE6723'}}>例：</span>您要去1号线的“国贸站”，超近道提示您从“国贸站”的6号屏蔽门换乘最近，那么您在1号线的任意车站从6号屏蔽门上车，到“国贸站”下车便可快速换乘。
                </div>
                {/*----/*/}
                <div className="biaoti">
                  快速出站
                </div>
                <div className="textGray">
                  规则同上，您只需查询您要去的地铁站的出站口对应的屏蔽门号，在同一条地铁线的任意一站相同编号的屏蔽门上车，下车即可一步出站。<br/>
                  您还可以用“超近道”<span style={{color:'#151515'}}>查地铁站内的“洗手间”和“首末班时间”哦！</span>
                </div>
                {/*----*/}
                <div className="biaoti">
                  屏蔽门号在哪？
                </div>
                <div className="doorImage">
                  <img src={require("../assets/images/3@2x.png")} alt=""/>
                </div>
              </div>

            </div>
          </div>
          <div className="close" onClick={this.props.pointClose}>
            <img src={require("../assets/images/close@2x.png")} alt=""/>
          </div>
        </div>
        <div className="pointMark">
        </div>
      </div>

    )
  }
}