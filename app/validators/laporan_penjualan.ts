import vine from '@vinejs/vine'

export const laporanPenjualanValidator = vine.compile(
  vine.object({
    tanggalMulai: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    tanggalSelesai: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
)