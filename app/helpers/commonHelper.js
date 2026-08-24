export const getPrefix = (text, length = 3) => {

    return text
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim()
        .substring(0, length)
        // .split(/\s+/)
        // .map(word => word.substring(0, length))
        // .join("")
        .toUpperCase();

};

export const formatCurrency = (amount, currency) => {
    const decimalPlaces = Number(currency?.decimal_places ?? 2);

    let formatted = Number(amount).toFixed(decimalPlaces);

    // Decimal separator replace
    if (currency?.decimal_separator && currency.decimal_separator !== ".") {
        formatted = formatted.replace(".", currency.decimal_separator);
    }

    // Thousand separator
    const decimalSep = currency?.decimal_separator || ".";
    const parts = formatted.split(decimalSep);

    parts[0] = parts[0].replace(
        /\B(?=(\d{3})+(?!\d))/g,
        currency?.thousand_separator || ","
    );

    formatted = parts.join(decimalSep);

    if (currency?.symbol) {
        return currency.symbol_position === "before"
            ? `${currency.symbol}${formatted}`
            : `${formatted}${currency.symbol}`;
    }

    return formatted;
};

/*
|--------------------------------------------------------------------------
| Calculate Distance Between Coordinates
|--------------------------------------------------------------------------
|
| Returns distance in meters.
|
*/
export const calculateDistanceMeters = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const earthRadius = 6371000;

    const toRadians = (degrees) => {
        return degrees * Math.PI / 180;
    };

    const latitudeDifference = toRadians(lat2 - lat1);

    const longitudeDifference = toRadians(lon2 - lon1);

    const a =
        Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);


    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
};