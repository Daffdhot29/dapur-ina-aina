
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

import Pelanggan from '#models/pelanggan'
import {
  createPelangganValidator,
  updatePelangganValidator,
} from '#validators/pelanggan'

export default class PelanggansController {
  async index({ response }: HttpContext) {
    const pelanggan = await Pelanggan.query()
      .orderBy('nama', 'asc')

    return response.ok({
      data: pelanggan,
    })
  }

  async show({ params, response }: HttpContext) {
    const pelanggan = await Pelanggan.findOrFail(params.id)

    return response.ok({
      data: pelanggan,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      createPelangganValidator
    )

    const pelanggan = await Pelanggan.create({
      idPelanggan: randomUUID(),
      nama: payload.nama,
      email: payload.email ?? null,
      nomorHp: payload.nomorHp ?? null,
      alamat: payload.alamat ?? null,
    })

    return response.created({
      message: 'Pelanggan berhasil ditambahkan',
      data: pelanggan,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const pelanggan = await Pelanggan.findOrFail(params.id)

    const payload = await request.validateUsing(
      updatePelangganValidator
    )

    pelanggan.merge(payload)

    await pelanggan.save()

    return response.ok({
      message: 'Pelanggan berhasil diperbarui',
      data: pelanggan,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const pelanggan = await Pelanggan.findOrFail(params.id)

    const pesanan = await pelanggan
      .related('pesanans')
      .query()
      .first()

    if (pesanan) {
      return response.conflict({
        message:
          'Pelanggan tidak dapat dihapus karena memiliki riwayat pesanan',
      })
    }

    await pelanggan.delete()

    return response.ok({
      message: 'Pelanggan berhasil dihapus',
    })
  }
}