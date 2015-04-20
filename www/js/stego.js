$(document).ready(function(){
	//cache dom
	var success = $('#successIn');
	var stego = $('#stego');
	var expass = $('#expass');
	var cover = $('#cover'); 
	var embedFile = $('#embedFile');
	var empass = $('#empass');
	var fileInfo = $('#fileInfo');
	var fileCap;

	function getFileCap(fileInfo)
	{
		var start = fileInfo.indexOf("capacity:");
		var fileCap = fileInfo.substr(start);
		fileCap = fileCap.charAt(0).toUpperCase() + fileCap.substring(1);
		return fileCap;
	}

	cover.on('change',function(){
		var formData = new FormData();
		formData.append("cover",cover[0].files[0]);
		$.ajax({
			type:'POST',
			url:'http://jarwa.in:8080/steganography/info', 
			data: formData,
			processData: false,
			contentType: false,
			success: function(infoData){
				fileCap=getFileCap(infoData.message);
				fileInfo.empty();
				fileInfo.append('<p class="alert alert-success"><b>'+fileCap+'</b></p>');
			},
			error: function(){
				alert('Error retrieving file capacity!');
			}
		})
	});

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
			success: function(newStegoFile){
				success.empty();
				$('#embedModal').modal('hide');
				$('#successModal').modal('show');
				success.append('<img src="http://jarwa.in:8080/steganography/retrieve/'+newStegoFile.id+'" onerror="if(this.src!="Default-file.jpg") this.src="img/Default-file.jpg") style="max-height: 400px; max-width: 400px;"></br></br>')
				success.append('<a href="http://jarwa.in:8080/steganography/retrieve/'+newStegoFile.id+'"download="stegoFile"><button class="btn btn-primary">Download</button></a>');
				success.append('<p>ID: '+newStegoFile.id+'</p>');
				success.append('<p>Check Sum: '+newStegoFile.checksum_sha1+'</p>');
			},
			error: function(){
				alert('Error generating stego file!');
			}
		});
	});

  
	$.ajaxTransport("+binary", function(options, originalOptions, jqXHR){
            // check for conditions and support for blob / arraybuffer response type
            if (window.FormData && ((options.dataType && (options.dataType == 'binary')) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob)))))
            {
                return {
                    // create new XMLHttpRequest
                    send: function(headers, callback){
                        // setup all variables
                        var xhr = new XMLHttpRequest(),
                        url = options.url,
                        type = options.type,
                        async = options.async || true,
                        // blob or arraybuffer. Default is blob
                        dataType = options.responseType || "blob",
                        data = options.data || null,
                        username = options.username || null,
                        password = options.password || null;
                                               
                        xhr.addEventListener('load', function(){
                                var data = {};
                                data[options.dataType] = xhr.response;
                                // make callback and send data
                                callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                        });
         
                        xhr.open(type, url, async, username, password);
                                       
                        // setup custom headers
                        for (var i in headers ) {
                                xhr.setRequestHeader(i, headers[i] );
                        }
                                       
                        xhr.responseType = dataType;
                        xhr.send(data);
                    },
                    abort: function(){
                        jqXHR.abort();
                    }
                };
            }
        });

	//extract function
	$('#extract').on('click',function(){
		var fd = new FormData();
		fd.append("embed",stego[0].files[0]);
		fd.append("password",expass.val());
		$.ajax({
			type:'POST',
			url: 'http://jarwa.in:8080/steganography/extract',
			data: fd,
			dataType: "binary",
			processData: false,
			contentType: false,
			success: function(extractResult, status, request){
				console.log(extractResult);
				var reader = new window.FileReader();
				reader.readAsDataURL(extractResult);
				reader.onloadend = function(){
					var resultFile = reader.result;
					console.log(resultFile);
					success.empty();
					$('#extractModal').modal('hide');
					$('#successModal').modal('show');
					success.append('<img src="img/Default-file.jpg" style="max-height: 200px; max-width: 200px;"></br></br>')
					success.append('<a href="'+resultFile+'" download="extract" download><button class="btn btn-primary">Download</button></a>');
				}
			},
			error: function(){
				alert('Error extracting from stego file!');
			}
		});
	});
});