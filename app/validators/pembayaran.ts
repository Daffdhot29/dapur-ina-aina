import vine from '@vinejs/vine'

export const createPembayaranValidator = vine.compile(
  vine.object({
    idPesanan: vine.string().uuid(),

    metodePembayaran: vine.enum([
      'tunai',
      'non_tunai',
    ]),
  })
)