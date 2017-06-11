//设置点击相应按钮后显示对应的form
$("#sign_in").click(function(){
	$("#sign_up_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#change_password_area").css("display","none")
	$("#sign_in_input").css("display",'block');
})
$("#sign_up").click(function(){
	$("#change_password_area").css("display","none")
	$("#sign_in_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#sign_up_input").css("display",'block')
})
$("#redict_sign_up").click(function(){
	$("#change_password_area").css("display","none")
	$("#sign_in_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#sign_up_input").css("display",'block')
})

$("#add").click(function(){
	$("#add_image").css("display","block")
	$("#change_password_area").css("display","none")
	$("#sign_up_input").css("display",'none')
	$("#sign_in_input").css("display",'none');
	if ($("#add_image_form").find("[name=image_id_hidden]").length>0){
		$("#add_image_form").find("[name=image_id_hidden]").remove()
		// $('#add_image_form').find("[name=photo]").prop("required","true")
	}else{

	}
})
//设置显示出的form，受到双击后消失
$("#container").on('dblclick','#sign_in_input',function(){
	$("#sign_in_input").css("display",'none')
})
$("#container").on('dblclick','#sign_up_input',function(){
	$("#sign_up_input").css("display",'none')
})
$("#container").on('dblclick','#add_image',function(){
	$("#add_image").css("display",'none')
})
$("#container").on('dblclick','#change_password_area',function(){
	$("#change_password_area").css("display",'none')
})

//设定当用户点击"赞"和"倒"时，将数据返回给后台记录，并更新前台数据
function judge(id){
	var id=$(id)
	var image_id=id.parents(".show_area").attr("id")
	var judge_value
	if (id.text()=="赞"){
		judge_value="good"
	}else{
		judge_value="bad"
	};
	$.post("/judge",
	{
		judge:judge_value,
		image:image_id
	},
	//更新前台数据
	function(res){
		if (res.judge!="exist"){
			id.next().text(Number(id.next().text())+1)
		}else{
			setTimeout(alert("already judged").close(),3000)
		}
	}
	)
}

//根据初始状态下用户是否登录，设定"sign_up","sign_out","sign_in"的显示状态
$("document").ready(function(){
	if ($("#username").length>0){
		$("#sign_up").css("display","none")
		$("#sign_in").css("display","none")
		$("#sign_out").css("display","block")
	}else{
		
	}
})

//设置点击“编辑信息”时，显示相应的form，并通过ajax获取道当前用户的信息，并显示在form中
$("#edit_info").click(function(){
	$("#change_password_area").css("display","none")
	$("#sign_up_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#sign_up_input").css("display","block")
	$("#sign_up_form>input[type=radio]").val("modify")

	$.get("/get_user_info",function(res){	

		$("#username_sign_up").val(res.username)
		$("#email_sign_up").val(res.email)
		$("#birthday_sign_up").val(res.birthday)
		$("#address_sign_up").val(res.address)
	}
	)
})


// 设置当点击更改密码时，显示除更改密码的form
$("#change_password_click").click(function(){
	$("#change_password_area").css("display","block")
	$("#sign_up_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#sign_in_input").css("display",'none')
})

// 设置放大image 的图片路径，隐藏mapid的区域
function large_image(id){
	var id=$(id)
	var img_src=id.attr('src')
	console.log(img_src)
	$("#large_image img").attr("src",img_src)
	$("#mapid").css("display","none")
	$("#large_image").css("display","block")
}
// 设置放大image双击后退出
$("#large_image").click(function(){
	$("#mapid").css("display","block")
	$("#large_image").css("display","none")
})

// 当点击“编辑”时，将“增加image”的form显现出来，获取当前image的id
//通过ajax查询当前id的信息，显示到form中。

$("#edit").click(function(){
	var image=$(".show_area")
	console.log(image)
	var image_id=image.attr("id")  //获取id
	console.log(image_id)
	//判断是否选择了image
	if (image_id){
	//设置显示form
		$("#add_image").css("display","block")
		$("#change_password_area").css("display","none")
		$("#sign_up_input").css("display",'none')
		$("#sign_in_input").css("display",'none')
        //判断是否已经存在“image_id_hidden”项，防止多次点击，添加多次
        //image_id_hidden的作用是传递给后台，判断是新增还是编辑，以及查询编辑的image
		if ($("#add_image_form").find("[name=image_id_hidden]").length>0){

		}else{
			$("#add_image_form").append("<input type='text' name='image_id_hidden' value="+image_id+" hidden>")
			console.log($('#add_image_form').find("[name=photo]"))
			// $('#add_image_form').find("[name=photo]").removeAttr("required")
		}
	    //id传递给后台，用于获取当前image的数据
		$.post("/edit_img",{
			id:image_id,
		},
		function(res){
            //设置form为此image的各个信息
			$("#add_image").find("[name=image_name]").val(res.name)

			$("#add_image").find("[name=take_date]").val(res.date)

			$("#add_image").find("[name=longitude]").val(res.longitude)

			$("#add_image").find("[name=altitude]").val(res.altitude)

			$("#add_image").find("[name=image_comment]").val(res.text)

		})
	}else{
		setTimeout(alert("Please chose the picture you want to edit.").close(),3000)
	}

})

