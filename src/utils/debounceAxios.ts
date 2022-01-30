import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { debounce } from "lodash"

const _debounceGet = debounce(axios.get, 200)
const _debouncePost = debounce(axios.post, 200)

export async function debounceGet<T = any>(url: string, config?: AxiosRequestConfig | undefined) {
  const res = (await _debounceGet(url, config)) as AxiosResponse<T, any>
  if(!res) throw new Error("Get error") 
  return res.data
}

export async function debouncePost<T = any, D = any>(url: string, data?: D | undefined, config?: AxiosRequestConfig<D> | undefined) {
  const res = (await _debouncePost(url, data, config)) as AxiosResponse<T, any>
  if(!res) throw new Error("Post error") 
  return res.data
}
