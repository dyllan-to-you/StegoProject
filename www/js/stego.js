$(document).ready(function(){
	//cache dom
	var success = $('#successIn');
	var stego = $('#stego');
	var expass = $('#expass');
	var cover = $('#cover'); 
	var embedFile = $('#embedFile');
	var empass = $('#empass');

	//embed function
	$('#embed').on('click',function(){
		var formData = new FormData();
		formData.append("cover",cover[0].files[0]);
		formData.append("embed",embedFile[0].files[0]);
		formData.append("password",empass.val());
		$.ajax({
			type:'POST',
			url:'http://jarwa.in:8080/steganography/embed',
			data: formData,
			processData: false,
			contentType: false,
			success: function(){
				alert('success');
				$('#embedModal').modal('hide');
				$('#successModal').modal('show');
				$.success.append('<p>id: '+newStegoFile.id+'</p>');
			},
			error: function(){
				alert('Error generating stego file!');
			}
		});
	});


	//extract function
	$('#extract').on('click',function(){
		var submitSteg = {
			cover: stego.val(),
			password: expass.val(),
		}
		$.ajax({
			type:'POST',
			url: 'http://jarwa.in:8080/steganography/extract',
			data: submitSteg,
			success: function(extractResutlt){
				$('#extractModal').modal('hide');
				$('#successModal').modal('show');
			},
			error: function(){
				alert('Error extracting from stego file!');
			}
		});
	});
});