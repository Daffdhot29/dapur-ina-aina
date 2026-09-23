import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'kategoris.index': { paramsTuple?: []; params?: {} }
    'kategoris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menus.index': { paramsTuple?: []; params?: {} }
    'menus.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'kategoris.store': { paramsTuple?: []; params?: {} }
    'kategoris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'kategoris.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menus.store': { paramsTuple?: []; params?: {} }
    'menus.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menus.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pelanggans.index': { paramsTuple?: []; params?: {} }
    'pelanggans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pelanggans.store': { paramsTuple?: []; params?: {} }
    'pelanggans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pelanggans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pesanans.index': { paramsTuple?: []; params?: {} }
    'pesanans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pesanans.store': { paramsTuple?: []; params?: {} }
    'detail_pesanans.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'detail_pesanans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pembayarans.index': { paramsTuple?: []; params?: {} }
    'pembayarans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pembayarans.store': { paramsTuple?: []; params?: {} }
    'billings.index': { paramsTuple?: []; params?: {} }
    'billings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'billings.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'laporan_penjualans.export_pdf': { paramsTuple?: []; params?: {} }
    'laporan_penjualans.index': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'kasir.dashboard': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'kategoris.index': { paramsTuple?: []; params?: {} }
    'kategoris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menus.index': { paramsTuple?: []; params?: {} }
    'menus.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pelanggans.index': { paramsTuple?: []; params?: {} }
    'pelanggans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pesanans.index': { paramsTuple?: []; params?: {} }
    'pesanans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'detail_pesanans.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'detail_pesanans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pembayarans.index': { paramsTuple?: []; params?: {} }
    'pembayarans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'billings.index': { paramsTuple?: []; params?: {} }
    'billings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'laporan_penjualans.export_pdf': { paramsTuple?: []; params?: {} }
    'laporan_penjualans.index': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'kasir.dashboard': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'kategoris.index': { paramsTuple?: []; params?: {} }
    'kategoris.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menus.index': { paramsTuple?: []; params?: {} }
    'menus.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pelanggans.index': { paramsTuple?: []; params?: {} }
    'pelanggans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pesanans.index': { paramsTuple?: []; params?: {} }
    'pesanans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'detail_pesanans.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'detail_pesanans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pembayarans.index': { paramsTuple?: []; params?: {} }
    'pembayarans.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'billings.index': { paramsTuple?: []; params?: {} }
    'billings.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'laporan_penjualans.export_pdf': { paramsTuple?: []; params?: {} }
    'laporan_penjualans.index': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'kasir.dashboard': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'kategoris.store': { paramsTuple?: []; params?: {} }
    'menus.store': { paramsTuple?: []; params?: {} }
    'pelanggans.store': { paramsTuple?: []; params?: {} }
    'pesanans.store': { paramsTuple?: []; params?: {} }
    'pembayarans.store': { paramsTuple?: []; params?: {} }
    'billings.store': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'kategoris.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menus.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pelanggans.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'kategoris.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'menus.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'pelanggans.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}