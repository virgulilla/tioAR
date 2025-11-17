export function toRad(deg) {
  return (deg * Math.PI) / 180;
}
export function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1),
    Δλ = toRad(lon2 - lon1);
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function bearingDegrees(lat1, lon1, lat2, lon2) {
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const λ1 = toRad(lon1),
    λ2 = toRad(lon2);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  let θ = toDeg(Math.atan2(y, x));
  return (θ + 360) % 360;
}
