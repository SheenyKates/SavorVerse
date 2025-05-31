<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Route::get('/debug', function () {
    try {
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('config:cache');

        $pdo = DB::connection()->getPdo();
        $dbName = DB::connection()->getDatabaseName();

        return response()->json([
            'status' => 'ok',
            'message' => 'Laravel is working, DB connected.',
            'db_name' => $dbName,
            'db_info' => $pdo->getAttribute(\PDO::ATTR_SERVER_VERSION),
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(), // 🔥 This will show the exact DB error
            'trace' => $e->getTraceAsString(),
        ]);
    }
});
