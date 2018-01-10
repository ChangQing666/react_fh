import React, { Component } from 'react'
import config from '../config/'
const { history } = config
export default class HomeIndex extends Component {
  constructor(props){
    super(props)
    history.push('/line')
  }
  render(){
  	return (<div></div>)
  }
}
