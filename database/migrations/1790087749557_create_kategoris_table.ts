import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kategoris'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id_kategori').primary()
      table.string('nama_kategori', 50).notNullable().unique()
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}