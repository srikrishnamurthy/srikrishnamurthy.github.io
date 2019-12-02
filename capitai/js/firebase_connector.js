// Initialize Firebase
var config = {
	apiKey: "AIzaSyBsSYgPjmg2CwlNwKBX8Gy6rqysE9WZb2A",
	authDomain: "alistempire-e0373.firebaseapp.com",
	databaseURL: "https://alistempire-e0373.firebaseio.com",
	storageBucket: "",
};
var a_list_app = firebase.initializeApp(config);

function loadNewProblem(problemId){
	a_list_app.database().ref(problemId).once("value").then(function(snapshot){
		sheet = snapshot.val();
		console.log(sheet);
		console.log(makeProblem(sheet));
		stepList = getListOfAllSteps(sheet);
	});
}

function makeProblem(sheet){
	var init_exp = sheet["problem_statement"]; // sheet["steps"]["1"]["correct_input"]["0"]
	console.log(init_exp);
	variableAssignments = findAllVars(init_exp);
	for(var key in variableAssignments){
		if (variableAssignments.hasOwnProperty(key)) {
			variableAssignments[key] = Math.floor((Math.random() * 10) + 1);
		}
	}
	var the_final_statement = "Solve the following: " + substituteValuesAndBasicEvalWithSpaces(init_exp, variableAssignments);
	setProblemText(the_final_statement);
	return the_final_statement;
}

function findMatchingStep(expression){
	for(var i in sheet["steps"]){
		if(!sheet["steps"].hasOwnProperty(i)){
			continue;
		}
		for(var j in sheet["steps"][i]["correct_input"]){
			if(!sheet["steps"][i]["correct_input"].hasOwnProperty(j)){
				continue;
			}
			if(expression.replace(/\s/g, "") == substituteValuesAndBasicEval(sheet["steps"][i]["correct_input"][j], variableAssignments)){
				console.log("found@ " + i + " | " + j);
				// return i + "|" + j;
				return {"step":i, "correct_input_index":j};
			}

		}
	}
	return "";
}