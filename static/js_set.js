
$("#sign_in").click(function(){
	$("#sign_up_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#sign_in_input").css("display",'block');
})
$("#sign_up").click(function(){
	$("#sign_in_input").css("display",'none')
	$("#add_image").css("display","none")
	$("#sign_up_input").css("display",'block');
})
$("#add").click(function(){
	$("#add_image").css("display","block")
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


function large_image(id){
	var id=$(id);
	if (id.parent().attr("id")=="mapbody"){
		$(".image_area").prepend(id)
	}else{
		$("#mapbody").prepend(id)
	}
	id.toggleClass("large_image")
	alert("123")

}

$(document).ready(function show_sign_in_out_up(){
	        console.log($("#username").text())
	        if ($("#username").text().length!=0){
		        $("#sign_in").css("display","none")
		        $("#sign_up").css("display","none")
		        $("#sign_out").css("display","block")
	        }else{
	        }

})