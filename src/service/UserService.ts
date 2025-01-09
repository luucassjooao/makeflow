import { api } from "./utils/httpClient";

interface IAddNewUserDTO {
    username: string;
    email: string;
    roleId: string;
}

export class UserService {
  static async addNewUser({ username, email, roleId }: IAddNewUserDTO) {
    console.log('aqui', username)
    const { data } = await api.post('/add', {
      username, email, roleId
    });

    return data;
  }
}