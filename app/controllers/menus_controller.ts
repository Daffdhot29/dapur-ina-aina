
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'

import Menu from '#models/menu'
import Kategori from '#models/kategori'

import {createMenuValidator,updateMenuValidator} from '#validators/menu'

export default class MenusController {
 
  async index({ request, response }: HttpContext) {
    const search = request.input('search')
    const idKategori = request.input('idKategori')

    const query = Menu.query()
      .preload('kategori')
      .orderBy('nama_menu', 'asc')

    if (typeof search === 'string' && search.trim()) {
      query.where('nama_menu', 'like', `%${search.trim()}%`)
    }

    if (typeof idKategori === 'string' && idKategori.trim()) {
      query.where('id_kategori', idKategori)
    }

    const menus = await query

    return response.ok({
      message: 'Daftar menu berhasil diambil',
      data: menus,
    })
  }

  async show({ params, response }: HttpContext) {
    const menu = await Menu.query()
      .where('id_menu', params.id)
      .preload('kategori')
      .firstOrFail()

    return response.ok({
      message: 'Detail menu berhasil diambil',
      data: menu,
    })
  }

  
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      createMenuValidator
    )

    const kategori = await Kategori.find(payload.idKategori)

    if (!kategori) {
      return response.unprocessableEntity({
        message: 'Kategori tidak ditemukan',
      })
    }

    const menu = await Menu.create({
      idMenu: randomUUID(),
      namaMenu: payload.namaMenu,
      idKategori: payload.idKategori,
      deskripsi: payload.deskripsi ?? null,
      harga: payload.harga,
      stok: payload.stok,
    })

    await menu.load('kategori')

    return response.created({
      message: 'Menu berhasil ditambahkan',
      data: menu,
    })
  }

  async update({ params, request, response }: HttpContext) {
    const menu = await Menu.findOrFail(params.id)

    const payload = await request.validateUsing(
      updateMenuValidator
    )

    if (payload.idKategori !== undefined) {
      const kategori = await Kategori.find(payload.idKategori)

      if (!kategori) {
        return response.unprocessableEntity({
          message: 'Kategori tidak ditemukan',
        })
      }
    }

    menu.merge(payload)

    await menu.save()
    await menu.load('kategori')

    return response.ok({
      message: 'Menu berhasil diperbarui',
      data: menu,
    })
  }
  async destroy({ params, response }: HttpContext) {
    const menu = await Menu.findOrFail(params.id)

    const detailPesanan = await menu
      .related('detailPesanans')
      .query()
      .first()

    if (detailPesanan) {
      return response.conflict({
        message:
          'Menu tidak dapat dihapus karena sudah digunakan dalam transaksi',
      })
    }

    await menu.delete()

    return response.ok({
      message: 'Menu berhasil dihapus',
    })
  }
}