import {
  type CSSProperties,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { apiFetch } from '~/lib/api'

type Pelanggan = {
  idPelanggan: string
  nama: string
}

type Menu = {
  idMenu: string
  namaMenu: string
  harga: number | string
}

type DetailPesanan = {
  idDetail: string
  idMenu: string
  jumlah: number
  harga: number | string
  subTotal: number | string
  menu?: Menu
}

type Pesanan = {
  idPesanan: string
  idPelanggan: string
  tanggalPesanan: string
  totalPesanan: number
  totalHarga: number | string
  catatan?: string | null
  pelanggan?: Pelanggan
  detailPesanans?: DetailPesanan[]
}

type Pembayaran = {
  idPembayaran: string
  idPesanan: string
  jumlah: number | string
  metodePembayaran: string
  waktuPembayaran: string
}

type Billing = {
  idBilling: string
  idPesanan: string
  jumlah: number | string
  tanggalCetak: string
}

type BillingDetail = {
  billing: Billing
  pesanan: Pesanan
  pembayaran: Pembayaran | null
}

export default function BillingManagement() {
  const [pesanans, setPesanans] =
    useState<Pesanan[]>([])

  const [pembayarans, setPembayarans] =
    useState<Pembayaran[]>([])

  const [billings, setBillings] =
    useState<Billing[]>([])

  const [loading, setLoading] =
    useState(true)

  const [creating, setCreating] =
    useState<string | null>(null)

  const [loadingDetail, setLoadingDetail] =
    useState<string | null>(null)

  const [selectedBilling, setSelectedBilling] =
    useState<BillingDetail | null>(null)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const rupiah = (
    value: number | string
  ) =>
    new Intl.NumberFormat(
      'id-ID',
      {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }
    ).format(Number(value))

  const formatTanggal = (
    value: string
  ) => {
    if (!value) {
      return '-'
    }

    return new Date(
      value
    ).toLocaleString(
      'id-ID',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  }

  const formatMetodePembayaran = (
    value?: string
  ) => {
    if (!value) {
      return '-'
    }

    if (value === 'non_tunai') {
      return 'Non-Tunai'
    }

    if (value === 'tunai') {
      return 'Tunai'
    }

    return value
  }

  async function loadData() {
    setLoading(true)
    setError('')

    try {
      const [
        pesananResponse,
        pembayaranResponse,
        billingResponse,
      ] = await Promise.all([
        apiFetch(
          '/api/pesanans'
        ),

        apiFetch(
          '/api/pembayarans'
        ),

        apiFetch(
          '/api/billings'
        ),
      ])

      if (!pesananResponse.ok) {
        throw new Error(
          'Gagal mengambil pesanan'
        )
      }

      if (!pembayaranResponse.ok) {
        throw new Error(
          'Gagal mengambil pembayaran'
        )
      }

      if (!billingResponse.ok) {
        throw new Error(
          'Gagal mengambil billing'
        )
      }

      const pesananResult =
        await pesananResponse.json()

      const pembayaranResult =
        await pembayaranResponse.json()

      const billingResult =
        await billingResponse.json()

      setPesanans(
        pesananResult.data ?? []
      )

      setPembayarans(
        pembayaranResult.data ?? []
      )

      setBillings(
        billingResult.data ?? []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const pembayaranByPesanan =
    useMemo(() => {
      const map =
        new Map<
          string,
          Pembayaran
        >()

      pembayarans.forEach(
        (pembayaran) => {
          map.set(
            pembayaran.idPesanan,
            pembayaran
          )
        }
      )

      return map
    }, [pembayarans])

  const billingByPesanan =
    useMemo(() => {
      const map =
        new Map<
          string,
          Billing
        >()

      billings.forEach(
        (billing) => {
          map.set(
            billing.idPesanan,
            billing
          )
        }
      )

      return map
    }, [billings])

  const pesananSudahDibayar =
    useMemo(() => {
      return pesanans.filter(
        (pesanan) =>
          pembayaranByPesanan.has(
            pesanan.idPesanan
          )
      )
    }, [
      pesanans,
      pembayaranByPesanan,
    ])

  const totalBilling =
    useMemo(() => {
      return billings.reduce(
        (total, billing) =>
          total +
          Number(
            billing.jumlah
          ),
        0
      )
    }, [billings])

  async function createBilling(
    idPesanan: string
  ) {
    setCreating(idPesanan)
    setError('')
    setSuccess('')

    try {
      const response =
        await apiFetch(
          `/api/pesanans/${idPesanan}/billing`,
          {
            method: 'POST',
          }
        )

      const result =
        await response
          .json()
          .catch(() => null)

      if (!response.ok) {
        throw new Error(
          result?.message ??
            'Billing gagal dibuat'
        )
      }

      await loadData()

      setSuccess(
        result?.message ??
          'Billing berhasil dibuat'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Billing gagal dibuat'
      )
    } finally {
      setCreating(null)
    }
  }

  async function viewBilling(
    idBilling: string
  ) {
    setLoadingDetail(idBilling)
    setError('')

    try {
      const response =
        await apiFetch(
          `/api/billings/${idBilling}`
        )

      const result =
        await response
          .json()
          .catch(() => null)

      if (!response.ok) {
        throw new Error(
          result?.message ??
            'Gagal mengambil detail billing'
        )
      }

      setSelectedBilling(
        result.data
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail billing'
      )
    } finally {
      setLoadingDetail(null)
    }
  }

  function closeBilling() {
    setSelectedBilling(null)
  }

  function printBilling() {
    if (!selectedBilling) {
      return
    }

    const {
      billing,
      pesanan,
      pembayaran,
    } = selectedBilling

    const detailRows =
      pesanan.detailPesanans
        ?.map(
          (detail) => `
            <tr>
              <td>
                ${escapeHtml(
                  detail.menu?.namaMenu ??
                    '-'
                )}
              </td>

              <td class="center">
                ${detail.jumlah}
              </td>

              <td class="right">
                ${rupiah(detail.harga)}
              </td>

              <td class="right">
                ${rupiah(detail.subTotal)}
              </td>
            </tr>
          `
        )
        .join('') ?? ''

    const printWindow =
      window.open(
        '',
        '_blank',
        'width=700,height=900'
      )

    if (!printWindow) {
      setError(
        'Popup print diblokir browser.'
      )
      return
    }

    printWindow.document.write(`
      <!doctype html>

      <html lang="id">
        <head>
          <meta charset="UTF-8" />

          <title>
            Billing ${escapeHtml(
              billing.idBilling
            )}
          </title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 24px;
              background: #ffffff;
              color: #222222;
              font-family: Arial, sans-serif;
              font-size: 12px;
            }

            .receipt {
              width: 100%;
              max-width: 720px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              margin-bottom: 24px;
            }

            .header h1 {
              margin: 0;
              font-size: 24px;
            }

            .header p {
              margin: 5px 0 0;
              color: #555555;
              font-size: 12px;
            }

            .divider {
              margin: 16px 0;
              border: 0;
              border-top: 1px solid #222222;
            }

            .info {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 18px;
            }

            .info td {
              padding: 4px 0;
              vertical-align: top;
            }

            .info td:first-child {
              width: 150px;
              color: #555555;
            }

            .items {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }

            .items th {
              padding: 9px 6px;
              text-align: left;
              border-top: 1px solid #222222;
              border-bottom: 1px solid #222222;
            }

            .items td {
              padding: 9px 6px;
              border-bottom: 1px solid #dddddd;
            }

            .center {
              text-align: center !important;
            }

            .right {
              text-align: right !important;
            }

            .total {
              display: flex;
              justify-content: space-between;
              margin-top: 16px;
              padding-top: 12px;
              border-top: 2px solid #222222;
              font-size: 16px;
              font-weight: 700;
            }

            .note {
              margin-top: 20px;
              color: #555555;
            }

            .footer {
              margin-top: 32px;
              text-align: center;
            }

            @media print {
              body {
                padding: 0;
              }

              @page {
                margin: 12mm;
              }
            }
          </style>
        </head>

        <body>
          <div class="receipt">
            <div class="header">
              <h1>Dapur Ina Aina</h1>
              <p>Billing Pembayaran</p>
            </div>

            <hr class="divider" />

            <table class="info">
              <tr>
                <td>No. Billing</td>
                <td>
                  ${escapeHtml(
                    billing.idBilling
                  )}
                </td>
              </tr>

              <tr>
                <td>No. Pesanan</td>
                <td>
                  ${escapeHtml(
                    pesanan.idPesanan
                  )}
                </td>
              </tr>

              <tr>
                <td>Tanggal</td>
                <td>
                  ${escapeHtml(
                    formatTanggal(
                      billing.tanggalCetak
                    )
                  )}
                </td>
              </tr>

              <tr>
                <td>Pelanggan</td>
                <td>
                  ${escapeHtml(
                    pesanan.pelanggan
                      ?.nama ?? '-'
                  )}
                </td>
              </tr>

              <tr>
                <td>Metode Pembayaran</td>
                <td>
                  ${escapeHtml(
                    formatMetodePembayaran(
                      pembayaran
                        ?.metodePembayaran
                    )
                  )}
                </td>
              </tr>
            </table>

            <table class="items">
              <thead>
                <tr>
                  <th>Menu</th>
                  <th class="center">
                    Qty
                  </th>
                  <th class="right">
                    Harga
                  </th>
                  <th class="right">
                    Subtotal
                  </th>
                </tr>
              </thead>

              <tbody>
                ${
                  detailRows ||
                  `
                    <tr>
                      <td colspan="4">
                        Tidak ada detail pesanan.
                      </td>
                    </tr>
                  `
                }
              </tbody>
            </table>

            <div class="total">
              <span>Total</span>

              <span>
                ${rupiah(
                  billing.jumlah
                )}
              </span>
            </div>

            ${
              pesanan.catatan
                ? `
                  <div class="note">
                    <strong>
                      Catatan:
                    </strong>

                    ${escapeHtml(
                      pesanan.catatan
                    )}
                  </div>
                `
                : ''
            }

            <div class="footer">
              Terima kasih telah melakukan
              pemesanan di Dapur Ina Aina.
            </div>
          </div>

          <script>
            window.onload = function () {
              window.print()
            }
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  function escapeHtml(
    value: string
  ) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Billing
          </h1>

          <p style={styles.subtitle}>
            Buat, lihat, dan cetak billing
            dari pesanan yang telah
            dibayar.
          </p>
        </div>
      </div>

      {success && (
        <div
          style={
            styles.successBox
          }
        >
          {success}
        </div>
      )}

      {error && (
        <div
          style={
            styles.errorBox
          }
        >
          {error}
        </div>
      )}

      <div
        style={
          styles.summaryGrid
        }
      >
        <div
          style={
            styles.summaryCard
          }
        >
          <span
            style={
              styles.summaryLabel
            }
          >
            Pesanan Dibayar
          </span>

          <strong
            style={
              styles.summaryValue
            }
          >
            {
              pesananSudahDibayar.length
            }
          </strong>
        </div>

        <div
          style={
            styles.summaryCard
          }
        >
          <span
            style={
              styles.summaryLabel
            }
          >
            Billing Dibuat
          </span>

          <strong
            style={
              styles.summaryValue
            }
          >
            {billings.length}
          </strong>
        </div>

        <div
          style={
            styles.summaryCard
          }
        >
          <span
            style={
              styles.summaryLabel
            }
          >
            Total Billing
          </span>

          <strong
            style={
              styles.summaryValueSmall
            }
          >
            {rupiah(
              totalBilling
            )}
          </strong>
        </div>
      </div>

      <div style={styles.card}>
        <div
          style={
            styles.cardHeader
          }
        >
          <div>
            <h2
              style={
                styles.cardTitle
              }
            >
              Pesanan Siap Billing
            </h2>

            <p
              style={
                styles.cardSubtitle
              }
            >
              Billing hanya dapat
              dibuat setelah
              pembayaran berhasil.
            </p>
          </div>
        </div>

        {loading ? (
          <div
            style={
              styles.emptyState
            }
          >
            Memuat data billing...
          </div>
        ) : pesananSudahDibayar.length ===
          0 ? (
          <div
            style={
              styles.emptyState
            }
          >
            Belum ada pesanan yang
            sudah dibayar.
          </div>
        ) : (
          <div
            style={
              styles.tableWrapper
            }
          >
            <table
              style={
                styles.table
              }
            >
              <thead>
                <tr>
                  <th style={styles.th}>
                    Pesanan
                  </th>

                  <th style={styles.th}>
                    Pelanggan
                  </th>

                  <th style={styles.th}>
                    Pembayaran
                  </th>

                  <th style={styles.th}>
                    Total
                  </th>

                  <th style={styles.th}>
                    Status Billing
                  </th>

                  <th style={styles.th}>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {pesananSudahDibayar.map(
                  (pesanan) => {
                    const pembayaran =
                      pembayaranByPesanan.get(
                        pesanan.idPesanan
                      )

                    const billing =
                      billingByPesanan.get(
                        pesanan.idPesanan
                      )

                    return (
                      <tr
                        key={
                          pesanan.idPesanan
                        }
                      >
                        <td style={styles.td}>
                          <span
                            style={
                              styles.orderId
                            }
                          >
                            {pesanan.idPesanan.slice(
                              0,
                              8
                            )}
                          </span>
                        </td>

                        <td style={styles.td}>
                          {pesanan
                            .pelanggan
                            ?.nama ??
                            '-'}
                        </td>

                        <td style={styles.td}>
                          {pembayaran
                            ? formatTanggal(
                                pembayaran.waktuPembayaran
                              )
                            : '-'}
                        </td>

                        <td style={styles.td}>
                          <strong>
                            {rupiah(
                              pesanan.totalHarga
                            )}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          {billing ? (
                            <span
                              style={
                                styles.doneBadge
                              }
                            >
                              Sudah Dibuat
                            </span>
                          ) : (
                            <span
                              style={
                                styles.pendingBadge
                              }
                            >
                              Belum Dibuat
                            </span>
                          )}
                        </td>

                        <td style={styles.td}>
                          {billing ? (
                            <button
                              type="button"
                              style={
                                styles.viewButton
                              }
                              disabled={
                                loadingDetail ===
                                billing.idBilling
                              }
                              onClick={() =>
                                viewBilling(
                                  billing.idBilling
                                )
                              }
                            >
                              {loadingDetail ===
                              billing.idBilling
                                ? 'Memuat...'
                                : 'Lihat Billing'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              style={
                                styles.createButton
                              }
                              disabled={
                                creating ===
                                pesanan.idPesanan
                              }
                              onClick={() =>
                                createBilling(
                                  pesanan.idPesanan
                                )
                              }
                            >
                              {creating ===
                              pesanan.idPesanan
                                ? 'Membuat...'
                                : 'Buat Billing'}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        style={{
          ...styles.card,
          marginTop: 20,
        }}
      >
        <div
          style={
            styles.cardHeader
          }
        >
          <div>
            <h2
              style={
                styles.cardTitle
              }
            >
              Riwayat Billing
            </h2>

            <p
              style={
                styles.cardSubtitle
              }
            >
              Daftar billing yang
              sudah dibuat.
            </p>
          </div>
        </div>

        {loading ? (
          <div
            style={
              styles.emptyState
            }
          >
            Memuat data...
          </div>
        ) : billings.length ===
          0 ? (
          <div
            style={
              styles.emptyState
            }
          >
            Belum ada billing.
          </div>
        ) : (
          <div
            style={
              styles.tableWrapper
            }
          >
            <table
              style={
                styles.table
              }
            >
              <thead>
                <tr>
                  <th style={styles.th}>
                    Billing
                  </th>

                  <th style={styles.th}>
                    Pesanan
                  </th>

                  <th style={styles.th}>
                    Pelanggan
                  </th>

                  <th style={styles.th}>
                    Jumlah
                  </th>

                  <th style={styles.th}>
                    Tanggal Cetak
                  </th>

                  <th style={styles.th}>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {billings.map(
                  (billing) => {
                    const pesanan =
                      pesanans.find(
                        (item) =>
                          item.idPesanan ===
                          billing.idPesanan
                      )

                    return (
                      <tr
                        key={
                          billing.idBilling
                        }
                      >
                        <td style={styles.td}>
                          <span
                            style={
                              styles.orderId
                            }
                          >
                            {billing.idBilling.slice(
                              0,
                              8
                            )}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <span
                            style={
                              styles.orderId
                            }
                          >
                            {billing.idPesanan.slice(
                              0,
                              8
                            )}
                          </span>
                        </td>

                        <td style={styles.td}>
                          {pesanan
                            ?.pelanggan
                            ?.nama ??
                            '-'}
                        </td>

                        <td style={styles.td}>
                          <strong>
                            {rupiah(
                              billing.jumlah
                            )}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          {formatTanggal(
                            billing.tanggalCetak
                          )}
                        </td>

                        <td style={styles.td}>
                          <button
                            type="button"
                            style={
                              styles.viewButton
                            }
                            disabled={
                              loadingDetail ===
                              billing.idBilling
                            }
                            onClick={() =>
                              viewBilling(
                                billing.idBilling
                              )
                            }
                          >
                            {loadingDetail ===
                            billing.idBilling
                              ? 'Memuat...'
                              : 'Lihat'}
                          </button>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedBilling && (
        <div
          style={
            styles.modalOverlay
          }
          onClick={
            closeBilling
          }
        >
          <div
            style={
              styles.modal
            }
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div
              style={
                styles.modalHeader
              }
            >
              <div>
                <h2
                  style={
                    styles.modalTitle
                  }
                >
                  Preview Billing
                </h2>

                <p
                  style={
                    styles.modalSubtitle
                  }
                >
                  Preview struk sebelum
                  dicetak.
                </p>
              </div>

              <button
                type="button"
                style={
                  styles.closeButton
                }
                onClick={
                  closeBilling
                }
              >
                ×
              </button>
            </div>

            <div
              style={
                styles.receipt
              }
            >
              <div
                style={
                  styles.receiptHeader
                }
              >
                <h2
                  style={
                    styles.receiptBrand
                  }
                >
                  Dapur Ina Aina
                </h2>

                <div
                  style={
                    styles.receiptLabel
                  }
                >
                  Billing Pembayaran
                </div>
              </div>

              <div
                style={
                  styles.receiptDivider
                }
              />

              <div
                style={
                  styles.receiptInfo
                }
              >
                <InfoRow
                  label="No. Billing"
                  value={
                    selectedBilling
                      .billing
                      .idBilling
                  }
                />

                <InfoRow
                  label="No. Pesanan"
                  value={
                    selectedBilling
                      .pesanan
                      .idPesanan
                  }
                />

                <InfoRow
                  label="Tanggal"
                  value={formatTanggal(
                    selectedBilling
                      .billing
                      .tanggalCetak
                  )}
                />

                <InfoRow
                  label="Pelanggan"
                  value={
                    selectedBilling
                      .pesanan
                      .pelanggan
                      ?.nama ?? '-'
                  }
                />

                <InfoRow
                  label="Pembayaran"
                  value={
                    formatMetodePembayaran(
                      selectedBilling
                        .pembayaran
                        ?.metodePembayaran
                    )
                  }
                />
              </div>

              <div
                style={
                  styles.receiptDivider
                }
              />

              <div
                style={
                  styles.receiptItemsHeader
                }
              >
                <span>
                  Menu
                </span>

                <span>
                  Qty
                </span>

                <span>
                  Subtotal
                </span>
              </div>

              {selectedBilling
                .pesanan
                .detailPesanans
                ?.length ? (
                selectedBilling
                  .pesanan
                  .detailPesanans
                  .map(
                    (detail) => (
                      <div
                        key={
                          detail.idDetail
                        }
                        style={
                          styles.receiptItem
                        }
                      >
                        <div>
                          <strong
                            style={
                              styles.itemName
                            }
                          >
                            {detail
                              .menu
                              ?.namaMenu ??
                              '-'}
                          </strong>

                          <span
                            style={
                              styles.itemPrice
                            }
                          >
                            {rupiah(
                              detail.harga
                            )}
                          </span>
                        </div>

                        <span>
                          {
                            detail.jumlah
                          }
                        </span>

                        <strong>
                          {rupiah(
                            detail.subTotal
                          )}
                        </strong>
                      </div>
                    )
                  )
              ) : (
                <div
                  style={
                    styles.noItems
                  }
                >
                  Tidak ada detail
                  pesanan.
                </div>
              )}

              <div
                style={
                  styles.receiptTotal
                }
              >
                <span>
                  Total
                </span>

                <strong>
                  {rupiah(
                    selectedBilling
                      .billing
                      .jumlah
                  )}
                </strong>
              </div>

              {selectedBilling
                .pesanan
                .catatan && (
                <div
                  style={
                    styles.receiptNote
                  }
                >
                  <strong>
                    Catatan
                  </strong>

                  <span>
                    {
                      selectedBilling
                        .pesanan
                        .catatan
                    }
                  </span>
                </div>
              )}

              <div
                style={
                  styles.receiptFooter
                }
              >
                Terima kasih telah
                melakukan pemesanan di
                Dapur Ina Aina.
              </div>
            </div>

            <div
              style={
                styles.modalActions
              }
            >
              <button
                type="button"
                style={
                  styles.cancelButton
                }
                onClick={
                  closeBilling
                }
              >
                Tutup
              </button>

              <button
                type="button"
                style={
                  styles.printButton
                }
                onClick={
                  printBilling
                }
              >
                Print Billing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div
      style={
        styles.infoRow
      }
    >
      <span
        style={
          styles.infoLabel
        }
      >
        {label}
      </span>

      <span
        style={
          styles.infoValue
        }
      >
        {value}
      </span>
    </div>
  )
}

const styles: Record<
  string,
  CSSProperties
> = {
  container: {
    fontFamily:
      'Arial, sans-serif',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 20,
    marginBottom: 24,
  },

  title: {
    margin: 0,
    color: '#202627',
    fontSize: 26,
  },

  subtitle: {
    margin: '6px 0 0',
    color: '#777',
    fontSize: 14,
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: 16,
    marginBottom: 20,
  },

  summaryCard: {
    padding: 18,
    background: '#fff',
    border:
      '1px solid #e8e8e8',
    borderRadius: 9,
  },

  summaryLabel: {
    display: 'block',
    marginBottom: 6,
    color: '#888',
    fontSize: 11,
  },

  summaryValue: {
    display: 'block',
    color: '#202627',
    fontSize: 24,
  },

  summaryValueSmall: {
    display: 'block',
    color: '#513934',
    fontSize: 18,
  },

  card: {
    background: '#fff',
    border:
      '1px solid #e8e8e8',
    borderRadius: 10,
    overflow: 'hidden',
  },

  cardHeader: {
    padding: '18px 20px',
    borderBottom:
      '1px solid #eee',
  },

  cardTitle: {
    margin: 0,
    color: '#202627',
    fontSize: 16,
  },

  cardSubtitle: {
    margin: '5px 0 0',
    color: '#888',
    fontSize: 12,
  },

  tableWrapper: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse:
      'collapse',
  },

  th: {
    padding: '14px 16px',
    textAlign: 'left',
    background: '#fafafa',
    color: '#777',
    fontSize: 12,
    borderBottom:
      '1px solid #eee',
  },

  td: {
    padding: '14px 16px',
    color: '#333',
    fontSize: 13,
    borderBottom:
      '1px solid #eee',
  },

  emptyState: {
    padding: 40,
    textAlign: 'center',
    color: '#888',
  },

  orderId: {
    fontFamily: 'monospace',
    fontSize: 12,
  },

  doneBadge: {
    display:
      'inline-block',
    padding: '5px 9px',
    borderRadius: 5,
    background: '#effaf3',
    color: '#22613a',
    fontSize: 11,
    fontWeight: 600,
  },

  pendingBadge: {
    display:
      'inline-block',
    padding: '5px 9px',
    borderRadius: 5,
    background: '#fff8e8',
    color: '#8a5a00',
    fontSize: 11,
    fontWeight: 600,
  },

  createButton: {
    width: 105,
    flex: 'none',
    padding: '8px 10px',
    border: 0,
    borderRadius: 6,
    background: '#513934',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },

  viewButton: {
    minWidth: 75,
    padding: '8px 11px',
    border:
      '1px solid #513934',
    borderRadius: 6,
    background: '#fff',
    color: '#513934',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },

  billingDate: {
    color: '#666',
    fontSize: 12,
  },

  successBox: {
    padding: '12px 14px',
    marginBottom: 16,
    background: '#effaf3',
    border:
      '1px solid #b7dec5',
    borderRadius: 8,
    color: '#22613a',
    fontSize: 14,
  },

  errorBox: {
    padding: '12px 14px',
    marginBottom: 16,
    background: '#fff1f0',
    border:
      '1px solid #ffc9c5',
    borderRadius: 8,
    color: '#a61b12',
    fontSize: 14,
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background:
      'rgba(0, 0, 0, 0.45)',
  },

  modal: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '92vh',
    overflowY: 'auto',
    background: '#f7f7f5',
    borderRadius: 12,
    boxShadow:
      '0 20px 60px rgba(0,0,0,0.22)',
  },

  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent:
      'space-between',
    gap: 20,
    padding: '18px 20px',
    background: '#fff',
    borderBottom:
      '1px solid #e7e7e7',
  },

  modalTitle: {
    margin: 0,
    color: '#202627',
    fontSize: 18,
  },

  modalSubtitle: {
    margin: '5px 0 0',
    color: '#888',
    fontSize: 12,
  },

  closeButton: {
    width: 32,
    height: 32,
    border:
      '1px solid #ddd',
    borderRadius: 6,
    background: '#fff',
    color: '#555',
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
  },

  receipt: {
    width: 'calc(100% - 40px)',
    maxWidth: 600,
    margin: '24px auto',
    padding: 28,
    background: '#fff',
    border:
      '1px solid #dedede',
    borderRadius: 8,
  },

  receiptHeader: {
    textAlign: 'center',
  },

  receiptBrand: {
    margin: 0,
    color: '#202627',
    fontSize: 22,
  },

  receiptLabel: {
    marginTop: 5,
    color: '#777',
    fontSize: 12,
  },

  receiptDivider: {
    height: 1,
    margin: '18px 0',
    background: '#ddd',
  },

  receiptInfo: {
    display: 'grid',
    gap: 8,
  },

  infoRow: {
    display: 'grid',
    gridTemplateColumns:
      '140px minmax(0, 1fr)',
    gap: 12,
    alignItems: 'start',
  },

  infoLabel: {
    color: '#777',
    fontSize: 12,
  },

  infoValue: {
    color: '#222',
    fontSize: 12,
    overflowWrap:
      'anywhere',
  },

  receiptItemsHeader: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(0, 1fr) 50px 120px',
    gap: 10,
    padding:
      '0 0 9px',
    color: '#777',
    fontSize: 11,
    fontWeight: 600,
    borderBottom:
      '1px solid #ddd',
  },

  receiptItem: {
    display: 'grid',
    gridTemplateColumns:
      'minmax(0, 1fr) 50px 120px',
    gap: 10,
    alignItems: 'center',
    padding:
      '11px 0',
    borderBottom:
      '1px solid #eee',
    color: '#333',
    fontSize: 12,
  },

  itemName: {
    display: 'block',
    color: '#222',
    fontSize: 12,
  },

  itemPrice: {
    display: 'block',
    marginTop: 3,
    color: '#888',
    fontSize: 10,
  },

  noItems: {
    padding:
      '20px 0',
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  },

  receiptTotal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTop:
      '2px solid #333',
    color: '#202627',
    fontSize: 16,
  },

  receiptNote: {
    display: 'grid',
    gap: 5,
    marginTop: 18,
    padding: 12,
    background: '#fafafa',
    color: '#555',
    fontSize: 11,
  },

  receiptFooter: {
    marginTop: 28,
    textAlign: 'center',
    color: '#777',
    fontSize: 11,
  },

  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    padding: '16px 20px',
    background: '#fff',
    borderTop:
      '1px solid #e7e7e7',
  },

  cancelButton: {
    padding: '9px 14px',
    border:
      '1px solid #ddd',
    borderRadius: 6,
    background: '#fff',
    color: '#555',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },

  printButton: {
    padding: '9px 16px',
    border: 0,
    borderRadius: 6,
    background: '#513934',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
}