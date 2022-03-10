import { SERVICE } from './index';
import axios from "axios";
import { EAI } from '../../types/EAI';

export const httpRequestList = async (endpoint: string, params: any) => {
    try {
        const response = await axios.post<any>(SERVICE + endpoint, params);
        return response.data;
    } catch (err: any) {
        console.log('Error on ' + SERVICE + endpoint);
    }
};