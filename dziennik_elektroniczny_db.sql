-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 17, 2026 at 03:18 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dziennik_elektroniczny_db`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `frekwencje`
--

CREATE TABLE `frekwencje` (
  `Id` int(11) NOT NULL,
  `Data` datetime(6) NOT NULL,
  `Status` longtext NOT NULL,
  `UczenId` int(11) NOT NULL,
  `ZajeciaId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `frekwencje`
--

INSERT INTO `frekwencje` (`Id`, `Data`, `Status`, `UczenId`, `ZajeciaId`) VALUES
(1, '2025-09-01 00:00:00.000000', 'NIEOBECNY', 3, 1),
(2, '2025-09-01 00:00:00.000000', 'NIEOBECNY', 4, 1),
(3, '2025-09-03 00:00:00.000000', 'OBECNY', 3, 2),
(4, '2025-09-03 00:00:00.000000', 'OBECNY', 4, 2),
(5, '2025-09-01 00:00:00.000000', 'SPOZNIONY', 4, 3),
(6, '2025-09-01 00:00:00.000000', 'SPOZNIONY', 3, 3),
(7, '2025-09-02 00:00:00.000000', 'USPRAWIEDLIWIONY', 3, 4),
(8, '2025-09-02 00:00:00.000000', 'USPRAWIEDLIWIONY', 4, 4),
(9, '2025-09-03 00:00:00.000000', 'NIEOBECNY', 7, 9),
(10, '2025-09-03 00:00:00.000000', 'NIEOBECNY', 5, 9),
(11, '2025-09-03 00:00:00.000000', 'NIEOBECNY', 6, 9),
(12, '2025-09-04 00:00:00.000000', 'OBECNY', 7, 10),
(13, '2025-09-04 00:00:00.000000', 'OBECNY', 5, 10),
(14, '2025-09-04 00:00:00.000000', 'OBECNY', 6, 10),
(15, '2025-09-05 00:00:00.000000', 'SPOZNIONY', 5, 11),
(16, '2025-09-05 00:00:00.000000', 'SPOZNIONY', 7, 11),
(17, '2025-09-05 00:00:00.000000', 'SPOZNIONY', 6, 11),
(18, '2025-09-04 00:00:00.000000', 'USPRAWIEDLIWIONY', 5, 12),
(19, '2025-09-04 00:00:00.000000', 'USPRAWIEDLIWIONY', 7, 12),
(20, '2025-09-04 00:00:00.000000', 'USPRAWIEDLIWIONY', 6, 12);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klasauzytkownik`
--

CREATE TABLE `klasauzytkownik` (
  `KlasyId` int(11) NOT NULL,
  `UzytkownikId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `klasauzytkownik`
--

INSERT INTO `klasauzytkownik` (`KlasyId`, `UzytkownikId`) VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `klasy`
--

CREATE TABLE `klasy` (
  `Id` int(11) NOT NULL,
  `Nazwa` longtext NOT NULL,
  `Rok` int(11) NOT NULL,
  `WychowawcaId` int(11) DEFAULT NULL,
  `PlanId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `klasy`
--

INSERT INTO `klasy` (`Id`, `Nazwa`, `Rok`, `WychowawcaId`, `PlanId`) VALUES
(1, '1A', 2026, 2, NULL),
(2, '1B', 2026, NULL, NULL),
(3, '1C', 2026, NULL, NULL),
(4, '1D', 2026, NULL, NULL),
(5, '2A', 2026, NULL, NULL),
(6, '2B', 2026, NULL, NULL),
(7, '2C', 2026, NULL, NULL),
(8, '2D', 2026, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `oceny`
--

CREATE TABLE `oceny` (
  `Id` int(11) NOT NULL,
  `DataWystawienia` datetime(6) NOT NULL,
  `Opis` longtext NOT NULL,
  `Wartosc` float NOT NULL,
  `Typ` longtext NOT NULL,
  `UczenId` int(11) NOT NULL,
  `NauczycielId` int(11) NOT NULL,
  `PrzedmiotId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `oceny`
--

INSERT INTO `oceny` (`Id`, `DataWystawienia`, `Opis`, `Wartosc`, `Typ`, `UczenId`, `NauczycielId`, `PrzedmiotId`) VALUES
(1, '2026-01-17 14:07:56.972000', '', 5, 'KARTKOWKA', 3, 2, 1),
(2, '2026-01-17 14:08:03.972000', '', 2, 'PRACADOMOWA', 3, 2, 1),
(3, '2026-01-17 14:08:10.628000', '', 3, 'ODPOWIEDZ', 4, 2, 1),
(4, '2026-01-17 14:08:17.884000', '', 4, 'ODPOWIEDZ', 4, 2, 1),
(5, '2026-01-17 14:08:28.227000', '', 6, 'PRACADOMOWA', 3, 2, 2),
(6, '2026-01-17 14:08:31.644000', '', 4, 'TEST', 3, 2, 2),
(7, '2026-01-17 14:08:51.667000', '', 3, 'ODPOWIEDZ', 4, 2, 2),
(8, '2026-01-17 14:09:01.387000', '', 5, 'ODPOWIEDZ', 3, 2, 7),
(9, '2026-01-17 14:09:06.371000', '', 5, 'PRACADOMOWA', 3, 2, 7),
(10, '2026-01-17 14:09:12.795000', '', 1, 'ODPOWIEDZ', 4, 2, 7),
(11, '2026-01-17 14:09:18.523000', '', 1, 'REFERAT', 4, 2, 7),
(12, '2026-01-17 14:14:32.979000', '', 3, 'ODPOWIEDZ', 5, 2, 4),
(13, '2026-01-17 14:14:39.659000', '', 5, 'ODPOWIEDZ', 6, 2, 4),
(14, '2026-01-17 14:14:49.515000', '', 4, 'PRACADOMOWA', 7, 2, 4),
(15, '2026-01-17 14:15:00.802000', '', 1, 'TEST', 5, 2, 8),
(16, '2026-01-17 14:15:06.356000', '', 1, 'TEST', 6, 2, 8),
(17, '2026-01-17 14:15:10.899000', '', 1, 'TEST', 7, 2, 8),
(18, '2026-01-17 14:15:16.451000', '', 1, 'KARTKOWKA', 7, 2, 8),
(19, '2026-01-17 14:15:22.322000', '', 1, 'ODPOWIEDZ', 6, 2, 8),
(20, '2026-01-17 14:15:32.371000', '', 1, 'KARTKOWKA', 5, 2, 8),
(21, '2026-01-17 14:15:42.699000', '', 5, 'PRACADOMOWA', 5, 2, 7),
(22, '2026-01-17 14:15:47.747000', '', 4, 'PRACADOMOWA', 6, 2, 7),
(23, '2026-01-17 14:15:52.371000', '', 2, 'PRACADOMOWA', 7, 2, 7);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `opieka`
--

CREATE TABLE `opieka` (
  `RodzicId` int(11) NOT NULL,
  `UczenId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `opieka`
--

INSERT INTO `opieka` (`RodzicId`, `UczenId`) VALUES
(3, 8),
(4, 8),
(5, 8),
(6, 8),
(7, 8);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `plany`
--

CREATE TABLE `plany` (
  `Id` int(11) NOT NULL,
  `KlasaId` int(11) NOT NULL,
  `SemestrId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plany`
--

INSERT INTO `plany` (`Id`, `KlasaId`, `SemestrId`) VALUES
(1, 1, 3),
(2, 2, 3),
(3, 3, 3),
(4, 4, 3),
(5, 5, 3),
(6, 6, 3),
(7, 7, 3),
(8, 8, 3);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przedmiotuzytkownik`
--

CREATE TABLE `przedmiotuzytkownik` (
  `PrzedmiotyId` int(11) NOT NULL,
  `UzytkownikId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `przedmiotuzytkownik`
--

INSERT INTO `przedmiotuzytkownik` (`PrzedmiotyId`, `UzytkownikId`) VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 2);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `przedmioty`
--

CREATE TABLE `przedmioty` (
  `Id` int(11) NOT NULL,
  `Nazwa` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `przedmioty`
--

INSERT INTO `przedmioty` (`Id`, `Nazwa`) VALUES
(1, 'Matematyka'),
(2, 'Fizyka'),
(3, 'Chemia'),
(4, 'Biologia'),
(5, 'Język Polski'),
(6, 'Język Niemiecki'),
(7, 'Język Angielski'),
(8, 'Religia');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `sale`
--

CREATE TABLE `sale` (
  `Id` int(11) NOT NULL,
  `Numer` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sale`
--

INSERT INTO `sale` (`Id`, `Numer`) VALUES
(1, '101'),
(2, '102'),
(3, '103'),
(4, '104'),
(5, '105'),
(6, '201'),
(7, '202'),
(8, '203'),
(9, '204'),
(10, '205'),
(11, '205B');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `semestry`
--

CREATE TABLE `semestry` (
  `Id` int(11) NOT NULL,
  `DataRozpoczecia` datetime(6) NOT NULL,
  `DataZakonczenia` datetime(6) NOT NULL,
  `Numer` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semestry`
--

INSERT INTO `semestry` (`Id`, `DataRozpoczecia`, `DataZakonczenia`, `Numer`) VALUES
(1, '2023-09-01 00:00:00.000000', '2024-06-30 00:00:00.000000', 1),
(2, '2024-09-01 00:00:00.000000', '2025-06-30 00:00:00.000000', 2),
(3, '2025-09-01 00:00:00.000000', '2026-06-30 00:00:00.000000', 3);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzytkownicy`
--

CREATE TABLE `uzytkownicy` (
  `Id` int(11) NOT NULL,
  `Imie` longtext NOT NULL,
  `Nazwisko` longtext NOT NULL,
  `Email` varchar(255) NOT NULL,
  `HasloHash` longtext NOT NULL,
  `Rola` longtext NOT NULL,
  `KlasaId` int(11) DEFAULT NULL,
  `CzyEmailPotwierdzony` tinyint(1) NOT NULL DEFAULT 0,
  `TokenWeryfikacyjny` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uzytkownicy`
--

INSERT INTO `uzytkownicy` (`Id`, `Imie`, `Nazwisko`, `Email`, `HasloHash`, `Rola`, `KlasaId`, `CzyEmailPotwierdzony`, `TokenWeryfikacyjny`) VALUES
(1, 'Administrator', 'Kowalski', 'test@test.com', 'AQAAAAIAAYagAAAAEKzYHqiDQTdJQAfix53EEDql6AI0niOq1FKmYeluX0LrMqK1fVd1d/dlFPekqxZIfw==', 'Administrator', NULL, 1, NULL),
(2, 'Nauczyciel', 'Kowalski', 'test1@test.com', 'AQAAAAIAAYagAAAAEA8pFslbCVSorrYG/AODEYf2buB1YclMdfBaqsevhp/uyKWY286Udcu9SkMtBditcg==', 'Nauczyciel', NULL, 1, NULL),
(3, 'Uczeń_1', 'Kowalski', 'test2@test.com', 'AQAAAAIAAYagAAAAEK6JPlrfBO5hKpTIC4y6v8ulEXTWSZFzl/F3tB3EvwUHBXXp6Zu+lvh8z72mqn2TtQ==', 'Uczen', 1, 1, NULL),
(4, 'Uczeń_2', 'Kowalski', 'test3@test.com', 'AQAAAAIAAYagAAAAECor/JgZqXFSpXBCYl1n/ONUKOm6aDiXOPVMIlEAAB3BXizhsmb68rYgwowKaaorvA==', 'Uczen', 1, 1, NULL),
(5, 'Uczeń_3', 'Kowalski', 'test4@test.com', 'AQAAAAIAAYagAAAAELdKUvodmFiV/8gC9J3IkCawu+33LNIwAuAd45wAj5FipauefWKwQdW2GygPusQV/A==', 'Uczen', 5, 1, NULL),
(6, 'Uczeń_4', 'Kowalski', 'test5@test.com', 'AQAAAAIAAYagAAAAEJijjYAnDb9hDGHdupJqPZ0oJVOBIIne+AS+pOmZTVxYUvlY/4qmmUWX0HNO/NLSpA==', 'Uczen', 5, 1, NULL),
(7, 'Uczeń_5', 'Kowalski', 'test6@test.com', 'AQAAAAIAAYagAAAAELJQ6M2siUZN+/7jsNpo3Luy51I0bZKgW5tNxGZ1iDon8sPZz5fp/RJlRLbRWTpqCQ==', 'Uczen', 5, 1, NULL),
(8, 'Rodzic', 'Kowalski', 'test7@test.com', 'AQAAAAIAAYagAAAAEBW+SU8bXhi5gzJpT81Fa9tL/Qfg/wZ5MjXuZ0Cx4Y8chIFDeKO7yYkS5v+UQf+Z8Q==', 'Rodzic', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `wiadomosci`
--

CREATE TABLE `wiadomosci` (
  `Id` int(11) NOT NULL,
  `NadawcaId` int(11) NOT NULL,
  `OdbiorcaId` int(11) NOT NULL,
  `Tresc` longtext NOT NULL,
  `DataWyslania` datetime(6) NOT NULL,
  `Przeczytana` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `zadania`
--

CREATE TABLE `zadania` (
  `Id` int(11) NOT NULL,
  `DataOddania` datetime(6) NOT NULL,
  `Opis` longtext NOT NULL,
  `Tytul` longtext NOT NULL,
  `NauczycielId` int(11) NOT NULL,
  `PrzedmiotId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `zajecia`
--

CREATE TABLE `zajecia` (
  `Id` int(11) NOT NULL,
  `GodzinaRozpoczecia` longtext NOT NULL,
  `GodzinaZakonczenia` longtext NOT NULL,
  `PlanId` int(11) NOT NULL,
  `PrzedmiotId` int(11) NOT NULL,
  `NauczycielId` int(11) NOT NULL,
  `SalaId` int(11) NOT NULL,
  `DzienTygodnia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `zajecia`
--

INSERT INTO `zajecia` (`Id`, `GodzinaRozpoczecia`, `GodzinaZakonczenia`, `PlanId`, `PrzedmiotId`, `NauczycielId`, `SalaId`, `DzienTygodnia`) VALUES
(1, '08:00', '08:45', 1, 1, 2, 1, 1),
(2, '08:00', '08:45', 1, 4, 2, 11, 3),
(3, '08:55', '09:40', 1, 2, 2, 11, 1),
(4, '09:50', '10:35', 1, 5, 2, 5, 2),
(5, '11:40', '12:25', 1, 6, 2, 8, 5),
(6, '10:45', '11:30', 1, 8, 2, 5, 2),
(7, '08:00', '08:45', 5, 4, 2, 3, 1),
(8, '08:55', '09:40', 5, 3, 2, 7, 2),
(9, '09:50', '10:35', 5, 2, 2, 9, 3),
(10, '10:45', '11:30', 5, 1, 2, 2, 4),
(11, '11:40', '12:25', 5, 5, 2, 3, 5),
(12, '12:50', '13:35', 5, 8, 2, 3, 4),
(13, '13:45', '14:30', 5, 7, 2, 9, 3),
(14, '14:40', '15:25', 5, 6, 2, 3, 2),
(15, '15:35', '16:20', 5, 3, 2, 3, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `__efmigrationshistory`
--

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20251026212509_InitialCreate', '9.0.9'),
('20251101142942_EmailVerification', '9.0.9'),
('20251130221505_addDayOfWeek', '9.0.9'),
('20251214192004_EmailAdded', '9.0.9'),
('20251216175924_KlasaFix', '9.0.9'),
('20251218104921_UzytkownikUpdate', '9.0.9'),
('20251218125757_UzytkownikUpdate2', '9.0.9'),
('20260106125907_DaysofWeekFix', '9.0.9'),
('20260109174825_Wiadomosci', '9.0.9');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `frekwencje`
--
ALTER TABLE `frekwencje`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Frekwencje_UczenId` (`UczenId`),
  ADD KEY `IX_Frekwencje_ZajeciaId` (`ZajeciaId`);

--
-- Indeksy dla tabeli `klasauzytkownik`
--
ALTER TABLE `klasauzytkownik`
  ADD PRIMARY KEY (`KlasyId`,`UzytkownikId`),
  ADD KEY `IX_KlasaUzytkownik_UzytkownikId` (`UzytkownikId`);

--
-- Indeksy dla tabeli `klasy`
--
ALTER TABLE `klasy`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Klasy_WychowawcaId` (`WychowawcaId`);

--
-- Indeksy dla tabeli `oceny`
--
ALTER TABLE `oceny`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Oceny_NauczycielId` (`NauczycielId`),
  ADD KEY `IX_Oceny_PrzedmiotId` (`PrzedmiotId`),
  ADD KEY `IX_Oceny_UczenId` (`UczenId`);

--
-- Indeksy dla tabeli `opieka`
--
ALTER TABLE `opieka`
  ADD PRIMARY KEY (`RodzicId`,`UczenId`),
  ADD KEY `IX_Opieka_UczenId` (`UczenId`);

--
-- Indeksy dla tabeli `plany`
--
ALTER TABLE `plany`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Plany_KlasaId` (`KlasaId`),
  ADD KEY `IX_Plany_SemestrId` (`SemestrId`);

--
-- Indeksy dla tabeli `przedmiotuzytkownik`
--
ALTER TABLE `przedmiotuzytkownik`
  ADD PRIMARY KEY (`PrzedmiotyId`,`UzytkownikId`),
  ADD KEY `IX_PrzedmiotUzytkownik_UzytkownikId` (`UzytkownikId`);

--
-- Indeksy dla tabeli `przedmioty`
--
ALTER TABLE `przedmioty`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `sale`
--
ALTER TABLE `sale`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `semestry`
--
ALTER TABLE `semestry`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Uzytkownicy_Email` (`Email`),
  ADD KEY `IX_Uzytkownicy_KlasaId` (`KlasaId`);

--
-- Indeksy dla tabeli `wiadomosci`
--
ALTER TABLE `wiadomosci`
  ADD PRIMARY KEY (`Id`);

--
-- Indeksy dla tabeli `zadania`
--
ALTER TABLE `zadania`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Zadania_NauczycielId` (`NauczycielId`),
  ADD KEY `IX_Zadania_PrzedmiotId` (`PrzedmiotId`);

--
-- Indeksy dla tabeli `zajecia`
--
ALTER TABLE `zajecia`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Zajecia_NauczycielId` (`NauczycielId`),
  ADD KEY `IX_Zajecia_PlanId` (`PlanId`),
  ADD KEY `IX_Zajecia_PrzedmiotId` (`PrzedmiotId`),
  ADD KEY `IX_Zajecia_SalaId` (`SalaId`);

--
-- Indeksy dla tabeli `__efmigrationshistory`
--
ALTER TABLE `__efmigrationshistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `frekwencje`
--
ALTER TABLE `frekwencje`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `klasy`
--
ALTER TABLE `klasy`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `oceny`
--
ALTER TABLE `oceny`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `plany`
--
ALTER TABLE `plany`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `przedmioty`
--
ALTER TABLE `przedmioty`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sale`
--
ALTER TABLE `sale`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `semestry`
--
ALTER TABLE `semestry`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `wiadomosci`
--
ALTER TABLE `wiadomosci`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zadania`
--
ALTER TABLE `zadania`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zajecia`
--
ALTER TABLE `zajecia`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `frekwencje`
--
ALTER TABLE `frekwencje`
  ADD CONSTRAINT `FK_Frekwencje_Uzytkownicy_UczenId` FOREIGN KEY (`UczenId`) REFERENCES `uzytkownicy` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Frekwencje_Zajecia_ZajeciaId` FOREIGN KEY (`ZajeciaId`) REFERENCES `zajecia` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `klasauzytkownik`
--
ALTER TABLE `klasauzytkownik`
  ADD CONSTRAINT `FK_KlasaUzytkownik_Klasy_KlasyId` FOREIGN KEY (`KlasyId`) REFERENCES `klasy` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_KlasaUzytkownik_Uzytkownicy_UzytkownikId` FOREIGN KEY (`UzytkownikId`) REFERENCES `uzytkownicy` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `klasy`
--
ALTER TABLE `klasy`
  ADD CONSTRAINT `FK_Klasy_Uzytkownicy_WychowawcaId` FOREIGN KEY (`WychowawcaId`) REFERENCES `uzytkownicy` (`Id`);

--
-- Constraints for table `oceny`
--
ALTER TABLE `oceny`
  ADD CONSTRAINT `FK_Oceny_Przedmioty_PrzedmiotId` FOREIGN KEY (`PrzedmiotId`) REFERENCES `przedmioty` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Oceny_Uzytkownicy_NauczycielId` FOREIGN KEY (`NauczycielId`) REFERENCES `uzytkownicy` (`Id`),
  ADD CONSTRAINT `FK_Oceny_Uzytkownicy_UczenId` FOREIGN KEY (`UczenId`) REFERENCES `uzytkownicy` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `opieka`
--
ALTER TABLE `opieka`
  ADD CONSTRAINT `FK_Opieka_Uzytkownicy_RodzicId` FOREIGN KEY (`RodzicId`) REFERENCES `uzytkownicy` (`Id`),
  ADD CONSTRAINT `FK_Opieka_Uzytkownicy_UczenId` FOREIGN KEY (`UczenId`) REFERENCES `uzytkownicy` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `plany`
--
ALTER TABLE `plany`
  ADD CONSTRAINT `FK_Plany_Klasy_KlasaId` FOREIGN KEY (`KlasaId`) REFERENCES `klasy` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Plany_Semestry_SemestrId` FOREIGN KEY (`SemestrId`) REFERENCES `semestry` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `przedmiotuzytkownik`
--
ALTER TABLE `przedmiotuzytkownik`
  ADD CONSTRAINT `FK_PrzedmiotUzytkownik_Przedmioty_PrzedmiotyId` FOREIGN KEY (`PrzedmiotyId`) REFERENCES `przedmioty` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_PrzedmiotUzytkownik_Uzytkownicy_UzytkownikId` FOREIGN KEY (`UzytkownikId`) REFERENCES `uzytkownicy` (`Id`) ON DELETE CASCADE;

--
-- Constraints for table `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  ADD CONSTRAINT `FK_Uzytkownicy_Klasy_KlasaId` FOREIGN KEY (`KlasaId`) REFERENCES `klasy` (`Id`);

--
-- Constraints for table `zadania`
--
ALTER TABLE `zadania`
  ADD CONSTRAINT `FK_Zadania_Przedmioty_PrzedmiotId` FOREIGN KEY (`PrzedmiotId`) REFERENCES `przedmioty` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Zadania_Uzytkownicy_NauczycielId` FOREIGN KEY (`NauczycielId`) REFERENCES `uzytkownicy` (`Id`);

--
-- Constraints for table `zajecia`
--
ALTER TABLE `zajecia`
  ADD CONSTRAINT `FK_Zajecia_Plany_PlanId` FOREIGN KEY (`PlanId`) REFERENCES `plany` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Zajecia_Przedmioty_PrzedmiotId` FOREIGN KEY (`PrzedmiotId`) REFERENCES `przedmioty` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Zajecia_Sale_SalaId` FOREIGN KEY (`SalaId`) REFERENCES `sale` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Zajecia_Uzytkownicy_NauczycielId` FOREIGN KEY (`NauczycielId`) REFERENCES `uzytkownicy` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
