import {DateTime} from 'luxon';

export function getDuration(startStr: string, endStr: string) {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const duration = Math.abs(Number(end) - Number(start));

    const hours = Math.floor(duration / (60 * 60 * 1000));

    const minutes = (duration % (60 * 60 * 1000)) / (60 * 1000);

    return [
        hours ? `${hours}h` : undefined,
        minutes ? `${minutes}m` : undefined,
    ].join(' ').trim();
};

export function getTimeOfDay(date: Date, type: 'start' | 'end') {
    if (type === 'start')
        date.setHours(0, 0, 0, 0);
    else
        date.setHours(23, 59, 59, 999);

    return date.toISOString();
}

export function getTomorrow() {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow;
}

export function toDateTime(date: string | Date | object): DateTime {
    if (date instanceof Date)
        return DateTime.fromJSDate(date);

    if (typeof date === 'string')
        return DateTime.fromISO(date);

    if (typeof date === 'object')
        return DateTime.fromObject(date);

    throw new Error('Error during conversion to luxon DateTime');
}
