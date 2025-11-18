import { useState, useEffect } from "react";

export default function useGeo() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return coords;
}
