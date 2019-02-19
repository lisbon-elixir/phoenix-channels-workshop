defmodule RestaurantsWeb.RestaurantController do
  use RestaurantsWeb, :controller

  @lisbon_id 82

  def index(conn, _params) do
    {:ok, restaurants} = Tomato.search(%{entity_type: "city", entity_id: @lisbon_id})
    render(conn, "index.html", restaurants: restaurants)
  end
end
