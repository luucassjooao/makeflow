import { Spinner } from '@/components/Spinner';
import { storageKeys } from '@/config/storageKeys';
import { AuthService, ISignInResponse } from '@/service/AuthService';
import { api } from '@/service/utils/httpClient';
import React, { createContext, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'sonner';

interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface IAuthContextValue {
  signedIn: boolean;
  user: IUser | null;
  signIn(username: string, password: string): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext({} as IAuthContextValue);

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [signedIn, setSignedIn] = useState(() => {
    return !!localStorage.getItem(storageKeys.accessToken);
  });
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoadingGetUser, setIsLoadingGetUser] = useState(true);

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem(storageKeys.accessToken);

        if (accessToken) {
          config.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return config;
      }
    );

    return () => {
      api.interceptors.request.eject(interceptorId);
    };
  }, []);

  useLayoutEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem(storageKeys.refreshToken);

        if (originalRequest.url === '/refresh-token') {
          setSignedIn(false);
          localStorage.clear();  
          return Promise.reject(error);
        }

        if (
          (error.response && error.response.status !== 401) ||
          !refreshToken
        ) {
          return Promise.reject(error);
        }

        const {accessToken, refreshToken: newRefreshToken} = await AuthService.refreshToken(refreshToken);

        localStorage.setItem(storageKeys.accessToken, accessToken);
        localStorage.setItem(storageKeys.refreshToken, newRefreshToken);

        return api(originalRequest);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);
  
  const signIn = useCallback(async (username: string, password: string) => {
    const { data } = useQuery({
      queryKey: ['signIn'], 
      queryFn: async () => await AuthService.signIn({ username, password }),
      cacheTime: 600
    });
    if(!data) {
      throw new Error();
    }

    setUser(data?.user);
    setSignedIn(true);

    localStorage.setItem(storageKeys.accessToken, data.accessToken);
    localStorage.setItem(storageKeys.refreshToken, data.refreshToken);
  }, []);

  const signOut = useCallback(() => {
    localStorage.clear();
    setSignedIn(false);
    setUser(null);
  }, []);

  const loadUserInfos = useCallback(async () => {
    setIsLoadingGetUser(true);
    try {
      const data = await AuthService.getUserInfos();
      setUser(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingGetUser(false);
    }
  }, [])

  useEffect(() => {
    loadUserInfos()
  }, [])

  const value: IAuthContextValue = {
    signedIn,
    user,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value} >
      {isLoadingGetUser && <Spinner />}
      {children}
    </AuthContext.Provider>
  );
}
