import React, {Component} from 'react'

class SolvedDeliveryPoints extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className='delivery-points'>
      <div className='row justify-content-center'>
        <button className='calculate-btn' onClick={() => window.location.reload(true)}>Definir Nueva Ruta</button>
      </div>
        {Object.keys(this.props.APIResponse).map((item, i) => {
          var o, j, k, l
          if (i < this.props.routeData.length) {
            j = this.props.APIResponse[item].origin
            k = this.props.APIResponse[item].destiny
            l = k
            if (i > 0 && k == 0){
              l = this.props.routeData.length
            }
            o = String.fromCharCode(65 + i)
            if (i==0){
             o = 'A/'+ String.fromCharCode(65 + this.props.routeData.length)
            }
            return (
              <div className='row mt-3' key={i}>
                <div className='col-2 text-right'>
                  <strong className='id-number'>{o}.- </strong>
              </div>
                <div className='col route-data'>
                  {this.props.routeData[j].address}
                </div>
              </div>
            )
          }
        })}
      </div>
    )
  }
}
export default SolvedDeliveryPoints
