import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { VALIDATION } from './constants';

export const getAgeFromDate = (date: Dayjs): number => dayjs().diff(date, 'year');

export interface DateOfBirthBounds {
    minDate: Dayjs;
    maxDate: Dayjs;
}

// minDate = oldest allowed birth date (AGE_MAX years ago)
// maxDate = most recent allowed birth date (AGE_MIN years ago)
export const getDateOfBirthBounds = (): DateOfBirthBounds => ({
    minDate: dayjs().subtract(VALIDATION.AGE_MAX, 'year'),
    maxDate: dayjs().subtract(VALIDATION.AGE_MIN, 'year'),
});
