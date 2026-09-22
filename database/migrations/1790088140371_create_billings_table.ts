import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'billing'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_billing').primary()

      table
        .uuid('id_pesanan')
        .notNullable()
        .references('id_pesanan')
        .inTable('pesanan')
        .onDelete('RESTRICT')

      table.decimal('jumlah', 12, 2).notNullable()

      table.dateTime('tanggal_cetak').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}