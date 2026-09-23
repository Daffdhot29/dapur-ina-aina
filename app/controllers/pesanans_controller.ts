import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'

import Pesanan from '#models/pesanan'
import Pelanggan from '#models/pelanggan'
import Menu from '#models/menu'
import DetailPesanan from '#models/detail_pesanan'
import { createPesananValidator } from '#validators/pesanan'

export default class PesanansController {
  async index({ response }: HttpContext) {
    const pesanans = await Pesanan.query()
      .preload('pelanggan')
      .preload('detailPesanans')
      .orderBy('tanggal_pesanan', 'desc')

    return response.ok({ data: pesanans })
  }

  async show({ params, response }: HttpContext) {
    const pesanan = await Pesanan.query()
      .where('id_pesanan', params.id)
      .preload('pelanggan')
      .preload('detailPesanans', (query) => {
        query.preload('menu')
      })
      .firstOrFail()

    return response.ok({ data: pesanan })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createPesananValidator)

    const menuIds = payload.items.map((item) => item.idMenu)

    if (new Set(menuIds).size !== menuIds.length) {
      return response.unprocessableEntity({
        message: 'Menu yang sama tidak boleh dikirim dua kali',
      })
    }

    const trx = await db.transaction()

    try {
      const pelanggan = await Pelanggan.query({ client: trx })
        .where('id_pelanggan', payload.idPelanggan)
        .first()

      if (!pelanggan) {
        await trx.rollback()

        return response.unprocessableEntity({
          message: 'Pelanggan tidak ditemukan',
        })
      }

      const idPesanan = randomUUID()

      let totalHarga = 0
      let totalPesanan = 0

      const details: Array<{
        idDetail: string
        idPesanan: string
        idMenu: string
        jumlah: number
        harga: number
        subTotal: number
      }> = []

      const sortedItems = [...payload.items].sort((a, b) =>
        a.idMenu.localeCompare(b.idMenu)
      )

      for (const item of sortedItems) {
        const menu = await Menu.query({ client: trx })
          .where('id_menu', item.idMenu)
          .forUpdate()
          .first()

        if (!menu) {
          await trx.rollback()

          return response.unprocessableEntity({
            message: `Menu ${item.idMenu} tidak ditemukan`,
          })
        }

        if (menu.stok < item.jumlah) {
          await trx.rollback()

          return response.conflict({
            message: `Stok ${menu.namaMenu} tidak mencukupi`,
          })
        }

        const harga = Number(menu.harga)
        const subTotal = harga * item.jumlah

        totalHarga += subTotal
        totalPesanan += item.jumlah

        menu.stok -= item.jumlah
        await menu.useTransaction(trx).save()

        details.push({
          idDetail: randomUUID(),
          idPesanan,
          idMenu: item.idMenu,
          jumlah: item.jumlah,
          harga,
          subTotal,
        })
      }

      const pesanan = await Pesanan.create(
        {
          idPesanan,
          idPelanggan: payload.idPelanggan,
          tanggalPesanan: DateTime.now(),
          totalPesanan,
          totalHarga,
          catatan: payload.catatan ?? null,
        },
        { client: trx }
      )

      await DetailPesanan.createMany(details, {
        client: trx,
      })

      await trx.commit()

      await pesanan.load('detailPesanans')

      return response.created({
        message: 'Pesanan berhasil dibuat',
        data: pesanan,
      })
    } catch (error) {
      if (!trx.isCompleted) {
        await trx.rollback()
      }

      throw error
    }
  }
}