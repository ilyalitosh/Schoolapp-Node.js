var express = require("express");
var fs = require("fs");
var bp = require("body-parser");
var db = require("mysql");
var kg = require("./app_modules/session-key");

var app = express();
var urlEncodedParser = bp.urlencoded({extended:false});
var jsonParser = bp.json();
var dbConnection = db.createConnection({
	host : "localhost",
	user : "root",
	password : "nikomunegovorit",
	database : "school_db"
});

app.use(function(request, response, next){
	if(request.url != "/" &&
	   request.url != "/style.css" &&
	   request.url != "/students" && 
	   request.url != "/student_progress" && 
	   request.url != "/household_equipment" &&
	   request.url != "/employees" &&
	   request.url != "/dinamicSearch" &&
	   request.url != "/sort" &&
	   request.url != "/auth" &&
	   request.url != "/client_scripts.js" &&
	   request.url != "/auth/identif" &&
	   request.url != "/edit" &&
	   request.url != "/applyEditionAdd" &&
	   request.url != "/applyEditionDelete" &&
	   request.url != "/dinamicSearchEditing" &&
	   request.url != "/applyEditionUpdate"){
		var newData = fs.readFileSync("./public/error.html", "utf8");
		response.end(newData);
	}
	next();
});
app.get("/", function(request, response){
	console.log("[Server]: запрос типа " + request.method);
	fs.readFile("./public/index.html", function(error, data){
		response.end(data);
	});
});
app.get("/style.css", function(request, response){
	response.writeHead(200, {"Content-Type": "text/css"});
    response.write(fs.readFileSync("./public/style.css", "utf8"));
    response.end();
});
app.get("/client_scripts.js", function(request, response){
	response.writeHead(200, {"Content-Type": "text/javascript"});
    response.write(fs.readFileSync("./public/js/client_scripts.js", "utf8"));
    response.end();
});
app.post("/auth", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /auth");
	var authForm = "<tr>" + 
						"<td colspan=\"2\">" + 
							"<label>Логин:</label><br>" +
							"<input type=\"text\" id=\"auth-data-login\" style=\"width:100%;height:30px;\"></input>" + 
						"</td>" + 
					"</tr>" + 
					"<tr>" +
						"<td colspan=\"2\">" + 
							"<label >Пароль:</label><br>" + 
							"<input type=\"password\" id=\"auth-data-pass\" style=\"width:100%;height:30px;\"></input>" + 
						"</td>" + 
					"</tr>" +
					"<tr>" + 
						"<td colspan=\"2\">" + 
							"<label id=\"auth-data-auth-fail-message\" style=\"color:red;\"></label>" + 
						"</td>" +  
					"</tr>" + 
					"<tr>" + 
						"<td style=\"width:40%;\">" + 
							"<input type=\"button\" id=\"auth-data-send-button\" style=\"width:100%;height:40px;margin-top:5px;cursor:pointer;\" value=\"Вход\" onclick=\"sendAuthData(this)\"/>" + 
						"</td>" + 
						"<td style=\"width:60%;\">" + 
							"<input type=\"button\" style=\"width:100%;height:40px;margin-top:5px;cursor:pointer;\" value=\"Регистрация\" onclick=\"this.blur()\"/>" + 
						"</td>" + 
					"</tr>";
	dbConnection.query("SELECT session_key, login FROM accounts", function(error, result, fields){
		for(let i = 0; i < result.length; i++){
			if(result[i].session_key == request.body.sessionKey){
				response.json({dataAuthForm : authForm, success : true, nickname : result[i].login});
				break;
			}
			if(i == result.length - 1){
				response.json({dataAuthForm : authForm, success : false});
			}
		}
	});
});
app.post("/auth/identif", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /auth/identif");
	dbConnection.query("SELECT * FROM accounts", function(error, result, fields){
		if(error){
			console.log("Error");
		}else{
			for(let i = 0; i < result.length; i++){
				if(result[i].login == request.body.login){
					if(result[i].password == request.body.pass){
						if(result[i].active == 1){
							var key = kg.generateSessionKey();
							dbConnection.query("UPDATE accounts SET session_key=\"" + key + "\" WHERE id=" + result[i].id);
							response.json({message : "Успешная авторизация", nickname : result[i].login, sessionKey : key, success : true});
							break;
						}else{
							response.json({message : "Аккаунт не активирован, обратитесь к администратору", success : false});
							break;
						}
					}else{
						response.json({message : "Неверный пароль", success : false});
						break;
					}
				}
				if(i == result.length - 1){
					response.json({message : "Пользователя не существует", success : false});
				}
			}
		}
	});
});
app.post("/applyEditionDelete", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /applyEditionDelete");
	switch(request.body.selectedPage){
		case 0:
			var tableData = "<tr><th>id</th>" + 
							"<th>Имя</th>" +
							"<th>Фамилия</th>" +
							"<th>Дата рождения</th>" +
							"<th>Класс</th><th>Буква</th>" +
							"<th>Домашний адрес</th></tr>";
			dbConnection.query("DELETE FROM students WHERE id=" + request.body.id);
			dbConnection.query("DELETE FROM student_progress WHERE id=" + request.body.id);
			dbConnection.query("SELECT * FROM students", function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].first_name + "</td>" +
										"<td>" + result[i].second_name + "</td>" +
										"<td>" + result[i].birthday + "</td>" +
										"<td>" + result[i].class + "</td>" +
										"<td>" + result[i].letter_of_class + "</td>" + 
										"<td>" + result[i].address + "</td>" +
									"</tr>";
					}
					response.json({
								tableData : tableData,
							});
				}
			});
			break;
		case 2:
			var tableData = "<tr><th>id</th>" + 
							"<th>Наименование</th>" +
							"<th>Кол-во</th></tr>";
			dbConnection.query("DELETE FROM household_equipment WHERE id=" + request.body.id);
			dbConnection.query("SELECT * FROM household_equipment", function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].Name_of_equipment + "</td>" +
										"<td>" + result[i].Amount + "</td>" +
									"</tr>";
					}
					response.json({
								tableData : tableData,
							});
				}
			});
			break;
		case 3:
			var tableData = "<tr><th>id</th>" + 
							"<th>Имя</th>" +
							"<th>Фамилия</th>" +
							"<th>Возраст</th>" +
							"<th>Должность</th></tr>";
			dbConnection.query("DELETE FROM employees WHERE id=" + request.body.id);
			dbConnection.query("SELECT * FROM employees", function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].First_name1 + "</td>" +
										"<td>" + result[i].Second_name1 + "</td>" + 
										"<td>" + result[i].Age + "</td>" + 
										"<td>" + result[i].Position + "</td>" + 
									"</tr>";
					}
					response.json({
								tableData : tableData,
							});
				}
			});
			break;
	}
});
app.post("/applyEditionAdd", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /applyEditionAdd");
	switch(request.body.selectedPage){
		case 0:
			var tableData = "<tr><th>id</th>" + 
					"<th>Имя</th>" +
					"<th>Фамилия</th>" +
					"<th>Дата рождения</th>" +
					"<th>Класс</th><th>Буква</th>" +
					"<th>Домашний адрес</th></tr>";
			dbConnection.query("INSERT INTO students(first_name, second_name, birthday, class, letter_of_class, address)"
			+ " VALUES(\"" +
			request.body.firstName + "\", \"" +
			request.body.secondName + "\", \"" +
			request.body.birthday + "\", " +
			request.body.class1 + ", \"" +
			request.body.letterOfClass + "\", \"" +
			request.body.address + "\")");
			dbConnection.query("INSERT INTO student_progress() VALUES()");
			dbConnection.query("SELECT * FROM students", function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].first_name + "</td>" +
										"<td>" + result[i].second_name + "</td>" +
										"<td>" + result[i].birthday + "</td>" +
										"<td>" + result[i].class + "</td>" +
										"<td>" + result[i].letter_of_class + "</td>" + 
										"<td>" + result[i].address + "</td>" +
									"</tr>";
					}
					response.json({
								tableData : tableData,
							});
				}
			});
			break;
		case 2:
			var tableData = "<tr><th>id</th>" + 
					"<th>Наименование</th>" +
					"<th>Кол-во</th></tr>";
			dbConnection.query("INSERT INTO household_equipment(Name_of_equipment, Amount)"
			+ " VALUES(\"" +
			request.body.name + "\", " +
			request.body.count + ")");
			dbConnection.query("SELECT * FROM household_equipment", function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].Name_of_equipment + "</td>" +
										"<td>" + result[i].Amount + "</td>" +
									"</tr>";
					}
					response.json({
								tableData : tableData,
							});
				}
			});
			break;
		case 3:
			var tableData = "<tr><th>id</th>" + 
							"<th>Имя</th>" +
							"<th>Фамилия</th>" +
							"<th>Возраст</th>" +
							"<th>Должность</th></tr>";
			dbConnection.query("INSERT INTO employees(First_name1, Second_name1, Age, Position)"
			+ " VALUES(\"" +
			request.body.firstName + "\", \"" +
			request.body.secondName + "\", " +
			request.body.age + ", \"" +
			request.body.position + "\")");
			dbConnection.query("SELECT * FROM employees", function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].First_name1 + "</td>" +
										"<td>" + result[i].Second_name1 + "</td>" + 
										"<td>" + result[i].Age + "</td>" + 
										"<td>" + result[i].Position + "</td>" + 
									"</tr>";
					}
					response.json({
								tableData : tableData,
							});
				}
			});
			break;
	}
});
app.post("/students", jsonParser, function(request, response){
	console.log("[Server]: получаю GET запрос /students");
	var tableFilterData = "<label>Сортировка по:</label><br>" + 
						"<select onchange=\"sort()\">" + 
							"<option></option>" +
							"<option>id(убыв.)</option>" +
							"<option>id(возр.)</option>" +
							"<option>имени(убыв.)</option>" +
							"<option>имени(возр.)</option>" +
							"<option>фамилии(убыв.)</option>" +
							"<option>фамилии(возр.)</option>" +
							"<option>классу(убыв.)</option>" +
							"<option>классу(возр.)</option>" +
						"</select>" +
						"<br>" +
						"<label>Найти по:</label>" +
						"<select>" +
							"<option></option>" +
							"<option>id</option>" +
							"<option>имени</option>" +
							"<option>фамилии</option>" +
							"<option>классу</option>" +
						"</select><br>" +
						"<input type=\"text\" style=\"margin-top:2px;width:100%;\" placeholder=\"Начните вводить\" oninput=\"dinamicSearch()\">";
	var tableData = "<tr><th>id</th>" + 
					"<th>Имя</th>" +
					"<th>Фамилия</th>" +
					"<th>Дата рождения</th>" +
					"<th>Класс</th><th>Буква</th>" +
					"<th>Домашний адрес</th></tr>";
	var tableEditionData = "<label>Выберите:</label><br>" + 
							"<select onchange=\"edit()\">" + 
								"<option></option>" + 
								"<option>изменить</option>" + 
								"<option>добавить</option>" +
								"<option>удалить</option>" +
							"</select>" + 
							"<div id=\"table-edition-choosing\">" +
								
							"</div>";
	var userAuth = false;
	dbConnection.query("SELECT * FROM students", function(error, result, fields){
		if(error){
			console.log("error");
		}else{
			for(let i = 0; i < result.length; i++){
				tableData += "<tr>" +
								"<td>" + result[i].id + "</td>" +
								"<td>" + result[i].first_name + "</td>" +
								"<td>" + result[i].second_name + "</td>" +
								"<td>" + result[i].birthday + "</td>" +
								"<td>" + result[i].class + "</td>" +
								"<td>" + result[i].letter_of_class + "</td>" + 
								"<td>" + result[i].address + "</td>" +
							"</tr>";
			}
			dbConnection.query("SELECT session_key FROM accounts", function(error, result, fields){
				if(error){
					console.log("Error");
				}else{
					for(let i = 0; i < result.length; i++){
						if(result[i].session_key == request.body.sessionKey){
							userAuth = true;
							break;
						}
					}
					if(!userAuth){
						tableEditionData = " ";
					}
					response.json({
						tableData : tableData,
						tableFilterData : tableFilterData,
						tableEditionData : tableEditionData,
						userAuth : userAuth
					});
				}
			});
		}
	});
});
app.post("/student_progress", jsonParser, function(request, response){
	console.log("[Server]: получаю GET запрос /student_progress");
	var tableFilterData = "<label>Сортировка по:</label><br>" + 
						"<select onchange=\"sort()\">" + 
							"<option></option>" +
							"<option>id(убыв.)</option>" +
							"<option>id(возр.)</option>" +
							"<option>среднему(убыв.)</option>" +
							"<option>среднему(возр.)</option>" +
						"</select>" +
						"<br>" +
						"<label>Найти по:</label>" +
						"<select>" +
							"<option></option>" +
							"<option>id</option>" +
							"<option>среднему</option>" +
						"</select><br>" +
						"<input type=\"text\" style=\"margin-top:2px;width:100%;\" placeholder=\"Начните вводить\" oninput=\"dinamicSearch()\">";
	var tableData = "<tr><th>id</th>" + 
					"<th>Математика</th>" +
					"<th>Русск. яз.</th>" +
					"<th>Бел. яз.</th>" +
					"<th>Русск. лит.</th>" + 
					"<th>Бел. лит.</th>" +
					"<th>Физ-ра</th>" + 
					"<th>Ин. яз.</th>" + 
					"<th>История</th>" + 
					"<th>Среднее</th></tr>";
	var tableEditionData = "<label>Выберите:</label><br>" + 
							"<select onchange=\"edit()\">" + 
								"<option></option>" + 
								"<option>изменить</option>" + 
							"</select>" + 
							"<div id=\"table-edition-choosing\">" +
								
							"</div>";
	var userAuth = false;
	dbConnection.query("SELECT * FROM student_progress", function(error, result, fields){
		if(error){
			console.log("error");
		}else{
			for(let i = 0; i < result.length; i++){
				tableData += "<tr>" +
								"<td>" + result[i].id + "</td>" +
								"<td>" + result[i].Maths + "</td>" +
								"<td>" + result[i].Russian + "</td>" +
								"<td>" + result[i].Belarussian + "</td>" +
								"<td>" + result[i].Russian_literature + "</td>" +
								"<td>" + result[i].Belarussian_literature + "</td>" + 
								"<td>" + result[i].Physical_culture + "</td>" + 
								"<td>" + result[i].Foreign_language + "</td>" + 
								"<td>" + result[i].History + "</td>" + 
								"<td>" + result[i].Average_value + "</td>" + 
							"</tr>";
			}
			dbConnection.query("SELECT session_key FROM accounts", function(error, result, fields){
				if(error){
					console.log("Error");
				}else{
					for(let i = 0; i < result.length; i++){
						if(result[i].session_key == request.body.sessionKey){
							userAuth = true;
							break;
						}
					}
					if(!userAuth){
						tableEditionData = " ";
					}
					response.json({
						tableData : tableData,
						tableFilterData : tableFilterData,
						tableEditionData : tableEditionData,
						userAuth : userAuth
					});
				}
			});
		}
	});
});
app.post("/household_equipment", jsonParser, function(request, response){
	console.log("[Server]: получаю GET запрос /household_equipment");
	var tableFilterData = "<label>Сортировка по:</label><br>" + 
						"<select onchange=\"sort()\">" + 
							"<option></option>" +
							"<option>id(убыв.)</option>" +
							"<option>id(возр.)</option>" +
							"<option>наименованию(убыв.)</option>" +
							"<option>наименованию(возр.)</option>" +
							"<option>кол-ву(убыв.)</option>" +
							"<option>кол-ву(возр.)</option>" +
						"</select>" +
						"<br>" +
						"<label>Найти по:</label>" +
						"<select>" +
							"<option></option>" +
							"<option>id</option>" +
							"<option>наименованию</option>" +
							"<option>кол-ву</option>" +
						"</select><br>" +
						"<input type=\"text\" style=\"margin-top:2px;width:100%;\" placeholder=\"Начните вводить\" oninput=\"dinamicSearch()\">";
	var tableData = "<tr><th>id</th>" + 
					"<th>Наименование</th>" +
					"<th>Кол-во</th></tr>";
	var tableEditionData = "<label>Выберите:</label><br>" + 
							"<select onchange=\"edit()\">" + 
								"<option></option>" + 
								"<option>изменить</option>" + 
								"<option>добавить</option>" +
								"<option>удалить</option>" +
							"</select>" + 
							"<div id=\"table-edition-choosing\">" +
								
							"</div>";
	var userAuth = false;
	dbConnection.query("SELECT * FROM household_equipment", function(error, result, fields){
		if(error){
			console.log("error");
		}else{
			for(let i = 0; i < result.length; i++){
				tableData += "<tr>" +
								"<td>" + result[i].id + "</td>" +
								"<td>" + result[i].Name_of_equipment + "</td>" +
								"<td>" + result[i].Amount + "</td>" +
							"</tr>";
			}
			dbConnection.query("SELECT session_key FROM accounts", function(error, result, fields){
				if(error){
					console.log("Error");
				}else{
					for(let i = 0; i < result.length; i++){
						if(result[i].session_key == request.body.sessionKey){
							userAuth = true;
							break;
						}
					}
					if(!userAuth){
						tableEditionData = " ";
					}
					response.json({
						tableData : tableData,
						tableFilterData : tableFilterData,
						tableEditionData : tableEditionData,
						userAuth : userAuth
					});
				}
			});
		}
	});
});
app.post("/employees", jsonParser, function(request, response){
	console.log("[Server]: получаю GET запрос /employees");
	var tableFilterData = "<label>Сортировка по:</label><br>" + 
						"<select onchange=\"sort()\">" + 
							"<option></option>" +
							"<option>id(убыв.)</option>" +
							"<option>id(возр.)</option>" +
							"<option>имени(убыв.)</option>" +
							"<option>имени(возр.)</option>" +
							"<option>фамилии(убыв.)</option>" +
							"<option>фамилии(возр.)</option>" +
							"<option>возрасту(убыв.)</option>" +
							"<option>возрасту(возр.)</option>" +
							"<option>должности(убыв.)</option>" +
							"<option>должности(возр.)</option>" +
						"</select>" +
						"<br>" +
						"<label>Найти по:</label>" +
						"<select>" +
							"<option></option>" +
							"<option>id</option>" +
							"<option>имени</option>" +
							"<option>фамилии</option>" +
							"<option>возрасту</option>" +
							"<option>должности</option>" +
						"</select><br>" +
						"<input type=\"text\" style=\"margin-top:2px;width:100%;\" placeholder=\"Начните вводить\" oninput=\"dinamicSearch()\">";
	var tableData = "<tr><th>id</th>" + 
					"<th>Имя</th>" +
					"<th>Фамилия</th>" +
					"<th>Возраст</th>" +
					"<th>Должность</th></tr>";
	var tableEditionData = "<label>Выберите:</label><br>" + 
							"<select onchange=\"edit()\">" + 
								"<option></option>" + 
								"<option>изменить</option>" + 
								"<option>добавить</option>" +
								"<option>удалить</option>" +
							"</select>" + 
							"<div id=\"table-edition-choosing\">" +
								
							"</div>";
	var userAuth = false;
	dbConnection.query("SELECT * FROM employees", function(error, result, fields){
		if(error){
			console.log("error");
		}else{
			for(let i = 0; i < result.length; i++){
				tableData += "<tr>" +
								"<td>" + result[i].id + "</td>" +
								"<td>" + result[i].First_name1 + "</td>" +
								"<td>" + result[i].Second_name1 + "</td>" + 
								"<td>" + result[i].Age + "</td>" + 
								"<td>" + result[i].Position + "</td>" + 
							"</tr>";
			}
			dbConnection.query("SELECT session_key FROM accounts", function(error, result, fields){
				if(error){
					console.log("Error");
				}else{
					for(let i = 0; i < result.length; i++){
						if(result[i].session_key == request.body.sessionKey){
							userAuth = true;
							break;
						}
					}
					if(!userAuth){
						tableEditionData = " ";
					}
					response.json({
						tableData : tableData,
						tableFilterData : tableFilterData,
						tableEditionData : tableEditionData,
						userAuth : userAuth
					});
				}
			});
		}
	});
});

app.post("/edit", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /edit");
	var tableEditionDataEditBlock = "";
		switch(request.body.dataSelectedPage){
			case 0: 
				
				switch(request.body.dataSelected){
					case 1: 
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" oninput=\"dinamicSearchEditing(0)\" placeholder=\"введите id\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionUpdate(this, 0)\" value=\"Изменить\"></input>";
						break;
					case 2:
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"имя\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"фамилия\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"дата рождения\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"класс\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"буква\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"дом. адрес\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionAdd(this, 0)\" value=\"Добавить\"></input>";
						break;
					case 3: 
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"введите id\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionDelete(this, 0)\" value=\"Удалить\"></input>";
						break;
				}
				response.json({tableEditionDataEditBlock : tableEditionDataEditBlock});
				break;
			case 1:
				
				switch(request.body.dataSelected){
					case 1: 
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" oninput=\"dinamicSearchEditing(1)\" placeholder=\"введите id\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionUpdate(this, 1)\" value=\"Изменить\"></input>";
						break;
				}
				response.json({tableEditionDataEditBlock : tableEditionDataEditBlock});
				break;
			case 2:
				
				switch(request.body.dataSelected){
					case 1: 
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" oninput=\"dinamicSearchEditing(2)\" placeholder=\"введите id\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionUpdate(this, 2)\" value=\"Изменить\"></input>";
						break;
					case 2:
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"наименование\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"кол-во\"></input><br>" +  
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionAdd(this, 2)\" value=\"Добавить\"></input>";
						break;
					case 3: 
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"введите id\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionDelete(this, 2)\" value=\"Удалить\"></input>";
						break;
				}
				response.json({tableEditionDataEditBlock : tableEditionDataEditBlock});
				break;
			case 3:
				
				switch(request.body.dataSelected){
					case 1: 
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" oninput=\"dinamicSearchEditing(3)\" placeholder=\"введите id\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionUpdate(this, 3)\" value=\"Изменить\"></input>";
						break;
					case 2:
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"имя\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"фамилия\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"возраст\"></input><br>" + 
													"<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"должность\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionAdd(this, 3)\" value=\"Добавить\"></input>";
						break;
					case 3: 
						tableEditionDataEditBlock = "<input type=\"text\" style=\"margin-top:5px;width:100%;\" placeholder=\"введите id\"></input><br>" + 
													"<input type=\"button\" style=\"margin-top:5px;\" onclick=\"applyEditionDelete(this, 3)\" value=\"Удалить\"></input>";
						break;
				}
				response.json({tableEditionDataEditBlock : tableEditionDataEditBlock});
				break;
		}
});

app.post("/sort", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /sort");
	var query = "";
	var tableData = "";
	switch(request.body.dataSelectedPage){
		case 0: 
			tableData = "<tr><th>id</th>" + 
						"<th>Имя</th>" +
						"<th>Фамилия</th>" +
						"<th>Дата рождения</th>" +
						"<th>Класс</th><th>Буква</th>" +
						"<th>Домашний адрес</th></tr>";
			query = "SELECT * FROM students";
			switch(request.body.dataSelected){
				case 1: query += " ORDER BY id DESC"; break;
				case 2: query += " ORDER BY id ASC"; break;
				case 3: query += " ORDER BY first_name DESC"; break;
				case 4: query += " ORDER BY first_name ASC"; break;
				case 5: query += " ORDER BY second_name DESC"; break;
				case 6: query += " ORDER BY second_name ASC"; break;
				case 7: query += " ORDER BY class DESC"; break;
				case 8: query += " ORDER BY class ASC"; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].first_name + "</td>" +
										"<td>" + result[i].second_name + "</td>" +
										"<td>" + result[i].birthday + "</td>" +
										"<td>" + result[i].class + "</td>" +
										"<td>" + result[i].letter_of_class + "</td>" + 
										"<td>" + result[i].address + "</td>" +
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 1:
			tableData = "<tr><th>id</th>" + 
					"<th>Математика</th>" +
					"<th>Русск. яз.</th>" +
					"<th>Бел. яз.</th>" +
					"<th>Русск. лит.</th>" + 
					"<th>Бел. лит.</th>" +
					"<th>Физ-ра</th>" + 
					"<th>Ин. яз.</th>" + 
					"<th>История</th>" + 
					"<th>Среднее</th></tr>";
			query = "SELECT * FROM student_progress";
			switch(request.body.dataSelected){
				case 1: query += " ORDER BY id DESC"; break;
				case 2: query += " ORDER BY id ASC"; break;
				case 3: query += " ORDER BY Average_value DESC"; break;
				case 4: query += " ORDER BY Average_value ASC"; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].Maths + "</td>" +
										"<td>" + result[i].Russian + "</td>" +
										"<td>" + result[i].Belarussian + "</td>" +
										"<td>" + result[i].Russian_literature + "</td>" +
										"<td>" + result[i].Belarussian_literature + "</td>" + 
										"<td>" + result[i].Physical_culture + "</td>" + 
										"<td>" + result[i].Foreign_language + "</td>" + 
										"<td>" + result[i].History + "</td>" + 
										"<td>" + result[i].Average_value + "</td>" + 
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 2:
			tableData = "<tr><th>id</th>" + 
						"<th>Наименование</th>" +
						"<th>Кол-во</th></tr>";
			query = "SELECT * FROM household_equipment";
			switch(request.body.dataSelected){
				case 1: query += " ORDER BY id DESC"; break;
				case 2: query += " ORDER BY id ASC"; break;
				case 3: query += " ORDER BY Name_of_equipment DESC"; break;
				case 4: query += " ORDER BY Name_of_equipment ASC"; break;
				case 5: query += " ORDER BY Amount DESC"; break;
				case 6: query += " ORDER BY Amount ASC"; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].Name_of_equipment + "</td>" +
										"<td>" + result[i].Amount + "</td>" +
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 3:
			tableData = "<tr><th>id</th>" + 
						"<th>Имя</th>" +
						"<th>Фамилия</th>" +
						"<th>Возраст</th>" +
						"<th>Должность</th></tr>";
			query = "SELECT * FROM employees";
			switch(request.body.dataSelected){
				case 1: query += " ORDER BY id DESC"; break;
				case 2: query += " ORDER BY id ASC"; break;
				case 3: query += " ORDER BY First_name1 DESC"; break;
				case 4: query += " ORDER BY First_name1 ASC"; break;
				case 5: query += " ORDER BY Second_name1 DESC"; break;
				case 6: query += " ORDER BY Second_name1 ASC"; break;
				case 7: query += " ORDER BY Age DESC"; break;
				case 8: query += " ORDER BY Age ASC"; break;
				case 9: query += " ORDER BY Position DESC"; break;
				case 10: query += " ORDER BY Position ASC"; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].First_name1 + "</td>" +
										"<td>" + result[i].Second_name1 + "</td>" + 
										"<td>" + result[i].Age + "</td>" + 
										"<td>" + result[i].Position + "</td>" + 
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
	}
});
app.post("/applyEditionUpdate", jsonParser, function(request, response){
	var array = request.body.data;
	var query = "";
	switch(request.body.selectedPage){
		case 0:
			query = "UPDATE students SET first_name=\"" + array[1] + "\", second_name=\"" + array[2] + "\", birthday=\"" + array[3] + "\", class=" + array[4] + ", letter_of_class=\"" + array[5] + "\", address=\"" + array[6] + "\" WHERE id=" + array[0];
			dbConnection.query(query);
			break;
		case 1:
			var average = (new Number(array[1]) 
							+ new Number(array[2]) 
							+ new Number(array[3]) 
							+ new Number(array[4])
							+ new Number(array[5]) 
							+ new Number(array[6]) 
							+ new Number(array[7])
							+ new Number(array[8]))/8;
			query = "UPDATE student_progress SET Maths=" + array[1] + ", Russian=" + array[2] + ", Belarussian=" + array[3] + ", Russian_literature=" + array[4] + ", Belarussian_literature=" + array[5] + ", Physical_culture=" + array[6] + ", Foreign_language=" + array[7] + ", History=" + array[8] + ", Average_value=" + average + " WHERE id=" + array[0];
			dbConnection.query(query);
			break;
		case 2:
			query = "UPDATE household_equipment SET Name_of_equipment=\"" + array[1] + "\", Amount=" + array[2] + " WHERE id=" + array[0];
			dbConnection.query(query);
			break;
		case 3:
			query = "UPDATE employees SET First_name1=\"" + array[1] + "\", Second_name1=\"" + array[2] + "\", Age=" + array[3] + ", Position=\"" + array[4] + "\" WHERE id=" + array[0];
			dbConnection.query(query);
			break;
	}
	response.json({index : request.body.selectedPage});
});
app.post("/dinamicSearch", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /dinamicSearch");
	var query = "";
	var tableData = "";
	switch(request.body.dataSelectedPage){
		case 0: 
			tableData = "<tr><th>id</th>" + 
						"<th>Имя</th>" +
						"<th>Фамилия</th>" +
						"<th>Дата рождения</th>" +
						"<th>Класс</th><th>Буква</th>" +
						"<th>Домашний адрес</th></tr>";
			query = "SELECT * FROM students";
			switch(request.body.dataSelected){
				case 1: query += " WHERE id LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 2: query += " WHERE first_name LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 3: query += " WHERE second_name LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 4: query += " WHERE class LIKE \"%" + request.body.dataSearching + "%\""; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].first_name + "</td>" +
										"<td>" + result[i].second_name + "</td>" +
										"<td>" + result[i].birthday + "</td>" +
										"<td>" + result[i].class + "</td>" +
										"<td>" + result[i].letter_of_class + "</td>" + 
										"<td>" + result[i].address + "</td>" +
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 1:
			tableData = "<tr><th>id</th>" + 
					"<th>Математика</th>" +
					"<th>Русск. яз.</th>" +
					"<th>Бел. яз.</th>" +
					"<th>Русск. лит.</th>" + 
					"<th>Бел. лит.</th>" +
					"<th>Физ-ра</th>" + 
					"<th>Ин. яз.</th>" + 
					"<th>История</th>" + 
					"<th>Среднее</th></tr>";
			query = "SELECT * FROM student_progress";
			switch(request.body.dataSelected){
				case 1: query += " WHERE id LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 2: query += " WHERE Average_value LIKE \"%" + request.body.dataSearching + "%\""; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].Maths + "</td>" +
										"<td>" + result[i].Russian + "</td>" +
										"<td>" + result[i].Belarussian + "</td>" +
										"<td>" + result[i].Russian_literature + "</td>" +
										"<td>" + result[i].Belarussian_literature + "</td>" + 
										"<td>" + result[i].Physical_culture + "</td>" + 
										"<td>" + result[i].Foreign_language + "</td>" + 
										"<td>" + result[i].History + "</td>" + 
										"<td>" + result[i].Average_value + "</td>" + 
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 2:
			tableData = "<tr><th>id</th>" + 
						"<th>Наименование</th>" +
						"<th>Кол-во</th></tr>";
			query = "SELECT * FROM household_equipment";
			switch(request.body.dataSelected){
				case 1: query += " WHERE id LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 2: query += " WHERE Name_of_equipment LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 3: query += " WHERE Amount LIKE \"%" + request.body.dataSearching + "%\""; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].Name_of_equipment + "</td>" +
										"<td>" + result[i].Amount + "</td>" +
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 3:
			tableData = "<tr><th>id</th>" + 
						"<th>Имя</th>" +
						"<th>Фамилия</th>" +
						"<th>Возраст</th>" +
						"<th>Должность</th></tr>";
			query = "SELECT * FROM employees";
			switch(request.body.dataSelected){
				case 1: query += " WHERE id LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 2: query += " WHERE First_name1 LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 3: query += " WHERE Second_name1 LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 4: query += " WHERE Age LIKE \"%" + request.body.dataSearching + "%\""; break;
				case 5: query += " WHERE Position LIKE \"%" + request.body.dataSearching + "%\""; break;
			}
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td>" + result[i].First_name1 + "</td>" +
										"<td>" + result[i].Second_name1 + "</td>" + 
										"<td>" + result[i].Age + "</td>" + 
										"<td>" + result[i].Position + "</td>" + 
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
	}
});
app.post("/dinamicSearchEditing", jsonParser, function(request, response){
	console.log("[Server]: получаю POST запрос /dinamicSearchEditing");
	var query = "";
	var tableData = "";
	switch(request.body.dataSelectedPage){
		case 0: 
			tableData = "<tr><th>id</th>" + 
						"<th>Имя</th>" +
						"<th>Фамилия</th>" +
						"<th>Дата рождения</th>" +
						"<th>Класс</th><th>Буква</th>" +
						"<th>Домашний адрес</th></tr>";
			query = "SELECT * FROM students WHERE id LIKE \"%" + request.body.dataSearching + "%\"";
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].first_name + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].second_name + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].birthday + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].class + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].letter_of_class + "\"/></td>" + 
										"<td><input style=\"width:100%\" value=\"" + result[i].address + "\"/></td>" +
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 1:
			tableData = "<tr><th>id</th>" + 
					"<th>Математика</th>" +
					"<th>Русск. яз.</th>" +
					"<th>Бел. яз.</th>" +
					"<th>Русск. лит.</th>" + 
					"<th>Бел. лит.</th>" +
					"<th>Физ-ра</th>" + 
					"<th>Ин. яз.</th>" + 
					"<th>История</th>" + 
					"<th>Среднее</th></tr>";
			query = "SELECT * FROM student_progress WHERE id LIKE \"%" + request.body.dataSearching + "%\"";
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Maths + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Russian + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Belarussian + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Russian_literature + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Belarussian_literature + "\"/></td>" + 
										"<td><input style=\"width:100%\" value=\"" + result[i].Physical_culture + "\"/></td>" + 
										"<td><input style=\"width:100%\" value=\"" + result[i].Foreign_language + "\"/></td>" + 
										"<td><input style=\"width:100%\" value=\"" + result[i].History + "\"/></td>" + 
										"<td>" + result[i].Average_value + "</td>" + 
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 2:
			tableData = "<tr><th>id</th>" + 
						"<th>Наименование</th>" +
						"<th>Кол-во</th></tr>";
			query = "SELECT * FROM household_equipment WHERE id LIKE \"%" + request.body.dataSearching + "%\"";
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Name_of_equipment + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Amount + "\"/></td>" +
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
		case 3:
			tableData = "<tr><th>id</th>" + 
						"<th>Имя</th>" +
						"<th>Фамилия</th>" +
						"<th>Возраст</th>" +
						"<th>Должность</th></tr>";
			query = "SELECT * FROM employees WHERE id LIKE \"%" + request.body.dataSearching + "%\"";
			dbConnection.query(query, function(error, result, fields){
				if(error){
					console.log("error");
				}else{
					for(let i = 0; i < result.length; i++){
						tableData += "<tr>" +
										"<td>" + result[i].id + "</td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].First_name1 + "\"/></td>" +
										"<td><input style=\"width:100%\" value=\"" + result[i].Second_name1 + "\"/></td>" + 
										"<td><input style=\"width:100%\" value=\"" + result[i].Age + "\"/></td>" + 
										"<td><input style=\"width:100%\" value=\"" + result[i].Position + "\"/></td>" + 
									"</tr>";
					}
					response.json({tableData : tableData});
				}
			});
			break;
	}
});
app.listen(4545, function(){
	console.log("[Server]: Server has been zapushen");
});