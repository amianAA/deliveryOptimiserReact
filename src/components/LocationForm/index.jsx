import React from 'react'
import Autocomplete from 'react-google-autocomplete'

class LocationForm extends React.Component {

render(){
  return(
    <Autocomplete
    style={{width: '90%'}}
    onPlaceSelected={(place) => {
      console.log(place);
    }}
    types={['address']}
    componentRestrictions={{country: "es"}} />
  )
}
  }
export default LocationForm
