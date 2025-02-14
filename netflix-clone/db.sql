-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 14, 2025 at 11:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pap`
--

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `uploads` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `is_home_game` tinyint(1) NOT NULL,
  `country` varchar(255) DEFAULT NULL,
  `opponent` varchar(255) NOT NULL,
  `league` varchar(255) NOT NULL,
  `result` varchar(50) NOT NULL,
  `thumbnail_path` varchar(255) NOT NULL,
  `video_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uploads`
--

INSERT INTO `uploads` (`id`, `title`, `is_home_game`, `country`, `opponent`, `league`, `result`, `thumbnail_path`, `video_path`, `created_at`) VALUES
(12, '12', 1, NULL, '21', 'Champions', 'Vitória', '/content/12/DSC01454.JPG', '/content/12/C0100.MP4', '2025-02-13 16:28:03'),
(13, 'Teste', 1, NULL, 'GTes', 'Champions', 'Vitória', '/content/Teste/DSC01116.JPG', '/content/Teste/C0101.MP4', '2025-02-13 16:56:23'),
(14, 'ASDASDAS', 0, 'Itália', 'SCP', 'Liga Europa', 'Vitória', '/content/ASDASDAS/P1000365.JPG', '/content/ASDASDAS/C0101.MP4', '2025-02-13 17:18:27'),
(15, 'Teste Porto', 0, 'Espanha', 'Porto', 'Taça de Portugal', 'Derrota', '/content/Teste Porto/P1000366.JPG', '/content/Teste Porto/C0100.MP4', '2025-02-13 17:20:29'),
(16, '1234', 1, NULL, 'Sodi', 'Champions', 'Vitória', '/content/1234/DSC01454.JPG', '/content/1234/C0100.MP4', '2025-02-13 17:32:11'),
(17, '1231231', 1, NULL, '13131', 'Champions', 'Vitória', '/content/1231231/Screenshot 2025-01-07 153708.png', '/content/1231231/Mvi 9474.mp4', '2025-02-13 17:32:43'),
(18, 'asdadad', 1, NULL, '31313131', 'Champions', 'Vitória', '/content/asdadad/WhatsApp Image 2024-12-06 at 22.25.04.jpeg', '/content/asdadad/CAM00400.mp4', '2025-02-13 17:33:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(5, 'adminpimpi', 'adminpimpi@gmail.com', '$2b$10$ep4iwFqPpruRGnSEy8r7O.Rsi1XJ5cMz4hXTn72YLfT0DsyqTOT12', 'admin', '2025-02-11 22:08:43'),
(6, 'armando', 'armando123@GMAIL.COM', '$2b$10$e3kBtyjcMSgSvajpnluN4OY9d6hB.vPnR4Fs/erLkPVd.pzy.9LHm', 'user', '2025-02-11 22:20:17'),
(7, 'gabrielp', 'europeu.rafa@gmail.com', '$2b$10$XqSgJcvcQReR3D3pGE2hqODHF2ItrjwJDlCcnWVLrIhx9TvAZcDRy', 'user', '2025-02-12 01:22:43'),
(8, 'Superman', 'super@gmail.com', '$2b$10$gpXB62xRoYIi0B0qmzVCPuw.vZ3LjZuUOry4pfD.WY95kiXyhfmMC', 'user', '2025-02-12 08:50:55'),
(9, 'gabrielpimenta', 'gabrielpimenta@gmail.com', '$2b$10$coXxYNFJpla9p6zLklY/QeD02AmSP.FsBQmJR7NRBSUqRZ1vAXWvG', 'user', '2025-02-12 08:51:50'),
(10, 'Fazendinha', 'fazenda@gmail.com', '$2b$10$aosuvv1AH.LP/sSIqNQDxeDLQTEaKSgjl./jCOLBE6eY/2PhWiElm', 'user', '2025-02-13 15:44:05'),
(11, 'user', 'user@user.com', '$2b$10$hpD56lQxtA3s.L0O4CL7m.T7X6YbXNA.UFfuMfvhSlVuw3QgWTNsy', 'user', '2025-02-13 17:15:01'),
(12, 'teste123', 'teste123@gmail.com', '$2b$10$PVOwcN62G/Vh3zdWHCL2xuTwFR8iaLVRzP7GZAdAToOJlzxe.Capy', 'user', '2025-02-14 10:11:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
