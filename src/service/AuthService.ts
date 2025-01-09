import { storageKeys } from "@/config/storageKeys";
import { api } from "./utils/httpClient";

// interface ISignUpDTO {
//   email: string;
//   password: string
//   name: string;
// }

interface ISignInDTO {
  username: string;
  password: string
}

interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface ISignInResponse {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export class AuthService {
  // static async signup({ email, password, name }: ISignUpDTO) {
  //   const { data } = await api.post('/signup', {
  //     name, email, password
  //   });

  //   return data;
  // }

  static async signIn({ username, password }: ISignInDTO) {
    console.log('aqui', username)
    const { data } = await api.post<ISignInResponse>('/sign-in', {
      username, password
    });

    return data;
  }

  static async refreshToken(refreshToken: string) {
    const { data } = await api.post<ISignInResponse>('/refresh-token', {
      refreshToken
    });

    return data;
  }

  static async getUserInfos() {
    const { data } = await api.get('/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(storageKeys.accessToken)}`
      }
    });

    return data;
  }
}
