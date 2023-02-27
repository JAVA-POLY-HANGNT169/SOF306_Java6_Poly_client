const app = angular.module("myApp", ["ngRoute"]);
app.config(($routeProvider, $locationProvider) => {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/", {
      templateUrl: "./pages/home.html",
    })
    .when("/sinh-vien", {
      templateUrl: "./pages/sinh-vien.html",
      controller: "SinhVienController",
    })
    .when("/lop", {
      templateUrl: "./pages/lop.html",
      // controller: "crudCtrl",
    })
    .otherwise({
      redirectTo: "/",
    });
});
app.controller("SinhVienController", function ($scope, $http) {
  $scope.sinhViens = [];
  $scope.pages = [];
  $scope.entryLimit = 5; // items per page
  $scope.pageNo = 1;
  const sinhVienAPI = "http://localhost:8080/api/sinh-vien";
  const hienThiSVAPI = sinhVienAPI + "/hien-thi?pageNo=" + ($scope.pageNo - 1);
  hienThiSinhVien();
  // GET => Hien Thi Sinh Vien Table
  function hienThiSinhVien() {
    $http.get(hienThiSVAPI).then((response) => {
      $scope.sinhViens = response.data.data;
      let totalElement = response.data.totalElement;
      console.log(totalElement);
      $scope.noOfPages = Math.ceil(totalElement / $scope.entryLimit);
      console.log($scope.noOfPages);
    }),
      (errors) => {
        console.log(errors);
      };
    console.log($scope.noOfPages);
    for (let i = 1; i <= 6; i++) {
      $scope.pages.push(i);
    }
  }
  $scope.pagingSV = function (event, index) {
    event.preventDefault();
    $scope.pageNo = index + 1;
  };
});
