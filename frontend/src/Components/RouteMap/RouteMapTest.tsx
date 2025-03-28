import RouteMap from "./RouteMap";

const RouteMapTest = () => {
  return (
    <>
      <h1 className="text-xl font-bold text-center">Route Map Test</h1>
      <RouteMap pickup="Los Angeles, CA" dropoff="San Francisco, CA" />
    </>
  );
};

export default RouteMapTest;
