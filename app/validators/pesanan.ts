import vine from '@vinejs/vine'

export const createPesananValidator = vine.compile(
  vine.object({
    idPelanggan: vine.string().uuid(),

    catatan: vine.string().trim().optional(),

    items: vine
      .array(
        vine.object({
          idMenu: vine.string().uuid(),
          jumlah: vine.number().withoutDecimals().positive(),
        })
      )
      .minLength(1),
  })
)