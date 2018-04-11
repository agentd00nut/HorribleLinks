# HorribleLinks
Scrape magnets from horriblesubs for new additions to any myanime.com list.

Attempts to get the first 5 episodes of new `TV` animes from your [myanimelist](https://myanimelist.net/) accounts page that are flagged as `plan to watch`.  Only attempts to grab a show one time unless you modify the `shows.json` file.

## Disclaimer
Torrenting is bad okay?  P2P is the devils work and anyone who invokes said protocol is a sinner and deserves to be piked.
I don't support you even LOOKING at this code, let alone running it!

## Instructions

1. Edit `options.json` to control which myanimelist users list you want to follow.
2. `npm install`
3. `node getList.js`
4. Checkout magFiles directory... Gosh it'd be so neat if some [program](https://deluge-torrent.org/) had an [auto add](https://dev.deluge-torrent.org/wiki/Plugins/AutoAdd) plugin that could automatically add those magnet links for download.  It'd just be so neat!

## TODO List ( Things to Contribute )

	1. Rewrite the whole thing so we can easily add other sites to scrape from. 
	2. Support movies ( easy )
	3. Support multiple lists at once (medium)
	4. Support setting options through command line args ( easy )
	5. Refactor magFiles to magFiles/[movies,tv] ( easy ) 
	6. Improved error handling and output (medium/easy)
