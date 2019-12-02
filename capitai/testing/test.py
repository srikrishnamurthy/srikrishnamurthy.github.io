import itertools
# $evl[${a}*${c}]+$evl[${a}*${d}]i+$evl[${b}*${c}]i-$evl[${b}*${d}]
li = ("+$evl[${a}*${c}]", "+$evl[${a}*${d}]i", "+$evl[${b}*${c}]i", "-$evl[${b}*${d}]")
li = ("-${c}", "+${a}", "+${b}i", "-${d}i")
# ()ii

def pr(i):
	return "<br> " + pr2(i)

def pr2(i):
	x = "".join(i)
	if x[0] == "+":
		return x[1:]
	else:
		return x

groupedLi = []
ungroupedLi = []
sp = []
for i in itertools.permutations(li):
	print(pr(i))
	x = list(i)
	#print(x)
	if ("i" in x[0]) == ("i" in x[1]):
		x[0] = "(" + x[0]
		x[1] = x[1] + ")"
		print(pr(x))
	x = list(i)
	if ("i" in x[1]) == ("i" in x[2]):
		x[1] = "(" + x[1]
		x[2] = x[2] + ")"
		print(pr(x))
	x = list(i)
	if ("i" in x[2]) == ("i" in x[3]):
		x[2] = "(" + x[2]
		x[3] = x[3] + ")"
		print(pr(x))

#theString = open("h.txt", "r").read()
#sp = [x.strip() for x in theString.split("<br>") if x.strip() != ""]
#print(sp)

'''for x in sp:
	print("<br> (" + x + ")/(${c}*${c}+${d}*${d})")
	print("<br> (" + x + ")/(${d}*${d}+${c}*${c})")
	print("<br> (" + x + ")/($evl[${c}**2]+$evl[${d}**2])")
	print("<br> (" + x + ")/($evl[${d}**2]+$evl[${c}**2])")
	print("<br> (" + x + ")/$evl[${c}**2+${d}**2]")'''