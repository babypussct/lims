import { DUTY_SCHEDULE_DATA } from '../src/app/features/duty-stats/duty-schedule.data';
import {
  aggregateDutyPeople,
  countDutyAssignments,
} from '../src/app/features/duty-stats/duty-stats.utils';

const ranking = aggregateDutyPeople(DUTY_SCHEDULE_DATA.shifts);

console.log(JSON.stringify({
  sourceFiles: DUTY_SCHEDULE_DATA.sourceFiles.length,
  shifts: DUTY_SCHEDULE_DATA.shifts.length,
  assignments: countDutyAssignments(DUTY_SCHEDULE_DATA.shifts),
  people: ranking.length,
  unresolvedFragments: DUTY_SCHEDULE_DATA.unresolvedFragments,
  ranking: ranking.map(item => ({ name: item.name, count: item.count })),
}, null, 2));
