import utils from '@bigcommerce/stencil-utils';

export default function (post) {
    function fetchPageByUrl(relatedContent) {
        utils.api.getPage(relatedContent, { template: 'f/blog/related-article' }, (err, content) => {
            if (err) {
                throw new Error(err);
            }
            $('.relatedContent').append(content);
        });
    }

    fetchPageByUrl(post);

    $('.relatedContent').show();
}
