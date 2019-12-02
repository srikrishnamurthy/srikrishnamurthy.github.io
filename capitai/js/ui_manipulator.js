// adds functionality for new steps to be added to the worksheet
document.getElementById("add_new_step_button").onclick = function(event){
	var elemToAdd = document.createElement("div");
	elemToAdd.setAttribute("class", "input-field col s12");
	var inputFieldOfElem = document.createElement("input");
	inputFieldOfElem.setAttribute("placeholder", "");
	inputFieldOfElem.setAttribute("type", "text");
	inputFieldOfElem.setAttribute("class", "validate");
	elemToAdd.appendChild(inputFieldOfElem);
	var btnDivContainer = event.target.parentNode.parentNode;
	btnDivContainer.parentNode.insertBefore(elemToAdd, btnDivContainer);
};

// start from the last field to be filled in and work backwords until a correct step is listed; highlight that step
document.getElementById("check_work_so_far_button").onclick = function(event){

	var firstLine = document.getElementById("firstLineContainer");
	var current = firstLine;

	// find the latest correct answer
	var latestCorrect = null;
	while(current.classList.contains("input-field")){
		current.classList.remove("yellow");
		var the_curr_exp = current.firstElementChild.value.trim();
		if(the_curr_exp != ""){
			if(findMatchingStep(the_curr_exp) != ""){
				latestCorrect = current;
			}
		}
		current = current.nextElementSibling;
	}

	// if null, then no correct answers
	if(latestCorrect == null){

		// first check if there is an error that is caught, otherwise just set to def. error
		var latestWrong = null;
		current = firstLine;
		while(current.classList.contains("input-field")){
			current.classList.remove("yellow");
			var the_curr_exp = current.firstElementChild.value.trim();
			if(the_curr_exp != ""){
				if(getHandledError(the_curr_exp) != ""){
					latestWrong = current;
				}
			}
			current = current.nextElementSibling;
		}

		if(latestWrong == null){
			console.log("You got nothing right so far."); // go to default hint
			hintState["step"] = stepList[0];
			hintState["count"] = "particular";
			hintState["particularIndex"] = 0;
			displayHintState();
		}else{
			var errHandlerVar = getHandledError(latestWrong.firstElementChild.value.trim());
			latestWrong.classList.add("yellow");
			hintState["step"] = errHandlerVar["step"];
			hintState["count"] = "particular";
			hintState["particularIndex"] = errHandlerVar["errorIndex"];
			displayHintState();
		}
		return;
	}

	var tempCorrectData = findMatchingStep(latestCorrect.firstElementChild.value.trim());
	if(tempCorrectData.step == stepList[stepList.length - 1]){
		setHintText("<h3>Correct! Good work.</h3>Click on the green check button to move on to the next problem.");
		document.getElementById("submit_and_continue_button").classList.remove("disabled");
		return;
	}

	// else find the earliest incorrect statement after the latest right one
	current = latestCorrect;
	var nearestWrong = null;
	while(current.classList.contains("input-field")){
		var the_curr_exp = current.firstElementChild.value.trim();
		if(the_curr_exp != ""){
			if(findMatchingStep(the_curr_exp) == ""){
				nearestWrong = current;
				break;
			}
		}
		current = current.nextElementSibling;
	}

	if(nearestWrong == null){
		console.log("You are good.");

		var latestCorrectStats = findMatchingStep(latestCorrect.firstElementChild.value.trim());
		console.log("LCS");
		console.log(latestCorrectStats);
		var theNextStep = findNextStep(sheet, latestCorrectStats["step"]);
		hintState["step"] = theNextStep;
		hintState["count"] = "goal_hint";
		hintState["particularIndex"] = 0;
		displayHintState();

		return;
	}

	nearestWrong.classList.add("yellow");
	var handledErrorRes = getHandledError(nearestWrong.firstElementChild.value.trim());

	if(handledErrorRes == ""){
		var latestCorrectStats = findMatchingStep(latestCorrect.firstElementChild.value.trim());
		console.log("LCS");
		console.log(latestCorrectStats);
		var theNextStep = findNextStep(sheet, latestCorrectStats["step"]);
		hintState["step"] = theNextStep;
		hintState["count"] = "particular";
		hintState["particularIndex"] = 0;
		displayHintState();
	}else{
		hintState["step"] = handledErrorRes.step;
		hintState["count"] = "particular";
		hintState["particularIndex"] = handledErrorRes.errorIndex;
		displayHintState();
	}

};

function displayHintState(){

	// particular > goal > step > problem

	if(hintState["count"] == "particular"){
		setHintText(sheet["steps"][hintState.step]["feedback"][hintState.particularIndex]);
		document.getElementById("prev_hint_button").classList.add("disabled");
		document.getElementById("next_hint_button").classList.remove("disabled");
	}else{
		document.getElementById("prev_hint_button").classList.remove("disabled");
		if(hintState.count == "goal_hint"){
			setHintText(sheet["steps"][hintState.step]["goal_hint"]);
			if(sheet["steps"][hintState.step]["step_hint"].trim() == ""){
				document.getElementById("next_hint_button").classList.add("disabled");
			}else{
				document.getElementById("next_hint_button").classList.remove("disabled");
			}
		}else if(hintState.count == "step_hint"){
			setHintText(sheet["steps"][hintState.step]["step_hint"]);
			if(sheet["steps"][hintState.step]["problem_hint"].trim() == ""){
				document.getElementById("next_hint_button").classList.add("disabled");
			}else{
				document.getElementById("next_hint_button").classList.remove("disabled");
			}
		}else if(hintState.count == "problem_hint"){
			setHintText(sheet["steps"][hintState.step]["problem_hint"]);
			document.getElementById("next_hint_button").classList.add("disabled");
		}
	}

}

document.getElementById("next_hint_button").onclick = function(event){

	// particular > goal > step > problem

	if(document.getElementById("next_hint_button").classList.contains("disabled")){
		return;
	}

	document.getElementById("prev_hint_button").classList.remove("disabled");

	if(hintState.count == "particular"){
		hintState.count = "goal_hint";
		setHintText(sheet["steps"][hintState.step]["goal_hint"]);
		if(sheet["steps"][hintState.step]["step_hint"].trim() == ""){
			document.getElementById("next_hint_button").classList.add("disabled");
		}
	}else if(hintState.count == "goal_hint"){
		hintState.count = "step_hint";
		setHintText(sheet["steps"][hintState.step]["step_hint"]);
		if(sheet["steps"][hintState.step]["problem_hint"].trim() == ""){
			document.getElementById("next_hint_button").classList.add("disabled");
		}
	}else if(hintState.count == "step_hint"){
		hintState.count = "problem_hint";
		setHintText(sheet["steps"][hintState.step]["problem_hint"]);
		document.getElementById("next_hint_button").classList.add("disabled");
	}else if(hintState.count == "problem_hint"){

	}


};

document.getElementById("prev_hint_button").onclick = function(event){

	if(document.getElementById("prev_hint_button").classList.contains("disabled")){
		return;
	}

	if(hintState.count == "particular"){

	}else if(hintState.count == "goal_hint"){
		hintState.count = "particular";
		setHintText(sheet["steps"][hintState.step]["feedback"][hintState.particularIndex]);
		document.getElementById("prev_hint_button").classList.add("disabled");
	}else if(hintState.count == "step_hint"){
		hintState.count = "goal_hint";
		setHintText(sheet["steps"][hintState.step]["goal_hint"]);
	}else if(hintState.count == "problem_hint"){
		hintState.count = "step_hint";
		setHintText(sheet["steps"][hintState.step]["step_hint"]);
	}

	document.getElementById("next_hint_button").classList.remove("disabled");

};

document.getElementById("submit_and_continue_button").onclick = function(event){
	location.reload(true);
}