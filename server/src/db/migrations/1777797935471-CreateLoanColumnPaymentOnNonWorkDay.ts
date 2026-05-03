import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

import { PaymentOnNonWorkDays } from '../../__generated__/resolvers-types.js'

export class CreateLoanColumnPaymentOnNonWorkDay1777797828796 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'loans',
      new TableColumn({
        name: 'paymentOnNonWorkDays',
        type: 'text',
        isNullable: false,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('loans', 'paymentOnNonWorkDays')
  }
}

export class CreateLoanColumnPaymentOnNonWorkDay1777797935471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
