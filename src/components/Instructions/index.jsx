import React, {Component} from 'react'

class Instructions extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div>
        <strong>
          <p className='right-text'>INSTRUCCIONES:</p>
        </strong>
        <p className='right-text'>1.- Utilice el buscador superior para encontrar la dirección de cada punto de reparto.</p>
        <p className='right-text'>2.- IMPORTANTE: La primera dirección introducida es el punto inicial y final de la ruta.</p>
        <p className='right-text'>3.- Compruebe en el mapa de la izquierda que la ubicación es correcta. En caso contrario, puede eliminarla</p>
        <p className='right-text'>4.- Una vez estén todos los puntos de reparto definidos, haga click en "Calcular Ruta".</p>
      </div>
    )
  }
}
export default Instructions
