<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;

use App\Services\HomeService;

class HomeController extends Controller
{
    protected HomeService $homeService;

    public function __construct(HomeService $homeService)
    {
        $this->homeService = $homeService;
    }

    public function recentDishes()
    {
        $meals = $this->homeService->getRecentDishes();
        return response()->json($meals);
    }

    public function trivia()
    {
        $trivia = $this->homeService->getTrivia();
        return response()->json(['trivia' => $trivia]);
    } 

    public function genderize($name)
   {
    $result = $this->homeService->detectGender($name);
    return response()->json($result);
   }

    public function dailyMotivation()
   {
    return response()->json($this->homeService->getDailyMotivationalQuote());
   }

}
