//#https://raw.githubusercontent.com/ashlinchak/mdanki/master/samples/simple.md
var fs = require('fs');
var args = require('minimist')(process.argv.slice(2));
var execSync = require('child_process').execSync;

var array = [];

if(!args.i) {
    console.log("-i file.txt");
    process.exit(-1);
}
if(!args.o) {
    console.log("-o output.md");
    process.exit(-1);
}
if(!args.t) {
    console.log("-t 'Awesome Book'");
    process.exit(-1);
}
if(!args.a) {
    console.log("-a anki_refuse.apkg");
    process.exit(-1);
}

if (!fs.existsSync("output")){
    fs.mkdirSync("output");
}

//input
var file = "output/"+args.i;
//output
var output = "output/"+args.o;
//title
var title = args.t;
//anki file
var anki = "output/"+args.a;

var lines = require('fs').readFileSync(file, 'utf-8')
    .split('\n')
        .filter(Boolean);

var block = "";
var oldBlock = "";

//demarcated by date
lines.forEach(line => {
    if((/^\w+\s\d+,\s\d\d\d\d/).test(line)) {
        oldBlock = block;
        block = "";

        /*
        var dateReg = line.match(/^\s*\[\d+.*?\]/);
        var dateStr = dateReg[0];
        dateStr = dateStr.trim();
        dateStr = dateStr.replace('[','');
        dateStr = dateStr.replace(']','');
        */

        if(oldBlock!="") {

            //console.log("====");
            //console.log(oldBlock);
            //console.log("====");
            array.push(oldBlock);

        }
        //block = line + "\n";
    }
    else {
        block += line + " \n";
    }
});

execSync("rm -f " + output + " " + anki);
fs.appendFileSync(output, "# " + title + "\n\n" );

array.forEach(line => {

    var line2 = line.replace(/\n|\r/g, "");
    var trimmedString = line2.substring(0, 100) + "...";

    //Title
    fs.appendFileSync(output, "## " + trimmedString + "\n\n" );

    //Front card
    //TODO: Get tf-id and replace the word with ____ of same length
    fs.appendFileSync(output, line2 + "\n\n" );

    fs.appendFileSync(output, "%\n\n");

    //Back card
    fs.appendFileSync(output, line2 + "\n\n" );

});

execSync("mdanki " + output + " " + anki);



