import { describe,expect,it } from 'vitest';
import { fromBusinessLocalInput,minutesToTime,timeToMinutes,toBusinessLocalInput } from './admin-time';
describe('business schedule inputs',()=>{
 it('converts a normal range without exposing stored minutes',()=>{expect(minutesToTime(540)).toBe('09:00');expect(timeToMinutes('17:30')).toBe(1050)});
 it('rejects invalid clock values',()=>{expect(()=>timeToMinutes('25:00')).toThrow();expect(()=>minutesToTime(-1)).toThrow()});
 it('round trips a business local timestamp',()=>{const utc=fromBusinessLocalInput('2026-10-14T14:30','America/New_York');expect(utc).toBe('2026-10-14T18:30:00.000Z');expect(toBusinessLocalInput(utc!,'America/New_York')).toBe('2026-10-14T14:30')});
 it('rejects a daylight saving gap',()=>{expect(()=>fromBusinessLocalInput('2026-03-08T02:30','America/New_York')).toThrow()});
});
