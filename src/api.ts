import axios, { AxiosInstance, AxiosResponse } from 'axios';

const token: string = "iiZ169gh09JHR95yfFIwitdcihL3jaSSo5Squ274";
const root_url: string = "https://opendata.resas-portal.go.jp";

const apiClient: AxiosInstance = axios.create({
    baseURL: root_url,
    headers: {
        "Content-type": "application/json",
        "X-API-KEY": token
    },
});

class ResasDataService {
    getPrefecture(): Promise<AxiosResponse> {
        const api = "/api/v1/prefectures";
        return apiClient.get(api);
    }
    getPolulation(code): Promise<AxiosResponse> {
        const api = "/api/v1/population/composition/perYear";
        const data = { prefCode: code, cityCode: '-' };
        return apiClient.get(api, {params: data} );
    }
}

export default new ResasDataService();