import axios from "axios";

export const getCoordinates = async (location: string) => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
          countrycodes: "ke", // Restrict to USA (modify if needed)
        },
      }
    );

    if (response.data.length === 0) {
      throw new Error("Location not found");
    }

    const { lat, lon } = response.data[0];

    const coordinates: [number, number] = [parseFloat(lat), parseFloat(lon)];

    console.log(`Geocoded ${location}:`, coordinates);

    return coordinates;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};
