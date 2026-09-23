import { useEffect, useState } from 'react'

type Menu = {
  idMenu: string
  namaMenu: string
  harga: number
  stok: number
  idKategori: string
}

type Kategori = {
  idKategori: string
  namaKategori: string
}

type DashboardData = {
  totalMenu: number
  totalKategori: number
  menuTersedia: number
  stokHabis: number
}

const colors = {
  text: '#202426',
  muted: '#686E70',
  white: '#FFFFFF',
  border: '#E0E2DF',
  danger: '#C43C32',
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalMenu: 0,
    totalKategori: 0,
    menuTersedia: 0,
    stokHabis: 0,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      setError('')

      const [menuResponse, kategoriResponse] =
        await Promise.all([
          fetch('/api/menus', {
            headers: {
              Accept: 'application/json',
            },
          }),

          fetch('/api/kategoris', {
            headers: {
              Accept: 'application/json',
            },
          }),
        ])

      if (!menuResponse.ok) {
        throw new Error('Gagal mengambil data menu.')
      }

      if (!kategoriResponse.ok) {
        throw new Error('Gagal mengambil data kategori.')
      }

      const menuResult = await menuResponse.json()
      const kategoriResult = await kategoriResponse.json()

      const menus: Menu[] = Array.isArray(menuResult)
        ? menuResult
        : menuResult.data ?? []

      const kategoris: Kategori[] = Array.isArray(
        kategoriResult
      )
        ? kategoriResult
        : kategoriResult.data ?? []

      setData({
        totalMenu: menus.length,
        totalKategori: kategoris.length,

        menuTersedia: menus.filter(
          (menu) => Number(menu.stok) > 0
        ).length,

        stokHabis: menus.filter(
          (menu) => Number(menu.stok) <= 0
        ).length,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data dashboard.'
      )
    } finally {
      setLoading(false)
    }
  }

  function MetricCard({
    label,
    value,
    description,
  }: {
    label: string
    value: string
    description: string
  }) {
    return (
      <div
        style={{
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: 7,
          padding: '20px 22px',
          minHeight: 120,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: colors.muted,
            marginBottom: 15,
          }}
        >
          {label}
        </div>

        <div
          style={{
            fontSize: 27,
            fontWeight: 800,
            lineHeight: 1,
            color: colors.text,
            marginBottom: 13,
          }}
        >
          {value}
        </div>

        <div
          style={{
            fontSize: 12,
            color: colors.muted,
          }}
        >
          {description}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          padding: 15,
          background: '#FFF1F0',
          border: '1px solid #F0B8B4',
          borderRadius: 6,
          color: '#B42318',
          fontSize: 14,
        }}
      >
        {error}
      </div>
    )
  }

  const display = (value: number) =>
    loading ? '—' : String(value)

  return (
    <>
      {/* METRIC */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(3, minmax(0, 1fr))',
          gap: 16,
          marginBottom: 20,
        }}
      >
        <MetricCard
          label="Total Menu"
          value={display(data.totalMenu)}
          description="Jumlah menu"
        />

        <MetricCard
          label="Total Kategori"
          value={display(data.totalKategori)}
          description="Kategori menu"
        />

        <MetricCard
          label="Pendapatan"
          value="—"
          description="Berdasarkan transaksi"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(0, 1.7fr) minmax(280px, 0.8fr)',
          gap: 18,
        }}
      >
        {/* PENJUALAN */}
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
              height: 60,
              padding: '0 20px',
              borderBottom:
                `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
            }}
          >
            <strong
              style={{
                fontSize: 15,
                color: colors.text,
              }}
            >
              Ringkasan Penjualan
            </strong>

            <select
              defaultValue="7"
              style={{
                height: 36,
                padding: '0 10px',
                border:
                  `1px solid ${colors.border}`,
                borderRadius: 5,
                background: colors.white,
                color: colors.text,
                fontSize: 12,
                outline: 'none',
              }}
            >
              <option value="7">
                7 Hari Terakhir
              </option>

              <option value="30">
                30 Hari Terakhir
              </option>
            </select>
          </div>

          <div
            style={{
              minHeight: 280,
              display: 'grid',
              placeItems: 'center',
              padding: 20,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                color: colors.muted,
                fontSize: 14,
              }}
            >
              Data penjualan akan dihubungkan melalui
              laporan penjualan.
            </span>
          </div>
        </section>

        {/* INFORMASI MENU */}
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
              height: 60,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              borderBottom:
                `1px solid ${colors.border}`,
              boxSizing: 'border-box',
            }}
          >
            <strong
              style={{
                fontSize: 15,
                color: colors.text,
              }}
            >
              Informasi Menu
            </strong>
          </div>

          <div
            style={{
              padding: '18px 20px',
            }}
          >
            <InfoRow
              label="Menu tersedia"
              value={display(data.menuTersedia)}
            />

            <InfoRow
              label="Kategori"
              value={display(data.totalKategori)}
            />

            <div
              style={{
                height: 55,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  color: colors.muted,
                  fontSize: 14,
                }}
              >
                Stok habis
              </span>

              <strong
                style={{
                  color: colors.danger,
                }}
              >
                {display(data.stokHabis)}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </>
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
      style={{
        height: 55,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #E0E2DF',
      }}
    >
      <span
        style={{
          color: '#686E70',
          fontSize: 14,
        }}
      >
        {label}
      </span>

      <strong>{value}</strong>
    </div>
  )
}