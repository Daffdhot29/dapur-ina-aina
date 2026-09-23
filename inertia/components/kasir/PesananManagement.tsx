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
  nomorHp?: string | null
}

type Menu = {
  idMenu: string
  namaMenu: string
  harga: number | string
  stok: number
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

type CartItem = {
  idMenu: string
  jumlah: number
}

export default function PesananManagement() {
  const [pesanans, setPesanans] =
    useState<Pesanan[]>([])

  const [pelanggans, setPelanggans] =
    useState<Pelanggan[]>([])

  const [menus, setMenus] =
    useState<Menu[]>([])

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [showCreate, setShowCreate] =
    useState(false)

  const [showDetail, setShowDetail] =
    useState(false)

  const [
    selectedPesanan,
    setSelectedPesanan,
  ] = useState<Pesanan | null>(null)

  const [idPelanggan, setIdPelanggan] =
    useState('')

  const [catatan, setCatatan] =
    useState('')

  const [items, setItems] =
    useState<CartItem[]>([])

  const rupiah = (
    value: number | string
  ) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value))

  const formatTanggal = (
    value: string
  ) => {
    if (!value) {
      return '-'
    }

    return new Date(
      value
    ).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getMenu = (
    idMenu: string
  ) =>
    menus.find(
      (menu) =>
        menu.idMenu === idMenu
    )

  const totalHarga =
    useMemo(() => {
      return items.reduce(
        (total, item) => {
          const menu =
            getMenu(item.idMenu)

          if (!menu) {
            return total
          }

          return (
            total +
            Number(menu.harga) *
              item.jumlah
          )
        },
        0
      )
    }, [items, menus])

  const totalItem =
    useMemo(() => {
      return items.reduce(
        (total, item) =>
          total + item.jumlah,
        0
      )
    }, [items])

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [
        pesananResponse,
        pelangganResponse,
        menuResponse,
      ] = await Promise.all([
        apiFetch('/api/pesanans'),
        apiFetch('/api/pelanggans'),
        apiFetch('/api/menus'),
      ])

      if (
        !pesananResponse.ok ||
        !pelangganResponse.ok ||
        !menuResponse.ok
      ) {
        throw new Error(
          'Gagal mengambil data'
        )
      }

      const pesananJson =
        await pesananResponse.json()

      const pelangganJson =
        await pelangganResponse.json()

      const menuJson =
        await menuResponse.json()

      setPesanans(
        pesananJson.data ?? []
      )

      setPelanggans(
        pelangganJson.data ?? []
      )

      setMenus(
        menuJson.data ?? []
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

  const openCreate = () => {
    setIdPelanggan('')
    setCatatan('')
    setItems([])
    setError('')
    setShowCreate(true)
  }

  const addMenu = (
    idMenu: string
  ) => {
    if (!idMenu) {
      return
    }

    const menu =
      getMenu(idMenu)

    if (
      !menu ||
      menu.stok <= 0
    ) {
      return
    }

    const alreadyExists =
      items.some(
        (item) =>
          item.idMenu === idMenu
      )

    if (alreadyExists) {
      return
    }

    setItems((current) => [
      ...current,
      {
        idMenu,
        jumlah: 1,
      },
    ])
  }

  const changeJumlah = (
    idMenu: string,
    jumlah: number
  ) => {
    const menu =
      getMenu(idMenu)

    if (!menu) {
      return
    }

    const safeJumlah =
      Math.max(
        1,
        Math.min(
          jumlah,
          menu.stok
        )
      )

    setItems((current) =>
      current.map((item) =>
        item.idMenu === idMenu
          ? {
              ...item,
              jumlah: safeJumlah,
            }
          : item
      )
    )
  }

  const removeItem = (
    idMenu: string
  ) => {
    setItems((current) =>
      current.filter(
        (item) =>
          item.idMenu !== idMenu
      )
    )
  }

  const submitPesanan =
    async () => {
      if (!idPelanggan) {
        setError(
          'Pilih pelanggan terlebih dahulu'
        )
        return
      }

      if (
        items.length === 0
      ) {
        setError(
          'Pilih minimal satu menu'
        )
        return
      }

      setSaving(true)
      setError('')

      try {
        const response =
          await apiFetch(
            '/api/pesanans',
            {
              method: 'POST',

              body: JSON.stringify({
                idPelanggan,

                catatan:
                  catatan.trim() ||
                  undefined,

                items: items.map(
                  (item) => ({
                    idMenu:
                      item.idMenu,

                    jumlah:
                      item.jumlah,
                  })
                ),
              }),
            }
          )

        const result =
          await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ??
              'Gagal membuat pesanan'
          )
        }

        setShowCreate(false)
        setIdPelanggan('')
        setCatatan('')
        setItems([])

        await loadData()
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Gagal membuat pesanan'
        )
      } finally {
        setSaving(false)
      }
    }

  const openDetail = async (
    pesanan: Pesanan
  ) => {
    setError('')

    try {
      const response =
        await apiFetch(
          `/api/pesanans/${pesanan.idPesanan}`
        )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ??
            'Gagal mengambil detail pesanan'
        )
      }

      setSelectedPesanan(
        result.data
      )

      setShowDetail(true)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil detail pesanan'
      )
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
          onClick={openCreate}
        >
          + Buat Pesanan
        </button>
      </div>

      {error && (
        <div
          style={styles.errorBox}
        >
          {error}
        </div>
      )}

      <div style={styles.card}>
        {loading ? (
          <div
            style={
              styles.emptyState
            }
          >
            Memuat data pesanan...
          </div>
        ) : pesanans.length ===
          0 ? (
          <div
            style={
              styles.emptyState
            }
          >
            Belum ada pesanan.
          </div>
        ) : (
          <div
            style={
              styles.tableWrapper
            }
          >
            <table
              style={styles.table}
            >
              <thead>
                <tr>
                  <th
                    style={styles.th}
                  >
                    Tanggal
                  </th>

                  <th
                    style={styles.th}
                  >
                    Pelanggan
                  </th>

                  <th
                    style={styles.th}
                  >
                    Jumlah
                  </th>

                  <th
                    style={styles.th}
                  >
                    Total
                  </th>

                  <th
                    style={styles.th}
                  >
                    Catatan
                  </th>

                  <th
                    style={styles.th}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {pesanans.map(
                  (pesanan) => (
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
                        {formatTanggal(
                          pesanan.tanggalPesanan
                        )}
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
                        {
                          pesanan.totalPesanan
                        }{' '}
                        item
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
                        {pesanan.catatan ||
                          '-'}
                      </td>

                      <td
                        style={
                          styles.td
                        }
                      >
                        <button
                          type="button"
                          style={
                            styles.secondaryButton
                          }
                          onClick={() =>
                            openDetail(
                              pesanan
                            )
                          }
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div
          style={styles.overlay}
        >
          <div
            style={styles.modal}
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
                  Buat Pesanan
                </h2>

                <p
                  style={
                    styles.modalSubtitle
                  }
                >
                  Pilih pelanggan dan
                  menu yang dipesan.
                </p>
              </div>

              <button
                type="button"
                style={
                  styles.closeButton
                }
                onClick={() =>
                  setShowCreate(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

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
                Pelanggan
              </label>

              <select
                value={
                  idPelanggan
                }
                onChange={(event) =>
                  setIdPelanggan(
                    event.target
                      .value
                  )
                }
                style={
                  styles.input
                }
              >
                <option value="">
                  Pilih pelanggan
                </option>

                {pelanggans.map(
                  (pelanggan) => (
                    <option
                      key={
                        pelanggan.idPelanggan
                      }
                      value={
                        pelanggan.idPelanggan
                      }
                    >
                      {
                        pelanggan.nama
                      }

                      {pelanggan.nomorHp
                        ? ` - ${pelanggan.nomorHp}`
                        : ''}
                    </option>
                  )
                )}
              </select>
            </div>

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
                Tambah Menu
              </label>

              <select
                defaultValue=""
                style={
                  styles.input
                }
                onChange={(
                  event
                ) => {
                  addMenu(
                    event.target
                      .value
                  )

                  event.target.value =
                    ''
                }}
              >
                <option value="">
                  Pilih menu
                </option>

                {menus
                  .filter(
                    (menu) =>
                      menu.stok >
                        0 &&
                      !items.some(
                        (item) =>
                          item.idMenu ===
                          menu.idMenu
                      )
                  )
                  .map((menu) => (
                    <option
                      key={
                        menu.idMenu
                      }
                      value={
                        menu.idMenu
                      }
                    >
                      {
                        menu.namaMenu
                      }{' '}
                      -{' '}
                      {rupiah(
                        menu.harga
                      )}{' '}
                      - stok{' '}
                      {menu.stok}
                    </option>
                  ))}
              </select>
            </div>

            <div
              style={
                styles.orderBox
              }
            >
              {items.length ===
              0 ? (
                <div
                  style={
                    styles.emptyItems
                  }
                >
                  Belum ada menu
                  dipilih.
                </div>
              ) : (
                items.map(
                  (item) => {
                    const menu =
                      getMenu(
                        item.idMenu
                      )

                    if (!menu) {
                      return null
                    }

                    return (
                      <div
                        key={
                          item.idMenu
                        }
                        style={
                          styles.orderItem
                        }
                      >
                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={
                              styles.menuName
                            }
                          >
                            {
                              menu.namaMenu
                            }
                          </div>

                          <div
                            style={
                              styles.menuPrice
                            }
                          >
                            {rupiah(
                              menu.harga
                            )}
                          </div>
                        </div>

                        <input
                          type="number"
                          min={1}
                          max={
                            menu.stok
                          }
                          value={
                            item.jumlah
                          }
                          onChange={(
                            event
                          ) =>
                            changeJumlah(
                              item.idMenu,
                              Number(
                                event
                                  .target
                                  .value
                              )
                            )
                          }
                          style={
                            styles.quantityInput
                          }
                        />

                        <div
                          style={
                            styles.subtotal
                          }
                        >
                          {rupiah(
                            Number(
                              menu.harga
                            ) *
                              item.jumlah
                          )}
                        </div>

                        <button
                          type="button"
                          style={
                            styles.removeButton
                          }
                          onClick={() =>
                            removeItem(
                              item.idMenu
                            )
                          }
                        >
                          Hapus
                        </button>
                      </div>
                    )
                  }
                )
              )}
            </div>

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
                Catatan
              </label>

              <textarea
                value={catatan}
                onChange={(event) =>
                  setCatatan(
                    event.target
                      .value
                  )
                }
                placeholder="Contoh: tidak pedas"
                style={{
                  ...styles.input,

                  minHeight: 90,

                  resize:
                    'vertical',
                }}
              />
            </div>

            <div
              style={
                styles.summary
              }
            >
              <div>
                <span
                  style={
                    styles.summaryLabel
                  }
                >
                  Total Item
                </span>

                <strong>
                  {totalItem}
                </strong>
              </div>

              <div>
                <span
                  style={
                    styles.summaryLabel
                  }
                >
                  Total Harga
                </span>

                <strong
                  style={
                    styles.totalPrice
                  }
                >
                  {rupiah(
                    totalHarga
                  )}
                </strong>
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
                onClick={() =>
                  setShowCreate(
                    false
                  )
                }
                disabled={saving}
              >
                Batal
              </button>

              <button
                type="button"
                style={
                  styles.saveButton
                }
                onClick={
                  submitPesanan
                }
                disabled={saving}
              >
                {saving
                  ? 'Menyimpan...'
                  : 'Simpan Pesanan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetail &&
        selectedPesanan && (
          <div
            style={
              styles.overlay
            }
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
                    Detail Pesanan
                  </h2>

                  <p
                    style={
                      styles.modalSubtitle
                    }
                  >
                    {selectedPesanan
                      .pelanggan
                      ?.nama ??
                      'Pelanggan'}
                  </p>
                </div>

                <button
                  type="button"
                  style={
                    styles.closeButton
                  }
                  onClick={() => {
                    setShowDetail(
                      false
                    )

                    setSelectedPesanan(
                      null
                    )
                  }}
                >
                  ×
                </button>
              </div>

              <div
                style={
                  styles.detailInfo
                }
              >
                <div>
                  <span
                    style={
                      styles.summaryLabel
                    }
                  >
                    Tanggal
                  </span>

                  <strong>
                    {formatTanggal(
                      selectedPesanan.tanggalPesanan
                    )}
                  </strong>
                </div>

                <div>
                  <span
                    style={
                      styles.summaryLabel
                    }
                  >
                    Total
                  </span>

                  <strong>
                    {rupiah(
                      selectedPesanan.totalHarga
                    )}
                  </strong>
                </div>
              </div>

              <div
                style={
                  styles.detailTable
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
                        Menu
                      </th>

                      <th
                        style={
                          styles.th
                        }
                      >
                        Harga
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
                        Subtotal
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedPesanan
                      .detailPesanans
                      ?.map(
                        (
                          detail
                        ) => (
                          <tr
                            key={
                              detail.idDetail
                            }
                          >
                            <td
                              style={
                                styles.td
                              }
                            >
                              {detail
                                .menu
                                ?.namaMenu ??
                                '-'}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {rupiah(
                                detail.harga
                              )}
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              {
                                detail.jumlah
                              }
                            </td>

                            <td
                              style={
                                styles.td
                              }
                            >
                              <strong>
                                {rupiah(
                                  detail.subTotal
                                )}
                              </strong>
                            </td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>

              {selectedPesanan.catatan && (
                <div
                  style={
                    styles.noteBox
                  }
                >
                  <strong>
                    Catatan:
                  </strong>{' '}
                  {
                    selectedPesanan.catatan
                  }
                </div>
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
    justifyContent:
      'space-between',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },

  title: {
    margin: 0,
    fontSize: 26,
    color: '#202627',
  },

  subtitle: {
    margin: '6px 0 0',
    color: '#777',
    fontSize: 14,
  },

  primaryButton: {
    width: 150,
    flex: 'none',
    border: 0,
    borderRadius: 8,
    background: '#513934',
    color: '#fff',
    padding: '11px 16px',
    cursor: 'pointer',
    fontWeight: 600,
  },

  card: {
    background: '#fff',
    border:
      '1px solid #e8e8e8',
    borderRadius: 10,
    overflow: 'hidden',
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
    fontSize: 12,
    color: '#777',
    background: '#fafafa',
    borderBottom:
      '1px solid #eee',
  },

  td: {
    padding: '14px 16px',
    fontSize: 14,
    color: '#333',
    borderBottom:
      '1px solid #eee',
  },

  secondaryButton: {
    width: 80,
    flex: 'none',
    border:
      '1px solid #ddd',
    borderRadius: 7,
    background: '#fff',
    padding: '7px 12px',
    cursor: 'pointer',
  },

  emptyState: {
    padding: 40,
    textAlign: 'center',
    color: '#888',
  },

  errorBox: {
    padding: '12px 14px',
    background: '#fff1f0',
    border:
      '1px solid #ffc9c5',
    borderRadius: 8,
    color: '#a61b12',
    marginBottom: 16,
    fontSize: 14,
  },

  overlay: {
    position: 'fixed',
    inset: 0,
    background:
      'rgba(0,0,0,.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      'center',
    padding: 20,
    zIndex: 1000,
  },

  modal: {
    width:
      'min(760px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    background: '#fff',
    borderRadius: 12,
    padding: 24,
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
    fontSize: 21,
    color: '#222',
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
    fontSize: 13,
    fontWeight: 600,
    color: '#444',
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

  orderBox: {
    border:
      '1px solid #eee',
    borderRadius: 8,
    marginBottom: 18,
  },

  orderItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderBottom:
      '1px solid #eee',
  },

  menuName: {
    fontWeight: 600,
    fontSize: 14,
  },

  menuPrice: {
    color: '#888',
    fontSize: 12,
    marginTop: 3,
  },

  quantityInput: {
    width: 65,
    padding: '8px',
    border:
      '1px solid #ddd',
    borderRadius: 6,
  },

  subtotal: {
    width: 120,
    fontWeight: 600,
    fontSize: 13,
    textAlign: 'right',
  },

  removeButton: {
    width: 65,
    flex: 'none',
    border:
      '1px solid #e1b6b3',
    borderRadius: 6,
    background: '#fff',
    color: '#a33',
    padding: '7px',
    cursor: 'pointer',
  },

  emptyItems: {
    padding: 24,
    textAlign: 'center',
    color: '#999',
    fontSize: 13,
  },

  summary: {
    display: 'flex',
    justifyContent:
      'space-between',
    background: '#f7f5f4',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },

  summaryLabel: {
    display: 'block',
    fontSize: 11,
    color: '#888',
    marginBottom: 5,
  },

  totalPrice: {
    fontSize: 18,
    color: '#513934',
  },

  modalActions: {
    display: 'flex',
    justifyContent:
      'flex-end',
    gap: 10,
  },

  cancelButton: {
    width: 90,
    flex: 'none',
    border:
      '1px solid #ddd',
    background: '#fff',
    borderRadius: 7,
    padding: '10px',
    cursor: 'pointer',
  },

  saveButton: {
    width: 145,
    flex: 'none',
    border: 0,
    background: '#513934',
    color: '#fff',
    borderRadius: 7,
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 600,
  },

  detailInfo: {
    display: 'grid',
    gridTemplateColumns:
      '1fr 1fr',
    gap: 15,
    background: '#f7f5f4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 18,
  },

  detailTable: {
    border:
      '1px solid #eee',
    borderRadius: 8,
    overflow: 'hidden',
  },

  noteBox: {
    marginTop: 18,
    padding: 13,
    background: '#fafafa',
    borderRadius: 7,
    color: '#555',
    fontSize: 13,
  },
}