import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

import Pesanan from '#models/pesanan'
import Pembayaran from '#models/pembayaran'
import { createPembayaranValidator } from '#validators/pembayaran'

export default class PembayaransController {
  async index({ response }: HttpContext) {
    const pembayarans = await Pembayaran.query()
      .orderBy('waktu_pembayaran', 'desc')

    return response.ok({
      data: pembayarans,
    })
  }

  async show({ params, response }: HttpContext) {
    const pembayaran = await Pembayaran.findOrFail(params.id)

    return response.ok({
      data: pembayaran,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      createPembayaranValidator
    )

    const trx = await db.transaction()

    try {
      const pesanan = await Pesanan.query({ client: trx })
        .where('id_pesanan', payload.idPesanan)
        .forUpdate()
        .first()

      if (!pesanan) {
        await trx.rollback()

        return response.notFound({
          message: 'Pesanan tidak ditemukan',
        })
      }

      const existing = await Pembayaran.query({ client: trx })
        .where('id_pesanan', payload.idPesanan)
        .first()

      if (existing) {
        await trx.rollback()

        return response.conflict({
          message: 'Pesanan sudah dibayar',
        })
      }

      const pembayaran = await Pembayaran.create(
        {
          idPembayaran: randomUUID(),
          idPesanan: pesanan.idPesanan,
          jumlah: Number(pesanan.totalHarga),
          metodePembayaran: payload.metodePembayaran,
          waktuPembayaran: DateTime.now(),
        },
        { client: trx }
      )

      await trx.commit()

      return response.created({
        message: 'Pembayaran berhasil dicatat',
        data: pembayaran,
      })
    } catch (error) {
      if (!trx.isCompleted) {
        await trx.rollback()
      }

      throw error
    }
  }
}