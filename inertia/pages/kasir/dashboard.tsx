import { router } from '@inertiajs/react'
import { useState } from 'react'

import KasirDashboard from '../../components/kasir/KasirDashboard'
import PelangganManagement from '../../components/kasir/PelangganManagement'
import PesananManagement from '../../components/kasir/PesananManagement'
import PembayaranManagement from '../../components/kasir/PembayaranManagement'
import BillingManagement from '../../components/kasir/BillingManagement'

type Page =
  | 'dashboard'
  | 'pelanggan'
  | 'pesanan'
  | 'pembayaran'
  | 'billing'

const navigation: {
  id: Page
  label: string
  icon: string
}[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '⌂',
  },
  {
    id: 'pelanggan',
    label: 'Pelanggan',
    icon: '♙',
  },
  {
    id: 'pesanan',
    label: 'Pesanan',
    icon: '▤',
  },
  {
    id: 'pembayaran',
    label: 'Pembayaran',
    icon: '□',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: '▥',
  },
]

const colors = {
  sidebar: '#1F2729',
  sidebarActive: '#594743',
  sidebarText: '#E4E7E7',
  text: '#202426',
  muted: '#686E70',
  background: '#F6F6F4',
  white: '#FFFFFF',
  border: '#E0E2DF',
}

export default function KasirDashboardPage() {
  const [activePage, setActivePage] =
    useState<Page>('dashboard')

  const titles: Record<Page, string> = {
    dashboard: 'Dashboard',
    pelanggan: 'Pelanggan',
    pesanan: 'Pesanan',
    pembayaran: 'Pembayaran',
    billing: 'Billing',
  }

  const descriptions: Record<Page, string> = {
    dashboard:
      'Ringkasan aktivitas operasional kasir.',

    pelanggan:
      'Kelola data pelanggan restoran.',

    pesanan:
      'Buat dan kelola pesanan pelanggan.',

    pembayaran:
      'Proses pembayaran pesanan pelanggan.',

    billing:
      'Lihat dan cetak billing pelanggan.',
  }

  function navigate(page: Page) {
    setActivePage(page)
  }

  function handleLogout() {
    router.post('/logout')
  }

  function renderContent() {
  switch (activePage) {
    case 'dashboard':
      return <KasirDashboard />

    case 'pelanggan':
      return <PelangganManagement />

    case 'pesanan':
      return <PesananManagement />

    case 'pembayaran':
      return <PembayaranManagement />

    case 'billing':
      return <BillingManagement />

    default:
      return <KasirDashboard />
  }
}

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: colors.background,
        color: colors.text,
        fontFamily:
          'Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          minHeight: '100vh',
        }}
      >
        <aside
          style={{
            width: 230,
            flex: '0 0 230px',
            minHeight: '100vh',
            background: colors.sidebar,
            color: colors.sidebarText,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: 64,
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              borderBottom:
                '1px solid rgba(255,255,255,0.08)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                flexShrink: 0,
                borderRadius: '50%',
                background: '#F0F0EC',
                color: colors.sidebar,
                display: 'grid',
                placeItems: 'center',
                fontSize: 15,
                fontWeight: 900,
              }}
            >
              D
            </div>

            <div>
              <strong
                style={{
                  display: 'block',
                  color: colors.white,
                  fontSize: 15,
                  whiteSpace: 'nowrap',
                }}
              >
                Dapur Ina Aina
              </strong>

              <span
                style={{
                  display: 'block',
                  marginTop: 3,
                  color:
                    'rgba(255,255,255,0.5)',
                  fontSize: 11,
                }}
              >
                Kasir
              </span>
            </div>
          </div>

          <nav
            aria-label="Navigasi kasir"
            style={{
              padding: '18px 10px',
              display: 'grid',
              gap: 5,
            }}
          >
            {navigation.map((item) => {
              const active =
                activePage === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    navigate(item.id)
                  }
                  style={{
                    width: '100%',
                    height: 48,
                    padding: '0 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,

                    background: active
                      ? colors.sidebarActive
                      : 'transparent',

                    color: active
                      ? colors.white
                      : colors.sidebarText,

                    border: 'none',
                    borderRadius: 5,
                    fontSize: 14,

                    fontWeight: active
                      ? 700
                      : 500,

                    textAlign: 'left',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      flexShrink: 0,
                      textAlign: 'center',
                      fontSize: 16,
                    }}
                  >
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </nav>

          <div
            style={{
              marginTop: 'auto',
              padding: 10,
              borderTop:
                '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                height: 46,
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'transparent',
                color: colors.sidebarText,
                border: 'none',
                borderRadius: 5,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background =
                  'rgba(255,255,255,0.08)'

                event.currentTarget.style.color =
                  '#FFFFFF'
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background =
                  'transparent'

                event.currentTarget.style.color =
                  colors.sidebarText
              }}
            >
              <span
                style={{
                  width: 20,
                  textAlign: 'center',
                  fontSize: 16,
                }}
              >
                ↪
              </span>

              <span>Keluar</span>
            </button>
          </div>
        </aside>

        <main
          style={{
            flex: '1 1 auto',
            width: 0,
            minWidth: 0,
            minHeight: '100vh',
            background: colors.background,
          }}
        >
          <header
            style={{
              width: '100%',
              height: 64,
              background: colors.white,
              borderBottom:
                `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 32px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: '#ECECE8',
                  display: 'grid',
                  placeItems: 'center',
                  color: colors.text,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                KS
              </div>

              <div>
                <div
                  style={{
                    color: colors.text,
                    fontSize: 13,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Kasir
                </div>

                <div
                  style={{
                    marginTop: 2,
                    color: colors.muted,
                    fontSize: 11,
                  }}
                >
                  Kasir
                </div>
              </div>
            </div>
          </header>

          <div
            style={{
              width: '100%',
              padding: '28px 32px 40px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: 28,
                  fontWeight: 800,
                  lineHeight: 1.25,
                  letterSpacing: '-0.4px',
                }}
              >
                {titles[activePage]}
              </h1>

              <p
                style={{
                  margin: '6px 0 0',
                  color: colors.muted,
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {descriptions[activePage]}
              </p>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

