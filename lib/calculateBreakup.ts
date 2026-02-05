import { COUPON_CODE_TYPE_ENUM } from "database/enitity/CouponCode.entity";

export function calculateBreakup(basePrice: number, guests: number, vatResponsible: boolean, guestFeePer: number, hostFeePer: number, couponValue?: number, couponType?: COUPON_CODE_TYPE_ENUM,credits?: number) {
    const vat = 0.19;
    const host = hostCalculateBreakup(basePrice || 0, guests, vatResponsible, guestFeePer, hostFeePer, couponValue, couponType, credits);
    console.log({ host, hostFeePer, vatResponsible, basePrice });


    const vatBasePrice = vatResponsible ? (basePrice * vat) : host.vatHostServiceFee;
    const totalBasePrice = Number((basePrice + vatBasePrice).toFixed(2));

    const multiGuestPrice = totalBasePrice * guests;

    const guestServiceFee = multiGuestPrice * guestFeePer / 100;
    const vatGuestServiceFee = guestServiceFee * vat;

    const total = multiGuestPrice + guestServiceFee + vatGuestServiceFee;

    const discount = Number((couponValue ? (couponType === COUPON_CODE_TYPE_ENUM.FIXED ? (couponValue > total ? total : couponValue) : ((couponValue / 100) * total)) : 0).toFixed(2));

    const discountedTotal = Number((total - discount).toFixed(2));

    const creditsAppliedTotal = (credits && !couponValue) ? (credits > discountedTotal ? 0 : (discountedTotal - credits)) : discountedTotal;

    const creditsApplied = (credits && !couponValue) ? (credits > discountedTotal ? discountedTotal : credits) : 0;

    let balanceCredits = couponValue ? (couponValue > total ? (couponValue - total) : 0) : 0;
    balanceCredits = (credits && !discount) ? (credits > discountedTotal ? (credits - discountedTotal) + balanceCredits : balanceCredits) : balanceCredits;
    console.log({
        discountedTotal,
        couponValue,
        discount
    });
    
    return {
        total: Number(total.toFixed(2)),
        totalBasePrice,
        multiGuestPrice,
        guestServiceFee,
        vatGuestServiceFee,
        vatBasePrice,
        creditsApplied,
        host,
        singleBasePrice: basePrice,
        multiBasePrice: basePrice * guests,
        balanceCredits,
        discountedTotal,
        creditsAppliedTotal,
        discount
    };


}

export function hostCalculateBreakup(basePrice: number, guests: number, vatResponsible: boolean, guestFeePer: number, hostFeePer: number, couponValue?: number, couponType?: COUPON_CODE_TYPE_ENUM, credits?: number) {
    const vat = 0.19;
    // hostFeePer = 25;
    // vatResponsible = true;
    const vatBasePrice = vatResponsible ? (basePrice * vat) : 0;
    const totalBasePrice = Number((basePrice).toFixed(2));

    const multiGuestPrice = totalBasePrice * guests;

    const hostServiceFee = multiGuestPrice * hostFeePer / 100;
    const vatHostServiceFee = hostServiceFee * vat;

    const total = multiGuestPrice - hostServiceFee;

    const afterServiceFee = !vatResponsible ? 0 : total * vat;

    const finalPayoout = afterServiceFee + total;

     const discount = Number((couponValue ? (couponType === COUPON_CODE_TYPE_ENUM.FIXED ? (couponValue > total ? total : couponValue) : ((couponValue / 100) * total)) : 0).toFixed(2));

    const discountedTotal = Number((total - discount).toFixed(2));


     const creditsAppliedTotal = (credits && !discount) ? (credits > discountedTotal ? 0 : (discountedTotal - credits)) : discountedTotal;

    const creditsApplied = (credits && !discount) ? (credits > discountedTotal ? discountedTotal : credits) : 0;

    let balanceCredits = couponValue ? (couponValue > total ? (couponValue - total) : 0) : 0;
    balanceCredits = (credits && !discount) ? (credits > discountedTotal ? (credits - discountedTotal) + balanceCredits : balanceCredits) : balanceCredits;

    return {
        total: Number(total.toFixed(2)),
        totalBasePrice,
        multiGuestPrice,
        hostServiceFee,
        vatHostServiceFee,
        vatBasePrice,
        finalPayoout,
        afterServiceFee,
        balanceCredits,
        discountedTotal,
        creditsAppliedTotal,
        discount,
        creditsApplied
    };


}