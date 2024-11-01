'use strict';

(function($) {
  $(document).on('click touch', '.wpcss-checkbox-all', function() {
    $('.wpcss-checkbox-all').prop('checked', this.checked);
    $('.wpcss-checkbox').not(this).prop('checked', this.checked);
  });

  $(document).on('click touch', '.wpcss-popup-close', function() {
    $('.wpcss-area').removeClass('wpcss-area-show');
  });

  $(document).on('click touch', '.wpcss-area', function(e) {
    if ($(e.target).closest('.wpcss-popup').length === 0) {
      $('.wpcss-area').removeClass('wpcss-area-show');
    }
  });

  $(document).on('click touch', '.wpcss-btn', function(e) {
    var hash = $(this).data('hash');
    e.preventDefault();

    $(this).removeClass('wpcss-added').addClass('wpcss-adding');

    var data = {
      action: 'wpcss_share', hash: hash, nonce: wpcss_vars.nonce,
    };

    $.post(wpcss_vars.wc_ajax_url.toString().
        replace('%%endpoint%%', 'wpcss_share'), data, function(response) {
      $('.wpcss-btn').removeClass('wpcss-adding').addClass('wpcss-added');
      $('.wpcss-popup-content').html(response);
      $('.wpcss-area').addClass('wpcss-area-show');
    });
  });

  // copy link
  $(document).
      on('click touch', '#wpcss_copy_url, #wpcss_copy_btn', function(e) {
        wpcss_copy_to_clipboard('#wpcss_copy_url');
      });

  function wpcss_copy_to_clipboard(el) {
    // resolve the element
    el = (typeof el === 'string') ? document.querySelector(el) : el;

    // handle iOS as a special case
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      // save current contentEditable/readOnly status
      var editable = el.contentEditable;
      var readOnly = el.readOnly;

      // convert to editable with readonly to stop iOS keyboard opening
      el.contentEditable = true;
      el.readOnly = true;

      // create a selectable range
      var range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    } else {
      el.select();
    }

    // execute copy command
    document.execCommand('copy');

    // alert
    alert(wpcss_vars.copied_text.replace('%s', el.value));
  }
})(jQuery);