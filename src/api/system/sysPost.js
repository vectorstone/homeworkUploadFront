import request from '@/utils/request'

const api_name = '/admin/system/sysPost'

export default {
    getSysPostList(page,limit,searchObj){
        return request({
            url: `${api_name}/${page}/${limit}`,
            method: 'get',
            params: searchObj
        })
    },
    //增加岗位
    add(sysPost){
        return request({
            url: `${api_name}`,
            method: 'post',
            data: sysPost
        })
    },

    //修改岗位
    edit(sysPost){
        return request({
            url: `${api_name}`,
            method: 'put',
            data: sysPost
        })
    },
    //删除岗位
    remove(id){
        return request({
            url: `${api_name}/${id}`,
            method: 'delete',
        })
    },
}