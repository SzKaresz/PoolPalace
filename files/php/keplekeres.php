<?php
$cikkszam = isset($_GET['cikkszam']) ? $_GET['cikkszam'] : null;

if ($cikkszam) {
    $dir = '../img/termekek/';
    $files = array();

    $i = 0;
    while (true) {
        if ($i == 0) {
            $filename = $dir . $cikkszam . '.webp';
            $i++;
        } else {
            $filename = $dir . $cikkszam . '_' . $i . '.webp';
        }
        if (file_exists($filename)) {
            $files[] = $filename;
        } else {
            break;
        }
        $i++;
    }
    echo json_encode($files);
} else {
    echo json_encode(array());
}
?>