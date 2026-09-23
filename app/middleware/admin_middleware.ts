import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user || user.roleUser !== 'admin') {
      return response.forbidden({
        message: 'Akses ditolak. Hanya Admin yang dapat melakukan tindakan ini.',
      })
    }

    return next()
  }
}