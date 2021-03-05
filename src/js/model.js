
(function(){
    window.SlagoModel={};
    let IMPORT=function(src){
        document.write('<script  type="text/javascript" src="'+src+'"></script>');
    };
    //操作库
    IMPORT("./js/Slagolib.js");
    //软件界面框架
    IMPORT("./js/Slago.js");
    //主页
    SlagoModel.FindPage={};
    IMPORT("./js/FindPage/post_model.js");
})();
