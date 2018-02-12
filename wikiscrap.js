const request = require('request')
const cheerio = require('cheerio')
const EventEmitter = require('events').EventEmitter
const finishedEmitter = new EventEmitter()

let wikiscrap = {
	getFirstLink(link) {
		request(link, (err, res, body) => {
			let $ = cheerio.load(body)
			if ($(".mw-parser-output").length) {
				$('.mw-parser-output > p a').each((i, link) => {
	                let href = $(link).attr('href')
	                let article = href.split("/");
	                article = article[article.length - 1];

	                let paren_regex = new RegExp("\\((.*?" + article + ".*?)\\)")

	                let from_regex = new RegExp(article + ":")

	                let from2_regex = new RegExp("from [A-Za-z\-\_]+: " + article)

	                let text = $(link).parent().text()

	                if (href.match(/Wikipedia:/i)) { return true }

	                if (href.match(/Aide:/i)) { return true }

	                if (href.match(/File:/i)) { return true }

	                if (href.match(/wiki\/API/)) {return true }

	                if (href.indexOf(".") !== -1) { return true }

	                if (href.match(/#/)) { return true }

	                if (text.match(from_regex)) { return true }
	                if (text.match(from2_regex)) { return true }
	                if (text.match(paren_regex)) { return true }

	                finishedEmitter.emit("finished", {firstLink: 'https://fr.wikipedia.org' + href, firstLinkName: $(link).text()})
	                return false;
        		})
			} else {
				finishedEmitter.emit("error", "Cette page wikipedia n'existe pas !")
			}
		})	
	}
}

if (process.argv.length == 3) {
	let firstLinkName, firstLink, i = 0

	console.log("start : " + process.argv[2])

	wikiscrap.getFirstLink('https://fr.wikipedia.org/wiki/' + process.argv[2].replace(" ", "_"))

	finishedEmitter.on("finished", (data) => {
		firstLink = data.firstLink
		firstLinkName = data.firstLinkName
		i++
		console.log(i + ". " + data.firstLinkName + " [" + data.firstLink + "] ")
		if (firstLink != "https://fr.wikipedia.org/wiki/Philosophie") {
			wikiscrap.getFirstLink(firstLink)
		}
	})
} else {
	console.log("Utilisation : node wikiscrap.js [article]")
}





	
