CREATE DATABASE IF NOT EXISTS `MUSEUMDB`; 
USE `MUSEUMDB`;

--

DROP TABLE IF EXISTS `history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `history` (
  `artwork_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  PRIMARY KEY (`artwork_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;