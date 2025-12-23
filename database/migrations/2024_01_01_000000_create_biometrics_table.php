<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('biometrics', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id');
            $table->string('biometric_data');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('biometrics');
    }
}; 