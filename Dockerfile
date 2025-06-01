# Use official PHP-Apache image
FROM php:8.2-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install system dependencies
RUN apt-get update --allow-releaseinfo-change && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage bootstrap/cache

# Set Apache public folder
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/public|g' /etc/apache2/sites-available/000-default.conf \
    && echo '<Directory /var/www/public>\nOptions Indexes FollowSymLinks\nAllowOverride All\nRequire all granted\n</Directory>' >> /etc/apache2/apache2.conf

# Expose port (Render dynamically sets $PORT)
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]

