import React from 'react'
import './style.css'

class SolutionMap extends React.Component {
  constructor(props){
    super(props)
    this.calculateAndDisplayRoute = this.calculateAndDisplayRoute.bind(this)
  }
  componentDidMount(){
    let latMed = 0, // Calculo de las coordenadas medias para centrar el mapa
        lngMed = 0
    for (var pos in this.props.routeData){
      latMed += this.props.routeData[pos].lat
      lngMed += this.props.routeData[pos].lng
    }
    latMed = latMed/this.props.routeData.length
    lngMed = lngMed/this.props.routeData.length

    var directionsService = new window.google.maps.DirectionsService;
    var directionsDisplay = new window.google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map-solved'), {
      zoom: 6,
      center: {lat: latMed, lng: lngMed}
    });
    directionsDisplay.setMap(map)
    this.calculateAndDisplayRoute(directionsService, directionsDisplay)
  }

  calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [],
        j;
    for (var i = 0; i < this.props.routeData.length; ++i) {
      if(i!=0){
        j=this.props.solution[i].origin
        waypts.push({
          location: this.props.routeData[j].address,
          stopover: true
        });
      }
    }
    directionsService.route({
      origin: this.props.routeData[0].address,
      destination: this.props.routeData[0].address,
      waypoints: waypts,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  render() {
    // Meter ruta de modo 0>1>5>...
    // Meter mapa con la ruta + tiempo + distancia total
    return (<div id='map-solved'></div>)
  }
}
export default SolutionMap
