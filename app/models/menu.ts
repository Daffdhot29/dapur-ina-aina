import { MenuSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  HasMany,
} from '@adonisjs/lucid/types/relations'

import Kategori from '#models/kategori'
import DetailPesanan from '#models/detail_pesanan'

export default class Menu extends MenuSchema {
  @belongsTo(() => Kategori, {
    foreignKey: 'idKategori',
    localKey: 'idKategori',
  })
  declare kategori: BelongsTo<typeof Kategori>

  @hasMany(() => DetailPesanan, {
    foreignKey: 'idMenu',
    localKey: 'idMenu',
  })
  declare detailPesanans: HasMany<typeof DetailPesanan>
}