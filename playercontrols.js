let mouseDown = false;

$(document).ready(function () {

  $('#volume-mute, #volume-medium, #volume-off, #volume').hide();

  // objeto para controlar o audio
  const audio = document.getElementById('audio');

  // adiciona o tempo do audio ao carregar pagina
  $('#timeleft').text('-' + timeSecond(audio.duration));

  //Funcoes para passar a posicao do mouse na barra
  $('.info .progressbar_slide').mousedown(function (e) {
    e.preventDefault();
    mouseDown = true;
  });

  $('.info .progressbar_slide').mouseup(function (e) {
    timeFromOffset(e, this);
  });

  $(document).mouseup(function () {
    mouseDown = false;
  });

  //funcao para definir o currentTime de acordo com a barra
  function timeFromOffset(mouse, progressBar) {
    const percentage = mouse.offsetX / $(progressBar).width() * 100;
    const seconds = audio.duration * (percentage / 100);
    audio.currentTime = seconds;
  }

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
      audio.volume = 1;
    } else {
      $('#volume_btn').attr('data-volume', '0');
      $('#volume-mute').show();
      $('#volume-up').hide();
      $('#volRange').val(0);
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
    $(this).attr('data-tippy-content', Math.round(volumeRange * 100) + '%');

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
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    $('.progressbar_range').stop(true, true).animate({ 'width': -0.10 + (currentTime + .25) / duration * 100 + '%' }, 250, 'linear');
    $('.progressbar_range .progressbar_dot').stop(true, true).animate({ 'left': -1.5 + (currentTime + .25) / duration * 100 + '%' }, 250, 'linear');
  });


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
    $('.progressbar_range').stop(true, true).animate({ 'width': 0 + '%' }, 250, 'linear');
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
    delay: [300, 0],
  });

  //tooltip botao forward
  tippy('#next_btn', {
    interactive: false,
    content: 'Avançar 15 segundos',
    animation: 'fade',
    delay: [300, 0],
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