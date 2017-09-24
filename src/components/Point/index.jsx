import React from 'react'
import style from './styles.css'

class Point extends React.Component {
  constructor(props){
    super(props)
  }

render(){
  return(
  <div className='row mt-3'>
    <div className='col-3'>
      <div className='row'>
        <div className='col-6'>
            <button className='delete-btn ml-3 pb-3' onClick={()=>this.props.deletePoint(this.props)}>x</button>
        </div>
        <div className='col-6'>
          <strong className='id-number'>{this.props.id+1}.-</strong>
        </div>
      </div>
  </div>
    <div className='col route-data'>
      <div className='row'>
        {this.props.address}
      </div>
    </div>
  </div>
)
}
/*
Eliminidas las cordenadas:
<div className='row'>
    <strong>Coords: </strong> ({this.props.lat}, {this.props.lng})
</div>
*/
}
export default Point
