import store from '@/store'
import _ from 'lodash'

// 状态图标
export const statusIconMap =  ['processing', 'default', 'warning']

/**
 * 根据Type获取字典数据
 * @param type 字典类型
 * @param fn 回调方法
 */
export function listDictItemByType(type, fn) {
    store.dispatch('dictItem/ListDictItemByType', type).then(res => {
        fn(res)
    })
}

/**
 * 根据Value获取字典Text
 * @param dictList 字典数据
 * @param val 字典Value
 */
export function getDictTextByValue(dictList, val) {
    const status = _.find(dictList, {'itemValue': val})
      
      if (status === undefined) {
        return ''
      }

      return status.itemText
}

/**
 * 根据Key获取参数值
 *  - 该方法依托于vuex的state数据
 *  - 在computed中使用该方法，保证数据
 * @param key 参数Key
 */
export function getConfigKey(key) {

    const list = store.getters['config/getList']

    if (list.length <= 0) {
        return
    }

    const itemFilter = _.filter(list, {configKey: key})

    if (itemFilter.length <= 0) {
        return
    }

    return itemFilter[0].configValue
}