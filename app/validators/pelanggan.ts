
import vine from '@vinejs/vine'

export const createPelangganValidator = vine.compile(
  vine.object({
    nama: vine.string().trim().minLength(1),
    email: vine.string().email().optional(),
    nomorHp: vine.string().trim().optional(),
    alamat: vine.string().trim().optional(),
  })
)

export const updatePelangganValidator = vine.compile(
  vine.object({
    nama: vine.string().trim().minLength(1).optional(),
    email: vine.string().email().optional(),
    nomorHp: vine.string().trim().optional(),
    alamat: vine.string().trim().optional(),
  })
)