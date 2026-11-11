export const shanteLocBookingPolicies = {
  deposit: {amount:25,nonRefundable:true,appliedToBalance:true},
  paymentMethods: ['Cash','Cash App','Apple Pay'],
  travel: {from:25,description:'Travel fee starts at $25 and varies by location.'},
  sameDay: {additional:50,description:'Same-day bookings have an additional $50 fee.'},
  clientLate: [{minutes:15,fee:25},{minutes:30,fee:50}],
  artistLate: [{minutes:15,discount:25},{minutes:30,discount:50}]
} as const;

export const shanteLocPolicySections=[
  {title:'Booking deposit',body:'A $25 non-refundable booking deposit is required and will be applied toward your final balance.'},
  {title:'Accepted payments',body:'Cash, Cash App, and Apple Pay are accepted.'},
  {title:'Travel',body:'Travel appointments have a fee starting at $25, based on location.'},
  {title:'Same-day appointments',body:'Same-day booking carries an additional $50 fee.'},
  {title:'If you arrive late',body:'15 minutes late: an additional $25. 30 minutes late: an additional $50.'},
  {title:'If Shante is late',body:'If Shante is 15 minutes late, $25 is taken off. If Shante is 30 minutes late, $50 is taken off the entire style.'}
] as const;

export const shanteLocPolicyText=shanteLocPolicySections.map(s=>s.title+'\n'+s.body).join('\n\n');
