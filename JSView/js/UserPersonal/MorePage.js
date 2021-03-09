(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
        '<!-- 更多页组件 -->',
        '<div style="width:640px;background-color: #ffffff;height:500px;">',
        '    <!-- 导航栏 -->',
        '    <div',
        '        style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(240, 240, 240);">',
        '        <!-- 返回按键 -->',
        '        <div onclick="Slago.PageStack.pop()"',
        '            style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
        '            <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
        '            <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
        '                <span style="font-size: 27px;color:#0066cc;">返回</span>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    <div style="height:80px;"></div>',
        '</div>',
    ].join("");
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{});
    }
    namespace.show=function(){
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    //加入模块
    SlagoModel.UserPersonal.MorePage=namespace;
})();