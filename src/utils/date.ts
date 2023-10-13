export function getDuration(start: Date, end: Date) {
    const duration = Math.abs(Number(end) - Number(start));

    const hours = Math.floor(duration / (60 * 60 * 1000));

    const minutes = (duration % (60 * 60 * 1000)) / (60 * 1000);

    return [
        hours ? `${hours}h` : undefined,
        minutes ? `${minutes}m` : undefined,
    ].join(' ');
};

export function getTimeOfDay(date: Date, type: 'start' | 'end') {
    if (type === 'start')
        date.setHours(0, 0, 0, 0);
    else
        date.setHours(23, 59, 59, 999);

    return date.toISOString();
}
