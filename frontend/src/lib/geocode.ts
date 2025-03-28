import axios from "axios";

export const getCoordinates = async (location: string) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
      }
    );

    if (response.data.length === 0) {
      throw new Error("Location not found");
    }

    const { lat, lon } = response.data[0];
    return [parseFloat(lat), parseFloat(lon)] as [number, number]; // Return as LatLngTuple
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
