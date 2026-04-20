import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class InitialSchema1713574800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'loans',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: "datetime('now')",
          },
          {
            name: 'name',
            type: 'text',
          },
          {
            name: 'principalAmount',
            type: 'text',
          },
          {
            name: 'totalExpectedInterest',
            type: 'text',
          },
          {
            name: 'startDate',
            type: 'date',
          },
          {
            name: 'endDate',
            type: 'date',
          },
        ],
      }),
      true
    )

    await queryRunner.createTable(
      new Table({
        name: 'repayments',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'paymentDate',
            type: 'date',
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: "datetime('now')",
          },
          {
            name: 'paymentType',
            type: 'text',
            default: "'Interest'",
          },
          {
            name: 'principalComponent',
            type: 'text',
          },
          {
            name: 'interestComponent',
            type: 'text',
          },
          {
            name: 'totalPayment',
            type: 'text',
          },
          {
            name: 'remainingBalance',
            type: 'text',
          },
          {
            name: 'loanId',
            type: 'text',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['loanId'],
            referencedTableName: 'loans',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('repayments')
    await queryRunner.dropTable('loans')
  }
}
