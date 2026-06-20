/**
 * Kind of academic event placed on the calendar. Closed union keeps the form
 * and the day-cell color-coding type-safe.
 */
export type EventType = 'exam' | 'task' | 'class' | 'reminder';

export const EVENT_TYPES: ReadonlyArray<{ value: EventType; labelKey: string; icon: string }> = [
  { value: 'exam', labelKey: 'scheduling.type.exam', icon: 'quiz' },
  { value: 'task', labelKey: 'scheduling.type.task', icon: 'task_alt' },
  { value: 'class', labelKey: 'scheduling.type.class', icon: 'school' },
  { value: 'reminder', labelKey: 'scheduling.type.reminder', icon: 'notifications' },
];
