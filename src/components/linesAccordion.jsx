import React,{Component} from 'react'
import { Accordion, List } from 'antd-mobile';
import config from '../config/'
import cookie from "react-cookies";
const {history} = config
export default class LinesAccordion extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount () {
  }
  siteDetail = (val,lineId) => {
    this.props.getStationDefault(val)
    // this.props.fetchStationDetail(val)
    // this.props.selectSearchResults(val)
    this.props.receivePrevUrl(this.props.pathName)
    history.push('/hourses/detail/'+lineId)
  }
  render () {
    const lineName = (item) => {
      return (
        <div className='lineNav'><span style={{background: item.lineColor}}>{item.lineCode}</span>{item.lineName}</div>
      )
    }
    const itemList = item => {
      return item.stations.map((st, i) => {
        return (
          <List.Item key={st.stationName} onClick={() => this.siteDetail(st.stationName,st.lineId)}>{st.stationName}</List.Item>
        )
      })
    }
    const item = this.props.lineInfo.map((item, index) => {
      return (
        <Accordion.Panel header={lineName(item)} key={index}>
          <List className="my-list">
            {itemList(item)}
          </List>
        </Accordion.Panel>
      )
    })
    return (
      <div className="fortest">
        <Accordion accordion className="my-accordion">
          {item}
        </Accordion>
      </div>
    );
  }
}