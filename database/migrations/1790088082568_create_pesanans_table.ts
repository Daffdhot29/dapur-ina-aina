import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pesanan'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_pesanan').primary()

      table
        .uuid('id_pelanggan')
        .notNullable()
        .references('id_pelanggan')
        .inTable('pelanggan')
        .onDelete('RESTRICT')

      table
        .dateTime('tanggal_pesanan')
        .notNullable()
        .defaultTo(this.now())

      table.integer('total_pesanan').unsigned().notNullable().defaultTo(0)

      table.decimal('total_harga', 12, 2).notNullable().defaultTo(0)

      table.string('catatan', 255).nullable()
      
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}