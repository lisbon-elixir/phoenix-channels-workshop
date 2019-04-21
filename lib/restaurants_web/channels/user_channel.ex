defmodule RestaurantsWeb.UserChannel do
  use RestaurantsWeb, :channel
  require Logger

  def join("user:" <> user_id, _auth, socket) do
    Logger.info("Receiving connection for user #{user_id}")
    {:ok, socket}
  end

  def handle_in("get_restaurants", %{"coords" => %{"lat" => lat, "lng" => lng}}, socket) do
    {:ok, %{"nearby_restaurants" => restaurants}} = Tomato.geocode(lat, lng)

    spawn_link(__MODULE__, :process_favorite_restaurants, [socket, restaurants])

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

  def process_favorite_restaurants(socket, restaurants) do
    favorite_restaurants =
      restaurants
      |> Enum.filter(fn restaurant ->
        restaurant
        |> Map.get("restaurant")
        |> Map.get("user_rating")
        |> Map.get("aggregate_rating")
        |> String.to_float()
        |> Kernel.>(4.7)
      end)
      |> Enum.map(&render_restaurant/1)

      broadcast!(socket, "get_favorite_restaurants", %{restaurants: favorite_restaurants})
  end
end
