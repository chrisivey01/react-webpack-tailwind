import axios from 'axios';
import { useState, useEffect } from 'react';

export const useFetch = (url: string, params: {}) => {
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        const response = await axios(url);
        setData(response.data);
    };

    useEffect(() => { fetchData(); }, [url]);
    return data;
};