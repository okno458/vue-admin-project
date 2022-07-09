//品牌管理数据的模块
import request from '@/utils/request'; //引入二次封装的axios
//获取品牌列表
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'GET' });
//新增品牌和修改品牌
//对于新增的品牌，不需要给后台传递id，因为id是由服务器生成的
//传递两个参数：品牌的名称和品牌的logo
//对于修改品牌，需要向后台传递id，后台需要知道更改的是哪一条数据
//需传递三个参数：id,品牌名称，品牌logo
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //如果带给服务器的参数中含有id说明是修改
    if (tradeMark.id) {
       return request({ url: `/admin/product/baseTrademark/update`, method: 'PUT' ,data:tradeMark});
    }else{
        //新增品牌
       return request({ url: `/admin/product/baseTrademark/save`, method: 'POST' ,data:tradeMark});
    }
}
//删除品牌
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'DELETE' });
