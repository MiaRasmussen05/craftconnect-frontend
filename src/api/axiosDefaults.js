import axios from "axios";

axios.defaults.baseURL = "https://drf-api-crafthub-d1d89ee1951b.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;