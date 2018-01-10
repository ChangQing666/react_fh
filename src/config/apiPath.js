const ONLINE = process.env.NODE_ENV === 'production'
const domain = ONLINE?'//'+window.location.host+'/jycomp-api/v1/metro':'/v1/metro';
const searchDomain = ONLINE?'//'+window.location.host+'/jycomp-api/v1/search':'/v1/search';
const wx_domain = ONLINE?'//'+window.location.host+'/wxauth':'';
//接口地址
const apiPath = {
	CITYLIST: `${domain}/cityList`, //获取城市列表 POST
  // SWITCHSTATIONDETAIL: `${domain}/SwitchStationDetail`, //中转站详情-线路切换 POST
  // SWITCHSTATIONDETAIL: `${domain}/SwitchStationDetail`, //中转站详情-线路切换 POST
  // TRANSFERSTATIONDETAIL: `${domain}/transferStationDetail`, //中转站详情 POST
  // FUZZYSEARCHSTATIONS: `${domain}/transferStationDetail`,
  // TRANSFERSTATIONLIST: `${domain}/transferStationList`, //中转站列表 POST
  SEARCHCITYSTATIONSINFO: `${searchDomain}/searchByCityId/`, // 搜索城市站点信息
  SEARCHCITYLINESINFO: `${searchDomain}/searchLineByCityId/`, // 搜索城市线路信息
  SEARCHSTATIONS: `${searchDomain}/searchStationByCityIdPage/`, // 按城市搜索站点 分页
  SEARCHSTATIONS_NOGROUP: `${searchDomain}/searchStationByCityId/`, // 按城市搜索站点
  SEARCHLINES: `${searchDomain}/searchLineByCityId/`, // 按城市搜索线路 分页
  SEARCHSTATIONDETAIL: `${searchDomain}/searchStationDetail/`, // 根据城市、站点名称查询站点详细信息
  SEARCHSTATIONSINFOGROUP: `${searchDomain}/searchStationGroupByCityId/`, // 按城市搜索站点信息，分组
  RECEIVESTATIONDETAIL:`${domain}/stationDetailById/`,
	WXSHARE: `${wx_domain}/v1/wxJsShare` // 微信分享
}
export default apiPath
