import type { HttpContext } from '@adonisjs/core/http'
import Menu from '#models/menu'

export default class MenusController {
  async index({ response }: HttpContext) {
    const menus = await Menu.query()
      .preload('kategori')
      .orderBy('nama_menu', 'asc')

    return response.ok({
      data: menus,
    })
  }
}