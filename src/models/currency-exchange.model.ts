import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
  Default,
} from 'sequelize-typescript';
import { CurrencyModel } from './currency.model';

@Table({ tableName: 'CourseExchange', timestamps: false })
export class CourseExchangeModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER, allowNull: false })
  id!: number;

  @ForeignKey(() => CurrencyModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  sourceCurrencyId!: number;

  @BelongsTo(() => CurrencyModel, 'sourceCurrencyId')
  sourceCurrency!: CurrencyModel;

  @ForeignKey(() => CurrencyModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  targetCurrencyId!: number;

  @BelongsTo(() => CurrencyModel, 'targetCurrencyId')
  targetCurrency!: CurrencyModel;

  @Default(0.0)
  @Column({ type: DataType.DOUBLE, allowNull: false })
  exchangeRate!: number;
}
