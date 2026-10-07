import { DateTime } from 'luxon';
export function minutesToTime(minutes:number){if(!Number.isInteger(minutes)||minutes<0||minutes>1440)throw new Error('Invalid time');return `${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`}
export function timeToMinutes(time:string){if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw new Error('Choose a valid time');const [hour,minute]=time.split(':').map(Number);return hour*60+minute}
export function toBusinessLocalInput(iso:string,zone:string){const date=DateTime.fromISO(iso).setZone(zone);if(!date.isValid)throw new Error('Invalid date');return date.toFormat("yyyy-MM-dd'T'HH:mm")}
export function fromBusinessLocalInput(value:string,zone:string){const date=DateTime.fromISO(value,{zone});if(!date.isValid||date.toFormat("yyyy-MM-dd'T'HH:mm")!==value)throw new Error('Choose a valid local date and time');return date.toUTC().toISO()}
