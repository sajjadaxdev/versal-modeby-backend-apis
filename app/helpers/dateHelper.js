import dayjs from "dayjs";

import {
    DATE_FORMAT,
    DATE_FORMAT_SHORT,
    DATE_FORMAT_DB,
    TIME_FORMAT_12,
    TIME_FORMAT_24,
    DATE_TIME_FORMAT,
    DATE_TIME_FORMAT_SHORT,
    DATE_TIME_FORMAT_DB,
    MONTH_YEAR_FORMAT,
    MONTH_NAME_FORMAT,
    YEAR_FORMAT,
} from "../../config/app.js";

/*
|--------------------------------------------------------------------------
| Date
|--------------------------------------------------------------------------
*/

export const formatDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : null;

export const formatShortDate = (date) => date ? dayjs(date).format(DATE_FORMAT_SHORT) : null;

export const formatDatabaseDate = (date) => date ? dayjs(date).format(DATE_FORMAT_DB) : null;

/*
|--------------------------------------------------------------------------
| Time
|--------------------------------------------------------------------------
*/

export const formatTime12 = (date) => date ? dayjs(date).format(TIME_FORMAT_12) : null;

export const formatTime24 = (date) => date ? dayjs(date).format(TIME_FORMAT_24) : null;

/*
|--------------------------------------------------------------------------
| Date Time
|--------------------------------------------------------------------------
*/

export const formatDateTime = (date) => date ? dayjs(date).format(DATE_TIME_FORMAT) : null;

export const formatShortDateTime = (date) => date ? dayjs(date).format(DATE_TIME_FORMAT_SHORT) : null;

export const formatDatabaseDateTime = (date) => date ? dayjs(date).format(DATE_TIME_FORMAT_DB) : null;

/*
|--------------------------------------------------------------------------
| Month & Year
|--------------------------------------------------------------------------
*/

export const formatMonthYear = (date) => date ? dayjs(date).format(MONTH_YEAR_FORMAT) : null;

export const formatMonthName = (date) => date ? dayjs(date).format(MONTH_NAME_FORMAT) : null;

export const formatYear = (date) => date ? dayjs(date).format(YEAR_FORMAT) : null;


/*
|--------------------------------------------------------------------------
| Time Only (HH:MM:SS string)
|--------------------------------------------------------------------------
*/

export const formatTimeOnly12 = (time) => {
    if (!time) return null;
    return dayjs(`1970-01-01T${time}`).format(TIME_FORMAT_12);
};

export const formatTimeOnly24 = (time) => {
    if (!time) return null;
    return dayjs(`1970-01-01T${time}`).format(TIME_FORMAT_24);
};

/*
|--------------------------------------------------------------------------
| Utilities
|--------------------------------------------------------------------------
*/

export const now = () => dayjs();

export const today = () => dayjs().format(DATE_FORMAT_DB);

export const currentDateTime = () => dayjs().format(DATE_TIME_FORMAT_DB);

export const addDays = (date, days) => dayjs(date).add(days, "day");

export const subtractDays = (date, days) => dayjs(date).subtract(days, "day");

export const addMonths = (date, months) => dayjs(date).add(months, "month");

export const subtractMonths = (date, months) => dayjs(date).subtract(months, "month");

export const addYears = (date, years) => dayjs(date).add(years, "year");

export const subtractYears = (date, years) => dayjs(date).subtract(years, "year");

export const diffInDays = (from, to) => dayjs(to).diff(dayjs(from), "day");

export const diffInMonths = (from, to) => dayjs(to).diff(dayjs(from), "month");

export const diffInYears = (from, to) => dayjs(to).diff(dayjs(from), "year");

export const isToday = (date) => dayjs(date).isSame(dayjs(), "day");

export const isPast = (date) => dayjs(date).isBefore(dayjs());

export const isFuture = (date) => dayjs(date).isAfter(dayjs());

/*
|--------------------------------------------------------------------------
| Difference
|--------------------------------------------------------------------------
*/

export const diffInSeconds = (from, to) => {

    if (!from || !to) {
        return 0;
    }

    return dayjs(to).diff(
        dayjs(from),
        "second"
    );
};