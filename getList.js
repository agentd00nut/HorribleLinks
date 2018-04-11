var cheerio = require('cheerio');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var request = Promise.promisifyAll(require('request'));

function getJsonFile(fileName){
	return fs.readFileAsync(__dirname+"/"+fileName).then(JSON.parse)
}


function getTv(){
	return getJsonFile("options.json")
	.then(function(options){
		
		var user=options["myAnimeList"]["user"];
		var requestOpts = {
		    uri: 'https://myanimelist.net/animelist/'+user+'?status=6&order=6&order2=0',  
		};

		return request.getAsync(requestOpts)
		.then(function(html){
		    const $=cheerio.load(html.body);

		    shows=[]
		    x = $("table.list-table").data("items")
		    x.forEach(function(show){
		    	if(show.anime_media_type_string=="TV"){
		    		shows.push(show.anime_title)
		    	}
		    })
		    
			//show=$("#list-container > div.list-block > div > table > tbody > tr.list-table-data")
			//console.log(show.text())
			return shows
		}).catch(function(err){
			console.log("Error selecting the show")
			console.log(err)
		})

	}).catch(function(err){
		console.log("Error getting the options")
		console.log(err)
	})
}

function removePreviousDownloads(shows){
	return getJsonFile("shows.json")
	.then(function(savedShows){
		
		savedShows.forEach(function(show){
			if( shows.indexOf(show["name"]) > -1 ){
				shows.splice(shows.indexOf(show["name"]), 1);
			}
		})

		return shows

	}).catch(function(err){
		console.log("Error trying to remove previously downloaded shows.")
		console.log(err);
	})
}

function saveJsonFile(json, fileName){
	//return fs.readFileAsync(__dirname+"/"+fileName).then(JSON.parse)
	return fs.writeFileAsync(__dirname+"/"+fileName, JSON.stringify(json))
		.catch(function(err){
			console.log("Error saving json to "+fileName);
			console.log(err)
		})
}

function saveMagFile(data, fileName){
	return fs.writeFileAsync(__dirname+"/magFiles/"+fileName, data)
		.catch(function(err){
			console.log("Error saving a magnet file:"+fileName)
			console.log(err)
		})
}

function searchHorribleSubs(shows){
	var requests=[]
	
	for(var sI=0; sI<shows.length; sI++){
		
		let show=shows[sI]

		r=request.getAsync("http://horriblesubs.info/lib/search.php?value="+show)
		.then(function(html){
			const $=cheerio.load(html.body);
			var episodes={"name":show, "eps":[]};

			$('div.release-links').each(function(i,linkTable){

				if( $(this).attr('class').indexOf("1080p") > -1){

					wantedEps=["-01-","-02-","-03-","-04-","-05-"]
				
					for(var i=0; i<wantedEps.length; i++){
						if( $(this).attr('class').indexOf(wantedEps[i]) > -1){
							episodes["eps"].push( $(this).find('a')[0].attribs['href']) 
						}
					}

				}

			})
			return episodes
		})
		requests.push(r)
	}
	return Promise.all(requests)
}

function saveShows(showEps){
	getJsonFile("shows.json")
	.then(function(savedShows){
		for(var i=0; i<showEps.length; i++){
			show=showEps[i];
			savedShows.push({"name":show['name'], "downloaded":'1523367499'})
		}
		saveJsonFile(savedShows, "shows.json")
	})

	return showEps
}


function createMagnetFiles(showEps){
	savedShows=[]
	for(var i=0; i<showEps.length; i++){
		show=showEps[i];
		let ds=""
		for(var j=0; j<show["eps"].length; j++){
			ds+=show["eps"][j]+"\n"
		}
		
		if(ds != ""){
			console.log("Saving Episodes: ",show["name"])
			saveMagFile(ds,show["name"].replace(/ /g,"_")+".magent")
			savedShows.push(show);
		}else{
			console.log("No Episodes: ",show["name"])
		}

	}
}

getTv()
.then(removePreviousDownloads)
.then(searchHorribleSubs)
.then(saveShows)
.then(createMagnetFiles)