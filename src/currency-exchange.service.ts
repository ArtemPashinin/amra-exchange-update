import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CourseExchangeModel } from './models/currency-exchange.model';
import { CurrencyModel } from './models/currency.model';

@Injectable()
export class CurrencyExchangeService {
  constructor(
    @InjectModel(CourseExchangeModel)
    private readonly courseExchangeModel: typeof CourseExchangeModel,
    @InjectModel(CurrencyModel)
    private readonly currencyModel: typeof CurrencyModel,
  ) {}

  public async findCurrencyToRub(
    sourceCurrencyId: number,
  ): Promise<CourseExchangeModel> {
    return this.courseExchangeModel.findOne({
      where: { sourceCurrencyId: sourceCurrencyId, targetCurrencyId: 1 },
      include: [
        {
          model: CurrencyModel,
          as: 'sourceCurrency',
          required: true,
          where: { code: 'USDT' },
          attributes: { exclude: ['id'] },
        },
        {
          model: CurrencyModel,
          as: 'targetCurrency',
          required: true,
          attributes: { exclude: ['id'] },
        },
      ],
      attributes: { exclude: ['sourceCurrencyId', 'targetCurrencyId'] },
    });
  }

  public async updateCourse(
    sourceCurrencyCode: string,
    targetCurrencyCode: string,
    course: number,
  ) {
    const courseExchange = await this.courseExchangeModel.findOne({
      include: [
        {
          model: this.currencyModel,
          as: 'sourceCurrency',
          where: { code: sourceCurrencyCode },
        },
        {
          model: this.currencyModel,
          as: 'targetCurrency',
          where: { code: targetCurrencyCode },
        },
      ],
    });
    try{
    await courseExchange.update({ exchangeRate: course });} catch(err) {
      console.log(sourceCurrencyCode, targetCurrencyCode)
    }
  }
}
