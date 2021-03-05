(function(){
    //建立命名空间
    let namespace={};
    let template=[
        '<div>',
        '    <ul>',
        '    {{#hello}}',
        '        {{^java}}',
        '            {{#show}}',
        '               <img src="{{.}}" style="width:100%;">',
        '            {{/show}}',
        '        {{/java}}',
        '    {{/hello}}',
        '    </ul>',
        '</div>'
        ].join('');
        let data={
            hello:[
                {java:true,show:[
                    "http://119.3.180.71/DataBase/123/img/55.jpg",
                    "http://119.3.180.71/DataBase/123/img/57.png"
                ]},
                {java:true,show:[
                    "http://119.3.180.71/DataBase/123/img/57.png",
                    "http://119.3.180.71/DataBase/123/img/57.png"
                ]},
                {java:true,show:[
                    "http://119.3.180.71/DataBase/123/img/57.png",
                    "http://119.3.180.71/DataBase/123/img/57.png"
                ]},
            ]
        };
        let findpage_=document.getElementById("Slago.FindPage");
        findpage_.innerHTML=Slagolib.template.engin(template,data);
    //加入模块
    SlagoModel.FindPage.post_model=namespace;
})();