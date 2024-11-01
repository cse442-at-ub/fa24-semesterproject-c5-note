<?php
require_once 'vendor/autoload.php';

use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\IOFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['htmlContent']) && isset($_POST['filename'])) {
    $htmlContent = $_POST['htmlContent'];
    $filename = $_POST['filename'];

    try {
        $phpWord = new PhpWord();
        $section = $phpWord->addSection();
        \PhpOffice\PhpWord\Shared\Html::addHtml($section, $htmlContent, false, false);

        $tempFile = tempnam(sys_get_temp_dir(), 'docx');
        $xmlWriter = IOFactory::createWriter($phpWord, 'Word2007');
        $xmlWriter->save($tempFile);

        header("Content-Disposition: attachment; filename={$filename}.docx");
        header("Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        readfile($tempFile);
        unlink($tempFile);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to generate DOCX']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
}