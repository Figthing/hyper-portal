/**
 * 获取上一次路由
 * @param {[type]} url [description]
 */
export function GetUrlRelativePath(url) {
  var arrUrl = url.split('//')

  var start = arrUrl[1].indexOf('/')
  var relUrl = arrUrl[1].substring(start)

  if (relUrl.indexOf('?') !== -1) {
    relUrl = relUrl.split('?')[0]
  }
  return relUrl
}

/**
 * 日期转换
 * <pre>
 * 	2018-05-19T08:04:52.000+0000 转换为 
 * </pre>
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
export function formatDate(date) {
	return new Date(+new Date(date)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')
}