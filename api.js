import axios from "axios";
import { AsyncStorage, Alert } from "react-native";
import moment from "moment";
// const BASE_URL = "http://192.168.1.218:9090/api";
 const BASE_URL = 'http://52.60.103.129/api'

const api = axios.create({
  baseURL: BASE_URL
});

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

api.interceptors.request.use(async config => {
  if (!config.headers.Authorization) {
    config.baseURL = BASE_URL;
    const token = await AsyncStorage.getItem("token").catch(() => Alert.alert('123'));
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
