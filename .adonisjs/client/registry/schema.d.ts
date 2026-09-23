/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'kategoris.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/kategoris'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['index']>>>
    }
  }
  'kategoris.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/kategoris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['show']>>>
    }
  }
  'menus.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/menus'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['index']>>>
    }
  }
  'menus.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/menus/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['show']>>>
    }
  }
  'kategoris.store': {
    methods: ["POST"]
    pattern: '/api/kategoris'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/kategori').createKategoriValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/kategori').createKategoriValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'kategoris.update': {
    methods: ["PUT"]
    pattern: '/api/kategoris/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/kategori').updateKategoriValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/kategori').updateKategoriValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'kategoris.destroy': {
    methods: ["DELETE"]
    pattern: '/api/kategoris/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/kategoris_controller').default['destroy']>>>
    }
  }
  'menus.store': {
    methods: ["POST"]
    pattern: '/api/menus'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/menu').createMenuValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/menu').createMenuValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'menus.update': {
    methods: ["PUT"]
    pattern: '/api/menus/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/menu').updateMenuValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/menu').updateMenuValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'menus.destroy': {
    methods: ["DELETE"]
    pattern: '/api/menus/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/menus_controller').default['destroy']>>>
    }
  }
  'pelanggans.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/pelanggans'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['index']>>>
    }
  }
  'pelanggans.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/pelanggans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['show']>>>
    }
  }
  'pelanggans.store': {
    methods: ["POST"]
    pattern: '/api/pelanggans'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pelanggan').createPelangganValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pelanggan').createPelangganValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'pelanggans.update': {
    methods: ["PUT"]
    pattern: '/api/pelanggans/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pelanggan').updatePelangganValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/pelanggan').updatePelangganValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'pelanggans.destroy': {
    methods: ["DELETE"]
    pattern: '/api/pelanggans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pelanggans_controller').default['destroy']>>>
    }
  }
  'pesanans.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/pesanans'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pesanans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pesanans_controller').default['index']>>>
    }
  }
  'pesanans.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/pesanans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pesanans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pesanans_controller').default['show']>>>
    }
  }
  'pesanans.store': {
    methods: ["POST"]
    pattern: '/api/pesanans'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pesanan').createPesananValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pesanan').createPesananValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pesanans_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pesanans_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'detail_pesanans.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/pesanans/:id/details'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/detail_pesanans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/detail_pesanans_controller').default['index']>>>
    }
  }
  'detail_pesanans.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/detail-pesanans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/detail_pesanans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/detail_pesanans_controller').default['show']>>>
    }
  }
  'pembayarans.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/pembayarans'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pembayarans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pembayarans_controller').default['index']>>>
    }
  }
  'pembayarans.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/pembayarans/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pembayarans_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pembayarans_controller').default['show']>>>
    }
  }
  'pembayarans.store': {
    methods: ["POST"]
    pattern: '/api/pembayarans'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/pembayaran').createPembayaranValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/pembayaran').createPembayaranValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/pembayarans_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/pembayarans_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'billings.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/billings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/billings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/billings_controller').default['index']>>>
    }
  }
  'billings.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/billings/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/billings_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/billings_controller').default['show']>>>
    }
  }
  'billings.store': {
    methods: ["POST"]
    pattern: '/api/pesanans/:id/billing'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/billings_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/billings_controller').default['store']>>>
    }
  }
  'laporan_penjualans.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/laporan-penjualan'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/laporan_penjualan').laporanPenjualanValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/laporan_penjualans_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/laporan_penjualans_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/admin/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
}
