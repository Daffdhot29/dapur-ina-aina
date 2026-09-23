import { Form } from '@adonisjs/inertia/react'

export default function Signup() {
  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        {/* Brand */}
        <div style={styles.brand}>
          <div style={styles.logo}>DA</div>

          <h1 style={styles.brandTitle}>
            Dapur Ina Aina
          </h1>

          <p style={styles.brandSubtitle}>
            Sistem Informasi Restoran
          </p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              Buat Akun
            </h2>

            <p style={styles.subtitle}>
              Masukkan data untuk membuat akun kasir baru.
            </p>
          </div>

          <Form route="new_account.store">
            {({ errors, processing }) => (
              <>
                {/* Nama Lengkap */}
                <div style={styles.field}>
                  <label
                    htmlFor="fullName"
                    style={styles.label}
                  >
                    Nama Lengkap
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    autoComplete="name"
                    style={{
                      ...styles.input,
                      ...(errors.fullName
                        ? styles.inputError
                        : {}),
                    }}
                  />

                  {errors.fullName && (
                    <span style={styles.error}>
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div style={styles.field}>
                  <label
                    htmlFor="email"
                    style={styles.label}
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    autoComplete="email"
                    style={{
                      ...styles.input,
                      ...(errors.email
                        ? styles.inputError
                        : {}),
                    }}
                  />

                  {errors.email && (
                    <span style={styles.error}>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div style={styles.field}>
                  <label
                    htmlFor="password"
                    style={styles.label}
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    style={{
                      ...styles.input,
                      ...(errors.password
                        ? styles.inputError
                        : {}),
                    }}
                  />

                  {errors.password && (
                    <span style={styles.error}>
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Konfirmasi Password */}
                <div style={styles.field}>
                  <label
                    htmlFor="passwordConfirmation"
                    style={styles.label}
                  >
                    Konfirmasi Password
                  </label>

                  <input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    placeholder="Masukkan ulang password"
                    autoComplete="new-password"
                    style={{
                      ...styles.input,
                      ...(errors.passwordConfirmation
                        ? styles.inputError
                        : {}),
                    }}
                  />

                  {errors.passwordConfirmation && (
                    <span style={styles.error}>
                      {errors.passwordConfirmation}
                    </span>
                  )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={processing}
                  style={{
                    ...styles.button,
                    opacity: processing ? 0.65 : 1,
                    cursor: processing
                      ? 'not-allowed'
                      : 'pointer',
                  }}
                >
                  {processing
                    ? 'Membuat akun...'
                    : 'Buat Akun'}
                </button>
              </>
            )}
          </Form>

          {/* Login */}
          <div style={styles.footer}>
            <span style={styles.footerText}>
              Sudah memiliki akun?
            </span>

            <a
              href="/login"
              style={styles.loginLink}
            >
              Masuk
            </a>
          </div>
        </div>

        <p style={styles.copyright}>
          © 2026 Dapur Ina Aina
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    position: 'fixed' as const,
    inset: 0,

    width: '100%',
    height: '100vh',

    overflowY: 'auto' as const,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    padding: '32px 20px',

    boxSizing: 'border-box' as const,

    background: '#F5F5F3',

    fontFamily:
      'Arial, Helvetica, sans-serif',
  },

  wrapper: {
    width: '100%',
    maxWidth: '420px',

    margin: 'auto',
  },

  brand: {
    textAlign: 'center' as const,
    marginBottom: '22px',
  },

  logo: {
    width: '50px',
    height: '50px',

    margin: '0 auto 13px',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    background: '#1F2729',
    color: '#FFFFFF',

    borderRadius: '10px',

    fontSize: '18px',
    fontWeight: 800,
  },

  brandTitle: {
    margin: 0,

    color: '#202426',

    fontSize: '25px',
    fontWeight: 800,

    letterSpacing: '-0.4px',
  },

  brandSubtitle: {
    margin: '7px 0 0',

    color: '#74797A',

    fontSize: '13px',
  },

  card: {
    width: '100%',

    padding: '28px',

    boxSizing: 'border-box' as const,

    background: '#FFFFFF',

    border: '1px solid #E0E2DF',
    borderRadius: '10px',

    boxShadow:
      '0 4px 16px rgba(0, 0, 0, 0.05)',
  },

  header: {
    marginBottom: '24px',
  },

  title: {
    margin: 0,

    color: '#202426',

    fontSize: '20px',
    fontWeight: 800,
  },

  subtitle: {
    margin: '7px 0 0',

    color: '#74797A',

    fontSize: '13px',
    lineHeight: 1.5,
  },

  field: {
    marginBottom: '17px',
  },

  label: {
    display: 'block',

    marginBottom: '7px',

    color: '#292E30',

    fontSize: '13px',
    fontWeight: 700,
  },

  input: {
    display: 'block',

    width: '100%',
    height: '43px',

    padding: '0 12px',

    boxSizing: 'border-box' as const,

    border: '1px solid #D8DAD8',
    borderRadius: '5px',

    outline: 'none',

    background: '#FFFFFF',
    color: '#202426',

    fontSize: '13px',
  },

  inputError: {
    border: '1px solid #B94A48',
  },

  error: {
    display: 'block',

    marginTop: '6px',

    color: '#B94A48',

    fontSize: '12px',
  },

  button: {
    display: 'block',

    width: '100%',
    height: '44px',

    marginTop: '7px',

    border: 'none',
    borderRadius: '5px',

    background: '#594743',
    color: '#FFFFFF',

    fontSize: '13px',
    fontWeight: 700,
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',

    marginTop: '22px',
    paddingTop: '20px',

    borderTop: '1px solid #EEEEEC',
  },

  footerText: {
    color: '#74797A',
    fontSize: '13px',
  },

  loginLink: {
    color: '#594743',

    fontSize: '13px',
    fontWeight: 700,

    textDecoration: 'none',
  },

  copyright: {
    margin: '17px 0 0',

    textAlign: 'center' as const,

    color: '#999D9E',

    fontSize: '11px',
  },
}