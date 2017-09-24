import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Geosuggest from 'react-geosuggest'
import DeliveryPoints from '../DeliveryPoints'
import DataRoute from '../DataRoute'
import SolutionMap from '../SolutionMap'
import SolvedDeliveryPoints from '../SolvedDeliveryPoints'
import Instructions from '../Instructions'
import styles from './style.css'
import axios from 'axios'

/* Mejoras para v2:
  - Llevarse toda la lógica al back pasandole en bruto la respuesta de gMaps API
  - Modificar la función de borrado de puntos para poder recalcular rutas modificadas (para sub rutas modificadas)
  - Añadir multivehiculo => Cambiar modelo LP
  - Reducir el numero de funciones
  - Reducir la redundancia de datos en el estado
  - Unificar la creación de mapas
  */

class Main extends Component {


  constructor(){
    super()
    this.state = { // Centrado en Sol inicialmente -- Km 0
      currentLocation: {
        address: 'Puerta del Sol',
        lat: 40.416667,
        lng: -3.703889
      },
      routeData: [], // donde se añadirán los puntos de ruta
      dataAdded: false,
      solved: false,
      distanceMatrix: [], // aquí se se almacenará un array de arrays (matriz) para guardar las distancias por pares de puntos
      timeMatrix: [], // idem al anterior para tiempos
      APIResponse: {}
    }
    this.order = 0 // Vble auxiliar para dar una ID a las posiciones. Se irá incrementando

    // Bindeo del this en las funciones empleadas en el modulo
    this.updatePosition = this.updatePosition.bind(this)
    this.mapConstructor = this.mapConstructor.bind(this)
    this.addPointToData = this.addPointToData.bind(this)
    this.updateState = this.updateState.bind(this)
    this.deleteOnePoint = this.deleteOnePoint.bind(this)
    this.getDistances = this.getDistances.bind(this)
    this.formatMatrices = this.formatMatrices.bind(this)
    this.sendData = this.sendData.bind(this)
    this.setResponseMap = this.setResponseMap.bind(this)
    this.routeTime = this.routeTime.bind(this)
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
              mapConstructor('map')

          } else {
            window.alert('No results found');
          }
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
    this.addPointToData()
  }

  mapConstructor(ref){ //Constructor del mapa
      // Construcción del mapa
      const maps = window.google.maps,
            mapRef = this.refs[ref],
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
    }

  componentDidMount() { //Metodo de React empleado para reubicar tras geolocalización
      navigator.geolocation.getCurrentPosition(this.updatePosition,() => this.mapConstructor('map'))
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
    this.sendData(this.state.distanceMatrix)
  }

  setResponseMap(data) {
    this.setState({APIResponse: data, solved: true})
    this.routeTime()
  }

  sendData(distances){ // Envía los datos al back
    let setResponseMap = this.setResponseMap
    axios.post('/api/solve', {key:'distanceMatrix', value: distances})
        .then(function (response) {
          setResponseMap(response.data)
        })
        .catch(function (error) {
          console.log(error);
        });
        }

  routeTime(){
    let totalTime = 0,
        totalTime2 = 0,
        i,
        j,
        output
    for (var k in this.state.APIResponse){
      i = this.state.APIResponse[k].origin
      j = this.state.APIResponse[k].destiny
      if (i && j){
        totalTime += this.state.timeMatrix[i][j]
      }
      if(totalTime >= 60){
        output = Math.trunc(totalTime / 60) + " min " + totalTime % 60 + ' seg'
        totalTime2 = totalTime / 60
        if (totalTime2 > 60) {
          output = Math.trunc(totalTime2 / 60) + " h " + Math.trunc(totalTime2 % 60 ) + ' min ' + totalTime % 60 + ' seg'
        }
      }
    }
    this.setState({totalTime: output})
  }

  render(){
    return(
      <div className='container-fluid'>
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
          this.mapConstructor("map")

        }}
        />
        <div className='row main-container'>

          <div className='col-3 left-column'>
          {!this.state.solved
            ? (<div>
                <div className='row justify-content-center'>
                  <button id='add-point-btn' onClick={this.addPointToData}> Añadir Punto a la Ruta </button>
                </div>
                <div ref='map' id='map'>
                  Loading map...
                </div>
              </div>)
            : <DataRoute
                totalTime = {this.state.totalTime}
                APIResponse = {this.state.APIResponse}
                distanceMatrix = {this.state.distanceMatrix}
                timeMatrix = {this.state.timeMatrix}
              />
            }
          </div>
          <div ref='delivery-points' className='col-4 mid-column'>
          {!this.state.solved
            ? <DeliveryPoints
                points = {this.state.routeData}
                added= {this.state.dataAdded}
                calculateRoute = {() => this.getDistances(this.state.routeData) }
                deleteOnePoint={this.deleteOnePoint}
                solved = {this.state.solved}
              />
            :<SolvedDeliveryPoints
                routeData = {this.state.routeData}
                solved = {this.state.solved}
                APIResponse = {this.state.APIResponse}
            />
          }
          </div>
          <div ref='solution-map' className='col right-column'>
            {this.state.solved
              ? (<div>
                <strong><p className='right-text'>RECORRIDO ÓPTIMO:</p></strong>
                <SolutionMap
                  distances = { this.state.distanceMatrix }
                  times = { this.state.timeMatrix }
                  solution = { this.state.APIResponse }
                  routeData = { this.state.routeData }
                  /></div>)
              : <Instructions />
              }
          </div>
        </div>
      </div>
    )}
  }

export default Main
