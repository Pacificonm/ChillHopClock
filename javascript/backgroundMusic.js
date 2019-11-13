export default class BackgroundMusic = {
	constructor(){
		this.music = new Audio('audio/track1.mp3');
	}

	playMusic(){
		if(this.music.paused){
    		this.music.play();
    		$('#musicButton').textContent = 'Pause Music';
  		}
  		else{
    		this.music.pause();
    		$('#musicButton').textContent = 'Play Music';
  		}
	}

	createListeners(){
		$('#musicButton').addEventListener('click', this.playMusic);
		this.music.addEventListener('ended', () => {
    		this.music.currentTime = 0;
    		this.music.play();
		});
	}
}