import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrencyExchangeService } from './currency-exchange.service';
import { RubUpdateCourseService } from './courses-services/rub-course-update.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly currencyExchangeService: CurrencyExchangeService,
    private readonly updateCourseService: RubUpdateCourseService,
  ) {}

  @Get()
  public async getCurrency() {
    console.log(await this.appService.getOffer('USDT', 'RUB'));
    // await this.updateCourseService.updateUsdtRub();
    // await this.updateCourseService.updateEthRub();
    // await this.updateCourseService.updateBtcRub();
  }

  @Get('course/:id?')
  public async test(@Param('id', ParseIntPipe) id?: number) {
    return await this.currencyExchangeService.findCurrencyToRub(id);
  }
}
