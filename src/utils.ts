import { ScheduleSlot, ScheduleType } from './types';

export function flattenScheduleSlot(schedule: ScheduleSlot): ScheduleType {
  return <ScheduleType>{
    type: schedule.type,
    ...schedule.system,
    ...schedule.manual,
  };
}
