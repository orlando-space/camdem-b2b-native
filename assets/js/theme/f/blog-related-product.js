import utils from '@bigcommerce/stencil-utils';

export default function (product) {
    const relatedProduct = product.split(':');

    function fetchProductById(rp) {
        utils.api.product.getById(rp, { template: 'f/blog/blog-product-card' }, (err, content) => {
            if (err) {
                throw new Error(err);
            }
            $('.relatedProducts').append(content);
        });
    }

    // ID: relatedProduct[1]
    for (let i = 1; i < relatedProduct.length; i++) {
        fetchProductById(relatedProduct[i]);
    }

    $('.relatedProducts').show();
}
