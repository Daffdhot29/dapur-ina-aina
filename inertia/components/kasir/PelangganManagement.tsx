import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { apiFetch } from '~/lib/api'

type Pelanggan = {
  idPelanggan: string
  nama: string
  email: string | null
  nomorHp: string | null
  alamat: string | null
}

type PelangganForm = {
  nama: string
  email: string
  nomorHp: string
  alamat: string
}

const emptyForm: PelangganForm = {
  nama: '',
  email: '',
  nomorHp: '',
  alamat: '',
}

const colors = {
  primary: '#513934',
  text: '#202426',
  muted: '#686E70',
  white: '#FFFFFF',
  border: '#E0E2DF',
  tableHeader: '#F7F7F5',
}

export default function PelangganManagement() {
  const [pelanggans, setPelanggans] = useState<Pelanggan[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Pelanggan | null>(null)

  const [form, setForm] =
    useState<PelangganForm>(emptyForm)

  useEffect(() => {
    loadPelanggans()
  }, [])

  async function loadPelanggans() {
    try {
      setLoading(true)
      setError('')

      const response = await apiFetch('/api/pelanggans')

      if (!response.ok) {
        throw new Error('Gagal mengambil data pelanggan.')
      }

      const result = await response.json()

      const source = result.data ?? result

      setPelanggans(
        Array.isArray(source)
          ? source
          : []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan.'
      )
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEdit(pelanggan: Pelanggan) {
    setEditing(pelanggan)

    setForm({
      nama: pelanggan.nama,
      email: pelanggan.email ?? '',
      nomorHp: pelanggan.nomorHp ?? '',
      alamat: pelanggan.alamat ?? '',
    })

    setError('')
    setModalOpen(true)
  }

  function closeModal() {
    if (saving) {
      return
    }

    setModalOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  async function submitPelanggan(
    event: FormEvent
  ) {
    event.preventDefault()

    if (!form.nama.trim()) {
      setError('Nama pelanggan wajib diisi.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const url = editing
        ? `/api/pelanggans/${editing.idPelanggan}`
        : '/api/pelanggans'

      const method = editing
        ? 'PUT'
        : 'POST'

      const response = await apiFetch(
        url,
        {
          method,

          body: JSON.stringify({
            nama: form.nama.trim(),

            email:
              form.email.trim() ||
              null,

            nomorHp:
              form.nomorHp.trim() ||
              null,

            alamat:
              form.alamat.trim() ||
              null,
          }),
        }
      )

      if (!response.ok) {
        const result = await response
          .json()
          .catch(() => null)

        throw new Error(
          result?.message ??
            'Gagal menyimpan pelanggan.'
        )
      }

      setModalOpen(false)
      setEditing(null)
      setForm(emptyForm)

      await loadPelanggans()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan pelanggan.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deletePelanggan(
    pelanggan: Pelanggan
  ) {
    const confirmed = window.confirm(
      `Hapus pelanggan "${pelanggan.nama}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      const response = await apiFetch(
        `/api/pelanggans/${pelanggan.idPelanggan}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        const result = await response
          .json()
          .catch(() => null)

        throw new Error(
          result?.message ??
            'Gagal menghapus pelanggan.'
        )
      }

      await loadPelanggans()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal menghapus pelanggan.'
      )
    }
  }

  const filteredPelanggans =
    useMemo(() => {
      const keyword = search
        .trim()
        .toLowerCase()

      if (!keyword) {
        return pelanggans
      }

      return pelanggans.filter(
        (pelanggan) => {
          return (
            pelanggan.nama
              .toLowerCase()
              .includes(keyword) ||

            pelanggan.email
              ?.toLowerCase()
              .includes(keyword) ||

            pelanggan.nomorHp
              ?.toLowerCase()
              .includes(keyword)
          )
        }
      )
    }, [pelanggans, search])

  return (
    <>
      <section
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: 7,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            minHeight: 70,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            borderBottom: `1px solid ${colors.border}`,
            boxSizing: 'border-box',
          }}
        >
          <div>
            <div
              style={{
                color: colors.text,
                fontSize: 15,
                fontWeight: 800,
                marginBottom: 4,
              }}
            >
              Data Pelanggan
            </div>

            <div
              style={{
                color: colors.muted,
                fontSize: 12,
              }}
            >
              Kelola data pelanggan restoran.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <input
              type="search"
              placeholder="Cari pelanggan..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{
                width: 220,
                height: 40,
                padding: '0 12px',
                border: `1px solid ${colors.border}`,
                borderRadius: 5,
                outline: 'none',
                fontSize: 13,
                boxSizing: 'border-box',
              }}
            />

            <button
              type="button"
              onClick={openCreate}
              style={primaryButtonStyle}
            >
              + Tambah Pelanggan
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              margin: 20,
              padding: '12px 15px',
              background: '#FFF1F0',
              border: '1px solid #F0B8B4',
              borderRadius: 5,
              color: '#B42318',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              minWidth: 800,
              borderCollapse: 'collapse',
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  background: colors.tableHeader,
                  textAlign: 'left',
                }}
              >
                <th style={tableHeaderStyle}>
                  Nama
                </th>

                <th style={tableHeaderStyle}>
                  Email
                </th>

                <th style={tableHeaderStyle}>
                  Nomor HP
                </th>

                <th style={tableHeaderStyle}>
                  Alamat
                </th>

                <th
                  style={{
                    ...tableHeaderStyle,
                    width: 150,
                  }}
                >
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={emptyStyle}
                  >
                    Memuat data pelanggan...
                  </td>
                </tr>
              ) : filteredPelanggans.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={emptyStyle}
                  >
                    Tidak ada data pelanggan.
                  </td>
                </tr>
              ) : (
                filteredPelanggans.map(
                  (pelanggan) => (
                    <tr
                      key={
                        pelanggan.idPelanggan
                      }
                    >
                      <td
                        style={tableCellStyle}
                      >
                        <strong>
                          {pelanggan.nama}
                        </strong>
                      </td>

                      <td
                        style={tableCellStyle}
                      >
                        {pelanggan.email ?? '-'}
                      </td>

                      <td
                        style={tableCellStyle}
                      >
                        {pelanggan.nomorHp ?? '-'}
                      </td>

                      <td
                        style={tableCellStyle}
                      >
                        {pelanggan.alamat ?? '-'}
                      </td>

                      <td
                        style={tableCellStyle}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: 8,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openEdit(
                                pelanggan
                              )
                            }
                            style={
                              actionButtonStyle
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deletePelanggan(
                                pelanggan
                              )
                            }
                            style={{
                              ...actionButtonStyle,
                              color: '#B42318',
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div
          onMouseDown={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 1000,
          }}
        >
          <div
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            style={{
              width: '100%',
              maxWidth: 500,
              background: colors.white,
              borderRadius: 8,
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.18)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '18px 20px',
                borderBottom:
                  `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',
              }}
            >
              <strong
                style={{
                  color: colors.text,
                  fontSize: 16,
                }}
              >
                {editing
                  ? 'Edit Pelanggan'
                  : 'Tambah Pelanggan'}
              </strong>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  width: 32,
                  height: 32,
                  border: 'none',
                  background:
                    'transparent',
                  cursor: 'pointer',
                  fontSize: 20,
                  color: colors.muted,
                }}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={submitPelanggan}
            >
              <div
                style={{
                  padding: 20,
                  display: 'grid',
                  gap: 16,
                }}
              >
                <Field label="Nama Pelanggan *">
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        nama:
                          event.target
                            .value,
                      })
                    }
                    placeholder="Nama pelanggan"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email:
                          event.target
                            .value,
                      })
                    }
                    placeholder="email@example.com"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Nomor HP">
                  <input
                    type="text"
                    value={form.nomorHp}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        nomorHp:
                          event.target
                            .value,
                      })
                    }
                    placeholder="08xxxxxxxxxx"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Alamat">
                  <textarea
                    value={form.alamat}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        alamat:
                          event.target
                            .value,
                      })
                    }
                    placeholder="Alamat pelanggan"
                    rows={4}
                    style={{
                      ...inputStyle,
                      height: 95,
                      padding:
                        '10px 12px',
                      resize: 'vertical',
                      fontFamily:
                        'inherit',
                    }}
                  />
                </Field>
              </div>

              <div
                style={{
                  padding: '15px 20px',
                  borderTop:
                    `1px solid ${colors.border}`,
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeModal}
                  style={
                    secondaryButtonStyle
                  }
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={
                    primaryButtonStyle
                  }
                >
                  {saving
                    ? 'Menyimpan...'
                    : editing
                      ? 'Simpan Perubahan'
                      : 'Tambah Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
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
        color: '#202426',
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {label}

      {children}
    </label>
  )
}

const tableHeaderStyle = {
  padding: '14px 16px',
  borderBottom:
    '1px solid #E0E2DF',
  color: '#686E70',
  fontSize: 12,
  fontWeight: 700,
}

const tableCellStyle = {
  padding: '14px 16px',
  borderBottom:
    '1px solid #E0E2DF',
  color: '#202426',
  verticalAlign:
    'middle' as const,
}

const emptyStyle = {
  padding: 40,
  textAlign:
    'center' as const,
  color: '#686E70',
}

const inputStyle = {
  width: '100%',
  height: 42,
  padding: '0 12px',
  border:
    '1px solid #D9DCDA',
  borderRadius: 5,
  background: '#FFFFFF',
  color: '#202426',
  outline: 'none',
  fontSize: 14,
  boxSizing:
    'border-box' as const,
}

const primaryButtonStyle = {
  minHeight: 40,
  padding: '0 16px',
  border: 'none',
  borderRadius: 5,
  background: '#513934',
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  whiteSpace:
    'nowrap' as const,
}

const secondaryButtonStyle = {
  minHeight: 40,
  padding: '0 16px',
  border:
    '1px solid #D9DCDA',
  borderRadius: 5,
  background: '#FFFFFF',
  color: '#202426',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}

const actionButtonStyle = {
  minHeight: 32,
  padding: '0 10px',
  border:
    '1px solid #E0E2DF',
  borderRadius: 4,
  background: '#FFFFFF',
  color: '#202426',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
}