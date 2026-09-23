import { PesananSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type {
  BelongsTo,
  HasMany,
} from '@adonisjs/lucid/types/relations'

import Pelanggan from '#models/pelanggan'
import DetailPesanan from '#models/detail_pesanan'
import Pembayaran from '#models/pembayaran'

export default class Pesanan extends PesananSchema {
  static table = 'pesanan'
  @belongsTo(() => Pelanggan, {
    foreignKey: 'idPelanggan',
    localKey: 'idPelanggan',
  })
  declare pelanggan: BelongsTo<typeof Pelanggan>

  @hasMany(() => DetailPesanan, {
    foreignKey: 'idPesanan',
    localKey: 'idPesanan',
  })
  declare detailPesanans: HasMany<typeof DetailPesanan>

  @hasMany(() => Pembayaran, {
    foreignKey: 'idPesanan',
    localKey: 'idPesanan',
  })
  declare pembayarans: HasMany<typeof Pembayaran>
}