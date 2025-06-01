# Use the official PHP-Apache image with PHP 8.2
FROM php:8.2-apache

# Enable Apache mod_rewrite 
RUN a2enmod rewrite

# Install system dependencies
RUN apt-get update && apt-get install -y unzip git curl libpng-dev libonig-dev libxml2-dev zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 storage bootstrap/cache

# Set Apache public folder
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

RUN echo '<Directory /var/www/html/public>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /etc/apache2/apache2.conf

RUN docker-php-ext-install pdo pdo_mysql

# Cache Laravel config
RUN php artisan route:cache && php artisan view:cache

# Expose port
EXPOSE 80

CMD ["apache2-foreground"]