import React, { Component } from 'react'
import config from '../config/'
const { history } = config
export default class HomeApp extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <div>{this.props.children}</div>
      )
  }
}