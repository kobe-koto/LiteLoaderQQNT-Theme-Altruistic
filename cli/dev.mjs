import fs from "node:fs";
import * as sass from "sass";

const WatchDir = "./src"

console.info("Watching file changes.");
const WatchList = fs.readdirSync(WatchDir);

for (
	let i = 0;
	i < WatchList.length;
	i++
) {
	fs.watch(`${WatchDir}/${WatchList[i]}`, (eventType, filename) => { 
		if (eventType === "change") {
			console.log(`${WatchDir}/${filename} Changed, building...`);
	
			try {
				const { css: TargetCSS } = sass.compile("src/main.scss");
				fs.writeFile("dist/main.css", TargetCSS, (err) => { 
					if (err) 
						console.log(err); 
					else { 
						console.log("Build done.\n\n");
					} 
				  });
			} catch (err) {
				console.warn("build failed.");
			}
		}
	}); 
}
