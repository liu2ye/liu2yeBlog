import router from '@/router'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
/**
 * @typedef {{
 *    code: number,
 *    msg: string,
 *    data: any,
 *    page: {
 *      pageNo: number,
 *      pageSize: number,
 *      total: number,
 *    },
 *    other: any,
 * }} RespResult
 */

export const baseURL = import.meta.env.VITE_SERVER_URL // 后端地址

// 创建一个 axios 实例
export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 9000, // 超时
  headers: {
    // 设置后端需要的传参类型
    'Content-Type': 'application/json',
    token: window.localStorage.getItem('token'),
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    const data = response.data

    const tipInfo = {
      message: '',
      type: ''
    }
    switch (data.code) {
      case 200:
        return data
      case 500:
        tipInfo.message = data.msg
        tipInfo.type = 'error'
        break
      case 401:
        tipInfo.message = '请先登录'
        tipInfo.type = 'warning'
        break
      case 403:
        tipInfo.message = '无权限'
        tipInfo.type = 'warning'
        break
      case 404:
        tipInfo.message = '资源未找到'
        tipInfo.type = 'error'
        break
      default:
        return data
    }

    ElMessage(tipInfo)
    if (data.code == 401) {
      router.push('/login')
    }
    return data
  },
  function (error) {
    ElMessage({
      message: '请求出错，请稍后再试',
      type: 'error'
    })
    return Promise.reject(error)
  }
)

const request = {
  /**
   * 通用GET请求
   * @param {string} url 请求接口路径
   * @param {object} params 请求参数封装对象，会转换为标准查询参数
   * @returns {Promise<RespResult>}
   */
  get(url, params) {
    let queryParmas = ''
    if (params) {
      queryParmas = Object.keys(params)
        .map((key) => key + '=' + (params[key] || params[key] !== 0 ? params[key] : ''))
        .join('&')
    }

    // 如果url中包含?号则拼接参数的符号为&
    const joinChar = url.indexOf('?') >= 0 ? '&' : '?'
    return axiosInstance.get(url + joinChar + encodeURI(queryParmas))
  },
  /**
   * 通用POST请求
   * @param {string} url 请求接口路径
   * @param {object} data post携带的数据
   * @returns {Promise<RespResult>}
   */
  post(url, data) {
    return axiosInstance.post(url, data)
  },
  /**
   * 通用PUT请求
   * @param {string} url 请求接口路径
   * @param {object} data 携带的数据
   * @returns {Promise<RespResult>}
   */
  put(url, data) {
    return axiosInstance.put(url, data)
  },
  /**
   * 通用DELETE请求
   * @param {string} url 请求接口路径
   * @param {object} data 携带的数据
   * @returns {Promise<RespResult>}
   */
  delete(url, data) {
    return axiosInstance.delete(url, { data: data })
  },

  /**
   * 删除前展示确认弹窗
   * @param {string} url 请求接口路径
   * @param {object} data 携带的数据
   * @returns {Promise<RespResult>}
   */
  async confirmBeforeDelete(url, data) {
    try {
      await ElMessageBox.confirm('确定删除吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
    } catch {
      ElMessage({ type: 'info', message: '删除取消' })
      throw '删除取消'
    }
    const resp = await this.delete(url, data)
    this.showSuccessMessage(resp)
    return resp
  },

  /**
   * 工具方法，向用户展示成功信息，一般用在新增、修改或者删除操作之后
   * @param {RespResult} resp 请求的响应
   */
  showSuccessMessage(resp) {
    if (resp.code == 200) {
      ElMessage({
        type: 'success',
        message: resp.msg
      })
    }
  }
}

/**
 * 当不使用request的相关方法时, 为请求添加身份验证的header
 * @returns {object}
 */
export function getUploadHeader() {
  return {
    token: window.localStorage.getItem('token'),
    'X-Requested-With': 'XMLHttpRequest'
  }
}

/**
 * @returns {Promise<string>}
 */
export async function getMdText(fileName, prefix = '/md/', suffix = '.md') {
  const res = await axios.get(prefix + fileName + suffix)
  return res.data
}

export const imageServiceUrl = 'http://123.57.145.93:8180'

export async function uploadImage(imageFile, owner = 'public', withImageUrl = false) {
  const formData = new FormData()
  formData.append('file', imageFile)
  const imagePath = await axios.post(imageServiceUrl + `?owner=${owner}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  return withImageUrl ? getImageFullPath(imagePath) : imagePath
}

export function getImageFullPath(imagePath) {
  return imageServiceUrl + '/img/' + imagePath
}

export const staticResourceUrl = import.meta.env.VITE_STATIC_RESOURCE
export default request
