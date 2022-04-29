import { IRepository } from '@@/business/user/service'
import User from '@@/business/user/user'
import axios, { AxiosRequestConfig } from 'axios'

import UserManagement from './userData'


export default class UserRepository implements IRepository {
  userManagement = new UserManagement()

  async GetAlluser(page: number, rowPerPage: number, userID: string): Promise<Array<User>> {
    const headers = {
      'Content-Type': 'application/json',
    }
    const config : AxiosRequestConfig = {
      method: 'get',
      url: 'https://reqres.in/api/users/' + userID,
      headers,
    }
    return axios(config)
      .then((res) => {
        return res.data.data
      })
      .catch((error) => {
        console.error(error)
        return error
      })
  }

  async InsertUser(user: User): Promise<string> {
    return await this.userManagement.insertUser(user)
  }

  async UpdateUser(user: User): Promise<string> {
    return await this.userManagement.editUser(user)
  }
}