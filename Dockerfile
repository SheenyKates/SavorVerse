# Use official PHP with FPM (FastCGI Process Manager)
FROM php:8.3-fpm

# Install system dependencies and nginx
RUN apt-get update && apt-get install -y \
    git zip unzip libzip-dev libpng-dev libonig-dev nginx supervisor && \
    docker-php-ext-install pdo pdo_mysql zip mbstring gd

# Set working directory
WORKDIR /var/www/html

# Copy app files
COPY . .

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set permissions for Laravel
RUN chown -R www-data:www-data /var/www/html && chmod -R 775 storage bootstrap/cache

# Copy nginx and supervisord configurations
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./supervisord.conf /etc/supervisord.conf

# Expose port 80 for web traffic
EXPOSE 80

# Start both nginx and php-fpm using supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
