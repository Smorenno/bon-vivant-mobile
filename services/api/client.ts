import axios from 'axios';
import { supabase } from '@/services/supabase';
import { t } from '@/constants/i18n';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        return Promise.reject(new Error(t('common.errorNetwork')));
      }
      const { status } = error.response;
      if (status === 401) return Promise.reject(new Error(t('common.errorUnauthorized')));
      if (status === 403) return Promise.reject(new Error(t('common.errorForbidden')));
      if (status === 404) return Promise.reject(new Error(t('common.errorNotFound')));
    }
    return Promise.reject(new Error(t('common.error')));
  },
);
