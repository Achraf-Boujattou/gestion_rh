<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            // Clé primaire
            $table->id();
            
            // Clés étrangères
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('leave_id')->nullable();
            
            // Colonnes de données
            $table->string('type', 50)->comment('Type de notification (leave_approved, leave_rejected, etc.)');
            $table->string('title')->comment('Titre de la notification');
            $table->text('message')->comment('Contenu de la notification');
            $table->boolean('read')->default(false)->comment('État de lecture de la notification');
            
            // Timestamps
            $table->timestamps();
            
            // Index et clés étrangères
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
                  
            $table->foreign('leave_id')
                  ->references('id')
                  ->on('leaves')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
                  
            // Index pour améliorer les performances
            $table->index('type');
            $table->index('read');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
