-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 15. 10:11
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `poolpalace`
--
CREATE DATABASE IF NOT EXISTS `poolpalace` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `poolpalace`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `email` varchar(254) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(15) NOT NULL,
  `szallitasi_cim_id` int(11) NOT NULL,
  `szamlazasi_cim_id` int(11) NOT NULL,
  `jogosultsag` enum('felhasználó','admin') NOT NULL DEFAULT 'felhasználó'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`email`, `nev`, `jelszo`, `telefonszam`, `szallitasi_cim_id`, `szamlazasi_cim_id`, `jogosultsag`) VALUES
('fenyojordan2005@gmail.com', 'Fenyő Jordán', '$2y$10$TQ3vpwZsT8HKth.vFpGUcOxCDHh84uRx5sejcJxiUDflP9dTnSGxG', '06302776811', 5, 5, 'felhasználó'),
('info.poolpalace@gmail.com', 'Admin', '$2y$10$GAVPPqKoVgFkV5kMgn/8ROKu2LNiYTCen0PSCcPo3jDf79UyiAdF6', '', 1, 1, 'admin'),
('marcifiola66@gmail.com', 'Fiola Marcell Gyula', '$2y$10$CXYg5Bw12VLT0CB1I/ownuxgdVzrilym4tWcDI/f.6.uTHygxTWKi', '+36702070462', 3, 3, 'felhasználó'),
('szautnerkaroly@gmail.com', 'Szautner Károly', '$2y$10$tFcF/x0yN.1ZPDwcg4kXfeEjZqeP6wuZxyzxQ0aOOTZdgUckHUKy2', '+36305198474', 2, 2, 'felhasználó'),
('teszt.ember@gmail.com', 'Teszt Ember', '$2y$10$d4fkOPqwGdAWukU2RIHk/.LKjvSfOH8Uq6JIw1DpcOV1slejTiIJq', '+36991234567', 4, 4, 'felhasználó');

--
-- Eseményindítók `felhasznalok`
--
DELIMITER $$
CREATE TRIGGER `email_toLower` BEFORE INSERT ON `felhasznalok` FOR EACH ROW SET NEW.email = lower(NEW.email)
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `uj_felhasznalo` AFTER INSERT ON `felhasznalok` FOR EACH ROW INSERT INTO `log`(`tabla_nev`, `tabla_id`) VALUES ('felhasznalok', new.email)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gyarto`
--

CREATE TABLE `gyarto` (
  `id` int(11) NOT NULL,
  `nev` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `gyarto`
--

INSERT INTO `gyarto` (`id`, `nev`) VALUES
(1, 'OLYMPIC'),
(2, 'ACIS'),
(3, 'GEMAS'),
(4, 'BASIC'),
(5, 'STAGE-1'),
(6, 'BARENT'),
(7, 'OCEAN'),
(8, 'BADU'),
(9, 'SACI'),
(10, 'FAIRLAND'),
(11, 'AQUAGEM'),
(12, 'HIDROTEN'),
(13, 'AQUARAM'),
(14, 'SYSTEM'),
(15, 'GRIFFON'),
(16, 'INOX'),
(17, 'STEINBACH'),
(18, 'SOPREMA'),
(19, 'AZURO'),
(20, 'SAPHIR'),
(21, 'PLATINUM');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoria`
--

CREATE TABLE `kategoria` (
  `id` int(11) NOT NULL,
  `nev` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kategoria`
--

INSERT INTO `kategoria` (`id`, `nev`) VALUES
(1, 'Nyomócsövek'),
(2, 'Szelepek'),
(3, 'PVC kiegészítők'),
(4, 'Merülő medence'),
(5, 'Üvegszálas kompozit medence'),
(6, 'Fémfalas medence'),
(7, 'Létrák'),
(8, 'Zuhanyok'),
(9, 'Korlátok, kapaszkodók'),
(10, 'Fehér termék'),
(11, 'Vízalatti világítás'),
(12, 'Élményelemek'),
(13, 'Medence fóliák'),
(14, 'KIT fedés'),
(15, 'Szegélykövek'),
(16, 'Szűrőtartályok'),
(17, 'Szivattyúk'),
(18, 'Fűtés'),
(19, 'Vegyszerek'),
(20, 'Automata medencetisztító robotok'),
(21, 'Kézi medencetisztítás');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kosar`
--

CREATE TABLE `kosar` (
  `id` int(11) NOT NULL,
  `felhasznalo_id` varchar(254) NOT NULL,
  `termek_id` varchar(6) NOT NULL,
  `darabszam` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `kosar`
--

INSERT INTO `kosar` (`id`, `felhasznalo_id`, `termek_id`, `darabszam`) VALUES
(14, 'marcifiola66@gmail.com', '030024', 1),
(15, 'marcifiola66@gmail.com', '021301', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `log`
--

CREATE TABLE `log` (
  `id` int(10) NOT NULL,
  `datum` datetime NOT NULL DEFAULT current_timestamp(),
  `tabla_nev` varchar(15) NOT NULL,
  `tabla_id` varchar(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `log`
--

INSERT INTO `log` (`id`, `datum`, `tabla_nev`, `tabla_id`) VALUES
(1, '2025-02-20 11:38:38', 'felhasznalok', 'info.poolpalace@gmail.com'),
(2, '2025-03-27 10:27:51', 'felhasznalok', 'szautnerkaroly@gmail.com'),
(3, '2025-03-27 12:47:51', 'megrendeles', '1'),
(4, '2025-03-27 12:52:51', 'megrendeles', '2'),
(5, '2025-04-01 10:54:41', 'felhasznalok', 'marcifiola66@gmail.com'),
(6, '2025-04-01 10:55:29', 'megrendeles', '3'),
(7, '2025-04-02 22:43:29', 'felhasznalok', 'teszt.ember@gmail.com'),
(8, '2025-04-02 23:29:49', 'felhasznalok', 'fenyojordan2005@gmail.com');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `megrendeles`
--

CREATE TABLE `megrendeles` (
  `id` int(11) NOT NULL,
  `email` varchar(254) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `telefonszam` varchar(15) NOT NULL,
  `datum` datetime NOT NULL DEFAULT current_timestamp(),
  `osszeg` double NOT NULL,
  `szallit_irsz` varchar(10) NOT NULL,
  `szallit_telep` varchar(255) NOT NULL,
  `szallit_cim` varchar(255) NOT NULL,
  `szamlaz_irsz` varchar(10) NOT NULL,
  `szamlaz_telep` varchar(255) NOT NULL,
  `szamlaz_cim` varchar(255) NOT NULL,
  `statusz` enum('Feldolgozás alatt','Fizetésre vár','Fizetve','Szállítás alatt','Teljesítve') NOT NULL DEFAULT 'Feldolgozás alatt'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `megrendeles`
--

INSERT INTO `megrendeles` (`id`, `email`, `nev`, `telefonszam`, `datum`, `osszeg`, `szallit_irsz`, `szallit_telep`, `szallit_cim`, `szamlaz_irsz`, `szamlaz_telep`, `szamlaz_cim`, `statusz`) VALUES
(1, 'szautnerkaroly@gmail.com', 'Szautner Károly', '+36305198474', '2025-03-28 10:28:57', 35420, '8200', 'Veszprém', 'Muskátli utca 18/C', '8200', 'Veszprém', 'Muskátli utca 18/C', 'Feldolgozás alatt'),
(2, 'szautnerkaroly@gmail.com', 'Szautner Károly', '+36305198474', '2025-03-28 10:30:47', 132000, '8200', 'Veszprém', 'Muskátli utca 18/C', '8200', 'Veszprém', 'Muskátli utca 18/C', 'Feldolgozás alatt'),
(3, 'marcifiola66@gmail.com', 'Fiola Marcell Gyula', '+36702070462', '2025-04-01 10:55:29', 2738196, '8200', 'Veszprém', 'Ádám Iván utca 24.', '8200', 'Veszprém', 'Ádám Iván utca 24.', 'Feldolgozás alatt');

--
-- Eseményindítók `megrendeles`
--
DELIMITER $$
CREATE TRIGGER `megrendeles` AFTER INSERT ON `megrendeles` FOR EACH ROW INSERT INTO `log`(`tabla_nev`, `tabla_id`) VALUES ('megrendeles', new.id)
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szallitasi_cim`
--

CREATE TABLE `szallitasi_cim` (
  `id` int(11) NOT NULL,
  `iranyitoszam` varchar(7) NOT NULL,
  `telepules` varchar(58) NOT NULL,
  `utca_hazszam` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szallitasi_cim`
--

INSERT INTO `szallitasi_cim` (`id`, `iranyitoszam`, `telepules`, `utca_hazszam`) VALUES
(1, '', '', ''),
(2, '8200', 'Veszprém', 'Muskátli utca 18/C'),
(3, '8200', 'Veszprém', 'Ádám Iván utca 24.'),
(4, '8200', 'Veszprém', 'Teszt utca 1.'),
(5, '8105', 'Pétfürdő', 'Kazinczy utca 27.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szamlazasi_cim`
--

CREATE TABLE `szamlazasi_cim` (
  `id` int(11) NOT NULL,
  `iranyitoszam` varchar(7) NOT NULL,
  `telepules` varchar(58) NOT NULL,
  `utca_hazszam` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szamlazasi_cim`
--

INSERT INTO `szamlazasi_cim` (`id`, `iranyitoszam`, `telepules`, `utca_hazszam`) VALUES
(1, '', '', ''),
(2, '8200', 'Veszprém', 'Muskátli utca 18/C'),
(3, '8200', 'Veszprém', 'Ádám Iván utca 24.'),
(4, '8200', 'Veszprém', 'Tesztelés útja 26.'),
(5, '8105', 'Pétfürdő', 'Kazinczy utca 27.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `cikkszam` varchar(6) NOT NULL,
  `nev` varchar(70) NOT NULL,
  `egysegar` double NOT NULL,
  `akcios_ar` double DEFAULT NULL,
  `leiras` text NOT NULL,
  `gyarto_id` int(11) DEFAULT NULL,
  `kategoria_id` int(11) NOT NULL,
  `darabszam` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`cikkszam`, `nev`, `egysegar`, `akcios_ar`, `leiras`, `gyarto_id`, `kategoria_id`, `darabszam`) VALUES
('010001', 'OLYMPIC SZKIMMER', 12640, -1, 'Prémium szkimmer: kiváló megoldás fémfalas, PP és kompakt beépítést igénylő medencékhez. Kiemelkedő tulajdonsága a magasított nyak a könnyű járdaillesztéshez. Műszaki adatok: Csatlakozás: 6/4', 1, 10, 92),
('010003', 'OLYMPIC SZKIMMER KOSÁR', 2100, 1999, 'Olympic szkimmer kosár: minőségi ABS műanyag alkatrész, speciálisan tervezett mechanikus szűrő a medence kiáramló vizéhez, a nagyobb szennyeződések összegyűjtésére. A szkimmer feladata a víz elszívása és a lebegő szennyeződések kiszűrése a szűrőkosárban, melyet hetente ellenőrizni kell. Optimális működéshez a vízszintet a nyílás közepére kell állítani. A kosárba lassan oldódó vegyszerek helyezhetők, és a legtöbb szkimmer alkalmas porszívózásra. ABS műanyag: jó ütésálló, kemény, szilárd, hő- és vegyszerálló, zaj- és rezgéscsillapító hőre lágyuló műanyag, melynek kiválósága az akrilnitril (hő- és kémiai ellenállás), butadién (tartósság, szívósság) és sztirol (megmunkálhatóság, költségcsökkentés, fényes felület) kombinációjából adódik.', 1, 10, 27),
('010004', 'OLYMPIC SZKIMMER PORSZÍVÓTÁNYÉR', 2700, -1, 'Olympic szkimmer porszívótányér: kiváló alapanyagból készült ABS műanyag alkatrész. Minőségi szkimmer porszívótányér a medence aljának porszívózásakor a szűrőkosár tetejére helyezve hatékonyabb szívóerőt biztosít. A szkimmer feladata a víz elszívása és a lebegő szennyeződések kiszűrése a szűrőkosárban, melyet hetente ellenőrizni kell. Optimális működéshez a vízszintet a nyílás közepére kell állítani. A kosárba lassan oldódó vegyszerek helyezhetők, és a legtöbb szkimmer alkalmas porszívózásra. ABS műanyag: jó ütésálló, kemény, szilárd, hő- és vegyszerálló, zaj- és rezgéscsillapító hőre lágyuló műanyag, melynek kiválósága az akrilnitril (hő- és kémiai ellenállás), butadién (tartósság, szívósság) és sztirol (megmunkálhatóság, költségcsökkentés, fényes felület) kombinációjából adódik.', 1, 10, 48),
('010012', 'OLYMPIC SZKIMMER TETŐ', 3570, -1, 'Olympic szkimmer tető: minőségi ABS műanyag alkatrész az Olympic szkimmerhez, a belső felület és tartalom takarására és védelmére szolgál. A szkimmer feladata a víz elszívása és a lebegő szennyeződések kiszűrése a szűrőkosárban, melyet hetente ellenőrizni kell. Optimális működéshez a vízszintet a nyílás közepére kell állítani. A kosárba lassan oldódó vegyszerek helyezhetők, és a legtöbb szkimmer alkalmas porszívózásra. ABS műanyag: jó ütésálló, kemény, szilárd, hő- és vegyszerálló, zaj- és rezgéscsillapító hőre lágyuló műanyag, melynek kiválósága az akrilnitril (hő- és kémiai ellenállás), butadién (tartósság, szívósság) és sztirol (megmunkálhatóság, költségcsökkentés, fényes felület) kombinációjából adódik.', 1, 10, 54),
('011460', 'DESIGN SZKIMMER BETON A400 FEHÉR', 55600, -1, 'Design Acis színes A400 szkimmer: egyszerű, funkcionális design elegáns vonalvezetéssel, 6/4', 2, 10, 27),
('011495', 'SZKIMMER AJTÓ FEHÉR', 11650, -1, 'Színes Acis szkimmer ajtók: minőségi fehér ABS műanyagból készült szkimmer ajtó, mely illeszkedik az Acis szkimmerekhez. A szkimmer feladata a víz elszívása és a lebegő szennyeződések kiszűrése a szűrőkosárban, melyet hetente ellenőrizni kell. Optimális működéshez a vízszintet a nyílás közepére kell állítani. A kosárba lassan oldódó vegyszerek helyezhetők, és a legtöbb szkimmer alkalmas porszívózásra. ABS műanyag: jó ütésálló, kemény, szilárd, hő- és vegyszerálló, zaj- és rezgéscsillapító hőre lágyuló műanyag, melynek kiválósága az akrilnitril (hő- és kémiai ellenállás), butadién (tartósság, szívósság) és sztirol (megmunkálhatóság, költségcsökkentés, fényes felület) kombinációjából adódik.', 2, 10, 73),
('020100', 'REFLEKTOR STD2002 BETONOS 300W', 28750, 27749, 'Reflektor STD2002: víz alatti világítás medencékhez, hagyományos halogén vagy RGB LED-es 12V PAR 56 izzóval, 2 x 4mm kábellel (2,5m). Előlap rozsdamentes rögzítéssel, opcionális rozsdamentes acél előlappal. Rozsdamentes acél (inox): magasabb krómtartalmú acélötvözet, ellenállóbb a rozsdával és foltosodással szemben a króm-oxid passzív rétegnek köszönhetően, de extrém körülmények között rozsdásodhat.', 3, 11, 83),
('021200', 'REFLEKTOR MINI2008 BETON 50W', 23200, -1, 'Reflektor MINI2008 \"Mini 2008\" víz alatti világítás betonos medencéhez, Hőálló (ABS) műanyag test, fej fehér műanyagból, alsó kivezetéssel. Minőségi kialakítása kiváló fényerőt és élettartamot biztosít. 2 méteres kábellel kapható. 50 W / 12 V halogén izzóval. ABS műanyag Az ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad. Az akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 3, 11, 93),
('021301', 'REFLEKTOR MINI-CLICKER FÓLIA WH 7W', 29000, 27999, 'MINI-Clicker reflektor: közepes méretű, ideális medencevilágításhoz, villámgyors szerelés, kompakt kialakítás. Fő jellemzők: flexibilis felhasználhatóság, egyszerű szerelhetőség, könnyű polikarbonát lámpatest, SMD LED, ABS előlap, 1.2 m kábel.', 3, 11, 23),
('030024', 'VÁLTÓSZELEP 4-UTÚ TOP 1 1/2', 21500, 20999, 'Váltószelep - Basic szűrőhöz: 4-utú váltószelep Basic (TOP) szűrőtartályhoz, kiváló minőségű, magas élettartamú alkatrész, 1 1/2\" csatlakozással.', 4, 16, 29),
('033001', 'SZŰRŐHOMOK 0.5 - 1.0 MM 25KG/ZSÁK', 4380, -1, 'Szűrőhomok: osztályozott, tűziszárított gránithomok, szárítás és két méretre osztályozás után pormentesítve, 25 kg-os zsákokban csomagolva.', 5, 16, 79),
('033101', 'SZŰRŐÜVEG STAGE-1, 0.6 - 1.2 MM', 9400, 8990, 'Szűrőüveg: a Nature Works legújabb generációs, szűz újrahasznosított üvegen alapuló szűrőanyag, kizárólag vízszűrésre tervezve. A Nature Works High Tech Filter Media egészséges, higiénikus módon optimalizálja a forrásokat és emeli a víz minőségét. Újrahasznosított, újrahasznosítható, környezetbarát termék, mely csökkenti a hagyományos víztisztítási módszerek környezeti hatásait. Használható minden ipari víz- vagy medencevíz-szűrőnél, hatásai azonnal láthatóak. A biofilm felelős a klóraminokért és a szűrőközeg mikrocsatornáinak eltömődéséért. A Nature Works aszeptikus (baktériumtól mentes) tulajdonságai és az Anti-Compaction Technology megakadályozza a biofilm képződését, ezzel megnövelve a szűrőtöltet élettartamát. Összehasonlítva a szűrőhomokkal jobb vízminőséget, egyedi szűrőközeget, hosszabb élettartamot, kevesebb energia-, víz- és vegyszerpazarlást, környezetkímélő megoldást, optimalizált áramlást biztosít, és nincs biofilm képződés, nem szükséges pelyhesítő szer. Részecskék: mikroszkopikusan lapos és sima szélűek. A gyártási eljárással kapcsolatos élek nélküli termék létrehozására szolgáló MC2 tömörödésgátló technológiának két célja van: kiküszöbölni a baktériumoknak otthont adó éles széleket és biztosítani a termék biztonságát. Maximális szűrési teljesítmény: a Nature Works hatékonysága az úszómedencékben előforduló, ködössé tevő részecskék eltávolításán alapul. Ezt a szemcseformáknak és a felületkezelési technológiának köszönhetően éri el, ami lehetővé teszi a biofilm kialakulásának elkerülését, a mikrocsatornák nyitvatartását és a szemcsék biztonságos kezelését.', 5, 16, 8),
('037101', 'BARENT 1M O620 SIDE D75/D50', 705999, -1, 'Barent szűrőtartály: közületi medencékhez, iparági szabványoknak megfelelő, üvegszállal erősített, UV védőréteggel ellátott tartály, kollektor karos kialakítással. Nyomásmérővel és 6-állásos váltószeleppel szerelve. Tulajdonságok: glicerines nyomásmérő, nyomástesztelt, 5 év garancia, 620/750/900 mm átmérő, 1 méter szűrőágy magasság, OTH engedély. Műszaki adatok: 0,6-1,6 kg/cm2 üzemi nyomás, 2 kg/cm2 maximum nyomás, 3 kg/cm2 teszt nyomás, 1-40°C üzemi hőmérséklet. A szűrőtartály a vízforgatóval a medence vizének tisztaságát biztosítja a szennyeződések kiszűrésével.', 6, 16, 1),
('037111', 'OCEAN O1050 1M D110/D90', 1450000, -1, 'Ocean szűrőtartály: közületi medencékhez, iparági szabványoknak megfelelő, üvegszál erősített, UV védőréteggel, kollektor karos kialakítással. Opcionális: oldalsó búvónyílás, kémlelő ablak. Tulajdonságok: 1,0 méter szűrőágy magasság, 400mm átmérőjű üvegszál erősített tartályfedél, 75mm leeresztő nyílás, PVC csatlakozó karmantyú, speciális ózonálló bevonat opció, 10 év garancia, OTH engedély. Műszaki adatok: 0,6-2 kg/cm2 üzemi nyomás, 2,5 kg/cm2 maximum nyomás, 3,75 kg/cm2 teszt nyomás, 1-40°C üzemi hőmérséklet, ? 400 mm felső búvónyílás, 1000 mm szűrőágy magasság. A szűrőtartály a vízforgatóval a medence vizének tisztaságát biztosítja a szennyeződések kiszűrésével.', 7, 16, 85),
('050504', 'BADU Magic II/4', 123250, -1, 'BADU Magic II/4 1~, 0.18KW szivattyú: lakossági szegmens számára fejlesztett önfelszívó, keringető szivattyú kis és közepes méretű szűrőrendszerekhez. Nagy hatásfokú megbízható német szivattyú márka földfelszín feletti medencékhez. Műszaki információk: max 2m-rel a vízfelszín felé vagy max 3m-rel alá szerelhető, monoblokkos szivattyú beépített előszűrővel, ajánlott medenceméret: 10-60m3, sósvizes rendszerekhez telepíthető, max 5g/l só koncentrációig. Műszaki adatok: 6 m3/h H=6m működési tartomány, 230 V tápfeszültség.', 8, 17, 21),
('051006', 'MINI STREAMER STR 033M', 103000, 99999, 'Mini Streamer szivattyú GEMAS Mini Streamer előszűrős önfelszívó szivattyú, termoplasztik műanyagból. Minden típusú kis méretű medencéhez telepíthető. Minden eleme korrózióálló, erősített termoplasztikból készül a tartósság és hosszú élettartam érdekében. Szívó és nyomó csatlakozása 1 1/2?. Műszaki adatok - Működési tartomány: 6 m3/h H=9m - Teljesítmény: 0,33 HP - Tápfeszültség: 230 V', 3, 17, 49),
('054023', 'IE3 BRAVUS 300 230/400V', 436000, -1, 'IE3 Bravus szivattyú: kompakt, kiváló hidraulikus hatásfokú szivattyú élményelemekhez, masszázs rendszerekhez, ellenáramoltatók szereléséhez. Üvegszál erősítésű polipropilén szivattyúház, NORYL járókerék és diffúzor. Alkalmazási terület: élményelemekhez, masszázs rendszerekhez, ellenáramoltatók szereléséhez. Műszaki adatok: 52 m3/h H=10m működési tartomány, 3,0 HP teljesítmény, 230/400 V tápfeszültség, rozsdamentes acél (AISI 316) tengely, szilikon-kerámia / inox (AISI 316) csúszógyűrű, 2900 rpm motor, IP55 védelem. Sós víznek ellenálló kivitel.', 9, 17, 82),
('056118', 'INVERECO DE18', 269000, -1, 'InverEco DE18 inverteres szivattyú lakossági medencékhez. Az inverteres technológiával a motor fordulatszáma pontosan szabályozható. Visszamosatáskor a szivattyú 100%-os kapacitással, napi szűrés/vízforgatás esetén alacsonyabb térfogatárammal, csendesen és energiatakarékosan működik. Az Aquagem inverteres technológia növeli a szivattyú élettartamát. Tulajdonságok: egyszerű érintőkijelzős kezelőfelület, napi 4 időzíthető program, 30-100% szabályozható teljesítmény, energiafogyasztás megjelenítése, gombnyomásos visszamosás.', 10, 17, 67),
('056225', 'InverMaster IM25', 609850, -1, 'InverMaster IM25 Aquagem inverteres szivattyú: Az Aquagem InverSilence technológiája és a vízhűtés kombinációjával ventilátormentes, 30 dBA@1m működési zajú (40x csendesebb a hagyományos szivattyúknál) szivattyú. Tulajdonságok: maximum 3m-rel a vízszint fölé szerelhető, IE5 kefe nélküli DC motor, 20x energiamegtakarítás, Auto/Manual Inverter üzemmód, aktuális térfogatáram/energiafogyasztás megjelenítése, applikáció/digitális jel/RS485 külső vezérlés, sósvízhez alkalmas (max 5g/l só koncentrációig), Wi-Fi/Bluetooth.', 11, 17, 86),
('060005', 'D-KWT D50 RAGASZTHATÓ CSATLAKOZÓ', 5800, -1, 'Hőcserélőhöz ragasztható csatlakozó: D-KWT típusú hőcserélő csatlakoztatásához szükséges prémium minőségű műanyag cilinder, D50 mm átmérővel.', 12, 3, 26),
('080003', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 020', 2049, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D20). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 20 mm, hosszúság 3 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 31),
('080004', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 025', 3270, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D25). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 25 mm, hosszúság 3 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 53),
('080005', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 032', 3570, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D32). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 32 mm, hosszúság 3 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 73),
('080106', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 040', 3570, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D40). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 40 mm, hosszúság 3 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 64),
('080107', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 050', 5040, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D50). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 50 mm, hosszúság 3 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 81),
('080108', 'NYOMÓCSŐ D 063', 7700, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D63). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 63 mm, hosszúság 5 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 11),
('080109', 'NYOMÓCSŐ D 075', 6290, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D75). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 75 mm, hosszúság 5 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 11),
('080110', 'NYOMÓCSŐ D 090', 5459, 4799, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D90). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 90 mm, hosszúság 5 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, -2),
('080111', 'NYOMÓCSŐ D 110', 5865, -1, 'Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső (D110). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 110 mm, hosszúság 5 méter. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 99),
('080112', 'NYOMÓCSŐ D 125', 7790, -1, 'Kiváló minőségű, ragasztható, könnyű PVC nyomócső (D125). Jellemzői a hosszú élettartam, kiemelkedő korrózió- és kopásállóság, valamint az egyszerű felhasználhatóság és gyors szerelhetőség. Műszaki adatok: átmérő 125 mm, hosszúság 5 méter. A PVC kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', NULL, 1, 7),
('082003', 'GOLYÓSCSAP BB D 020', 3800, -1, 'Kiváló minőségű PVC-U golyóscsap hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. Működése egy gömb alakú elemmel történik, melynek átjáróját forgatva a szelep nyitható vagy zárható a folyadékáramlás szabályozására. Gyors, hatékony folyadékáramlás-szabályozást és pontos beállítást tesz lehetővé. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 2, 60),
('082004', 'GOLYÓSCSAP BB D 025', 4620, -1, 'Kiváló minőségű PVC-U golyóscsap hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. Működése egy gömb alakú elemmel történik, melynek átjáróját forgatva a szelep nyitható vagy zárható a folyadékáramlás szabályozására. Gyors, hatékony folyadékáramlás-szabályozást és pontos beállítást tesz lehetővé. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 2, 67),
('082005', 'GOLYÓSCSAP BB D 032', 5860, 5678, 'Kiváló minőségű PVC golyóscsap hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. Működése egy gömb alakú elemmel történik, melynek átjáróját forgatva a szelep nyitható vagy zárható a folyadékáramlás szabályozására. Gyors, hatékony folyadékáramlás-szabályozást és pontos beállítást tesz lehetővé. A PVC kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 2, 52),
('082103', 'GOLYÓSCSAP BIDIRECTIONAL BB D 020', 5930, -1, 'Kiváló minőségű, kétirányú PVC-U golyóscsap manuális és mechanikus rögzítéshez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. Bármely irányba beszerelhető, egyenletes működtetési nyomatékot biztosít, és ideális ipari alkalmazásokhoz a helytelen telepítésből adódó hibák elkerülése végett. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 2, 59),
('082307', 'GOLYÓSCSAP PTFE BB D 050', 7930, -1, 'Kiváló minőségű PVC-U golyóscsap hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. Működése egy gömb alakú elemmel történik, melynek átjáróját forgatva a szelep nyitható vagy zárható a folyadékáramlás szabályozására. Gyors, hatékony folyadékáramlás-szabályozást és pontos beállítást tesz lehetővé. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 2, 41),
('083020', 'SZONDATARTÓ D50 / D63', 15300, -1, 'Az Aquaram szondatartó egyedülálló, moduláris és könnyen telepíthető megoldás, amely több csatlakozási lehetőséget kínál. Anyaga PVC-U, ragasztós csatlakozással rendelkezik, belső átmérője 50 mm, külső átmérője 63 mm. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 13, 3, 25),
('083107', 'VÍZZÁRÓ GALLÉR D 050', 478, -1, 'Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 2),
('083108', 'VÍZZÁRÓ GALLÉR D 063', 590, -1, 'Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 36),
('083109', 'VÍZZÁRÓ GALLÉR D 075', 890, -1, 'Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 75),
('083110', 'VÍZZÁRÓ GALLÉR D 090', 1159, -1, 'Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 63),
('083207', 'ÁTLÁTSZÓ CSŐSZAKASZ D 050', 24075, -1, 'Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 91),
('083208', 'ÁTLÁTSZÓ CSŐSZAKASZ D 063', 29180, -1, 'Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 63),
('083209', 'ÁTLÁTSZÓ CSŐSZAKASZ D 075', 31200, -1, 'Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 45),
('083210', 'ÁTLÁTSZÓ CSŐSZAKASZ D 090', 41800, -1, 'Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 3, 33),
('083450', 'TÖMLŐ CSATLAKOZÓ D50 X 38, RAGASZTHATÓ', 700, -1, 'Kiváló minőségű, menetes tömlő csatlakozó PVC-U nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 2, 28),
('083550', 'TÖMLŐ CSATLAKOZÓ D38 X 1', 780, -1, 'Kiváló minőségű, menetes tömlő csatlakozó PVC nyomócsövekhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 12, 2, 43),
('083609', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 075', 15590, -1, 'Kiváló minőségű karima szett csappantyúhoz, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 14, 2, 30),
('083610', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 090', 23510, -1, 'Kiváló minőségű karima szett csappantyúhoz, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 14, 2, 19),
('083611', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 110', 30100, -1, 'Kiváló minőségű karima szett csappantyúhoz, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal, egyszerű felhasználhatósággal és gyors szerelhetőséggel. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő tartománya és gazdag idom kínálata miatt kedvelt technológiai (savas/lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokhoz.', 14, 2, 4),
('083612', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 125', 37300, -1, 'Kiváló minőségű karima szett csappantyúhoz, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal. Felhasználása egyszerű, összeszerelése gyors. A PVC-U kiváló vegyszerállóságot, mérsékelt hőállóságot, széles átmérő-tartományt és gazdag idomkínálatot biztosít, ezért technológiai és vízgépészeti csőhálózatokban (pl. uszodatechnika) is elterjedt.', 14, 2, 64),
('083613', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 140', 64900, -1, 'Kiváló minőségű karima szett csappantyúhoz, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal. Felhasználása egyszerű, összeszerelése gyors. A PVC-U vegyszerállósága, mérsékelt hőállósága, széles átmérő-tartománya és gazdag idomkínálata miatt népszerű megoldás technológiai (savas vagy lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokban.', 14, 2, 8),
('085904', 'TARTÁLY CSATLAKOZÓ D 25-1', 1720, -1, 'Kiváló minőségű, ragasztható tartálycsatlakozó PVC-U nyomócsöves rendszerhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal. Felhasználása egyszerű, összeszerelése gyors. A PVC-U vegyszerállósága, mérsékelt hőállósága, széles átmérő-tartománya és gazdag idomkínálata miatt technológiai (savas vagy lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokban elterjedt megoldás.', 12, 3, 49),
('085905', 'TARTÁLY CSATLAKOZÓ D 32-1 1/4', 1890, -1, 'Kiváló minőségű, ragasztható tartálycsatlakozó PVC-U nyomócsöves rendszerhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal. Felhasználása egyszerű, összeszerelése gyors. A PVC-U vegyszerállósága, mérsékelt hőállósága, széles átmérő-tartománya és gazdag idomkínálata miatt népszerű választás technológiai (savas vagy lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokban.', 12, 3, 19),
('085907', 'TARTÁLY CSATLAKOZÓ D 50-2', 3200, -1, 'Kiváló minőségű, ragasztható tartálycsatlakozó PVC-U nyomócsöves rendszerhez, hosszú élettartammal, kiemelkedő korrózió- és kopásállósággal. Felhasználása egyszerű, összeszerelése gyors. A PVC-U kiváló vegyszerállósága, mérsékelt hőállósága, széles átmérő-tartománya és gazdag idomkínálata miatt elterjedt megoldás technológiai (savas vagy lúgos közegek) és vízgépészeti (uszodatechnika) csőhálózatokban.', 12, 3, 46),
('087405', 'TRANSZPARENS SZONDATARTÓ D 050', 17700, -1, 'Transzparens szondatartó: Egyedülálló megoldás, amely moduláris felépítéssel és könnyű telepítéssel rendelkezik. A menetes csatlakozások lehetővé teszik bármilyen érzékelőtartó és annak látóüvege illesztését. Az érzékelők tökéletes illeszkedését és csatlakozását az SNS rendszer biztosítja. Több csatlakozási lehetőséget kínál, valamint könnyen szétszerelhető.', 12, 3, 74),
('089201', 'GRIFFON WDF-05 BLUE 125ML; ECSETTEL', 2700, -1, 'Tixotróp, extra gyors kék ragasztó kemény PVC-hez, flexibilis csövekhez, tömítésekhez és fittingekhez, nyomás- és lefolyó rendszerekhez. Különösen alkalmas medencékhez, jakuzzikhoz és nedves környezetekhez, 160 mm átmérőig. Alkalmazható EN1329, 1452, 1453, 1455 és ISO15493 szabványú csőrendszerekkel.', 15, 3, 30),
('089202', 'GRIFFON WDF-05 BLUE 250ML; ECSETTEL', 3590, -1, 'Tixotróp, extra gyors kék ragasztó kemény PVC-hez, nyomás- és elvezető rendszerekhez. Alkalmas flexibilis csövek, kemény PVC, tömítések és fittingek ragasztására, nyomott és laza illeszkedés esetén is, réskitöltéshez. Különösen ajánlott medencékhez, jakuzzikhoz és nedves környezetekhez, 160 mm átmérőig. A következő csőrendszerekhez használható: EN1329, 1452, 1453, 1455, ISO15493 (PVC).', 15, 3, 30),
('089301', 'GRIFFON TISZTÍTÓ U-PVC & ABS 125ML', 2590, -1, 'Alkalmazási terület: Rideg PVC, PVC-C és ABS anyagú csövek, perselyek és fittingek tisztítására és zsírtalanítására. Eltávolítja a nemkívánatos ragasztószer maradványokat, valamint ecsetek és egyéb szerszámok tisztítására is használható.', 15, 3, 58),
('089305', 'GRIFFON TISZTÍTÓ U-PVC & ABS 500ML', 5190, -1, 'Alkalmas rideg PVC, PVC-C és ABS anyagú csövek, perselyek és fittingek tisztítására és zsírtalanítására. Eltávolítja a nemkívánatos ragasztószer maradványokat, valamint ecsetek és egyéb szerszámok tisztítására is használható.', 15, 3, 3),
('089350', 'GRIFFON TISZTÍTÓ U-PVC & ABS 5000ML', 35090, -1, 'Alkalmazási terület: Rideg PVC, PVC-C és ABS csövek, perselyek és fittingek tisztítására és zsírtalanítására. Eltávolítja a nemkívánatos ragasztószer maradványokat, valamint ecsetek és egyéb szerszámok tisztítására is használható.', 15, 3, 44),
('089501', 'GRIFFON TEFLON ZSINÓR 175M', 8520, -1, 'Folyékony gumi, víz- és légálló, univerzális bevonattal, amely számos anyag (pl. beton, fém, kő, fa, PVC, EPDM) tömítésére és védelmére használható. Kiválóan alkalmazható kültéren és beltéren (fürdőszoba, terasz, tető, esőcsatorna, vízvezetékek, padló illesztések), vízhatlan rétegként csempe alatt. Jellemzői: magas rugalmasság (900%), kiváló tapadás, tartós (min. 20 év), védelem a korrózióval, UV sugárzással és vegyszerekkel szemben, festhető.', 15, 3, 4),
('089505', 'GRIFFON EPOXY JAVÍTÓ KIT 114GR', 6200, -1, 'Kétkomponensű epoxy gitt, amely végleges javítást és helyreállítást biztosít szivárgások, lyukak és repedések tömítésére. Alkalmas csövek, radiátorok, bojlerek, csatornák, légcsatornák, esővízcsatornák és tárolótartályok javítására. Használható fém, réz, alumínium, vas, cink, PVC, fa, szintetikus anyagok, kerámia, csempe, agyag és beton felületeken.', 15, 3, 91),
('089507', 'GEOTEXTÍLIA TEKERCS 15 CM X 20 M', 8930, -1, 'Kiváló minőségű öntapadó, szilikon bázisú javító szalag. Főként azonnali víz- és légálló tömítésre és szivárgás javítására használandó. Felvitelét HBS folyékony gumival együtt kell megtenni. Kiszerelés: 15 cm x 20 m.', 15, 3, 42),
('089509', 'GRIFFON B-21 ABS RAGASZTÓ', 9760, -1, 'Alkalmazási terület: csövek, fittingek átfedéses kötések nyomás alatt lévő és vízelvezető rendszerekhez. Alkalmazási feltételek: cső átmérő ≤ 160 mm. Nyomás ≤ 10 bar (PN10). Maximális átmérő különbség 0,3 mm, 0,2 mm átfedéses kötésnél. Alkalmas EN1455 és ISO15493 (ABS) szabványoknak megfelelő rendszerek kialakításához. Tartozék: felhordó ecset a gyors és egyszerű felhordáshoz.', 15, 3, 35),
('089601', 'GRIFFON UNI-100XT TUBUSOS 125ML', 3150, -1, 'THF mentes ragasztó kemény PVC-hez, nyomás- és elvezető rendszerhez. Csőcsatlakozások, szerelvények, fittingek ragasztásához, nyomott és laza illeszkedés esetén is – réskitöltéshez. Alkalmazási terület: csőcsatlakozások, szerelvények, fittingek. 315 mm átmérőig nyomás alatti és lefolyó csövekhez alkalmazandó. Alkalmazás a következő csőrendszerekkel ajánlott: EN1329, EN1452, EN1453, EN1455, ISO15493 (PVC).', 15, 3, 48),
('089650', 'GRIFFON UNI-100XT 5000ML', 51010, -1, 'THF mentes ragasztó kemény PVC-hez, nyomás- és elvezető rendszerhez. Csőcsatlakozások, szerelvények, fittingek ragasztásához, nyomott és laza illeszkedés esetén is – réskitöltéshez. Alkalmazási terület: csőcsatlakozások, szerelvények, fittingek. 315 mm átmérőig nyomás alatti és lefolyó csövekhez alkalmazandó. Alkalmazás a következő csőrendszerekkel ajánlott: EN1329, EN1452, EN1453, EN1455, ISO15493 (PVC).', 15, 3, 37),
('109165', 'INOX MERÜLŐ MEDENCE 1500 MM X 1100 MM', 4552160, -1, 'Rozsdamentes acél merülőmedence AISI 316 anyagból, csúszásmentes medence aljzattal. Alapfelszereltség része: szkimmer, DN50 csatlakozó. Padlóbefúvó és ürítő rozsdamentes acélból. Rögzített, rozsdamentes acél 3 fokos létra. Fehér fényű LED MR16, 4 × 1W, 12V. Méretek: oldalfal vastagság: 2,5 mm. Aljzat vastagság: 1,5 mm. D 1390 × H 1080 mm.', 16, 4, 41),
('110002', 'LÉTRA, KIS ÍVŰ 2 FOKOS AISI304', 79600, -1, 'A kis ívű medence létra lehetővé teszi a könnyed és kényelmes be- és kilépést a medencéből. A medence létra ergonomikus tervezéssel rendelkezik, hogy a lehető legkényelmesebb legyen a használata, legyen szó gyermekről vagy felnőttről. A létra fokai megfelelő távolsággal helyezkednek el, így biztosítva a stabil és biztonságos közlekedést. Az egyes fokokon csúszásmentes felületek találhatók, amelyek extra tapadást biztosítanak, így minimalizálva a lehetséges baleseti kockázatokat. Könnyen fel- és leszerelhető, könnyedén tárolható vagy szállítható. Könnyen tisztántartható, karbantartható rozsdamentes acélból (AISI304) készült létra hosszú élettartammal rendelkezik, és ellenáll a különböző időjárási viszonyoknak és vízi környezetnek. Az esztétikus kialakítás és a letisztult design segít abban, hogy harmonizáljon a medence környezetével, így emelve a medence összhangját és megjelenését. AISI 304. Az AISI 304-es acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon. Kiváló korrózióállósággal rendelkezik, és ellenáll a legtöbb környezeti hatásnak, beleértve az oxidációt, savakat, lúgokat és nedvességet is.', NULL, 7, 91),
('111012', 'LÉTRA, NAGY ÍVŰ 2 FOKOS AISI316', 103900, -1, 'Nagy ívű medence létra. A nagy ívű medence létra lehetővé teszi a könnyed és kényelmes be- és kilépést a medencéből. A medence létra ergonomikus tervezéssel rendelkezik, hogy a lehető legkényelmesebb legyen a használata, legyen szó gyermekről vagy felnőttről. A létra fokai megfelelő távolsággal helyezkednek el, így biztosítva a stabil és biztonságos közlekedést. Az egyes fokokon csúszásmentes felületek találhatók, amelyek extra tapadást biztosítanak, így minimalizálva a lehetséges baleseti kockázatokat. Könnyen fel- és leszerelhető, könnyedén tárolható vagy szállítható. Könnyen tisztántartható, karbantartható rozsdamentes acélból (AISI316) készült létra hosszú élettartammal rendelkezik, és ellenáll a különböző időjárási viszonyoknak és vízi környezetnek. Az esztétikus kialakítás és a letisztult design segít abban, hogy harmonizáljon a medence környezetével, így emelve a medence összhangját és megjelenését. AISI 316. Az AISI 316-os acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon, amelyek kiváló ellenállást nyújtanak a korróziónak és oxidációnak, valamint magas hőmérsékleti és mechanikai terheléseknek is ellenállnak.', NULL, 7, 33),
('112020', 'HIDRAULIKUS LIFT', 4701000, -1, 'Hidraulikus lift: mozgáskorlátozottak biztonságos medencebe- és kiszállását segítő hidraulikus mechanizmusú lift, mely elengedhetetlen az akadálymentességhez és kulcsfontosságú az inkluzivitás előmozdításában, lehetővé téve mindenkinek az úszást fizikai korlátok nélkül. Használata egyszerű, kialakítása sima és szabályozott emelést/süllyesztést biztosít. Felhasználó- és üzemeltetőbarát vezérlőkkel rendelkezik, tartós, korrózióálló anyagokból készült, így alkalmas vizes környezetben, és a legtöbb közületi medencéhez felszerelhető. Jellemzői: egyszerű rögzítés, rozsdamentes acél (AISI-316L) csőszerkezet, három ponton rögzítés (kettő kívül, egy belül), két helyről vezérelhetőség (medencepartról és medencéből), max. 120kg terhelhetőség, 150° forgási szög, >3bar víznyomás, kültéri használatra alkalmas szintetikus ülés.', NULL, 7, 92),
('113013', 'LÉTRA, EXTRA NAGY ÍVŰ ÍVŰ 3 FOKOS', 251090, -1, 'Extra nagy ívű medence létra: könnyed és kényelmes be- és kilépést biztosít a medencéből, ideális a biztonságos hozzáféréshez, növelve a medencehasználat élvezetét. Ergonomikus tervezésének köszönhetően gyermekek és felnőttek számára is kényelmes. A megfelelő távolságban lévő, csúszásmentes felületű fokok stabil és biztonságos közlekedést garantálnak, minimalizálva a baleseti kockázatot. Könnyen fel- és leszerelhető, tárolható és szállítható, valamint egyszerűen tisztán tartható. A rozsdamentes acélból (AISI304) készült létra tartós, ellenáll az időjárásnak és a vizes környezetnek. Stílusos kiegészítője a medencének, esztétikus kialakítása harmonizál a környezettel. Az AISI 316-os acél egy elterjedt rozsdamentes acél ötvözet, mely kiválóan ellenáll a korróziónak, oxidációnak, magas hőmérsékletnek és mechanikai terheléseknek.', NULL, 7, 61),
('114012', 'LÉTRA, OSZTOTT 2 FOKOS AISI316', 185400, -1, 'Osztott létra: kiváló minőségű, AISI316 anyagból készült, polírozott rozsdamentes létrák 43 mm átmérőjű csövekből és műanyag rögzítő elemekkel, elsősorban monolit, vízzáró beton medencékhez tervezve. A létra a medencetest belső falába csavarokkal rögzíthető. Fóliás vagy kerámia medencéknél a csavarozás érintkezhet a vízzáró felülettel, növelve a vízvesztés kockázatát, ezért ezen típusoknál körültekintő eljárás javasolt. Az AISI 316-os acél elterjedt rozsdamentes ötvözet, kiváló korrózió-, oxidáció-, magas hőmérséklet- és mechanikai terhelésállósággal.', NULL, 7, 30),
('115004', 'MŰANYAG LÉTRA RÖGZÍTŐ', 4900, -1, 'Műanyag létra rögzítő: kiváló minőségű kiegészítők a készletben található rozsdamentes létrákhoz és lépcsőkhöz.', 16, 7, 63),
('115008', 'CSUKLÓS LÉTRA DÖNTŐ TALP AISI304L', 42250, -1, 'Csuklós létra döntő talp AISI304L: kiváló minőségű kiegészítők a készletben található rozsdamentes létrákhoz és lépcsőkhöz.', 16, 7, 27),
('115010', 'LÉTRA TAKARÓ RÓZSA AISI316', 2900, -1, 'Létra takaró rózsa AISI316: kiváló minőségű kiegészítő a készletben található rozsdamentes létrákhoz és lépcsőkhöz. Az AISI 316-os acél elterjedt rozsdamentes ötvözet, kiváló korrózió-, oxidáció-, magas hőmérséklet- és mechanikai terhelésállósággal.', 16, 7, 43),
('115011', 'TÖMÍTÉS KÉSZLET MEDENCE FÓLIÁZÁSHOZ', 22510, -1, 'Tömítés készlet medence fóliázáshoz: kiváló minőségű kiegészítők a készletben található rozsdamentes létrákhoz és lépcsőkhöz.', 12, 3, 33),
('118000', 'KÉTÁGÚ INOX LÉTRA 3 + 3 FOKOS, MAX 1,0M', 163690, -1, 'Kétágú rozsdamentes létra: kiváló minőségű, polírozott AISI316 rozsdamentes létra műanyag rögzítő elemekkel, elsősorban monolit, vízzáró beton medencékhez tervezve. A létra a medencetest belső falába csavarokkal rögzíthető. Fóliás vagy kerámia medencéknél a csavarozás érintkezhet a vízzáró felülettel, növelve a vízvesztés kockázatát, ezért ezen típusoknál körültekintő eljárás javasolt. Az AISI 316-os acél elterjedt rozsdamentes ötvözet, kiváló korrózió-, oxidáció-, magas hőmérséklet- és mechanikai terhelésállósággal.', 16, 7, 37),
('140001', 'HÁLÓ, FÖLÖZŐ, BASIC', 1460, -1, 'Basic fölöző háló: kiváló minőségű, esztétikus háló a kézi medencetisztításhoz, a vízbe hulló szennyeződések ellen. Levelek, felszíni kerti szennyeződések és könnyebb játékok egyszerű összegyűjtésére tervezett, alumínium kerettel, megerősített polikarbonát fogantyúval és tartós hálóval. Könnyen rögzíthető, bármilyen szabványos teleszkópos rúdhoz illeszkedik.', 4, 21, 86),
('140003', 'HÁLÓ, FÖLÖZŐ NAVY BLUE', 5500, -1, 'Navy Blue fölöző háló: kiváló minőségű, esztétikus háló a kézi medencetisztításhoz, a vízbe hulló szennyeződések ellen. Levelek, felszíni kerti szennyeződések és könnyebb játékok egyszerű összegyűjtésére tervezett, alumínium kerettel, megerősített polikarbonát fogantyúval és tartós hálóval. Könnyen rögzíthető, bármilyen szabványos teleszkópos rúdhoz illeszkedik.', 4, 21, 20),
('140027', 'KEFE, HAJLÍTOTT 450MM BASIC', 2860, -1, 'Basic hajlított kefe: kiváló minőségű standard ívelt polipropilén (PP) sörtés fali kefe medencék és pezsgőfürdők általános tisztításához. Puha, mégis merev sörtéi nem karcolják a felületeket, de hatékonyan távolítják el a szennyeződéseket, algákat és foltokat. Minden szabványos teleszkópos rúdhoz illeszkedik, 45 cm széles tisztítási felülettel. Anyaga: polipropilén (PP), fej hossza: 450 mm.', 4, 21, 39),
('140037', 'PORSZÍVÓTÖMLŐ CSATLAKOZÓ 38-32MM X 6/4', 990, -1, 'Porszívótömlő csatlakozó: kiváló minőségű, esztétikus fehér porszívótömlő csatlakozó, fix méret: D38 - 32mm x 6/4.', 12, 3, 34),
('140039', 'PORSZÍVÓTÖMLŐ TOLDÓ UNIVERZÁLIS 38/32MM', 1040, -1, 'Porszívótömlő csatlakozó: kiváló minőségű, esztétikus fehér, univerzális (D38 / 32mm) porszívótömlő doló kézi medenceporszívókhoz a hatékony medencetisztításért.', 12, 3, 55),
('140040', 'PORSZÍVÓTÖMLŐ CSATLAKOZÓ 32/38MM X D50', 965, -1, 'Porszívótömlő csatlakozó: kiváló minőségű, esztétikus fehér porszívótömlő csatlakozó, fix méretben - 32/38mm x D50, kézi medenceporszívó tartozék a hatékony medencetisztításért.', 12, 3, 73),
('150001', 'AQUACORRECT ALGECID KONCENTRÁTUM - 1 L', 2500, -1, 'Aquacorrect Algecid - Folyékony algaölőszer: habzásmentes, magas koncentrációjú folyékony algaölő koncentrátum (1L) kvaterner ammónium hatóanyaggal, kizárólag magán úszómedencékhez. Hosszú távú hatású, megakadályozza az algásodást, segít a zavarosság eltávolításában és tisztítja a medencevizet. Felhasználás: algásodás megelőzésére. Adagolás: pH beállítás után (7,0-7,4), kezdetben 50-100 ml/10 m³, hetente beltéren 20 ml/10 m³, kültéren 40 ml/10 m³ a beömlő fúvókák közelében. Erős algásodásnál sokkoló-klórozás után akár 600 ml/10 m³ is adható. Megelőzésre a medence fala hígítatlanul kezelhető feltöltés előtt. Fontos: kizárólag a leírás szerinti célra használható, hatása azonnali. Az adagolási utasítások tapasztalati értékeken alapulnak. Hűvös, száraz, fénytől védett, jól szellőző helyen tárolandó.', 17, 19, 100),
('150011', 'AQUACORRECT KLÓRGRANULÁTUM 56% - 1 KG', 4785, -1, 'Gyorsan oldódó Aquacorrect klórgranulátum: gyorsan oldódó 56%-os klórgranulátum (1 kg) úszómedence fertőtlenítésére, csírátlanítására. Fertőtlenítő és algásodás megelőző vízkezelő termék, hatékony gombák, vírusok és szerves zavaros anyagok ellen. Privát medencékhez ajánlott, pH semleges és maradékmentesen oldódik. Felhasználás: normál- és sokkoló klórozáshoz, minden vízkeménységhez alkalmas. A klóros fertőtlenítés elengedhetetlen a mikroorganizmusok szaporodásának gátlására, a víz zavarosságának csökkentésére és a fürdővíz tisztán tartására. Adagolás: pH beállítás után (7,0-7,4), optimális klórszint hosszú távú klórozásnál 0,3-0,6 mg/l, sokk-klórozásnál max. 3 mg/l. Kezdetben 100g/10m³, hetente 50g/10m³ oldatot adjon a medencevízhez (vízben feloldva, ideális esetben a szkimmeren keresztül). Gyakori használat, zivatar vagy magas hőmérséklet után, zavaros víz esetén 200g/10m³ adható. Csúszós törmelék vagy algásodás esetén algaölő is alkalmazandó az ajánlás szerint. Fontos: kizárólag a leírás szerinti célra használható, hatása azonnali. Az adagolási utasítások tapasztalati értékeken alapulnak. Hűvös, száraz, fénytől védett, jól szellőző helyen tárolandó.', 17, 19, 80),
('150031', 'AQUACORRECT KLÓRTABLETTA 200 GR 90% - 1 KG', 4200, -1, 'Lassan oldódó Aquacorrect klórtabletta: lassan oldódó maxi klórtabletta (kg-os kiszerelés, 200 gr/tabletta) úszómedence fertőtlenítésére, csírátlanítására. Hatékony gombásodás és baktériumképződés ellen, lebontja az organikus anyagokat a víz zavarosodásának megelőzésére. Privát medencékhez ajánlott, minden vízkeménységhez alkalmazható. Felhasználás: általános és hosszú távú klórozáshoz, úszó vegyszeradagolóba vagy szkimmerbe helyezendő. A klóros fertőtlenítés elengedhetetlen a mikroorganizmusok szaporodásának gátlására, a víz zavarosságának csökkentésére és a fürdővíz tisztán tartására. Adagolás: pH beállítás után (7,0-7,4), optimális klórszint hosszú távú klórozásnál 0,3-0,6 mg/l, sokk-klórozásnál max. 3 mg/l. Kezdetben 100g klórgranulátum/10m³, majd hetente 1 tabletta/25-35m³ a medencevízhez. Fontos: kizárólag a leírás szerinti célra használható, hatása azonnali. Az adagolási utasítások tapasztalati értékeken alapulnak. Hűvös, száraz, fénytől védett, jól szellőző helyen tárolandó.', 17, 19, 100),
('150061', 'AQUACORRECT QUATTROTABS 200 GR - 1 KG', 3850, -1, 'Aquacorrect Quattrotabs: kombinált vízkezelő tabletta (1 kg) magánmedencékhez. Négy funkcióval a tiszta vízért: fertőtlenít, stabilizálja a pH-t, pelyhesít és algamentesít. Lassan oldódó multifunkciós tabletta hosszú távú adagoláshoz, klórt és pelyhesítőt szabadít fel. Kizárólag úszó vegyszeradagolóhoz és szkimmerhez ajánlott. Adagolás: 1 tabletta 200g. pH beállítás után (7,0-7,4), optimális klórszint 0,3-0,6 mg/l (hosszú távú) és max. 3 mg/l (sokk). Kezdetben 100g klórgranulátum/10m³, majd hetente 1 tabletta/25-35m³. Zavaros víz esetén (gyakori használat, eső, kánikula után) 200g klórgranulátum/10m³. Algásodás esetén algaölő is alkalmazandó. Fontos: kizárólag a leírás szerinti célra használható, hatása azonnali. Az adagolási utasítások tapasztalati értékeken alapulnak. A tablettát ne tegye közvetlenül a medencébe (fehérítő foltok). Sokk-klórozás vagy 3mg/l feletti klórszint esetén a medence használata tilos. Hűvös, száraz, fénytől védett, jól szellőző helyen tárolandó.', 17, 19, 58),
('150077', 'AQUACORRECT PH MÍNUSZ GRANULÁTUM - 7,5 KG', 8600, -1, 'Aquacorrect pH mínusz granulátum: savas granulátum (7,5 kg) a medencevíz pH-értékének csökkentésére az optimális 7,0-7,4 tartományba, mely elengedhetetlen a fertőtlenítőszerek hatékony működéséhez. Magas pH (7,4 felett) irritációt okozhat, zavarossá teheti a vizet és mészlerakódást eredményezhet, valamint gátolja a pelyhesítők és fertőtlenítők hatását. A pH mérése tesztcsíkokkal vagy tablettákkal történhet. Kizárólag magánmedencékhez ajánlott. Adagolás: 100 g (kb. 75 ml) / 10 m³ vízmennyiség a pH értékének kb. 0,1%-kal történő csökkentéséhez, vízben feloldva a medencébe adagolva. Fontos: kizárólag a leírás szerinti célra használható, hatása azonnali. Az adagolási utasítások tapasztalati értékeken alapulnak. Hűvös, száraz, fénytől védett, jól szellőző helyen tárolandó.', 17, 19, 88),
('150180', 'AQUACORRECT INDULÓ VEGYSZER KÉSZLET', 15900, -1, 'Aquacorrect induló vegyszer készlet: teljeskörű alapfelszereltség medencetulajdonosok számára: 1kg szerves klór granulátum (gyorsan oldódó, 56%-os, fertőtlenítésre és algásodás megelőzésére, minden vízkeménységhez, magánmedencékhez), 1kg klór tabletta 200g (lassan oldódó maxi tabletta, fertőtlenítésre, gombásodás és baktériumok ellen, organikus anyagok lebontására, minden vízkeménységhez, úszó adagolóba/szkimmerbe, magánmedencékhez), 1,5kg pH-mínusz granulátum (savas granulátum a pH csökkentésére 7,0-7,4-re, magánmedencékhez), 1L Aquacorrect Algecid (habzásmentes folyékony algaölő koncentrátum, hosszú távú hatású, algásodás megelőzésére, zavarosság ellen, tisztít, magánmedencékhez), pH és szabad klór teszt, hőmérő °C/°F, vízkezelési útmutató.', 17, 19, 67),
('163303', 'SOPREMAPOOL 3D - SENSITIVE BALI', 713625, -1, 'Sopremapool 3D medencefólia: szöveterősített PVC-fólia (1,8 mm - Sensitive és 1,5 mm - Ceram vastagságban), mind a 4 réteg lakkal impregnálva, rugalmas és sima. Lakkozott bevonata kiemelkedő védelmet nyújt UV-sugárzás, mikroorganizmusok és klór ellen. Exkluzív megjelenés, változatos design és mintázat, különleges színek jellemzik. A kidomborodó motívumok esztétikusak és fokozzák a könnyű, gyors telepíthetőséget, valamint a kiváló védő- és vízszigetelő képességet. A 3D termékcsalád minden fóliája EN 15836 és DIN 51097 szerinti csúszásgátló tulajdonságokkal rendelkezik, a 2010-es EN 15836-2 szabvány szerint gyártva. Kiszerelés: 1,65 x 25 m-es tekercs (4 rétegű fólia). Gyártás és minőség: kiváló minőségű alapanyagok, impregnált hordozó réteg és laminált további rétegek homogén, jól hegeszthető, hőre nem rétegződő fóliát eredményeznek, nagy szakítószilárdsággal és méretstabilitással. Innovatív gyártási eljárás: speciális lakk impregnálás a mind a 4 rétegben a jobb színtartóság, klór-, szennyeződés- és mikroorganizmus-ellenállás érdekében. BIO-Pajzs kezelés: teljes védelem a mikroorganizmusok elszaporodása és molekulaszerkezeti elváltozások ellen. 4 réteg: kiváló minőségű PVC (1. és 2. réteg), poliészter szövet megerősítés, kiváló minőségű PVC (3. és 4. réteg), lakk védőréteg. Rétegek előnyei: lakkimpregnálás mind a 4 rétegben, optimális hegeszthetőség, UV-, mikroorganizmus- (BIO-Pajzs), szúrás- és vegyszerállóság, nagyfokú mechanikai szilárdság.', 18, 13, 71);
INSERT INTO `termekek` (`cikkszam`, `nev`, `egysegar`, `akcios_ar`, `leiras`, `gyarto_id`, `kategoria_id`, `darabszam`) VALUES
('163321', 'SOPREMAPOOL FEELING - AZURE BLUE', 420750, -1, 'Sopremapool Feeling medencefólia: 1,5 mm vastagságú szöveterősített PVC-fólia, mind a négy rétege különleges lakkal impregnálva az UV-sugárzás és mikroorganizmusok elleni standard védelemért. Újfajta dombornyomása természetesebb tapintást biztosít. Az EN 13451-1 európai szabvány és a DIN 51097 (1992) szabvány szerint tesztelt csúszásgátló tulajdonságokkal rendelkezik (EN 15836-2 B melléklete alapján). 4 réteg: kiváló minőségű PVC (1. és 2. réteg), poliészter szövet megerősítése, kiváló minőségű PVC (3. és 4. réteg), lakk védőréteg. Rétegek előnyei: lakkimpregnálás mind a 4 rétegben, optimális hegeszthetőség, UV- és mikroorganizmus-állóság, szúrással szembeni ellenállás, nagyfokú mechanikai szilárdság, ellenálló képesség a medencevíz kezelésére használt vegyszerekkel szemben.', 18, 13, 53),
('184100', 'AZURO KÖR B-W, KÉK 240 X 090M', 118000, -1, 'Azuro - kör alakú medence: kiváló minőségű, korrózióvédett és erős műanyag réteggel ellátott horganyzott acéllemez támasztó falakból készült medence. A 7 rétegű fal hosszú élettartamot garantál. Megerősített szerkezete ellenáll a mechanikai károsodásoknak, UV-sugárzásnak, klórnak és más vegyszereknek. Jellemzők: magasság: 0,9 m, fóliavastagság: 0,225 mm.', 19, 6, 50),
('184101', 'AZURO KÖR B-W, KÉK 240 X 090M SKIMFILTER', 150000, -1, 'Azuro - kör alakú medence: kiváló minőségű, korrózióvédett és erős műanyag réteggel ellátott horganyzott acéllemez támasztó falakból készült medence. A 7 rétegű fal hosszú élettartamot garantál. Megerősített szerkezete ellenáll a mechanikai károsodásoknak, UV-sugárzásnak, klórnak és más vegyszereknek. Jellemzők: magasság: 0,9 m, fóliavastagság: 0,225 mm.', 19, 6, 93),
('184109', 'AZURO OVAL G-W, KÉK 550 X 370 X 120M', 534000, -1, 'Azuro - Ovális alakú medence: kiváló minőségű, korrózióvédett és erős műanyag réteggel ellátott horganyzott acéllemez támasztó falakból készült medence. A 7 rétegű fal garantálja a medence hosszú élettartamát. Megerősített szerkezete ellenáll a mechanikai károsodásoknak, UV-sugárzásnak, klórnak és más vegyszereknek. Jellemzők: magasság: 1,2 m, fóliavastagság: 0,5 mm.', 19, 6, 15),
('184110', 'AZURO KÖR RATTAN, KÉK 360 X 120M', 207680, -1, 'Azuro - kör alakú medence: kiváló minőségű, korrózióvédett és erős műanyag réteggel ellátott horganyzott acéllemez támasztó falakból készült medence. A 7 rétegű fal garantálja a medence hosszú élettartamát. Megerősített szerkezete ellenáll a mechanikai károsodásoknak, UV-sugárzásnak, klórnak és más vegyszereknek. Jellemzők: magasság: 1,2 m, fóliavastagság: 0,5 mm.', 19, 6, 95),
('184114', 'AZURO KÖR STONE, KÉK 360 X 090M', 160000, -1, 'Azuro - kör alakú medence: kiváló minőségű, korrózióvédett és erős műanyag réteggel ellátott horganyzott acéllemez támasztó falakból készült medence. A 7 rétegű fal garantálja a medence hosszú élettartamát. Megerősített szerkezete ellenáll a mechanikai károsodásoknak, UV-sugárzásnak, klórnak és más vegyszereknek. Jellemzők: magasság: 1,2 m, fóliavastagság: 0,5 mm.', 19, 6, 29),
('184121', 'AZURO KÖR WOOD, KÉK 460 X 120M', 245000, -1, 'Azuro - kör alakú medence: kiváló minőségű, korrózióvédett és erős műanyag réteggel ellátott horganyzott acéllemez támasztó falakból készült medence. A 7 rétegű fal garantálja a medence hosszú élettartamát. Megerősített szerkezete ellenáll a mechanikai károsodásoknak, UV-sugárzásnak, klórnak és más vegyszereknek. Jellemzők: magasság: 1,2 m, fóliavastagság: 0,5 mm.', 19, 6, 61),
('184123', 'AZURO OVAL WOOD, KÉK 550 X 370 X 120M', 477000, -1, 'Azuro - ovális alakú medence: kiváló minőségű, korrózióvédett és erős műanyag réteggel ellátott horganyzott acéllemez támasztó falakból készült medence. A 7 rétegű fal garantálja a medence hosszú élettartamát. Megerősített szerkezete ellenáll a mechanikai károsodásoknak, UV-sugárzásnak, klórnak és más vegyszereknek. Jellemzők: magasság: 1,2 m, fóliavastagság: 0,5 mm.', 19, 6, 18),
('186451', 'SAPHIR 450 BASEWALL', 2278554, -1, 'SAPHIR 450 - Üvegszálas kompozit medence: Basewall kialakítású, acél merevítő konzollal rendelkező szögletes medence lépcsősorral és bal sarokban ülőpaddal. 13 cm széles és 4 cm magas medenceperem, PU szigetelőanyaggal hőszigetelt medencealj. Külső méretei: 4500 x 2700 x 1530 mm. Alapszínek: fehér, bézs, világoskék. Rolókamrával is rendelhető. Állítható támasztólábak külön rendelhetők. Kompozit medencék rétegezése: 1-3. réteg: 3D multicolor fröccstechnológiás Gelcoat felület; 4. réteg: Barriercoat után vinilészter gyanta puffer-réteg üvegszállal (ozmózis- és mechanikai ellenállás); 5. réteg: speciális vinilészter gyanta - kerámia maganyag keverék (Ceramicwall, ozmózis ellenállás, nanotechnológia); 6. réteg: üvegszállal erősített poliészter váz; 7. réteg: poliamid szövet ütésálló, extra rugalmas aramidszálas szöveterősítés.', 20, 5, 7),
('188802', 'PLATINUM 800 BASEWALL + PU', 4438700, -1, 'PLATINUM 800 - Üvegszálas kompozit medence: Basewall kialakítású szögletes medence teljes szélességében lépcsősorral. PU zárt cellás habszigeteléssel a külső hatások elleni védelemért, extra merevségért és hőszigetelésért. Acél merevítő konzollal rendelkezik. 13 cm széles és 4 cm magas medenceperem, PU szigetelőanyaggal hőszigetelt medencealj. Külső méretei: 8000 x 3800 x 1530 mm. Alapszínek: fehér, bézs, világoskék. Rolókamrával is rendelhető. Állítható támasztólábak külön rendelhetők. Kompozit medencék rétegezése: 1-3. réteg: 3D multicolor fröccstechnológiás Gelcoat felület; 4. réteg: Barriercoat után vinilészter gyanta puffer-réteg üvegszállal (ozmózis- és mechanikai ellenállás); 5. réteg: speciális vinilészter gyanta - kerámia maganyag keverék (Ceramicwall, ozmózis ellenállás, nanotechnológia); 6. réteg: üvegszállal erősített poliészter váz; 7. réteg: poliamid szövet ütésálló, extra rugalmas aramidszálas szöveterősítés.', 21, 5, 81);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tetelek`
--

CREATE TABLE `tetelek` (
  `id` int(11) NOT NULL,
  `megrendeles_id` int(11) NOT NULL,
  `termek_id` varchar(6) NOT NULL,
  `darabszam` int(11) NOT NULL,
  `egysegar` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `tetelek`
--

INSERT INTO `tetelek` (`id`, `megrendeles_id`, `termek_id`, `darabszam`, `egysegar`) VALUES
(1, 1, '010001', 1, 12640),
(2, 1, '010003', 1, 2100),
(3, 1, '010004', 1, 2700),
(4, 1, '033101', 2, 9400),
(5, 2, '021301', 1, 29000),
(6, 2, '051006', 1, 103000),
(7, 3, '010003', 1, 2100),
(8, 3, '051006', 1, 103000),
(9, 3, '030024', 1, 21500),
(10, 3, '021200', 1, 23200),
(11, 3, '054023', 1, 436000),
(12, 3, '037111', 1, 1450000),
(13, 3, '037101', 1, 705999);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`email`),
  ADD KEY `szallitasi_cim_id` (`szallitasi_cim_id`),
  ADD KEY `szamlazasi_cim_id` (`szamlazasi_cim_id`);

--
-- A tábla indexei `gyarto`
--
ALTER TABLE `gyarto`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kategoria`
--
ALTER TABLE `kategoria`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `kosar`
--
ALTER TABLE `kosar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felhasznalo_id` (`felhasznalo_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A tábla indexei `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `megrendeles`
--
ALTER TABLE `megrendeles`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `szallitasi_cim`
--
ALTER TABLE `szallitasi_cim`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `szamlazasi_cim`
--
ALTER TABLE `szamlazasi_cim`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`cikkszam`),
  ADD KEY `kategoria_id` (`kategoria_id`),
  ADD KEY `fk_gyarto` (`gyarto_id`);

--
-- A tábla indexei `tetelek`
--
ALTER TABLE `tetelek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `megrendeles_id` (`megrendeles_id`),
  ADD KEY `termek_id` (`termek_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `gyarto`
--
ALTER TABLE `gyarto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `kategoria`
--
ALTER TABLE `kategoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `kosar`
--
ALTER TABLE `kosar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `log`
--
ALTER TABLE `log`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `megrendeles`
--
ALTER TABLE `megrendeles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `szallitasi_cim`
--
ALTER TABLE `szallitasi_cim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `szamlazasi_cim`
--
ALTER TABLE `szamlazasi_cim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `tetelek`
--
ALTER TABLE `tetelek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD CONSTRAINT `felhasznalok_ibfk_1` FOREIGN KEY (`szamlazasi_cim_id`) REFERENCES `szamlazasi_cim` (`id`),
  ADD CONSTRAINT `felhasznalok_ibfk_2` FOREIGN KEY (`szallitasi_cim_id`) REFERENCES `szallitasi_cim` (`id`);

--
-- Megkötések a táblához `kosar`
--
ALTER TABLE `kosar`
  ADD CONSTRAINT `kosar_ibfk_1` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`email`) ON DELETE CASCADE,
  ADD CONSTRAINT `kosar_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`cikkszam`) ON DELETE CASCADE;

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `fk_gyarto` FOREIGN KEY (`gyarto_id`) REFERENCES `gyarto` (`id`),
  ADD CONSTRAINT `termekek_ibfk_1` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoria` (`id`);

--
-- Megkötések a táblához `tetelek`
--
ALTER TABLE `tetelek`
  ADD CONSTRAINT `megrendeles_tetelek_ibfk_1` FOREIGN KEY (`megrendeles_id`) REFERENCES `megrendeles` (`id`),
  ADD CONSTRAINT `megrendeles_tetelek_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`cikkszam`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
