import axios from "./axios.js";

export default async (url, params = {}, method = "POST") => {
    method = method.toUpperCase();
    if (method === "GET" || method === "DELETE") {
        const res = await axios.request({
            url,
            params,
            method
        });
        return res.result;
    }
    if (method === "POST" || method === "PUT") {
        const mode = method.toLowerCase()
        const res = await axios[mode](url, params);
        return res.result;
    }
};
