console.log('hello from the client side')

//const locations = JSON.parse(document.getElementById('map').dataset.locations) this was imported to index.js

//NOTE to convert an object which is json to a string one goes JSON.stringify
//		to convert an object which is string to a JSON one goes Json.parse

export const displayMap = (locations) => {

		mapboxgl.accessToken = 'pk.eyJ1IjoibWFrYXZlbGxpIiwiYSI6ImNrM3Nzb3FmbjA4YjEzY3A3Y3dydG50eDIifQ.8VrHrZrlnpR-kD0oZqpdsw';
var map = new mapboxgl.Map({
	container: 'map',
	 style: 'mapbox://styles/makavelli/ck3svej17aq9h1coan9c6iqst',
	 scrollZoom:false
	// center: [-118.1135,34.1174],
	// zoom: 10,
	// interactive:false 
});


const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc=> {
	//Create Marker
	const el = document.createElement('div')
	el.className = 'marker'

	//Add marker
	new mapboxgl.Marker({
		element:el,
		anchor:'bottom'
	}).setLngLat(loc.coordinates).addTo(map)

	//add popup
	new mapboxgl.Popup({
		offset:30
	})
	.setLngLat(loc.coordinates)
	.setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`).addTo(map)

	//extends mark bounds to inlude current location
	bounds.extend(loc.coordinates)
})

map.fitBounds(bounds,{
		padding : {
			top:200,
			bottom:150,
			left:100,
			right:100
		}
	})
}

