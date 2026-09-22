
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { randomUUID } from 'node:crypto'

import Kategori from '#models/kategori'
import Menu from '#models/menu'

export default class MenuSeeder extends BaseSeeder {
  async run() {
    const dataMenu = [
      {
        namaMenu: 'Nasi Goreng Spesial',
        deskripsi: 'Nasi goreng dengan telur dan ayam',
        harga: 25000,
        stok: 30,
        kategori: 'Makanan Utama',
      },
      {
        namaMenu: 'Ayam Geprek',
        deskripsi: 'Ayam crispy dengan sambal geprek',
        harga: 22000,
        stok: 25,
        kategori: 'Makanan Utama',
      },
      {
        namaMenu: 'Mie Goreng',
        deskripsi: 'Mie goreng dengan telur dan sayuran',
        harga: 20000,
        stok: 30,
        kategori: 'Makanan Utama',
      },
      {
        namaMenu: 'Kentang Goreng',
        deskripsi: 'Kentang goreng renyah',
        harga: 15000,
        stok: 40,
        kategori: 'Appetizer',
      },
      {
        namaMenu: 'Tahu Crispy',
        deskripsi: 'Tahu goreng renyah dengan saus',
        harga: 12000,
        stok: 35,
        kategori: 'Appetizer',
      },
      {
        namaMenu: 'Pisang Goreng',
        deskripsi: 'Pisang goreng hangat',
        harga: 15000,
        stok: 25,
        kategori: 'Appetizer',
      },
      {
        namaMenu: 'Es Teh Manis',
        deskripsi: 'Teh manis dengan es batu',
        harga: 7000,
        stok: 50,
        kategori: 'Minuman',
      },
      {
        namaMenu: 'Es Jeruk',
        deskripsi: 'Minuman jeruk segar',
        harga: 10000,
        stok: 40,
        kategori: 'Minuman',
      },
      {
        namaMenu: 'Kopi Susu',
        deskripsi: 'Kopi dengan susu',
        harga: 15000,
        stok: 30,
        kategori: 'Minuman',
      },
    ]

    for (const item of dataMenu) {
      const kategori = await Kategori.findByOrFail(
        'namaKategori',
        item.kategori
      )

      await Menu.firstOrCreate(
        {
          namaMenu: item.namaMenu,
        },
        {
          idMenu: randomUUID(),
          namaMenu: item.namaMenu,
          deskripsi: item.deskripsi,
          harga: item.harga,
          stok: item.stok,
          idKategori: kategori.idKategori,
        }
      )
    }
  }
}