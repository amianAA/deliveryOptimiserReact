import React, { Component } from 'react'
import LocationContainer from '../LocationContainer'


class Main extends Component {
  constructor(props) { // pasa las props del padre
    super(props) // llama al component padre
  }

  render () {
    return (
      <div>
      <LocationContainer position = {this.props.position} />
      </div>
    )
  }
}

export default Main
