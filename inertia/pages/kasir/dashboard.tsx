import {
  useState,
} from 'react'
import KasirDashboard from '../../components/kasir/KasirDashboard'
import PelangganManagement from '../../components/kasir/PelangganManagement'

type MenuKey =
  | 'dashboard'
  | 'pelanggan'
  | 'pesanan'
  | 'pembayaran'
  | 'billing'

const navigation: {
  key: MenuKey
  label: string
}[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
  },
  {
    key: 'pelanggan',
    label: 'Pelanggan',
  },
  {
    key: 'pesanan',
    label: 'Pesanan',
  },
  {
    key: 'pembayaran',
    label: 'Pembayaran',
  },
  {
    key: 'billing',
    label: 'Billing',
  },
]

const pageInfo: Record<
  MenuKey,
  {
    title: string
    subtitle: string
  }
> = {
  dashboard: {
    title: 'Dashboard',
    subtitle:
      'Ringkasan aktivitas kasir Dapur Ina Aina.',
  },

  pelanggan: {
    title: 'Pelanggan',
    subtitle:
      'Kelola data pelanggan restoran.',
  },

  pesanan: {
    title: 'Pesanan',
    subtitle:
      'Buat dan kelola pesanan pelanggan.',
  },

  pembayaran: {
    title: 'Pembayaran',
    subtitle:
      'Proses pembayaran pesanan.',
  },

  billing: {
    title: 'Billing',
    subtitle:
      'Lihat dan cetak billing pelanggan.',
  },
}

export default function KasirPage() {
  const [activeMenu, setActiveMenu] =
    useState<MenuKey>('dashboard')

  const currentPage =
    pageInfo[activeMenu]

  function renderContent() {
    switch (activeMenu) {
      case 'dashboard':
        return <KasirDashboard />

      case 'pelanggan':
        return (
          <PelangganManagement />
        )

      case 'pesanan':
        return (
          <ComingSoon
            title="Pesanan"
            description="Fitur pesanan akan dikerjakan setelah pelanggan."
          />
        )

      case 'pembayaran':
        return (
          <ComingSoon
            title="Pembayaran"
            description="Fitur pembayaran akan dikerjakan setelah pesanan."
          />
        )

      case 'billing':
        return (
          <ComingSoon
            title="Billing"
            description="Fitur billing akan dikerjakan setelah pembayaran."
          />
        )
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',

        background:
          '#F6F6F4',

        fontFamily:
          'Arial, sans-serif',

        color:
          '#202426',
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
          position:
            'fixed',

          top: 0,
          left: 0,
          bottom: 0,

          width: 230,

          background:
            '#1F2729',

          color:
            '#FFFFFF',

          zIndex: 20,
        }}
      >
        <div
          style={{
            height: 64,

            display: 'flex',

            alignItems:
              'center',

            padding:
              '0 22px',

            borderBottom:
              '1px solid rgba(255,255,255,0.08)',

            boxSizing:
              'border-box',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 16,

                fontWeight: 800,
              }}
            >
              Dapur Ina Aina
            </div>

            <div
              style={{
                marginTop: 3,

                fontSize: 11,

                color:
                  'rgba(255,255,255,0.55)',
              }}
            >
              Kasir
            </div>
          </div>
        </div>

        <nav
          style={{
            padding:
              '18px 12px',
          }}
        >
          {navigation.map(
            (item) => {
              const active =
                activeMenu ===
                item.key

              return (
                <button
                  key={
                    item.key
                  }

                  type="button"

                  onClick={() =>
                    setActiveMenu(
                      item.key
                    )
                  }

                  style={{
                    width:
                      '100%',

                    height: 43,

                    padding:
                      '0 14px',

                    marginBottom:
                      5,

                    border:
                      'none',

                    borderRadius:
                      5,

                    background:
                      active
                        ? '#594743'
                        : 'transparent',

                    color:
                      active
                        ? '#FFFFFF'
                        : 'rgba(255,255,255,0.72)',

                    textAlign:
                      'left',

                    fontSize:
                      13,

                    fontWeight:
                      active
                        ? 700
                        : 500,

                    cursor:
                      'pointer',

                    boxSizing:
                      'border-box',
                  }}
                >
                  {
                    item.label
                  }
                </button>
              )
            }
          )}
        </nav>
      </aside>

      {/* CONTENT */}

      <div
        style={{
          marginLeft: 230,

          minHeight:
            '100vh',
        }}
      >
        {/* TOPBAR */}

        <header
          style={{
            height: 64,

            background:
              '#FFFFFF',

            borderBottom:
              '1px solid #E0E2DF',

            display: 'flex',

            alignItems:
              'center',

            justifyContent:
              'flex-end',

            padding:
              '0 32px',

            boxSizing:
              'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',

              alignItems:
                'center',

              gap: 10,
            }}
          >
            <div
              style={{
                width: 34,

                height: 34,

                borderRadius:
                  '50%',

                background:
                  '#513934',

                color:
                  '#FFFFFF',

                display:
                  'flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',

                fontSize:
                  12,

                fontWeight:
                  800,
              }}
            >
              KS
            </div>

            <div>
              <div
                style={{
                  fontSize:
                    13,

                  fontWeight:
                    700,

                  color:
                    '#202426',
                }}
              >
                Kasir
              </div>

              <div
                style={{
                  marginTop:
                    2,

                  fontSize:
                    11,

                  color:
                    '#686E70',
                }}
              >
                Kasir
              </div>
            </div>
          </div>
        </header>

        {/* PAGE */}

        <main
          style={{
            padding:
              '28px 32px 40px',
          }}
        >
          <div
            style={{
              marginBottom:
                24,
            }}
          >
            <h1
              style={{
                margin: 0,

                color:
                  '#202426',

                fontSize:
                  24,

                fontWeight:
                  800,
              }}
            >
              {
                currentPage.title
              }
            </h1>

            <p
              style={{
                margin:
                  '7px 0 0',

                color:
                  '#686E70',

                fontSize:
                  13,
              }}
            >
              {
                currentPage.subtitle
              }
            </p>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function ComingSoon({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      style={{
        background:
          '#FFFFFF',

        border:
          '1px solid #E0E2DF',

        borderRadius:
          7,

        padding:
          30,

        textAlign:
          'center',
      }}
    >
      <div
        style={{
          color:
            '#202426',

          fontSize:
            16,

          fontWeight:
            800,

          marginBottom:
            8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color:
            '#686E70',

          fontSize:
            13,
        }}
      >
        {description}
      </div>
    </div>
  )
}