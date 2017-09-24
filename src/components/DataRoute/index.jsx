import React, {Component} from 'react'

class DataRoute extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className='container'>
        <strong>
          <p className='left-text'>DATOS DE RUTA:</p>
        </strong>
        <div className='global-data row'>
          <ul>
            {this.props.totalTime? <li><strong>Tiempo Ruta Estimado:</strong> {this.props.totalTime}</li> : null}
            <li><strong>Distancia Recorrida:</strong> {this.props.APIResponse.distance}</li>
            <li><strong>Paradas en Ruta:</strong> {this.props.distanceMatrix.length}</li>
          </ul>
        </div>
        <hr/>
        <div className='track-data row'>
          <div className="col-4">
            <strong>Trayecto</strong>
          </div>
          <div className="col-4">
            <strong>Distancia</strong>
          </div>
          <div className="col-4">
            <strong>Tiempo</strong>
          </div>
          </div>
          {Object.keys(this.props.APIResponse).map((item, i) => {
            var o, d, j, k, l
            if (i < this.props.distanceMatrix.length) {
              j = this.props.APIResponse[item].origin
              k = this.props.APIResponse[item].destiny
              o = String.fromCharCode(65 + i)
              d = String.fromCharCode(66 + i)
              return (
                <div className='row justify-content-center' key={i}>
                  <div className='col-4'>
                    {o} &rarr; {d}
                  </div>
                  <div className='col-4'>
                    {Math.round(this.props.distanceMatrix[j][k] / 1000)} Km
                  </div>
                  <div className='col-4'>
                    {Math.round(this.props.timeMatrix[j][k] / 60)} min
                  </div>
                </div>
              )
            }
          })}
      </div>
    )
  }
}


export default DataRoute
