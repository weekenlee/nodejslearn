var test = /my ca[rt] ate? (the|[2-4]) [sp]lums?/;

// the above regex matches all strings below
var strings = [
    'my cat ate the plum',
    'my cat ate 3 plums',
    'my car at the slums'
];

strings.forEach(function(e) {
	var result = e.match(test)
	var result2 = test.test(e)
	console.log(result)
	console.log(result2)
})
