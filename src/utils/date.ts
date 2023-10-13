export function getDuration(start: Date, end: Date) {
    const duration = Math.abs(Number(end) - Number(start));

    const hours = Math.floor(duration / (60 * 60 * 1000));

    const minutes = (duration % (60 * 60 * 1000)) / (60 * 1000);

    return [
        hours ? `${hours}h` : undefined,
        minutes ? `${minutes}m` : undefined,
    ].join(' ');
};
