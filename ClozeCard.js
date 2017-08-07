module.exports = function ClozeCard(text, cloze) {
	if(this instanceof ClozeCard) {
		this.cloze = cloze,
		this.fullText = text;
		if(text.indexOf(cloze) !== -1) {
			split = text.split(cloze),
			this.partialText = '"' + split[0] + " . . . " + split[1] + '"';
		} else {
			this.partialText = "Error: No Instance of '" + cloze + "' in the Text!";
		}		
	} else { 
		return new ClozeCard(text, cloze);	
	}
}