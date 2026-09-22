import { DetailPesananSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Pesanan from '#models/pesanan'
import Menu from '#models/menu'

export default class DetailPesanan extends DetailPesananSchema {
  @belongsTo(() => Pesanan, {
    foreignKey: 'idPesanan',
    localKey: 'idPesanan',
  })
  declare pesanan: BelongsTo<typeof Pesanan>

  @belongsTo(() => Menu, {
    foreignKey: 'idMenu',
    localKey: 'idMenu',
  })
  declare menu: BelongsTo<typeof Menu>
}