$(function() {
  app.init();
});

var app = {
  init() {
    this.toggleAside();
    this.deleteConfirm();
    this.resizeIframe();
  },

  toggleAside() {
    $('.aside>li:nth-child(1) ul,.aside>li:nth-child(2) ul,.aside>li:nth-child(3) ul').hide();
    $('.aside h4').on('click', function() {
      if ($(this).find('span').hasClass('nav_open')) {
        $(this).find('span').removeClass('nav_open')
          .addClass('nav_close');
      } else {
        $(this).find('span').removeClass('nav_close')
          .addClass('nav_open');
      }
      $(this).siblings('ul').slideToggle();
    });
  },
  deleteConfirm() {
    $('.delete').on('click', function() {
      // confirm点击是会返回true 点击否返回false
      const flag = confirm('您确定要删除吗?');
      return flag;
    });
  },
  changeStatus(el, model, attr, id) {
    $.get('/admin/changeStatus', { model, attr, id }, function(data) {
      if (data.success) {
        if (el.src.indexOf('yes') != -1) {
          el.src = '/public/admin/images/no.gif';
        } else {
          el.src = '/public/admin/images/yes.gif';
        }
      }
    });
  },
  resizeIframe() {
    const heights = document.documentElement.clientHeight - 100;
    $('#rightMain').css('height', heights);
  },
  editNum(el, model, attr, id) {
    const value = $(el).html();
    const input = $("<input value=''/>");
    // 把input放入span里面
    $(el).html(input);
    // 让input框自动获取焦点 并且赋值
    $(input).trigger('focus').val(value);
    // 点击input的时候阻止冒泡
    $(input).on('click', function() {
      return false;
    });
    // 鼠标离开的时候给span赋值
    $(input).on('blur', function() {
      // alert($(this).val());
      $(el).html($(this).val());
      const num = $(this).val();
      $.get('/admin/focus/editNum', { model, attr, id, num }, function(data) {
        console.log(data);
      });
    });
  },
};


$(window).resize(function() {
  app.resizeIframe();
});
