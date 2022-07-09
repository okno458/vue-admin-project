//平台属性管理模块的请求文件
import request from '@/utils/request';
//获取一级分类数据
export const reqCartgory1List = () => request({ url: '/admin/product/getCategory1', method: 'GET' });
//获取二级分类数据
export const reqCartgory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'GET' });
//获取三级分类数据
export const reqCartgory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'GET' });
//获取平台属性
export const reqAttrList = (category1Id,category2Id,category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'GET' });
//添加属性与属性值
export const reqAddOrUpdateAttr = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'POST' ,data});

