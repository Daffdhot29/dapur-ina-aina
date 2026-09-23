import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

const KategorisController = () => import('#controllers/kategoris_controller')
const MenusController = () => import('#controllers/menus_controller')
const PelanggansController = () => import('#controllers/pelanggans_controller')
const PesanansController = () => import('#controllers/pesanans_controller')
const DetailPesanansController = () => import('#controllers/detail_pesanans_controller')
const PembayaransController = () => import('#controllers/pembayarans_controller')
const BillingsController = () => import('#controllers/billings_controller')
const LaporanPenjualansController = () =>
  import('#controllers/laporan_penjualans_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('/kategoris', [KategorisController, 'index'])
    router.get('/kategoris/:id', [KategorisController, 'show'])

    router.get('/menus', [MenusController, 'index'])
    router.get('/menus/:id', [MenusController, 'show'])
  })
  .prefix('/api')

router
  .group(() => {
    router.post('/kategoris', [KategorisController, 'store'])
    router.put('/kategoris/:id', [KategorisController, 'update'])
    router.delete('/kategoris/:id', [KategorisController, 'destroy'])

    router.post('/menus', [MenusController, 'store'])
    router.put('/menus/:id', [MenusController, 'update'])
    router.delete('/menus/:id', [MenusController, 'destroy'])
  })
  .prefix('/api')
  .use(middleware.auth())
  .use(middleware.admin())

router
  .group(() => {
    router.get('/pelanggans', [PelanggansController, 'index'])
    router.get('/pelanggans/:id', [PelanggansController, 'show'])
    router.post('/pelanggans', [PelanggansController, 'store'])
    router.put('/pelanggans/:id', [PelanggansController, 'update'])
    router.delete('/pelanggans/:id', [PelanggansController, 'destroy'])

    router.get('/pesanans', [PesanansController, 'index'])
    router.get('/pesanans/:id', [PesanansController, 'show'])
    router.post('/pesanans', [PesanansController, 'store'])

    router.get('/pesanans/:id/details', [
      DetailPesanansController,
      'index',
    ])

    router.get('/detail-pesanans/:id', [
      DetailPesanansController,
      'show',
    ])

    router.get('/pembayarans', [PembayaransController, 'index'])
    router.get('/pembayarans/:id', [PembayaransController, 'show'])
    router.post('/pembayarans', [PembayaransController, 'store'])

    router.get('/billings', [BillingsController, 'index'])
    router.get('/billings/:id', [BillingsController, 'show'])

    router.post('/pesanans/:id/billing', [
      BillingsController,
      'store',
    ])
  })
  .prefix('/api')
  .use(middleware.auth())

router
  .group(() => {
    router.get('/laporan-penjualan/export', [
      LaporanPenjualansController,
      'exportPdf',
    ])

    router.get('/laporan-penjualan', [
      LaporanPenjualansController,
      'index',
    ])
  })
  .prefix('/api')
  .use(middleware.auth())
  .use(middleware.admin())

router
  .get('/admin/dashboard', [DashboardController, 'index'])
  .use(middleware.auth())
  .use(middleware.admin())
  .as('admin.dashboard')

router
  .get('/kasir/dashboard', [DashboardController,'kasir'])
  .use(middleware.auth())
  .as('kasir.dashboard')