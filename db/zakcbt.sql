-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 03, 2020 at 04:02 AM
-- Server version: 5.1.36
-- PHP Version: 5.3.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `zakcbt`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `username` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`) VALUES
(1, 'zakcbt', 'zakcbt');

-- --------------------------------------------------------

--
-- Table structure for table `pupil_lists`
--

CREATE TABLE IF NOT EXISTS `pupil_lists` (
  `list_id` int(250) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `populated` varchar(100) NOT NULL,
  PRIMARY KEY (`list_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `pupil_lists`
--

INSERT INTO `pupil_lists` (`list_id`, `name`, `populated`) VALUES
(1, 'Primary 1', 'false'),
(2, 'Primary 2', 'true'),
(3, 'Primary 3', 'true'),
(4, 'Primary 4', 'false'),
(5, 'Primary 5', 'false'),
(6, 'Primary 6', 'false');

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE IF NOT EXISTS `tests` (
  `test_id` int(100) NOT NULL AUTO_INCREMENT,
  `title` varchar(250) NOT NULL,
  `subject` varchar(250) NOT NULL,
  `class` int(10) NOT NULL,
  `total_questions` int(100) NOT NULL,
  `Question_per_pupil` int(100) NOT NULL,
  `duration_hour` int(10) NOT NULL,
  `duration_minutes` int(100) NOT NULL,
  `date_created` date NOT NULL,
  `active` varchar(100) NOT NULL,
  `quest_added` varchar(20) NOT NULL,
  `pupil_added` varchar(20) NOT NULL,
  PRIMARY KEY (`test_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `tests`
--

