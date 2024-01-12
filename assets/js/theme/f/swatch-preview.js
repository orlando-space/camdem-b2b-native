import utils from '@bigcommerce/stencil-utils';

export default function () {
    const $src = $('.card-swatches');

    function showSwatchPreview() {
        const productId = $(this).attr('data-id');
        utils.api.product.getById(
            productId, { template: 'f/swatches/product-swatches' }, (err, resp) => {
                const swatchContent = $.parseHTML(resp);
                $(this).html(swatchContent);
            });
    }

    $src.each(showSwatchPreview);
}
