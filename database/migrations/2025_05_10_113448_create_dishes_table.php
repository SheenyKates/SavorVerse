<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('dishes', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->foreignId('category_id')->constrained();
        $table->text('ingredients')->nullable();
        $table->text('procedure')->nullable();
        $table->timestamps();
    });
}

public function down()
{
    Schema::dropIfExists('dishes');
}

};
