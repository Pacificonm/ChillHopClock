//GLOBALS
//--------------------------------------------------------------
const clock = {
  hours: '00',
  minutes: '00',
  seconds: '00',
  meridiem: 'AM',
  militaryTime: false,
  updateTime: function(){
    let today = new Date();
    this.hours = Number(today.getHours());
    this.minutes = Number(today.getMinutes());
    this.seconds = Number(today.getSeconds());

    if(this.militaryTime){
      this.meridiem = null;
    }
    else if(this.hours < 12){
      this.meridiem = 'AM';
    }
    else{
      this.meridiem = 'PM';
    } 

    if(!this.militaryTime && this.hours > 12){
      this.hours -= 12;
    }
  }
}
const alarm = {
  hours: null,
  minutes: null,
  meridiem: null,
  isSet: false,
  checkAlarmID: null,
  alarmAudio: new Audio('audio/hiphopAlarm.mp3')
};
//--------------------------------------------------------------

const changeDisplay = () => {
  clock.militaryTime = !clock.militaryTime;

  if(clock.militaryTime){
    $('#milButtonText').text("Regular Time");
  }
  else{
    $('#milButtonText').text("Military Time");
  }
}
$('#militaryButton').on('click', changeDisplay);

const displayTime = () => {
  clock.updateTime();
  let hours = clock.hours;
  let minutes = clock.minutes;
  let seconds = clock.seconds;

  if(clock.hours < 10){
    hours = '0' + hours;
  }

  if(minutes < 10){
    minutes = '0' + minutes;
  }

  if(seconds < 10){
    seconds = '0' + seconds;
  }

  if(clock.militaryTime){
     $('#clock').text(`${hours}:${minutes}:${seconds}`);
  }
  else{
     $('#clock').text(`${hours}:${minutes}:${seconds} ${clock.meridiem}`);
  }
}

displayTime();
//Refresh clock every 250 miliseconds
//setInternal calls passed function until page is closed
setInterval(displayTime, 250);

//#################################################################
//#################################################################
//Background Music
const backgroundMusic = {
  library: ['audio/track1.mp3', 'audio/track2.mp3', 'audio/track3.mp3'],
  currentMusic: new Audio(),
  currentIndex: null
}

function changeMusic(index){
  backgroundMusic.currentMusic = new Audio(backgroundMusic.library[index]);
  backgroundMusic.currentIndex = index;

  //update listener
  backgroundMusic.currentMusic.addEventListener('ended', () => {
    backgroundMusic.currentMusic.currentTime = 0;
    backgroundMusic.currentMusic.play();
  });
}

const playMusic = () => {
  let songSelection = $('#musicSelector').val();

  if(backgroundMusic.currentMusic.paused){
    if(backgroundMusic.currentIndex !== songSelection){
      changeMusic(songSelection);
    }

    backgroundMusic.currentMusic.play();
    $('#musicButton').text('Pause Music');
  }
  else{
    backgroundMusic.currentMusic.pause();
    $('#musicButton').text('Play Music');
  }
}

// document.getElementById('musicButton').addEventListener('click', playMusic);
//#################################################################
//#################################################################

//#################################################################
//#################################################################
//Alarm
function checkValidTimeInput(){
  let alarmTime = document.getElementById('alarmInput').value;
  let meridiemSelector = document.getElementById('meridiemSelector').value;
    
  let hour = Number(alarmTime.slice(0, 2));
  let minute = Number(alarmTime.slice(3, 5));
  let colon = alarmTime[2];

  //probably easier to do with regex (but I suck at regex)
  if(isNaN(hour) || isNaN(minute) || colon !== ':' || alarmTime.length !== 5){
    return false;
  }
  else if((hour > 12 && clock.militaryTime === false) || (hour === 0 && clock.militaryTime === false)){
    return false;
  }
  else if(hour > 24 || minute > 59 || (hour === 24 && minute > 0)){
    return false;
  }
  else if(hour < 0 || minute < 0){
    return false;
  }

  if(clock.militaryTime === false && $('#meridiemSelector').val() == 0){
    return false;
  }
  else if(clock.militaryTime === true && $('#meridiemSelector').val() != 0){
    return false;
  }

  return true;
}

function displayNotification(message){
  let notification = document.getElementById('alarmNotification');
  notification.textContent = message;

  $('#alarmNotification').fadeIn('normal');
  setTimeout(() => {
    $('#alarmNotification').fadeOut('normal');
  }, 1500);
}

function resetAlarm(buttonText){
  $('#alarmButton').text(buttonText);
  $('#alarmInput').val('');
  // alarm.time = null;
  alarm.hours = null;
  alarm.minutes = null;
  alarm.meridiem = null;
  alarm.isSet = false;
  clearInterval(alarm.checkAlarmID);
}

function activateAlarm(){
  $('#musicIframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  // backgroundMusic.currentMusic.pause();
  $('#musicButton').text('Play Music');
  alarm.alarmAudio.play();
  resetAlarm("STOP ALARM");
  // displayNotification("ALARM!!");
}

function checkAlarm(){
  if(clock.hours === alarm.hours && 
    clock.minutes === alarm.minutes && 
    clock.meridiem === alarm.meridiem){
    activateAlarm();
  }
}

function setAlarm(){
  let alarmTime = document.getElementById('alarmInput').value;
  // alarm.time = alarmTime.slice(0, 2) + ':' + alarmTime.slice(3, 5);
  alarm.hours = Number(alarmTime.slice(0, 2));
  alarm.minutes = Number(alarmTime.slice(3, 5));
  if(clock.militaryTime === false){
    alarm.meridiem = $('#meridiemSelector option:selected').text();
  }
  else{
    alarm.meridiem = null;
  }
  alarm.isSet = true;

  $('#alarmButton').text("Cancel Alarm");
  displayNotification("Alarm has been set");

  alarm.checkAlarmID = setInterval(checkAlarm, 500);
}

function alarmButtonClick(){
  if(!alarm.alarmAudio.paused){
    alarm.alarmAudio.pause();
    alarm.alarmAudio.currentTime = 0;
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

  setAlarm();
}

alarm.alarmAudio.addEventListener('ended', () => {
    alarm.alarmAudio.currentTime = 0;
    alarm.alarmAudio.play();
});
document.getElementById('alarmButton').addEventListener('click', alarmButtonClick);
//#################################################################
//#################################################################