-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 08. 11:02
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

CREATE TABLE IF NOT EXISTS `felhasznalok` (
  `email` varchar(254) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(15) NOT NULL,
  `szallitasi_cim_id` int(11) NOT NULL,
  `szamlazasi_cim_id` int(11) NOT NULL,
  `jogosultsag` enum('felhasználó','admin') NOT NULL DEFAULT 'felhasználó',
  PRIMARY KEY (`email`),
  KEY `szallitasi_cim_id` (`szallitasi_cim_id`),
  KEY `szamlazasi_cim_id` (`szamlazasi_cim_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalok`
--

INSERT INTO `felhasznalok` (`email`, `nev`, `jelszo`, `telefonszam`, `szallitasi_cim_id`, `szamlazasi_cim_id`, `jogosultsag`) VALUES
('fenyojordan2005@gmail.com', 'Fenyő Jordán', '$2y$10$TQ3vpwZsT8HKth.vFpGUcOxCDHh84uRx5sejcJxiUDflP9dTnSGxG', '06302776811', 5, 5, 'felhasználó'),
('info.poolpalace@gmail.com', 'Admin', '$2y$10$GAVPPqKoVgFkV5kMgn/8ROKu2LNiYTCen0PSCcPo3jDf79UyiAdF6', '', 1, 1, 'admin'),
('marcifiola66@gmail.com', 'Fiola Marcell Gyula', '$2y$10$CXYg5Bw12VLT0CB1I/ownuxgdVzrilym4tWcDI/f.6.uTHygxTWKi', '+36702070462', 3, 3, 'felhasználó'),
('szautnerkaroly@gmail.com', 'Szautner Károly', '$2y$10$tFcF/x0yN.1ZPDwcg4kXfeEjZqeP6wuZxyzxQ0aOOTZdgUckHUKy2', '+36305198474', 2, 2, 'felhasználó'),
('teszt.ember@gmail.com', 'Teszt Ember', '$2y$10$d4fkOPqwGdAWukU2RIHk/.LKjvSfOH8Uq6JIw1DpcOV1slejTiIJq', '', 4, 4, 'felhasználó');

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

CREATE TABLE IF NOT EXISTS `gyarto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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

CREATE TABLE IF NOT EXISTS `kategoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(55) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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

CREATE TABLE IF NOT EXISTS `kosar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `felhasznalo_id` varchar(254) NOT NULL,
  `termek_id` varchar(6) NOT NULL,
  `darabszam` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `felhasznalo_id` (`felhasznalo_id`),
  KEY `termek_id` (`termek_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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

CREATE TABLE IF NOT EXISTS `log` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `datum` datetime NOT NULL DEFAULT current_timestamp(),
  `tabla_nev` varchar(15) NOT NULL,
  `tabla_id` varchar(254) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
(8, '2025-04-02 23:29:49', 'felhasznalok', 'fenyojordan2005@gmail.com'),
(9, '2025-04-08 10:00:02', 'megrendeles', '4'),
(10, '2025-04-08 10:06:06', 'megrendeles', '5');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `megrendeles`
--

CREATE TABLE IF NOT EXISTS `megrendeles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `statusz` enum('Feldolgozás alatt','Fizetésre vár','Fizetve','Szállítás alatt','Teljesítve') NOT NULL DEFAULT 'Feldolgozás alatt',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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

CREATE TABLE IF NOT EXISTS `szallitasi_cim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iranyitoszam` varchar(7) NOT NULL,
  `telepules` varchar(58) NOT NULL,
  `utca_hazszam` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szallitasi_cim`
--

INSERT INTO `szallitasi_cim` (`id`, `iranyitoszam`, `telepules`, `utca_hazszam`) VALUES
(1, '', '', ''),
(2, '8200', 'Veszprém', 'Muskátli utca 18/C'),
(3, '8200', 'Veszprém', 'Ádám Iván utca 24.'),
(4, '', '', ''),
(5, '8105', 'Pétfürdő', 'Kazinczy utca 27.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szamlazasi_cim`
--

CREATE TABLE IF NOT EXISTS `szamlazasi_cim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iranyitoszam` varchar(7) NOT NULL,
  `telepules` varchar(58) NOT NULL,
  `utca_hazszam` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `szamlazasi_cim`
--

INSERT INTO `szamlazasi_cim` (`id`, `iranyitoszam`, `telepules`, `utca_hazszam`) VALUES
(1, '', '', ''),
(2, '8200', 'Veszprém', 'Muskátli utca 18/C'),
(3, '8200', 'Veszprém', 'Ádám Iván utca 24.'),
(4, '', '', ''),
(5, '8105', 'Pétfürdő', 'Kazinczy utca 27.');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE IF NOT EXISTS `termekek` (
  `cikkszam` varchar(6) NOT NULL,
  `nev` varchar(70) NOT NULL,
  `egysegar` double NOT NULL,
  `akcios_ar` double DEFAULT NULL,
  `leiras` text NOT NULL,
  `gyarto_id` int(11) DEFAULT NULL,
  `kategoria_id` int(11) NOT NULL,
  `darabszam` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`cikkszam`),
  KEY `kategoria_id` (`kategoria_id`),
  KEY `fk_gyarto` (`gyarto_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`cikkszam`, `nev`, `egysegar`, `akcios_ar`, `leiras`, `gyarto_id`, `kategoria_id`, `darabszam`) VALUES
('010001', 'OLYMPIC SZKIMMER', 12640, -1, 'Olympic szkimmerPrémium szkimmer kiváló megoldás fémfalas és PP medencékhez és minden más kompakt beépítést igénylő medencék esetében. A kiváló alapanyagból készült szkimmer kiemelkedő tulajdonsága a magasított nyak, mellyel könnyedén illeszthető a medence körüli járdáhozMűszaki adatok:Csatlakozás: 6/4?Ajánlott teljesítmény: 57 m3/hSzkimmerA szkimmer feladata a víz elszívása mellett a lebegő szennyeződések (pl. falevelek, rovarok, stb.) kiszűrése a medencéből. A szkimmer szűrőkosara gyűjti össze ezeket a szennyeződéseket, emiatt érdemes azt hetente ellenőrizni. Az optimális működés érdekében a medence vízszintjét a szkimmer nyílás közepére állítsuk be.A szkimmer kosarába helyezhetünk lassan oldódó vegyszereket, mint például klór- vagy pelyhesítő tablettáka, így elkerülve az úszó vegyszeradagoló használatát. A legtöbb szkimmer kialakítása lehetővé teszi a medence porszívózását is.ABS műanyagAz ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad.Az akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 1, 10, 91),
('010003', 'OLYMPIC SZKIMMER KOSÁR', 2100, 1999, 'Olympic szkimmerhez kosárOlympic szkimmer alkatrész. ABS műanyagból készült, minőségi szkimmer kosár, a medence kiáramló vízéhez speciálisan tervezett, kíváló minőségű mechanikus szűrő a nagyobb szennyeződések összegyűjtésére.SzkimmerA szkimmer feladata a víz elszívása mellett a lebegő szennyeződések (pl. falevelek, rovarok, stb.) kiszűrése a medencéből. A szkimmer szűrőkosara gyűjti össze ezeket a szennyeződéseket, emiatt érdemes azt hetente ellenőrizni. Az optimális működés érdekében a medence vízszintjét a szkimmer nyílás közepére állítsuk be.A szkimmer kosarába helyezhetünk lassan oldódó vegyszereket, mint például klór- vagy pelyhesítő tablettáka, így elkerülve az úszó vegyszeradagoló használatát. A legtöbb szkimmer kialakítása lehetővé teszi a medence porszívózását is.ABS műanyagAz ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad.Az akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 1, 10, 27),
('010004', 'OLYMPIC SZKIMMER PORSZÍVÓTÁNYÉR', 2700, -1, 'Olympic szkimmerhez porszívótányér\r\nKiváló alapanyagból készült porszívótányér, Olympic szkimmer alkatrész. ABS műanyagból készült, minőségi szkimmer porszívótányér, a medence aljazatának porszívózásakor a szűrőkosár tetejére helyezzük, így hatékonyabb szívóerőt tudunk képezni.\r\n\r\nSzkimmer\r\nA szkimmer feladata a víz elszívása mellett a lebegő szennyeződések (pl. falevelek, rovarok, stb.) kiszűrése a medencéből. A szkimmer szűrőkosara gyűjti össze ezeket a szennyeződéseket, emiatt érdemes azt hetente ellenőrizni. Az optimális működés érdekében a medence vízszintjét a szkimmer nyílás közepére állítsuk be.\r\nA szkimmer kosarába helyezhetünk lassan oldódó vegyszereket, mint például klór- vagy pelyhesítő tablettáka, így elkerülve az úszó vegyszeradagoló használatát. A legtöbb szkimmer kialakítása lehetővé teszi a medence porszívózását is.\r\n\r\nABS műanyag\r\nAz ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad.\r\nAz akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 1, 10, 48),
('010012', 'OLYMPIC SZKIMMER TETŐ', 3570, -1, 'Olympic szkimmerhez tető\r\nOlympic szkimmer alkatrész. ABS műanyagból készült, minőségi szkimmer tető, a szkimmer belső felületének és tartalmának takarására és védelmére.\r\n\r\nSzkimmer\r\nA szkimmer feladata a víz elszívása mellett a lebegő szennyeződések (pl. falevelek, rovarok, stb.) kiszűrése a medencéből. A szkimmer szűrőkosara gyűjti össze ezeket a szennyeződéseket, emiatt érdemes azt hetente ellenőrizni. Az optimális működés érdekében a medence vízszintjét a szkimmer nyílás közepére állítsuk be.\r\nA szkimmer kosarába helyezhetünk lassan oldódó vegyszereket, mint például klór- vagy pelyhesítő tablettáka, így elkerülve az úszó vegyszeradagoló használatát. A legtöbb szkimmer kialakítása lehetővé teszi a medence porszívózását is.\r\n\r\nABS műanyag\r\nAz ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad.\r\nAz akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 1, 10, 54),
('011460', 'DESIGN SZKIMMER BETON A400 FEHÉR', 55600, -1, 'Design Acis színes A400 szkimmerek\r\nEgyszerű és funkcionális design szkimmer elegáns vonalvezetéssel. Csatlakozása 6/4\" BM / 2\"KM / D50. Az előlap elérhető több színben.\r\n\r\nSzkimmer\r\nA szkimmer feladata a víz elszívása mellett a lebegő szennyeződések (pl. falevelek, rovarok, stb.) kiszűrése a medencéből. A szkimmer szűrőkosara gyűjti össze ezeket a szennyeződéseket, emiatt érdemes azt hetente ellenőrizni. Az optimális működés érdekében a medence vízszintjét a szkimmer nyílás közepére állítsuk be.\r\nA szkimmer kosarába helyezhetünk lassan oldódó vegyszereket, mint például klór- vagy pelyhesítő tablettáka, így elkerülve az úszó vegyszeradagoló használatát. A legtöbb szkimmer kialakítása lehetővé teszi a medence porszívózását is.\r\n\r\nABS műanyag\r\nAz ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad.\r\nAz akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 2, 10, 27),
('011495', 'SZKIMMER AJTÓ FEHÉR', 11650, -1, 'Színes Acis szkimmer ajtók\r\nMinőségi ABS műanyagból készült szkimmer ajtó fehér színben, hogy illeszkedjen az Acis szkimmerekhez.\r\n\r\nSzkimmerek\r\nA szkimmer feladata a víz elszívása mellett a lebegő szennyeződések (pl. falevelek, rovarok, stb.) kiszűrése a medencéből. A szkimmer szűrőkosara gyűjti össze ezeket a szennyeződéseket, emiatt érdemes azt hetente ellenőrizni. Az optimális működés érdekében a medence vízszintjét a szkimmer nyílás közepére állítsuk be.\r\nA szkimmer kosarába helyezhetünk lassan oldódó vegyszereket, mint például klór- vagy pelyhesítő tablettáka, így elkerülve az úszó vegyszeradagoló használatát. A legtöbb szkimmer kialakítása lehetővé teszi a medence porszívózását is.\r\n\r\nABS műanyag\r\nAz ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad.\r\nAz akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 2, 10, 73),
('020100', 'REFLEKTOR STD2002 BETONOS 300W', 28750, 27749, 'Reflektor STD2002\r\nSTD 2002 víz alatti világítás medencékhez. Hagyományos, halogén, fehér vagy RGB LED-es 12V PAR 56 izzóval, 2 x 4mm kábellel, 2,5m hosszal. Az előlap rozsdamentes rögzítő mechanizmussal van ellátva.\r\nOpcionálisan rozsdamentes acél előlappal.\r\n\r\nRozsdamentes acél\r\nA rozsdamentes acél (más néven inox acél) egy magasabb krómtartalmú acélötvözet, mely ellenállóbb a rozsdával, foltosodással szemben, de a nevével ellentétben képes a rozsdásodásra, különösen alacsony oxigéntartalmú, magas sótartalmú vagy nem szellőző körülmények között. A króm-oxid passzív réteget képez, ami megelőzi/lassítja a felület további rozsdásodását, és megakadályozza annak az acél belső rétegeibe történő haladását.', 3, 11, 83),
('021200', 'REFLEKTOR MINI2008 BETON 50W', 23200, -1, 'Reflektor MINI2008 \"Mini 2008\" víz alatti világítás betonos medencéhez, Hőálló (ABS) műanyag test, fej fehér műanyagból, alsó kivezetéssel. Minőségi kialakítása kiváló fényerőt és élettartamot biztosít. 2 méteres kábellel kapható. 50 W / 12 V halogén izzóval. ABS műanyag Az ABS (akrilnitril-butadién-sztirol) egy jó ütésálló képességgel, nagy keménységgel és szilárdsággal, jó hőállósággal és vegyszerállósággal, emellett jó zaj és rezgéscsillapítással rendelkező, hőre lágyuló műanyag. Kiválósága különböző anyagai kombinálásából fakad. Az akrilnitril növeli a hő- és kémiai ellenállást, a butadién fokozza a tartósságot és szívósságot, a sztirol pedig javítja a megmunkálhatóságot, csökkenti a költségeket és fényes felületet biztosít.', 3, 11, 93),
('021301', 'REFLEKTOR MINI-CLICKER FÓLIA WH 7W', 29000, 27999, 'MINI-Clicker reflektor A közepes méretű MINI-Clicker ideális a medencék megvilágítására, villámgyors szerelés, kompakt kialakítás jellemzi. A reflektor tervezésekor a fő szempont flexibilis felhasználhatóság mellett a minél egyszerűbb szerelhetőség volt. További jellemzők: - Könnyű, polikarbonát lámpatest - SMD LED-del - ABS előlappal - 1.2 m hosszú kábellel szerelve.', 3, 11, 22),
('030024', 'VÁLTÓSZELEP 4-UTÚ TOP 1 1/2\" BASIC', 21500, 20999, 'Váltószelep - Basic szűrőhöz 4-utú váltószelep Basic (TOP) szűrőtartályhoz, kiváló minőségű, magas élettartamú szűrőtartály alkatrész. A csatlakozás mérete: - 1 1/2\". Váltószelep Szűrőtartály alkatrész. Feladata a vízáramlás irányának szabályozása, ezzel kiválasztva a funkciót, hogy mit csináljon a szűrő. A szelep állásai lehetnek: - Szűrés - Visszamosás - Öblítés - Zárva Fontos, hogy csak akkor állítsunk fokozatot a váltószelepen, ha a szivattyú ki van kapcsolva!', 4, 16, 29),
('033001', 'SZŰRŐHOMOK 0.5 - 1.0 MM 25KG/ZSÁK', 4380, -1, 'Szűrőhomok Osztályozott, tűziszárított gránithomok. A szárítás után, két méretre osztályozott, pormentesített szűrőhomok 25 kg-os zsákokba csomagolva.', 5, 16, 79),
('033101', 'SZŰRŐÜVEG STAGE-1, 0.6 - 1.2 MM', 9400, 8990, 'Szűrőüveg\r\nA Nature Works a legújabb generációs szűz újrahasznosított üvegen alapuló szűrőanyag, amelyet kizárólag víz szűrésére terveztek.\r\nA Nature Works High Tech Filter Media a rendelkezésre álló források optimalizásának egészséges és higiénikus módja, amely magas szintre emeli a víz minőségét.\r\nUgyanakkor ez egy újrahasznosított és újra hasznosítható környezetbarát termék, amely lecsökkenti a hagyományos víztisztítási módszerekből származó környezeti hatásokat.\r\nFelhasználható minden ipari víz- vagy medencevíz-szűrőnél és hatásai azonnal szemmel láthatóak.\r\nA biofilm felelős a klóraminokért és a szűrőközeg mikrocsatornáinak eltömődéséért.\r\nA Nature Works? aszeptikus (baktériumtól mentes) tulajdonságai és az Anti-Compaction Technology? megakadályozza a biofilm képződését, ezzel a szűrőtöltet élettartamát a végtelenségig megnövelve.\r\n\r\nÖsszehasonlítva a szűrőhomokkal\r\nJobb vízminőség\r\nEgyedi és célirányosan fejlesztett szűrőközeg, hosszú élettartammal\r\nKevesebb elpazarolt energia, víz és vegyszer\r\nKörnyezetkímélő megoldás\r\nOptimalizált áramlás\r\nNincs többé biofilm képződés, nem szükséges pelyhesítő szer\r\nRészecskék\r\nMikroszkopikusan lapos és sima szélű részecskék. A gyártási eljárással kapcsolatos élek nélküli termék létrehozására szolgáló MC2 tömörödésgátló technológiának (Anticompaction Technology) két célja van:\r\n\r\nKiküszöbölni a baktériumoknak otthont adó éles széleket\r\nBiztosítani, hogy a termék biztonságos legyen\r\nMaximális Szűrési teljesítmény\r\nA Nature Works? hatékonysága úszomedencékben előforduló leggyakoribb részecskék eltávolításán alapul, melyek ködössé teszik a vizet.\r\nEzt a jól megválasztott szemcseformáknak és szemcsék felületkezelési technológiájának köszönhetően érjük el, amely lehetővé teszi a Biofilm kialakulásának elkerülését, a mikrocsatornák nyitvatartását, és a szemcsék teljesen biztonságos kezelését.', 5, 16, 6),
('037101', 'BARENT 1M O620 SIDE D75/D50', 705999, -1, 'Barent szűrőtartály Szűrőtartály közületi medencékhez, iparági szabványoknak megfelelő kialakítás, üvegszállal erősített tartály, UV sugárzás elleni védőréteg, kollektor karos kialakítás. Nyomásmérővel és 6-állásos váltószeleppel szerelve. Tulajdonságok: - Glicerines nyomásmérővel - Minden tartály nyomástesztelt - 5 év garanciával - 620/750/900 mm-es átmérővel - Szűrőágy magassága 1 méter - A szűrőtartály OTH engedéllyel rendelkezik Műszaki adatok: - Üzemi nyomás: 0,6 -1,6 kg/cm2 - Maximum nyomás: 2 kg/cm2 - Teszt nyomás: 3 kg/cm2 - Üzemi hőmérséklet: 1°C - 40°C Szűrőtartály A medence vizének tisztaságát folyamatos vízforgatással és szűréssel tudjuk fenn tartani. Az álló vízben, melyet süt a nap, könnyedén elszaporodhatnak az algák és más szennyeződések, melyek nem csak a látványt rontják, de a fürdőzők egészségére is veszélyesek lehetnek. A szűrőtartály a vízforgató készülék segítségével az egészen finom szennyeződéseket is kiszűrhetik a vízből, amelyek így fennakadnak a szűrőközegen.', 6, 16, 1),
('037111', 'OCEAN O1050 1M D110/D90', 1450000, -1, 'Ocean szűrőtartály Üvegszál erősített szűrőtartály közületi medencékhez, iparági szabványoknak megfelelő kialakítás, UV sugárzás elleni védőréteg, kollektor karos kialakítás. Opcionális: Oldalsó búvónyílás, Kémlelő ablak Tulajdonságok: - Szűrőágy magassága 1,0 méter - Üvegszállal erősített tartályfedél, átmérője 400mm - Leeresztő nyílás átmérő 75mm - PVC csatlakozó karmantyú - A szűrő külön speciális ózonnak ellenálló bevonattal is rendelhető - 10 év garancia - A szűrőtartály OTH engedéllyel rendelkezik Műszaki adatok: - Üzemi nyomás: 0,6 -2 kg/cm2 - Maximum nyomás: 2,5 kg/cm2 - Teszt nyomás: 3,75 kg/cm2 - Üzemi hőmérséklet: 1°C - 40°C - Felső búvónyílás: ? 400 mm - Szűrőágy magasság: 1000 mm Szűrőtartály A medence vizének tisztaságát folyamatos vízforgatással és szűréssel tudjuk fenn tartani. Az álló vízben, melyet süt a nap, könnyedén elszaporodhatnak az algák és más szennyeződések, melyek nem csak a látványt rontják, de a fürdőzők egészségére is veszélyesek lehetnek. A szűrőtartály a vízforgató készülék segítségével az egészen finom szennyeződéseket is kiszűrhetik a vízből, amelyek így fennakadnak a szűrőközegen.', 7, 16, 85),
('050504', 'BADU Magic II/4', 123250, -1, 'BADU MAGIC II szivattyú\r\nBADU Magic II/4 1~, 0.18KW\r\nLakossági szegmens számára fejlesztett önfelszívó, keringető szivattyú kis és közepes méretű szűrő rendszerekhez.\r\nNagy hatásfokú megbízható német szivattyú márka földfelszín feletti medencékhez.\r\n\r\nMűszaki információk\r\nMax 2m-rel a vízfelszín felé vagy max 3m-rel alá szerelhető\r\nMonoblokkos szivattyú beépített előszűrővel\r\nAjánlott medenceméret: 10 - 60m3\r\nSósvizes rendszerekhez telepíthető, max 5g/l só koncentrációig\r\nMűszaki adatok\r\nMűködési tartomány: 6 m3/h H=6m\r\nTápfeszültség: 230 V', 8, 17, 21),
('051006', 'MINI STREAMER STR 033M', 103000, 99999, 'Mini Streamer szivattyú GEMAS Mini Streamer előszűrős önfelszívó szivattyú, termoplasztik műanyagból. Minden típusú kis méretű medencéhez telepíthető. Minden eleme korrózióálló, erősített termoplasztikból készül a tartósság és hosszú élettartam érdekében. Szívó és nyomó csatlakozása 1 1/2?. Műszaki adatok - Működési tartomány: 6 m3/h H=9m - Teljesítmény: 0,33 HP - Tápfeszültség: 230 V', 3, 17, 46),
('054023', 'IE3 BRAVUS 300 230/400V', 436000, -1, 'IE3 Bravus szivattyú A Bravus szivattyú egy kompakt méretű, kiváló hidraulikus hatásfokú szivattyú élményelemekhez, masszázs rendszerekhez, ellenáramoltatók szereléséhez. A szivattyú ház üvegszál erősítésű polipropilénből készült, ami rendkívül tartóssá teszi azt. Járókerék és diffúzor alapanyaga NORYL. Alkalmazási terület - Élményelemekhez - Masszázs rendszerekhez - Ellenáramoltatók szereléséhez Műszaki adatok - Működési tartomány: 52 m3/h H=10m - Teljesítmény: 3,0 HP - Tápfeszültség: 230/400 V - Tengely: Rozsdamentes acél (AISI 316). - Csúszógyűrű: szilikon-kerámia / inox (AISI 316). - Motor: 2900 rpm. - Védelem: IP55. Sós víznek ellenálló kivitel.', 9, 17, 82),
('056118', 'INVERECO DE18', 269000, -1, 'InverEco DE18\r\nInverteres szivattyú lakossági medencékhez. Az inverteres technológiának köszönhetően a motor fordulatszáma 1 fordulatonként pontosan szabályozható.\r\nAmikor visszamosásra van szükség, a szivattyú 100%-os kapacitással működhet. A napi szűrési, vízforgatási igény esetén, amely alacsonyabb térfogatáramot igényel, a szivattyú kisebb teljesítménnyel működhet, aminek köszönhetően rendkívül csendes és energiatakarékos. Az Aquagem inverteres technológiának köszönhetően a szivattyú élettartama is hosszabb lesz.\r\n\r\nTulajdonságok\r\nEgyszerű érintőkijelzős kezelőfelület\r\nNaponta 4 különböző időzíthető program\r\nSzabályozható teljesítmény: 30% ~ 100%\r\nEnergiafogyasztás megjelenítése\r\nVisszamosás gombnyomásra', 10, 17, 67),
('056225', 'InverMaster IM25', 609850, -1, 'InverMaster IM25\r\nAquagem inverteres szivattyú. Az Aquagem kombinálta az InverSilence technológiát a vízhűtéssel, így megalkotva egy ventilátormentes szivattyút. Ennek eredménye, hogy a működési zaj 30 dBA@1m-ig csökkent, ami 40-szer csendesebb a hagyományos szivattyúkhoz képest.\r\n\r\nTulajdonságok\r\nMaximum 3m-el a vízszint fölé szerelhető\r\nIE5 kefe nélküli DC motor\r\n20x energiamegtakarítás\r\nAuto Inverter/Manual Inverter üzemmód\r\nAktuális térfogatáram megjelenítése\r\nKülső vezérlési lehetőségek: applikáció, digitális jel, RS485\r\nSósvízhez alkalmas, max 5g/l só koncentrációig\r\n40x csöndesebb, mint egy hagyományos szivattyú\r\nAktuális energiafogyasztás megjelenítése\r\nWi-Fi / Bluetooth', 11, 17, 86),
('060005', 'D-KWT D50 RAGASZTHATÓ CSATLAKOZÓ', 5800, -1, 'Hőcserélőhöz ragasztható csatlakozó D-KWT típusú hőcserélő csatlakoztatásához szükséges cilinder, prémium minőségű műanyagból. Jellemzők: - Átmérő: D50 mm.', 12, 3, 26),
('080003', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 020', 2049, -1, 'Nyomócső - D20 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 20 mm - Hosszúsága: 3 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 31),
('080004', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 025', 3270, -1, 'Nyomócső - D25 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 25 mm - Hosszúsága: 3 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 53),
('080005', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 032', 3570, -1, 'Nyomócső - D32 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 32 mm - Hosszúsága: 3 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 73),
('080106', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 040', 3570, -1, 'Nyomócső - D40 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 40 mm - Hosszúsága: 3 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 64),
('080107', 'NYOMÓCSŐ - 3 MÉTER/SZÁL D 050', 5040, -1, 'Nyomócső - D50 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 50 mm - Hosszúsága: 3 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 81),
('080108', 'NYOMÓCSŐ D 063', 7700, -1, 'Nyomócső - D63 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 63 mm - Hosszúsága: 5 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 11),
('080109', 'NYOMÓCSŐ D 075', 6290, -1, 'Nyomócső - D75 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 75 mm - Hosszúsága: 5 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 11),
('080110', 'NYOMÓCSŐ D 090', 5459, 4799, 'Nyomócső - D90 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 90 mm - Hosszúsága: 5 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, -2),
('080111', 'NYOMÓCSŐ D 110', 5865, -1, 'Nyomócső - D110 Kiváló minőségű, ragasztható, könnyű PVC-U nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok: - Átmérője: 110 mm - Hosszúsága: 5 méter PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 99),
('080112', 'NYOMÓCSŐ D 125', 7790, -1, 'Nyomócső - D125 Kiváló minőségű, ragasztható, könnyű PVC nyomócső. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. Műszaki adatok - Átmérője: 125 mm - Hosszúsága: 5 méter A PVC kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', NULL, 1, 7),
('082003', 'GOLYÓSCSAP BB D 020', 3800, -1, 'Golyóscsap Kiváló minőségű PVC-U golyóscsap. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. A golyóscsap működése egyszerű: egy gömb alakú elemet tartalmaz, amelynek van egy átjárója. A gömb forgatásával a szelep nyitva vagy zárva tartható, így szabályozva a folyadékáramlást. Ez a típusú szelep gyors és hatékony módja annak, hogy megnyissa vagy elzárja a folyadékáramlást, és pontos szabályozást tesz lehetővé. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 2, 60),
('082004', 'GOLYÓSCSAP BB D 025', 4620, -1, 'Golyóscsap Kiváló minőségű PVC-U golyóscsap. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. A golyóscsap működése egyszerű: egy gömb alakú elemet tartalmaz, amelynek van egy átjárója. A gömb forgatásával a szelep nyitva vagy zárva tartható, így szabályozva a folyadékáramlást. Ez a típusú szelep gyors és hatékony módja annak, hogy megnyissa vagy elzárja a folyadékáramlást, és pontos szabályozást tesz lehetővé. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 2, 67),
('082005', 'GOLYÓSCSAP BB D 032', 5860, 5678, 'Golyóscsap Kiváló minőségű PVC golyóscsap. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. A golyóscsap működése egyszerű: egy gömb alakú elemet tartalmaz, amelynek van egy átjárója. A gömb forgatásával a szelep nyitva vagy zárva tartható, így szabályozva a folyadékáramlást. Ez a típusú szelep gyors és hatékony módja annak, hogy megnyissa vagy elzárja a folyadékáramlást, és pontos szabályozást tesz lehetővé. A PVC kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 2, 51),
('082103', 'GOLYÓSCSAP BIDIRECTIONAL BB D 020', 5930, -1, 'Kétirányú golyóscsap Kiváló minőségű, kétirányú PVC-U golyóscsap, manuális és mechanikus rögzítéshez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. A kétirányú golyóscsapok lehetővé teszik bármely irányú beszerelést és egyenletes működtetési nyomatékot biztosítanak. Tökéletes golyóscsap az ipari alkalmazásokhoz, mivel elkerüli a helytelen telepítés miatti hibákat. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 2, 59),
('082307', 'GOLYÓSCSAP PTFE BB D 050', 7930, -1, 'Golyóscsap Kiváló minőségű PVC-U golyóscsap. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. A golyóscsap működése egyszerű: egy gömb alakú elemet tartalmaz, amelynek van egy átjárója. A gömb forgatásával a szelep nyitva vagy zárva tartható, így szabályozva a folyadékáramlást. Ez a típusú szelep gyors és hatékony módja annak, hogy megnyissa vagy elzárja a folyadékáramlást, és pontos szabályozást tesz lehetővé. Golyóscsap A golyóscsap működése egyszerű: egy gömb alakú elemet tartalmaz, amelynek van egy átjárója. A gömb forgatásával a szelep nyitva vagy zárva tartható, így szabályozva a folyadékáramlást. Ez a típusú szelep gyors és hatékony módja annak, hogy megnyissa vagy elzárja a folyadékáramlást, és pontos szabályozást tesz lehetővé. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 2, 41),
('083020', 'SZONDATARTÓ D50 / D63', 15300, -1, 'Szondatartó Egyedülálló megoldás, modularitás és könnyű telepítés jellemzi az Aquaram szondatartót. A szondatartó több csatlakozási lehetőséget biztosít. Tulajdonságok - Anyag: PVC-U - Csatlakozás: Ragasztós - Belső átmérő: 50 mm - Külső átmérő: 63 mm PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 13, 3, 25),
('083107', 'VÍZZÁRÓ GALLÉR D 050', 478, -1, 'Vízzáró gallér Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 2),
('083108', 'VÍZZÁRÓ GALLÉR D 063', 590, -1, 'Vízzáró gallér Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 36),
('083109', 'VÍZZÁRÓ GALLÉR D 075', 890, -1, 'Vízzáró gallér Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 75),
('083110', 'VÍZZÁRÓ GALLÉR D 090', 1159, -1, 'Vízzáró gallér Kiváló minőségű vízzáró gallér PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 63),
('083207', 'ÁTLÁTSZÓ CSŐSZAKASZ D 050', 24075, -1, 'Átlátszó csőszakasz Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 91),
('083208', 'ÁTLÁTSZÓ CSŐSZAKASZ D 063', 29180, -1, 'Átlátszó csőszakasz Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 63),
('083209', 'ÁTLÁTSZÓ CSŐSZAKASZ D 075', 31200, -1, 'Átlátszó csőszakasz Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 45),
('083210', 'ÁTLÁTSZÓ CSŐSZAKASZ D 090', 41800, -1, 'Átlátszó csőszakasz Kiváló minőségű átlátszó csőszakasz PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 33),
('083450', 'TÖMLŐ CSATLAKOZÓ D50 X 38, RAGASZTHATÓ', 700, -1, 'Tömlő csatlakozó Kiváló minőségű, menetes tömlő csatlakozó PVC-U nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 2, 28),
('083550', 'TÖMLŐ CSATLAKOZÓ D38 X 1\" 1/2, MENETES', 780, -1, 'Tömlő csatlakozó Kiváló minőségű, menetes tömlő csatlakozó PVC nyomócsövekhez. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. A PVC kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 2, 43),
('083609', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 075', 15590, -1, 'Karima szett csappantyúhoz Kiváló minőségű karima szett csappantyúhoz. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 14, 2, 30),
('083610', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 090', 23510, -1, 'Karima szett csappantyúhoz Kiváló minőségű karima szett csappantyúhoz. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 14, 2, 19),
('083611', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 110', 30100, -1, 'Karima szett csappantyúhoz Kiváló minőségű karima szett csappantyúhoz. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 14, 2, 4),
('083612', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 125', 37300, -1, 'Karima szett csappantyúhoz Kiváló minőségű karima szett csappantyúhoz. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 14, 2, 64),
('083613', 'KARIMA SZETT SYSTEMR CSAPPANTYÚHOZ D 140', 64900, -1, 'Karima szett csappantyúhoz Kiváló minőségű karima szett csappantyúhoz. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 14, 2, 8),
('085904', 'TARTÁLY CSATLAKOZÓ D 25-1\"', 1720, -1, 'Tartály csatlakozó Kiváló minőségű, ragasztható, tartály csatlakozóhoz, PVC-U nyomócsöves rendszer esetén. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 49),
('085905', 'TARTÁLY CSATLAKOZÓ D 32-1 1/4\"', 1890, -1, 'Tartály csatlakozó Kiváló minőségű, ragasztható, tartály csatlakozóhoz, PVC-U nyomócsöves rendszer esetén. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 19),
('085907', 'TARTÁLY CSATLAKOZÓ D 50-2\"', 3200, -1, 'Tartály csatlakozó Kiváló minőségű, ragasztható, tartály csatlakozóhoz, PVC-U nyomócsöves rendszer esetén. Hosszú élettartam, kiemelkedő korrózióállóság és kopásállóság jellemzi. Felhasználhatósága egyszerű, összeszerelése praktikus és gyors. PVC-U A PVC-U kiváló vegyszerállóságának, a mérsékelt hőállóságának, a széles átmérő tartománynak és a gazdag idom kínálatnak köszönhetően technológiai (savas vagy lúgos közegek) és vízgépészeti (uszoda technika) csőhálózatok kedvelt megoldása.', 12, 3, 46),
('087405', 'TRANSZPARENS SZONDATARTÓ D 050', 17700, -1, 'Transzparens szondatartó Egyedülálló megoldás, modularitás és könnyű telepítés. A menetes csatlakozások lehetővé teszik, hogy bármilyen érzékelőtartót, annak látóüvegét illessze Az érzékelők tökéletes illeszkedése és csatlakozása az SNS? segítségével. Több csatlakozási lehetőséget biztosít, valamint könnyen szétszerelhető.', 12, 3, 74),
('089201', 'GRIFFON WDF-05 BLUE 125ML; ECSETTEL', 2700, -1, 'Griffon WDF-05 Tixotróp, extra gyors, kék ragasztó kemény PVC-hez, nyomás- és elvezető rendszerhez. Flexibilis csövek, kemény PVC,tömítések és fittingek ragasztásához, nyomott és laza illeszkedés esetén is - réskitöltéshez. Alkalmazási terület: Flexibilis csövek, kemény PVC,tömítések, fittingek, nyomás alatti és lefolyó csövekhez alkalmazandó. Kimondottan alkalmas medencékhez, jacuzzi-hoz és egyéb nedves könyezetekben. 160 mm átmérőig alkalmazandó. Alkalmazás a következő csőrendszerekkel ajánlott: - EN1329 - 1452 - 1453 - 1455 - ISO15493 (PVC).', 15, 3, 30),
('089202', 'GRIFFON WDF-05 BLUE 250ML; ECSETTEL', 3590, -1, 'Griffon WDF-05 Tixotróp, extra gyors, kék ragasztó kemény PVC-hez, nyomás- és elvezető rendszerhez. Flexibilis csövek, kemény PVC,tömítések és fittingek ragasztásához, nyomott és laza illeszkedés esetén is - réskitöltéshez. Alkalmazási terület: Flexibilis csövek, kemény PVC,tömítések, fittingek, nyomás alatti és lefolyó csövekhez alkalmazandó. Kimondottan alkalmas medencékhez, jacuzzi-hoz és egyéb nedves könyezetekben. 160 mm átmérőig alkalmazandó. Alkalmazás a következő csőrendszerekkel ajánlott: - EN1329 - 1452 - 1453 - 1455 - ISO15493 (PVC).', 15, 3, 30),
('089301', 'GRIFFON TISZTÍTÓ U-PVC & ABS 125ML', 2590, -1, 'Griffon tisztító U-PVC & ABS Alkalmazási terület: Tisztításához és zsírtalanításához, rideg PVC, PVC-C és ABS anyagú csövekhez, perselyekhez és fittingekhez. Nemkívánatos ragasztószer maradványok eltávolítására, vagy ecsetek és egyéb szerszámok tisztítására is alkalmas.', 15, 3, 58),
('089305', 'GRIFFON TISZTÍTÓ U-PVC & ABS 500ML', 5190, -1, 'Griffon tisztító U-PVC & ABS Alkalmazási terület: Tisztításához és zsírtalanításához, rideg PVC, PVC-C és ABS anyagú csövekhez, perselyekhez és fittingekhez. Nemkívánatos ragasztószer maradványok eltávolítására, vagy ecsetek és egyéb szerszámok tisztítására is alkalmas.', 15, 3, 3),
('089350', 'GRIFFON TISZTÍTÓ U-PVC & ABS 5000ML', 35090, -1, 'Griffon tisztító U-PVC & ABS Alkalmazási terület: Tisztításához és zsírtalanításához, rideg PVC, PVC-C és ABS anyagú csövekhez, perselyekhez és fittingekhez. Nemkívánatos ragasztószer maradványok eltávolítására, vagy ecsetek és egyéb szerszámok tisztítására is alkalmas.', 15, 3, 44),
('089501', 'GRIFFON TEFLON ZSINÓR 175M', 8520, -1, 'Griffon teflon zsinór Folyékony gumi, univerzális, tartós, vízálló, légálló és ellenálló bevonattal. Alkalmas számos anyagtípus tömítéséhez és védelméhez, mint beton, fém, kő, fa, bitumen, cink, PVC, EPDM, stb. Padlók, válaszfalak, falak, varrat pl. illesztések, vezetékek és struktuális komponensek. Kiválóan alkalmazható mind kültéren és beltéren (fürdőszoba, padlás, terasz, tető, stb.) beleértve az esőcsatornát, zuhanytálcát, vízvezeték csöveket, padló illesztéseket, dilattációkat, ablakkereteket és talajszinti elemeket. Használható vízhatlan rétegként csempe alatt nyirkos környezetben mint pl. fürdőszoba, medence, terasz, stb. Jellemzők: - víz- és légálló - nagyon magas rugalmasság (900%) - kiválóan tapad számos felületre - tartós minőség: min. 20 év - véd a korrózió és erózió ellen - ellenáll az UV sugárzásnak és az időjárásnak - ellenáll a sónak és vegyszereknek - festhető.', 15, 3, 4),
('089505', 'GRIFFON EPOXY JAVÍTÓ KIT 114GR', 6200, -1, 'Griffon Epoxy javító kit Két-komponensű epoxy gitt végleges javításhoz és helyreállításhoz majdnem minden anyagtípushoz. Használható szivárgások, lyukak és repedések tömítésére csövek, radiátorok, bojlerek, csatorna, légcsatorna, esővízcsatorna és tároló tartály esetében. Használható fém, réz, alumínium, vas, cink, PVC, fa, szintetikus anyagok, kerámia, csempe, agyag és beton felületekhez.', 15, 3, 91),
('089507', 'GEOTEXTÍLIA TEKERCS 15 CM X 20 M', 8930, -1, 'GeoTextília tekercs Kiváló minőségű öntapadó, szilikon bázisú javító szalag. Főként azonnali víz- és légálló tömítésre és szivárgás javítására használandó. Felvitelét HBS folyékony gumival együtt kell megtenni. Kiszerelés: - 15 cm x 20 m', 15, 3, 42),
('089509', 'GRIFFON B-21 ABS RAGASZTÓ', 9760, -1, 'Griffon B-21 ABS ragasztó Alkalmazási terület: csövek, fittingek átfedéses kötések nyomás alatt lévő és vízelvezető rendszerekhez. Alkalmazási feltételek: cső átmérő ? 160 mm. Nyomás ? 10 bar (PN10). Maximális átmérő különbség 0,3 mm, 0,2mm átfedéses kötésnél. Alkalmas EN1455 és ISO15493 (ABS) szabványoknak megfelelő rendszerek kialakításához. Tartozék: - felhordó ecset a gyors és egyszerű felhordáshoz.', 15, 3, 35),
('089601', 'GRIFFON UNI-100XT TUBUSOS 125ML', 3150, -1, 'Griffon UNI-100XT THF mentes ragasztó kemény PVC-hez, nyomás- és elvezető rendszerhez. Csőcsatlakozások, szerelvények, fittingek ragasztásához, nyomott és laza illeszkedés esetén is - réskitöltéshez. Alkalmazási terület: Csőcsatlakozások, szerelvények, fittingek. 315 mm átmérőig nyomás alatti és lefolyó csövekhez alkalmazandó. Alkalmazás a következő csőrendszerekkel ajánlott: - EN1329 - 1452 - 1453 - 1455 - ISO15493 (PVC).', 15, 3, 48),
('089650', 'GRIFFON UNI-100XT 5000ML', 51010, -1, 'Griffon UNI-100XT THF mentes ragasztó kemény PVC-hez, nyomás- és elvezető rendszerhez. Csőcsatlakozások, szerelvények, fittingek ragasztásához, nyomott és laza illeszkedés esetén is - réskitöltéshez. Alkalmazási terület: Csőcsatlakozások, szerelvények, fittingek. 315 mm átmérőig nyomás alatti és lefolyó csövekhez alkalmazandó. Alkalmazás a következő csőrendszerekkel ajánlott: - EN1329 - 1452 - 1453 - 1455 - ISO15493 (PVC).', 15, 3, 37),
('109165', 'INOX MERÜLŐ MEDENCE 1500 MM X 1100 MM', 4552160, -1, 'Rozsdamentes merülő medence Rozsdamentes acél merülőmedence AISI 316 anyagból, csúszásmentes medence aljzattal. Alapfelszereltség része: - Szkimmer, DN50 csatlakozó - Padlóbefúvó és ürítű rozsdamentes acélból - Rögzített, rozsdamentes acél 3 fokos létra - Fehér fényű LED MR16, 4 x 1W, 12V Méretek: - Oldalfal vastagság: 2,5 mm - Aljzat vastagság: 1,5 mm - D 1390 x H 1080 mm.', 16, 4, 41),
('110002', 'LÉTRA, KIS ÍVŰ 2 FOKOS AISI304', 79600, -1, 'Kis ívű medence létra A kis ívű medence létra lehetővé teszi a könnyed és kényelmes be- és klépést a medencéből. Ha szeretné, hogy medencéjébe egyszerűen és biztonságosan léphessen be, valamint könnyedén kiléphessen onnan, akkor ez a létra ideális választás. A medence létrát kifejezetten a könnyű hozzáférés érdekében tervezték, így növelve a medence használatának élvezetét és kényelmét. A medence létra ergonomikus tervezéssel rendelkezik, hogy a lehető legkényelmesebb legyen a használata, legyen szó gyermekről vagy felnőttről. A létra fokai megfelelő távolsággal helyezkednek el, így biztosítva a stabil és biztonságos közlekedést. Az egyes fokokon csúszásmentes felületek találhatók, amelyek extra tapadást biztosítanak, így minimalizálva a lehetséges baleseti kockázatokat. Könnyen fel- és leszerelhető, könnyedén tárolható vagy szállítható. Könnyen tisztántartható, karbantartható rozsdamentes acélból (AISI304) készült létra hosszú élettartammal rendelkezik, és ellenáll a különböző időjárási viszonyoknak és vízi környezetnek. A létra nemcsak kényelmet nyújt, hanem stílusos kiegészítője is lehet medencéjének. Az esztétikus kialakítás és a letisztult design segít abban, hogy harmonizáljon a medence környezetével, így emelve a medence összhangját és megjelenését. AISI304 Az AISI 304-es acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon. Kiváló korrózióállósággal rendelkezik, és ellenáll a legtöbb környezeti hatásnak, beleértve az oxidációt, savakat, lúgokat és nedvességet is.', NULL, 7, 91),
('111012', 'LÉTRA, NAGY ÍVŰ 2 FOKOS AISI316', 103900, -1, 'Nagy ívű medence létra A nagy ívű medence létra lehetővé teszi a könnyed és kényelmes be- és klépést a medencéből. Ha szeretné, hogy medencéjébe egyszerűen és biztonságosan léphessen be, valamint könnyedén kiléphessen onnan, akkor ez a létra ideális választás. A medence létrát kifejezetten a könnyű hozzáférés érdekében tervezték, így növelve a medence használatának élvezetét és kényelmét. A medence létra ergonomikus tervezéssel rendelkezik, hogy a lehető legkényelmesebb legyen a használata, legyen szó gyermekről vagy felnőttről. A létra fokai megfelelő távolsággal helyezkednek el, így biztosítva a stabil és biztonságos közlekedést. Az egyes fokokon csúszásmentes felületek találhatók, amelyek extra tapadást biztosítanak, így minimalizálva a lehetséges baleseti kockázatokat. Könnyen fel- és leszerelhető, könnyedén tárolható vagy szállítható. Könnyen tisztántartható, karbantartható rozsdamentes acélból (AISI316) készült létra hosszú élettartammal rendelkezik, és ellenáll a különböző időjárási viszonyoknak és vízi környezetnek. A létra nemcsak kényelmet nyújt, hanem stílusos kiegészítője is lehet medencéjének. Az esztétikus kialakítás és a letisztult design segít abban, hogy harmonizáljon a medence környezetével, így emelve a medence összhangját és megjelenését. AISI316 Az AISI 316-os acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon, amelyek kiváló ellenállást nyújtanak a korróziónak és oxidációnak, valamint magas hőmérsékleti és mechanikai terheléseknek is ellenállnak.', NULL, 7, 33),
('112020', 'HIDRAULIKUS LIFT', 4701000, -1, 'Hidraulikus lift Egy lift, amely hidraulikus mechanizmusokat használ, hogy segítsen az embereknek?különösen a mozgáskorlátozottaknak?biztonságosan be- és kiszállni az úszómedencéből. Ezek a liftek elengedhetetlenek az akadálymentesség biztosításához. Ezek a hidraulikus medenceliftek kulcsfontosságúak az inkluzivitás előmozdításában, lehetővé téve, hogy mindenki élvezhesse az úszást tevékenységeket fizikai korlátoktól függetlenül. Használata egyszerű, kialakítása tökéletes a sima és szabályozott emeléshez és süllyesztéshez. Felhasználóbarát, könnyen használható vezérlőkkel vannak ellátva mind a felhasználó, mind az üzemeltető számára. Tartós kialakítás, korrózióálló anyagokból készül, amelyek alkalmasak vizes környezetben. Közületi medencék többségéhez felszerelhető. Jellemzők: - Egyszerű rögzítés - Csőszerkezet: rozsdamentes acélból (AISI-316L) - Három ponton rögzített, kettő a medence külső oldalán, a harmadik a medence belső falán - Két helyről vezérelhető, egyrészt a medencepartról, illetve a medencéből - Maximális terhelhetőség: 120kg - Forgási szög: 150° - Víznyomás: > 3bar - Ülés: szintetikus anyag, kültéri használatra is.', NULL, 7, 92);
INSERT INTO `termekek` (`cikkszam`, `nev`, `egysegar`, `akcios_ar`, `leiras`, `gyarto_id`, `kategoria_id`, `darabszam`) VALUES
('113013', 'LÉTRA, EXTRA NAGY ÍVŰ ÍVŰ 3 FOKOS', 251090, -1, 'Extra nagy ívű medence létra Az extra nagy ívű medence létra lehetővé teszi a könnyed és kényelmes be- és klépést a medencéből. Ha szeretné, hogy medencéjébe egyszerűen és biztonságosan léphessen be, valamint könnyedén kiléphessen onnan, akkor ez a létra ideális választás. A medence létrát kifejezetten a könnyű hozzáférés érdekében tervezték, így növelve a medence használatának élvezetét és kényelmét. A medence létra ergonomikus tervezéssel rendelkezik, hogy a lehető legkényelmesebb legyen a használata, legyen szó gyermekről vagy felnőttről. A létra fokai megfelelő távolsággal helyezkednek el, így biztosítva a stabil és biztonságos közlekedést. Az egyes fokokon csúszásmentes felületek találhatók, amelyek extra tapadást biztosítanak, így minimalizálva a lehetséges baleseti kockázatokat. Könnyen fel- és leszerelhető, könnyedén tárolható vagy szállítható. Könnyen tisztántartható, karbantartható rozsdamentes acélból (AISI304) készült létra hosszú élettartammal rendelkezik, és ellenáll a különböző időjárási viszonyoknak és vízi környezetnek. A létra nemcsak kényelmet nyújt, hanem stílusos kiegészítője is lehet medencéjének. Az esztétikus kialakítás és a letisztult design segít abban, hogy harmonizáljon a medence környezetével, így emelve a medence összhangját és megjelenését. AISI316 Az AISI 316-os acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon, amelyek kiváló ellenállást nyújtanak a korróziónak és oxidációnak, valamint magas hőmérsékleti és mechanikai terheléseknek is ellenállnak.', NULL, 7, 61),
('114012', 'LÉTRA, OSZTOTT 2 FOKOS AISI316', 185400, -1, 'Osztott létra Fedezd fel kiváló minőségű rozsdamentes létráinkat, amelyek tökéletesen illeszkednek a medencedesignhoz! Az AISI316 anyagból készült, polírozott létrák 43 mm átmérőjű csövekből állnak, és praktikus műanyag rögzítő elemekkel érkeznek. Ezek a létrák elsősorban monolit, vízzáró beton medencékhez lettek tervezve. A létra rögzítése a medencetest belső falába történik csavarokkal. Fontos megjegyezni, hogy fóliás burkolatú vagy kerámia medencéknél a csavarozás érintkezhet a vízzáró felülettel, és növelheti a vízvesztés kockázatát. Ezért javasoljuk ezen típusú medencék esetén figyelmesen eljárni. AISI316 Az AISI 316-os acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon, amelyek kiváló ellenállást nyújtanak a korróziónak és oxidációnak, valamint magas hőmérsékleti és mechanikai terheléseknek is ellenállnak.', NULL, 7, 30),
('115004', 'MŰANYAG LÉTRA RÖGZÍTŐ', 4900, -1, 'Műanyag létra rögzítő Kiváló minőségű kiegészítők a készletünkben megtalálható rozsdamentes létrákhoz és lépcsőkhöz.', 16, 7, 63),
('115008', 'CSUKLÓS LÉTRA DÖNTŐ TALP AISI304L', 42250, -1, 'Csuklós létra döntő talp AISI304L Kiváló minőségű kiegészítők a készletünkben megtalálható rozsdamentes létrákhoz és lépcsőkhöz.', 16, 7, 27),
('115010', 'LÉTRA TAKARÓ RÓZSA AISI316', 2900, -1, 'Létra takaró rózsa AISI316 Kiváló minőségű kiegészítők a készletünkben megtalálható rozsdamentes létrákhoz és lépcsőkhöz. AISI316 Az AISI 316-os acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon, amelyek kiváló ellenállást nyújtanak a korróziónak és oxidációnak, valamint magas hőmérsékleti és mechanikai terheléseknek is ellenállnak.', 16, 7, 43),
('115011', 'TÖMÍTÉS KÉSZLET MEDENCE FÓLIÁZÁSHOZ', 22510, -1, 'Tömítés készlet medence fóliázáshoz Kiváló minőségű kiegészítők a készletünkben megtalálható rozsdamentes létrákhoz és lépcsőkhöz.', 12, 3, 33),
('118000', 'KÉTÁGÚ INOX LÉTRA 3 + 3 FOKOS, MAX 1,0M', 163690, -1, 'Kétágú rozsdamentes létra Fedezd fel kiváló minőségű rozsdamentes létráinkat, amelyek tökéletesen illeszkednek a medencedesignhoz! A polírozott létra elemei AISI316 anyagból készültek és praktikus műanyag rögzítő elemekkel érkeznek Ezek a létrák elsősorban monolit, vízzáró beton medencékhez lettek tervezve. A létra rögzítése a medencetest belső falába történik csavarokkal. Fontos megjegyezni, hogy fóliás burkolatú vagy kerámia medencéknél a csavarozás érintkezhet a vízzáró felülettel, és növelheti a vízvesztés kockázatát. Ezért javasoljuk ezen típusú medencék esetén figyelmesen eljárni. AISI316 Az AISI 316-os acél az egyik legelterjedtebb és leggyakrabban használt rozsdamentes acél ötvözet a piacon, amelyek kiváló ellenállást nyújtanak a korróziónak és oxidációnak, valamint magas hőmérsékleti és mechanikai terheléseknek is ellenállnak.', 16, 7, 37),
('140001', 'HÁLÓ, FÖLÖZŐ, BASIC', 1460, -1, 'Basic fölöző háló Kiváló minőségű, esztétikus fölöző háló. A kézi medencetisztítás kiegészítő eleme, a vízbe hulló szennyeződések ellen. A levelek és egyéb a viz felszínén lebegő kerti szennyeződések és könnyebb gyerekjátékok könnyed összegyűjtésére tervezett fölöző háló, alumínium kerettel, megerősített polikarbonát fogantyúval és tartós hálóval. Könnyen rögzíthető kialakításának köszönhetően bármilyen szabványos teleszkópos rúdhoz illeszkedik.', 4, 21, 86),
('140003', 'HÁLÓ, FÖLÖZŐ NAVY BLUE', 5500, -1, 'Navy Blue fölöző háló Kiváló minőségű, esztétikus fölöző háló. A kézi medencetisztítás kiegészítő eleme, a vízbe hulló szennyeződések ellen. A levelek és egyéb a viz felszínén lebegő kerti szennyeződések és könnyebb gyerekjátékok könnyed összegyűjtésére tervezett fölöző háló, alumínium kerettel, megerősített polikarbonát fogantyúval és tartós hálóval. Könnyen rögzíthető kialakításának köszönhetően bármilyen szabványos teleszkópos rúdhoz illeszkedik.', 4, 21, 20),
('140027', 'KEFE, HAJLÍTOTT 450MM BASIC', 2860, -1, 'Basic hajlított kefe\r\nKiváló minőségű standard ívelt polipropilén (PP) sörtés fali kefe.\r\nEz a kefe ideális eszköz medencék és pezsgőfürdők általános tisztításához. Puha, mégis merev sörtéi gyengédek a felületekhez, nem karcolják meg azokat, miközben hatékonyan eltávolítják a szennyeződéseket, algákat és egyéb foltokat.\r\nA kefe minden szabványos teleszkópos rúdhoz illeszkedik, és 45 cm széles tisztítási felülettel rendelkezik, biztosítva a könnyű és alapos tisztítást.\r\n\r\nJellemzők\r\nAnyaga: Polipropilén (PP) \r\nFej hossza: 450 mm', 4, 21, 39),
('140037', 'PORSZÍVÓTÖMLŐ CSATLAKOZÓ 38-32MM X 6/4\"', 990, -1, 'Porszívótömlő csatlakozó Kiváló minőségű, esztétikus fehér porszívótömlő csatlakozó, fix méretben - D38 - 32mm x 6/4\". Kézi medenceporszívó tartozék a hatékony medencetisztításért.', 12, 3, 34),
('140039', 'PORSZÍVÓTÖMLŐ TOLDÓ UNIVERZÁLIS 38/32MM', 1040, -1, 'Porszívótömlő csatlakozó Kiváló minőségű, esztétikus fehér porszívótömlő doló, univerzális - D38 / 32mm. Kézi medenceporszívó tartozék a hatékony medencetisztításért.', 12, 3, 55),
('140040', 'PORSZÍVÓTÖMLŐ CSATLAKOZÓ 32/38MM X D50', 965, -1, 'Porszívótömlő csatlakozó Kiváló minőségű, esztétikus fehér porszívótömlő csatlakozó, fix méretben - 32/38mm x D50. Kézi medenceporszívó tartozék a hatékony medencetisztításért.', 12, 3, 73),
('150001', 'AQUACORRECT ALGECID KONCENTRÁTUM - 1 L', 2500, -1, 'Aquacorrect Algecid - Folyékony algaölőszer\r\nHabzásmentes folyékony algaölő koncentrátum 1 L-es kiszerelésben. Magas koncentrációjú, habzásmentes.\r\nKvaterner ammónium hatóanyag, kizárólag magán úszómedencékhez.\r\n\r\nAlgaölők\r\nMagas koncentrációjú, habmentes és folyékony algaölőszer, hosszú távú hatású.\r\nMegakadályozza az algásodást. Segít a zavarosság eltávolításában. Tisztítja a medencevizet.\r\n\r\nFelhasználás\r\nVízápolási termék az algásodás megelőzésére. Koncentrált és habmentes algásodásgátló szer tisztító hatással és hosszú távú hatással.\r\nMegakadályozza az algásodást az úszómedencében, segít a zavarosság eltávolításában és tisztítja az úszómedence vizét.\r\n\r\nAdagolás\r\nAz algaölő folyadék hozzáadása előtt állítsa be a pH-értéket az optimális 7,0 - 7,4-es tartományba.\r\n\r\nKezdeti adagoláshoz adjon 50-100 ml/10 m? vegyszert.\r\nHetente 20 ml/10 m? beltéri medencék esetében és 40 ml/10 m? kültéri medencék esetében a beömlő fúvókák közelében a medencevízhez.\r\nErős algásodás (zöld nyomok) esetén a sokkoló-klórozás után akár 600 ml/10 m? is adható a medencébe.\r\nAz algásodás megelőzésére a medence falát hígítatlanul elő lehet kezelni szivaccsal a medence feltöltése előtt.\r\nFontos információk\r\nA termék kizárólag a leírásban megadott célokra használható.\r\nA hatás a használatot követően azonnal megkezdődik.\r\nMinden adagolási utasítás a tapasztalati értékeken alapul és nem kötelező érvényű.\r\nHűvösen és szárazon, fénytől védett, jól szellőző helyen tárolja.', 17, 19, 100),
('150011', 'AQUACORRECT KLÓRGRANULÁTUM 56% - 1 KG', 4785, -1, 'Gyorsan oldódó Aquacorrect klórgranulátum\r\nGyorsan oldódó 56%-os klórgranulátum 1 kg-os kiszerelésben, úszómedence fertőtlenítésére, csírátlanítására.\r\nVízápolási termék fertőtlenítésre és algásodás megelőzésére, amely hatékony gombák, vírusok és szerves zavaros anyagok ellen.\r\nPrivát úszómedencékhez ajánlott, pH semleges és maradékmentes oldódás jellemzi.\r\nFelhasználás: normál- és sokkoló klórozáshoz, amely alkalmas minden vízkeménységhez.\r\n\r\nKlór\r\nA mikroorganizmusokat a mechanikus medencetisztítás, a szűrőrendszer nem tudja teljesen eltávolítani. Forró napokon a magas hőmérséklet tökéletes feltételeket biztosít a mikroorganizmusok és kórokozók számának gyarapodásához.\r\nEzek táplálékul szolgálnak az algáknak, amelyek egymás után szaporodnak, amik tökéletes táptalajt jelentenek a baktériumok, vírusok és gombák számára.\r\nKlóros fertőtlenítőszer használata ezért rendkívül fontos a mikroorganizmusok szaporodásának gátlása, a víz zavarosságának ellensúlyozása és a fürdővíz tisztán tartása érdekében.\r\n\r\nAdagolás\r\nA klórgranulátum hozzáadása előtt állítsa be a pH-értéket az optimális 7,0 - 7,4-es tartományba. Az optimális klórszint 0,3-0,6 mg/l hosszú távú\r\nklórozás és max. 3 mg/l sokk-klórozás esetén.\r\n\r\nA kezdeti adagoláshoz adjon 100g (kb. 100ml)/10m?, majd hetente 50g (kb. 50ml)/10m? oldatot a medence vizéhez.\r\nOldja fel a klórgranulátumot vízben és adja a medencéhez, ideális esetben a szkimmer segítségével.\r\nGyakori használat, zivatar vagy magas hőmérséklet után, zavaros víz esetén adjon hozzá 200g (kb. 200ml)/10m? vegyszer a medencevízhez.\r\nCsúszós törmelék vagy algásodás (zöld nyomok) esetén adjon algaölőt az adagolási ajánlásnak megfelelően.\r\nFontos információk\r\nA termék kizárólag a leírásban megadott célokra használható.\r\nA hatás a használatot követően azonnal megkezdődik.\r\nMinden adagolási utasítás a tapasztalati értékeken alapul és nem kötelező érvényű.\r\nHűvösen és szárazon, fénytől védett, jól szellőző helyen tárolja.', 17, 19, 80),
('150031', 'AQUACORRECT KLÓRTABLETTA 200 GR 90% - 1 KG', 4200, -1, 'Lassan oldódó Aquacorrect klórtabletta\r\nLassan oldódó maxi klórtabletta kg-os kiszerelésben, az úszómedence fertőtlenítésére, csírátlanítására.\r\nHatékony gombásodás, baktériumképződés ellen és organikus anyagokat épít fel a víz zavarosodásának megelőzésére.\r\nPrivát úszómedencékhez ajánlott, minden vízkeménységnél tökéletesen alkalmazható. 1 db tabletta 200 gr.\r\nFelhasználás: általános klórozás és hosszú-távú klórozás. Elhelyezése úszó vegyszeradagolóba vagy szkimmerbe javasolt.\r\n\r\nKlór\r\nA mikroorganizmusokat a mechanikus medencetisztítás, a szűrőrendszer nem tudja teljesen eltávolítani. Forró napokon a magas hőmérséklet tökéletes feltételeket biztosít a mikroorganizmusok és kórokozók számának gyarapodásához.\r\nEzek táplálékul szolgálnak az algáknak, amelyek egymás után szaporodnak, amik tökéletes táptalajt jelentenek a baktériumok, vírusok és gombák számára.\r\nKlóros fertőtlenítőszer használata ezért rendkívül fontos a mikroorganizmusok szaporodásának gátlása, a víz zavarosságának ellensúlyozása és a fürdővíz tisztán tartása érdekében.\r\n\r\nAdagolás\r\nA tabletta hozzáadása előtt állítsa be a pH-értéket az optimális 7,0 - 7,4-es tartományba. Az optimális klórszint 0,3-0,6 mg/l hosszú távú klórozás és max. 3 mg/l sokk-klórozás esetén.\r\n\r\nA kezdeti adagoláshoz adjon 100g (100ml) klórgranulátumot/10m?, majd hetente 1 tablettát/25-35m? a medencevízhez.\r\nFontos információk\r\nA termék kizárólag a leírásban megadott célokra használható.\r\nA hatás a használatot követően azonnal megkezdődik.\r\nMinden adagolási utasítás a tapasztalati értékeken alapul és nem kötelező érvényű.\r\nHűvösen és szárazon, fénytől védett, jól szellőző helyen tárolja.', 17, 19, 100),
('150061', 'AQUACORRECT QUATTROTABS 200 GR - 1 KG', 3850, -1, 'Aquacorrect Quattrotabs\r\nA Quattrotabs tabletták a medencék vízkezelésének ideális megoldása. Kiváló fertőtlenítőszer, az új hatóanyag tartalommal kristálytiszta lesz a medencevíz, 1 kg-os kiszerelésben.\r\nKombinált termék, algamentesítő és pelyhesítő hatása mellett fertőtlenít és stabilizálja a pH értéket.\r\n\r\nKombinált termék\r\n4 funkcióval az úszómedence vizének tisztán tartásáért:\r\n\r\nFertőtlenítés\r\npH-Stabilizálás\r\nPelyhesítés\r\nAlgamentesítés\r\nHasználat\r\nA Quattrotabs egy vízápoló termék, leginkább fertőtlenítésre és az algásodás megelőzésére használják.\r\nLassan oldódó multifunkciós tabletta, a hosszú távú adagoláshoz. Használatakor klór és pelyhesítő szabadul fel.\r\nKizárólag magánmedencékhez ajánljuk. Csak úszó vegyszeradagolóhoz és szkimmerhez javasolt.\r\n\r\nAdagolás\r\n1 tabletta 200g. A tabletta hozzáadása előtt állítsa be a pH-értéket az optimális 7,0 - 7,4-es tartományba. Az optimális klórszint 0,3-0,6 mg/l hosszú távú klórozás és max. 3 mg/l sokk-klórozás esetén.\r\n\r\nA kezdeti adagoláshoz adjon 100g (100ml) klórgranulátumot/10m?, majd hetente 1 tablettát/25-35m? a medencevízhez.\r\nGyakori felhasználás, eső vagy kánikula utáni zavaros víz esetén adjon 200g (200ml)/10m? klórgranulátumot a medencevízhez.\r\nCsúszós törmelék vagy algásodás (zöld nyomok) esetén adjon algaölőt az adagolási ajánlásnak megfelelően.\r\nFontos információk\r\nA termék kizárólag a leírásban megadott célokra használható.\r\nA hatás a használatot követően azonnal megkezdődik.\r\nMinden adagolási utasítás a tapasztalati értékeken alapul és nem kötelező érvényű.\r\nNe tegye a klórtablettákat közvetlenül a medencébe, mert fehérítő foltok keletkezhetnek.\r\nSokk-klórozás és/vagy 3mg/l feletti klórértékek esetén tilos a medence használata.\r\nHűvösen és szárazon, fénytől védett, jól szellőző helyen tárolja.', 17, 19, 58),
('150077', 'AQUACORRECT PH MÍNUSZ GRANULÁTUM - 7,5 KG', 8600, -1, 'Aquacorrect pH mínusz granulátum\r\nVízápoló termék, ami hatékonyan hozzájárul a medencevíz optimális pH tartalmához. Savas granulátum a medencevíz pH értékének csökkentésére, 7,5 kg-os kiszerelésben.\r\nA víz pH-értéke az egyik legfontosabb tényező az uszodai fertőtlenítőszerek optimális hatása szempontjából. A pH-érték optimális tartománya 7,0 és 7,4 között van.\r\nAz eltérések növelik a többi termék szükséges adagolási mennyiségét, vagy csökkentik azok hatását.\r\npH - (minusz) granulátum a pH-érték csökkentésére, pH + (plusz) granulátum pedig a pH-érték növelésére szolgál.\r\nA mérés tesztcsíkokkal vagy tablettákkal végezhető. Kizárólag magánmedencékhez ajánlott.\r\n\r\nAdagolás\r\nOldjon fel 100 g-ot (kb. 75 ml) 10 m? vízmennyiségenként vízben, és a keveréket a medencébe adagolva csökkentse a medencevíz pH-értékét kb. 0,1 %-kal.\r\n\r\nMagas pH szint\r\nA túl lúgos, azaz 7,0 vagy 7,4 feletti értékű fürdővíz megbontja a savak és bázisok természetes egyensúlyát a nyálkahártyákon és a bőrfelületen, és fokozott irritációhoz vezethet. A 7,4-nél magasabb érték fokozatosan zavarossá teszi a vizet, mivel több mészlerakódás képződik.\r\nMinél keményebb a víz, annál meszesebb, és annál több mészlerakódás alakul ki a medencében. A túl magas pH érték erősen gátolja a pelyhesítők és fertőtlenítőszerek hatását.\r\n\r\nFontos információk\r\nEz a termék kizárólag a leírásban megadott célokra használható.\r\nA hatás a használat után azonnal megkezdődik.\r\nMinden adagolási utasítás a tapasztalati értékeken alapul és nem kötelező érvényű.\r\nHűvösen és szárazon, fénytől védett, jól szellőző helyen tárolandó.', 17, 19, 88),
('150180', 'AQUACORRECT INDULÓ VEGYSZER KÉSZLET', 15900, -1, 'Aquacorrect induló vegyszer készlet A teljeskörű alapfelszereltség medencetulajdonosok számára, az alábbi összeállításban: - 1kg szerves klór granulátum - 1kg klór tabletta 200g - 1,5kg pH-mínusz granulátum - 1L magaskoncentrátumú és habzásmentes algamentesítő - pH és szabad klór teszt - hőmérő °C/°F - vízkezelési útmutató Gyorsan oldódó Aquacorrect Klórgranulátum Gyorsan oldódó 56%-os klórgranulátum 1 kg-os Kiszerelés:ben, úszómedence fertőtlenítésére, csírátlanítására. Vízápolási termék fertőtlenítésre és algásodás megelőzésére, amely hatékony gombák, vírusok és szerves zavaros anyagok ellen. Privát úszómedencékhez ajánlott, pH semleges és maradékmentes oldódás jellemzi. Felhasználás: normál- és sokkoló klórozáshoz, amely alkalmas minden vízkeménységhez. Kizárólag magánmedencékhez ajánlott. Lassan oldódó Aquacorrect Klórtabletta Lassan oldódó maxi klórtabletta 1 kg-os Kiszerelés:ben, az úszómedence fertőtlenítésére, csírátlanítására. Hatékony gombásodás, baktériumképződés ellen és organikus anyagokat épít fel a víz zavarosodásának megelőzésére. Privát úszómedencékhez ajánlott, minden vízkeménységnél tökéletesen alkalmazható. 1 db tabletta 20 gr. Felhasználás: általános klórozás és hosszú-távú klórozás. Elhelyezése úszó vegyszeradagolóba vagy szkimmerbe javasolt. Aquacorrect pH Mínusz Granulátum Vízápoló termék, ami hatékonyan hozzájárul a medencevíz optimális pH tartalmához. Savas granulátum a medencevíz pH értékének csökkentésére, 1,5 kg-os Kiszerelés:ben. A víz pH-értéke az egyik legfontosabb tényező az uszodai fertőtlenítőszerek optimális hatása szempontjából. A pH-érték optimális tartománya 7,0 és 7,4 között van. Az eltérések növelik a többi termék szükséges adagolási mennyiségét, vagy csökkentik azok hatását. pH - (minusz) granulátum a pH-érték csökkentésére, pH + (plusz) granulátum pedig a pH-érték növelésére szolgál. A mérés tesztcsíkokkal vagy tablettákkal végezhető. Kizárólag magánmedencékhez ajánlott. Aquacorrect Algecid - Folyékony algaölőszer Habzásmentes folyékony algaölő koncentrátum 1 L-es Kiszerelés:ben. Hosszú távú és hatású, magas koncentrációjú, habmentes és folyékony algaölőszer. Megakadályozza az algásodást, segít a zavarosság eltávolításában, tisztítja a medencevizet. Vízápolási termék az algásodás megelőzésére. Koncentrált és habmentes algásodásgátló szer tisztító hatással és hosszú távú hatással. Megakadályozza az algásodást az úszómedencében, segít a zavarosság eltávolításában és tisztítja az úszómedence vizét.', 17, 19, 67),
('163303', 'SOPREMAPOOL 3D - SENSITIVE BALI', 713625, -1, 'Sopremapool 3D medencefólia\r\nSopremapool 3D 180/100 és 150/100 típusú szöveterősített medencefólia\r\n\r\nSzöveterősített PVC-fólia 1,8 mm és 1,5 mm vastagságban, mind a 4 réteg lakkal impregnálva, rugalmas és sima.\r\nA lakkozott bevonat elsőrangú védelmet nyújt az UV-sugárzással, a mikroorganizmusokkal és a klórral szemben.\r\nEzt a típust exkluzív megjelenés, változatos design és mintázat, emellett különleges színek jellemzik.\r\nA síkból kidomborodó, esztétikus megjelenésű motívumok további vonzerővel egészítik ki a szöveterősített PVC-burkolatok előnyeit, vagyis a könnyű és gyors telepíthetőséget és a kiváló védő- és vízszigetelő-képességet.\r\n\r\nA 3D termékcsalád összes fóliája az EN 15836 európai szabvány és a DIN 51097 szabvány szerinti csúszásgátló tulajdonságokkal rendelkezik.\r\nA 2010-es EN 15836-2 európai szabvány szerint gyártva.\r\n\r\nA Sensitive fóliák 1,8 mm vastagok\r\nA Ceram fóliák 1,5 mm vastagságúak\r\nKiszerelés: 1,65 x 25 m-es tekercs 4 rétegű fólia\r\n\r\nGyártás és Minőség\r\nA Sopremapool medencebélelő fóliák kiváló minőségű alapanyagok felhasználásával készülnek. A gyártás során a hordozó réteg impregnálásra kerül, és erre laminálással kerülnek fel a további rétegek.\r\nEnnek köszönhetően a 4 réteg úgy készül, hogy egy teljesen homogén fólia az eredmény, ami kiváló hegeszthetőségi tulajdonságokkal rendelkezik, hő hatására sem válik rétegekre.\r\nE megerősítésnek köszönhetően a fólia nagy szakítószilárdsággal és kiváló méretstabilitással rendelkezik.\r\n\r\nInnovatív Gyártási Eljárás\r\nLaboratóriumaink fejlesztéseinek köszönhetően a gyártási folyamat során egy különleges lakkot impregnálunk a teljes SOPREMAPOOL termékkínálat mind a 4 rétegébe, ami nagy mértékben javítja a színtartóságot, valamint a klórral, a szennyeződések lerakódásával, és a mikroorganizmusokkal szembeni ellenálló-képességet.\r\n\r\nBIO-Pajzs Kezelés\r\nAz összetétel kiegészítése a ?BIO-PAJZS?-kezeléssel teljes védelmet biztosít a mikroorganizmusok elszaporodásával szemben és megakadályozza a molekulaszerkezeti elváltozásokat.\r\n\r\n4 Réteg\r\nKiváló minőségű PVC: 1. és 2. réteg\r\nPoliészter szövet megerősítése\r\nKiváló minőségű PVC: 3. és 4. réteg\r\nLakk védőréteg\r\nRétegek Előnyei\r\nLakkimpregnálás mind a 4 rétegben\r\nOptimális hegeszthetőség\r\nUV fénnyel szembeni ellenálló-képesség\r\nMikroorganizmusokkal szembeni ellenálló-képesség a ?BIO-PAJZS?-kezelésnek köszönhetően\r\nSzúrással szembeni ellenállás\r\nNagyfokú mechanikai szilárdság\r\nEllenálló-képesség a PVC-vel bélelt úszómedencékben a víz kezelésére általánosan használt vegyi anyagokkal szemben', 18, 13, 71),
('163321', 'SOPREMAPOOL FEELING - AZURE BLUE', 420750, -1, 'Sopremapool Feeling medencefólia\r\n150/100 típusú szöveterősített medencefólia. 1,5 mm vastagságú szöveterősített PVC-fólia, mind a négy rétege különleges lakkal impregnálva.\r\nÚjfajta dombornyomás, ami természetesebb tapintást eredményez. A lakkozott bevonat standard védelmet nyújt az UV-sugárzással és a mikroorganizmusokkal szemben.\r\n\r\nA SOPREMAPOOL FEELING (az EN 15836-2 B melléklete alapján) az EN 13451-1 európai szabvány és a DIN 51097 (1992) szabvány szerint tesztelt csúszásgátló tulajdonságokkal rendelkezik.\r\n\r\n4 Réteg\r\nKiváló minőségű PVC: 1. és 2. réteg\r\nPoliészter szövet megerősítése\r\nKiváló minőségű PVC: 3. és 4. réteg\r\nLakk védőréteg\r\nRétegek Előnyei\r\nLakkimpregnálás mind a 4 rétegben\r\nOptimális hegeszthetőség\r\nUV fénnyel szembeni ellenálló-képesség\r\nMikroorganizmusokkal szembeni ellenálló-képesség a ?BIO-PAJZS?-kezelésnek köszönhetően\r\nSzúrással szembeni ellenállás\r\nNagyfokú mechanikai szilárdság\r\nEllenálló-képesség a PVC-vel bélelt úszómedencékben a víz kezelésére általánosan használt vegyi anyagokkal szemben', 18, 13, 53),
('184100', 'AZURO KÖR B-W, KÉK 240 X 090M', 118000, -1, 'Azuro - kör alakú medence Az Azuro medencék kiváló minőségű horganyzott acéllemezből készült támasztó falai korrózióvédelemmel és különleges erős műanyag réteggel rendelkeznek. A 7 rétegű fal garantálja a medence hosszú élettartamát. Az Azuro medencék megerősített szerkezete ellenáll a mechanikai károsodásoknak, az UV-sugárzásnak a klórnak és más vegyszereknek. Jellemzők: - Magasság: 0,9 m - Fóliavastagság: 0,225 mm.', 19, 6, 50),
('184101', 'AZURO KÖR B-W, KÉK 240 X 090M SKIMFILTER', 150000, -1, 'Azuro - kör alakú medence Az Azuro medencék kiváló minőségű horganyzott acéllemezből készült támasztó falai korrózióvédelemmel és különleges erős műanyag réteggel rendelkeznek. A 7 rétegű fal garantálja a medence hosszú élettartamát. Az Azuro medencék megerősített szerkezete ellenáll a mechanikai károsodásoknak, az UV-sugárzásnak a klórnak és más vegyszereknek. Jellemzők: - Magasság: 0,9 m - Fóliavastagság: 0,225 mm.', 19, 6, 93),
('184109', 'AZURO OVAL G-W, KÉK 550 X 370 X 120M', 534000, -1, 'Azuro - Ovális alakú medence Az Azuro medencék kiváló minőségű horganyzott acéllemezből készült támasztó falai korrózióvédelemmel és különleges erős műanyag réteggel rendelkeznek. A 7 rétegű fal garantálja a medence hosszú élettartamát. Az Azuro medencék megerősített szerkezete ellenáll a mechanikai károsodásoknak, az UV-sugárzásnak a klórnak és más vegyszereknek. Jellemzők - Magasság: 1,2 m - Fóliavastagság: 0,5 mm.', 19, 6, 15),
('184110', 'AZURO KÖR RATTAN, KÉK 360 X 120M', 207680, -1, 'Azuro - kör alakú medence Az Azuro medencék kiváló minőségű horganyzott acéllemezből készült támasztó falai korrózióvédelemmel és különleges erős műanyag réteggel rendelkeznek. A 7 rétegű fal garantálja a medence hosszú élettartamát. Az Azuro medencék megerősített szerkezete ellenáll a mechanikai károsodásoknak, az UV-sugárzásnak a klórnak és más vegyszereknek. Jellemzők: - Magasság: 1,2 m - Fóliavastagság: 0,5 mm.', 19, 6, 95),
('184114', 'AZURO KÖR STONE, KÉK 360 X 090M', 160000, -1, 'Azuro - kör alakú medence Az Azuro medencék kiváló minőségű horganyzott acéllemezből készült támasztó falai korrózióvédelemmel és különleges erős műanyag réteggel rendelkeznek. A 7 rétegű fal garantálja a medence hosszú élettartamát. Az Azuro medencék megerősített szerkezete ellenáll a mechanikai károsodásoknak, az UV-sugárzásnak a klórnak és más vegyszereknek. Jellemzők: - Magasság: 1,2 m - Fóliavastagság: 0,5 mm.', 19, 6, 29),
('184121', 'AZURO KÖR WOOD, KÉK 460 X 120M', 245000, -1, 'Azuro - kör alakú medence Az Azuro medencék kiváló minőségű horganyzott acéllemezből készült támasztó falai korrózióvédelemmel és különleges erős műanyag réteggel rendelkeznek. A 7 rétegű fal garantálja a medence hosszú élettartamát. Az Azuro medencék megerősített szerkezete ellenáll a mechanikai károsodásoknak, az UV-sugárzásnak a klórnak és más vegyszereknek. Jellemzők: - Magasság: 1,2 m - Fóliavastagság: 0,5 mm.', 19, 6, 61),
('184123', 'AZURO OVAL WOOD, KÉK 550 X 370 X 120M', 477000, -1, 'Azuro - ovális alakú medence Az Azuro medencék kiváló minőségű horganyzott acéllemezből készült támasztó falai korrózióvédelemmel és különleges erős műanyag réteggel rendelkeznek. A 7 rétegű fal garantálja a medence hosszú élettartamát. Az Azuro medencék megerősített szerkezete ellenáll a mechanikai károsodásoknak, az UV-sugárzásnak a klórnak és más vegyszereknek. Jellemzők: - Magasság: 1,2 m - Fóliavastagság: 0,5 mm.', 19, 6, 18),
('186451', 'SAPHIR 450 BASEWALL', 2278554, -1, 'SAPHIR 450 - Üvegszálas kompozit medence A Basewall medence kialakítása garantáltan megfelel minden felhasználói igénynek. Bátran ajánljuk ezt a kivitelt minden ügyfelünknek, hisz a garancia biztosíték a kiváló alaptípusra is. Minden medence acél merevítő konzollal rendelkezik mely elengedhetetlen a szállítás - daruzás és telepítés során. A medencék már rolókamrával is rendelhetőek. Állítható támasztólábak a medence oldalfalához és a lépcsőhöz külön rendelhetőek., Tulajdonságai: - szögletes medence lépcsősorral és ülőpaddal a bal sarokban - medenceperem: 13 cm széles, 4 cm magas - a medence alja PU szigetelő anyaggal hőszigetelt - medence külső méretei: 4500 x 2700 x 1530 mm - alapszínek fehér, bézs, világoskék Kompozit medencék rétegezése: 1-2-3. réteg: egy 3 dimenziós multicolor medencefelület, mely egy fröccstechnológiával egymás utáni rétegben felvitt Gelcoat (első poliészter gélréteg) réteg 4. réteg: Barriercoat felvitele után egy vinilészter gyanta (vinilacetát gyanta) puffer-réteg, üvegszállal eldolgozva. Ez a réteg a legfőbb garancia a teljes struktúrára, a hosszú ozmózis ellenállás, és a kivételes mechanikai tulajdonságok garanciája 5. réteg: speciális vinilészter gyanta - kerámia maganyag keverék, mely szintén az ozmózis ellenállásra van kifejlesztve. Ez a keverék a legmodernebb kutatási eredményeket és fejlett nanotechnológia jelenlétét mutatja. (Ceramicwall) 6. réteg: általános üvegszállal erősített poliészter váz 7. réteg: Poliamid szövet ütésálló, extra rugalmas aramidszálas szöveterősítés.', 20, 5, 7),
('188802', 'PLATINUM 800 BASEWALL + PU', 4438700, -1, 'PLATINUM 800 - Üvegszálas kompozit medence A Basewall medence kialakítása garantáltan megfelel minden felhasználói igénynek. Bátran ajánljuk ezt a kivitelt minden ügyfelünknek, hisz a garancia biztosíték a kiváló alaptípusra is. A PU zárt cellás habszigetelés egyszerre védi a külső behatásoktól a szerkezetet, extra merevséget biztosít, valamint hőszigetel. Minden medence acél merevítő konzollal rendelkezik mely elengedhetetlen a szállítás - daruzás és telepítés során. A medencék már rolókamrával is rendelhetőek. Állítható támasztólábak a medence oldalfalához és a lépcsőhöz külön rendelhetőek. Tulajdonságai: - szögletes medence, teljes szélességében lépcső sorral - medenceperem: 13 cm széles, 4 cm magas - a medence alja PU szigetelő anyaggal hőszigetelt - medence külső méretei: 8000 x 3800 x 1530 mm - alapszínek fehér, bézs, világoskék Kompozit medencék rétegezése: 1-2-3. réteg: egy 3 dimenziós multicolor medencefelület, mely egy fröccstechnológiával egymás utáni rétegben felvitt Gelcoat (első poliészter gélréteg) réteg 4. réteg: Barriercoat felvitele után egy vinilészter gyanta (vinilacetát gyanta) puffer-réteg, üvegszállal eldolgozva. Ez a réteg a legfőbb garancia a teljes struktúrára, a hosszú ozmózis ellenállás, és a kivételes mechanikai tulajdonságok garanciája 5. réteg: speciális vinilészter gyanta - kerámia maganyag keverék, mely szintén az ozmózis ellenállásra van kifejlesztve. Ez a keverék a legmodernebb kutatási eredményeket és fejlett nanotechnológia jelenlétét mutatja. (Ceramicwall) 6. réteg: általános üvegszállal erősített poliészter váz 7. réteg: Poliamid szövet ütésálló, extra rugalmas aramidszálas szöveterősítés.', 21, 5, 81);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `tetelek`
--

CREATE TABLE IF NOT EXISTS `tetelek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `megrendeles_id` int(11) NOT NULL,
  `termek_id` varchar(6) NOT NULL,
  `darabszam` int(11) NOT NULL,
  `egysegar` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `megrendeles_id` (`megrendeles_id`),
  KEY `termek_id` (`termek_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
-- Eseményindítók `tetelek`
--
DELIMITER $$
CREATE TRIGGER `megrendeles_torles` AFTER DELETE ON `tetelek` FOR EACH ROW BEGIN
    
    DECLARE itemCount INT;
    
    SELECT COUNT(*) INTO itemCount FROM tetelek WHERE megrendeles_id = 5;
    
    IF itemCount = 0 THEN
        DELETE FROM megrendeles WHERE id = 5;
    END IF;
END
$$
DELIMITER ;

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
