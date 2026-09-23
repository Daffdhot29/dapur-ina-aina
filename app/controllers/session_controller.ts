import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({
    request,
    auth,
    response,
  }: HttpContext) {
    const { email, password } =
      await request.validateUsing(loginValidator)

    const user =
      await User.verifyCredentials(
        email,
        password
      )

    await auth.use('web').login(user)

    if (user.roleUser === 'admin') {
      return response
        .redirect()
        .toRoute('admin.dashboard')
    }

    return response
      .redirect()
      .toRoute('kasir.dashboard')
  }

  async destroy({
    auth,
    response,
  }: HttpContext) {
    await auth.use('web').logout()

    return response
      .redirect()
      .toRoute('session.create')
  }
}