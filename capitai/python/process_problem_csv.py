import csv
import json

class Sheet:
	def __init__(self, fileName):
		self.sheet = []
		with open(fileName) as csvfile:
		    the_reader = csv.reader(csvfile)
		    for row in the_reader:
		    	self.sheet.append(row)
		    	# print(row)

	def getElement(self, tup):
		col = ord(tup[0].upper()) - 65
		row = int(tup[1:]) - 1
		return self.sheet[row][col]

	def setElement(self, tup, elem):
		col = ord(tup[0].upper()) - 65
		row = int(tup[1:]) - 1
		self.sheet[row][col] = elem

	def getNumberOfColumns(self):
		return len(self.sheet[0])

	def getMaxColumn(self):
		return chr(len(self.sheet[0]) + 64)

	def getNumberOfRows(self):
		return len(self.sheet)

	def getMaxRow(self):
		return len(self.sheet)


ps = Sheet('sheet.csv')
json_ex = "{\"map1\":\"hi\", \"map2\":\"hi2\", \"map3\":{\"submap1\":\"hello1\"}}"
json_dict = json.loads(json_ex)
# print(json_dict)
# print()
# print(json.dumps(json_dict, ensure_ascii=False))

def printToFile(fileName, message):
	with open(fileName, 'w') as out:
		out.write(message)

def buildRepresentation(sheet):

	# problem_id
	problem_container = {}
	step_container = {}
	rep = {sheet.getElement("B7") : problem_container}

	# problem properties
	problem_container["subject"] = sheet.getElement("B1")
	problem_container["strand"] = sheet.getElement("B2")
	problem_container["topic"] = sheet.getElement("B3")
	problem_container["goal"] = sheet.getElement("B4")
	problem_container["learning_objective"] = sheet.getElement("B5")
	problem_container["problem_id"] = sheet.getElement("B7")
	problem_container["problem_desc"] = sheet.getElement("B8")
	problem_container["problem_statement"] = sheet.getElement("B10")
	problem_container["steps"] = step_container

	for row in range(15, sheet.getMaxRow() + 1):

		the_step = {}
		step_container[sheet.getElement("A" + str(row)).split(" ")[1].replace(".", ",")] = the_step

		
		the_step["next_step"] = sheet.getElement("B" + str(row)).replace(".", ",")
		the_step["name"] = sheet.getElement("C" + str(row))
		the_step["method"] = sheet.getElement("D" + str(row))
		the_step["skippable"] = sheet.getElement("H" + str(row))
		the_step["goal_hint"] = sheet.getElement("I" + str(row))
		the_step["step_hint"] = sheet.getElement("J" + str(row))
		the_step["problem_hint"] = sheet.getElement("K" + str(row))

		# the_step["errors"] = sheet.getElement("F" + str(row))
		# the_step["feedback"] = sheet.getElement("G" + str(row))
		errArr1 = [z.strip() for z in sheet.getElement("G" + str(row)).split("Enter") if z.strip() != ""]
		errArr2 = [z.strip() for z in sheet.getElement("H" + str(row)).split("$next") if z.strip() != ""]
		the_step["errors"] = errArr1
		the_step["feedback"] = errArr2

		# the_step["errors"] = dict(zip(errArr1, errArr2))
		# print(len(errArr2), len(errArr1))

		correct_input_choices = [x.strip().replace(" ", "") for x in sheet.getElement("F" + str(row)).split("Enter") if x.strip() != ""]
		the_step["correct_input"] = {i:correct_input_choices[i] for i in range(len(correct_input_choices))}

		# print(correct_input_choices)

	# print(json.dumps(problem_container, ensure_ascii=False))
	printToFile("out.txt", json.dumps(problem_container, ensure_ascii=False))

buildRepresentation(ps)


'''
# testing the Sheet class
print(ps.getElement("A13"))
print(ps.getNumberOfRows())
print(ps.getNumberOfColumns())
print(ps.getMaxRow())
print(ps.getMaxColumn())
'''