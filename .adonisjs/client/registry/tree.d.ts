/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  kategoris: {
    index: typeof routes['kategoris.index']
    show: typeof routes['kategoris.show']
    store: typeof routes['kategoris.store']
    update: typeof routes['kategoris.update']
    destroy: typeof routes['kategoris.destroy']
  }
  menus: {
    index: typeof routes['menus.index']
    show: typeof routes['menus.show']
    store: typeof routes['menus.store']
    update: typeof routes['menus.update']
    destroy: typeof routes['menus.destroy']
  }
  pelanggans: {
    index: typeof routes['pelanggans.index']
    show: typeof routes['pelanggans.show']
    store: typeof routes['pelanggans.store']
    update: typeof routes['pelanggans.update']
    destroy: typeof routes['pelanggans.destroy']
  }
  pesanans: {
    index: typeof routes['pesanans.index']
    show: typeof routes['pesanans.show']
    store: typeof routes['pesanans.store']
  }
  detailPesanans: {
    index: typeof routes['detail_pesanans.index']
    show: typeof routes['detail_pesanans.show']
  }
  pembayarans: {
    index: typeof routes['pembayarans.index']
    show: typeof routes['pembayarans.show']
    store: typeof routes['pembayarans.store']
  }
  billings: {
    index: typeof routes['billings.index']
    show: typeof routes['billings.show']
    store: typeof routes['billings.store']
  }
  laporanPenjualans: {
    exportPdf: typeof routes['laporan_penjualans.export_pdf']
    index: typeof routes['laporan_penjualans.index']
  }
  admin: {
    dashboard: typeof routes['admin.dashboard']
  }
  kasir: {
    dashboard: typeof routes['kasir.dashboard']
  }
}
