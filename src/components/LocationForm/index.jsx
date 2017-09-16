import React from 'react'
import ReactDOM from 'react-dom'
import Geosuggest from 'react-geosuggest'
import DeliveryPoints from '../DeliveryPoints'
import styles from './style.css'


class LocationForm extends React.Component {

constructor(){
  super()
  // this.routeData = [] // Array para almacenar puntos de ruta como objetos
  this.state = { // Centrado en Sol inicialmente -- Km 0
    currentLocation: {
      address: 'Puerta del Sol',
      lat: 40.416667,
      lng: -3.703889
    },
    routeData: [], // donde se añadirán los puntos de ruta
    dataAdded: false,
    distanceMatrix: [], // aquí se se almacenará un array de arrays (matriz) para guardar las distancias por pares de puntos
    timeMatrix: [] // idem al anterior para tiempos
  }
  this.order = 0 // Vble auxiliar para dar una ID a las posiciones. Se irá incrementando

  // Bindeo del this en las funciones empleadas en el modulo
  this.updatePosition = this.updatePosition.bind(this)
  this.mapConstructor = this.mapConstructor.bind(this)
  this.addPointToData = this.addPointToData.bind(this)
  this.updateState = this.updateState.bind(this)
  this.deleteOnePoint = this.deleteOnePoint.bind(this)
  this.calculateRoute = this.calculateRoute.bind(this)
  this.getDistances = this.getDistances.bind(this)
  this.formatMatrices = this.formatMatrices.bind(this)
}

updatePosition(position){ // Función para actualizar el estado "currentLocation"
  var geocoder = new google.maps.Geocoder
  var setAddress = this.updateState // se "copia" la función a local, para poder llamar a una global
  var mapConstructor = this.mapConstructor
  geocoder.geocode({
    'location': {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
  }, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
            setAddress(position, results[0].formatted_address)
            mapConstructor()

        } else {
          window.alert('No results found');
        }
        // Aquí hay que sacar los datos a global de alguna manera

      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    })

}

updateState(position,address){ // setea el estado actual para poder añadirlo a ruta
  this.setState({
    currentLocation: {
      address: address,
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
  })
}

mapConstructor(){ //Constructor del mapa
    // Construcción del mapa
    const maps = window.google.maps,
          mapRef = this.refs.map,
          node = ReactDOM.findDOMNode(mapRef),
          {lat, lng} = this.state.currentLocation,
          center = new maps.LatLng(lat, lng),
          mapConfig = Object.assign({}, {
            center: center,
            zoom: 16
          })
      // Renderizado del mapa y marcador
      this.map = new maps.Map(node, mapConfig)
      let marker = new maps.Marker({
          position: mapConfig.center,
          map: this.map
          })
      // Add InfoWindows???
  }

componentDidMount() { //Metodo de React empleado para reubicar tras geolocalización
    navigator.geolocation.getCurrentPosition(this.updatePosition,this.mapConstructor)
 }

addPointToData() { //añade tras pulsar boton los detalles del punto al estado (routeData)
  let isRepeted = 0
  for (var i in this.state.routeData){
      if(this.state.routeData[i].lat == this.state.currentLocation.lat && this.state.routeData[i].lng == this.state.currentLocation.lng ){
        isRepeted = 1
        alert('El punto ya existe en la ruta')
      }
  }
  if(isRepeted == 0 ){
    let newRouteData = this.state.routeData
    let enlargedDataPoint = {
      key: this.order,
      address: this.state.currentLocation.address,
      lat: this.state.currentLocation.lat,
      lng: this.state.currentLocation.lng
    }
    this.order++
    newRouteData.push(enlargedDataPoint)
    this.setState({ routeData: newRouteData, dataAdded: true })
    }
}

deleteOnePoint(pointToDel){
  let newRoute = this.state.routeData
  let index = newRoute.indexOf(pointToDel)
  newRoute.splice(index,1)
  this.setState({ routeData: newRoute})
  if (this.state.routeData.length === 0){
    this.setState({ dataAdded: false})
  }
}

calculateRoute(){
  //Aquí hay que:
  // llamar a la API de gMaps para obtener distancias
  this.getDistances(this.state.routeData)
  // conectar con el back pasando this.state.routeData
}
getDistances(routePoints){ // Conecta a la API de gMaps para obtener la matriz de distancias entre los puntos de ruta
  let pointsCoords = []
  var formatMatrices = this.formatMatrices
  for (var point in routePoints){
    pointsCoords.push({ lat: routePoints[point].lat, lng: routePoints[point].lng })
  }
  var service = new window.google.maps.DistanceMatrixService;
        service.getDistanceMatrix({
          origins: pointsCoords,
          destinations: pointsCoords,
          travelMode: 'DRIVING',
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: true
        }, function(response, status) {
          if (status !== 'OK') {
            alert('Error: ' + status);
          } else {
            formatMatrices(response)
            }
          })
}

formatMatrices(distanceData){ // Función llamada para crear las matrices de tiempo y distancia que se pasarán al back
  let timeCol = [],
      distanceCol = []
  for (var row in distanceData.rows){
      let timeRow = [],
          distanceRow = []
      for (var col in distanceData.rows[row].elements){
      distanceRow.push(distanceData.rows[row].elements[col].distance.value) //metros
      timeRow.push(distanceData.rows[row].elements[col].duration.value) //segundos
    }
    distanceCol.push(distanceRow)
    timeCol.push(timeRow)
  } this.setState({distanceMatrix: distanceCol, timeMatrix: timeCol})
}

render(){
  return(
    <div>
      <Geosuggest
      ref={el=>this._geoSuggest=el}
      placeholder='Introduzca su dirección'
      country= 'es'
      className="geolocation"
      style={styles}
      onSuggestSelect={(place) => {
        this.mapData = place // Al hacer click en una opción de las sugerencias, Rellena el objeto "mapData"
        this._geoSuggest.clear() // Limpia el input
        this.updatePosition({
          coords:{
            latitude: place.location.lat,
            longitude: place.location.lng
          }
        })
        this.mapConstructor()
      }}
      />
      <div className='row'>
        <div className='col-3 left-column'>
        <p>NOTA: El primer punto añadido será el punto de salida/entrada de la ruta de reparto</p>
          <div ref='map' id='map'>
            Loading map...
          </div>
          <div className='row justify-content-center'>
            <button id='add-point-btn' onClick={this.addPointToData}> Añadir punto a la ruta </button>
          </div>
        </div>
        <div ref='delivery-points' className='col right-column'>
          <DeliveryPoints
          points = {this.state.routeData}
          added= {this.state.dataAdded}
          calculateRoute = {this.calculateRoute}
          deleteOnePoint={this.deleteOnePoint}/>
        </div>
      </div>
    </div>
  )}
}

export default LocationForm
