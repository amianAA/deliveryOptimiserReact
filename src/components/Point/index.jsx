import React from 'react'
import style from './styles.css'

class Point extends React.Component {
  constructor(props){
    super(props)
  }

render(){
  return(
  <div className='row del-points'>
    <div className='col-1'>
      <strong>Id:</strong> {this.props.id+1}
    </div>
    <div className='col-5 route-data'>
      <div className='row'>
        <strong>Dirección: </strong> {this.props.address}
      </div>
      <div className='row'>
          <strong>Coords: </strong> ({this.props.lat}, {this.props.lng})
      </div>
    </div>
    <button className='delete-btn' onClick={()=>this.props.deletePoint(this.props)}>X</button>
  </div>
)
}

}
export default Point
