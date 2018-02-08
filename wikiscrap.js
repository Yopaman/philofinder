const https = require("https");


https.get('https://fr.wikipedia.org/wiki/' + process.argv[2], (res) => {

	let data = '';

	res.on('data', (chunk) => {
		data += chunk
	})

	res.on('end', () => {
		console.log(data)
	})
}).on('error', (err) => {
	console.log('Error: ' + err.message)
})

