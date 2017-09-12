import React from 'react'
import Geosuggest from 'react-geosuggest'
import styles from './locationForm.css'
class LocationForm extends React.Component {

render(){
  return(
    <div className='geoform'>
    <Geosuggest
    ref={el=>this._geoSuggest=el}
    placeholder='Introduzca su dirección'
    country= 'es'
    className="geoLocation"
    style={styles}
    onSuggestSelect={(place) => {
      console.log(place)
      this._geoSuggest.clear()
      // this._geoSuggest.blur()
      // this.style={styles.geosuggest__suggests--hidden}

    }}
    />
    </div>
  )
}
  }
export default LocationForm
