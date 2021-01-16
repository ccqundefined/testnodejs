window.onload = function() {
  new Swiper('.swiper-container', {
    loop: true,
    navigation: {
      nextEl: '.swiper-botton-next',
      prevEl: '.swiper-botton-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    autoplay: true,
  });
};
