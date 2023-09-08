import request from '@/utils/request'

const api_name = '/admin/system/sysUser'

export default {
  //根据用户的userId查询对应的作业的url的集合
  queryImagesByUserId(id){
    return request({
      url: `${api_name}/images/${id}`,
      method: 'get'
    })
  },
  // 获取用户分页后的list
  getPageList(page, limit, searchObj) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  // 根据id查询用户
  getSysUserById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  // 新增用户
  // 这个地方注意下, 测试下如果传过去的对象和后端接收的对象的名字不一样会不会出什么问题
  addUser(User) {
    return request({
      url: `${api_name}`,
      method: 'post',
      params: User
    })
  },
  // 修改用户1 data传参
  editUser(sysUser){
    return request({
      url: `${api_name}`,
      method: 'put',
      data: sysUser
    })
  },
  // 修改用户2 params传参
  /*  editUser1(sysUser){
    return request({
      url: `${api_name}/test`,
      method: 'put',
      params: sysUser
    })
  },  */

  // 这种方式是可以的
  editUser1(sysUser){
    return request({
      url: `${api_name}/test`,
      method: 'put',
      params: {
        id: sysUser.id,
        name: sysUser.name,
        username: sysUser.username,
        phone: sysUser.phone
      }
    })
  },

  /*
     // 这种方式测试不可以
    editUser1(sysUser){
    return request({
      url: `${api_name}/test`,
      method: 'put',
      params: { sysUser }
    })
  },  */

  // 根据id移除用户
  removeById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  // 批量移除用户
  removeBatch(idList) {
    return request({
      url: `${api_name}/remove`,
      method: 'delete',
      data: idList
    })
  }

}
