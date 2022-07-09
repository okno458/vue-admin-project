import request from '@/utils/request'; //引入二次封装的axios
//获取spu列表数据的接口
export const reqSpuList = (page,limit,category3Id) => request({url: `/admin/product/${page}/${limit}`,method: 'GET',params:{category3Id}});
//获取spu详细信息的接口
export const reqSpu = (spuId) => request({url: `/admin/product/getSpuById/${spuId}`,method: 'GET'});
//获取spu品牌的信息
export const reqTradeMarkList = () => request({url: `/admin/product/baseTrademark/getTrademarkList`,method: 'GET'});
//获取spu图片的接口
export const reqSpuImageList= (spuId) => request({url: `/admin/product/spuImageList/${spuId}`, method: 'GET'});
//获取spu平台全部销售属性
export const reqBaseSaleAttrList = () => request({url: `/admin/product/baseSaleAttrList`, method: 'GET'});
//修改或添加spu 对于修改或者是添加，携带的参数大致相同那个，唯一的区别就是携带的参数是否有id
export const reqAddOrUpdateSpu = (spuInfo) => {
    if(spuInfo.id){
        //如果携带的参数有id，则是修改
        return request({url: `/admin/product/updateSpuInfo`, method: 'POST',data:spuInfo})
    }else{
        //如果携带的参数无id，则是添加
        return request({url: `/admin/product/saveSpuInfo`, method: 'POST',data:spuInfo})
    }
}
//删除spu的接口
export const reqDeleteSpu = (spuId) => request({url: `/admin/product/deleteSpu/${spuId}`, method: 'DELETE'});
//获取图片的数据
export const reqSpuImageLIst = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}` , method: 'GET'});
//获取销售属性的数据
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}` , method: 'GET'});
//获取平台属性的数据
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}` , method: 'GET'});
//添加sku的接口
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'POST',data: skuInfo})
//获取sku数据的接口
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'GET'})
