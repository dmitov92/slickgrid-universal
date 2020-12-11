import { Column } from '../../interfaces/index';
import { Formatters } from '../index';

describe('the DateTimeShortIso Formatter', () => {
  it('should return null when no value is provided', () => {
    const value = null;
    const result = Formatters.dateTimeShortIso(0, 0, value, {} as Column, {}, {} as any);
    expect(result).toBe(null);
  });

  it('should return original string when input value provided is not a valid date', () => {
    const value = 'TBD';
    const result = Formatters.dateTimeShortIso(0, 0, value, {} as Column, {}, {} as any);
    expect(result).toBe('TBD');
  });

  it('should provide a dateIso formatted input and return a formatted date value without time when valid date value is provided', () => {
    const value = '2019-05-01 02:36:07';
    const result = Formatters.dateTimeShortIso(0, 0, value, { input: 'dateIso' } as unknown as Column, {}, {} as any);
    expect(result).toBe('2019-05-01 02:36');
  });

  it('should return a formatted date value in the morning when valid date value is provided', () => {
    const value = new Date('2019-05-01T02:36:07');
    const result = Formatters.dateTimeShortIso(0, 0, value, {} as Column, {}, {} as any);
    expect(result).toBe('2019-05-01 02:36');
  });

  it('should return a formatted date value in the afternoon when valid date value is provided', () => {
    const value = new Date('2019-05-01T20:36:07');
    const result = Formatters.dateTimeShortIso(0, 0, value, {} as Column, {}, {} as any);
    expect(result).toBe('2019-05-01 20:36');
  });
});
