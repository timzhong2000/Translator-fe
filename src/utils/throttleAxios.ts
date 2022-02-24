import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import throttle from "lodash/throttle"

const _throttleGet = throttle(axios.get, 500)
const _throttlePost = throttle(axios.post, 500)

export async function throttleGet<T = any>(url: string, config?: AxiosRequestConfig | undefined) {
  const res = (await _throttleGet(url, config)) as AxiosResponse<T, any>
  if(!res) throw new Error("Get error") 
  return res.data
}

export async function throttlePost<T = any, D = any>(url: string, data?: D | undefined, config?: AxiosRequestConfig<D> | undefined) {
  const res = (await _throttlePost(url, data, config)) as AxiosResponse<T, any>
  if(!res) throw new Error("Post error") 
  return res.data
}
