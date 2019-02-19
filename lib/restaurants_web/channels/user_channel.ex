defmodule RestaurantsWeb.UserChannel do
  use RestaurantsWeb, :channel
  require Logger

  def join("user:" <> user_id, _auth, socket) do
    Logger.info("Receiving connection for user #{user_id}")
    {:ok, socket}
  end

  def handle_in("get_restaurants", %{"coords" => %{"lat" => lat, "lng" => lng}}, socket) do
    {:ok, %{"nearby_restaurants" => restaurants}} = Tomato.geocode(lat, lng)

    response =
      restaurants
      |> Enum.map(&render_restaurant/1)

    {:reply, {:ok, %{restaurants: response}}, socket}
  end

  def render_restaurant(%{"restaurant" => restaurant}) do
    %{
      name: restaurant["name"],
      url: restaurant["url"],
      latitude: restaurant["location"]["latitude"],
      longitude: restaurant["location"]["longitude"]
    }
  end
end
