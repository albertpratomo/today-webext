import {useDateFormat, useNow} from '@vueuse/core';
import type Task from '~/models/Task';
import {getTomorrow} from '~/utils/date';

export function taskBuckets(task: Task) {
    const buckets = [];

    if (task.scheduledFor === null && task.projectId === 'inbox')
        buckets.push('inbox');

    if (task.projectId !== 'inbox' && (task.scheduledFor === null || task.scheduledFor !== 'later'))
        buckets.push('active');

    if (task.scheduledFor === 'later')
        buckets.push('later');

    const currentDate = useNow();
    if (task.scheduledFor != null && new Date(task.scheduledFor) <= currentDate.value)
        buckets.push('today');

    const tomorrowsDate = useDateFormat(getTomorrow(), 'YYYY-MM-DD');
    if (task.scheduledFor === tomorrowsDate.value)
        buckets.push('tomorrow');

    return buckets;
}
