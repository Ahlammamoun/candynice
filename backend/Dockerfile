FROM php:8.1-fpm

# Installer les dépendances
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    curl \
    libssl-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring zip intl

# Installer l'extension MongoDB pour PHP
RUN pecl install mongodb-1.12.0\
    && docker-php-ext-enable mongodb

# Installer Symfony CLI (optionnel, utile surtout pour le développement)
RUN curl -sS https://get.symfony.com/cli/installer | bash \
    && mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

# Ajouter Composer comme superutilisateur
ENV COMPOSER_ALLOW_SUPERUSER=1

# Copier Composer depuis une autre image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configurer le répertoire de travail
WORKDIR /var/www/html

# Copier les fichiers du projet
COPY . .

# Installer les dépendances Symfony
RUN composer install 

# Exposer le port pour PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]


