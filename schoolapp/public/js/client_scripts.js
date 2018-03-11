function edit(){
	if($("#table-edition select")[0].selectedIndex != 0){
		$.ajax({
			type : "POST",
			url : "/edit",
			data : JSON.stringify({
									dataSelected : $("#table-edition select")[0].selectedIndex,
									dataSelectedPage : $("div.header-menu ul li.header-menu-clicked").index(),
									sessionKey : localStorage.getItem("session-key")
									}),
			dataType : "json",
			contentType : "application/json",
			success : function(data){
				document.getElementById("table-edition-choosing").innerHTML = data.tableEditionDataEditBlock;
			}
		});
	}
}
function applyEditionUpdate(e, index){
	e.blur();
	var array = [];
	if(index == 1){
		array[0] = document.getElementById("table-data").
								getElementsByTagName("table")[0].
								getElementsByTagName("tr")[1].
								getElementsByTagName("td")[0].innerHTML;
		for(let i = 1; i < document.getElementById("table-data").
									getElementsByTagName("table")[0].
									getElementsByTagName("tr")[1].
									getElementsByTagName("td").length - 1; i++){
			array[i] = document.getElementById("table-data").
									getElementsByTagName("table")[0].
									getElementsByTagName("tr")[1].
									getElementsByTagName("td")[i].getElementsByTagName("input")[0].value;
		}
	}else{
		array[0] = document.getElementById("table-data").
								getElementsByTagName("table")[0].
								getElementsByTagName("tr")[1].
								getElementsByTagName("td")[0].innerHTML;
		for(let i = 1; i < document.getElementById("table-data").
									getElementsByTagName("table")[0].
									getElementsByTagName("tr")[1].
									getElementsByTagName("td").length; i++){
			array[i] = document.getElementById("table-data").
									getElementsByTagName("table")[0].
									getElementsByTagName("tr")[1].
									getElementsByTagName("td")[i].getElementsByTagName("input")[0].value;
		}
	}
	$.ajax({
		type : "POST",
		url : "/applyEditionUpdate",
		data : JSON.stringify({
				data : array,
				selectedPage : index}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			$("div.header-menu ul li:eq(" + data.index + ")").click();
		}
	});
}
function applyEditionDelete(e, index){
	e.blur();
	switch(index){
		case 0:
			$.ajax({
				type : "POST",
				url : "/applyEditionDelete",
				data : JSON.stringify({
					id : document.getElementById("table-edition-choosing").getElementsByTagName("input")[0].value,
					selectedPage : 0
				}),
				dataType : "json",
				contentType : "application/json",
				success : function(data){
					document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
				}
			});
			break;
		case 2:
			$.ajax({
				type : "POST",
				url : "/applyEditionDelete",
				data : JSON.stringify({
					id : document.getElementById("table-edition-choosing").getElementsByTagName("input")[0].value,
					selectedPage : 2
				}),
				dataType : "json",
				contentType : "application/json",
				success : function(data){
					document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
				}
			});
			break;
		case 3:
			$.ajax({
				type : "POST",
				url : "/applyEditionDelete",
				data : JSON.stringify({
					id : document.getElementById("table-edition-choosing").getElementsByTagName("input")[0].value,
					selectedPage : 3
				}),
				dataType : "json",
				contentType : "application/json",
				success : function(data){
					document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
				}
			});
			break;
	}
}
function applyEditionAdd(e, index){
	e.blur();
	switch(index){
		case 0:
			$.ajax({
				type : "POST",
				url : "/applyEditionAdd",
				data : JSON.stringify({
					firstName : document.getElementById("table-edition-choosing").getElementsByTagName("input")[0].value,
					secondName : document.getElementById("table-edition-choosing").getElementsByTagName("input")[1].value,
					birthday : document.getElementById("table-edition-choosing").getElementsByTagName("input")[2].value,
					class1 : document.getElementById("table-edition-choosing").getElementsByTagName("input")[3].value,
					letterOfClass : document.getElementById("table-edition-choosing").getElementsByTagName("input")[4].value,
					address : document.getElementById("table-edition-choosing").getElementsByTagName("input")[5].value,
					selectedPage : 0
				}),
				dataType : "json",
				contentType : "application/json",
				success : function(data){
					document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
				}
			});
			break;
		case 2:
			$.ajax({
				type : "POST",
				url : "/applyEditionAdd",
				data : JSON.stringify({
					name : document.getElementById("table-edition-choosing").getElementsByTagName("input")[0].value,
					count : document.getElementById("table-edition-choosing").getElementsByTagName("input")[1].value,
					selectedPage : 2
				}),
				dataType : "json",
				contentType : "application/json",
				success : function(data){
					document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
				}
			});
			break;
		case 3:
			$.ajax({
				type : "POST",
				url : "/applyEditionAdd",
				data : JSON.stringify({
					firstName : document.getElementById("table-edition-choosing").getElementsByTagName("input")[0].value,
					secondName : document.getElementById("table-edition-choosing").getElementsByTagName("input")[1].value,
					age : document.getElementById("table-edition-choosing").getElementsByTagName("input")[2].value,
					position : document.getElementById("table-edition-choosing").getElementsByTagName("input")[3].value,
					selectedPage : 3
				}),
				dataType : "json",
				contentType : "application/json",
				success : function(data){
					document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
				}
			});
			break;
	}
}
function sort(){
	if($("#table-filter select")[0].selectedIndex != 0){
		$.ajax({
			type : "POST",
			url : "/sort",
			data : JSON.stringify({
									dataSelected : $("#table-filter select")[0].selectedIndex,
									dataSelectedPage : $("div.header-menu ul li.header-menu-clicked").index()
									}),
			dataType : "json",
			contentType : "application/json",
			success : function(data){
				document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
			}
		});
	}
}
function dinamicSearch(){
	if($("#table-filter select")[1].selectedIndex != 0){
		$.ajax({
			type : "POST",
			url : "/dinamicSearch",
			data : JSON.stringify({
									dataSelected : $("#table-filter select")[1].selectedIndex,
									dataSearching : $("#table-filter input")[0].value,
									dataSelectedPage : $("div.header-menu ul li.header-menu-clicked").index()
									}),
			dataType : "json",
			contentType : "application/json",
			success : function(data){
				document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
			}
		});
	}
}
function dinamicSearchEditing(index){
	if($("#table-edition select")[0].selectedIndex != 0){
		$.ajax({
			type : "POST",
			url : "/dinamicSearchEditing",
			data : JSON.stringify({
									dataSelectedPage : index,
									dataSearching : $("#table-edition-choosing input")[0].value,
									}),
			dataType : "json",
			contentType : "application/json",
			success : function(data){
				document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
			}
		});
	}
}
$("div.header-menu ul li:eq(0)").click(function(e){
	$.ajax({
		type : "POST",
		url : "/students",
		data : JSON.stringify({sessionKey : localStorage.getItem("session-key")}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			$("title")[0].innerHTML = $("div.header-menu ul li:eq(0)")[0].innerHTML;
			document.getElementById("greeting-label").style.display = "none";
			document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
			document.getElementById("table-filter").innerHTML = data.tableFilterData;
			document.getElementById("table-data").getElementsByTagName("table")[0].style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("table-filter").style.backgroundColor = "#ffffff";
			document.getElementById("table-filter").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("auth-form-wrapper").style.boxShadow = "";
			document.getElementById("auth-form-wrapper").style.backgroundColor = "";
			document.getElementById("auth-form-wrapper").innerHTML = "";
			if(data.userAuth){
				document.getElementById("table-edition").innerHTML = data.tableEditionData;
				document.getElementById("table-edition").style.backgroundColor = "#ffffff";
				document.getElementById("table-edition").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
				
			}
		}
	});
});
$("div.header-menu ul li:eq(1)").click(function(e){
	$.ajax({
		type : "POST",
		url : "/student_progress",
		data : JSON.stringify({sessionKey : localStorage.getItem("session-key")}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			$("title")[0].innerHTML = $("div.header-menu ul li:eq(1)")[0].innerHTML;
			document.getElementById("greeting-label").style.display = "none";
			document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
			document.getElementById("table-filter").innerHTML = data.tableFilterData;
			document.getElementById("table-data").getElementsByTagName("table")[0].style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("table-filter").style.backgroundColor = "#ffffff";
			document.getElementById("table-filter").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("auth-form-wrapper").style.boxShadow = "";
			document.getElementById("auth-form-wrapper").style.backgroundColor = "";
			document.getElementById("auth-form-wrapper").innerHTML = "";
			if(data.userAuth){
				document.getElementById("table-edition").innerHTML = data.tableEditionData;
				document.getElementById("table-edition").style.backgroundColor = "#ffffff";
				document.getElementById("table-edition").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
				
			}
		}
	});
});
$("div.header-menu ul li:eq(2)").click(function(e){
	$.ajax({
		type : "POST",
		url : "/household_equipment",
		data : JSON.stringify({sessionKey : localStorage.getItem("session-key")}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			$("title")[0].innerHTML = $("div.header-menu ul li:eq(2)")[0].innerHTML;
			document.getElementById("greeting-label").style.display = "none";
			document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
			document.getElementById("table-filter").innerHTML = data.tableFilterData;
			document.getElementById("table-data").getElementsByTagName("table")[0].style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("table-filter").style.backgroundColor = "#ffffff";
			document.getElementById("table-filter").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("auth-form-wrapper").style.boxShadow = "";
			document.getElementById("auth-form-wrapper").style.backgroundColor = "";
			document.getElementById("auth-form-wrapper").innerHTML = "";
			if(data.userAuth){
				document.getElementById("table-edition").innerHTML = data.tableEditionData;
				document.getElementById("table-edition").style.backgroundColor = "#ffffff";
				document.getElementById("table-edition").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
				
			}
		}
	});
});
$("div.header-menu ul li:eq(3)").click(function(e){
	$.ajax({
		type : "POST",
		url : "/employees",
		data : JSON.stringify({sessionKey : localStorage.getItem("session-key")}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			$("title")[0].innerHTML = $("div.header-menu ul li:eq(3)")[0].innerHTML;
			document.getElementById("greeting-label").style.display = "none";
			document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = data.tableData;
			document.getElementById("table-filter").innerHTML = data.tableFilterData;
			document.getElementById("table-data").getElementsByTagName("table")[0].style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("table-filter").style.backgroundColor = "#ffffff";
			document.getElementById("table-filter").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
			document.getElementById("auth-form-wrapper").style.boxShadow = "";
			document.getElementById("auth-form-wrapper").style.backgroundColor = "";
			document.getElementById("auth-form-wrapper").innerHTML = "";
			if(data.userAuth){
				document.getElementById("table-edition").innerHTML = data.tableEditionData;
				document.getElementById("table-edition").style.backgroundColor = "#ffffff";
				document.getElementById("table-edition").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
				
			}
		}
	});
});
$("#enter-button").click(function(e){
	$("title")[0].innerHTML = $("#enter-button span")[0].innerHTML;
	var sessionKey = localStorage.getItem("session-key");
	$.ajax({
		type : "POST",
		url : "/auth",
		data : JSON.stringify({sessionKey : sessionKey}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			if(!data.success){
				document.getElementById("greeting-label").style.display = "none";
				document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = "";
				document.getElementById("table-filter").innerHTML = "";
				document.getElementById("table-data").getElementsByTagName("table")[0].style.boxShadow = "";
				document.getElementById("table-filter").style.backgroundColor = "";
				document.getElementById("table-filter").style.boxShadow = "";
				document.getElementById("auth-form-wrapper").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
				document.getElementById("auth-form-wrapper").style.backgroundColor = "#ffffff";
				document.getElementById("auth-form-wrapper").innerHTML = data.dataAuthForm;
			}else{
				localStorage.removeItem("session-key");
				$("#header-menu-nickname")[0].innerHTML = "Гость";
				$("#enter-button")[0].innerHTML = "<span>Войти</span>";
				document.getElementById("greeting-label").style.display = "none";
				document.getElementById("table-data").getElementsByTagName("table")[0].innerHTML = "";
				document.getElementById("table-filter").innerHTML = "";
				document.getElementById("table-data").getElementsByTagName("table")[0].style.boxShadow = "";
				document.getElementById("table-filter").style.backgroundColor = "";
				document.getElementById("table-filter").style.boxShadow = "";
				document.getElementById("table-edition").innerHTML = "";
				document.getElementById("table-edition").style.backgroundColor = "";
				document.getElementById("table-edition").style.boxShadow = "";
				document.getElementById("auth-form-wrapper").style.boxShadow = "1px 1px 1px 1px #b0b0b0";
				document.getElementById("auth-form-wrapper").style.backgroundColor = "#ffffff";
				document.getElementById("auth-form-wrapper").innerHTML = data.dataAuthForm;
			}
		}
	});
});
function sendAuthData(e){
	e.blur();
	var login = $("#auth-data-login")[0].value;
	var pass = $("#auth-data-pass")[0].value;
	$("#auth-data-auth-fail-message")[0].innerHTML = " ";
	$.ajax({
		type : "POST",
		url : "/auth/identif",
		data : JSON.stringify({login : login, pass : pass}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			if(!data.success){
				$("#auth-data-auth-fail-message")[0].innerHTML = data.message;
				//console.log(data.message + ", ключ сессии: " + data.sessionKey + " success: " + data.success);
			}else{
				//console.log(data.message + ", ключ сессии: " + data.sessionKey + " success: " + data.success);
				localStorage.setItem("session-key", data.sessionKey);
				$("#header-menu-nickname")[0].innerHTML = data.nickname;
				$("#enter-button")[0].innerHTML = "<span>Выйти</span>";
				$("div.header-menu ul li:eq(0)").click();
			}			
		}
	});
}
function elemFocused(e){
	if(e.className == "header-menu"){
		e.style.backgroundColor = "#ffa100";
	}
}
function elemLostFocused(e){
	if(e.className == "header-menu"){
		e.style.backgroundColor = "#ffc100";
	}
}
function menuItemClicked(e){
	var enterButton = document.getElementById("enter-button");
	enterButton.style.backgroundColor = "#ffc100";
	enterButton.className = "header-menu";
	enterButton.style.boxShadow = "";
	var items = document.getElementsByTagName("ul")[0];
	for(let i = 0; i < items.children.length; i++){
		items.children[i].style.backgroundColor = "#ffc100";
		items.children[i].className = "header-menu";
		items.children[i].style.boxShadow = "";
	}
	e.style.backgroundColor = "#ffffff";
	e.className = "header-menu-clicked";
	e.style.boxShadow = "0 2px #008040";
}
window.onload = function(){
	var sessionKey = localStorage.getItem("session-key");
	$.ajax({
		type : "POST",
		url : "/auth",
		data : JSON.stringify({sessionKey : sessionKey}),
		dataType : "json",
		contentType : "application/json",
		success : function(data){
			if(!data.success){
			}else{
				$("#header-menu-nickname")[0].innerHTML = data.nickname;
				$("#enter-button")[0].innerHTML = "<span>Выйти</span>";
			}
		}
	});
};