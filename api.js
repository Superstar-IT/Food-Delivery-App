import axios from "axios";
import Intl from "intl";
import "intl/locale-data/jsonp/en";
import { AsyncStorage, Alert, Platform } from "react-native";
import moment from "moment";
// const BASE_URL = "http://192.168.2.56:9090/api";
const BASE_URL = "http://52.60.103.129/api";

const api = axios.create({
  baseURL: BASE_URL
});

if (Platform.OS === "android") {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof Intl.__disableRegExpRestore === "function") {
    Intl.__disableRegExpRestore();
  }
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

api.interceptors.request.use(async config => {
  if (!config.headers.Authorization) {
    config.baseURL = BASE_URL;
    const token = await AsyncStorage.getItem("token").catch(() =>
      Alert.alert("123")
    );
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Time = moment(Date.now()).format("L");
      config.headers.timestamp = Date.now();
      // config.headers.timezone = "America/Toronto";
      // config.headers["accept-encoding"] = "gzip"
      config.headers.timezone = timezone;
    }
  }
  return config;
});

export default api;

export const getResurants = function () {
  return api.get("/restaurants");
};

export const getDriverOrders = function () {
  return api.get("/driver/today");
};

export const getSchools = function () {
  return api.get("/schools");
};

export const getProducts = function (id) {
  return api.get(`/products/${id}`);
};

export const getOrders = function () {
  return api.get("/v2/orders");
};

export const getRecipesCategory = function () {
  return api.get("/category");
};

export const getRecipesAll = function () {
  return api.get("/recipes");
};

export const getRecipesById = function (id) {
  return api.get(`/recipes/${id}`);
};

export const getProductsAll = function () {
  return api.get("/productslist");
};
