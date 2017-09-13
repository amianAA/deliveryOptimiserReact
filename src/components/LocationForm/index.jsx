import React from 'react'
import ReactDOM from 'react-dom'
import Geosuggest from 'react-geosuggest'
import styles from './style.css'


class LocationForm extends React.Component {
constructor(){
  super()
  let mapData: {}
  /* "mapData" empty Object which is going to be
  ** rendered with the data given by it father Geosuggest
  */
  this.state = { // Centrado en Sol inicialmente
    currentLocation: {
      lat: 40.416667,
      lng: -3.703889
    }
  }
  // Bindeo del this en distintas funciones empleadas en el modulo
  this.updatePosition = this.updatePosition.bind(this)
  this.mapConstructor = this.mapConstructor.bind(this)
}
updatePosition(position){ // Función para actualizar el estado "currentLocation"
  if(position){
    this.setState({
      currentLocation: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    })
  }
  this.mapConstructor()
}
mapConstructor(){ //Constructor del mapa
    console.log(this.state) // Saca por consola la ultima ubicación definida
    // Construcción del mapa
    const maps = window.google.maps,
          mapRef = this.refs.map,
          node = ReactDOM.findDOMNode(mapRef),
          {lat, lng} = this.state.currentLocation,
          center = new maps.LatLng(lat, lng),
          mapConfig = Object.assign({}, {
            center: center,
            zoom: 12
          })
      // Renderizado del mapa y marcador
      this.map = new maps.Map(node, mapConfig)
      let marker = new maps.Marker({
          position: mapConfig.center,
          map: this.map
          })
  }

componentDidMount() { //Metodo de React para reubicar tras geolocalización
    navigator.geolocation.getCurrentPosition(this.updatePosition,this.mapConstructor)
 }

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
      this.mapData = place // Al hacer click en opción, Rellena el objeto "mapData"
      this._geoSuggest.clear() // Limpia el input
      this.updatePosition({
        coords:{
          latitude: place.location.lat,
          longitude: place.location.lng
        }
      })
      // this.renderMapContainer(place)
    }}
    />
    <div ref='map' className='map'>
        Loading map...
    </div>
    </div>
  )}
}
export default LocationForm
