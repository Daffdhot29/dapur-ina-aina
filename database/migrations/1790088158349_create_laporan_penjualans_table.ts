import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'laporan_penjualan'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_laporan').primary()

      table.date('periode_mulai').notNullable()
      table.date('periode_selesai').notNullable()

      table.integer('total_transaksi').unsigned().notNullable()

      table.decimal('total_pendapatan', 12, 2).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}