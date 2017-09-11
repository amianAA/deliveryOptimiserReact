import React from 'react'
import 'normalize-css'
import styles from './style.css'

import Header from '../Header'
import Main from '../Main'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      position: {
        lat: '',
        lon: '',
        address: '',
      }
    }
  }

  render() {
    return (
      <div>
        <Header/>
        <div className="container-fluid">
          <Main position= {this.state.position}/>
        </div>
      </div>
    )
  }
}

export default App
