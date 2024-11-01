'use strict';

(function($) {
  var wpcss_timeout = null;

  $(document).on('click touch', '.wpcss-edit', function(e) {
    // edit cart
    e.preventDefault();

    var cart_key = $(this).closest('.wpcss-shared-cart').data('key');
    var data = {
      action: 'wpcss_edit', nonce: wpcss_vars.nonce, cart_key: cart_key,
    };

    $('#wpcss_dialog').addClass('wpcss-loading');
    $('#wpcss_dialog').
        dialog({
          minWidth: 460,
          title: 'Shared Cart #' + cart_key,
          modal: true,
          dialogClass: 'wpc-dialog',
          open: function() {
            $('.ui-widget-overlay').bind('click', function() {
              $('#wpcss_dialog').dialog('close');
            });
          },
        });

    $.post(ajaxurl, data, function(response) {
      $('#wpcss_dialog').html(response).removeClass('wpcss-loading');
    });
  });

  $(document).on('click touch', '.wpcss-edit-price', function(e) {
    // edit price
    e.preventDefault();

    var reg = new RegExp('^[0-9.]+$');
    var val = $(this).data('val');
    var cart_key = $(this).closest('.wpcss-edit-cart-items').data('key');
    var item_key = $(this).closest('.wpcss-edit-cart-item').data('key');

    let price = prompt(
        'Enter the new price for displaying on the shared cart only:', val);

    if (price != null && price !== '' && reg.test(price)) {
      $('#wpcss_dialog').addClass('wpcss-loading');

      var data = {
        action: 'wpcss_edit_price',
        nonce: wpcss_vars.nonce,
        cart_key: cart_key,
        item_key: item_key,
        price: price,
      };

      $.post(ajaxurl, data, function(response) {
        $('#wpcss_dialog').html(response).removeClass('wpcss-loading');
      });
    }
  });

  $(document).on('click touch', '.wpcss-edit-quantity', function(e) {
    // edit quantity
    e.preventDefault();

    var reg = new RegExp('^[0-9.]+$');
    var val = $(this).data('val');
    var cart_key = $(this).closest('.wpcss-edit-cart-items').data('key');
    var item_key = $(this).closest('.wpcss-edit-cart-item').data('key');

    let quantity = prompt('Enter the quantity:', val);

    if (quantity != null && quantity !== '' && reg.test(quantity)) {
      $('#wpcss_dialog').addClass('wpcss-loading');

      var data = {
        action: 'wpcss_edit_quantity',
        nonce: wpcss_vars.nonce,
        cart_key: cart_key,
        item_key: item_key,
        quantity: quantity,
      };

      $.post(ajaxurl, data, function(response) {
        $('#wpcss_dialog').html(response).removeClass('wpcss-loading');
      });
    }
  });

  $(document).on('click touch', '.wpcss-edit-note', function(e) {
    // edit note
    e.preventDefault();

    var reg = new RegExp('^[0-9.]+$');
    var val = $(this).data('val');
    var cart_key = $(this).closest('.wpcss-edit-cart-items').data('key');
    var item_key = $(this).closest('.wpcss-edit-cart-item').data('key');

    let note = prompt('Enter the note, leave it empty if you want to remove:',
        val);

    if (note != null) {
      $('#wpcss_dialog').addClass('wpcss-loading');

      var data = {
        action: 'wpcss_edit_note',
        nonce: wpcss_vars.nonce,
        cart_key: cart_key,
        item_key: item_key,
        note: note,
      };

      $.post(ajaxurl, data, function(response) {
        $('#wpcss_dialog').html(response).removeClass('wpcss-loading');
      });
    }
  });

  $(document).on('click touch', '.wpcss-add', function(e) {
    // add product to the cart
    e.preventDefault();

    var $this = $(this);
    var cart_key = $this.closest('.wpcss-add-cart-item-form').data('key');
    var product_id = $this.data('id');

    var data = {
      action: 'wpcss_add',
      nonce: wpcss_vars.nonce,
      cart_key: cart_key,
      product_id: product_id,
    };

    $('#wpcss_dialog').addClass('wpcss-loading');

    $.post(ajaxurl, data, function(response) {
      $('#wpcss_dialog').html(response).removeClass('wpcss-loading');
    });
  });

  $(document).on('click touch', '.wpcss-delete', function(e) {
    // delete cart
    e.preventDefault();

    var $this = $(this);
    var cart_key = $this.closest('.wpcss-shared-cart').data('key');

    if (confirm('Are you sure to delete #' + cart_key + '?')) {
      var data = {
        action: 'wpcss_delete', nonce: wpcss_vars.nonce, cart_key: cart_key,
      };

      $this.closest('.wpcss-shared-carts').addClass('wpcss-loading');

      $.post(ajaxurl, data, function(response) {
        $this.closest('.wpcss-shared-carts').removeClass('wpcss-loading');
        $this.closest('tr').remove();
      });
    }
  });

  $(document).on('click touch', '.wpcss-remove', function(e) {
    // remove cart item
    e.preventDefault();

    if (confirm('Are you sure to remove?')) {
      var $this = $(this);
      var cart_key = $this.closest('.wpcss-edit-cart-items').data('key');
      var item_key = $this.closest('.wpcss-edit-cart-item').data('key');
      var data = {
        action: 'wpcss_remove',
        nonce: wpcss_vars.nonce,
        cart_key: cart_key,
        item_key: item_key,
      };

      $this.closest('.wpcss-edit-cart-items').addClass('wpcss-loading');

      $.post(ajaxurl, data, function(response) {
        $this.closest('.wpcss-edit-cart-items').removeClass('wpcss-loading');
        $this.closest('.wpcss-edit-cart-item').remove();
      });
    }
  });

  // search product
  $(document).on('keyup', '.wpcss-add-cart-item-search', function() {
    if ($('.wpcss-add-cart-item-search').val() != '') {

      if (wpcss_timeout != null) {
        clearTimeout(wpcss_timeout);
      }

      wpcss_timeout = setTimeout(wpcss_search_product, 300);
      return false;
    }
  });

  function wpcss_search_product() {
    wpcss_timeout = null;

    var data = {
      action: 'wpcss_search_product',
      nonce: wpcss_vars.nonce,
      keyword: $('.wpcss-add-cart-item-search').val(),
    };

    $('.wpcss-add-cart-item-search-result').html('Searching...');

    $.post(ajaxurl, data, function(response) {
      $('.wpcss-add-cart-item-search-result').html(response);
    });
  }
})(jQuery);