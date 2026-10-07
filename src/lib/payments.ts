import Stripe from 'stripe';
import { siteUrl } from './site';
export type DepositCheckout={appointmentId:string;reference:string;email:string;serviceName:string;amount:number};
export interface PaymentProvider { name:string; createDepositCheckout(input:DepositCheckout):Promise<{url:string|null;reference:string}>; verifyWebhook(payload:string,signature:string):Promise<{event:string;reference?:string;appointmentId?:string}> }
export class StripePaymentProvider implements PaymentProvider {
  name='stripe';private stripe:Stripe;
  constructor(secret:string,private webhookSecret?:string){this.stripe=new Stripe(secret)}
  async createDepositCheckout(input:DepositCheckout){const checkout=await this.stripe.checkout.sessions.create({mode:'payment',customer_email:input.email,line_items:[{price_data:{currency:'usd',unit_amount:input.amount,product_data:{name:`Deposit: ${input.serviceName}`}},quantity:1}],success_url:`${siteUrl}/book/confirmation?reference=${encodeURIComponent(input.reference)}&payment=success`,cancel_url:`${siteUrl}/book/confirmation?reference=${encodeURIComponent(input.reference)}&payment=cancelled`,metadata:{appointmentId:input.appointmentId}});return {url:checkout.url,reference:checkout.id}}
  async verifyWebhook(payload:string,signature:string){if(!this.webhookSecret)throw new Error('Webhook unconfigured');const event=this.stripe.webhooks.constructEvent(payload,signature,this.webhookSecret);if(event.type==='checkout.session.completed'){const session=event.data.object as Stripe.Checkout.Session;return {event:'deposit_paid',reference:session.id,appointmentId:session.metadata?.appointmentId}}return {event:'ignored'}}
}
export function paymentProvider():PaymentProvider|null{return process.env.STRIPE_SECRET_KEY?new StripePaymentProvider(process.env.STRIPE_SECRET_KEY,process.env.STRIPE_WEBHOOK_SECRET):null}
