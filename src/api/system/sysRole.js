/*
角色管理相关的API请求函数
*/
import request from '@/utils/request'

const api_name = '/admin/system/sysRole'

// 查询用户
export default {

  /*
  获取角色分页列表(带搜索)
  */
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },

  // 删除用户
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },

  // 修改用户
  updateById(sysRole) {
    console.log('-----------------updateById方法1');
    return request({
      url: `${api_name}`,
      method: 'put',
      data: sysRole
    })
  },

  updateById1(sysRole) {
    console.log('-----------------updateById方法1')
    return request({
      url: `${api_name}/test`,
      method: 'put',
      params: sysRole
    })
  },

  // 添加用户
  save(role) {
    return request({
      url: `${api_name}`,
      method: 'post',
      params: role
    })
  },
  // 数据回显
  getById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },

  // 批量删除
  batchRemove(idList) {
    return request({
      url: `${api_name}/remove`,
      method: 'delete',
      data: idList
    })
  },

  // 查询用户角色(当前用户角色和所有角色)
  getAssign(userId) {
    return request({
      url: `${api_name}/toAssign/${userId}`,
      method: 'get'
    })
  },

  // 更新用户的角色
  doAssign(assignRoleVo) {
    return request({
      url: `${api_name}/doAssign`,
      method: 'put',
      data: assignRoleVo
    })
  }

}

