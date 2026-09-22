import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pelanggan'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_pelanggan').primary()

      table.string('nama', 50).notNullable()
      table.string('nomor_hp', 20).nullable()
      table.string('email', 50).nullable()
      table.string('alamat', 100).nullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}