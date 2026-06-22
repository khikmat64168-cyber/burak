console.log('Products frontend javascript file');

$(function () {
  $('.product-collection').on('change', function () {
    const selectedValue = $('.product-collection').val();
    if (selectedValue === 'DRINK') {
      $('#product-collection').hide(); // Dish size yashiriladi
      $('#product-volume').show(); // Drink litr ko'rsatiladi
    } else {
      $('#product-volume').hide(); // litr yashiriladi
      $('#product-collection').show(); // size ko'rsatiladi
    }
  });

  $('#process-btn').on('click', () => {
    $('.dish-container').slideToggle(500);
    $('#process-btn').css('display', 'none');
  });

  $('#cancel-btn').on('click', () => {
    $('.dish-container').slideToggle(100);
    $('#process-btn').css('display', 'flex');
  });
});

function validateForm() {
  const productName = $('.producct-name').val();
  const productPrice = $('.product-price').val();
  const productLeftCount = $('.product-left-count').val();
  const productCollection = $('.product-collection').val();
  const productDesc = $('.product-desc').val();
  const productStatus = $('.producct-status').val();

  if (
    productName === '' ||
    productPrice === '' ||
    productLeftCount === '' ||
    productCollection === '' ||
    productDesc === '' ||
    productStatus === ''
  ) {
    alert(' Please , insert all details!');
    return false;
  } else return true;
}

function previewFilehandler(input, order) {
  const file = input.files[0];
  if (!file) return;

  const fileType = file['type'];
  const validImageType = ['image/jpg', 'image/jpeg', 'image/png'];

  if (!validImageType.includes(fileType)) {
    alert('Please , insert only jpeg , jpng ,png  ');
  } else {
    const reader = new FileReader();
    reader.onload = function () {
      $(`#image-section-${order}`).attr('src', reader.result);
    };
    reader.readAsDataURL(file);
  }
}
