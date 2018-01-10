import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Actions from 'Actions'
import { Pop } from '../components/'
import cookie from 'react-cookies'
import config from '../config/'
import {Accordion} from 'antd-mobile';

class DetailCard extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ischeck: 0,
      showList: false,
      toDirection: '',
      inout:'',
      timeOut:true,
      exitNo:false
    };
  }
  componentDidMount(){
    // 自动触发click
      if(this.refs.firstRadioClick){
        this.refs.firstRadioClick.click()
      }
  }
  componentWillUnmount(){
    // 卸载销毁数据
    this.props.actions.receiveStationDetail('')
    this.props.actions.receiveCheckRadius(-1)
  }
  componentWillReceiveProps(){
    //详情页搜索哦默认展示
    setTimeout(()=>{
    if(cookie.load('searchRadioStatus')){
      if(this.props.stationDetail.data.lineInfoGroup.length < 3){
        let _this = this
          _this.refs.firstRadioClick.click()
      }
      cookie.remove('searchRadioStatus')
    }
    },100)
  }

  // checkbox 的触发事件
  onChangeStartRadio = (e,index,i,direction,length=-1,inout='') => {
    this.props.actions.receiveCheckRadius(index)
    this.props.actions.receiveTonggao(0)
    if(length==1&&inout){
      this.setState({
        ischeck: i,
        toDirection: direction,
        inout:inout
      });
    }else{
      this.setState({
        ischeck: i,
        toDirection: direction,
      });
    }
  }
  // 去重
  uniqueArray = (array) =>{
    let n = [];
    for(let i = 0; i < array.length; i++){
      if (n.indexOf(array[i]) === -1) n.push(array[i]);
    }
    return n;
  }
  // card 顶部切换事件
  yuejie = (index) => {
    const bool = this.props.homeInfo.Index_radius === index
    this.props.actions.changeStationDetail(index)
    this.props.actions.receiveCheckRadius(-1)
    // 防止越界，重置index
    this.setState({
      ischeck: 0
    })
  if(this.props.stationDetail.data.lineInfoGroup.length < 3){
      // 解决二维码因上边内容高度，切换闪现问题
    if(bool){
      document.getElementsByClassName('cardWrapper')[index].style.height = window.innerHeight -45 - 12.5 +'px'
    }
    let _this = this
    setTimeout(()=>{
      _this.refs.firstRadioClick.click()
      document.getElementsByClassName('cardWrapper')[index].style.height = 'initial'
    },25)
  }
  }
  // 点我事件
  hanldreMark = (val)=>{
    if(this.props.lineInfo.reMark.reMarkInfo){
      this.props.actions.reMark(0, '')
    }else{
      this.props.actions.reMark(1, val)
    }
  }
  totleExit = () => {
    this.setState({
      exitNo:true
    })
  }
  render () {
    const { stationIndex,reMark } = this.props.lineInfo
    const itemFather = this.props.item
    const indexFather = this.props.index
    const stationDetail = this.props.stationDetail
    console.log(stationDetail)
    // 方向集合，针对特殊站点，根据方向切换数据
    let toDirectionArry = []
    // inOut字段数组
    let inOutArray = []
    // 上海四号线宜山路处理
    let afterArray = []
    let  afterInout = []
    // card超近道展示信息
    const todirec = (item,index) =>{
      const lineInfos = item.lineInfos[stationIndex[index]]
      const stationVos = lineInfos.stationVos
      // 通过index判断是否是当前card
      const bool = this.props.homeInfo.Index_radius === index
      stationVos.map((vo,i) =>{
        toDirectionArry.push(vo.toDirection)
        inOutArray.push(vo.inOut)
      })
      // 数组去重，根据方向长度以及inout字段判断是否为当前情况
      toDirectionArry = this.uniqueArray(toDirectionArry)
      inOutArray = this.uniqueArray(inOutArray)
      stationVos.map((vo,i) =>{
        if(toDirectionArry.length==1&&vo.inOut){
          afterArray.push(vo.toDirection)
          afterInout.push(vo.inOut)
        }
      })
      // 处理宜山路特殊情况
      if(toDirectionArry.length==1&&afterInout[0]){
        return afterArray.map((direction,i)=>{
          // 大于俩card 直接返回
          if (stationDetail.data.lineInfoGroup.length > 2) {
            return (
              <label className="startRadio" htmlFor={"startRadio" + i + index } key={i}>
                {/*--特殊情况比对inout字段以及方向toDirectionArry数组的长度--*/}
                {this.state.inout=== inOutArray[i] && bool?<img className="checkImg" src={require('../assets/images/check_yes@2x.png')} alt="check"/>:<img className="checkImg" src={require('../assets/images/check_no@2x.png')} alt="check"/>}
                <input type="radio" name="direction" id={"startRadio" + i + index}
                       onClick={(e) => this.onChangeStartRadio(e, index, i, direction,toDirectionArry.length,inOutArray[i])}/>
                <div className={this.state.inout=== inOutArray[i] && bool?"activeRadio":"toDirection"}>{'开往'+ direction + (inOutArray[i]?'('+ inOutArray[i] +')':'')+ '方向'}</div>
              </label>
            )
          }else{
            // 第一个卡片且是第一个选项，默认选中
            if(index==0 && i==0){
              return (
                <label className="startRadio" htmlFor={"startRadio" + i + index} key={i}>
                  {this.state.inout=== inOutArray[i] && bool?<img className="checkImg" src={require('../assets/images/check_yes@2x.png')} alt="check"/>:<img className="checkImg" src={require('../assets/images/check_no@2x.png')} alt="check"/>}
                  <input type="radio" name="direction" id={"startRadio" + i + index}
                         onClick={(e) => this.onChangeStartRadio(e, index, i, direction,toDirectionArry.length,inOutArray[i])} ref="firstRadioClick"/>
                  <div className={this.state.inout=== inOutArray[i] && bool?"activeRadio":"toDirection"}>{'开往'+ direction + (inOutArray[i]?'('+ inOutArray[i] +')':'')+ '方向'}</div>
                </label>
              )
            }else{
              // 其余的直接返回
              return (
                <label className="startRadio" htmlFor={"startRadio" + i + index} key={i}>
                  {this.state.inout=== inOutArray[i] && bool?<img className="checkImg" src={require('../assets/images/check_yes@2x.png')} alt="check"/>:<img className="checkImg" src={require('../assets/images/check_no@2x.png')} alt="check"/>}
                  <input type="radio" name="direction" id={"startRadio" + i + index}
                         onClick={(e) => this.onChangeStartRadio(e, index, i, direction,toDirectionArry.length,inOutArray[i])}/>
                  <div className={this.state.inout=== inOutArray[i] && bool?"activeRadio":"toDirection"}>{'开往'+ direction + (inOutArray[i]?'('+ inOutArray[i] +')':'')+ '方向'}</div>
                </label>
              )
            }

          }
        })
      }else{
        return toDirectionArry.map((direction,i)=>{
          // 大于俩card 直接返回
          if (stationDetail.data.lineInfoGroup.length > 2) {
            return (
              <label className="startRadio" htmlFor={"startRadio" + i + index } key={i}>
                {this.state.toDirection=== direction && bool?<img className="checkImg" src={require('../assets/images/check_yes@2x.png')} alt="check"/>:<img className="checkImg" src={require('../assets/images/check_no@2x.png')} alt="check"/>}
                <input type="radio" name="direction" id={"startRadio" + i + index}
                       onClick={(e) => this.onChangeStartRadio(e, index, i, direction)}/>
                <div className={this.state.toDirection=== direction && bool?"activeRadio":"toDirection"}>{'开往'+ direction + (inOutArray[i]?'('+ inOutArray[i] +')':'')+ '方向'}</div>
              </label>
            )
          }else{
            // 第一个卡片且是第一个选项，默认选中
            if(index==0 && i==0){
              return (
                <label className="startRadio" htmlFor={"startRadio" + i + index} key={i}>
                  {this.state.toDirection=== direction && bool?<img className="checkImg" src={require('../assets/images/check_yes@2x.png')} alt="check"/>:<img className="checkImg" src={require('../assets/images/check_no@2x.png')} alt="check"/>}
                  <input type="radio" name="direction" id={"startRadio" + i + index}
                         onClick={(e) => this.onChangeStartRadio(e, index, i, direction)} ref="firstRadioClick"/>
                  <div className={this.state.toDirection=== direction && bool?"activeRadio":"toDirection"}>{'开往'+ direction + (inOutArray[i]?'('+ inOutArray[i] +')':'')+ '方向'}</div>
                </label>
              )
            }else{
              // 其余的直接返回
              return (
                <label className="startRadio" htmlFor={"startRadio" + i + index} key={i}>
                  {this.state.toDirection=== direction && bool?<img className="checkImg" src={require('../assets/images/check_yes@2x.png')} alt="check"/>:<img className="checkImg" src={require('../assets/images/check_no@2x.png')} alt="check"/>}
                  <input type="radio" name="direction" id={"startRadio" + i + index}
                         onClick={(e) => this.onChangeStartRadio(e, index, i, direction)}/>
                  <div className={this.state.toDirection=== direction && bool?"activeRadio":"toDirection"}>{'开往'+ direction + (inOutArray[i]?'('+ inOutArray[i] +')':'')+ '方向'}</div>
                </label>
              )
            }

          }
        })
      }
    }

    const checkDirection = (item, index) => {
        return (
          <div className="direction">
            {todirec(item,index)}
          </div>
        )
    }
    // ant-design手风琴自定义样式头
    const header = (text) => {
      return (
        <div className="accordHeader">
          <div className="text">{text}</div>
        </div>
      )
    }
    // 超近道

    // 特殊标识处理
    const stNumberFun = (stText,sType,color='',reMarkFun=null,reMark=null,exit=0) =>{
        if(stText==='ST0'){
          return <div className="chaojindao">暂缓开通</div>
        }else if(stText==='ST1'){
          return <div className="chaojindao">正对换乘</div>
        }else if(stText==='ST2'){
          return <div className="chaojindao">暂缓换乘</div>
        }else if(stText==='ST3'){
          return <div className="chaojindao">正对通道</div>
        }else if(stText==''||stText==null){
          return <div className="chaojindao">暂无</div>
        }else{
          if(exit){
            return(
              <div className="itemBottom">从{stText}上车，到本站下车时距以上出口最近</div>
            )
          }else{
            if(sType==='换乘'){
              return(
                <div className="chaojindao">从{stText}上车，到本站下车<span className="onStationType" style={{color:color}}>{sType}</span>最近{/*reMarkFun(reMark)*/}</div>
              )
            }else{
              return(
                <div className="chaojindao">从{stText}上车，到本站下车{sType=='楼梯'?'走':'乘'}<span className="onStationType">{sType}</span>最近</div>
              )
            }
          }
        }
    }
    // 点我
    const _pop = () => {
      if(reMark.reMarkStatus){
        return(
          <Pop handleClose={this.hanldreMark} reMarkInfo={reMark.reMarkInfo} />
        )
      }
    }
    const _reMark = (val) =>{
      if(val){
        return(
          <span className="clickMe" onClick={()=>this.hanldreMark(val)}>
            点我
          </span>
        )
      }
    }

    // 超近道内容信息
    const showInfoItem = (item, index) =>{
      const lineInfos = item.lineInfos[stationIndex[index]]
      const stationVos = lineInfos.stationVos
      if(toDirectionArry.length==1&&afterInout[0]){
        // 同一方向的按照内外环过滤
        let toDirectionIn = stationVos.filter((n)=>{
          return n.inOut == this.state.inout
        })
        return toDirectionIn.map((item,i)=>{
          const lineInfos = item
          const transferDirection = lineInfos.transferDirection?<div className="toTransfer"><div className="transferTag"><div className="heng"></div></div><div style={{color:'#999999'}}>去往{lineInfos.toName}{lineInfos.transferDirection}方向</div></div>:''
          const erectElevator = stNumberFun(lineInfos.erectElevator,'直梯')
          const escalator = stNumberFun(lineInfos.escalator,'扶梯')
          const stairs = stNumberFun(lineInfos.stairs,'楼梯')
          const nearTransfer = stNumberFun(lineInfos.nearTransfer,'换乘',lineInfos.fromColor)
          return (
            <div className="todirectionItem" key={i}>
              {toDirectionIn.length>1?transferDirection:''}
              {stationDetail.isTransfer?<div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/huancheng@2x.png')} alt="换乘"/></div>{nearTransfer}</div>:''}
              <div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/zhiti@2x.png')} alt="直梯"/></div>{erectElevator}</div>
              <div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/futi@2x.png')} alt="扶梯"/></div>{escalator}</div>
              <div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/louti@2x.png')} alt="楼梯"/></div>{stairs}</div>
            </div>
          )
        })
      }else{
        // 不同方向的按照方向过滤
        let toDirectionIn = stationVos.filter((n)=>{
          return n.toDirection == this.state.toDirection
        })
        return toDirectionIn.map((item,i)=>{
          const lineInfos = item
          const transferDirection = lineInfos.transferDirection?<div className="toTransfer"><div className="transferTag"><div className="heng"></div></div><div style={{color:'#999999'}}>去往{lineInfos.toName}{lineInfos.transferDirection}方向</div></div>:''
          const erectElevator = stNumberFun(lineInfos.erectElevator,'直梯')
          const escalator = stNumberFun(lineInfos.escalator,'扶梯')
          const stairs = stNumberFun(lineInfos.stairs,'楼梯')
          const nearTransfer = stNumberFun(lineInfos.nearTransfer,'换乘',lineInfos.fromColor)
          return (
            <div className="todirectionItem" key={i}>
              {toDirectionIn.length>1?transferDirection:''}
              {stationDetail.isTransfer?<div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/huancheng@2x.png')} alt="换乘"/></div>{nearTransfer}</div>:''}
              <div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/zhiti@2x.png')} alt="直梯"/></div>{erectElevator}</div>
              <div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/futi@2x.png')} alt="扶梯"/></div>{escalator}</div>
              <div className="chaoWrapper"><div className="imgWrapper"><img src={require('../assets/images/louti@2x.png')} alt="楼梯"/></div>{stairs}</div>
            </div>
          )
        })
      }

    }
    const showInfo = (item, index) => {
        return (
          <Accordion.Panel header={header('超近道')}>
            {showInfoItem(item, index)}
          </Accordion.Panel>
        )
    }
    // 出口信息Item  //exitPoint,exitDoors,
    const exitTitle = (fromId,itemId ,fromColor) => {
      return stationDetail.dataExit.map((item) => {
        // 比对exits与group中的线路id,确认是相同线路
        if (item.lineId === fromId) {
          // 一个方向存在inout字段的
          if(toDirectionArry.length==1&&afterInout[0]){
            return <span className="exitlineColor" style={{backgroundColor:fromColor,borderRadius:'2px'}}>{itemId.fromName || ''}</span>
          }else{
            return item.directions.map((dir,j)=>{
              // 存在方向一致的
              if(dir.stationDirection ==itemId.stationVos[this.state.ischeck].toDirection){
                return <span className="exitlineColor" style={{backgroundColor:fromColor,borderRadius:'2px'}}>{itemId.fromName || ''}</span>
              }
            })
          }
        }
    })
    }

    const exitItems = (fromId,itemId) => {
      var exitStatus = false
      var toggleExit =  stationDetail.dataExit.map((item) => {
        // 比对exits与group中的线路id,确认是相同线路
        if (item.lineId === fromId) {
          // 特殊站如宜山路的特殊处理
          if(toDirectionArry.length==1&&afterInout[0]){
            return item.directions.map((dir,j)=>{
              return dir.exits.map((iot,i)=>{
                if(iot.inOut ==itemId.stationVos[this.state.ischeck].inOut){
                  // 一个方向存在inout显示
                  exitStatus = true
                    return (
                      <div className="exitItem" key={i}>
                        <div className="itemTop">{iot.exitPoint}口</div>
                        {/*<div className="itemBottom">从{iot.exitDoors}上车，到本站下车时距以上出口最近</div>*/}
                        {stNumberFun(iot.exitDoors,'','',null,null,1)}
                      </div>
                    )
                }
              })

            })
          }else{
            return item.directions.map((dir,j)=>{
              if(dir.stationDirection ==itemId.stationVos[this.state.ischeck].toDirection){
                // 多个方向，方向一致
                exitStatus = true
                return dir.exits.map((exitItem,i) => {
                  // const exitDoors = exitItem.exitDoors
                  return (
                    <div className="exitItem" key={i}>
                      {exitItem.exitPoint?<div className="itemTop">{exitItem.exitPoint}口</div>:''}
                      {/*<div className="itemBottom">从{exitItem.exitDoors}上车，到本站下车时距以上出口最近</div>*/}
                      {stNumberFun(exitItem.exitDoors,'','',null,null,1)}
                    </div>
                  )
                })
              }
            })
          }
        }
      })
    if(!exitStatus){
        return <span style={{padding:'6px 0 6px 20px'}}>暂无</span>
      }else{
      return toggleExit
    }
    }

    const haveHidden = (fromId,fromColor,itemId) => {
      if (stationDetail.dataExit.length>0){
        return (
          <div>
            {exitTitle(fromId,itemId ,fromColor)}
            {exitItems(fromId,itemId)}
          </div>
        )
      }else{
        return <span style={{padding:'6px 0 6px 20px'}}>暂无</span>
      }
    }
    // 出口信息
    const exitInfo = (itemId) => {
      const fromId = itemId.fromId
      const fromColor = itemId.fromColor
      // 这里根据check选项动态切换
      return(
        <Accordion.Panel  header={header('出口信息')}>
          {haveHidden(fromId,fromColor,itemId)}
        </Accordion.Panel>
      )
    }
    // 首末班时间
    const workCard =(item) => {
      return item.times.map((time,i) => {
        return (
          <div className="directionWrapper" key={i}>
            <div className="directionText">
              {time.stationDirection}方向
            </div>
            <div className="directionTime">
              <div className="shou">
                <div className="tag" style={{color:'#fff',backgroundColor:'#60C680'}}>首</div><div className="time">{time.stationFirstTime}</div>
              </div>
              <div className="mo">
                <div className="tag" style={{color:'#fff',backgroundColor:'#FD5358'}}>末</div><div className="time">{time.stationLastTime}</div>
              </div>
            </div>
          </div>
        )
      })
    }
    const timeItem = (fromId) => {
      return stationDetail.dataTime.map((item, i ) => {
        if (item.lineId === fromId) {
          return (
            <div className="workTime" key={i}>
              <div className="workWrapper">
                <div className="workTop" style={{backgroundColor:item.lineColor}}>{item.lineName}</div>
                <div className="workBottom">
                  {workCard(item)}
                </div>
              </div>
            </div>
          )
        }
      })
    }
    const timeInfo = (itemId) => {
      const fromId = itemId.fromId
      return (
        <Accordion.Panel header={header('首末班时间')}>
          {timeItem(fromId)}
        </Accordion.Panel>
      )
    }
    // 便民设施
    const headerBm = (text) => {
      return (
        <div className="accordHeader">
          <div className="text">{text}</div>
          <div className="bmimg">
            <img src={require('../assets/images/weishengjian@2x.png')} alt="卫生间"/>
            <img src={require('../assets/images/canjiren@2x.png')} alt="无障碍"/>
          </div>
        </div>
      )
    }
    const infraItem = (fromId) =>{
      return stationDetail.dataInfra.map((item, i ) => {
        if (item.lineId === fromId) {
          // 这里0根据check选项动态切换
          return (
            <div className="exitItem" key={i}>
              <div>
                <div className="itemTop bmTop"><img src={require('../assets/images/weishengjian@2x.png')} alt="卫生间"/>卫生间</div>
                <div className="itemBottom bmBottom">{item.infras[this.state.ischeck].toilet||'暂无'}</div>
              </div>
              <div>
                <div className="itemTop bmTop"><img src={require('../assets/images/canjiren@2x.png')} alt="无障碍"/>无障碍车厢</div>
                <div className="itemBottom bmBottom">{item.infras[this.state.ischeck].disableDoors||'暂无'}</div>
              </div>
            </div>
          )
        }
      })
    }
    const infraInfo = (itemId) => {
      const fromId = itemId.fromId
      const fromColor = itemId.fromColor
      return (
        <Accordion.Panel header={headerBm('便民设施')}>
          <span className="exitlineColor bmColor" style={{backgroundColor:fromColor,borderRadius:'2px'}}>{itemId.fromName || ''}</span>
          {infraItem(fromId)}
        </Accordion.Panel>
      )
    }
    // 线路切换
    const transforStation = (item, index) =>{
      if (stationDetail.isTransfer) {
        return(
          <div className="cardTop">
            <div className="fromStation">
              <div className="text">从</div>
              <div className='line'>{item.lineInfos[stationIndex[index]].fromName|| ''}</div>
            </div>
            <div className="toggle" onClick={()=>this.yuejie(index)}><img src={require("../assets/images/Fill@2x.png")} /></div>
            <div className="toStation">
              <span className='line'>{item.lineInfos[stationIndex[index]].toName || ''}</span>
              <span className="text">换乘</span>
            </div>
          </div>
        )
      }else{
        // 增加主/分支样式头
        if(stationDetail.data.lineInfoGroup.length>1){
          return (
            <div className="zhuxianWrap">
              <span className="zhuFen" style={{backgroundColor:item.lineInfos[stationIndex[index]].fromColor}}>{item.lineInfos[stationIndex[index]].fromName}</span>
            </div>
          )
        }
      }
    }

    const cardInfoList = (item, index) => {
      const bool = this.props.homeInfo.Index_radius === index
      if (stationDetail.data.lineInfoGroup.length > 2) {
        if (bool) {
          return (
            <Accordion defaultActiveKey="0"  key={item}>
              {showInfo(item, index)}
              {/* 出口 */}
              {exitInfo(item.lineInfos[stationIndex[index]])}
              {/* 首末班时间 */}
              {timeInfo(item.lineInfos[stationIndex[index]])}
              {/* 便民 */}
              {infraInfo(item.lineInfos[stationIndex[index]])}
            </Accordion>
          )
        } else {
          return ''
        }
      } else {
        // 默认显示第一个
        if(index===0&bool){
          return (
            <Accordion defaultActiveKey="0"  key={item}>
              {showInfo(item, index)}
              {/* 出口 */}
              {exitInfo(item.lineInfos[stationIndex[index]])}
              {/* 首末班时间 */}
              {timeInfo(item.lineInfos[stationIndex[index]])}
              {/* 便民 */}
              {infraInfo(item.lineInfos[stationIndex[index]])}
            </Accordion>
          )
        }else{
          if (bool){
            return (
              <Accordion defaultActiveKey="0"  key={item}>
                {showInfo(item, index)}
                {/* 出口 */}
                {exitInfo(item.lineInfos[stationIndex[index]])}
                {/* 首末班时间 */}
                {timeInfo(item.lineInfos[stationIndex[index]])}
                {/* 便民 */}
                {infraInfo(item.lineInfos[stationIndex[index]])}
              </Accordion>
            )
          }
        }
      }
    }
    if (stationDetail){
      return (
        <div className="cardWrapper" style={{borderTop: `2px solid ${this.props.cardColor}`}} key={indexFather}>
          {transforStation(itemFather, indexFather)}
          {checkDirection(itemFather, indexFather)}
          {/* 展示 超近道 */}
          {cardInfoList(itemFather, indexFather)}
          {/*点我*/}
          {/*{_pop()}*/}
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
)(DetailCard)
