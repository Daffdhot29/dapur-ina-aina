import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { apiFetch } from '~/lib/api'

type Kategori = {
  idKategori: string
  namaKategori: string
}

type Menu = {
  idMenu: string
  idKategori: string
  namaMenu: string
  deskripsi: string | null
  harga: number
  stok: number
  kategori?: Kategori
}

type MenuForm = {
  namaMenu: string
  idKategori: string
  deskripsi: string
  harga: string
  stok: string
}

type KategoriForm = {
  namaKategori: string
}

const colors = {
  primary: '#513934',
  text: '#202426',
  muted: '#686E70',
  white: '#FFFFFF',
  border: '#E0E2DF',
  tableHeader: '#F7F7F5',
  danger: '#B42318',
}

const emptyMenuForm: MenuForm = {
  namaMenu: '',
  idKategori: '',
  deskripsi: '',
  harga: '',
  stok: '',
}

export default function MenuManagement() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [kategoris, setKategoris] = useState<Kategori[]>([])

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [menuModalOpen, setMenuModalOpen] = useState(false)
  const [kategoriModalOpen, setKategoriModalOpen] = useState(false)

  const [editingMenu, setEditingMenu] = useState<Menu | null>(null)

  const [menuForm, setMenuForm] =
    useState<MenuForm>(emptyMenuForm)

  const [kategoriForm, setKategoriForm] =
    useState<KategoriForm>({
      namaKategori: '',
    })

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [menuResponse, kategoriResponse] =
        await Promise.all([
          apiFetch('/api/menus'),
          apiFetch('/api/kategoris'),
        ])

      if (!menuResponse.ok) {
        throw new Error('Gagal mengambil data menu.')
      }

      if (!kategoriResponse.ok) {
        throw new Error('Gagal mengambil data kategori.')
      }

      const menuData = await menuResponse.json()
      const kategoriData = await kategoriResponse.json()

      setMenus(
        Array.isArray(menuData)
          ? menuData
          : menuData.data ?? []
      )

      setKategoris(
        Array.isArray(kategoriData)
          ? kategoriData
          : kategoriData.data ?? []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredMenus = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    if (!keyword) {
      return menus
    }

    return menus.filter((menu) => {
      const kategori = kategoris.find(
        (item) =>
          item.idKategori === menu.idKategori
      )

      return (
        menu.namaMenu
          .toLowerCase()
          .includes(keyword) ||
        kategori?.namaKategori
          .toLowerCase()
          .includes(keyword)
      )
    })
  }, [menus, kategoris, search])

  function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function openCreateMenu() {
    setEditingMenu(null)

    setMenuForm({
      ...emptyMenuForm,
      idKategori:
        kategoris[0]?.idKategori ?? '',
    })

    setMessage('')
    setError('')
    setMenuModalOpen(true)
  }

  function openEditMenu(menu: Menu) {
    setEditingMenu(menu)

    setMenuForm({
      namaMenu: menu.namaMenu,
      idKategori: menu.idKategori,
      deskripsi: menu.deskripsi ?? '',
      harga: String(menu.harga),
      stok: String(menu.stok),
    })

    setMessage('')
    setError('')
    setMenuModalOpen(true)
  }

  function closeMenuModal() {
    setMenuModalOpen(false)
    setEditingMenu(null)
    setMenuForm(emptyMenuForm)
  }

  async function submitMenu(
    event: FormEvent
  ) {
    event.preventDefault()

    try {
      setError('')
      setMessage('')

      const url = editingMenu
        ? `/api/menus/${editingMenu.idMenu}`
        : '/api/menus'

      const method =
        editingMenu ? 'PUT' : 'POST'

      const response = await apiFetch(
        url,
        {
          method,

          body: JSON.stringify({
            namaMenu:
              menuForm.namaMenu,

            idKategori:
              menuForm.idKategori,

            deskripsi:
              menuForm.deskripsi ||
              undefined,

            harga:
              Number(menuForm.harga),

            stok:
              Number(menuForm.stok),
          }),
        }
      )

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null)

        throw new Error(
          data?.message ??
            `Gagal ${
              editingMenu
                ? 'mengubah'
                : 'menambah'
            } menu.`
        )
      }

      closeMenuModal()

      setMessage(
        editingMenu
          ? 'Menu berhasil diperbarui.'
          : 'Menu berhasil ditambahkan.'
      )

      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menyimpan menu.'
      )
    }
  }

  async function deleteMenu(
    menu: Menu
  ) {
    const confirmed =
      window.confirm(
        `Hapus menu "${menu.namaMenu}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')

      const response =
        await apiFetch(
          `/api/menus/${menu.idMenu}`,
          {
            method: 'DELETE',
          }
        )

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null)

        throw new Error(
          data?.message ??
            'Gagal menghapus menu.'
        )
      }

      setMessage(
        'Menu berhasil dihapus.'
      )

      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menghapus menu.'
      )
    }
  }

  async function submitKategori(
    event: FormEvent
  ) {
    event.preventDefault()

    try {
      setError('')
      setMessage('')

      const response =
        await apiFetch(
          '/api/kategoris',
          {
            method: 'POST',

            body: JSON.stringify({
              namaKategori:
                kategoriForm.namaKategori,
            }),
          }
        )

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null)

        throw new Error(
          data?.message ??
            'Gagal menambahkan kategori.'
        )
      }

      setKategoriForm({
        namaKategori: '',
      })

      setMessage(
        'Kategori berhasil ditambahkan.'
      )

      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menyimpan kategori.'
      )
    }
  }

  async function deleteKategori(
    kategori: Kategori
  ) {
    const confirmed =
      window.confirm(
        `Hapus kategori "${kategori.namaKategori}"?`
      )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setMessage('')

      const response =
        await apiFetch(
          `/api/kategoris/${kategori.idKategori}`,
          {
            method: 'DELETE',
          }
        )

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => null)

        throw new Error(
          data?.message ??
            'Gagal menghapus kategori.'
        )
      }

      setMessage(
        'Kategori berhasil dihapus.'
      )

      await loadData()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat menghapus kategori.'
      )
    }
  }

  return (
    <>
      {message && (
        <div
          style={{
            padding: '12px 15px',
            marginBottom: 18,
            border:
              '1px solid #B7DEC5',
            background: '#EFFAF3',
            borderRadius: 5,
            color: '#22613A',
            fontSize: 13,
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '12px 15px',
            marginBottom: 18,
            border:
              '1px solid #F0B8B4',
            background: '#FFF1F0',
            borderRadius: 5,
            color: colors.danger,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          gap: 16,
          marginBottom: 18,
        }}
      >
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Cari nama menu..."
          style={{
            width: 310,
            height: 42,
            padding: '0 13px',
            border:
              `1px solid ${colors.border}`,
            borderRadius: 5,
            outline: 'none',
            fontSize: 14,
            boxSizing: 'border-box',
          }}
        />

        <div
          style={{
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={() =>
              setKategoriModalOpen(
                true
              )
            }
            style={{
              height: 42,
              padding: '0 18px',
              border:
                `1px solid ${colors.border}`,
              borderRadius: 5,
              background:
                colors.white,
              color: colors.text,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Kelola Kategori
          </button>

          <button
            type="button"
            onClick={openCreateMenu}
            style={{
              height: 42,
              padding: '0 18px',
              border: 'none',
              borderRadius: 5,
              background:
                colors.primary,
              color: colors.white,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            + Tambah Menu
          </button>
        </div>
      </div>

      <section
        style={{
          background:
            colors.white,

          border:
            `1px solid ${colors.border}`,

          borderRadius: 7,

          overflow: 'hidden',
        }}
      >
        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth: 750,
              borderCollapse:
                'collapse',
              fontSize: 14,
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    colors.tableHeader,

                  textAlign: 'left',
                }}
              >
                {[
                  'Menu',
                  'Kategori',
                  'Harga',
                  'Stok',
                  'Aksi',
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding:
                        '15px 17px',

                      borderBottom:
                        `1px solid ${colors.border}`,
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 45,

                      textAlign:
                        'center',

                      color:
                        colors.muted,
                    }}
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredMenus.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: 45,

                      textAlign:
                        'center',

                      color:
                        colors.muted,
                    }}
                  >
                    Belum ada data
                    menu.
                  </td>
                </tr>
              ) : (
                filteredMenus.map(
                  (menu) => {
                    const kategori =
                      kategoris.find(
                        (item) =>
                          item.idKategori ===
                          menu.idKategori
                      )

                    return (
                      <tr
                        key={
                          menu.idMenu
                        }
                      >
                        <td
                          style={
                            cellStyle
                          }
                        >
                          <strong>
                            {
                              menu.namaMenu
                            }
                          </strong>
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {kategori?.namaKategori ??
                            '-'}
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {formatRupiah(
                            Number(
                              menu.harga
                            )
                          )}
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          {menu.stok}
                        </td>

                        <td
                          style={
                            cellStyle
                          }
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              gap: 8,
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openEditMenu(
                                  menu
                                )
                              }
                              style={
                                smallButtonStyle
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                deleteMenu(
                                  menu
                                )
                              }
                              style={{
                                ...smallButtonStyle,

                                color:
                                  colors.danger,
                              }}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {menuModalOpen && (
        <Modal
          title={
            editingMenu
              ? 'Edit Menu'
              : 'Tambah Menu'
          }
          onClose={
            closeMenuModal
          }
        >
          <form
            onSubmit={
              submitMenu
            }
            style={{
              display: 'grid',
              gap: 16,
            }}
          >
            <Field label="Nama Menu">
              <input
                required
                type="text"
                value={
                  menuForm.namaMenu
                }
                onChange={(event) =>
                  setMenuForm({
                    ...menuForm,

                    namaMenu:
                      event.target
                        .value,
                  })
                }
                placeholder="Masukkan nama menu"
                style={
                  formInputStyle
                }
              />
            </Field>

            <Field label="Kategori">
              <select
                required
                value={
                  menuForm.idKategori
                }
                onChange={(event) =>
                  setMenuForm({
                    ...menuForm,

                    idKategori:
                      event.target
                        .value,
                  })
                }
                style={
                  formInputStyle
                }
              >
                <option value="">
                  Pilih kategori
                </option>

                {kategoris.map(
                  (kategori) => (
                    <option
                      key={
                        kategori.idKategori
                      }
                      value={
                        kategori.idKategori
                      }
                    >
                      {
                        kategori.namaKategori
                      }
                    </option>
                  )
                )}
              </select>
            </Field>

            <div
              style={{
                display: 'grid',

                gridTemplateColumns:
                  '1fr 1fr',

                gap: 14,
              }}
            >
              <Field label="Harga">
                <input
                  required
                  type="number"
                  min="0"
                  value={
                    menuForm.harga
                  }
                  onChange={(
                    event
                  ) =>
                    setMenuForm({
                      ...menuForm,

                      harga:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Contoh: 20000"
                  style={
                    formInputStyle
                  }
                />
              </Field>

              <Field label="Stok">
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={
                    menuForm.stok
                  }
                  onChange={(
                    event
                  ) =>
                    setMenuForm({
                      ...menuForm,

                      stok:
                        event.target
                          .value,
                    })
                  }
                  placeholder="Contoh: 20"
                  style={
                    formInputStyle
                  }
                />
              </Field>
            </div>

            <Field label="Deskripsi">
              <textarea
                value={
                  menuForm.deskripsi
                }
                onChange={(event) =>
                  setMenuForm({
                    ...menuForm,

                    deskripsi:
                      event.target
                        .value,
                  })
                }
                placeholder="Masukkan deskripsi menu"
                rows={3}
                style={{
                  ...formInputStyle,

                  height: 85,

                  padding:
                    '11px 12px',

                  resize:
                    'vertical',

                  fontFamily:
                    'inherit',
                }}
              />
            </Field>

            <div
              style={{
                display: 'flex',

                justifyContent:
                  'flex-end',

                gap: 10,

                paddingTop: 4,
              }}
            >
              <button
                type="button"
                onClick={
                  closeMenuModal
                }
                style={
                  secondaryModalButton
                }
              >
                Batal
              </button>

              <button
                type="submit"
                style={
                  primaryModalButton
                }
              >
                {editingMenu
                  ? 'Simpan Perubahan'
                  : 'Tambah Menu'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {kategoriModalOpen && (
        <Modal
          title="Kelola Kategori"
          onClose={() =>
            setKategoriModalOpen(
              false
            )
          }
        >
          <div
            style={{
              display: 'flex',

              flexDirection:
                'column',

              gap: 20,
            }}
          >
            <form
              onSubmit={
                submitKategori
              }
              style={{
                display: 'grid',

                gridTemplateColumns:
                  'minmax(0, 1fr) 110px',

                gap: 10,

                width: '100%',

                alignItems:
                  'center',
              }}
            >
              <input
                required
                type="text"
                value={
                  kategoriForm.namaKategori
                }
                onChange={(event) =>
                  setKategoriForm({
                    namaKategori:
                      event.target
                        .value,
                  })
                }
                placeholder="Nama kategori"
                style={{
                  width: '100%',
                  minWidth: 0,
                  height: 42,

                  padding:
                    '0 12px',

                  border:
                    '1px solid #D9DCDA',

                  borderRadius: 6,

                  background:
                    colors.white,

                  color:
                    colors.text,

                  fontSize: 14,

                  outline: 'none',

                  boxSizing:
                    'border-box',
                }}
              />

              <button
                type="submit"
                style={{
                  width: 110,
                  minWidth: 110,
                  maxWidth: 110,

                  height: 42,
                  minHeight: 42,
                  maxHeight: 42,

                  padding: 0,
                  margin: 0,

                  border: 'none',

                  borderRadius: 6,

                  background:
                    colors.primary,

                  color:
                    colors.white,

                  fontSize: 13,

                  fontWeight: 700,

                  cursor:
                    'pointer',

                  display:
                    'inline-flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'center',

                  boxSizing:
                    'border-box',

                  flex: 'none',

                  justifySelf:
                    'end',
                }}
              >
                + Tambah
              </button>
            </form>

            <div>
              <div
                style={{
                  marginBottom: 10,

                  color:
                    colors.muted,

                  fontSize: 13,

                  fontWeight: 700,
                }}
              >
                Daftar Kategori
              </div>

              <div
                style={{
                  width: '100%',

                  border:
                    `1px solid ${colors.border}`,

                  borderRadius: 7,

                  overflow:
                    'hidden',

                  background:
                    colors.white,

                  boxSizing:
                    'border-box',
                }}
              >
                {kategoris.length ===
                0 ? (
                  <div
                    style={{
                      padding:
                        '30px 20px',

                      textAlign:
                        'center',

                      color:
                        colors.muted,

                      fontSize: 14,
                    }}
                  >
                    Belum ada
                    kategori.
                  </div>
                ) : (
                  kategoris.map(
                    (
                      kategori,
                      index
                    ) => (
                      <div
                        key={
                          kategori.idKategori
                        }
                        style={{
                          width:
                            '100%',

                          minHeight: 58,

                          padding:
                            '0 14px',

                          display:
                            'grid',

                          gridTemplateColumns:
                            'minmax(0, 1fr) 76px',

                          alignItems:
                            'center',

                          gap: 16,

                          borderBottom:
                            index <
                            kategoris.length -
                              1
                              ? `1px solid ${colors.border}`
                              : 'none',

                          boxSizing:
                            'border-box',
                        }}
                      >
                        <span
                          style={{
                            display:
                              'block',

                            minWidth: 0,

                            color:
                              colors.text,

                            fontSize: 14,

                            fontWeight: 600,

                            lineHeight: 1.4,

                            overflow:
                              'hidden',

                            textOverflow:
                              'ellipsis',

                            whiteSpace:
                              'nowrap',
                          }}
                        >
                          {
                            kategori.namaKategori
                          }
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            deleteKategori(
                              kategori
                            )
                          }
                          style={{
                            width: 76,
                            minWidth: 76,
                            maxWidth: 76,

                            height: 34,
                            minHeight: 34,
                            maxHeight: 34,

                            padding: 0,
                            margin: 0,

                            border:
                              '1px solid #E8C8C5',

                            borderRadius: 5,

                            background:
                              colors.white,

                            color:
                              colors.danger,

                            fontSize: 12,

                            fontWeight: 700,

                            lineHeight: 1,

                            cursor:
                              'pointer',

                            display:
                              'inline-flex',

                            alignItems:
                              'center',

                            justifyContent:
                              'center',

                            boxSizing:
                              'border-box',

                            flex: 'none',

                            justifySelf:
                              'end',
                          }}
                        >
                          Hapus
                        </button>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,

        background:
          'rgba(20, 24, 25, 0.45)',

        display: 'flex',

        alignItems:
          'center',

        justifyContent:
          'center',

        padding: 24,

        boxSizing:
          'border-box',
      }}
    >
      <div
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        style={{
          width: 520,

          maxWidth: '100%',

          maxHeight:
            'calc(100vh - 48px)',

          background:
            '#FFFFFF',

          borderRadius: 10,

          boxShadow:
            '0 20px 55px rgba(0,0,0,0.20)',

          display: 'flex',

          flexDirection:
            'column',

          overflow:
            'hidden',
        }}
      >
        <div
          style={{
            width: '100%',

            height: 62,
            minHeight: 62,

            padding:
              '0 18px 0 20px',

            display: 'flex',

            flexDirection:
              'row',

            alignItems:
              'center',

            justifyContent:
              'space-between',

            borderBottom:
              '1px solid #E0E2DF',

            boxSizing:
              'border-box',

            flexShrink: 0,
          }}
        >
          <strong
            style={{
              color:
                '#202426',

              fontSize: 17,

              fontWeight: 700,

              lineHeight: 1,
            }}
          >
            {title}
          </strong>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            style={{
              width: 34,
              minWidth: 34,
              maxWidth: 34,

              height: 34,
              minHeight: 34,
              maxHeight: 34,

              padding: 0,
              margin: 0,

              border:
                '1px solid #DADDDC',

              borderRadius: 6,

              background:
                '#FFFFFF',

              color:
                '#3C4143',

              fontSize: 21,

              fontWeight: 400,

              lineHeight: 1,

              cursor:
                'pointer',

              display:
                'inline-flex',

              alignItems:
                'center',

              justifyContent:
                'center',

              flex: 'none',

              boxSizing:
                'border-box',
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            width: '100%',

            padding: 20,

            overflowY:
              'auto',

            boxSizing:
              'border-box',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label
      style={{
        display: 'grid',

        gap: 7,

        fontSize: 13,

        fontWeight: 700,

        color: '#202426',
      }}
    >
      {label}

      {children}
    </label>
  )
}

const cellStyle = {
  padding: '15px 17px',

  borderBottom:
    '1px solid #E0E2DF',

  color: '#202426',
}

const smallButtonStyle = {
  minHeight: 32,

  padding: '0 10px',

  border:
    '1px solid #E0E2DF',

  borderRadius: 4,

  background:
    '#FFFFFF',

  color:
    '#202426',

  fontSize: 12,

  fontWeight: 700,

  cursor:
    'pointer',
}

const formInputStyle = {
  width: '100%',

  height: 42,

  padding:
    '0 12px',

  border:
    '1px solid #D9DCDA',

  borderRadius: 5,

  background:
    '#FFFFFF',

  color:
    '#202426',

  outline:
    'none',

  fontSize: 14,

  fontFamily:
    'inherit',

  boxSizing:
    'border-box' as const,
}

const primaryModalButton = {
  height: 40,

  padding:
    '0 17px',

  border:
    'none',

  borderRadius: 5,

  background:
    '#513934',

  color:
    '#FFFFFF',

  fontSize: 13,

  fontWeight: 700,

  cursor:
    'pointer',

  whiteSpace:
    'nowrap' as const,

  boxSizing:
    'border-box' as const,
}

const secondaryModalButton = {
  height: 40,

  padding:
    '0 17px',

  border:
    '1px solid #D9DCDA',

  borderRadius: 5,

  background:
    '#FFFFFF',

  color:
    '#202426',

  fontSize: 13,

  fontWeight: 700,

  cursor:
    'pointer',

  whiteSpace:
    'nowrap' as const,

  boxSizing:
    'border-box' as const,
}