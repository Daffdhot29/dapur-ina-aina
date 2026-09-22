
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Kategori from '#models/kategori'
import { randomUUID } from 'node:crypto'

export default class KategoriSeeder extends BaseSeeder {
  async run() {
    const kategoris = [
      'Makanan Utama',
      'Appetizer',
      'Minuman',
    ]

    for (const namaKategori of kategoris) {
      await Kategori.firstOrCreate(
        { namaKategori },
        {
          idKategori: randomUUID(),
          namaKategori,
        }
      )
    }
  }
}