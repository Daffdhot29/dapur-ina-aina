/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'kategoris.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/kategoris',
    tokens: [{"old":"/api/kategoris","type":0,"val":"api","end":""},{"old":"/api/kategoris","type":0,"val":"kategoris","end":""}],
    types: placeholder as Registry['kategoris.index']['types'],
  },
  'kategoris.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/kategoris/:id',
    tokens: [{"old":"/api/kategoris/:id","type":0,"val":"api","end":""},{"old":"/api/kategoris/:id","type":0,"val":"kategoris","end":""},{"old":"/api/kategoris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['kategoris.show']['types'],
  },
  'menus.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/menus',
    tokens: [{"old":"/api/menus","type":0,"val":"api","end":""},{"old":"/api/menus","type":0,"val":"menus","end":""}],
    types: placeholder as Registry['menus.index']['types'],
  },
  'menus.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/menus/:id',
    tokens: [{"old":"/api/menus/:id","type":0,"val":"api","end":""},{"old":"/api/menus/:id","type":0,"val":"menus","end":""},{"old":"/api/menus/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['menus.show']['types'],
  },
  'kategoris.store': {
    methods: ["POST"],
    pattern: '/api/kategoris',
    tokens: [{"old":"/api/kategoris","type":0,"val":"api","end":""},{"old":"/api/kategoris","type":0,"val":"kategoris","end":""}],
    types: placeholder as Registry['kategoris.store']['types'],
  },
  'kategoris.update': {
    methods: ["PUT"],
    pattern: '/api/kategoris/:id',
    tokens: [{"old":"/api/kategoris/:id","type":0,"val":"api","end":""},{"old":"/api/kategoris/:id","type":0,"val":"kategoris","end":""},{"old":"/api/kategoris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['kategoris.update']['types'],
  },
  'kategoris.destroy': {
    methods: ["DELETE"],
    pattern: '/api/kategoris/:id',
    tokens: [{"old":"/api/kategoris/:id","type":0,"val":"api","end":""},{"old":"/api/kategoris/:id","type":0,"val":"kategoris","end":""},{"old":"/api/kategoris/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['kategoris.destroy']['types'],
  },
  'menus.store': {
    methods: ["POST"],
    pattern: '/api/menus',
    tokens: [{"old":"/api/menus","type":0,"val":"api","end":""},{"old":"/api/menus","type":0,"val":"menus","end":""}],
    types: placeholder as Registry['menus.store']['types'],
  },
  'menus.update': {
    methods: ["PUT"],
    pattern: '/api/menus/:id',
    tokens: [{"old":"/api/menus/:id","type":0,"val":"api","end":""},{"old":"/api/menus/:id","type":0,"val":"menus","end":""},{"old":"/api/menus/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['menus.update']['types'],
  },
  'menus.destroy': {
    methods: ["DELETE"],
    pattern: '/api/menus/:id',
    tokens: [{"old":"/api/menus/:id","type":0,"val":"api","end":""},{"old":"/api/menus/:id","type":0,"val":"menus","end":""},{"old":"/api/menus/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['menus.destroy']['types'],
  },
  'pelanggans.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/pelanggans',
    tokens: [{"old":"/api/pelanggans","type":0,"val":"api","end":""},{"old":"/api/pelanggans","type":0,"val":"pelanggans","end":""}],
    types: placeholder as Registry['pelanggans.index']['types'],
  },
  'pelanggans.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/pelanggans/:id',
    tokens: [{"old":"/api/pelanggans/:id","type":0,"val":"api","end":""},{"old":"/api/pelanggans/:id","type":0,"val":"pelanggans","end":""},{"old":"/api/pelanggans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['pelanggans.show']['types'],
  },
  'pelanggans.store': {
    methods: ["POST"],
    pattern: '/api/pelanggans',
    tokens: [{"old":"/api/pelanggans","type":0,"val":"api","end":""},{"old":"/api/pelanggans","type":0,"val":"pelanggans","end":""}],
    types: placeholder as Registry['pelanggans.store']['types'],
  },
  'pelanggans.update': {
    methods: ["PUT"],
    pattern: '/api/pelanggans/:id',
    tokens: [{"old":"/api/pelanggans/:id","type":0,"val":"api","end":""},{"old":"/api/pelanggans/:id","type":0,"val":"pelanggans","end":""},{"old":"/api/pelanggans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['pelanggans.update']['types'],
  },
  'pelanggans.destroy': {
    methods: ["DELETE"],
    pattern: '/api/pelanggans/:id',
    tokens: [{"old":"/api/pelanggans/:id","type":0,"val":"api","end":""},{"old":"/api/pelanggans/:id","type":0,"val":"pelanggans","end":""},{"old":"/api/pelanggans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['pelanggans.destroy']['types'],
  },
  'pesanans.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/pesanans',
    tokens: [{"old":"/api/pesanans","type":0,"val":"api","end":""},{"old":"/api/pesanans","type":0,"val":"pesanans","end":""}],
    types: placeholder as Registry['pesanans.index']['types'],
  },
  'pesanans.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/pesanans/:id',
    tokens: [{"old":"/api/pesanans/:id","type":0,"val":"api","end":""},{"old":"/api/pesanans/:id","type":0,"val":"pesanans","end":""},{"old":"/api/pesanans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['pesanans.show']['types'],
  },
  'pesanans.store': {
    methods: ["POST"],
    pattern: '/api/pesanans',
    tokens: [{"old":"/api/pesanans","type":0,"val":"api","end":""},{"old":"/api/pesanans","type":0,"val":"pesanans","end":""}],
    types: placeholder as Registry['pesanans.store']['types'],
  },
  'detail_pesanans.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/pesanans/:id/details',
    tokens: [{"old":"/api/pesanans/:id/details","type":0,"val":"api","end":""},{"old":"/api/pesanans/:id/details","type":0,"val":"pesanans","end":""},{"old":"/api/pesanans/:id/details","type":1,"val":"id","end":""},{"old":"/api/pesanans/:id/details","type":0,"val":"details","end":""}],
    types: placeholder as Registry['detail_pesanans.index']['types'],
  },
  'detail_pesanans.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/detail-pesanans/:id',
    tokens: [{"old":"/api/detail-pesanans/:id","type":0,"val":"api","end":""},{"old":"/api/detail-pesanans/:id","type":0,"val":"detail-pesanans","end":""},{"old":"/api/detail-pesanans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['detail_pesanans.show']['types'],
  },
  'pembayarans.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/pembayarans',
    tokens: [{"old":"/api/pembayarans","type":0,"val":"api","end":""},{"old":"/api/pembayarans","type":0,"val":"pembayarans","end":""}],
    types: placeholder as Registry['pembayarans.index']['types'],
  },
  'pembayarans.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/pembayarans/:id',
    tokens: [{"old":"/api/pembayarans/:id","type":0,"val":"api","end":""},{"old":"/api/pembayarans/:id","type":0,"val":"pembayarans","end":""},{"old":"/api/pembayarans/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['pembayarans.show']['types'],
  },
  'pembayarans.store': {
    methods: ["POST"],
    pattern: '/api/pembayarans',
    tokens: [{"old":"/api/pembayarans","type":0,"val":"api","end":""},{"old":"/api/pembayarans","type":0,"val":"pembayarans","end":""}],
    types: placeholder as Registry['pembayarans.store']['types'],
  },
  'billings.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/billings',
    tokens: [{"old":"/api/billings","type":0,"val":"api","end":""},{"old":"/api/billings","type":0,"val":"billings","end":""}],
    types: placeholder as Registry['billings.index']['types'],
  },
  'billings.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/billings/:id',
    tokens: [{"old":"/api/billings/:id","type":0,"val":"api","end":""},{"old":"/api/billings/:id","type":0,"val":"billings","end":""},{"old":"/api/billings/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['billings.show']['types'],
  },
  'billings.store': {
    methods: ["POST"],
    pattern: '/api/pesanans/:id/billing',
    tokens: [{"old":"/api/pesanans/:id/billing","type":0,"val":"api","end":""},{"old":"/api/pesanans/:id/billing","type":0,"val":"pesanans","end":""},{"old":"/api/pesanans/:id/billing","type":1,"val":"id","end":""},{"old":"/api/pesanans/:id/billing","type":0,"val":"billing","end":""}],
    types: placeholder as Registry['billings.store']['types'],
  },
  'laporan_penjualans.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/laporan-penjualan',
    tokens: [{"old":"/api/laporan-penjualan","type":0,"val":"api","end":""},{"old":"/api/laporan-penjualan","type":0,"val":"laporan-penjualan","end":""}],
    types: placeholder as Registry['laporan_penjualans.index']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin/dashboard',
    tokens: [{"old":"/admin/dashboard","type":0,"val":"admin","end":""},{"old":"/admin/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
