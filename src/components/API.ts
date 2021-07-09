import axios from "axios";
import {initialConfig}  from "../config"

const instance = axios.create({
  withCredentials: false, // cors
  baseURL: initialConfig.apiUrl,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    "Token-Authorization-X": initialConfig.apiToken,
  },
});

export const orderAPI = {
  getList(terminalId: number) {
    return instance.get(`order/get_list/${terminalId}/`);
  },
  createOrder(data: {}) {
    return instance.post("order/create_order/", { data });
  },
  saveOrder(data: {}) {
    return instance.post("order/save_order/", data);
  },
  getOrder(terminalId: number, openOrderId: number) {
    return instance.get(`order/get_order/${terminalId}/${openOrderId}/`);
  },
  unlockOrder(terminalId: number, openOrderId: number) {
    return instance.get(`order/unlock_order/${terminalId}/${openOrderId}/`);
  },
};

export const addressAPI = {
  postNew(data: {}) {
    return instance.post("address/newAddress/", { data });
  },
  postUpdate(data: {}) {
    return instance.post("address/updateAddress/", { data });
  },
  getPolygon(data: {
    terminalId: number;
    geoLat: number | null;
    geoLon: number | null;
  }) {
    return instance.get(
      `address/get_polygon/${data.terminalId}/${data.geoLat}/${data.geoLon}/`
    );
  },
};

export const customerAPI = {
  checkCustomerByPhone(terminalId: number, phone: string) {
    return instance.get(
      `customer/check_customer_by_phone/${terminalId}/${phone}/`
    );
  },
};

export const initAPI = {
  init() {
    return instance.get(`init/`);
  },
};
