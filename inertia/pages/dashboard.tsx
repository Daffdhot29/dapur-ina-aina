
import { useState } from 'react'

type Page =
  | 'dashboard'
  | 'menu'
  | 'pelanggan'
  | 'pesanan'
  | 'pembayaran'
  | 'billing'
  | 'laporan'

const navigation: { id: Page; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'menu', label: 'Menu & Kategori' },
  { id: 'pelanggan', label: 'Pelanggan' },
  { id: 'pesanan', label: 'Pesanan' },
  { id: 'pembayaran', label: 'Pembayaran' },
  { id: 'billing', label: 'Billing' },
  { id: 'laporan', label: 'Laporan Penjualan' },
]

const colors = {
  orange: '#F4511E',
  orangeDark: '#C63D13',
  text: '#222222',
  muted: '#595959',
  background: '#F7F7F5',
  border: '#E3E3DF',
}

export default function DashboardPage() {
  const [activePage, setActivePage] = useState<Page>('dashboard')
  const [notice, setNotice] = useState('')

  function navigate(page: Page) {
    setActivePage(page)
    setNotice('')
  }

  function handleAction(action: string) {
    setNotice(
      `${action}: fungsi ini akan aktif setelah frontend dihubungkan ke API backend.`
    )
  }

  const titles: Record<Page, string> = {
    dashboard: 'Dashboard',
    menu: 'Menu & Kategori',
    pelanggan: 'Pelanggan',
    pesanan: 'Pesanan',
    pembayaran: 'Pembayaran',
    billing: 'Billing',
    laporan: 'Laporan Penjualan',
  }

  const descriptions: Record<Page, string> = {
    dashboard: 'Ringkasan aktivitas operasional restoran.',
    menu: 'Kelola daftar makanan, kategori, harga, dan stok.',
    pelanggan: 'Kelola data pelanggan restoran.',
    pesanan: 'Catat dan pantau pesanan pelanggan.',
    pembayaran: 'Catat pembayaran dari pesanan pelanggan.',
    billing: 'Lihat dan buat bukti tagihan.',
    laporan: 'Lihat rekap penjualan berdasarkan periode.',
  }

  const actions: Partial<Record<Page, string>> = {
    menu: 'Tambah Menu',
    pelanggan: 'Tambah Pelanggan',
    pesanan: 'Buat Pesanan',
    pembayaran: 'Catat Pembayaran',
    billing: 'Buat Billing',
  }

  const sidebarButton = (page: Page, label: string) => {
    const active = activePage === page

    return (
      <button
        key={page}
        type="button"
        onClick={() => navigate(page)}
        style={{
          width: '100%',
          display: 'block',
          padding: '13px 15px',
          border: 'none',
          borderRadius: 6,
          textAlign: 'left',
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 15,
          fontWeight: active ? 800 : 600,
          color: active ? '#FFFFFF' : '#222222',
          background: active ? colors.orange : 'transparent',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </button>
    )
  }

  const primaryButton = (label: string) => (
    <button
      type="button"
      onClick={() => handleAction(label)}
      style={{
        background: colors.orange,
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 6,
        padding: '12px 17px',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      + {label}
    </button>
  )

  const emptyState = (name: string) => (
    <div
      style={{
        background: '#FFFFFF',
        border: `1px solid ${colors.border}`,
        borderRadius: 7,
        padding: '55px 20px',
        textAlign: 'center',
      }}
    >
      <h3
        style={{
          margin: '0 0 10px',
          fontSize: 17,
          fontWeight: 800,
          color: colors.text,
        }}
      >
        Belum ada data {name}
      </h3>

      <p
        style={{
          fontSize: 14,
          lineHeight: 1.6,
          color: colors.muted,
          margin: 0,
        }}
      >
        Data akan ditampilkan setelah halaman terhubung ke database.
      </p>
    </div>
  )

  const metricCard = (label: string, target: Page) => (
    <button
      key={label}
      type="button"
      onClick={() => navigate(target)}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${colors.border}`,
        borderRadius: 7,
        padding: 21,
        textAlign: 'left',
        cursor: 'pointer',
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: colors.muted,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: colors.text,
          margin: '15px 0 12px',
        }}
      >
        —
      </div>

      <div
        style={{
          color: colors.orangeDark,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        Lihat detail →
      </div>
    </button>
  )

  function renderContent() {
    switch (activePage) {
      case 'dashboard':
        return (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(100%, 190px), 1fr))',
                gap: 14,
                marginBottom: 24,
              }}
            >
              {metricCard('Total Menu', 'menu')}
              {metricCard('Total Pelanggan', 'pelanggan')}
              {metricCard('Total Pesanan', 'pesanan')}
              {metricCard('Pendapatan', 'laporan')}
            </div>

            <section
              style={{
                background: '#FFFFFF',
                border: `1px solid ${colors.border}`,
                borderRadius: 7,
              }}
            >
              <div
                style={{
                  padding: 20,
                  borderBottom: `1px solid ${colors.border}`,
                  fontSize: 16,
                  fontWeight: 800,
                  color: colors.text,
                }}
              >
                Pesanan Terbaru
              </div>

              <div
                style={{
                  padding: '45px 20px',
                  textAlign: 'center',
                  fontSize: 14,
                  color: colors.muted,
                }}
              >
                Belum ada data pesanan yang dimuat.
              </div>
            </section>
          </>
        )

      case 'menu':
        return (
          <>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginBottom: 18,
              }}
            >
              <input
                type="search"
                placeholder="Cari nama menu..."
                aria-label="Cari menu"
                style={{
                  flex: 1,
                  minWidth: 180,
                  padding: 12,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  fontSize: 14,
                  color: colors.text,
                  background: '#FFFFFF',
                }}
              />

              <button
                type="button"
                onClick={() => handleAction('Kelola Kategori')}
                style={{
                  background: '#FFFFFF',
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  padding: '10px 15px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Kelola Kategori
              </button>
            </div>

            <div
              style={{
                overflowX: 'auto',
                background: '#FFFFFF',
                border: `1px solid ${colors.border}`,
                borderRadius: 7,
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 14,
                  textAlign: 'left',
                  color: colors.text,
                }}
              >
                <thead>
                  <tr style={{ background: '#F8F8F6' }}>
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
                          padding: 17,
                          borderBottom: `1px solid ${colors.border}`,
                          fontWeight: 800,
                          color: colors.text,
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: 45,
                        textAlign: 'center',
                        color: colors.muted,
                      }}
                    >
                      Data menu akan diambil dari database.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )

      case 'pelanggan':
        return emptyState('pelanggan')

      case 'pesanan':
        return emptyState('pesanan')

      case 'pembayaran':
        return emptyState('pembayaran')

      case 'billing':
        return emptyState('billing')

      case 'laporan':
        return (
          <>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 15,
                alignItems: 'end',
                padding: 20,
                background: '#FFFFFF',
                border: `1px solid ${colors.border}`,
                borderRadius: 7,
                marginBottom: 20,
              }}
            >
              {[
                ['Tanggal Mulai', 'start'],
                ['Tanggal Selesai', 'end'],
              ].map(([label, id]) => (
                <label
                  key={id}
                  style={{
                    display: 'grid',
                    flex: 1,
                    minWidth: 160,
                    gap: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.text,
                  }}
                >
                  {label}

                  <input
                    type="date"
                    style={{
                      padding: 11,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 6,
                      fontSize: 14,
                      color: colors.text,
                      background: '#FFFFFF',
                    }}
                  />
                </label>
              ))}

              <button
                type="button"
                onClick={() => handleAction('Tampilkan Laporan')}
                style={{
                  padding: '12px 17px',
                  background: colors.orange,
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Tampilkan
              </button>
            </div>

            {emptyState('laporan')}
          </>
        )
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: colors.background,
        color: colors.text,
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          minHeight: 72,
          background: '#FFFFFF',
          borderBottom: `1px solid ${colors.border}`,
          padding: '15px 25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 15,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 39,
              height: 39,
              background: colors.orange,
              borderRadius: 6,
              display: 'grid',
              placeItems: 'center',
              color: '#FFFFFF',
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            D
          </div>

          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: colors.text,
                letterSpacing: '-0.5px',
              }}
            >
              Dapur Ina Aina
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 35,
              height: 35,
              borderRadius: '50%',
              background: '#F3E7DF',
              color: colors.text,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            AD
          </div>

          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: colors.text,
            }}
          >
            Admin
          </span>
        </div>
      </header>

      <div
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 72px)',
        }}
      >
        {/* SIDEBAR */}
        <aside
          style={{
            width: 235,
            flexShrink: 0,
            background: '#FFFFFF',
            borderRight: `1px solid ${colors.border}`,
            padding: '27px 13px',
          }}
        >
          <div
            style={{
              padding: '0 15px',
              marginBottom: 15,
              fontSize: 12,
              letterSpacing: 1,
              fontWeight: 800,
              color: colors.muted,
            }}
          >
            WORKSPACE
          </div>

          <nav
            aria-label="Navigasi admin"
            style={{
              display: 'grid',
              gap: 6,
            }}
          >
            {navigation.map(({ id, label }) =>
              sidebarButton(id, label)
            )}
          </nav>

          <div
            style={{
              margin: '35px 15px 0',
              paddingTop: 18,
              borderTop: `1px solid ${colors.border}`,
              color: colors.muted,
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Dapur Ina Aina
         
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            padding: '32px 28px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 18,
              marginBottom: 28,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 0.8,
                  color: colors.orangeDark,
                  marginBottom: 10,
                }}
              >
                DAPUR INA AINA / {titles[activePage].toUpperCase()}
              </div>

              {/* JUDUL DIPERJELAS */}
              <h1
                style={{
                  margin: 0,
                  color: '#1A1A1A',
                  fontSize: 30,
                  fontWeight: 800,
                  lineHeight: 1.3,
                  letterSpacing: '-0.6px',
                }}
              >
                {titles[activePage]}
              </h1>

              <p
                style={{
                  margin: '10px 0 0',
                  color: colors.muted,
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                {descriptions[activePage]}
              </p>
            </div>

            {actions[activePage]
              ? primaryButton(actions[activePage]!)
              : null}
          </div>

          {notice && (
            <div
              role="status"
              style={{
                padding: 15,
                background: '#FFF0E9',
                border: '1px solid #F5CBB9',
                borderRadius: 6,
                color: '#8C2C0E',
                fontSize: 14,
                marginBottom: 20,
              }}
            >
              {notice}
            </div>
          )}

          {renderContent()}
        </main>
      </div>
    </div>
  )
}