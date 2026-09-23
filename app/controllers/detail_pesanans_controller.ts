import type { HttpContext } from '@adonisjs/core/http'
import Pesanan from '#models/pesanan'
import DetailPesanan from '#models/detail_pesanan'

export default class DetailPesanansController {
  async index({ params, response }: HttpContext) {
    await Pesanan.findOrFail(params.id)

    const details = await DetailPesanan.query()
      .where('id_pesanan', params.id)
      .preload('menu')

    return response.ok({
      data: details,
    })
  }

  async show({ params, response }: HttpContext) {
    const detail = await DetailPesanan.query()
      .where('id_detail', params.id)
      .preload('menu')
      .firstOrFail()

    return response.ok({
      data: detail,
    })
  }
}