<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250428180823 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        // Modification de la colonne roles pour la rendre NOT NULL sans valeur par défaut
        $this->addSql(<<<'SQL'
            ALTER TABLE user CHANGE roles roles JSON NOT NULL
        SQL);
    }
    
    public function down(Schema $schema): void
    {
        // Annuler la migration, revenir à l'état précédent
        $this->addSql(<<<'SQL'
            ALTER TABLE user CHANGE roles roles JSON DEFAULT NULL
        SQL);
    }
    

}
