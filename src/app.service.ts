import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';

interface IOfferDto {
  price: number;
  volume: number;
  amount: number;
  factor: number;
  type: string;
}

@Injectable()
export class AppService {
  private apiUrl: string;
  private tonApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl = this.configService.get<string>('API_URL');
    this.tonApiUrl = this.configService.get<string>('TON_API_URL');
  }

  public async getOffer(
    sourceCurrency: string,
    targetCurrency: string,
  ): Promise<[IOfferDto, IOfferDto]> {
    try {
      const response = await firstValueFrom(
        this.httpService
          .get(
            `${this.apiUrl}${sourceCurrency.toLowerCase()}${targetCurrency.toLowerCase()}`,
          )
          .pipe(
            map((response) => {
              const firstAsk = response.data.asks[0];
              const firstBid = response.data.bids[0];

              return [
                {
                  price: parseFloat(firstAsk.price),
                  volume: parseFloat(firstAsk.volume),
                  amount: parseFloat(firstAsk.amount),
                  factor: parseFloat(firstAsk.factor),
                  type: firstAsk.type,
                },
                {
                  price: parseFloat(firstBid.price),
                  volume: parseFloat(firstBid.volume),
                  amount: parseFloat(firstBid.amount),
                  factor: parseFloat(firstBid.factor),
                  type: firstBid.type,
                },
              ] as [IOfferDto, IOfferDto];
            }),
            catchError((error: AxiosError) => {
              throw new Error(
                `An error occurred while fetching offers: ${error.message}`,
              );
            }),
          ),
      );
      return response;
    } catch (err) {
      console.log(
        `${this.apiUrl}${sourceCurrency.toLowerCase()}${targetCurrency.toLowerCase()}`,
      );
    }
  }

  public async getTonCourse(
    sourceCurrency: string | string[],
    targetCurrency: string | string[],
  ) {
    const sources = Array.isArray(sourceCurrency)
      ? sourceCurrency.map((c) => c.toLowerCase())
      : [sourceCurrency.toLowerCase()];
    const targets = Array.isArray(targetCurrency)
      ? targetCurrency.map((c) => c.toLowerCase())
      : [targetCurrency.toLowerCase()];

    const params = new URLSearchParams({
      tokens: sources.join(','),
      currencies: targets.join(','),
    });

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.tonApiUrl}${params}`),
      );
      return response.data.rates;
    } catch (error) {
      console.error('Error fetching TON course:', error);
      throw new Error('Failed to fetch the TON course');
    }
  }
}
