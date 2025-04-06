document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('welcomeModal');
  const startButton = document.getElementById('startNavigation');

  if (modal && startButton) {
    startButton.addEventListener('click', function () {
      modal.style.display = 'none';

      // Запускаем определение геолокации по клику пользователя
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          // Целевая точка
          const targetLat = 49.5832652;
          const targetLon = 34.5402392;

          const toRad = deg => deg * Math.PI / 180;
          const toDeg = rad => rad * 180 / Math.PI;

          const lat1 = toRad(userLat);
          const lon1 = toRad(userLon);
          const lat2 = toRad(targetLat);
          const lon2 = toRad(targetLon);
          const dLon = lon2 - lon1;

          let brng = Math.atan2(Math.sin(dLon) * Math.cos(lat2),
            Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon));
          gpsBearing = (toDeg(brng) + 360) % 360;

          updateArrows();
        }, function (err) {
          console.error('Ошибка определения геолокации:', err);
        });
      } else {
        console.error('Геолокация не поддерживается');
      }
    });
  }

  // Глобальные переменные для азимута и ориентации телефона
  let gpsBearing = 0;
  let phoneHeading = 0;

  // Функция обновления стрелок
  function updateArrows() {
    const topArrow = document.getElementById('gpsArrow');
    const bottomArrow = document.querySelector('.main-arrow.down');
    // Вычисляем итоговый угол поворота с учетом компенсации изначального смещения (-45deg)
    const topRotation = gpsBearing - phoneHeading - 45;
    // Нижняя стрелка зеркально отражается (по отношению к верхней)
    const bottomRotation = topRotation + 180;

    if (topArrow) {
      topArrow.style.animation = 'none';
      topArrow.style.transform = `rotate(${topRotation}deg)`;
    }
    if (bottomArrow) {
      bottomArrow.style.animation = 'none';
      bottomArrow.style.transform = `rotate(${bottomRotation}deg)`;
    }
  }

  // Обработка изменения ориентации устройства
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function (event) {
      // Используем webkitCompassHeading, если доступно
      if (event.webkitCompassHeading) {
        phoneHeading = event.webkitCompassHeading;
      } else if (event.alpha) {
        phoneHeading = event.alpha;
      } else {
        phoneHeading = 0;
      }
      updateArrows();
    }, true);
  } else {
    console.error('DeviceOrientationEvent не поддерживается');
  }
});
