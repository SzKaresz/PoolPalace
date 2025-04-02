<?php
// A cikkszámot a kérésből olvassuk
$cikkszam = isset($_GET['cikkszam']) ? $_GET['cikkszam'] : null;

// Ellenőrizzük, hogy van-e megadott cikkszám
if ($cikkszam) {
    $dir = '../img/termekek/'; // A mappa, ahol a képek találhatók
    $files = array();

    // Kép keresése a cikkszám alapján
    $i = 0;
    while (true) {
        if($i==0){
            $filename = $dir . $cikkszam . '.webp';$i++;
        }
        else{
            $filename = $dir . $cikkszam .'_'.$i.'.webp';
        }
        if (file_exists($filename)) {
            $files[] = $filename; // A képek URL-jei a tömbbe kerülnek
        } else {
            break; // Kilépünk, ha nincs több kép
        }
        $i++;
    }
    echo json_encode($files);
} else {
    echo json_encode(array()); // Ha nincs megadott cikkszám, üres tömböt adunk vissza
}
?>
