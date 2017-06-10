
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

function large_image(id){
	var id=$(id)
	var img_src=id.attr('src')
	console.log(img_src)
	$("#large_image img").attr("src",img_src)
	$("#mapid").css("display","none")
	$("#large_image").css("display","block")
}
$("#large_image").click(function(){
	$("#mapid").css("display","block")
	$("#large_image").css("display","none")
})

// 

$("#edit").click(function(){


	var image=$(".show_area")
	console.log(image)
	var image_id=image.attr("id")
	console.log(image_id)
	if (image_id){
		$("#add_image").css("display","block")
		$("#change_password_area").css("display","none")
		$("#sign_up_input").css("display",'none')
		$("#sign_in_input").css("display",'none')

		if ($("#add_image_form").find("[name=image_id_hidden]").length>0){

		}else{
			$("#add_image_form").append("<input type='text' name='image_id_hidden' value="+image_id+" hidden>")
			console.log($('#add_image_form').find("[name=photo]"))
			// $('#add_image_form').find("[name=photo]").removeAttr("required")
		}
	
		$.post("/edit_img",{
			id:image_id,
		},
		function(res){

			$("#add_image").find("[name=image_name]").val(res.name)

			$("#add_image").find("[name=take_date]").val(res.date)

			$("#add_image").find("[name=longitude]").val(res.longitude)

			$("#add_image").find("[name=altitude]").val(res.altitude)

			$("#add_image").find("[name=image_comment]").val(res.text)

		})
	}else{
		alert("Please chose the picture you want to edit.")
	}

})

