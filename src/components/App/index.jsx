import React from 'react'
import 'normalize-css'
import styles from './style.css'
import './bootstrap.min.css'

import Header from '../Header'
import Main from '../Main'

class App extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    )
  }
}

export default App
