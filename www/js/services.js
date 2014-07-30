angular.module('starter.services', ['ngResource'])
    .config(function ($httpProvider) {
        $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Id'] = 'f5wmdtl2fddnc3lxt47z711s41nn0c3yf7apn7expohj0jt4';
        $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Key'] = 'i7hm22xnbomq8lerumege2zf1sb88a4bedciyi4a7gygday8';
        $httpProvider.defaults.transformResponse.unshift(function (data) {
            //判断返回值不是 json 格式
            if (!data.match("^\{(.+:.+,*){1,}\}$")){
                //普通字符串<script src="https://cn.avoscloud.com/scripts/lib/av-0.2.7.min.js"></script>处理
                return data;
            } else {
                //通过这种方法可将字符串转换为对象
                data = JSON.parse(data);
                return (data.results != undefined ? data.results : data);
            }
        });
//        AV.initialize($httpProvider.defaults.headers.common['X-AVOSCloud-Application-Id'], $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Key']);
    })
    .factory('ProductService', function($resource){
        return $resource('https://cn.avoscloud.com/1/classes/product/:id', {id : '@id'});
    })
    .factory('CateService', function($resource){
        return $resource('https://cn.avoscloud.com/1/classes/cate/:id', {id : '@id'});
    })
    .factory('AdvService', function($resource){
        return $resource('https://cn.avoscloud.com/1/classes/adv/:id', {id : '@id'});
    });