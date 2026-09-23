import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.firstOrCreate(
      {
        email: 'admin@dapurinaaina.com',
      },
      {
        fullName: 'Admin Dapur Ina Aina',
        password: 'admin123',
        roleUser: 'admin',
      }
    )

    await User.firstOrCreate(
      {
        email: 'kasir@dapurinaaina.com',
      },
      {
        fullName: 'Kasir Dapur Ina Aina',
        password: 'kasir123',
        roleUser: 'kasir',
      }
    )
  }
}