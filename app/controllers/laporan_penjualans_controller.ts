import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

import { laporanPenjualanValidator } from '#validators/laporan_penjualan'

export default class LaporanPenjualansController {
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      laporanPenjualanValidator
    )

    const mulai = DateTime.fromISO(payload.tanggalMulai)
    const selesai = DateTime.fromISO(payload.tanggalSelesai)

    if (
      !mulai.isValid ||
      !selesai.isValid ||
      mulai.toMillis() > selesai.toMillis()
    ) {
      return response.unprocessableEntity({
        message: 'Rentang tanggal tidak valid',
      })
    }

    const result = await db
      .from('pembayaran')
      .where(
        'waktu_pembayaran',
        '>=',
        mulai.startOf('day').toSQL()!
      )
      .where(
        'waktu_pembayaran',
        '<',
        selesai.plus({ days: 1 }).startOf('day').toSQL()!
      )
      .count('* as totalTransaksi')
      .sum('jumlah as totalPendapatan')
      .first()

    return response.ok({
      data: {
        periodeMulai: payload.tanggalMulai,
        periodeSelesai: payload.tanggalSelesai,
        totalTransaksi: Number(result?.totalTransaksi ?? 0),
        totalPendapatan: Number(result?.totalPendapatan ?? 0),
      },
    })
  }
}