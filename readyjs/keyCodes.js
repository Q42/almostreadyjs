var KeyCodes = {
	'escape': 27,
	'space': 32,
	'left': 37,
	'up': 38,
	'right': 39,
	'down': 40,
	'enter': 13,
	'backspace': 8,
	'left': 37
}

for (var c=65;c<=90;c++) KeyCodes[String.fromCharCode(c).toLowerCase()] = c;
for (var c=48;c<=57;c++) KeyCodes[String.fromCharCode(c).toLowerCase()] = c;

// map the inverted dictionary too (KeyCodes.codes.27 = 'escape')
KeyCodes.codes = {};
for (var o in KeyCodes) KeyCodes.codes[KeyCodes[o]] = o;