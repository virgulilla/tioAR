// useGeoPosition.js
import { useEffect, useState, useRef } from "react";

export default function useGeoPosition(
  options = { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(new Error("Geolocalización no disponible en este navegador."));
      return;
    }

    const success = (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      setPosition({ latitude, longitude, accuracy, timestamp: pos.timestamp });
    };

    const fail = (err) => {
      setError(err);
    };

    // pedir permiso y empezar a vigilar
    navigator.permissions
      ?.query?.({ name: "geolocation" })
      .then(() => {
        watchIdRef.current = navigator.geolocation.watchPosition(
          success,
          fail,
          options
        );
      })
      .catch(() => {
        // si no existe permissions API, igual intentamos
        watchIdRef.current = navigator.geolocation.watchPosition(
          success,
          fail,
          options
        );
      });

    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [
    options,
    options.enableHighAccuracy,
    options.maximumAge,
    options.timeout,
  ]);

  return { position, error };
}
