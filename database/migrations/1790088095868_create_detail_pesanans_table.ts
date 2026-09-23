import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'detail_pesanan'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_detail').primary()

      table
        .uuid('id_pesanan')
        .notNullable()
        .references('id_pesanan')
        .inTable('pesanan')
        .onDelete('CASCADE')

      table
        .uuid('id_menu')
        .notNullable()
        .references('id_menu')
        .inTable('menu')
        .onDelete('RESTRICT')

      table.integer('jumlah').unsigned().notNullable()

      table.decimal('harga', 12, 2).notNullable()

      table.decimal('sub_total', 12, 2).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}