(function($) {
  const app = {
    init() {

      this.initSwiper();

      this.initNavSlide();
      this.initColorSelect();
    },
    initSwiper() {
      new Swiper('.swiper-container', {
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: true,
      });
    },
    initNavSlide() {
      $('#nav_list>li').hover(function() {

        $(this).find('.children-list').show();
      }, function() {
        $(this).find('.children-list').hide();
      });

    },
    initColorSelect() {
        var that = this;
				$('#color_list .banben').click(function() {
					// 获取当前商品的id
					var goods_id = $(this).attr('goods_id')
					// 获取当前的颜色值
					var color_id = $(this).attr('goods_color');
					$.get('/getImageList?goods_id='+goods_id+'&color_id='+color_id,function(response){
						console.log(response);
						var result = response.result;
						var str = '';
						for(var i = 0; i < result.length; i++) {
							str += "<div class='swiper-slide'><img src='"+result[i].img_url+"' style='width:100%'></div>"
						}
            $('#swiper-wrapper').html(str);
            //改变轮播图以后重新初始化轮播图 
            that.initSwiper();
					})
					$(this).addClass('active').siblings().removeClass('active');
				})
    }
  };

  $(function() {


    app.init();
  });


})($);
