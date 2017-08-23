
$(function() {

 var $users=$('#users');
	$.ajax({
		type:"GET",
		url:"http://localhost:3000/membersadmin",
		datatype:"json"
	})
	.done(function(users){
		$.each(users,function(i,user){
			$users.append('<li>name:'+ user.email +'</li>')

		});
	});
	.fail(function(jqXHR,textStatus,err){
		console.log('AJAX error response:' + err);
	});

});