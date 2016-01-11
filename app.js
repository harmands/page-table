var pageTableApp = angular.module("page-table", []);
pageTableApp.filter('startFrom', function() {
	return function(input, start) {
		if(input){
			return input.slice(parseInt(start, 10));
		}
		return [];
	}
});
pageTableApp.directive("pageTable", function(filterFilter, orderByFilter){
	return{
		scope:{
			list: "=",
			search: "=",
			headers: "=",
			selfheaders: "=",
			sno: "=",
			pageRange: "=",
			clickCb: "&"
		},
		link: function(scope, elements, attribute){
			scope.filteredList = null;
			scope.currentPage = 0;
			scope.numberOfItemsPerPage = scope.pageRange?scope.pageRange[0]:9999999;
			scope.numberOfPages = 0;
			scope.orderByVariable = scope.headers[0];
			scope.orderByAsc = false;
			scope.setPageNumber = function(pageNumber){
				scope.currentPage = pageNumber-1;
			}
			scope.range = function(){
				var a = [];
				for(var i = 1; i<=scope.numberOfPages; i++)
					a.push(i);
				return a;
			};
			scope.decrementPage = function(){
				if(scope.currentPage>0)
					scope.currentPage--;
			}
			scope.incrementPage = function(){
				if(scope.currentPage<scope.numberOfPages-1)
					scope.currentPage++;
			}
			scope.initialize = function(){
				$timeout(function() {
					scope.numberOfPages = Math.ceil(scope.list.length/scope.numberOfItemsPerPage);
				}, 0);
			};
			scope.clickCbWrapper = function(row, head){
				if(attribute.clickCb===undefined)
					return;
				scope.clickCb()(row, head);
			}
			scope.setActive = function(n){
				if(n-1==scope.currentPage)
					return "active";
				return "";
			}
			scope.$watch('list', function(term){
				scope.numberOfPages = Math.ceil(scope.list.length/scope.numberOfItemsPerPage);
			}, true);
			scope.$watch('search', function(term){
				scope.filteredList = (filterFilter(scope.list, term));
				scope.numberOfPages = Math.ceil(scope.filteredList.length/scope.numberOfItemsPerPage);
				scope.currentPage = 0;
			});
			scope.$watch('numberOfItemsPerPage', function(term){
				scope.numberOfPages = Math.ceil(scope.filteredList.length/scope.numberOfItemsPerPage);
				scope.currentPage = 0;
			});
			scope.$watch('orderByVariable2', function(term){
				scope.orderByVariable = "\u0022"+scope.orderByVariable2+"\u0022";
			});
		},
		template: [
			'<div ng-show="filteredList.length" style="width:100%;padding-top: 1cm;">',
				'<div style="padding-bottom:1cm;" ng-show="pageRange">',
					'<select class = "form-control" ng-model="numberOfItemsPerPage" style="float:left;width:250px">',
						'<option value = "" style="display:none;">No. of rows per Page</option>',
						'<option ng-repeat = "val in pageRange" value = {{val}}>{{val}}</option>',
					'</select>',
					'<ul class= "pagination" style="width:60%;margin:0 auto;float:left;padding-left: 2cm;">',
						'<li><a href="#" ng-click="decrementPage()">&laquo;</a></li>',
						'<li ng-repeat="n in range()" ng-class="setActive(n)">',
							'<a href="#" ng-click="setPageNumber(n)">{{n}}</a>',
						'</li>',
						'<li><a href="#" ng-click="incrementPage()">&raquo;</a></li>',
					'</ul>',
				'</div>',
				'<table class="table table-condensed">',
					'<tr ng-hide = "selfheaders.length" ng-click="orderByAsc=!orderByAsc">',
						'<th ng-show = "sno" >S.No.</th>',
						'<th ng-repeat = "attribute in headers" ng-click="$parent.orderByVariable2=attribute">{{attribute}}</th>',
					'<tr>',
					'<tr ng-show = "selfheaders.length"  ng-click="orderByAsc=!orderByAsc">',
						'<th ng-show = "sno" >S.No.</th>',
						'<th ng-repeat = "attribute in selfheaders"  ng-click="$parent.orderByVariable2=headers[$index]">{{attribute}}</th>',
					'<tr>',
					'<tr ng-repeat = "person in filteredList | orderBy: orderByVariable: orderByAsc | startFrom: (currentPage*numberOfItemsPerPage) | limitTo:numberOfItemsPerPage">',
						'<td ng-show="sno">{{$index+1+currentPage*numberOfItemsPerPage}}</td>',
						'<td ng-repeat="attribute in headers" ng-click="clickCbWrapper(person, attribute)">{{person[attribute]}}</td>',
					'</tr>',
				'</table>',
			'<div>'
		].join('')
	}
});