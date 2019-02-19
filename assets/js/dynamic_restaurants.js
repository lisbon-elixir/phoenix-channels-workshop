import {channel} from "./socket"

let DynamicRestaurants = {
  init() {
    window.mymap.on('moveend', this.handleMapMove);
    this.getRestaurants(window.mymap.getCenter())
  },

  getRestaurants(coords) {
    channel.push("get_restaurants", {coords: coords}).receive(
      "ok", ({restaurants}) => {
        restaurants.forEach(r => {
          DynamicRestaurants.renderRestaurant(r.latitude, r.longitude, r.name, r.url)
        });
      }
    )
  },

  renderRestaurant(lat, long, name, url) {
    const marker = window.L.marker(window.L.latLng(lat, long)).addTo(window.layerGroup);
    marker.bindPopup(`<a href="${url}">${name}</a></br>`)
  },

  handleMapMove() {
    window.layerGroup.clearLayers()
    DynamicRestaurants.getRestaurants(window.mymap.getCenter())
  }
}

export default DynamicRestaurants
