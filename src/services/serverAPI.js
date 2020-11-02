import axios from "axios";

// const remoteURL = "https://aqueous-atoll-68745.herokuapp.com/";
const localURL = "http://localhost:80/companydirectory/libs/php/";

export const serverAPI = (method, path, data) => {
    const URL = localURL + path;
    return new Promise((resolve, reject) => {
        return axios[method.toLowerCase()](URL, data)
            .then((response) => resolve(response.data))
            .catch((error) => reject(error))
    })
}