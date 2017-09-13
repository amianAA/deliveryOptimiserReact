import React, {Component} from 'react'
import SearchContainer from '../SearchContainer'
import styles from './style.css'

class Main extends Component {

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <SearchContainer />

        </div>
      </div>
    )
  }
}

export default Main
