let mouseDown = false;

$(document).ready(function () {

  $('#volume-mute, #volume-medium, #volume-off, #volume').hide();

  // objeto para controlar o audio
  const audio = document.getElementById('audio');

  // Funcoes para passar a posicao do mouse na barra
  $('#audioProgress').mousedown(function () {
    mouseDown = true;
  });

  $('#audioProgress').mouseup(function () {
    const desiredTime = $(this).val();
    audio.currentTime = desiredTime;
  });

  $(document).mouseup(function () {
    mouseDown = false;
  });

  // Botao play e pause
  $("#plays_btn").click(function (e) {
    e.preventDefault();

    if (audio.paused == false) {
      audio.pause();
      $("#play_btn").show();
      $("#pause_btn").hide();
    } else {
      audio.play();
      $("#play_btn").hide();
      $("#pause_btn").show();
      $('#audioProgress').attr('max', audio.duration);
      $('#timeleft').text('-' + timeSecond(audio.duration));
    }
  });

  // volta 15 segundos
  $('#prev_btn').on('click', function () {
    audio.currentTime -= 15;
  });

  // avanca 15 segundos
  $('#next_btn').on('click', function () {
    audio.currentTime += 15;
  });

  // mute e desmute
  $('.btnVolume').on('click', function (e) {
    e.preventDefault();
    const checkVolume = audio.volume;

    if (checkVolume == 0) {
      $('#volume_btn').attr('data-volume', '1');
      $('#volume-mute').hide();
      $('#volume-up').show();
      $('#volRange').val(100);
      $('#volRange').css("background", "linear-gradient(to right, rgb(0, 138, 255) 0%, rgb(0, 138, 255) 100%, rgb(238, 238, 238) 100%, rgb(238, 238, 238) 100%)");
      audio.volume = 1;
    } else {
      $('#volume_btn').attr('data-volume', '0');
      $('#volume-mute').show();
      $('#volume-up').hide();
      $('#volRange').val(0);
      $('#volRange').css("background", "linear-gradient(to right, rgb(0, 138, 255) 0%, rgb(0, 138, 255) 0%, rgb(238, 238, 238) 0%, rgb(238, 238, 238) 100%)");
      audio.volume = 0;
    }

  });

  //Escolha de velocidade
  $('.dropdown-content span').on('click', function (e) {
    e.preventDefault();
    const speed = $(this).attr('class');
    audio.playbackRate = speed;
    $('.dropbtn strong').text(speed + 'x');
  });

  // Range de volume
  $('#volRange').on('input change', function () {
    const volumeRange = $(this).val() / 100;
    const i = volumeRange * 100;
    $(this).attr('data-tippy-content', Math.round(volumeRange * 100) + '%');
    $(this).css("background", "linear-gradient(to right, rgb(0, 138, 255) 0%, rgb(0, 138, 255) " + i + "%, rgb(238, 238, 238) " + i + "%, rgb(238, 238, 238) 100%)");
    

    audio.volume = volumeRange;

    if (volumeRange > 0 && volumeRange <= 0.2) {
      $('#volume-mute, #volume-up, #volume-medium, #volume').hide();
      $('#volume-off').show();
    } else if (volumeRange > 0.2 && volumeRange <= 0.5) {
      $('#volume-mute, #volume-up, #volume-off, #volume').hide();
      $('#volume-medium').show();
    } else if (volumeRange > 0.5 && volumeRange <= 0.8) {
      $('#volume-mute, #volume-up, #volume-off, #volume-medium').hide();
      $('#volume').show();
    } else if (volumeRange > 0.8 && volumeRange <= 1) {
      $('#volume-mute, #volume-off, #volume-medium, #volume').hide();
      $('#volume-up').show();
    } else {
      $('#volume-up, #volume-medium, #volume-off, #volume').hide();
      $('#volume-mute').show();
    }
  });

  // Preencher barra de progresso
  audio.addEventListener("timeupdate", function timeUpdate() {
    if(!mouseDown){
      const max = $('#audioProgress').attr('max');
      const i = ($('#audioProgress').val() / max * 100) + 0.4;
      $('#audioProgress').prop('value', audio.currentTime);
      $('.slider_bar').css("width", i + "%").css("will-change", "width");
    }
  });

  $('#audioProgress').on('input change', function(){
    const max = $(this).attr('max');
    const i = $(this).val() / max * 100;
    $('.slider_bar').css("width", i + "%").css("will-change", "width");
  })

  // Funcao para mostrar o tempo restante
  audio.addEventListener("timeupdate", function () {
    const duration = parseInt(audio.duration);
    const currentTime = parseInt(audio.currentTime);
    const timeLeft = duration - currentTime;
    let second, minute, hour;
    let currentSecond, currentMinute, currentHour;

    second = timeLeft % 60;
    minute = Math.floor(timeLeft / 60) % 60;
    hour = Math.floor(timeLeft / 3600);

    hour = hour < 10 ? "0" + hour : hour;
    second = second < 10 ? "0" + second : second;
    minute = minute < 10 ? "0" + minute : minute;

    $('#timeleft').text("-" + hour + ":" + minute + ":" + second);

    currentSecond = currentTime % 60;
    currentMinute = Math.floor(currentTime / 60) % 60;
    currentHour = Math.floor(currentTime / 3600);

    currentHour = currentHour < 10 ? "0" + currentHour : currentHour;
    currentSecond = currentSecond < 10 ? "0" + currentSecond : currentSecond;
    currentMinute = currentMinute < 10 ? "0" + currentMinute : currentMinute;

    $('#current-time').text(currentHour + ":" + currentMinute + ":" + currentSecond);

  });

  //funcao para resetar os itens quando o audio acabar
  audio.addEventListener("ended", function () {
    $("#play_btn").show();
    $("#pause_btn").hide();
    $('.slider_bar').css("width", "0%");
    audio.currentTime = 0;
  }, false);

  // funcao para converter o tempo total em hh:mm:ss
  function timeSecond(times) {
    times = Math.floor(times);

    let hours = Math.floor(times / 3600);
    let minutes = Math.floor((times - (hours * 3600)) / 60);
    let seconds = times - (hours * 3600) - (minutes * 60);

    if (hours < 10)
      hours = "0" + hours;
    if (minutes < 10)
      minutes = "0" + minutes;
    if (seconds < 10)
      seconds = "0" + seconds;

    let time = hours + ':' + minutes + ':' + seconds;

    return time;
  }

  //tooltip botao previa
  tippy('#prev_btn', {
    interactive: false,
    content: 'Retroceder 15 segundos',
    animation: 'fade',
    distance: 25,
    delay: [500, 0],
  });

  //tooltip botao forward
  tippy('#next_btn', {
    interactive: false,
    content: 'Avançar 15 segundos',
    animation: 'fade',
    distance: 25,
    delay: [500, 0],
  });

  $('.dropdown-content span').mouseover(function () {
    tippy('.dropdown-content span', {
      interactive: false,
      placement: 'right',
      animation: 'fade',
      delay: [300, 0],
    });
  });

});