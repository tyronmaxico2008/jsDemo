var toparams = function ObjecttoParams(obj) {
    var p = [];
    for (var key in obj) {
        p.push(key + '=' + obj[key]);
    }
    return p.join('&');
};


function clsPager() {
    this.pageSize = 10;
    this.count = 0;
    this.pageIndex = 1;
    
    this.pageButtons  = [];

    var this1 = this;
    
    var _setTitleForPageButtons = function() {
        debugger;
        for(var i =0; i < this1.pageButtons.length; i++){
            var iPage = this1.pageIndex + i;    
            this1.pageButtons[i].pageIndex = iPage;
            
            if(iPage > this1.getPageCount())
                this1.pageButtons[i].show = false;
        }
    }
    
    
    this.addPageButtons = function(iCount){
        this.pageButtons = [];
        
        for(var i =0; i < iCount; i++) 
            this.pageButtons.push({ pageIndex : 0, show:true });
            
        _setTitleForPageButtons();    

        /*
        for(var i =0; i < iCount; i++)
        {
            
            var iPage = this.pageIndex + i;
            
            var jn = { pageIndex : iPage , show : true  };
            
            if(iPage > this.getPageCount())
                jn.show = false;
            
            this.pageButtons.push(jn);

        }
        */
        
        
    }
    
    
    
    this.getPageCount = function () {
        return Math.ceil(this.count / this.pageSize);
    }
    
    this.setPageIndex = function(iIndex){
        this.pageIndex = iIndex;    
    }
    
    
    this.movePageGroup = function(){
        this.pageIndex += 1;
        _setTitleForPageButtons()
    }
}

function clsAdapter(bll) { 
    this.row = {};
    
    this.getDataPath = "";
    this.primaryKeyField = "";
    this.saveCommand = ""
    this.deleteCommand = "";
    
    this.edit = function(r) {
        
    }
}


function clsGrid(bll) {
    var _pager  = new clsPager();
    
    this.pager = _pager;
    this.rows = [];
    this.filter = {};
    
    
}


function clsAppConfig() {

    this.appName = "";
    this.controllerLink = "";
    this.assetsLink = "";
    this.viewLink = "";
    this.appResourceLink  = "";
    this.getDataLink = function (sPath) {
        return this.controllerLink + "getdataAll?appName=" + this.appName + "&path=" + sPath;
    }

    this.getDataPagingLink = function (sPath
        , pageSize
        , length
        , start) {

        var sLink = this.controllerLink + "getdataPaging?appName=" + this.appName + "&path=" + sPath;
        sLink += "&draw=" + pageSize;
        sLink += "&length=" + length;
        sLink += "&start=" + start;
        return sLink;
    }
    

    this.getUpdateLink = function (sPath) {
        return this.controllerLink + "UpdateModule?appName=" + this.appName + "&path=" + sPath;
    }
    
    this.getReportLink = function (sPath) {
        return this.controllerLink + "setReport?appName=" + this.appName + "&path=" + sPath;
    }    

    this.getReportDownloadLink = function () {
        return this.controllerLink + "downloadSQLReport";
    }
}

var appBll = angular.module("appBll", []);
appBll.factory("appConfig", new clsAppConfig());
appBll.service("bll", function ($http, appConfig) {
    this.getData = function (sPath, callBack) {
        //var sPathFull = "http://localhost:8086/Service/getdata?appName=mailroom&path=" + sPath;
        var sPathFull = appConfig.getDataLink(sPath);
        
        $http.get(sPathFull).success(function (data, status) {
            callBack(data.Obj)
        }).error(function (data, status) {
        });

    }
    
    this.execGrid = function (sPath, pageSize, start, length, jnData, func, e) {
        //alert(event.type);
        
        var oAjaxProcess = new clsAjaxProcessing(e);
        oAjaxProcess.start();

        var _url = appConfig.getDataPagingLink(sPath, pageSize, length, start);

        /*
        var req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: toparams(jnData)
        };
        */
        
        this.submitForm(jnData,_url,function (data){
            func(data);
            oAjaxProcess.end();
        });
        
        /*
        $http(req).success(function (data) {
            func(data);
            oAjaxProcess.end();
        });
        */
    }
    
    /*
    this.execGrid = function (sPath, pageSize, start, length, jnData, func, e) {
        //alert(event.type);
        var oAjaxProcess = new clsAjaxProcessing(e);
        oAjaxProcess.start();

        var _url = appConfig.getDataPagingLink(sPath, pageSize, length, start);

        var req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: toparams(jnData)
        };
        $http(req).success(function (data) {
            func(data);
            oAjaxProcess.end();
        });
    }
    */
    
    this.execJson = function (sPath, jnData, func,e) {
        //var _url = ng.getLink(sPath);
        var oAjaxProcess = new clsAjaxProcessing(e);
        oAjaxProcess.start();

        var _url = appConfig.getDataLink(sPath);
        /*
        var req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: toparams(jnData)
        };
        */
        
        this.submitForm(jnData,_url,function (data){
            func(data)
            oAjaxProcess.end();
        });
        /*
        $http(req).success(function (data) {
            func(data);
        });
        */
    }
    /*
    this.submitForm =  function ( fields, uploadUrl, callback) {

        var fd = new FormData();
        for (var f in fields) {
            if (fields[f] != null && fields[f] != undefined)
                fd.append(f, fields[f]);
        }

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (data) {

            if (callback != undefined) callback(data);
        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (callback != undefined) callback("Internal Server Error");
        });
    }

    */
    
    this.submitForm =  function ( fields, uploadUrl, callback) {

        var fd = new FormData();
        for (var f in fields) {
            if (fields[f] != null && fields[f] != undefined)
                fd.append(f, fields[f]);
        }

        var _fnSuccess = function(res){
            if (callback != undefined) callback(res.data,"success");
        }
        var _fnError = function(){
            if (callback != undefined) callback(null,"error");
        };

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(_fnSuccess,_fnError);
        
        /*
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).success(function (data) {
            if (callback != undefined) callback(data,"success");
            
        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (callback != undefined) callback(null,"error");
        });
        */
    }

    
    this.UpdateModule =  function ( sPath, jnData, func, e) {
            
        var url = appConfig.getUpdateLink(sPath);
        var oAjaxProcess = new clsAjaxProcessing(e);

        oAjaxProcess.start();

        this.submitForm( jnData, url, function (data) {
            var response = data['msg'];
            var data1 = data['data'];

            if (response != "") {
                alert("Opps! "+ response);
                if ($.isFunction(func)) func("error");
            }
            else {
                //ShowMessage("success!", response);
                if ($.isFunction(func)) func("success", data1);
            }
            oAjaxProcess.end();
        });
    }

    this.setSQLReport = function (sPath, jnData, func, e) {
         var url = appConfig.getReportLink(sPath);
         var oAjaxProcess = new clsAjaxProcessing(e);
         
         oAjaxProcess.start();
         this.submitForm(jnData, url, function (data) {
             var response = data['msg'];
             var data1 = data['data'];
             
             if (response != "") {
                 alert(response);
                 if ($.isFunction(func)) func("error");
             }
             else {
                 //ShowMessage("success!", response);
                 if ($.isFunction(func)) func("success", data1);
             }
             
             oAjaxProcess.end();
         });
     }
    
     this.downloadSQLReport = function(sPath,sFileType,jnData,e){
         this.setSQLReport( sPath, jnData, function (status) {
            if(status=="success")
                window.location = appConfig.getReportDownloadLink() + "?filetype=" + sFileType;
        }, e);    
     }
     
     
});



function ngGrid(bll, sGetPath) {


    var grid = this;

    grid.getPath = sGetPath;

    //Ajax loader
    grid.beforeLoad = [];
    grid.afterLoad = [];
    grid.postJson = [];
    grid.busy = false;
    grid.selectAll = false;
    
    grid.isError = false;
    grid.errorMessage = "";
    
    grid.setSubModule = function (val) {
        subModuleName = val;
    }

    grid.addBeforeLoad = function (fn) {
        grid.beforeLoad.push(fn);
    }

    grid.addAfterLoad = function (fn) {
        grid.afterLoad.push(fn);
    }

    grid.addPostJson = function (fn) {
        grid.postJson.push(fn);
    }

    var _beforeLoad = function () {
        $.each(grid.beforeLoad, function () {
            if ($.isFunction(this)) this();
        });
    }

    var _afterLoad = function () {
        $.each(grid.afterLoad, function () {
            if ($.isFunction(this)) this();
        });
    }

    var fnPostJson = function (d) {
        $.each(grid.postJson, function () {
            if ($.isFunction(this)) this(d);
        });
    };


    this.row = {};


    this.edit = function (r) {
        this.row = clone(r);
    }


    this.onError = function (sMsg) {
        alert(sMsg);
    }

    this.loadOnEnter = function (e) {
        if (e.which == 13)
            this.load();
    }


    this.getCheckedValues = function (Field_value, checkField, seprator) {

        var seprator1 = seprator == undefined ? "," : seprator;
        var lst = [];

        for (var i = 0; i < this.rows.length; i++)
            if (this.rows[i][   checkField])
                lst.push(this.rows[i][Field_value]);

        return lst.join(seprator1);
    }



    this.rows = [];
    this.count = 0;
    this.pageIndex = 0;
    this.pageSize = "20";
    this.pageButtons = [0, 1, 2, 3];



    this.searchOnEnter = function (e) {

        if (e.which == 13) {
            this.pageIndex = 0;
            this.load();
        }

    }

    this.search = function (e) {
        this.pageIndex = 0;
        this.load();
    }


    this.ActiveClass = function (r) {
        return r == this.pageIndex ? 'active1' : '';
    }

    this.getSortClass = function (sField) {

        if (sField == this.sort_field) {
            switch (this.sort_type) {
                case "asc":
                    return "fa-sort-alpha-asc";
                case "desc":
                    return "fa-sort-alpha-desc";
                default:
                    return "fa-sort"
            }
        }
        else {
            return "fa-sort"
        }
    }


    //Sorting setting 
    this.sort_type = ""
    this.sort_field = ""

    this.sort = function (sField, e) {
        this.sort_field = sField;
        this.sort_type = this.sort_type == "asc" ? "desc" : "asc";
        this.load(null, e);
    }
    /////////////////


    this.getPageCount = function () {
        return Math.ceil(this.count / this.pageSize);
    }

    this.changePage = function (iPageIndex, e) {
        this.pageIndex = iPageIndex;
        this.load(null, e);
    }

    this.MoveToFirstPage = function () {
        this.pageButtons[0] = 0
        this.pageButtons[1] = 1
        this.pageButtons[2] = 2
        this.pageButtons[3] = 3


        this.pageIndex = this.pageButtons[0];
        this.load();


    }

    this.MoveToLastPage = function () {

        while (this.pageButtons[3] <= this.getPageCount() - 1) {
            this.pageButtons[0] += 4
            this.pageButtons[1] += 4
            this.pageButtons[2] += 4
            this.pageButtons[3] += 4
        }

        this.pageIndex = this.pageButtons[0];
        this.load();
    }




    this.MoveNext = function () {

        if (this.pageButtons[3] >= this.getPageCount()) {
            //alert(this.pageButtons[3] + ": " + this.getPageCount());
            return;
        }




        this.pageButtons[0] += 4
        this.pageButtons[1] += 4
        this.pageButtons[2] += 4
        this.pageButtons[3] += 4


        this.pageIndex = this.pageButtons[0];
        this.load();

    }




    this.MovePrevious = function () {
        if (this.pageButtons[0] <= 0) return;

        this.pageButtons[0] -= 4
        this.pageButtons[1] -= 4
        this.pageButtons[2] -= 4
        this.pageButtons[3] -= 4
        this.pageIndex = this.pageButtons[0];
        this.load();
    }

    this.setButtons = function () {
    }


    this.load = function (callBack, e) {


        var jnPost = {};


        if (this.sort_type != "" && this.sort_field != "") {
            jnPost["$sort"] = this.sort_field + " " + this.sort_type;
        }


        if (fnPostJson != undefined) fnPostJson(jnPost);

        _beforeLoad();
        grid.busy = true;

        bll.execGrid(sGetPath, this.pageIndex, this.pageIndex * this.pageSize, this.pageSize, jnPost, function (data) {
            
            if(data.error == true)
            {
                grid.isError = true;
                grid.errorMessage = data.error_msg;
            }
            else
            {
                grid.isError = false;
                grid.errorMessage = "";

                grid.rows = data.data;
                grid.count = data.recordsTotal;
            }
            
            
            if ($.isFunction(callBack)) callBack();

            _afterLoad();
            grid.busy = false;
            //this.setButtons();

        }, e);
    }


    this.loadAll = function (dPostData, callBack, e) {


        var jnPost = null;


        if ($.isPlainObject(dPostData))
            jnPost = dPostData;
        else
            if ($.isFunction(fnPostJson)) {
                var jnPost = {};
                fnPostJson(jnPost);
            }


        _beforeLoad();

        bll.execJson(sGetPath, jnPost, function (data) {
            if (angular.isArray(data)) {
                grid.rows = data;
                grid.count = data.length;

                if ($.isFunction(callBack)) callBack();

                _afterLoad();
            }
        }, e);
    }

    this.selectById = function (iId, callback, e) {


        if ($.isNumeric(iId) == false || parseInt(iId) == 0) {
            this.row = {};
            return;
        }

        var jnPost = {};
        jnPost[this.PrimaryKeyField] = iId;

        _beforeLoad();
        bll.execJson(sGetPath, jnPost, function (data) {
            if (data.length > 0) {
                grid.row = data[0];
                if ($.isFunction(callback)) callback();
            }
            _afterLoad();
        }, e);
    }


    this.selectByFilter = function (filterData, callback, e) {
        _beforeLoad();
        grid.busy = true;
        bll.execJson(sGetPath, filterData, function (data) {
            if (data.length > 0) {
                grid.row = data[0];
                if ($.isFunction(callback)) callback();
            }
            _afterLoad();
            grid.busy = false;
        }, e);
    }

    //Alter
    
    this.downloadSQLReport = function(sReportName,sType,e){
        var jnPost = {};
        fnPostJson(jnPost);
        bll.downloadSQLReport(sReportName, sType, jnPost, e);    
        
        //bll.downloadSQLReport("ap_mlm:customer_list", "Excel", $scope.row_filter, e);
    }

    

}

//

function ngCRUD(bll, sGetPath, sSavePath, sDeletePath, PrimaryKeyField) {

    var grd = new ngGrid(bll, sGetPath);

    grd.PrimaryKeyField = PrimaryKeyField;

    grd.row_copy = null;

    grd.formClear = function () {
        grd.row = { id: 0 };
    }

    grd.downloadFile = function (r, sField) {

        /*
        var iID = 0;
        iID = r[grd.PrimaryKeyField];
        var sPath = ng.getlinkDownloadFile(grd.ModuleName, sField, iID);
        document.location.href = sPath;
        */
    }

    grd.exec = function (row, sPath, e, callback) {

        if (grd.beforeSave != undefined) {
            if (!grd.beforeSave()) return false;
        }

        r = row == undefined || row == null ? grd.row : row;

        bll.UpdateModule( sPath, r, function (status, data) {
            if (status == "success") {

                //grd.formClear();

                if (grd.afterSave != undefined && $.isFunction(grd.afterSave)) {
                    //grd.afterSave(data);
                }

                if ($.isFunction(callback)) callback();
            }
        }, e);
    }

    grd.beforeSave = null;

    grd.addBeforeSave = function (fn) {
        grd.beforeSave = fn;
    }

    grd.afterSave = null;

    grd.addAfterSave = function (fn) {
        grd.afterSave = fn;
    }

    grd.save = function (callback, e) {

        if (grd.beforeSave != undefined) {
            if (!grd.beforeSave()) return false;
        }

        bll.UpdateModule(sSavePath, grd.row, function (status, data, info) {

            if (status == "success") {

                grd.formClear();

                if (grd.afterSave != undefined && $.isFunction(grd.afterSave)) {
                    grd.afterSave(data, info);
                }

                if ($.isFunction(callback)) callback(data, info);

            }
            else if (status == "error") {
                //grd.onError(data);
            }
        }, e, false);
    }


    //grd.save_others = function (callback, e) {
    //    grd.exec(ActionName, e, callback);
    //}

    grd.edit = function (r) {
        grd.row = clone(r);
    }

    grd.copy = function (r) {
        grd.row_copy = r == undefined ? clone(grd.row) : clone(r);
    }

    grd.paste = function () {
        grd.row = clone(grd.row_copy);
        grd.row.id = 0;
    }

    
    grd.del = function (r, callBack, e) {
        if (!confirm("Are you sure want to delete selected record ?")) return;
        bll.UpdateModule(sDeletePath, { id: r[PrimaryKeyField] }, function (status) {

            if (status == "success") {
                //if (callBack != undefined) grid.load();
                grd.formClear();

                if ($.isFunction(callBack)) {
                    callBack();
                }
                else if (callBack == undefined) {
                    grd.load();
                }
            }
        }, e);
    }


    return grd;
}


















appBll.directive("pager", function (appConfig) {
    return {
        restrict: "E",
        replace: true,
        scope: { grd: "=grd" },
        templateUrl : appConfig.viewLink + "pager.html" ,
        link: function (scope, element, attrs) {
            
        }
    }
});

/*
appBll.directive("pager", function (appConfig) {

    return {
        restrict: "E",
        replace: true,
        scope: { grd: "=grd" },
        templateUrl : "http://localhost/assets/ngUtility2/views/pager.htm",
        link: function (scope, element, attrs) {
        }
    }
});
*/

appBll.directive("sorter", function (appConfig) {
    return {
        restrict: "E",
        replace: true,
        scope: { grd: "=grd", col: "@col" },
        templateUrl : appConfig.viewLink + "sorter.htm",
        link: function (scope, element, attrs) {
        }
    }
});


appBll.directive("busy", function () {
    return {
        restrict: "E"
        , replace: true
        , scope: { grd: "=?" }
        , template: function () {
            var sHTML = "";
            return "<div ng-show='grd.busy' style='width:100%'><center><div class='busy-lg'></div></center></div>"
            
            return sHTML;
        }
    }
});
function clsFilterField(_grd) {
    //var _grd = ngCRUD("");

    this.fields = [];
    this.rows = [];
    var this1 = this;
    
    this.add = function (sField
        ,sTitle
        ,sFieldType){
         
        var field = { name : "",title: "",fieldType :"" };
        
        field.fieldType = (sFieldType || "text");
        field.name = sField;
        field.title = (sTitle || sField || 'Unknown');
        field.operator = "Like";
        this1.fields.push(field);
        
        
    }
    
    this.addRow = function(){
        
        var jn = { name : "", operator : "LIKE", val : "" };
        if(this1.fields.length > 0 )  jn.name = this1.fields[0].name;
        this1.rows.push(jn);
    }
    
    this.del = function(iIndex) {
        if(this1.rows.length == 1 ) return;
        this1.rows.splice(iIndex,1);
    }

    this.clear = function(){
        this1.fields=[];    
    }

    _grd.addPostJson(function(d){
        debugger;
        if(this1.fields.length > 0)
            d["_filter"] = JSON.stringify(this1.rows);
    });

    _grd['filter']  = this;
    
    if(this.rows.length == 0) this.addRow();
}

appBll.directive("grdFilter", function (appConfig) {
    return {
        restrict: "E",
        replace: true,
        scope: { grd: "=grd" },
        templateUrl : appConfig.viewLink + "grd-filter.html" ,
        link: function (scope, element, attrs) {
        }
    }
});
appBll.directive("grdInit", function (bll) {
    return {
        restrict: "A"
        , scope: { grdInit: "@", grdName: "@" }
        , controller: function ($scope) {
            debugger;
            var _grdName = "grd"
            if ($scope.grdName) _grdName = $scope.grdName;
            var _grd = new ngCRUD(bll, $scope.grdInit, "", "", "id");
            $scope.$parent[_grdName] = _grd;
            _grd.load();
        }
        , link: function (scope, element) {
        
        }
    };
});

appBll.directive("appView",function(appConfig,$compile,$templateRequest){
    return {
        restrict : "A"
        , scope : { appView : "=" }
        , link : function(scope, element, attrs)        {
            
            scope.$watch("appView",function(newValue){
                debugger;
                if(newValue){
                    var sUrl = appConfig.appResourceLink +  newValue;    
                    $templateRequest(sUrl).then(function(sHtml){
                        element.html("").append($compile(sHtml)(scope.$parent));
                    });
                }
            });
                    
            //alert(sUrl);
        }
        
    }
});

appBll.filter('appViewUrl', function (appConfig) {
    return function (input) {
        var sUrl = appConfig.appResourceLink + "/" + input;
        return sUrl;
    };
});

appBll.directive("drp", function (bll) {
    // "<button ng-repeat='r in grd.rows' ng-bind='r[displayMember1]'></button>"
    return {
        restrict: "E"
        , template: "<select ng-options='r[valueMember] as  r[displayMember] for r in grd.rows' ng-model='myModel' class='form-control' > </select>"
        , replace:true
        , scope: { data: "=", displayMember: "@", valueMember: "@", myModel: "=" }
        , controller: function ($scope) {

            $scope.grd = null;

            if (angular.isString($scope.data)) {
                var _grd = new ngCRUD(bll, "drp\\" + $scope.data, "", "", $scope.value);
                $scope.grd = _grd;
                _grd.loadAll();
            }
            else if (angular.isObject($scope.data))
                $scope.grd = $scope.data;
        }

    };
});

appBll.directive("fld", function (appConfig) {
    /*
    var sHtml = ""
    
    sHtml =  '<div class="form-group"> \n'
    sHtml += '   <label><span ng-bind="fldTitle"></span>&nbsp;<span  ng-show="fldRequired" style="color: red">**</span></label>   \n'
    sHtml += '   <input type="password" ng-if="isIcon()==false && fldType==\'password\'" class="form-control" ng-model="grd.row[fldName]" /> \n'
    sHtml += '   <input type="text" ng-if="isIcon() == false && fldType ==\'text\'" class="form-control"  ng-model="grd.row[fldName]" /> \n'
    sHtml += '   <textarea rows="4" ng-if="isIcon() == false && fldType ==\'multiline\'" class="form-control"  ng-model="grd.row[fldName]"></textarea> \n'
    sHtml += '<drp data="drpData" display-member="{{displayMember}}" value-member="{{valueMember}}" my-model="grd.row[fldName]" ng-if="isIcon() == false && fldType ==\'drp\'" ></drp> \n'
    
    sHtml += '   <div class="input-group" ng-if="isIcon() == true"> \n' 
    sHtml += '       <span class="input-group-addon"><i ng-class="[\'fa\' , fldIcon]"></i></span>  \n'
    sHtml += '       <input type="text" class="form-control" ng-model="grd.row[fldName]" /> \n '
    sHtml += '   </div> \n'
    sHtml += '</div> \n'
    */

    return {
        restrict: "E"
        , replace: true
        , templateUrl :  appConfig.viewLink + "fld.html" 
        , scope: { 
                    grd : "="
                 ,  fldTitle : "@"
                 , fldName :"@"
                 , fldRequired : "=" 
                 , fldIcon : "@" 
                 , fldType : "@"
                 , drpData : "="
                 , displayMember : "@"
                 , valueMember : "@"
                }
        ,controller : function($scope) {
            
            $scope.fldType =($scope.fldType || "") == "" ? "text" : $scope.fldType;
            
            $scope.isType = function(sType) {
                return ($scope.fldType == sType);
            }
        
            $scope.isIcon = function() {
                return ($scope.fldIcon  || "") == "" ? false : true;  
            }
        }
        , link: function (scope, element, attrs) {
            scope.fldType =(scope.fldType || "") == "" ? "text" : scope.fldType;
        }
    }
});




appBll.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


function getID() {
    return qstr("id");
}
//inheritance of ngCRUD

function clsCRUD_PopUp(bll,oCRUDInfo,sModalDivName){
    
    var _sModalDivName = "#" + (sModalDivName || "divEntry");
    
    var _grd = new ngCRUD(bll,oCRUDInfo['get'],oCRUDInfo['save'],oCRUDInfo['del'],oCRUDInfo['primaryKeyField']);

    _grd.addNew = function(){
        _grd.row = {};
        $(_sModalDivName).modal("show");
    }
    
    _grd.edit1 = function (r) {
        _grd.edit(r);
        $(_sModalDivName).modal("show");
    }

    _grd.addAfterSave(function () {
        $(_sModalDivName).modal("hide");
        _grd.load();
    });
    
    return _grd;
}

function controller_simpleCRUD_popup(sPathGet, sPathSave, sPathDelete, sID) {
    
    var oCRUDInfo = { get: "", save: "", del: "", primaryKeyField: "" }
    
    
    if(angular.isObject(sPathGet))    {
        
        oCRUDInfo.get              = sPathGet["get"];
        oCRUDInfo.save             = sPathGet["save"];
        oCRUDInfo.del              = sPathGet["del"];
        oCRUDInfo.primaryKeyField  = sPathGet['primaryKeyField'];
        
    }
    else if(angular.isString(sPathGet)) {
        oCRUDInfo.get              = sPathGet;
        oCRUDInfo.save             = sPathSave;
        oCRUDInfo.del              = sPathDelete;
        oCRUDInfo.primaryKeyField  = sID;
    }
    else
        throw "Wrong arugment passed for CRUD Information !"

    
    return function ($scope, bll) {
        var _grd = new clsCRUD_PopUp(bll, oCRUDInfo);
        $scope.grd = _grd;
        _grd.load();
        
    }
}

function controller_login(sRedirectLink
    , sBllPathLogin) {
    return function ($scope, bll) {
        $scope.row = { userid: "", pwd: "" };

        $scope.login2 = function (e) {
            if (e.which == 13) $scope.login(e);
        }

        $scope.login = function (e) {
            bll.UpdateModule((sBllPathLogin || "system\\login"), $scope.row, function (status, result) {
                if (status == "success")
                    window.location = sRedirectLink;
            }, e);
        };
    }
}

function controller_simpleCRUD_noPopupEntry(sPathGet, sPathSave, sPathDelete, sID, sPageLink) {
    return function ($scope, bll) {
        var _grd = new ngCRUD(bll, sPathGet, sPathSave, sPathDelete, sID);

        $scope.grd = _grd;
        _grd.addAfterSave(function () {
            window.location = sPageLink + "?id=" + getID();
        });

        if (getID() == "0") {
            _grd.row = {};
        }
        else
            _grd.selectById(getID());

        //End of member
    }
}

function controller_simpleCRUD_noPopupList(sPathGet, sPathSave, sPathDelete, sID, sPageLink) {
    return function ($scope, bll) {
        var _grd = new ngCRUD(bll, sPathGet, sPathSave, sPathDelete, sID);
        $scope.grd = _grd;
        _grd.load();
    }
}
