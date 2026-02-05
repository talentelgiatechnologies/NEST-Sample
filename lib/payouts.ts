import { PayoutType } from "database/enitity/PayoutDetails.entity";

export const payoutTypes = [
    
    {
        id: 1,
        type: PayoutType.PAYPAL,
        duration: "3-4 hours",
        currency: "USD",
        details: "Connect your existing PayPal account."
    },
    {
        id: 2,
        type: PayoutType.STRIPE,
        duration: "5-7 Business days",
        currency: "USD",
        details: "Add your bank details"
    }
] as const;