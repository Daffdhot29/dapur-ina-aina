import { PelangganSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Pesanan from '#models/pesanan'

export default class Pelanggan extends PelangganSchema {
    static table = 'pelanggan'
  @hasMany(() => Pesanan, {
    foreignKey: 'idPelanggan',
    localKey: 'idPelanggan',
  })
  declare pesanans: HasMany<typeof Pesanan>
}