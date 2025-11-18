import { useState, useEffect } from "react";

export default function useHeading() {
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    function handleOrientation(event) {
      let alpha = event.alpha;

      if (typeof event.webkitCompassHeading !== "undefined") {
        // iOS
        alpha = event.webkitCompassHeading;
      } else {
        // Android: alpha 0° = norte?
        alpha = 360 - alpha;
      }

      setHeading(alpha);
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation, true);
    }

    return () =>
      window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  return heading;
}
