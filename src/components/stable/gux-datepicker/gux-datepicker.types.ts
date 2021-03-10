import { CalendarModes } from '../../../common-enums';

export type GuxDatepickerMode = CalendarModes.Single | CalendarModes.Range;

export type GuxDatepickerIntervalRange = {
  selectionStart: number;
  selectionEnd: number;
};
