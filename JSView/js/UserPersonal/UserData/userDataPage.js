(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '    <!-- 个人资料页 -->',
    '    <div style="width:640px;background-color: rgb(255, 255, 255);">',
    '       <!-- 导航栏 -->',
    '       <div',
    '           style="width:640px;height:80px;background-color: rgb(255, 255, 255);align-items: center;display: flex;position: fixed;top:0px;border-bottom: 1px solid rgb(77, 160, 255);">',
    '           <!-- 返回按键 -->',
    '           <div class="hoverPointer" onclick="Slago.PageStack.pop()"',
    '               style="display: flex;height:100%;align-items: center;margin-left: 10px;">',
    '               <img src="./img/页面栈返回左箭头.png" style="height:40px;width:40px;">',
    '               <div style="height:100%;display: flex;align-items: center;margin-left: 3px;">',
    '                   <span style="font-size: 27px;color:#0066cc;">返回</span>',
    '               </div>',
    '           </div>',
    '           <!--导航栏字体栏-->',
    '           <div style="width:300px;height:100%;background-color:#ffffff;margin-left:66px;display:flex;align-items:center;justify-content: center;font-size:27px;">',
    '           个人信息',
    '           </div>',
    '       </div>',
    '       <div style="height:80px;width:100%;"></div>',
    '        <!-- 头像栏 -->',
    '        <div class="hoverPointer" onclick="SlagoModel.UserPersonal.UserData.userDataPage.HeadImgSeting(this)" style="width:640px;height:130px;background-color:#ffffff ;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:130px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                头像',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <!-- 头像图片 -->',
    '                <img style="width:100px;height:100px;border-radius: 5px;margin-top: 15px;margin-left: 315px;" src="https://weiliicimg9.pstatp.com/weili/l/907007723288002647.webp">',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '            <input type="file" accept="image/*" style="display: none;">',
    '        </div>',

    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 昵称栏 -->',
    '        <div onclick="SlagoModel.UserPersonal.UserData.nameSetingPage.show()" class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                昵称',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    高万禄',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 账号栏 -->',
    '        <div class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                图享号',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    00001',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 性别 -->',
    '        <div class="hoverPointer" style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                性别',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    男',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '        <div style="width:610px;height:1px;background-color: #f0f0f0;margin-left: 30px;"></div>',
    '        <!-- 个性签名 -->',
    '        <div class="hoverPointer"  style="width:640px;height:100px;background-color: #ffffff;display: flex;">',
    '            <!-- 字体提示栏 -->',
    '            <div style="width:150px;height:100px;background-color: rgb(255, 255, 255);',
    '            display: flex;align-items: center;font-size: 25px;margin-left: 30px;">',
    '                个性签名',
    '            </div>',
    '            <!-- 主题内容 -->',
    '            <div style="width:420px;height:100%;background-color: rgb(255, 255, 255);">',
    '                <div style="height:100%;width:400px;margin-left: 15px;display: flex;align-items: center;justify-content: flex-end;font-size: 20px;color:#707070;overflow: hidden;">',
    '                    你好生活需要努力，加油!',
    '                </div>',
    '            </div>',
    '            <!-- 右箭头 -->',
    '            <div style="height: 100%;width:40px;background-color: rgb(255, 255, 255);display: flex;justify-content: center;align-items: center;">',
    '                <img src="./img/箭头_右.png" style="width:40px;">',
    '            </div>',
    '        </div>',
    '    </div>',
    ].join("");

    //头像设置
    namespace.HeadImgSeting=function(dom){
        let input=dom.children[dom.children.length-1];
        //input添加状态改变事件
        input.onchange=function(){
            //获得input下面的头像img节点
            let imgNode=this.parentNode.children[1].children[0];
            //检测图像文件是否选择
            if(this.files!=undefined&&this.files.length>0&&this.files&&this.files[0]){
                if(this.files[0].getAsDataURL){
                    imgNode.src=this.files[0].getAsDataURL;
                    Slago.LoadPage.hover();//进行悬浮层
                }else{
                    imgNode.src=window.URL.createObjectURL(this.files[0]);
                    Slago.LoadPage.hover();//进行悬浮层
                }
            }else if(input_file.value){
                imgNode.src=input_file.value;
                Slago.LoadPage.hover();//进行悬浮层
            }
        }
        //点击表单
        input.click();
    };
    namespace.getModel=function(){
        return Slagolib.template.engin(this.Page,{});
    };
    namespace.show=function(){
        //创建页面,推入页面栈
        Slago.CreatePage(this.getModel());
    };
    //加入模块
    SlagoModel.UserPersonal.UserData.userDataPage=namespace;
})();