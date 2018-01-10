import React, {Component} from 'react';

export class MapLine extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className='mapline' onClick={()=>location.href='http://map.baidu.com/mobile/webapp/subway/show/city='+this.props.cityName}>
        <span>地铁线路图</span>
      </div>
    );
  }
}

export class Pop extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const children = () => {
      if(this.props.reMarkInfo){
        return this.props.reMarkInfo.split('|').map((item,index)=>{
          return (
            <p key={index}>{item}</p>
          )
        })
      }
    }
    return (
      <div className="popMask">
        <div className="popInfo">
          <div className="title" >
            提示
          </div>
          {children()}
        </div>
        <div className="close" onClick={this.props.handleClose}>
          <img src={require('../assets/images/close@2x.png')} />
        </div>
        <div className="mask"></div>
      </div>
    )
  }
}
