(function(){
    //建立命名空间
    let namespace={};
    //图片添加点击事件
namespace.click=function(addDivNode){
    //获得此节点下的input-file
    let input_file=addDivNode.children[1];
    //为input_file监听文件上传事件
    input_file.onchange=function(){
        //获得img标签节点
        let img_node=this.parentNode.children[0];
        if(this.files!=undefined&&this.files.length>0&&this.files&&this.files[0]){
            if(this.files[0].getAsDataURL){
                img_node.src=this.files[0].getAsDataURL;
            }else{
                img_node.src=window.URL.createObjectURL(this.files[0]);
            }
            //更新输入图片style
            //获得真实图片高度与宽度
            let imgSize={
                width:img_node.naturalWidth,
                height:img_node.naturalHeight
            };
            //决策
            if(imgSize.width>=imgSize.height){//横长
                img_node.style.height="100%";
                img_node.style.width="auto";
            }else{//竖长
                img_node.style.width="100%";
                img_node.style.height="auto";
            }


        }else if(input_file.value){
            img_node.src=input_file.value;
        }else{
            //将图片还原为加号
            img_node.src="./img/67.png";
            //还原style
            img_node.style.width="60px";
            img_node.style.height="60px";
        }
    }
    input_file.click();
};
//数据上传事件,发布按钮点击事件
namespace.dataPost=function(dom){
    dom=dom.parentNode;//dom为按钮的父节点
    let img_file_list=[];
    let rows=[dom.parentNode.children[3].children[0],
    dom.parentNode.children[3].children[1] ];
    for(let i=0;i<2;i++){
        let row=rows[i];
        for(let i=0;i<row.children.length;i++){
            img_file_list.push(row.children[i].children[1]);
        }
    }
    //得到6个input标签,到img_file_list
    //遍历input标签
    //创建formData
    let formData=new FormData();
    let now_index=0;
    for(let i=0;i<img_file_list.length;i++){
        //判断是否有文件
        let status=(img_file_list[i].files&&img_file_list[i].files.length>0)||img_file_list[i].value;
        if(status){
            //推进formData
            formData.append("img"+now_index.toString(),img_file_list[i]);
            now_index++;
        }
    }
    
    //获取textarea内容
    let textarea_node=dom.parentNode.children[2].children[0];
    //textarea.value 加入formData
    formData.append("textarea",textarea_node.value);
    //调用上传属性
    this.ajax(formData);

};
namespace.ajax=function(formData){
    console.log("帖子内容ajax上传");
    console.log(formData);
    //获得浮层dom
    //添加上传进行可视化
    //显示加载浮层
    Slago.LoadPage.hover();
};
    //加入模块
    SlagoModel.PostUpPage.PostUpModel=namespace;
})();