import request from '@/utils/request'
const api_name = '/admin/dict'

export default {
  //查询用户的所有的图片的集合
  queryAllImages(pageNum,pageSize){
    return request({
      url: `/admin/system/image/list/${pageNum}/${pageSize}`,
      method: 'GET'
    })
  },
  //修改用户的图片的名称
  saveImages(image){
    return request({
      url: '/admin/system/sysUser/saveImage',
      method: 'PUT',
      data: image
    })
  },
  //查询最近的一次的作业的所有的图片的集合
    queryLatestImages(){
      return request({
        url: '/admin/system/image/latest',
        method: 'GET'
      })
    },
    //查询对应作业名称下的所有的图片
    queryImagesByName(name){
      return request({
        url: '/admin/system/image',
        method: 'GET',
        params: {name}
      })
    },
    //查询所有的作业的集合
    queryHomeworkName(){
      return request({
        url: '/admin/system/image/homework/name',
        method: 'GET'
      })
    },
    //根据name查询该字典对应的子字典
    getByPname(name) {
        return request({
            url: `${api_name}/getsub`,
            method: 'GET',
            params: { name }
        })
    },
    getByPid(pid) {
        return request({
            url: `${api_name}/${pid}`,
            method: 'GET'
        })
    },
    //根据id查询
    getById(id) {
        return request({
            url: `${api_name}/search/${id}`,
            method: "GET"
        })
    },
    //根据id删除
    removeById(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'DELETE'
        })
    },
    //新增
    save(dict) {
        return request({
            url: `${api_name}`,
            method: 'POST',
            data: dict
        })
    },
    //修改
    update(dict) {
        return request({
            url: `${api_name}`,
            method: 'PUT',
            data: dict
        })
    }
}
