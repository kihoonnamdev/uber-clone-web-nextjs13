import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

export async function POST(request: any) {
  const data: any = await request.json();
  const amount = data.amount;

  try{
    const paymentIntent=await stripe.paymentIntents.create({
        amount:Number(amount)*100,
        currency:'USD'
    })
  }
}
