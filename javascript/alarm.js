class Alarm = {
	constructor(time = null, intervalId = null, ){
		this.time = time;
		this.intervalId = intervalId;
		this.audio = new Audio('audio/hiphopAlarm.mp3');
	}

	setAlarm(){
  		if(!this.audio.paused){
    		this.audio.pause();
    		this.audio.currentTime = 0;
    		resetAlarm("Set Alarm");
    		return;
  		}

  		if(alarm.isSet){
    		resetAlarm("Set Alarm");
    		displayNotification("Alarm canceled");
    		return;
  		}

  		if(!checkValidTimeInput()){
    		displayNotification("Invalid time");
    		return;
  		}

  		//set alarm
  		let alarmTime = document.getElementById('alarmTime').value;
  		alarm.time = alarmTime.slice(0, 2) + ':' + alarmTime.slice(3, 5);
  		alarm.isSet = true;

  		$('#alarmButton').text("Cancel Alarm");
  		displayNotification("Alarm has been set");

  		alarm.checkAlarmID = setInterval(checkAlarm, 500);
	}
}