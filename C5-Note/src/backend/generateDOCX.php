<?php
require_once 'vendor/autoload.php';

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['htmlContent']) && isset($_POST['filename'])) {
    $htmlContent = $_POST['htmlContent'];
    $filename = $_POST['filename'];

    try {
        // Preprocess the HTML content to retain only 'src', 'width', and 'height' in <img> tags
        $htmlContent = preg_replace_callback(
            '/<img\b[^>]*>/i',
            function ($match) {
                // Extract only the desired attributes
                $imgTag = $match[0];
                preg_match('/src="([^"]*)"/i', $imgTag, $src);
                preg_match('/width="([^"]*)"/i', $imgTag, $width);
                preg_match('/height="([^"]*)"/i', $imgTag, $height);

                // Rebuild the img tag with only src, width, and height
                $newImgTag = '<img';
                if (!empty($src[0])) $newImgTag .= ' ' . $src[0];
                if (!empty($width[0])) $newImgTag .= ' ' . $width[0];
                if (!empty($height[0])) $newImgTag .= ' ' . $height[0];
                $newImgTag .= '>';

                return $newImgTag;
            },
            $htmlContent
        );

        $phpWord = new PhpWord();
        $section = $phpWord->addSection();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $htmlContent, false, false);

        // Temporary file to store the DOCX content
        $tempFile = tempnam(sys_get_temp_dir(), 'docx');
        $xmlWriter = IOFactory::createWriter($phpWord, 'Word2007');
        $xmlWriter->save($tempFile);

        header("Content-Disposition: attachment; filename={$filename}.docx");
        header("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        readfile($tempFile);
        unlink($tempFile);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate DOCX', 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
}
