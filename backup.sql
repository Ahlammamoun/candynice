-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: candynice
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_64C19C1727ACA70` (`parent_id`),
  CONSTRAINT `FK_64C19C1727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Candy1','candy1',24),(2,'Grocery','grocery',NULL),(3,'Sucettes','sucettes',24),(4,'Chocolats','chocolats',24),(5,'Caramels','caramels',24),(6,'Gums','gums',24),(7,'Sucettes acidules','sucettes-acidulees',24),(8,'Boulangerie','boulangerie',2),(9,'Produits Laitiers','produits-laitiers',2),(10,'picerie fine','epicerie-fine',2),(11,'Dragibus','dragibus',24),(12,'Pte de Fruits','pate-fruits',24),(13,'Guimauve','guimauve',24),(14,'Rglisse','reglisse',24),(15,'Nougat','nougat',24),(16,'picerie Sale','epicerie-salee',2),(17,'Conserves','conserves',2),(18,'Huiles & Vinaigres','huiles-vinaigres',2),(19,'Ptes & Riz','pates-riz',2),(20,'Tartinables','tartinables',2),(24,'candy','candy',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20250426122015','2025-04-26 12:20:26',20),('DoctrineMigrations\\Version20250426123632','2025-04-26 12:36:46',291),('DoctrineMigrations\\Version20250426130835','2025-04-26 13:08:46',123),('DoctrineMigrations\\Version20250427152310','2025-04-27 15:23:32',29),('DoctrineMigrations\\Version20250428130309','2025-04-28 13:03:29',66),('DoctrineMigrations\\Version20250428132134','2025-04-28 13:21:40',81),('DoctrineMigrations\\Version20250428174137','2025-04-28 17:42:08',21);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `total_price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_F5299398A76ED395` (`user_id`),
  CONSTRAINT `FK_F5299398A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `commande_id` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_52EA1F094584665A` (`product_id`),
  KEY `IDX_52EA1F0982EA2E54` (`commande_id`),
  CONSTRAINT `FK_52EA1F094584665A` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `FK_52EA1F0982EA2E54` FOREIGN KEY (`commande_id`) REFERENCES `order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock` int NOT NULL,
  `region` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_D34A04AD12469DE2` (`category_id`),
  CONSTRAINT `FK_D34A04AD12469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,3,'Bonbon Fraise d\'espagne','Délicieux bonbon à la fraise d\'espagne',2.5,'bonbon_fraise.jpg',100,'france'),(2,3,'Sucette Fraise','Délicieuse sucette goût fraise',1.5,'sucette_fraise.jpg',100,''),(3,4,'Chocolat Noir','Chocolat noir 70% cacao',2.8,'chocolat_noir.jpg',80,''),(4,5,'Caramel Beurre Salé','Caramel artisanal au beurre salé',1.2,'caramel_beurre_sale.jpg',120,''),(5,11,'Dragibus','Bonbons fruités multicolores',2.5,'dragibus.jpg',150,''),(6,3,'Sucette Cola','Sucette goût cola',1.3,'sucette_cola.jpg',90,''),(7,12,'Pâte de Fruits','Assortiment de pâtes de fruits artisanales',3,'pate_de_fruits.jpg',60,''),(8,4,'Chocolat au Lait','Chocolat au lait crémeux',2.5,'chocolat_lait.jpg',100,''),(9,6,'Boule de Neige','Meringue au chocolat blanc',1.7,'boule_de_neige.jpg',70,''),(10,13,'Guimauve Vanille','Guimauve moelleuse parfum vanille',2.2,'guimauve_vanille.jpg',90,''),(11,3,'Sucette Pomme Verte','Sucette acidulée pomme verte',1.4,'sucette_pomme.jpg',95,''),(12,14,'Bonbons Réglisse','Bonbons à la réglisse douce',2,'bonbons_reglisse.jpg',80,''),(13,15,'Nougat','Nougat tendre aux amandes',3.5,'nougat.jpg',60,''),(14,3,'Sucette Tropicale','Sucette exotique mangue passion',1.6,'sucette_tropicale.jpg',85,''),(15,4,'Chocolat Blanc','Chocolat blanc fondant',2.9,'/uploads/images/682224b6659a7.jpg',70,'france'),(16,3,'Sucette Multicolore','Grande sucette multicolore torsadée',2,'sucette_multicolore.jpg',50,''),(17,NULL,'Lollipop Rainbow','Sucette arc-en-ciel géante',2.99,'lollipop.jpg',50,''),(22,16,'Tapenade Noire','Tapenade artisanale d\'olives noires',4.5,'tapenade-noire.jpg',100,'Provence'),(23,17,'Terrine de Canard','Terrine gourmande au canard',6.8,'terrine-canard.jpg',100,'Sud-Ouest'),(24,18,'Huile d\'Olive Extra Vierge','Huile d\'olive premire pression  froid',11.5,'huile-olive.jpg',100,'Provence'),(25,19,'Ptes Artisanales','Ptes artisanales bio',5.5,'pates-artisanales.jpg',100,'Italie'),(26,20,'Confiture de Fraises Maison','Confiture artisanale aux fraises',4.8,'confiture-fraises.jpg',100,'Normandie'),(27,10,'Confiture Artisanale Fraise','Confiture de fraises faite maison',5.9,'confiture_fraise.jpg',100,'Provence'),(28,10,'Miel de Lavande','Miel pur de lavande de Provence',7.5,'miel_lavande.jpg',80,'Provence'),(29,10,'Terrine de Sanglier','Terrine artisanale de sanglier',8.2,'terrine_sanglier.jpg',50,'Ardche'),(30,10,'Ptes aux Cpes','Ptes artisanales parfumes aux cpes',6,'pates_cepes.jpg',60,'Italie'),(31,10,'Huile d\'Olive Bio','Huile d\'olive extra vierge biologique',12.5,'huile_olive.jpg',70,'Espagne'),(32,10,'Tartinade Tomate Sche','Dlicieuse tartinade aux tomates sches',4.8,'tartinade_tomate.jpg',90,'Italie'),(33,4,'Crackers aux Herbes fine','Crackers artisanaux aux herbes de Provence',3.5,'crackers_herbes.jpg',120,'Provence'),(64,9,'cheese','cheese',2,'/uploads/images/682226ed59169.jpg',3,'cheese');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (32,'admin@gmail.com','$2y$13$mDhK9zRJ7UStac9aYDRidecYW4GCou/4KQs.b4mjKvmkDlD3wU1DO','[\"ROLE_ADMIN\"]'),(38,'user@gmail.com','$2y$13$XeFCK8pHVIKWxa4ckL.q7exnx4nOJ3qP2PE6IGDzHDVoMwKYrJIIq','[\"ROLE_USER\"]'),(39,'ahlam@gmail.com','$2y$13$tr9rT6OjqJ11ZYIzSQ4w1O2zgS7v8pplJQqgLWot.eWj40ZgEgrjS','[\"ROLE_ADMIN\"]');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-12 17:16:51
