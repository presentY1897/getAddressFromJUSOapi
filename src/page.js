var bindingTabViewing = function () {
    var tabAndViewRelation = [{
        tabClassName: 'dashboardTab',
        viewPageId: 'dashboard_page'
    }, {
        tabClassName: 'fileUploadTab',
        viewPageId: 'fileupload_page'
    }, {
        tabClassName: 'workTab',
        viewPageId: 'work_page'
    }];
    var hideComapreNotTargetElement = function (target) {
        tabAndViewRelation.forEach(compare => compare != target ? document.getElementById(compare.viewPageId).classList.add('d-none') : null);
    };
    tabAndViewRelation.forEach(element => [...document.getElementsByClassName(element.tabClassName)]
        .forEach(tab => tab.addEventListener('click', _ => {
            var targetPage = document.getElementById(element.viewPageId);
            targetPage.classList.remove('d-none');
            hideComapreNotTargetElement(element);
        })))
}();