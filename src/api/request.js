import http from "./axios.js";

export default async (url, params = {}, method = "POST") => {
    method = method.toUpperCase();
    if (method === "GET" || method === "DELETE") {
        const res = await http.request({
            url,
            params,
            method
        });
        return res;
    }
    if (method === "POST" || method === "PUT") {
        const mode = method.toLowerCase()
        const res = await http[mode](url, params);
        return res;
    }
};
