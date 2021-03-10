
(function(){
    window.SlagoModel={};
    let IMPORT=function(src){
        document.write('<script  type="text/javascript" src="'+src+'?random=123'+'"></script>');
    };
    //操作库
        IMPORT("./js/Slagolib.js");//Slago.js库
    //软件界面框架
        IMPORT("./js/Slago.js");//UI基本解决方案
    //主页
    SlagoModel.FindPage={};
        IMPORT("./js/FindPage/Header.js");//Header
        IMPORT("./js/FindPage/post_model.js");//主页帖子流组件
        IMPORT("./js/FindPage/findPage.js");//发现页
    //帖子悬浮页面-帖子悬浮层模块
    SlagoModel.PostSuspensionPage={};
        IMPORT("./js/PostSuspensionPage/postPage.js");//帖子观看层
    //用户个人页模块
    SlagoModel.UserPersonal={};
        IMPORT("./js/UserPersonal/PersonalPageOptionsComponent.js");//选项组件
        IMPORT("./js/UserPersonal/my_page.js");//个人主页
        IMPORT("./js/UserPersonal/ProfileSettingsComponent.js");//资料设置
        IMPORT("./js/UserPersonal/PersonalPostPage.js");//个人帖子页面
        IMPORT("./js/UserPersonal/PersonalAchievementPage.js");//个人成就页面
        IMPORT("./js/UserPersonal/MorePage.js");//更多详情页面
})();
