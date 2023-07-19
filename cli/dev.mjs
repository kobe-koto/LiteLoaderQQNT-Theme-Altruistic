import fs from "node:fs";
import * as sass from "sass";

console.info("Watching file changes.");


fs.watch("./src/main.scss", (eventType, filename) => { 
	if (eventType === "change") {
		console.log(`File Changed (${filename}), start to build.`);

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
