(function(){
    //建立命名空间
    let namespace={};
    //渲染页
    namespace.Page=[
    '<!-- 用户个人页面 -->',
    '<div style="width:640px;background-color: rgb(255, 255, 255);">',
    '    <!-- 用户信息块\昵称\关注\粉丝\头像等元素 -->',
    '    <div style="width:620px;',
    '                height:200px;margin-left: 10px;',
    '                display: flex;flex-wrap: wrap;justify-content: space-around;',
    '                align-items: center;margin-top: 30px;',
    '                ">',
    '        <!-- 头像 -->',
    '        <div style="width:140px;height:140px;',
    '                    background-color:rgb(255, 255, 255);',
    '                    border-radius:80px;">',
    '            <img src="https://weiliicimg9.pstatp.com/weili/l/907007723288002647.webp"',
    '                style="width:100%;height:100%;border-radius:50%;">',
    '        </div>',
    '        <!-- 个人成就 -->',
    '        <div style="width:440px;height:140px;">',
    '            <!-- 用户名 -->',
    '            <div style="width:100%;',
    '                        height:70px;',
    '                        background-color:rgb(255, 255, 255);',
    '                        display:flex;',
    '                        justify-content:center;',
    '                        align-items:center;',
    '                        font-size: 27px;',
    '                        color:rgb(68,68,68);">',
    '                <p>高万禄</p>',
    '            </div>',
    '            <!-- 成就栏 -->',
    '            <div style="width:100%;',
    '                        height:70px;',
    '                        background-color:rgb(255, 255, 255);',
    '                        display: flex;',
    '                        justify-content:center;',
    '                        align-items: center;',
    '                        font-size: 24px;',
    '                        color:rgb(68,68,68);">',
    '                <p>12 关注 3k 粉丝 5w 喜欢</p>',
    '            </div>',
    '        </div>',
    '    </div>',
    '{{PersonalPageOptionsComponent}}',//选项组件
    '</div>'
    ].join("");
    namespace.getModel=function(){
        let data={
            PersonalPageOptionsComponent:SlagoModel.UserPersonal.PersonalPageOptionsComponent.getModel(),
        }
        return Slagolib.template.engin(this.Page,data);
    }
    //加入模块
    SlagoModel.UserPersonal.my_page=namespace;
})();