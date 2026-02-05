import { CURRENCY, CURRENCY_RATES, DATA_SOURCE } from "database/constants";
import { Currency } from "database/enitity/Currency.entity";
import { CurrencyRate } from "database/enitity/CurrencyRate.entity";
import { DataSource } from "typeorm";

export const commonCurrencyProviders = [
    {
        provide: CURRENCY_RATES,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CurrencyRate),
        inject: [DATA_SOURCE],
    },
    {
        provide: CURRENCY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Currency),
        inject: [DATA_SOURCE],
    },
   
];