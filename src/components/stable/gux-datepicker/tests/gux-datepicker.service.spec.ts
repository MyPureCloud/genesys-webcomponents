import {
  incrementDay,
  incrementMonth,
  incrementYear
} from '../gux-datepicker.service';

describe('datepicker.service', () => {
  describe('incrementDay', () => {
    [
      // Start of month
      {
        increment: 1,
        numberOfIncrements: 1,
        inputDate: new Date(2021, 0, 1),
        expectedOutput: new Date(2021, 0, 2)
      },
      {
        increment: -1,
        numberOfIncrements: 1,
        inputDate: new Date(2021, 0, 1),
        expectedOutput: new Date(2021, 0, 31)
      },
      // End of month
      {
        increment: 1,
        numberOfIncrements: 1,
        inputDate: new Date(2021, 0, 31),
        expectedOutput: new Date(2021, 0, 1)
      },
      {
        increment: -1,
        numberOfIncrements: 1,
        inputDate: new Date(2021, 0, 31),
        expectedOutput: new Date(2021, 0, 30)
      },
      // Not a leap year
      {
        increment: 1,
        numberOfIncrements: 30,
        inputDate: new Date(2021, 1, 1),
        expectedOutput: new Date(2021, 1, 3)
      },
      {
        increment: -1,
        numberOfIncrements: 30,
        inputDate: new Date(2021, 1, 1),
        expectedOutput: new Date(2021, 1, 27)
      },
      // Leap year
      {
        increment: 1,
        numberOfIncrements: 30,
        inputDate: new Date(2020, 1, 1),
        expectedOutput: new Date(2020, 1, 2)
      },
      {
        increment: -1,
        numberOfIncrements: 30,
        inputDate: new Date(2020, 1, 1),
        expectedOutput: new Date(2020, 1, 29)
      },
      // DST Spring
      {
        increment: 1,
        numberOfIncrements: 31,
        inputDate: new Date(2021, 2, 1),
        expectedOutput: new Date(2021, 2, 1)
      },
      {
        increment: -1,
        numberOfIncrements: 31,
        inputDate: new Date(2021, 2, 1),
        expectedOutput: new Date(2021, 2, 1)
      },
      // DST Autumn/Fall
      {
        increment: 1,
        numberOfIncrements: 31,
        inputDate: new Date(2021, 9, 1),
        expectedOutput: new Date(2021, 9, 1)
      },
      {
        increment: -1,
        numberOfIncrements: 31,
        inputDate: new Date(2021, 9, 1),
        expectedOutput: new Date(2021, 9, 1)
      }
    ].forEach(
      ({ increment, numberOfIncrements, inputDate, expectedOutput }) => {
        it(`should output ${expectedOutput} for ${inputDate} and an increment of ${increment} ${numberOfIncrements} times`, () => {
          let date = inputDate;
          for (let i = 0; i < numberOfIncrements; i++) {
            date = incrementDay(increment, date);
          }
          expect(date).toEqual(expectedOutput);
        });
      }
    );
  });

  describe('incrementMonth', () => {
    [
      {
        increment: 1,
        inputDate: new Date(2021, 0, 1),
        expectedOutput: new Date(2021, 1, 1)
      },
      {
        increment: -1,
        inputDate: new Date(2021, 0, 1),
        expectedOutput: new Date(2021, 11, 1)
      },
      {
        increment: 1,
        inputDate: new Date(2021, 11, 1),
        expectedOutput: new Date(2021, 0, 1)
      },
      {
        increment: -1,
        inputDate: new Date(2021, 11, 1),
        expectedOutput: new Date(2021, 10, 1)
      }
    ].forEach(({ increment, inputDate, expectedOutput }) => {
      it(`should output ${expectedOutput} for ${inputDate} and an increment of ${increment}`, () => {
        expect(incrementMonth(increment, inputDate)).toEqual(expectedOutput);
      });
    });
  });

  describe('incrementYear', () => {
    [
      {
        increment: 1,
        inputDate: new Date(2021, 0, 1),
        expectedOutput: new Date(2022, 0, 1)
      },
      {
        increment: -1,
        inputDate: new Date(2021, 0, 1),
        expectedOutput: new Date(2020, 0, 1)
      }
    ].forEach(({ increment, inputDate, expectedOutput }) => {
      it(`should output ${expectedOutput} for ${inputDate} and an increment of ${increment}`, () => {
        expect(incrementYear(increment, inputDate)).toEqual(expectedOutput);
      });
    });
  });
});
