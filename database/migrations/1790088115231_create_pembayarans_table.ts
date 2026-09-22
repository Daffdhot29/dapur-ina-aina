import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pembayaran'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_pembayaran').primary()

      table
        .uuid('id_pesanan')
        .notNullable()
        .references('id_pesanan')
        .inTable('pesanan')
        .onDelete('RESTRICT')

      table.string('metode_pembayaran', 20).notNullable()

      table.decimal('jumlah', 12, 2).notNullable()

      table.dateTime('waktu_pembayaran').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}