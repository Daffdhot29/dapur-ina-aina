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

type Pesanan = {
  idPesanan: string
  idPelanggan: string
  tanggalPesanan: string
  totalPesanan: number
  totalHarga: number | string
  catatan?: string | null
  pelanggan?: Pelanggan
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Billing
          </h1>

          <p style={styles.subtitle}>
            Buat dan lihat billing
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
                  <th
                    style={
                      styles.th
                    }
                  >
                    Pesanan
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Pelanggan
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Pembayaran
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Total
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Status Billing
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
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
                        <td
                          style={
                            styles.td
                          }
                        >
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

                        <td
                          style={
                            styles.td
                          }
                        >
                          {pesanan
                            .pelanggan
                            ?.nama ??
                            '-'}
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          {pembayaran
                            ? formatTanggal(
                                pembayaran.waktuPembayaran
                              )
                            : '-'}
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          <strong>
                            {rupiah(
                              pesanan.totalHarga
                            )}
                          </strong>
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
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

                        <td
                          style={
                            styles.td
                          }
                        >
                          {billing ? (
                            <span
                              style={
                                styles.billingDate
                              }
                            >
                              {formatTanggal(
                                billing.tanggalCetak
                              )}
                            </span>
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
                  <th
                    style={
                      styles.th
                    }
                  >
                    Billing
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Pesanan
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Pelanggan
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Jumlah
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Tanggal Cetak
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
                        <td
                          style={
                            styles.td
                          }
                        >
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

                        <td
                          style={
                            styles.td
                          }
                        >
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

                        <td
                          style={
                            styles.td
                          }
                        >
                          {pesanan
                            ?.pelanggan
                            ?.nama ??
                            '-'}
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          <strong>
                            {rupiah(
                              billing.jumlah
                            )}
                          </strong>
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          {formatTanggal(
                            billing.tanggalCetak
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
}