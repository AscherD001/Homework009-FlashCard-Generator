// Command line imput should be as follows:
// node app.js <function> <filename>
// function can either be "basic", "cloze", or "read" (not case sensitive)
// filename example: "cards.txt" (if the file does not exist, it will be created)
// if no filename is provided, "cards.txt" will be used as a default filename

// Initialize Variables
var args = process.argv,
// Imports constructor functions from BasicCard.js and ClozeCard.js
BasicCard = require("./BasicCard"),
ClozeCard = require("./ClozeCard"),
// Imports node package readline instead of inquirer (I know...I'll use inquierer next time)
readline = require("readline"),
fs = require("fs"),
cards = [],
basic = false,
cloze = false,
read = false,
file = "cards.txt",
prompt;


// Sets state and variables for "Basic", "Cloze", and "Read"
function init() {
	// sets file to user designated file name
	if(process.argv[3]) {
		file = process.argv[3];
	}
	switch(process.argv[2].toLowerCase()) {
		case "basic":
			basic = true;
			prompt = ["Question", "Answer"];
			front();
			break;
		case "cloze":
			cloze = true;
			prompt = ["Full", "Cloze"];
			// adds prototype function to display partial text after cloze deletion
			ClozeCard.prototype.partialText = function() {
				if(this.fullText.indexOf(this.cloze) !== -1) {
					split = this.fullText.split(this.cloze);
					return '"' + split[0] + " . . . " + split[1] + '"';
				} else {
					return "Error: No Instance of '" + this.cloze + "' in the Text!";
				}	
			}
			front();
			break;
		case "read":
			read = true;
			readFile();
			break;
	}
}
// This function takes the first input for either "basic" or "cloze" card types
function front() {
	rl.resume();
	rl.question(prompt[0] + ' Text:\n', (answer) => {
		rl.pause();
		back(answer);
	});
}
// This function takes in the second input for either "basic" or "cloze" card types
// It also takes in the first input and combines them to create a new card object
function back(text) {
	rl.resume();
	rl.question(prompt[1] + ' Text:\n', (answer) => {
		rl.pause();
		if(basic) {
			var newCard = new BasicCard(text, answer);
		} else {
			var newCard = new ClozeCard(text, answer);
		}
		// Pushes the newly created card into the cards array
		// Also, appends the card to the designated file with headers for parsing later
		cards.push(newCard);
		if(basic) {
			fs.appendFile(file, "CARD " + newCard.front + " DIVIDE " + newCard.back + " ", function(err) {});
		} else {
			fs.appendFile(file, "CARD " + newCard.partialText + " DIVIDE " + newCard.cloze + " ", function(err) {});
		}
		again();
	});	
}
// This function runs at the endpoint displaying all the newly created cards
function displayCard() {
 	for(var i = 0; i < cards.length; i ++) {
 		if(basic) {
 			console.log("Card " + (i + 1) + " Front: " + cards[i].front + " Back: " + cards[i].back);
 		} else {
 			console.log("Card " + (i + 1) + " Partial Text: " + cards[i].partialText + " Cloze: " + cards[i].cloze);
 		}
 	}
 	rl.close();
}
// Offers the user a prompt to continue making cards or end the program
function again() {
	rl.resume();
	rl.question('Another Card? (Y/N)\n', (answer) => {
		// Default response will prompt creation of a new card
		if(answer.toLowerCase() === "n") {
			rl.pause();
			displayCard();
		} else {
			front();
		}
	});
}
// Instead of writing cards, this function takes in command line arguments
// to read a string from a file and parse the data for a clean and organized display
function readFile() {
	fs.readFile(file, "utf8", function(err, data) {
		if(!err) {
			var byCard = data.split("CARD ");
			for(var i = 0; i < byCard.length; i ++) {
				var splitCard = byCard[i].split(" DIVIDE ");
				if(splitCard.length === 2) {
					console.log(i + " " + splitCard[0] + ", " + splitCard[1]);
				}
			}
		}
	});
}
// Runs the init() function
if(process.argv[2]) {
	// readline breaks the app if you initialize during a "read" state
	if(process.argv[2].toLowerCase() != "read") {
		var rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
	}
	init();
}