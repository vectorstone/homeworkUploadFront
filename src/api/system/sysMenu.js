import request from '@/utils/request'

const api_name = '/admin/system/sysMenu'

export default {
  // 获取所有的菜单的list
  getSysMenuList() {
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  },
  // 根据id查询菜单
  getById(id){
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  // 增加菜单
  save(sysMenu) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: sysMenu
    })
  },
  // 修改菜单
  updateById(sysMenu) {
    return request({
      url: `${api_name}`,
      method: 'put',
      data: sysMenu
    })
  },
  // 根据id删除菜单
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },

  //获取角色的菜单
  toAssign(roleId){
    return request({
      url: `${api_name}/toAssign/${roleId}`,
      method: 'get'
    })
  },

  //给角色分配菜单
  doAssign(assignMenuVo){
    return request({
      url: `${api_name}/doAssign`,
      method: 'post',
      data: assignMenuVo
    })
  }

}
