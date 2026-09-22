
import vine from '@vinejs/vine'

export const createKategoriValidator = vine.compile(
  vine.object({
    namaKategori: vine.string().trim().minLength(1).maxLength(50),
  })
)

export const updateKategoriValidator = vine.compile(
  vine.object({
    namaKategori: vine.string().trim().minLength(1).maxLength(50),
  })
)