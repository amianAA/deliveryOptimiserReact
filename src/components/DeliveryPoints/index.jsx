import React from 'react'
import styles from './style.css'
import Point from '../Point'

class DeliveryPoints extends React.Component {
  constructor(props){
    super(props)
    this.deletePoint = this.deletePoint.bind(this)
  }
  deletePoint(point){
    console.log(point)
    /*delPoints = this.props.points
    for (var point in this.props.points){
      if (this.props.points[point].key==pointId) {
        newRoute = this.props.points.splice
        this.props.deleteOnePoint()
      }
    }*/

  }

  render() {
    return ( // onClick= {delete point}
     <div className='delivery-points'>
        {this.props.points.map (point => {
          return (
          <Point
          key= {point.key}
          id= {this.props.points.indexOf(point)}
          address = {point.address}
          lat= {point.lat}
          lng= {point.lng}
          deletePoint = {()=>this.props.deleteOnePoint(point)}
          />
          )
        })}
        { this.props.added ? <button className='calculate-btn' onClick={this.props.calculateRoute}>Calcular Ruta</button> : null }
 </div>
  )}
}

export default DeliveryPoints
