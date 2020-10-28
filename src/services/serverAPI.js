import axios from "axios";

export const serverAPI = (method, URL, data) => {
    return new Promise((resolve, reject) => {
        return axios [method.toLowerCase()](URL, data)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error))
    })
}