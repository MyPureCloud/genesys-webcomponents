import {
  getClampedMonthValue,
  incrementDay,
  incrementMonth,
  incrementYear,
  getFormattedDate
} from '../gux-datepicker.service';

describe('datepicker.service', () => {
  describe('getClampedMonthValue', () => {
    [
      {
        input: -100,
        expectedOutput: 8
      },
      {
        input: -10,
        expectedOutput: 2
      },
      {
        input: -1,
        expectedOutput: 11
      },
      {
        input: 0,
        expectedOutput: 0
      },
      {
        input: 1,
        expectedOutput: 1
      },
      {
        input: 10,
        expectedOutput: 10
      },
      {
        input: 12,
        expectedOutput: 0
      },
      {
        input: 100,
        expectedOutput: 4
      }
    ].forEach(({ input, expectedOutput }) => {
      it(`should output ${expectedOutput} for ${input}`, () => {
        expect(getClampedMonthValue(input)).toEqual(expectedOutput);
      });
    });
  });

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
      },
      {
        increment: 1,
        inputDate: new Date(2021, 6, 1),
        expectedOutput: new Date(2021, 7, 1)
      },
      {
        increment: -1,
        inputDate: new Date(2021, 7, 1),
        expectedOutput: new Date(2021, 6, 1)
      },
      {
        increment: 1,
        inputDate: new Date(2021, 2, 31),
        expectedOutput: new Date(2021, 3, 30)
      },
      {
        increment: -1,
        inputDate: new Date(2022, 2, 31),
        expectedOutput: new Date(2022, 1, 28)
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

  describe('getFormattedDate', () => {
    [
      {
        inputDate: new Date(2021, 0, 1),
        format: 'dd/mm/yyyy',
        expectedOutput: '01/01/2021'
      },
      {
        inputDate: new Date(2021, 0, 1),
        format: 'yyyy/mm/dd',
        expectedOutput: '2021/01/01'
      },
      {
        inputDate: new Date(2021, 2, 31),
        format: 'mm/dd/yyyy',
        expectedOutput: '03/31/2021'
      },
      {
        inputDate: new Date(2021, 0, 1),
        format: 'dd/mm/yy',
        expectedOutput: '01/01/21'
      },
      {
        inputDate: new Date(2021, 2, 31),
        format: 'yyyy-mm-dd',
        expectedOutput: '2021-03-31'
      },
      {
        inputDate: new Date(2021, 2, 31),
        format: 'yyyy.mm.dd',
        expectedOutput: '2021.03.31'
      }
    ].forEach(({ inputDate, format, expectedOutput }) => {
      it(`should output ${expectedOutput} for ${inputDate} and a format of ${format}`, () => {
        expect(getFormattedDate(inputDate, format)).toEqual(expectedOutput);
      });
    });
  });
});
