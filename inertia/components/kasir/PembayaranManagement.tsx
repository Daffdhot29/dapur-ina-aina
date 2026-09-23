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
  pelanggan?: Pelanggan
}

type Pembayaran = {
  idPembayaran: string
  idPesanan: string
  jumlah: number | string
  metodePembayaran: string
  waktuPembayaran: string
}

type MetodePembayaran =
  | 'tunai'
  | 'non_tunai'

export default function PembayaranManagement() {
  const [pesanans, setPesanans] =
    useState<Pesanan[]>([])

  const [pembayarans, setPembayarans] =
    useState<Pembayaran[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [success, setSuccess] =
    useState('')

  const [showModal, setShowModal] =
    useState(false)

  const [idPesanan, setIdPesanan] =
    useState('')

  const [
    metodePembayaran,
    setMetodePembayaran,
  ] = useState<MetodePembayaran>(
    'tunai'
  )

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
      ] = await Promise.all([
        apiFetch(
          '/api/pesanans'
        ),

        apiFetch(
          '/api/pembayarans'
        ),
      ])

      if (!pesananResponse.ok) {
        throw new Error(
          'Gagal mengambil data pesanan'
        )
      }

      if (!pembayaranResponse.ok) {
        throw new Error(
          'Gagal mengambil data pembayaran'
        )
      }

      const pesananResult =
        await pesananResponse.json()

      const pembayaranResult =
        await pembayaranResponse.json()

      setPesanans(
        pesananResult.data ?? []
      )

      setPembayarans(
        pembayaranResult.data ?? []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data'
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

  const pesananBelumDibayar =
    useMemo(() => {
      return pesanans.filter(
        (pesanan) =>
          !pembayaranByPesanan.has(
            pesanan.idPesanan
          )
      )
    }, [
      pesanans,
      pembayaranByPesanan,
    ])

  const selectedPesanan =
    useMemo(() => {
      return pesanans.find(
        (pesanan) =>
          pesanan.idPesanan ===
          idPesanan
      )
    }, [
      pesanans,
      idPesanan,
    ])

  function openPembayaran() {
    setIdPesanan('')
    setMetodePembayaran(
      'tunai'
    )

    setError('')
    setSuccess('')
    setShowModal(true)
  }

  function closeModal() {
    if (saving) {
      return
    }

    setShowModal(false)
    setIdPesanan('')

    setMetodePembayaran(
      'tunai'
    )
  }

  async function submitPembayaran() {
    if (!idPesanan) {
      setError(
        'Pilih pesanan terlebih dahulu'
      )
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response =
        await apiFetch(
          '/api/pembayarans',
          {
            method: 'POST',

            body: JSON.stringify({
              idPesanan,
              metodePembayaran,
            }),
          }
        )

      const result =
        await response
          .json()
          .catch(() => null)

      if (!response.ok) {
        throw new Error(
          result?.message ??
            'Pembayaran gagal diproses'
        )
      }

      setShowModal(false)
      setIdPesanan('')

      setMetodePembayaran(
        'tunai'
      )

      await loadData()

      setSuccess(
        'Pembayaran berhasil dicatat'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Pembayaran gagal diproses'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>

        <button
          type="button"
          style={
            styles.primaryButton
          }
          onClick={
            openPembayaran
          }
        >
          + Proses Pembayaran
        </button>
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
            Total Pesanan
          </span>

          <strong
            style={
              styles.summaryValue
            }
          >
            {pesanans.length}
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
            Sudah Dibayar
          </span>

          <strong
            style={
              styles.summaryValue
            }
          >
            {
              pembayarans.length
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
            Belum Dibayar
          </span>

          <strong
            style={
              styles.summaryValue
            }
          >
            {
              pesananBelumDibayar.length
            }
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
              Riwayat Pembayaran
            </h2>

            <p
              style={
                styles.cardSubtitle
              }
            >
              Daftar transaksi
              pembayaran yang telah
              diproses.
            </p>
          </div>
        </div>

        {loading ? (
          <div
            style={
              styles.emptyState
            }
          >
            Memuat data
            pembayaran...
          </div>
        ) : pembayarans.length ===
          0 ? (
          <div
            style={
              styles.emptyState
            }
          >
            Belum ada pembayaran.
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
                    Waktu
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
                    Metode
                  </th>

                  <th
                    style={
                      styles.th
                    }
                  >
                    Jumlah
                  </th>
                </tr>
              </thead>

              <tbody>
                {pembayarans.map(
                  (
                    pembayaran
                  ) => {
                    const pesanan =
                      pesanans.find(
                        (item) =>
                          item.idPesanan ===
                          pembayaran.idPesanan
                      )

                    return (
                      <tr
                        key={
                          pembayaran.idPembayaran
                        }
                      >
                        <td
                          style={
                            styles.td
                          }
                        >
                          {formatTanggal(
                            pembayaran.waktuPembayaran
                          )}
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
                            {pembayaran.idPesanan.slice(
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
                          <span
                            style={
                              styles.methodBadge
                            }
                          >
                            {pembayaran.metodePembayaran ===
                            'tunai'
                              ? 'Tunai'
                              : 'Non-tunai'}
                          </span>
                        </td>

                        <td
                          style={
                            styles.td
                          }
                        >
                          <strong>
                            {rupiah(
                              pembayaran.jumlah
                            )}
                          </strong>
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

      {showModal && (
        <div
          style={
            styles.overlay
          }
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal()
            }
          }}
        >
          <div
            style={
              styles.modal
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
                  Proses Pembayaran
                </h2>

                <p
                  style={
                    styles.modalSubtitle
                  }
                >
                  Pilih pesanan yang
                  akan dibayar.
                </p>
              </div>

              <button
                type="button"
                style={
                  styles.closeButton
                }
                onClick={
                  closeModal
                }
              >
                ×
              </button>
            </div>

            {pesananBelumDibayar.length ===
            0 ? (
              <div
                style={
                  styles.noOrderBox
                }
              >
                Semua pesanan sudah
                dibayar.
              </div>
            ) : (
              <>
                <div
                  style={
                    styles.formGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Pesanan
                  </label>

                  <select
                    value={
                      idPesanan
                    }
                    onChange={(
                      event
                    ) =>
                      setIdPesanan(
                        event
                          .target
                          .value
                      )
                    }
                    style={
                      styles.input
                    }
                  >
                    <option value="">
                      Pilih pesanan
                    </option>

                    {pesananBelumDibayar.map(
                      (
                        pesanan
                      ) => (
                        <option
                          key={
                            pesanan.idPesanan
                          }
                          value={
                            pesanan.idPesanan
                          }
                        >
                          {pesanan
                            .pelanggan
                            ?.nama ??
                            'Pelanggan'}{' '}
                          -{' '}
                          {rupiah(
                            pesanan.totalHarga
                          )}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {selectedPesanan && (
                  <div
                    style={
                      styles.orderSummary
                    }
                  >
                    <div>
                      <span
                        style={
                          styles.summaryLabel
                        }
                      >
                        Pelanggan
                      </span>

                      <strong>
                        {selectedPesanan
                          .pelanggan
                          ?.nama ??
                          '-'}
                      </strong>
                    </div>

                    <div>
                      <span
                        style={
                          styles.summaryLabel
                        }
                      >
                        Jumlah Item
                      </span>

                      <strong>
                        {
                          selectedPesanan.totalPesanan
                        }
                      </strong>
                    </div>

                    <div>
                      <span
                        style={
                          styles.summaryLabel
                        }
                      >
                        Total Bayar
                      </span>

                      <strong
                        style={
                          styles.totalPrice
                        }
                      >
                        {rupiah(
                          selectedPesanan.totalHarga
                        )}
                      </strong>
                    </div>
                  </div>
                )}

                <div
                  style={
                    styles.formGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Metode Pembayaran
                  </label>

                  <select
                    value={
                      metodePembayaran
                    }
                    onChange={(
                      event
                    ) =>
                      setMetodePembayaran(
                        event
                          .target
                          .value as MetodePembayaran
                      )
                    }
                    style={
                      styles.input
                    }
                  >
                    <option value="tunai">
                      Tunai
                    </option>

                    <option value="non_tunai">
                      Non-tunai
                    </option>
                  </select>
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
                      closeModal
                    }
                    disabled={
                      saving
                    }
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    style={
                      styles.saveButton
                    }
                    onClick={
                      submitPembayaran
                    }
                    disabled={
                      saving ||
                      !idPesanan
                    }
                  >
                    {saving
                      ? 'Memproses...'
                      : 'Bayar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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

  primaryButton: {
    width: 175,
    flex: 'none',
    border: 0,
    borderRadius: 8,
    background: '#513934',
    color: '#fff',
    padding: '11px 16px',
    cursor: 'pointer',
    fontWeight: 600,
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: 16,
    marginBottom: 20,
  },

  summaryCard: {
    background: '#fff',
    border:
      '1px solid #e8e8e8',
    borderRadius: 9,
    padding: 18,
  },

  summaryLabel: {
    display: 'block',
    color: '#888',
    fontSize: 11,
    marginBottom: 6,
  },

  summaryValue: {
    display: 'block',
    color: '#202627',
    fontSize: 24,
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

  orderId: {
    fontFamily: 'monospace',
    fontSize: 12,
  },

  methodBadge: {
    display:
      'inline-block',
    padding: '5px 9px',
    borderRadius: 5,
    background: '#f3f1f0',
    color: '#513934',
    fontSize: 11,
    fontWeight: 600,
  },

  emptyState: {
    padding: 40,
    textAlign: 'center',
    color: '#888',
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

  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'center',
    padding: 20,
    background:
      'rgba(0,0,0,.45)',
  },

  modal: {
    width:
      'min(560px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: 24,
    background: '#fff',
    borderRadius: 12,
    boxShadow:
      '0 20px 60px rgba(0,0,0,.2)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent:
      'space-between',
    alignItems:
      'flex-start',
    marginBottom: 22,
  },

  modalTitle: {
    margin: 0,
    color: '#222',
    fontSize: 21,
  },

  modalSubtitle: {
    margin: '5px 0 0',
    color: '#888',
    fontSize: 13,
  },

  closeButton: {
    width: 34,
    height: 34,
    flex: 'none',
    border: 0,
    borderRadius: 6,
    background: '#f3f3f3',
    fontSize: 22,
    cursor: 'pointer',
  },

  formGroup: {
    marginBottom: 18,
  },

  label: {
    display: 'block',
    marginBottom: 7,
    color: '#444',
    fontSize: 13,
    fontWeight: 600,
  },

  input: {
    width: '100%',
    boxSizing:
      'border-box',
    padding: '10px 12px',
    border:
      '1px solid #ddd',
    borderRadius: 7,
    background: '#fff',
    fontFamily:
      'Arial, sans-serif',
  },

  orderSummary: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: 12,
    padding: 15,
    marginBottom: 18,
    background: '#f7f5f4',
    borderRadius: 8,
  },

  totalPrice: {
    color: '#513934',
    fontSize: 16,
  },

  modalActions: {
    display: 'flex',
    justifyContent:
      'flex-end',
    gap: 10,
    marginTop: 22,
  },

  cancelButton: {
    width: 90,
    flex: 'none',
    padding: '10px',
    border:
      '1px solid #ddd',
    borderRadius: 7,
    background: '#fff',
    cursor: 'pointer',
  },

  saveButton: {
    width: 110,
    flex: 'none',
    padding: '10px',
    border: 0,
    borderRadius: 7,
    background: '#513934',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },

  noOrderBox: {
    padding: 24,
    border:
      '1px solid #eee',
    borderRadius: 8,
    background: '#fafafa',
    color: '#777',
    textAlign: 'center',
    fontSize: 13,
  },
}