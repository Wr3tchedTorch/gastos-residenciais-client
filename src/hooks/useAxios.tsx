import { useState, useEffect } from 'react';
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

axios.defaults.baseURL = 'https://localhost:7145/api';

interface UseAxiosProps {
    url:      string,
    method:   'get' | 'post' | 'put' | 'delete',
    body?:    string | null,
    headers?: string | null
}

const useAxios = <T,>({ url, method, body = null, headers = null }: UseAxiosProps) => {
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError]       = useState<string>('');
    const [loading, setLoading]   = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config: AxiosRequestConfig = {
                    url,
                    method,
                    data: body ? JSON.parse(body) : null,
                    headers: headers ? JSON.parse(headers) : {},
                };

                const res: AxiosResponse<T> = await axios(config);
                setResponse(res.data);
            } catch (err) {
                const axiosError = err as AxiosError;

                setError(axiosError.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, method, body, headers]);

    return { response, error, loading };
};

export default useAxios;