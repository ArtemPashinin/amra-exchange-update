import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';

@Injectable()
export class TonUpdateCourseService {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
  ) {}

  public async updateTon(): Promise<void> {
    const {
      TON: tonRates,
      USD: usdRates,
      RUB: rubRates,
    } = await this.appService.getTonCourse(
      ['TON', 'USD', 'RUB'],
      ['RUB', 'USD', 'TON'],
    );
    console.log(
      'Before',
      tonRates.prices.RUB,
      '; After: ',
      tonRates.prices.RUB - tonRates.prices.RUB * 0.005,
    );
    console.log(
      'Before',
      rubRates.prices.TON,
      '; After: ',
      rubRates.prices.TON - rubRates.prices.TON * 0.005,
    );
    const lowerAedRate = tonRates.prices.USD * 3.64;
    const upperAedRate = tonRates.prices.USD * 3.7;
    await Promise.all([
      this.currencyExchangeService.updateCourse(
        'TON',
        'RUB',
        tonRates.prices.RUB - tonRates.prices.RUB * 0.005,
      ),
      this.currencyExchangeService.updateCourse(
        'TON',
        'USD',
        tonRates.prices.USD - tonRates.prices.USD * 0.005,
      ),
      this.currencyExchangeService.updateCourse(
        'TON',
        'AED',
        lowerAedRate - lowerAedRate * 0.005,
      ),
      this.currencyExchangeService.updateCourse(
        'RUB',
        'TON',
        rubRates.prices.TON - rubRates.prices.TON * 0.005,
      ),
      this.currencyExchangeService.updateCourse(
        'USD',
        'TON',
        usdRates.prices.TON - usdRates.prices.TON * 0.005,
      ),
      this.currencyExchangeService.updateCourse(
        'AED',
        'TON',
        1 / upperAedRate - (1 / upperAedRate) * 0.005,
      ),
    ]);
  }

  public getTasks() {
    return [this.updateTon()];
  }
}
