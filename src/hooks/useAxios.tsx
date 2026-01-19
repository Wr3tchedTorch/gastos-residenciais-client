import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

axios.defaults.baseURL = 'https://localhost:7145/api';

interface UseAxiosProps {
    url:      string,
    method:   'get' | 'post' | 'put' | 'delete',
    body?:    string | null,
    headers?: string | null
    manual?:  boolean  | null
}

const useAxios = <T,>({ url, method, body = null, headers = null, manual = false }: UseAxiosProps) => {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError]       = useState<string>('');
    const [loading, setLoading]   = useState<boolean>(true);
    
    const fetchData = useCallback(async (params: URLSearchParams | null = null, manualBody: string | null = null) => {
        setLoading(true);
        setError('');

        let requestBody = body == null ? manualBody : body;

        try {
            const config: AxiosRequestConfig = {
                url: url,
                params,
                method,
                data: requestBody ? JSON.parse(requestBody) : null,
                headers: headers ? JSON.parse(headers) : {},
            };

            const res: AxiosResponse<T> = await axios(config);
            setResponse(res.data);
            return res;
        } catch (err) {
            const axiosError = err as AxiosError;
            setError(axiosError.message);
            throw axiosError;
        } finally {
            setLoading(false);
        }
    }, [url, method, body, headers]);
    
    useEffect(() => {
        if (!manual)
        {
            fetchData();
        }
    }, [manual, fetchData]);

    return { response, error, loading, fetchData };
};

export default useAxios;