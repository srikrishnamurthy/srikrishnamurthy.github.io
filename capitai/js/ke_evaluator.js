var hintState = {step: "1", count:"particular", "particularIndex":0};
var sheet = null;
var variableAssignments = null;
var stepList = [];

// (for complex number operations) the types of expressions to handle include:
	// $evl[${b}-${a}]


// given: some variable json thing that looks like: {"a":2, "b":3}
// steps:
	// find all occurances of ${something} and replace them with the values from the given dictionary

// assume exp1 and exp2 without spaces
function superEquals(exp1, exp2){
	if(exp1 == exp2){
		return true;
	}

	function basicRegDiv(e1, e2){
		var matchMap = {};
		var match;
		var re = new RegExp("([\\.\\/\\*\\-\\+\\(\\)0-9]+)", "g"); 
		while ((match = re.exec(e1)) != null) {
		    console.log(match);
		}
		console.log("---");
		var arr1 = e1.split(re);
		var arr2 = e2.split(re);
		console.log(arr1);
		console.log(arr2);
		if(arr1.length != arr2.length){
			return false;
		}
		var i;
		for(i = 0; i < arr1.length; i++){
			var val1 = null;
			var val2 = null;
			try {
			    val1 = eval(arr1[i]);
			} catch (e) {
			    if (e instanceof SyntaxError) {
			        console.log(e.message);
			    }
			}
			try {
			    val2 = eval(arr2[i]);
			} catch (e) {
			    if (e instanceof SyntaxError) {
			        console.log(e.message);
			    }
			}
			if(val1 != null && val2 != null){
				if(Math.abs(val1 - val2) > 0.1){
					return false;
				}
			}
		}
		return true;

		console.log("----");

		re = new RegExp("([\\.\\/\\*\\-\\+\\(\\)0-9]+)", "g"); 
		while ((match = re.exec(e2)) != null) {
			console.log(match);
		}
		console.log(e1);

	}

	console.log("Bear attack");
	console.log();
	if(basicRegDiv(exp1, exp2)){
		return true;
	}

	return false;
	// (1/3)*(5/7)*.4

}

function setProblemText(txt){
	document.getElementById("problemStatementText").innerHTML = txt;
}

function setHintText(txt){
	document.getElementById("hintStatementText").innerHTML = "<p>" + txt + "</p>";
}

function ps(){
	console.log("-----------------------------------");
}

var varDict = {"a":2, "b":3, "c":21, "d":5};
var statement = "x = $evl[${b}-${a}]";
statement = "(${a}+${b}i)/(${c}+${d}i)*(${c}-${d}i)/(${c}-${d}i)";

function substituteValuesAndBasicEvalWithSpaces(statement, varDict){
	var finishedStatement = statement.toString();

	var re = new RegExp("\\$evl\\[([\\d\\+\\-\\*\\(\\)\\s]+)\\]", "g");

	ps();

	for (var key in varDict) {
		if (varDict.hasOwnProperty(key)) {
			var theRegExForKey = new RegExp("\\${" + key + "}", "g");
			finishedStatement = finishedStatement.replace(theRegExForKey, new String(varDict[key]));
		}
	}
	// console.log(finishedStatement);
	ps();

	var matchMap = {};
	var match;
	while ((match = re.exec(finishedStatement)) != null) {
	    // console.log("match found at " + match.index);
	    // console.log(match);
	    matchMap[match[0]] = match[1];
	}

	console.log("unFinStat: " + statement);
	for (var key in matchMap) {
		if (matchMap.hasOwnProperty(key)) {
			// var regForKey = new RegExp(key, "g");
			// finishedStatement = finishedStatement.replace(key, eval(matchMap[key]));
			while(finishedStatement.indexOf(key) != -1){
				finishedStatement = finishedStatement.replace(key, eval(matchMap[key]));
            }
		}
	}

	ps();
	console.log("finStat:" + finishedStatement);

	finishedStatement = finishedStatement.split("blah").join("");
	finishedStatement = finishedStatement.split("Blah").join("");

	return finishedStatement;

}

function substituteValuesAndBasicEval(statement, varDict){

	var finishedStatement = statement.toString();

	var re = new RegExp("\\$evl\\[([\\d\\+\\-\\*\\(\\)\\s]+)\\]", "g");

	ps();

	for (var key in varDict) {
		if (varDict.hasOwnProperty(key)) {
			var theRegExForKey = new RegExp("\\${" + key + "}", "g");
			finishedStatement = finishedStatement.replace(theRegExForKey, new String(varDict[key]));
		}
	}
	// console.log(finishedStatement);
	ps();

	var matchMap = {};
	var match;
	while ((match = re.exec(finishedStatement)) != null) {
	    // console.log("match found at " + match.index);
	    // console.log(match);
	    matchMap[match[0]] = match[1];
	}

	console.log("unFinStat: " + statement);
	for (var key in matchMap) {
		if (matchMap.hasOwnProperty(key)) {
			// var regForKey = new RegExp(key, "g");
			// finishedStatement = finishedStatement.replace(key, eval(matchMap[key]));
			while(finishedStatement.indexOf(key) != -1){
				finishedStatement = finishedStatement.replace(key, eval(matchMap[key]));
            }
		}
	}

	finishedStatement = finishedStatement.replace(/\s/g, "");

	ps();
	console.log("finStat:" + finishedStatement);
	return finishedStatement;

}

// substituteValuesAndBasicEval(statement, varDict);

function expEquals(finishedStatement){

}

function findAllVars(exp){
	var matchMap = {};
	var re = new RegExp("\\${(\\w+)}", "g");
	while ((match = re.exec(exp)) != null) {
	    matchMap[match[1]] = 0;
	}
	console.log(matchMap);
	return matchMap;
}

findAllVars(statement);

function getListOfAllSteps(sheet){

	function convertExpToArr(someExp, padLen){
		var outputArr = [];
		var someArr = someExp.split(",");
		var ind;
		for(ind = 0; ind < someArr.length; ind++){
			outputArr.push(parseInt(someArr[ind].trim()));
		}
		while(outputArr.length < padLen){
			outputArr.push(0);
		}
		return outputArr;
	}

	var maxLen = 0;
	var standardizedSteps = {};

	// get the max number of levels
	for(var i in sheet["steps"]){
		if(!sheet["steps"].hasOwnProperty(i)){
			break;
		}
		maxLen = Math.max(maxLen, i.split(",").length);	
	}
	// console.log(maxLen);

	var listOfAllSteps = [];
	// get all stdized steps
	for(var i in sheet["steps"]){
		if(!sheet["steps"].hasOwnProperty(i)){
			break;
		}
		standardizedSteps[convertExpToArr(i, maxLen).join(",")] = i;
		listOfAllSteps.push(convertExpToArr(i, maxLen));
	}

	function Comp(a, b){
		var c;
		for(c = 0; c < a.length; c++){
			if(a[c] < b[c]) return -1;
			if(a[c] > b[c]) return 1;
		}
		return 0;
	}

	listOfAllSteps.sort(Comp);
	// console.log(listOfAllSteps);
	var resArr = [];
	for(var jj = 0; jj < listOfAllSteps.length; jj++){
		resArr.push(standardizedSteps[listOfAllSteps[jj]]);
	}
	return resArr;

}

function findNextStep(sheet, theNumber){

	return sheet["steps"][theNumber]["next_step"];

	function convertExpToArr(someExp, padLen){
		var outputArr = [];
		var someArr = someExp.split(",");
		var ind;
		for(ind = 0; ind < someArr.length; ind++){
			outputArr.push(parseInt(someArr[ind].trim()));
		}
		while(outputArr.length < padLen){
			outputArr.push(0);
		}
		return outputArr;
	}

	var maxLen = 0;
	var standardizedSteps = {};

	// get the max number of levels
	for(var i in sheet["steps"]){
		if(!sheet["steps"].hasOwnProperty(i)){
			break;
		}
		maxLen = Math.max(maxLen, i.split(",").length);	
	}
	// console.log(maxLen);

	var listOfAllSteps = [];
	// get all stdized steps
	for(var i in sheet["steps"]){
		if(!sheet["steps"].hasOwnProperty(i)){
			break;
		}
		standardizedSteps[convertExpToArr(i, maxLen).join(",")] = i;
		listOfAllSteps.push(convertExpToArr(i, maxLen));
	}

	var theCurrExp = convertExpToArr(theNumber, maxLen);
	if(!standardizedSteps.hasOwnProperty(theCurrExp.join(","))){
		return "";
	}

	function Comp(a, b){
		var c;
		for(c = 0; c < a.length; c++){
			if(a[c] < b[c]) return -1;
			if(a[c] > b[c]) return 1;
		}
		return 0;
	}

	listOfAllSteps.sort(Comp);
	// console.log(listOfAllSteps);
	var theIndex = -1;
	for(var jj = 0; jj < listOfAllSteps.length; jj++){
		if(Comp(listOfAllSteps[jj], theCurrExp) == 0){
			theIndex = jj;
		}
	}
	// console.log(theIndex);
	console.log("Hey Buddy");
	console.log(standardizedSteps);
	console.log(listOfAllSteps);
	if(theIndex + 1 < listOfAllSteps.length){
		return standardizedSteps[listOfAllSteps[theIndex + 1].join(",")];
	}
	return "";

}

function getHandledError(theErroneousExp){

	// first try to see if the erroneous expression is directly handled by looking through all the errors we've accounted for

	for(var step in sheet["steps"]){
		if(!sheet["steps"].hasOwnProperty(step)){
			continue;
		}
		for(var errInd in sheet["steps"][step]["errors"]){
			if(!sheet["steps"][step]["errors"].hasOwnProperty(errInd)){
				continue;
			}
			var theCurrErrorExpFromSheet = sheet["steps"][step]["errors"][errInd];
			if(theCurrErrorExpFromSheet == "Default"){
				continue;
			}
			if(theErroneousExp.replace(/\s/g, "") == substituteValuesAndBasicEval(theCurrErrorExpFromSheet, variableAssignments)){
				console.log("found error@ " + step + " | " + errInd);
				return {"step":step, "errorIndex":errInd};
				// return step + "|" + errInd;
			}
		}
	}

	return "";

	// if it doesn't match an error, find the latest correct step, find the next step and throw the default and load up the hints

}