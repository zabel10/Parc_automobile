FROM php:8.2-cli

# Installation des prérequis et de l'extension PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définition du dossier de travail
WORKDIR /app

# Copie de tout votre code backend
COPY . .

# Installation des dépendances Laravel
RUN composer install --optimize-autoloader --no-dev

# Commande de démarrage pour Render
CMD php artisan config:clear && php artisan cache:clear && php -S 0.0.0.0:$PORT -t public