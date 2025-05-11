# candynice


# créer les repertoire
# installer react 

## npx create-react-app frontend

# installer symfony
## docker-compose run --rm backend composer create-project symfony/skeleton .

# lancer les container 
## docker-compose up --build

# rentrer dans un container
# docker exec -it <nom_du_conteneur> bash

# redemarrer un container
## docker-compose restart react-frontend-candynice

# installer doctrine
## docker-compose exec symfony-backend-candynice composer require symfony/orm-pack
## docker-compose exec symfony-backend-candynice composer require doctrine/doctrine-migrations-bundle
## docker-compose exec symfony-backend-candynice composer require symfony/maker-bundle --dev

## entrer dans le container 
#  docker exec -it db-candynice mysql -u candynice123 -p


# migrer les entity
## docker-compose exec symfony-backend-candynice php bin/console make:migration
## docker-compose exec symfony-backend-candynice php bin/console doctrine:migrations:migrate


# installer jwt pour l'authentifaication
## composer require lexik/jwt-authentication-bundle
## composer require symfony/security-core
## creer les clés jwt
# mkdir -p config/jwt
# openssl genpkey -algorithm RSA -out config/jwt/private.pem -pkeyopt rsa_keygen_bits:2048
# openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem



#
##






## cloner le repos depuis guithub 
### Si vous travaillez régulièrement avec GitHub, SSH est plus simple :

### Dans votre terminal :
### ssh-keygen -t ed25519 -C "your_email@example.com"
### (Appuyez sur Entrée pour accepter les valeurs par défaut)
### Ajoutez ensuite votre clé SSH publique à GitHub :
### cat ~/.ssh/id_ed25519.pub
### Copiez la sortie et ajoutez-la dans GitHub > Paramètres > Clés SSH et GPG > Nouvelle clé SSH .
### Cloner en utilisant SSH à la place :
### frapper
### git clone git@github.com:Ahlammamoun/candynice.git 
### Appuyez simplement sur Entrée pour accepter le chemin par défaut ( /home/ahlam/.ssh/id_ed25519).
### Votre clé SSH sera alors créée à l'emplacement habituel.
###  Copiez votre clé SSH publique
### Exécutez cette commande pour afficher votre clé publique :
### cat ~/.ssh/id_ed25519.pub
### 2. Ajoutez la clé SSH à GitHub
### Accédez à GitHub → Paramètres → Clés SSH et GPG
### Cliquez sur « Nouvelle clé SSH »
### Titre : (n'importe quel nom, comme « Ordinateur portable »)
### Clé : Collez la clé que vous venez de copier
### Cliquez sur « Ajouter une clé SSH »
### Essayez maintenant de cloner en utilisant SSH :
### git clone git@github.com:Ahlammamoun/candynice.git
###
###
###
##
