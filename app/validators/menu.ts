
import vine from '@vinejs/vine'

export const createMenuValidator = vine.compile(
  vine.object({
    namaMenu: vine.string().trim().minLength(1).maxLength(20),

    idKategori: vine.string().uuid(),

    deskripsi: vine.string().trim().optional(),

    harga: vine.number().positive(),

    stok: vine.number().withoutDecimals().min(0),
  })
)

export const updateMenuValidator = vine.compile(
  vine.object({
    namaMenu: vine.string().trim().minLength(1).maxLength(20).optional(),

    idKategori: vine.string().uuid().optional(),

    deskripsi: vine.string().trim().optional(),

    harga: vine.number().positive().optional(),

    stok: vine.number().withoutDecimals().min(0).optional(),
  })
)