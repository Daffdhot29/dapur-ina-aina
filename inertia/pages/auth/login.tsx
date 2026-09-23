import { Form } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <main
      style={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F5F3',
        fontFamily: 'Arial, Helvetica, sans-serif',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Brand */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 14px',
              borderRadius: '10px',
              background: '#1F2729',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            DA
          </div>

          <h1
            style={{
              margin: 0,
              color: '#202426',
              fontSize: '26px',
              fontWeight: 800,
              letterSpacing: '-0.5px',
            }}
          >
            Dapur Ina Aina
          </h1>

        </div>

        {/* Login Card */}
        <div
          style={{
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid #E0E2DF',
            borderRadius: '10px',
            padding: '28px',
            boxSizing: 'border-box',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                margin: 0,
                color: '#202426',
                fontSize: '20px',
                fontWeight: 800,
              }}
            >
              Login
            </h2>

            <p
              style={{
                margin: '7px 0 0',
                color: '#74797A',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              Masukkan email dan password untuk melanjutkan.
            </p>
          </div>

          <Form route="session.store">
            {({ errors, processing }) => (
              <>
                {/* Email */}
                <div
                  style={{
                    marginBottom: '18px',
                  }}
                >
                  <label
                    htmlFor="email"
                    style={{
                      display: 'block',
                      marginBottom: '7px',
                      color: '#292E30',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Masukkan email"
                    autoComplete="username"
                    style={{
                      width: '100%',
                      height: '43px',
                      padding: '0 12px',
                      boxSizing: 'border-box',
                      border: errors.email
                        ? '1px solid #B94A48'
                        : '1px solid #D8DAD8',
                      borderRadius: '5px',
                      outline: 'none',
                      background: '#FFFFFF',
                      color: '#202426',
                      fontSize: '13px',
                    }}
                  />

                  {errors.email && (
                    <span
                      style={{
                        display: 'block',
                        marginTop: '6px',
                        color: '#B94A48',
                        fontSize: '12px',
                      }}
                    >
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password */}
                <div
                  style={{
                    marginBottom: '24px',
                  }}
                >
                  <label
                    htmlFor="password"
                    style={{
                      display: 'block',
                      marginBottom: '7px',
                      color: '#292E30',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      height: '43px',
                      padding: '0 12px',
                      boxSizing: 'border-box',
                      border: errors.password
                        ? '1px solid #B94A48'
                        : '1px solid #D8DAD8',
                      borderRadius: '5px',
                      outline: 'none',
                      background: '#FFFFFF',
                      color: '#202426',
                      fontSize: '13px',
                    }}
                  />

                  {errors.password && (
                    <span
                      style={{
                        display: 'block',
                        marginTop: '6px',
                        color: '#B94A48',
                        fontSize: '12px',
                      }}
                    >
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={processing}
                  style={{
                    width: '100%',
                    height: '44px',
                    border: 'none',
                    borderRadius: '5px',
                    background: '#594743',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: processing ? 'not-allowed' : 'pointer',
                    opacity: processing ? 0.7 : 1,
                  }}
                >
                  {processing ? 'Memproses...' : 'Masuk'}
                </button>
              </>
            )}
          </Form>

          {/* Signup */}
          <div
            style={{
              marginTop: '22px',
              paddingTop: '20px',
              borderTop: '1px solid #EEEEEC',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                color: '#74797A',
                fontSize: '13px',
              }}
            >
              Belum memiliki akun?{' '}
            </span>

            <a
              href="/signup"
              style={{
                color: '#594743',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Daftar
            </a>
          </div>
        </div>

        <p
          style={{
            margin: '18px 0 0',
            textAlign: 'center',
            color: '#999D9E',
            fontSize: '11px',
          }}
        >
          © 2026 Dapur Ina Aina
        </p>
      </div>
    </main>
  )
}