-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.6-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for companydirectory
CREATE DATABASE IF NOT EXISTS `companydirectory` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `companydirectory`;

-- Dumping structure for table companydirectory.department
CREATE TABLE IF NOT EXISTS `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `locationID` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table companydirectory.department: ~12 rows (approximately)
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` (`id`, `name`, `locationID`) VALUES
	(1, 'Human Resources', 1),
	(2, 'Sales', 2),
	(3, 'Marketing', 2),
	(4, 'Legal', 1),
	(5, 'Services', 1),
	(6, 'Research and Development', 3),
	(7, 'Product Management', 3),
	(8, 'Training', 4),
	(9, 'Support', 4),
	(10, 'Engineering', 5),
	(11, 'Accounting', 5),
	(12, 'Business Development', 3);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;

-- Dumping structure for table companydirectory.location
CREATE TABLE IF NOT EXISTS `location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table companydirectory.location: ~4 rows (approximately)
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` (`id`, `name`) VALUES
	(1, 'London'),
	(2, 'New York'),
	(3, 'Paris'),
	(4, 'Munich'),
	(5, 'Rome');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;

-- Dumping structure for table companydirectory.personnel
CREATE TABLE IF NOT EXISTS `personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `jobTitle` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `isAvailable` boolean DEFAULT TRUE,
  `experience` tinyint DEFAULT 0,
  `expertise` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `biography` varchar(300) DEFAULT NULL,
  `departmentID` int(11) DEFAULT NULL,
  `avatar` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table companydirectory.personnel: ~100 rows (approximately)
/*!40000 ALTER TABLE `personnel` DISABLE KEYS */;
INSERT INTO `personnel` (`id`, `firstName`, `lastName`, `jobTitle`, `email`, `departmentID`, `isAvailable`, `experience`, `expertise`, `phone`, `biography`, `avatar`) VALUES
	(1, 'Rosana', 'Heffron', '', 'rheffron0@ibm.com', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar1.jpg"),
	(2, 'Kris', 'Kovnot', '', 'kkovnot1@google.nl', 2, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar2.jpg"),
	(3, 'Vera', 'Kisbee', '', 'vkisbee2@nih.gov', 2, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar3.jpg"),
	(4, 'Aveline', 'Edgson', '', 'aedgson3@wikispaces.com', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar4.jpg"),
	(5, 'Bertie', 'Wittke', '', 'bwittke4@yahoo.com', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar5.jpeg"),
	(6, 'Demetre', 'Cossam', '', 'dcossam5@washington.edu', 5, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar6.jpg"),
	(7, 'Annabela', 'McGavigan', '', 'amcgavigan6@wp.com', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar7.jpg"),
	(8, 'Crichton', 'McAndrew', '', 'cmcandrew7@zdnet.com', 1, FALSE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar8.jpg"),
	(9, 'Cordula', 'Plain', '', 'cplain8@google.ca', 5, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar9.jpg"),
	(10, 'Glen', 'McDougle', '', 'gmcdougle9@meetup.com', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar10.jpg"),
	(11, 'Theo', 'Audas', '', 'taudasa@newsvine.com', 7, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar11.jpg"),
	(12, 'Spense', 'Jolliss', '', 'sjollissb@wufoo.com', 8, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar12.jpg"),
	(13, 'Leopold', 'Carl', '', 'lcarlc@paginegialle.it', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar13.jpg"),
	(14, 'Barr', 'MacAllan', '', 'bmacalland@github.com', 5, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar14.jpeg"),
	(15, 'Suzie', 'Cromer', '', 'scromere@imageshack.us', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar15.jpg"),
	(16, 'Tracee', 'Gisbourn', '', 'tgisbournf@bloglines.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar16.jpg"),
	(17, 'Taylor', 'St. Quintin', '', 'tstquinting@chronoengine.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar17.jpg"),
	(18, 'Lin', 'Klassmann', '', 'lklassmannh@indiatimes.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar18.jpg"),
	(19, 'Lay', 'Fintoph', '', 'lfintophi@goo.gl', 11, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar19.jpg"),
	(20, 'Moishe', 'Flinn', '', 'mflinnj@list-manage.com', 12, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar20.jpg"),
	(21, 'Gay', 'Bickford', '', 'gbickfordk@scientificamerican.com', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar21.jpeg"),
	(22, 'Erik', 'Lindback', '', 'elindbackl@virginia.edu', 8, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar22.jpg"),
	(23, 'Tamarra', 'Ace', '', 'tacem@vinaora.com', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar23.jpg"),
	(24, 'Barbara-anne', 'Rooksby', '', 'brooksbyn@issuu.com', 12, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar24.jpeg"),
	(25, 'Lucien', 'Allsup', '', 'lallsupo@goo.ne.jp', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar25.jpg"),
	(26, 'Jackelyn', 'Imlach', '', 'jimlachp@google.it', 11, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar26.jpg"),
	(27, 'Virge', 'Bootes', '', 'vbootesq@oracle.com', 2, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar27.jpg"),
	(28, 'Rafferty', 'Matasov', '', 'rmatasovr@4shared.com', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar28.jpg"),
	(29, 'Vanya', 'Goulder', '', 'vgoulders@phoca.cz', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar29.jpg"),
	(30, 'Bonita', 'McGonagle', '', 'bmcgonaglet@microsoft.com', 1, FALSE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar30.jpeg"),
	(31, 'Allx', 'Whaley', '', 'awhaleyu@bbb.org', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar31.jpg"),
	(32, 'Mavis', 'Lernihan', '', 'mlernihanv@netscape.com', 5, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar32.jpg"),
	(33, 'Vern', 'Durling', '', 'vdurlingw@goo.gl', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar33.jpg"),
	(34, 'Myles', 'Minchi', '', 'mminchix@smugmug.com', 7, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar34.jpg"),
	(35, 'Anitra', 'Coleridge', '', 'acoleridgey@nbcnews.com', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar35.jpg"),
	(36, 'Ailis', 'Brewster', '', 'abrewsterz@businesswire.com', 7, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar36.jpg"),
	(37, 'Rahal', 'Tute', '', 'rtute10@pinterest.com', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar37.jpg"),
	(38, 'Warner', 'Blonden', '', 'wblonden11@spiegel.de', 12, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar38.jpg"),
	(39, 'Melvyn', 'Canner', '', 'mcanner12@eepurl.com', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar39.jpg"),
	(40, 'Ryann', 'Giampietro', '', 'rgiampietro13@theguardian.com', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar40.jpg"),
	(41, 'Harwell', 'Jefferys', '', 'hjefferys14@jimdo.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar41.jpg"),
	(42, 'Lanette', 'Buss', '', 'lbuss15@51.la', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar42.jpg"),
	(43, 'Lissie', 'Reddington', '', 'lreddington16@w3.org', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar43.jpg"),
	(44, 'Dore', 'Braidford', '', 'dbraidford17@google.com.br', 11, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar44.jpeg"),
	(45, 'Lizabeth', 'Di Franceshci', '', 'ldifranceshci18@mediafire.com', 8, FALSE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar45.jpg"),
	(46, 'Felic', 'Sharland', '', 'fsharland19@myspace.com', 12, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar46.jpg"),
	(47, 'Duff', 'Quail', '', 'dquail1a@vimeo.com', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar47.jpg"),
	(48, 'Brendis', 'Shivell', '', 'bshivell1b@un.org', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar48.jpg"),
	(49, 'Nevile', 'Schimaschke', '', 'nschimaschke1c@hexun.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar49.jpg"),
	(50, 'Jon', 'Calbaithe', '', 'jcalbaithe1d@netvibes.com', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar50.jpg"),
	(51, 'Emmery', 'Darben', '', 'edarben1e@mapquest.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar51.jpg"),
	(52, 'Staford', 'Whitesel', '', 'swhitesel1f@nasa.gov', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar52.jpg"),
	(53, 'Benjamin', 'Hawkslee', '', 'bhawkslee1g@hubpages.com', 7, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar53.jpg"),
	(54, 'Myrle', 'Speer', '', 'mspeer1h@tripod.com', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar54.jpg"),
	(55, 'Matthus', 'Banfield', '', 'mbanfield1i@angelfire.com', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar55.png"),
	(56, 'Annadiana', 'Drance', '', 'adrance1j@omniture.com', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar56.jpg"),
	(57, 'Rinaldo', 'Fandrey', '', 'rfandrey1k@bbc.co.uk', 2, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar57.jpg"),
	(58, 'Roanna', 'Standering', '', 'rstandering1l@cocolog-nifty.com', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar58.jpg"),
	(59, 'Lorrie', 'Fattorini', '', 'lfattorini1m@geocities.jp', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar59.jpeg"),
	(60, 'Talbot', 'Andrassy', '', 'tandrassy1n@bigcartel.com', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/avatar60.jpg"),
	(61, 'Cindi', 'Mannion', '', 'comannion1o@ameblo.jp', 11, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(62, 'Pancho', 'Mullineux', '', 'pmullineux1p@webmd.com', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(63, 'Cynthy', 'Peyntue', '', 'cpeyntue1q@amazon.co.jp', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(64, 'Kristine', 'Christal', '', 'kchristal1r@behance.net', 8, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(65, 'Dniren', 'Reboulet', '', 'dreboulet1s@360.cn', 7, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(66, 'Aggy', 'Napier', '', 'anapier1t@sciencedirect.com', 3, FALSE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(67, 'Gayleen', 'Hessay', '', 'ghessay1u@exblog.jp', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(68, 'Cull', 'Snoden', '', 'csnoden1v@so-net.ne.jp', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(69, 'Vlad', 'Crocombe', '', 'vcrocombe1w@mtv.com', 7, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(70, 'Georgeanna', 'Joisce', '', 'gjoisce1x@google.com.au', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(71, 'Ursola', 'Berthomieu', '', 'uberthomieu1y@un.org', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(72, 'Mair', 'McKirdy', '', 'mmckirdy1z@ovh.net', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(73, 'Erma', 'Runnalls', '', 'erunnalls20@spiegel.de', 8, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(74, 'Heida', 'Gallone', '', 'hgallone21@hostgator.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(75, 'Christina', 'Denge', '', 'cdenge22@canalblog.com', 12, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(76, 'Wilone', 'Fredi', '', 'wfredi23@gizmodo.com', 7, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(77, 'Stormie', 'Bolderstone', '', 'sbolderstone24@globo.com', 11, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(78, 'Darryl', 'Pool', '', 'dpool25@vistaprint.com', 11, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(79, 'Nikolas', 'Mager', '', 'nmager26@nifty.com', 5, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(80, 'Brittney', 'Gaskal', '', 'bgaskal27@weather.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(81, 'Field', 'Gresty', '', 'fgresty28@networkadvertising.org', 4, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(82, 'Martina', 'Tremoulet', '', 'mtremoulet29@sciencedaily.com', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(83, 'Robena', 'Ivanyutin', '', 'rivanyutin2a@mozilla.org', 2, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(84, 'Reagen', 'Corner', '', 'rcorner2b@qq.com', 11, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(85, 'Eveleen', 'Sulter', '', 'esulter2c@nature.com', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(86, 'Christy', 'Dunbobbin', '', 'cdunbobbin2d@feedburner.com', 8, FALSE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(87, 'Winthrop', 'Lansley', '', 'wlansley2e@alibaba.com', 8, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(88, 'Lissa', 'Insley', '', 'linsley2f@friendfeed.com', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(89, 'Shell', 'Risebarer', '', 'srisebarer2g@patch.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(90, 'Cherianne', 'Liddyard', '', 'cliddyard2h@com.com', 2, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(91, 'Brendan', 'Fooks', '', 'bfooks2i@utexas.edu', 2, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(92, 'Edmund', 'Tace', '', 'etace2j@hatena.ne.jp', 9, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(93, 'Ki', 'Tomasini', '', 'ktomasini2k@cnbc.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(94, 'Chadd', 'McGettrick', '', 'cmcgettrick2l@simplemachines.org', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(95, 'Dulcie', 'Baudi', '', 'dbaudi2m@last.fm', 3, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(96, 'Barnebas', 'Mowbray', '', 'bmowbray2n@cbslocal.com', 1, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(97, 'Stefanie', 'Anker', '', 'sanker2o@hud.gov', 5, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(98, 'Cherye', 'de Cullip', '', 'cdecullip2p@loc.gov', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(99, 'Sinclare', 'Deverall', '', 'sdeverall2q@ow.ly', 6, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg"),
	(100, 'Shae', 'Johncey', '', 'sjohncey2r@bluehost.com', 10, TRUE, 1, "", "07726384729", "", "https://directory-avatars.s3-eu-west-1.amazonaws.com/noavatar.jpg");
/*!40000 ALTER TABLE `personnel` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
