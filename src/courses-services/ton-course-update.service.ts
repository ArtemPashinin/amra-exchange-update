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
    const aedRate = tonRates.prices.USD * 3.67;
    await Promise.all([
      this.currencyExchangeService.updateCourse(
        'TON',
        'RUB',
        tonRates.prices.RUB,
      ),
      this.currencyExchangeService.updateCourse(
        'TON',
        'USD',
        tonRates.prices.USD,
      ),
      this.currencyExchangeService.updateCourse('TON', 'AED', aedRate),
      this.currencyExchangeService.updateCourse(
        'RUB',
        'TON',
        rubRates.prices.TON,
      ),
      this.currencyExchangeService.updateCourse(
        'USD',
        'TON',
        usdRates.prices.TON,
      ),
      this.currencyExchangeService.updateCourse('AED', 'TON', 1 / aedRate),
    ]);
  }

  public getTasks() {
    return [this.updateTon()];
  }
}
