
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
$(".image_area").dblclick(function(){
	alert("123")
	$(".image_area").toggleClass("large_image")

})