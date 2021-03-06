(function () {
    //建立命名空间
    let namespace = {};
    //渲染页
    namespace.Page = [
        '    <!-- 性别设置界面 -->',
        '    <div style="width:640px;background-color: rgb(255, 255, 255);">',
        '        <!-- 单个资料信息设置页 -->',
        '        <div style="width:640px;background-color: #ffffff;">',
        '            <!-- 导航栏 -->',
        '            <div',
        '                style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
        '                <!-- 返回按键 -->',
        '                <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
        '                    style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
        '                    <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
        '                    <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
        '                        <span style="font-size: 27px;color:#0066cc;">返回</span>',
        '                    </div>',
        '                </div>',
        '                <!--导航栏字体栏-->',
        '                <div',
        '                    style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
        '                    性别',
        '                </div>',
        '            </div>',
        '            <div style="height:80px;width:100%;"></div>',
        '            <!-- 性别设置栏 -->',
        '',
        '',
        '            <!-- 男 -->',
        '            <div id="SlagoModel.UserPersonal.UserData.sexSetingPage.man" ',
        'onclick = "SlagoModel.UserPersonal.UserData.sexSetingPage.choose(this)" class= "hoverPointer"',
        '                style="width:640px;height:100px;background-color: #b4dafd;display: flex;">',
        '                <!-- 字体提示栏 -->',
        '                <div style="width:150px;height:100px;',
        '                            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
        '                    男',
        '                </div>',
        '                <!-- 右箭头 -->',
        '                <div',
        '                    style="margin-left:420px;height: 100%;width:40px;display: flex;justify-content: center;align-items: center;">',
        '                    <img src="./img/箭头_右.png" style="width:40px;">',
        '                </div>',
        '            </div>',
        '            <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
        '            <!-- 女 -->',
        '            <div  class="hoverPointer" id="SlagoModel.UserPersonal.UserData.sexSetingPage.woman" ',
        '   onclick = "SlagoModel.UserPersonal.UserData.sexSetingPage.choose(this)"          ',
        '   style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
        '                <!-- 字体提示栏 -->',
        '                <div style="width:150px;height:100px;',
        '                            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
        '                    女',
        '                </div>',
        '                <!-- 右箭头 -->',
        '                <div',
        '                    style="margin-left:420px;height: 100%;width:40px;display: flex;justify-content: center;align-items: center;">',
        '                    <img src="./img/箭头_右.png" style="width:40px;">',
        '                </div>',
        '            </div>',
        '            <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
        '            <!-- 其他 -->',
        '            <div  class="hoverPointer"',
        ' id="SlagoModel.UserPersonal.UserData.sexSetingPage.other" onclick = "SlagoModel.UserPersonal.UserData.sexSetingPage.choose(this)" ',
        '                style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
        '                <!-- 字体提示栏 -->',
        '                <div style="width:150px;height:100px;',
        '                            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
        '                    其他',
        '                </div>',
        '                <!-- 右箭头 -->',
        '                <div',
        '                    style="margin-left:420px;height: 100%;width:40px;display: flex;justify-content: center;align-items: center;">',
        '                    <img src="./img/箭头_右.png" style="width:40px;">',
        '                </div>',
        '            </div>',
        '            <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
        '            <!-- 保存按钮栏 -->',
        '            <div style="width:640px;height:100px;background-color: #ffffff;margin-top: 40px;">',
        '                <div onclick="Slago.LoadPage.hover()" class="hoverPointer" style="width:120px;height:60px;border-radius:30px;',
        '                                    background-color: #0066cc;color: #ffffff;display: flex;',
        '                                    justify-content: center;align-items: center;font-size: 24px;margin-left: 505px;">',
        '                    保存',
        '                </div>',
        '            </div>',
        '        </div>',
        '    </div>',
    ].join("");
    namespace.getModel = function () {
        return Slagolib.template.engin(this.Page, {});
    }
    namespace.show = function () {
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    }
    //加入模块
    SlagoModel.UserPersonal.UserData.sexSetingPage = namespace;

    //创建方法

    //选择按钮
    SlagoModel.UserPersonal.UserData.sexSetingPage.choose = function (dom) {
        //获得选择按钮的三个节点
        let list = [];
        let ids = [
            "SlagoModel.UserPersonal.UserData.sexSetingPage.man",
            "SlagoModel.UserPersonal.UserData.sexSetingPage.woman",
            "SlagoModel.UserPersonal.UserData.sexSetingPage.other"
        ];
        for (let i = 0; i < ids.length; i++) {
            let obj = {};
            obj.id = ids[i];
            obj.node = document.getElementById(ids[i]);
            list.push(obj);
        }
        for (let i = 0; i < list.length; i++) {
            if (dom.id != list[i].id) {
                list[i].node.style.backgroundColor = "#ffffff";
            } else {
                list[i].node.style.backgroundColor = "#b4dafd";
            }
        }
    }
})();