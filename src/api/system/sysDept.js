import request from '@/utils/request'
const api_name = '/admin/system/sysDept'

export default {
  // 获取所有的部门信息
  findNodes() {
    return request({
      url: `${api_name}`,
      method: 'get'
    })
  },
  //增加部门
  save(sysDept) {
    return request({
      url: `${api_name}`,
      method: 'post',
      data: sysDept
    })
  },
  //修改部门
  edit(sysDept) {
    return request({
      url: `${api_name}`,
      method: 'put',
      data: sysDept
    })
  },
  //根据id删除部门
  remove(id){
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }
}
