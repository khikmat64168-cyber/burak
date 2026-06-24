console.log('Products frontend javascript file');

$(function () {
  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * product-collection (mahsulot turi) <select> o'zgarganda ishlaydi.
   * DRINK tanlansa — Dish size bloki (#product-collection) yashiriladi
   * va Drink litr bloki (#product-volume) ko'rsatiladi; boshqa tur
   * tanlansa — teskari. MUHIM: handler funksiya .on('change', fn) ning
   * IKKINCHI argumenti bo'lishi shart — aks holda hodisa tinglanmaydi.
   * selectedValue nomi if ichida ham aynan shunday yozilishi kerak.
   * ──────────────────────────────────────────────────────────────────
   */
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

  /**
   * ─── KOD TAHLILI ──────────────────────────────────────────────────
   * "New Product" tugmasi (#process-btn) bosilganda forma
   * (.dish-container) slideToggle bilan ochiladi va tugmaning o'zi
   * yashiriladi (display:none). "Cancel" (#cancel-btn) bosilganda forma
   * yopiladi va "New Product" tugmasi qaytadi (display:flex).
   * MUHIM: har bir .on(...) o'z });  bilan yopiladi, eng oxirgi });
   * esa $(function(){ ... }) blokini yopadi — bittasi yetishmasa,
   * butun fayl sintaksis xatosiga uchrab ishlamay qoladi.
   * ──────────────────────────────────────────────────────────────────
   */
  $('#process-btn').on('click', () => {
    $('.dish-container').slideToggle(500);
    $('#process-btn').css('display', 'none');
  });

  $('#cancel-btn').on('click', () => {
    $('.dish-container').slideToggle(100);
    $('#process-btn').css('display', 'flex');
  });

  $('.new-product-status').on('change', async function (e) {
    const id = e.target.id;
    const productStatus = $(`#$ {id}.new-product-status`).val();

    try {
      const response = await axios.post(`/admin/product/$(id)`, {
        productStatus: productStatus,
      });
      console.log('response:', response);
      const result = response.data;
      if (result.data) {
        $('.new-product-status').blur();
      } else alert('Product update failed');
    } catch (err) {
      console.log(err);
      alert('Product updates failed');
    }
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

/**
 * ─── KOD TAHLILI ──────────────────────────────────────────────────
 * previewFilehandler — EJS dagi <input type="file"> ning onchange
 * hodisasidan chaqiriladi. Funksiya nomi EJS dagi onchange bilan
 * AYNAN bir xil (kichik h) bo'lishi shart, aks holda topilmaydi.
 * input.files[0] — tanlangan faylni oladi. Fayl turi jpg/jpeg/png
 * ekanligi validImageType orqali tekshiriladi. FileReader faylni
 * base64 ko'rinishida o'qib, reader.onload ichida
 * #image-section-${order} img elementining src atributiga qo'yadi —
 * natijada rasm serverga yubormasdan, faqat brauzerda darhol
 * ko'rinadi (frontend preview).
 * ──────────────────────────────────────────────────────────────────
 */
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
