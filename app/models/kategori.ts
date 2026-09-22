import { KategorisSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Menu from '#models/menu'

export default class Kategori extends KategorisSchema {
  @hasMany(() => Menu, {
    foreignKey: 'idKategori',
    localKey: 'idKategori',
  })
  declare menus: HasMany<typeof Menu>
}