import {channel} from "./socket"

let DynamicRestaurants = {
  init() {
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
    const marker = window.L.marker(window.L.latLng(lat, long)).addTo(window.mymap);
    marker.bindPopup(`<a href="${url}">${name}</a></br>`)
  }
}

export default DynamicRestaurants
