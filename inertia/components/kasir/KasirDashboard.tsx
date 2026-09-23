import { useEffect, useState } from 'react'

type DashboardData = {
  totalPelanggan: number
  totalPesanan: number
  totalPembayaran: number
}

export default function KasirDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalPelanggan: 0,
    totalPesanan: 0,
    totalPembayaran: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)

      const [
        pelangganResponse,
        pesananResponse,
        pembayaranResponse,
      ] = await Promise.all([
        fetch('/api/pelanggans'),
        fetch('/api/pesanans'),
        fetch('/api/pembayarans'),
      ])

      const pelangganResult =
        pelangganResponse.ok
          ? await pelangganResponse.json()
          : []

      const pesananResult =
        pesananResponse.ok
          ? await pesananResponse.json()
          : []

      const pembayaranResult =
        pembayaranResponse.ok
          ? await pembayaranResponse.json()
          : []

      const pelanggan =
        pelangganResult.data ?? pelangganResult

      const pesanan =
        pesananResult.data ?? pesananResult

      const pembayaran =
        pembayaranResult.data ?? pembayaranResult

      setData({
        totalPelanggan: Array.isArray(pelanggan)
          ? pelanggan.length
          : 0,

        totalPesanan: Array.isArray(pesanan)
          ? pesanan.length
          : 0,

        totalPembayaran: Array.isArray(pembayaran)
          ? pembayaran.length
          : 0,
      })
    } catch (error) {
      console.error(
        'Gagal mengambil dashboard kasir:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(3, minmax(0, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <MetricCard
          label="Total Pelanggan"
          value={
            loading
              ? '...'
              : String(data.totalPelanggan)
          }
          description="Pelanggan terdaftar"
        />

        <MetricCard
          label="Total Pesanan"
          value={
            loading
              ? '...'
              : String(data.totalPesanan)
          }
          description="Pesanan tercatat"
        />

        <MetricCard
          label="Total Pembayaran"
          value={
            loading
              ? '...'
              : String(data.totalPembayaran)
          }
          description="Pembayaran tercatat"
        />
      </div>

      <section
        style={{
          background: '#FFFFFF',
          border: '1px solid #E0E2DF',
          borderRadius: 7,
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#202426',
            marginBottom: 8,
          }}
        >
          Dashboard Kasir
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: '#686E70',
          }}
        >
          Kelola pelanggan, buat pesanan,
          proses pembayaran, dan cetak billing
          melalui menu di sebelah kiri.
        </div>
      </section>
    </>
  )
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
        background: '#FFFFFF',
        border: '1px solid #E0E2DF',
        borderRadius: 7,
        padding: '20px 22px',
        minHeight: 120,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          color: '#686E70',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 15,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: '#202426',
          fontSize: 27,
          fontWeight: 800,
          marginBottom: 13,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: '#686E70',
          fontSize: 12,
        }}
      >
        {description}
      </div>
    </div>
  )
}