const https = require("https");
const cheerio = require('cheerio');
const EventEmitter = require('events').EventEmitter;
const finishedEmitter = new EventEmitter();

let wikiscrap = {
	getFirstLink(link) {
		https.get(link, (res) => {

			let data = ''

			res.on('data', (chunk) => {
				data += chunk
			})

			res.on('end', () => {
				var $ = cheerio.load(data)
				let firstA = $('.mw-parser-output').children("p").first().children('a').first(),
				paragraph = $('.mw-parser-output:first-child') /*.children('p').first().children('a').first()*/

				while (firstA == undefined) {
					paragraph = paragraph.next()
					firstA = paragraph.children("a").first()
				}
				
				finishedEmitter.emit("finished", {firstLink: 'https://fr.wikipedia.org' + firstA.attr('href'), firstLinkName: firstA.text()})
			})
		}).on('error', (err) => {
			console.log('Error: ' + err.message)
		})
	}
} 

let firstLinkName, firstLink, i = 0

console.log("start : " + process.argv[2])

wikiscrap.getFirstLink('https://fr.wikipedia.org/wiki/' + process.argv[2])

finishedEmitter.on("finished", (data) => {
	firstLink = data.firstLink
	firstLinkName = data.firstLinkName
	i++
	console.log(i + ". " + data.firstLinkName + " [" + data.firstLink + "] ")
	if (firstLink != "https://fr.wikipedia.org/wiki/Philosophie") {
		wikiscrap.getFirstLink(firstLink)
	}
})



	
