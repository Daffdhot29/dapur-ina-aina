import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_menu').primary()

      table
        .uuid('id_kategori')
        .notNullable()
        .references('id_kategori')
        .inTable('kategoris')
        .onDelete('RESTRICT')

      table.string('nama_menu', 20).notNullable()
      table.text('deskripsi').nullable()
      table.decimal('harga', 12, 2).notNullable()
      table.integer('stok').unsigned().notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}