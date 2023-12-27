import { request } from '@/utils/service'

export function getTrainApi() {
  return request({
    url: `train?isBegin=true`,
    method: 'get',
  })
}

export function getTrainListApi(
  beginSite: string[],
  endSite: string[],
  date: string,
) {
  return request({
    url: `train/direct?beginSite=${beginSite}&endSite=${endSite}&date=${date}`,
    method: 'get',
  })
}

export function getTrainIndirectListApi(
  beginSite: string[],
  endSite: string[],
  date: string,
) {
  return request({
    url: `train/indirect?beginSite=${beginSite}&endSite=${endSite}&date=${date}&leastMoney=true`,
    method: 'get',
  })
}

export function addTrainApi(data: any) {
  return request({
    url: 'train',
    method: 'post',
    data,
  })
}
