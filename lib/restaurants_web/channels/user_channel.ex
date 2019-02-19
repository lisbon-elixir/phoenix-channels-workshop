defmodule RestaurantsWeb.UserChannel do
  use RestaurantsWeb, :channel
  require Logger

  def join("user:" <> user_id, _auth, socket) do
    Logger.info("Receiving connection for user #{user_id}")
    {:ok, socket}
  end
end
