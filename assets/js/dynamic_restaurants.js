import {channel} from "./socket"

let DynamicRestaurants = {
  init() {
    window.mymap.on('moveend', this.handleMapMove);
    channel.on("get_favorite_restaurants", ({restaurants}) =>
      restaurants.forEach(r => {
        this.renderFavoriteRestaurant(r.latitude, r.longitude, r.name, r.url)
      })
    )

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

  renderFavoriteRestaurant(lat, long, name, url) {
    const icon = window.L.divIcon({
      iconAnchor: [6, 60],
      popupAnchor: [0, -50],
      className: 'no-background',
      html: '<div class="fa fa-star fa-big orange"></div>'
    });

    const favorite_marker = window.L.marker(L.latLng(lat, long), {
      icon
    }).addTo(window.layerGroup);

    favorite_marker.bindPopup(`<a href="${url}">${name}</a></br>`)
  },

  handleMapMove() {
    window.layerGroup.clearLayers()
    DynamicRestaurants.getRestaurants(window.mymap.getCenter())
  }
}

export default DynamicRestaurants
