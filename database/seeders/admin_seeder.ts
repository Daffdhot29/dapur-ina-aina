import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.firstOrCreate(
      {
        email: 'admin@dapurinaaina.com',
      },
      {
        fullName: 'Administrator',
        password: 'admin123',
        roleUser: 'admin',
      }
    )
  }
}