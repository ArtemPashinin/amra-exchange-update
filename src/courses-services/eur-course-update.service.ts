import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';
import { Fee } from 'src/enums/fee.enum';

@Injectable()
export class EurUpdateCourseService {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  public async updateEur(): Promise<void> {
    const {
      TON: tonRates,
      USD: usdRates,
      RUB: rubRates,
      EUR: eurRates,
      BTC: btcRates,
      ETH: ethRates,
      AED: aedRates,
    } = await this.appService.getTonCourse(
      ['EUR', 'RUB', 'USD', 'BTC', 'AED', 'TON', 'ETH'],
      ['EUR', 'RUB', 'USD', 'BTC', 'AED', 'TON', 'ETH'],
    );
    console.log(eurRates.prices.RUB);
    console.log('----');
    console.log(rubRates.prices.EUR);
    await Promise.all([
      this.currencyExchangeService.updateCourse(
        'EUR',
        'RUB',
        eurRates.prices.RUB,
      ),
      this.currencyExchangeService.updateCourse(
        'EUR',
        'USD',
        eurRates.prices.USD,
      ),
      this.currencyExchangeService.updateCourse(
        'EUR',
        'USDT',
        eurRates.prices.USD - eurRates.prices.USD * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'EUR',
        'BTC',
        eurRates.prices.BTC - eurRates.prices.BTC * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'EUR',
        'ETH',
        eurRates.prices.ETH - eurRates.prices.ETH * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'EUR',
        'AED',
        eurRates.prices.AED,
      ),
      this.currencyExchangeService.updateCourse(
        'EUR',
        'TON',
        eurRates.prices.TON - eurRates.prices.TON * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'RUB',
        'EUR',
        rubRates.prices.EUR,
      ),
      this.currencyExchangeService.updateCourse(
        'BTC',
        'EUR',
        btcRates.prices.EUR - btcRates.prices.EUR * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'ETH',
        'EUR',
        ethRates.prices.EUR - ethRates.prices.EUR * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'TON',
        'EUR',
        tonRates.prices.EUR - tonRates.prices.EUR * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'AED',
        'EUR',
        aedRates.prices.EUR,
      ),
      this.currencyExchangeService.updateCourse(
        'USD',
        'EUR',
        usdRates.prices.EUR,
      ),
      this.currencyExchangeService.updateCourse(
        'USDT',
        'EUR',
        usdRates.prices.EUR - usdRates.prices.EUR * Fee.CRYPTO,
      ),
    ]);
  }

  public getTasks() {
    return [this.updateEur()];
  }
}
