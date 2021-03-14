(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '    <!-- 更多页面 -->',
    '    <div style="width:640px;height:2000px;background-image: linear-gradient(#5e91ff, #ff6565);">',
    '    <!-- 导航栏 -->',
    '    <div',
    '        style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
    '        <!-- 返回按键 -->',
    '        <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
    '            style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
    '            <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
    '            <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
    '                <span style="font-size: 27px;color:#0066cc;">返回</span>',
    '            </div>',
    '        </div>',
    '        <!--导航栏字体栏-->',
    '        <div style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
    '           更多',
    '        </div>',
    '    </div>',
    '    <div style="height:80px;"></div>',
    '         <div style="width: 640px;height:150px;color:#ffffff;font-size: 50px;font-weight: lighter;',
    '         display: flex;justify-content: center;align-items: center;">',
    '            图享',
    '         </div>',
    '         <div style="width:640px;display: flex;justify-content: center;',
    '         font-size: 25px;color: #ffffff;flex-wrap: wrap;">',
    '            <div style="width:100%;display: flex;justify-content: center;">分享生活乐趣</div>',
    '            <ul style="margin-top: 50px;">',
    '                <li>版权:<a href="https://github.com/gaowanlu/Slago" style="color:black;" target="_blank">GitHub开源项目</a></li>',
    '                <li style="margin-top: 20px;">关于我们:图享起始于2021年个人开源前端项目</li>',
    '                <li style="margin-top: 20px;">开发者:高万禄</li>',
    '                <li style="margin-top: 20px;">联系我们:heizuboriyo@gmail</li>',
    '                <li style="margin-top: 20px;">地址:桂林电子科技大学(花江校区)</li>',
    '                <li style="margin-top: 20px;">版本:v0.0.1</li>',
    '            </ul>',
    '         </div>',
    '    </div>',
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