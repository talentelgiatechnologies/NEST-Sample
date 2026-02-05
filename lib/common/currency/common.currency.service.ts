import { Inject, Injectable } from '@nestjs/common';
import { CURRENCY, CURRENCY_RATES } from 'database/constants';
import { In, Repository } from 'typeorm';
import { CurrencyRate } from 'database/enitity/CurrencyRate.entity';
import { Currency } from 'database/enitity/Currency.entity';

@Injectable()
export class CommonCurrencyService {
    constructor(
        @Inject(CURRENCY)
        private readonly currencyRepository: Repository<Currency>,
        @Inject(CURRENCY_RATES)
        private readonly currencyRateRepository: Repository<CurrencyRate>,
    ) {}

    // Fetch currencies from Coinbase using native fetch
    async fetchCurrenciesFromCoinbase(base: string, currenciesFromDb: Currency[]) {
        const url = 'https://api.coinbase.com/v2/currencies';
        const response = await fetch(url);
        const data = await response.json();
        const currencies = data.data;

        // Save currencies in DB
        const currenciesDb: Currency[] = [];
        for (const coin of currencies) {
            const existingCurrency = currenciesFromDb.find((currency) => currency.currency == coin.id);
            const coinCreated = this.currencyRepository.create({
                id: existingCurrency?.id,
                currency: coin.id,
                isBase: coin.id === base ? 1 : 0, // Assuming USD is base for now
                isActive: Boolean(existingCurrency?.isActive) ? 1 : 0,
            });
            currenciesDb.push(coinCreated);
        }

        await this.currencyRepository.upsert(currenciesDb, { conflictPaths: ['currency'] });
    }

    // Fetch exchange rates from Coinbase using native fetch
    async fetchCurrencyRatesFromCoinbase(base: string, currenciesFromDb: Currency[]) {
        const url = 'https://api.coinbase.com/v2/exchange-rates?currency=' + base;
        const response = await fetch(url);
        const data = await response.json();
        const rates = data.data.rates;

        const currencies = currenciesFromDb;
        const rateDb: CurrencyRate[] = [];

        for (const targetCurrencyId in rates) {
            const rate = rates[targetCurrencyId];
            const targetCurrency = currencies.find((currency) => currency.currency == targetCurrencyId);
            const targetRate = targetCurrency?.targetRates[0];

            if (targetCurrency) {
                const currencyRate = new CurrencyRate();
                currencyRate.id = targetRate?.id;
                currencyRate.targetCurrencyId = targetCurrency.id;
                currencyRate.rate = parseFloat(rate);

                rateDb.push(currencyRate);
            }
        }

        await this.currencyRateRepository.upsert(rateDb, { conflictPaths: ['targetCurrencyId'] });
    }

    async getBaseCurrency() {
        return await this.currencyRepository.findOne({
            where: {
                isBase: 1,
            },
        });
    }

    async getCurrencyRate(currency: string[]) {
        return await this.currencyRateRepository.find({
            where: {
                targetCurrency: {
                    currency: In(currency),
                },
            },
            relations: {
                targetCurrency: true,
            },
        });
    }

    async populateCurrencyData() {
        // await this.currencyRateRepository.delete({})
        // await this.currencyRepository.delete({})
        const base = (await this.getBaseCurrency())?.currency || 'USD';
        const currencies = await this.currencyRepository.find();
        await this.fetchCurrenciesFromCoinbase(base, currencies);
    }

    async populateCurrencyRateData() {
        // await this.currencyRateRepository.delete({})
        // await this.currencyRepository.delete({})
        const base = (await this.getBaseCurrency())?.currency || 'USD';
        const currencies = await this.currencyRepository.find({
            relations: {
                targetRates: true,
            },
        });
        await this.fetchCurrencyRatesFromCoinbase(base, currencies);
    }
}
