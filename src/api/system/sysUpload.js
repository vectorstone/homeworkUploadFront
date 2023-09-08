import request from '@/utils/request'
const api_name = '/admin/dict'

export default {
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
