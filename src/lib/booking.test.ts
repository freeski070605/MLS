import { describe,it,expect } from 'vitest';
import { appointmentMinutes,bookingSlotLockIds,depositAmount,localStart } from './booking';
import { canManage } from './permissions';
import { priceLabel } from './site';
describe('booking calculations',()=>{
  it('calculates flat and percentage deposits without exceeding price',()=>{expect(depositAmount('NONE',null,10000)).toBe(0);expect(depositAmount('FLAT',3000,10000)).toBe(3000);expect(depositAmount('FLAT',12000,10000)).toBe(10000);expect(depositAmount('PERCENT',25,10000)).toBe(2500)});
  it('includes buffers and selected options in reserved time',()=>{expect(appointmentMinutes(60,10,15,30)).toBe(115)});
  it('locks every overlapping quarter-hour bucket without locking adjacent intervals',()=>{const start=new Date('2026-10-06T13:05:00Z'),middle=new Date('2026-10-06T13:16:00Z'),boundary=new Date('2026-10-06T13:15:00Z'),end=new Date('2026-10-06T13:30:00Z');expect(bookingSlotLockIds('artist-1',start,middle)).toEqual(bookingSlotLockIds('artist-1',new Date('2026-10-06T13:14:00Z'),end).slice(0,2));expect(bookingSlotLockIds('artist-1',new Date('2026-10-06T13:00:00Z'),boundary)).not.toContain(bookingSlotLockIds('artist-1',boundary,end)[0])});
  it('rejects nonexistent local times at daylight saving transitions',()=>{expect(()=>localStart('2026-03-08','02:30')).toThrow()});
  it('formats flexible prices accurately',()=>{expect(priceLabel({priceType:'STARTING',priceMin:10000,priceMax:null})).toBe('Starting at $100');expect(priceLabel({priceType:'RANGE',priceMin:5000,priceMax:7000})).toBe('$50–$70');expect(priceLabel({priceType:'VARIES',priceMin:null,priceMax:null})).toBe('Price varies')});
});
describe('artist permissions',()=>{it('limits artist access to their own record',()=>{expect(canManage('OWNER')).toBe(true);expect(canManage('ARTIST','artist-1','artist-1')).toBe(true);expect(canManage('ARTIST','artist-2','artist-1')).toBe(false);expect(canManage('CLIENT','artist-1','artist-1')).toBe(false)})});
