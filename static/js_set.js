
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
})
$("#container").on('dblclick','#sign_in_input',function(){
	$("#sign_in_input").css("display",'none')
})
$("#container").on('dblclick','#sign_up_input',function(){
	$("#sign_up_input").css("display",'none')
})
$("#container").on('dblclick','#add_image',function(){
	$("#add_image").css("display",'none')
})

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
	function(res){
		if (res.judge!="exist"){
			id.next().text(Number(id.next().text())+1)
		}else{
			setTimeout(alert("already judged").close(),3000)
		}
	}
	)
}

//control when the sign_up,sign_in,sign_out button should show on the page.
$("document").ready(function(){
	if ($("#username").length>0){
		$("#sign_up").css("display","none")
		$("#sign_in").css("display","none")
		$("#sign_out").css("display","block")
	}else{
		
	}
})

//user information feedback to the form.
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


// show change_password_area, hid other area
$("#change_password_click").click(function(){
	$("#change_password_area").css("display","block")
	$("#sign_up_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#sign_in_input").css("display",'none')
})