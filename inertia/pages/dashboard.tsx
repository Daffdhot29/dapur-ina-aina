import { useState } from 'react'

import AdminDashboard from '../components/admin/AdminDashboard'
import MenuManagement from '../components/admin/MenuManagement'
import SalesReport from '../components/admin/SalesReport'

type Page =
  | 'dashboard'
  | 'menu'
  | 'laporan'

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
    id: 'menu',
    label: 'Menu & Kategori',
    icon: '≡',
  },
  {
    id: 'laporan',
    label: 'Laporan Penjualan',
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

export default function DashboardPage() {
  const [activePage, setActivePage] =
    useState<Page>('dashboard')

  const titles: Record<Page, string> = {
    dashboard: 'Dashboard',
    menu: 'Menu & Kategori',
    laporan: 'Laporan Penjualan',
  }

  const descriptions: Record<Page, string> = {
    dashboard: 'Selamat datang, Admin',

    menu:
      'Kelola menu, kategori, harga, dan stok restoran.',

    laporan:
      'Pantau dan lihat rekap penjualan restoran.',
  }

  function renderContent() {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />

      case 'menu':
        return <MenuManagement />

      case 'laporan':
        return <SalesReport />

      default:
        return null
    }
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',

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
          {/* BRAND */}
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

            <strong
              style={{
                color: colors.white,

                fontSize: 15,

                whiteSpace: 'nowrap',
              }}
            >
              Dapur Ina Aina
            </strong>
          </div>

          {/* NAVIGATION */}
          <nav
            aria-label="Navigasi admin"
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
                    setActivePage(item.id)
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

                    boxSizing:
                      'border-box',
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

          {/* LOGOUT */}
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
              style={{
                width: '100%',
                height: 46,

                padding: '0 14px',

                display: 'flex',
                alignItems: 'center',

                gap: 12,

                background: 'transparent',

                color:
                  colors.sidebarText,

                border: 'none',
                borderRadius: 5,

                fontSize: 14,

                cursor: 'pointer',

                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: 20,
                  textAlign: 'center',
                }}
              >
                ↪
              </span>

              Keluar
            </button>
          </div>
        </aside>

        <main
          style={{
            flex: '1 1 auto',

            width: 0,
            minWidth: 0,

            minHeight: '100vh',

            background:
              colors.background,
          }}
        >
          {/* TOP BAR */}
          <div
            style={{
              width: '100%',
              height: 64,

              padding: '0 32px',

              display: 'flex',
              alignItems: 'center',

              background:
                colors.white,

              borderBottom:
                `1px solid ${colors.border}`,

              boxSizing: 'border-box',
            }}
          >
            {/* ADMIN PROFILE */}
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
                AD
              </div>

              <span
                style={{
                  color: colors.text,

                  fontSize: 14,
                  fontWeight: 700,

                  whiteSpace: 'nowrap',
                }}
              >
                Admin
              </span>
            </div>
          </div>


          <div
            style={{
              width: '100%',

              padding:
                '28px 32px 40px',

              boxSizing: 'border-box',
            }}
          >
            {/* PAGE HEADER */}
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

                  letterSpacing:
                    '-0.4px',
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
                {
                  descriptions[
                    activePage
                  ]
                }
              </p>
            </div>

            {/* COMPONENT */}
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}