import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

import Billing from '#models/billing'
import Pesanan from '#models/pesanan'
import Pembayaran from '#models/pembayaran'

export default class BillingsController {
  async index({ response }: HttpContext) {
    const billings = await Billing.query()
      .orderBy('tanggal_cetak', 'desc')

    return response.ok({
      data: billings,
    })
  }

  async show({ params, response }: HttpContext) {
  const billing = await Billing.findOrFail(params.id)

  const pesanan = await Pesanan.query()
    .where('id_pesanan', billing.idPesanan)
    .preload('pelanggan')
    .preload('detailPesanans', (detailQuery) => {
      detailQuery.preload('menu')
    })
    .firstOrFail()

  const pembayaran = await Pembayaran.query()
    .where('id_pesanan', billing.idPesanan)
    .first()

  return response.ok({
    data: {
      billing,
      pesanan,
      pembayaran,
    },
  })
}

  async store({ params, response }: HttpContext) {
    const trx = await db.transaction()

    try {
      const pesanan = await Pesanan.query({ client: trx })
        .where('id_pesanan', params.id)
        .forUpdate()
        .first()

      if (!pesanan) {
        await trx.rollback()

        return response.notFound({
          message: 'Pesanan tidak ditemukan',
        })
      }

      const pembayaran = await Pembayaran.query({ client: trx })
        .where('id_pesanan', pesanan.idPesanan)
        .first()

      if (!pembayaran) {
        await trx.rollback()

        return response.conflict({
          message: 'Pesanan belum dibayar',
        })
      }

      const existing = await Billing.query({ client: trx })
        .where('id_pesanan', pesanan.idPesanan)
        .first()

      if (existing) {
        await trx.rollback()

        return response.ok({
          message: 'Billing sudah tersedia',
          data: existing,
        })
      }

      const billing = await Billing.create(
        {
          idBilling: randomUUID(),
          idPesanan: pesanan.idPesanan,
          jumlah: Number(pesanan.totalHarga),
          tanggalCetak: DateTime.now(),
        },
        { client: trx }
      )

      await trx.commit()

      return response.created({
        message: 'Billing berhasil dibuat',
        data: billing,
      })
    } catch (error) {
      if (!trx.isCompleted) {
        await trx.rollback()
      }

      throw error
    }
  }
}