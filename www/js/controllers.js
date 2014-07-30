angular.module('starter.controllers', [])

    .run(function() {
        AV.initialize("f5wmdtl2fddnc3lxt47z711s41nn0c3yf7apn7expohj0jt4", "i7hm22xnbomq8lerumege2zf1sb88a4bedciyi4a7gygday8");
    })
    .factory('loading', function($ionicLoading){
        return {
            show : function (msg, duration) {
                $ionicLoading.show({
                    duration:duration || null,
                    template: msg || 'Loading...'
                });
                return this;
            },
            hide : function () {
                $ionicLoading.hide();
                return this;
            }
        }
    })
.controller('DashCtrl', function($scope, AdvService, $ionicSlideBoxDelegate) {
        var refresh = function () {
            var cacheAdvs = JSON.parse(localStorage.getItem('cacheAdvs'));
            $scope.advs = cacheAdvs || AdvService.query().$promise.then(
                function (result) {

                    if(!cacheAdvs){
                        $scope.advs = result;
                        localStorage.setItem('cacheAdvs', JSON.stringify(result));
                    } else {
                        $scope.advs = cacheAdvs;
                    }
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicSlideBoxDelegate.update();
                },
                function () {
                    $scope.$broadcast('scroll.refreshComplete');
                }
            );
        };
        refresh();
        $scope.doRefresh = function () {
            localStorage.removeItem('cacheAdvs');
            refresh()
        }
})

.controller('CatesCtrl', function($scope, loading) {
        var failCallback = function () {
            $scope.$broadcast('scroll.refreshComplete');
            loading.show('网络连接错误', 800);
        }
        var AVObject = AV.Object.extend('cate');
        var AVCollection = AV.Collection.extend({
            model: AVObject
        });
        var collection = new AVCollection();
        var refresh = function () {
            if(localStorage.getItem('cacheCates') != null) {
                $scope.cates = JSON.parse(localStorage.getItem('cacheCates'));
                return;
            }
            collection.fetch().then(
                function(collection) {
                    $scope.$apply(function(){
                        collection.map(function (model) {
                            var image = model.get('image');
                            return model.set('thumbnailURL', image.thumbnailURL(100,100));
                        });
                        localStorage.setItem('cacheCates', JSON.stringify(collection.toJSON()));
                        $scope.cates = collection.toJSON();
                        $scope.$broadcast('scroll.refreshComplete');
                    })
                },failCallback);
        };
        $scope.doRefresh = function () {
            localStorage.removeItem('cacheCates');
            refresh();
        };
        refresh();
})

.controller('ProductsCtrl', function($scope, $stateParams, ProductService, loading) {
        var refresh = function () {
            ProductService.query({where:{"cate":{"__type":"Pointer","className":"cate","objectId":$stateParams.productId}}}).$promise.then(
                function (result) {
                    var len = result.length,
                        itemTempArr = [],
                        resultArr = [];
                    for(var i= 0; i<len; i++){
                        itemTempArr.push(result[i]);
                        if((i+1)%2 == 0){
                            resultArr.push(itemTempArr);
                            itemTempArr = [];
                        }
                        if((i+1) == len){
                            resultArr.push(itemTempArr);
                        }
                    }
                    $scope.products = resultArr;
                    $scope.$broadcast('scroll.refreshComplete');
                },
                function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    loading.show('网络连接错误', 800);
                }
            );
        };
        $scope.doRefresh = function () {
            refresh();
        };
        refresh();
})

.controller('ProductDetailCtrl', function($scope, $stateParams, ProductService, $ionicModal, loading) {
        var refresh = function () {
            ProductService.get(null, {id:$stateParams.productId}).$promise.then(
                function (result) {
                    $scope.product = result;
                    $scope.$broadcast('scroll.refreshComplete');
                },
                function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    loading.show('网络连接错误', 800);
                }
            )
        }
        $ionicModal.fromTemplateUrl('templates/image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
                $scope.modal = modal;
            });

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        $scope.showImage = function(imageUrl) {
            $scope.imageSrc = imageUrl;
            $scope.openModal();
        };

        $scope.doRefresh = function () {
            refresh();
        };
        refresh();
})

.controller('AccountCtrl', function($scope) {
});
