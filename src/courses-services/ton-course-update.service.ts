import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';
import { CurrencyExchangeService } from '../currency-exchange.service';
import { Fee } from 'src/enums/fee.enum';

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
    const lowerAedRate = tonRates.prices.USD * 3.64;
    const upperAedRate = tonRates.prices.USD * 3.7;
    await Promise.all([
      this.currencyExchangeService.updateCourse(
        'TON',
        'RUB',
        tonRates.prices.RUB - tonRates.prices.RUB * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'TON',
        'USD',
        tonRates.prices.USD - tonRates.prices.USD * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'TON',
        'AED',
        lowerAedRate - lowerAedRate * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'RUB',
        'TON',
        rubRates.prices.TON - rubRates.prices.TON * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'USD',
        'TON',
        usdRates.prices.TON - usdRates.prices.TON * Fee.CRYPTO,
      ),
      this.currencyExchangeService.updateCourse(
        'AED',
        'TON',
        1 / upperAedRate - (1 / upperAedRate) * Fee.CRYPTO,
      ),
    ]);
  }

  public getTasks() {
    return [this.updateTon()];
  }
}
