<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDebutFinIsSaisonnierColonneToCpromosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('cpromos', function (Blueprint $table) {
            //
            $table->date('debut')->nullable();
            $table->date('fin')->nullable();
            $table->boolean('isSaisonnier')->default(0);
            $table->dropColumn('studio_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('cpromos', function (Blueprint $table) {
            //
        });
    }
}
