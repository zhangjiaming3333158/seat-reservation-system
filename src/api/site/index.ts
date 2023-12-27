import { request } from '@/utils/service'

export function getSiteApi(page: number) {
  return request({
    url: `site?page=1`,
    method: 'get',
  })
}

export function addSiteApi(data: any) {
  return request({
    url: `site`,
    method: 'post',
    data: {
      beginSite: data.beginSite,
      endSite: data.endSite,
      distance: data.distance,
    },
  })
}

export function deleteSiteApi(data: any) {
  return request({
    url: `site`,
    method: 'delete',
    data: {
      beginSite: data.beginSite,
      endSite: data.endSite,
    },
  })
}

export function updateSiteApi(data: any) {
  return request({
    url: `site`,
    method: 'put',
    data: {
      id: data.id,
      beginSite: data.beginSite,
      endSite: data.endSite,
      distance: data.distance,
    },
  })
}

export function getGraphSites(){
  return request({
    url: `site/graphSites`,
    method: 'get',
  })
}