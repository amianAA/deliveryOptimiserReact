import React from 'react'
import styles from './style.css'
import Point from '../Point'
import img from './logo.png'

class DeliveryPoints extends React.Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
     <div className='delivery-points'>
        <div className='row justify-content-center'>
        { this.props.added
          ? <button className='calculate-btn' onClick={this.props.calculateRoute}>Calcular Ruta</button>
          : (<div className='row justify-content-center'>
              <img src={img} alt='logo' />
              <p className='middle-text'> Bienvenid@ a la aplicación <strong><em>deliveryOptimiser.</em></strong></p>
            </div>) }
        </div>
        {this.props.points.map (point => {
          return (
          <Point
          key= {point.key}
          id= {this.props.points.indexOf(point)}
          address = {point.address}
          lat= {point.lat}
          lng= {point.lng}
          deletePoint = {()=>this.props.deleteOnePoint(point)}
          solved = {this.props.solved}
          />
          )
        })}
 </div>
  )}
}

export default DeliveryPoints
