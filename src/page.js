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
    tabAndViewRelation.forEach(element => {
        [...document.getElementsByClassName(element.tabClassName)].forEach(tab => tab.addEventListener('click', e => {
            var targetPage = document.getElementById(element.viewPageId);
            tabAndViewRelation.forEach(compare => compare != tab ? document.getElementById(compare.viewPageId).classList.add('d-none') : null);
            targetPage.classList.remove('d-none');
        }));
    })
}();