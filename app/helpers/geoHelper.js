export const calculateDistanceKm = (
    lat1,
    lng1,
    lat2,
    lng2
) => {

    if (
        lat1 == null ||
        lng1 == null ||
        lat2 == null ||
        lng2 == null
    ) {
        return null;
    }

    const R = 6371;

    const dLat =
        (Number(lat2) - Number(lat1)) *
        Math.PI / 180;

    const dLng =
        (Number(lng2) - Number(lng1)) *
        Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(Number(lat1) * Math.PI / 180) *
        Math.cos(Number(lat2) * Math.PI / 180) *

        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
};

export const calculateEtaMinutes = (
    distanceKm,
    speedKmh
) => {

    if (!distanceKm || distanceKm <= 0) {
        return 0;
    }

    let speed = Number(speedKmh);

    // GPS speed unreliable / zero
    if (!speed || speed <= 5) {
        speed = 25;
    }

    const hours = distanceKm / speed;

    return Math.max(
        1,
        Math.ceil(hours * 60)
    );
};