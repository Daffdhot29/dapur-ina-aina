import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import PDFDocument from 'pdfkit'

import { laporanPenjualanValidator } from '#validators/laporan_penjualan'

export default class LaporanPenjualansController {
  async index({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      laporanPenjualanValidator
    )

    const mulai = DateTime.fromISO(payload.tanggalMulai)
    const selesai = DateTime.fromISO(payload.tanggalSelesai)

    if (
      !mulai.isValid ||
      !selesai.isValid ||
      mulai.toMillis() > selesai.toMillis()
    ) {
      return response.unprocessableEntity({
        message: 'Rentang tanggal tidak valid',
      })
    }

    const result = await db
      .from('pembayaran')
      .where(
        'waktu_pembayaran',
        '>=',
        mulai.startOf('day').toSQL()!
      )
      .where(
        'waktu_pembayaran',
        '<',
        selesai.plus({ days: 1 }).startOf('day').toSQL()!
      )
      .count('* as totalTransaksi')
      .sum('jumlah as totalPendapatan')
      .first()

    return response.ok({
      data: {
        periodeMulai: payload.tanggalMulai,
        periodeSelesai: payload.tanggalSelesai,
        totalTransaksi: Number(
          result?.totalTransaksi ?? 0
        ),
        totalPendapatan: Number(
          result?.totalPendapatan ?? 0
        ),
      },
    })
  }

  async exportPdf({ request, response }: HttpContext) {
    const payload = await request.validateUsing(
      laporanPenjualanValidator
    )

    const mulai = DateTime.fromISO(payload.tanggalMulai)
    const selesai = DateTime.fromISO(payload.tanggalSelesai)

    if (
      !mulai.isValid ||
      !selesai.isValid ||
      mulai.toMillis() > selesai.toMillis()
    ) {
      return response.unprocessableEntity({
        message: 'Rentang tanggal tidak valid',
      })
    }

    // Ambil seluruh transaksi pembayaran pada periode
    const transaksi = await db
      .from('pembayaran')
      .where(
        'waktu_pembayaran',
        '>=',
        mulai.startOf('day').toSQL()!
      )
      .where(
        'waktu_pembayaran',
        '<',
        selesai.plus({ days: 1 }).startOf('day').toSQL()!
      )
      .orderBy('waktu_pembayaran', 'asc')

    const totalTransaksi = transaksi.length

    const totalPendapatan = transaksi.reduce(
      (total, item) => {
        return total + Number(item.jumlah ?? 0)
      },
      0
    )

    const rataRataTransaksi =
      totalTransaksi > 0
        ? totalPendapatan / totalTransaksi
        : 0

    const formatRupiah = (value: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(value)
    }

    const formatTanggal = (tanggal: string) => {
      const date = DateTime.fromISO(tanggal)

      if (!date.isValid) {
        return tanggal
      }

      return date
        .setLocale('id')
        .toFormat('dd LLLL yyyy')
    }

    const formatWaktuPembayaran = (value: unknown) => {
      if (!value) {
        return '-'
      }

      let date: DateTime

      if (value instanceof Date) {
        date = DateTime.fromJSDate(value)
      } else {
        date = DateTime.fromSQL(String(value))

        if (!date.isValid) {
          date = DateTime.fromISO(String(value))
        }
      }

      if (!date.isValid) {
        return String(value)
      }

      return date.toFormat('dd/MM/yyyy HH:mm')
    }

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    })

    const chunks: Buffer[] = []

    doc.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    const pdfBuffer = await new Promise<Buffer>(
      (resolve, reject) => {
        doc.on('end', () => {
          resolve(Buffer.concat(chunks))
        })

        doc.on('error', reject)

        doc
          .font('Helvetica-Bold')
          .fontSize(20)
          .fillColor('#202426')
          .text('DAPUR INA AINA', {
            align: 'center',
          })

        doc
          .moveDown(0.3)
          .fontSize(15)
          .text('Laporan Penjualan', {
            align: 'center',
          })

        doc
          .moveDown(0.5)
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#686E70')
          .text(
            `${formatTanggal(payload.tanggalMulai)} - ${formatTanggal(
              payload.tanggalSelesai
            )}`,
            {
              align: 'center',
            }
          )

        doc.moveDown(1)

        doc
          .strokeColor('#D9DCDA')
          .moveTo(50, doc.y)
          .lineTo(545, doc.y)
          .stroke()

        doc.moveDown(1.5)

        doc
          .fillColor('#202426')
          .font('Helvetica-Bold')
          .fontSize(13)
          .text('Ringkasan Penjualan')

        doc.moveDown(1)

        const labelX = 50
        const valueX = 230

        let summaryY = doc.y

        doc
          .font('Helvetica')
          .fontSize(10)
          .text(
            'Total Transaksi',
            labelX,
            summaryY
          )

        doc
          .font('Helvetica-Bold')
          .text(
            `${totalTransaksi} transaksi`,
            valueX,
            summaryY
          )

        summaryY += 24

        doc
          .font('Helvetica')
          .text(
            'Total Pendapatan',
            labelX,
            summaryY
          )

        doc
          .font('Helvetica-Bold')
          .text(
            formatRupiah(totalPendapatan),
            valueX,
            summaryY
          )

        summaryY += 24

        doc
          .font('Helvetica')
          .text(
            'Rata-rata Transaksi',
            labelX,
            summaryY
          )

        doc
          .font('Helvetica-Bold')
          .text(
            formatRupiah(rataRataTransaksi),
            valueX,
            summaryY
          )

        doc.y = summaryY + 45

        doc
          .font('Helvetica-Bold')
          .fontSize(13)
          .text('Detail Transaksi')

        doc.moveDown(1)

        const columns = {
          no: 50,
          tanggal: 85,
          metode: 225,
          jumlah: 370,
        }

        const drawTableHeader = (y: number) => {
          doc
            .font('Helvetica-Bold')
            .fontSize(9)
            .fillColor('#202426')

          doc.text('No', columns.no, y)
          doc.text(
            'Tanggal',
            columns.tanggal,
            y
          )
          doc.text(
            'Metode Pembayaran',
            columns.metode,
            y
          )
          doc.text(
            'Jumlah',
            columns.jumlah,
            y
          )

          doc
            .strokeColor('#D9DCDA')
            .moveTo(50, y + 17)
            .lineTo(545, y + 17)
            .stroke()
        }

        let rowY = doc.y

        drawTableHeader(rowY)

        rowY += 30

        if (transaksi.length === 0) {
          doc
            .font('Helvetica')
            .fontSize(10)
            .fillColor('#686E70')
            .text(
              'Tidak ada transaksi pada periode ini.',
              50,
              rowY + 10,
              {
                width: 495,
                align: 'center',
              }
            )
        } else {
          transaksi.forEach(
            (item, index) => {
              // Page baru jika tabel sudah mencapai bawah halaman
              if (rowY > 740) {
                doc.addPage()

                rowY = 50

                drawTableHeader(rowY)

                rowY += 30
              }

              doc
                .font('Helvetica')
                .fontSize(9)
                .fillColor('#202426')

              doc.text(
                String(index + 1),
                columns.no,
                rowY,
                {
                  width: 25,
                }
              )

              doc.text(
                formatWaktuPembayaran(
                  item.waktu_pembayaran
                ),
                columns.tanggal,
                rowY,
                {
                  width: 125,
                }
              )

              doc.text(
                item.metode_pembayaran ?? '-',
                columns.metode,
                rowY,
                {
                  width: 125,
                }
              )

              doc.text(
                formatRupiah(
                  Number(item.jumlah ?? 0)
                ),
                columns.jumlah,
                rowY,
                {
                  width: 170,
                }
              )

              rowY += 24

              doc
                .strokeColor('#EEEEEC')
                .moveTo(50, rowY - 6)
                .lineTo(545, rowY - 6)
                .stroke()
            }
          )
        }

     

        const dicetakPada = DateTime.now()
          .setZone('Asia/Jakarta')
          .setLocale('id')
          .toFormat(
            "dd LLLL yyyy, HH:mm 'WIB'"
          )

        doc
          .font('Helvetica')
          .fontSize(8)
          .fillColor('#777777')
          .text(
            `Dicetak pada ${dicetakPada}`,
            50,
            790,
            {
              width: 495,
              align: 'center',
            }
          )

        doc.end()
      }
    )

    const fileName =
      `laporan-penjualan-${payload.tanggalMulai}-${payload.tanggalSelesai}.pdf`

    response.header(
      'Content-Type',
      'application/pdf'
    )

    response.header(
      'Content-Disposition',
      `attachment; filename="${fileName}"`
    )

    response.header(
      'Content-Length',
      pdfBuffer.length.toString()
    )

    return response.send(pdfBuffer)
  }
}