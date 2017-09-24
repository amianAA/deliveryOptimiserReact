import React from 'react'
import 'normalize-css'
import styles from './style.css'
import './bootstrap.min.css'

import Header from '../Header'
import Main from '../Main'
import Footer from '../Footer'

class App extends React.Component {

  render() {
    return (
      <div>
        <Header />
        <Main />
        <Footer />
      </div>
    )
  }
}

export default App
