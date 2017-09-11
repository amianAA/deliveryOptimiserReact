import React, { Component } from 'react'
import styles from './style.css'

class Header extends Component {
  render() {
    return (
      <header className= {styles.root}>
        <h1 className= {styles.logo}>deliveryOptimiser</h1>
      </header>
    )
  }
}

export default Header
