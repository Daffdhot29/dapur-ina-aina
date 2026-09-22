
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import Kategori from '#models/kategori'

export default class KategorisController {
  async index({ response }: HttpContext) {
    const kategoris = await Kategori.query()
      .orderBy('nama_kategori', 'asc')

    return response.ok({
      message: 'Daftar kategori berhasil diambil',
      data: kategoris,
    })
  }

  
  async show({ params, response }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)

    return response.ok({
      message: 'Detail kategori berhasil diambil',
      data: kategori,
    })
  }

  
  async store({ request, response }: HttpContext) {
    const namaKategori = request.input('namaKategori')

    if (
      typeof namaKategori !== 'string' ||
      !namaKategori.trim()
    ) {
      return response.badRequest({
        message: 'Nama kategori wajib diisi',
      })
    }

    const kategori = await Kategori.create({
      idKategori: randomUUID(),
      namaKategori: namaKategori.trim(),
    })

    return response.created({
      message: 'Kategori berhasil ditambahkan',
      data: kategori,
    })
  }

  
  async update({ params, request, response }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    const namaKategori = request.input('namaKategori')

    if (
      typeof namaKategori !== 'string' ||
      !namaKategori.trim()
    ) {
      return response.badRequest({
        message: 'Nama kategori wajib diisi',
      })
    }

    kategori.namaKategori = namaKategori.trim()

    await kategori.save()

    return response.ok({
      message: 'Kategori berhasil diperbarui',
      data: kategori,
    })
  }

  async destroy({ params, response }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)

    const jumlahMenu = await kategori
      .related('menus')
      .query()
      .count('* as total')

    if (Number(jumlahMenu[0].$extras.total) > 0) {
      return response.conflict({
        message:
          'Kategori tidak dapat dihapus karena masih memiliki menu',
      })
    }

    await kategori.delete()

    return response.ok({
      message: 'Kategori berhasil dihapus',
    })
  }
}