import utils from '@bigcommerce/stencil-utils';

export default function () {
    const $src = $('.card-sizes');

    function showSizePreview() {
        const productId = $(this).attr('data-id');
        utils.api.product.getById(
            productId, { template: 'f/swatches/product-sizes' }, (err, resp) => {
                const sizeContent = $.parseHTML(resp);
                $(this).html(sizeContent);
            });
    }

    $src.each(showSizePreview);
}
