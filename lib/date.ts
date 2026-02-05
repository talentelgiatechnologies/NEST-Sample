import { eachDayOfInterval, format, parseISO, addDays, subDays } from 'date-fns';

export function dateRange(from: string, to: string) {
    const startDate = parseISO(from);
    const endDate = parseISO(to);

    // Shift the interval to exclude boundaries
    const range = eachDayOfInterval({
        start: addDays(startDate, 1),
        end: subDays(endDate, 1),
    }).map(date => format(date, 'yyyy-MM-dd'));

    return [from, ...range, to];
}
