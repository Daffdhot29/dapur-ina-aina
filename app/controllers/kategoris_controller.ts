
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

import Kategori from '#models/kategori'
import {
  createKategoriValidator,
  updateKategoriValidator,
} from '#validators/kategori'

export default class KategorisController {
  async index({ response }: HttpContext) {
    const kategoris = await Kategori.query()
      .orderBy('nama_kategori', 'asc')

    return response.ok({
      data: kategoris,
    })
  }

  async show({ params, response }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)

    return response.ok({
      data: kategori,
    })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      createKategoriValidator
    )

    const existing = await Kategori.findBy(
      'namaKategori',
      payload.namaKategori
    )

    if (existing) {
      return response.conflict({
        message: 'Nama kategori sudah digunakan',
      })
    }

    const kategori = await Kategori.create({
      idKategori: randomUUID(),
      namaKategori: payload.namaKategori,
    })

    return response.created({
      message: 'Kategori berhasil ditambahkan',
      data: kategori,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)

    const payload = await request.validateUsing(
      updateKategoriValidator
    )

    const existing = await Kategori.query()
      .where('nama_kategori', payload.namaKategori)
      .whereNot('id_kategori', kategori.idKategori)
      .first()

    if (existing) {
      return response.conflict({
        message: 'Nama kategori sudah digunakan',
      })
    }

    kategori.merge(payload)

    await kategori.save()

    return response.ok({
      message: 'Kategori berhasil diperbarui',
      data: kategori,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)

    const menu = await kategori
      .related('menus')
      .query()
      .first()

    if (menu) {
      return response.conflict({
        message: 'Kategori masih memiliki menu',
      })
    }

    await kategori.delete()

    return response.ok({
      message: 'Kategori berhasil dihapus',
    })
  }
}