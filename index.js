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
      controller: "LopHocController",
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

app.controller("LopHocController", function ($scope, $http) {
  $scope.viTriUpdate = -1;
  $scope.request = {
    tenLop: "",
    maLop: "",
    soLuongSV: 0,
    id: "",
  };
  let url = "http://localhost:8080/api/lop-hoc";
  let api = url + "/hien-thi";
  $scope.lops = [];
  hienThiData();
  // GET => Hien Thi Table
  function hienThiData() {
    $http.get(api).then(function (response) {
      $scope.lops = response.data;
    }),
      function (errors) {
        console.log(errors);
      };
  }

  $scope.themSinhVien = function (event) {
    event.preventDefault();
    let api = url + "/add";
    $http.post(api, JSON.stringify($scope.request)).then(function () {
      alert("Add thanh cong");
      hienThiData();
    }),
      function (errors) {
        console.log(errors);
      };
  };
  $scope.suaSinhVien = function (event) {
    event.preventDefault();
    if ($scope.viTriUpdate === -1) {
      alert("Vui long chon dong muon update");
    } else {
      let sv = $scope.lops[$scope.viTriUpdate];
      let api = url + "/update/" + sv.id;
      $http.put(api, JSON.stringify($scope.request)).then(function () {
        alert("Update  thanh cong");
        hienThiData();
      }),
        function (errors) {
          console.log(errors);
        };
    }
  };
  $scope.detailSinhVien = function (event, index) {
    event.preventDefault();
    let sv = $scope.lops[index];
    $scope.request.id = sv.id;
    $scope.request.maLop = sv.maLop;
    $scope.request.tenLop = sv.tenLop;
    $scope.request.soLuongSV = sv.soLuongSV;
    $scope.viTriUpdate = index;
  };
  $scope.deleteSinhVien = function (event, index) {
    event.preventDefault();
    let sv = $scope.lops[index];
    let api = url + "/xoa/" + sv.id;
    $http.delete(api).then(function () {
      hienThiData();
      alert("Xoa thanh cong");
    }),
      function (errors) {
        console.log(errors);
      };
  };
});
