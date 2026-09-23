import { FormEvent, useState } from 'react'

type ReportData = {
  totalTransaksi: number
  totalPendapatan: number
}

const colors = {
  primary: '#513934',
  text: '#202426',
  muted: '#686E70',
  white: '#FFFFFF',
  border: '#E0E2DF',
  tableHeader: '#F7F7F5',
}

export default function SalesReport() {
  const [tanggalMulai, setTanggalMulai] = useState('')
  const [tanggalSelesai, setTanggalSelesai] = useState('')

  const [report, setReport] =
    useState<ReportData | null>(null)

  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)

  const [error, setError] = useState('')

  async function loadReport(event: FormEvent) {
    event.preventDefault()

    if (!tanggalMulai || !tanggalSelesai) {
      setError(
        'Tanggal mulai dan tanggal selesai wajib diisi.'
      )
      return
    }

    if (tanggalMulai > tanggalSelesai) {
      setError(
        'Tanggal mulai tidak boleh melebihi tanggal selesai.'
      )
      return
    }

    try {
      setLoading(true)
      setError('')
      setReport(null)

      const params = new URLSearchParams({
        tanggalMulai,
        tanggalSelesai,
      })

      const response = await fetch(
        `/api/laporan-penjualan?${params.toString()}`,
        {
          method: 'GET',

          headers: {
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        const result = await response
          .json()
          .catch(() => null)

        throw new Error(
          result?.message ??
            'Gagal mengambil laporan penjualan.'
        )
      }

      const result = await response.json()

      const source = result.data ?? result

      setReport({
        totalTransaksi: Number(
          source.totalTransaksi ?? 0
        ),

        totalPendapatan: Number(
          source.totalPendapatan ?? 0
        ),
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengambil laporan.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function exportPdf() {
    if (!report) {
      setError(
        'Tampilkan laporan terlebih dahulu sebelum export PDF.'
      )
      return
    }

    if (!tanggalMulai || !tanggalSelesai) {
      setError(
        'Tanggal mulai dan tanggal selesai wajib diisi.'
      )
      return
    }

    try {
      setExporting(true)
      setError('')

      const params = new URLSearchParams({
        tanggalMulai,
        tanggalSelesai,
      })

      const response = await fetch(
        `/api/laporan-penjualan/export?${params.toString()}`,
        {
          method: 'GET',

          headers: {
            Accept: 'application/pdf',
          },
        }
      )

      if (!response.ok) {
        const result = await response
          .json()
          .catch(() => null)

        throw new Error(
          result?.message ??
            'Gagal membuat laporan PDF.'
        )
      }

      const blob = await response.blob()

      const url =
        window.URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = url

      link.download =
        `laporan-penjualan-${tanggalMulai}-${tanggalSelesai}.pdf`

      document.body.appendChild(link)

      link.click()

      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Gagal export laporan PDF.'
      )
    } finally {
      setExporting(false)
    }
  }

  function formatRupiah(value: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  function formatTanggal(value: string) {
    if (!value) {
      return '-'
    }

    const [tahun, bulan, tanggal] =
      value.split('-')

    return `${tanggal}/${bulan}/${tahun}`
  }

  const rataRata =
    report && report.totalTransaksi > 0
      ? report.totalPendapatan /
        report.totalTransaksi
      : 0

  return (
    <>
      <section
        style={{
          background: colors.white,

          border: `1px solid ${colors.border}`,
          borderRadius: 7,

          padding: 20,
          marginBottom: 20,

          boxSizing: 'border-box',
        }}
      >
        <form
          onSubmit={loadReport}
          style={{
            display: 'grid',

            gridTemplateColumns:
              'minmax(180px, 1fr) minmax(180px, 1fr) auto',

            alignItems: 'end',

            gap: 14,

            width: '100%',
          }}
        >
          {/* TANGGAL MULAI */}

          <Field label="Tanggal Mulai">
            <input
              type="date"
              required
              value={tanggalMulai}
              onChange={(event) => {
                setTanggalMulai(
                  event.target.value
                )

                setReport(null)
                setError('')
              }}
              style={inputStyle}
            />
          </Field>

          {/* TANGGAL SELESAI */}

          <Field label="Tanggal Selesai">
            <input
              type="date"
              required
              value={tanggalSelesai}
              onChange={(event) => {
                setTanggalSelesai(
                  event.target.value
                )

                setReport(null)
                setError('')
              }}
              style={inputStyle}
            />
          </Field>

          {/* ACTION */}

          <div
            style={{
              display: 'flex',

              alignItems: 'center',

              gap: 10,

              flexShrink: 0,
            }}
          >
            <button
              type="submit"
              disabled={loading || exporting}
              style={{
                width: 120,
                minWidth: 120,
                maxWidth: 120,

                height: 42,
                minHeight: 42,
                maxHeight: 42,

                padding: 0,
                margin: 0,

                border: 'none',
                borderRadius: 5,

                background:
                  colors.primary,

                color: colors.white,

                fontSize: 14,
                fontWeight: 700,

                cursor:
                  loading || exporting
                    ? 'not-allowed'
                    : 'pointer',

                opacity:
                  loading || exporting
                    ? 0.7
                    : 1,

                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',

                boxSizing: 'border-box',

                flex: 'none',
              }}
            >
              {loading
                ? 'Memuat...'
                : 'Tampilkan'}
            </button>

            <button
              type="button"
              onClick={exportPdf}
              disabled={
                !report ||
                loading ||
                exporting
              }
              style={{
                width: 120,
                minWidth: 120,
                maxWidth: 120,

                height: 42,
                minHeight: 42,
                maxHeight: 42,

                padding: 0,
                margin: 0,

                border:
                  `1px solid ${colors.border}`,

                borderRadius: 5,

                background:
                  colors.white,

                color: colors.text,

                fontSize: 14,
                fontWeight: 700,

                cursor:
                  !report ||
                  loading ||
                  exporting
                    ? 'not-allowed'
                    : 'pointer',

                opacity:
                  !report ||
                  loading ||
                  exporting
                    ? 0.5
                    : 1,

                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',

                boxSizing: 'border-box',

                flex: 'none',
              }}
            >
              {exporting
                ? 'Membuat...'
                : 'Export PDF'}
            </button>
          </div>
        </form>
      </section>


      {error && (
        <div
          role="alert"
          style={{
            padding: '12px 15px',

            marginBottom: 20,

            background: '#FFF1F0',

            border:
              '1px solid #F0B8B4',

            borderRadius: 5,

            color: '#B42318',

            fontSize: 13,

            boxSizing: 'border-box',
          }}
        >
          {error}
        </div>
      )}

    

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
          label="Total Transaksi"
          value={
            report
              ? String(
                  report.totalTransaksi
                )
              : '—'
          }
          description="Transaksi"
        />

        <MetricCard
          label="Total Pendapatan"
          value={
            report
              ? formatRupiah(
                  report.totalPendapatan
                )
              : '—'
          }
          description="Pendapatan"
        />

        <MetricCard
          label="Rata-rata Transaksi"
          value={
            report
              ? formatRupiah(rataRata)
              : '—'
          }
          description="Per transaksi"
        />
      </div>

      <section
        style={{
          background: colors.white,

          border:
            `1px solid ${colors.border}`,

          borderRadius: 7,

          overflow: 'hidden',
        }}
      >
        {/* TABLE HEADER */}

        <div
          style={{
            minHeight: 58,

            padding: '0 20px',

            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',

            gap: 20,

            borderBottom:
              `1px solid ${colors.border}`,

            boxSizing: 'border-box',
          }}
        >
          <strong
            style={{
              color: colors.text,

              fontSize: 15,
            }}
          >
            Data Penjualan
          </strong>

          {report && (
            <span
              style={{
                color: colors.muted,

                fontSize: 12,
              }}
            >
              {formatTanggal(
                tanggalMulai
              )}{' '}
              -{' '}
              {formatTanggal(
                tanggalSelesai
              )}
            </span>
          )}
        </div>

        {/* TABLE */}

        <div
          style={{
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',

              minWidth: 650,

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
                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Periode Mulai
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Periode Selesai
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Total Transaksi
                </th>

                <th
                  style={
                    tableHeaderStyle
                  }
                >
                  Total Pendapatan
                </th>
              </tr>
            </thead>

            <tbody>
              {!report ? (
                <tr>
                  <td
                    colSpan={4}
                    style={emptyStyle}
                  >
                    {loading
                      ? 'Memuat laporan penjualan...'
                      : 'Pilih periode untuk menampilkan laporan penjualan.'}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    style={
                      tableCellStyle
                    }
                  >
                    {formatTanggal(
                      tanggalMulai
                    )}
                  </td>

                  <td
                    style={
                      tableCellStyle
                    }
                  >
                    {formatTanggal(
                      tanggalSelesai
                    )}
                  </td>

                  <td
                    style={
                      tableCellStyle
                    }
                  >
                    {
                      report.totalTransaksi
                    }
                  </td>

                  <td
                    style={
                      tableCellStyle
                    }
                  >
                    {formatRupiah(
                      report.totalPendapatan
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}


function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label
      style={{
        display: 'grid',

        gap: 8,

        color: '#202426',

        fontSize: 13,
        fontWeight: 700,

        minWidth: 0,
      }}
    >
      {label}

      {children}
    </label>
  )
}

/* ================================= */
/* METRIC CARD */
/* ================================= */

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

        border:
          '1px solid #E0E2DF',

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

          lineHeight: 1,

          marginBottom: 13,

          overflow: 'hidden',

          textOverflow: 'ellipsis',
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



const inputStyle = {
  width: '100%',

  height: 42,

  padding: '0 12px',

  border:
    '1px solid #D9DCDA',

  borderRadius: 5,

  background: '#FFFFFF',

  color: '#202426',

  fontSize: 14,

  outline: 'none',

  boxSizing:
    'border-box' as const,
}

const tableHeaderStyle = {
  padding: '14px 17px',

  borderBottom:
    '1px solid #E0E2DF',

  color: '#202426',

  fontSize: 13,

  fontWeight: 700,

  whiteSpace:
    'nowrap' as const,
}

const tableCellStyle = {
  padding: '15px 17px',

  borderBottom:
    '1px solid #E0E2DF',

  color: '#202426',

  verticalAlign:
    'middle' as const,
}

const emptyStyle = {
  height: 120,

  padding: 20,

  textAlign:
    'center' as const,

  verticalAlign:
    'middle' as const,

  color: '#686E70',
}