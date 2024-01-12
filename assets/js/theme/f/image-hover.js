export default function () {
    const $src = $('img.card-image');
    let $originalImage;
    let $hoverImage;

    function replaceImageWithHover() {
        $originalImage = $(this).attr('data-src');
        $hoverImage = $(this).attr('data-hover');
        if ($hoverImage !== null) {
            $(this).attr('src', $hoverImage);
        }
    }

    function replaceImageWithOriginal() {
        $(this).attr('src', $originalImage);
    }

    $src.on('mouseover', replaceImageWithHover);
    $src.on('mouseout', replaceImageWithOriginal);
}
