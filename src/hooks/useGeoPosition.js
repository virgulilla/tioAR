import { useEffect, useState, useRef } from "react";

export default function useGeoPosition({
  simulate = false,
  simLocation = null,
} = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watchId = useRef(null);

  useEffect(() => {
    if (simulate && simLocation) {
      // modo simulación: actualiza con la posición simulada
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosition({
        latitude: simLocation.latitude,
        longitude: simLocation.longitude,
        accuracy: 5,
        timestamp: Date.now(),
      });
      return;
    }

    if (!("geolocation" in navigator)) {
      setError(new Error("Geolocalización no disponible"));
      return;
    }

    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setPosition({ latitude, longitude, accuracy, timestamp: pos.timestamp });
    };
    const fail = (err) => setError(err);

    try {
      watchId.current = navigator.geolocation.watchPosition(success, fail, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      });
    } catch (e) {
      setError(e);
    }

    return () => {
      if (watchId.current !== null)
        navigator.geolocation.clearWatch(watchId.current);
    };
  }, [simulate, simLocation]);

  return { position, error };
}
