<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    #[Route('/api/admin', name: 'api_admin')]
    public function admin(): JsonResponse
    {
        return new JsonResponse([
            'message' => 'Bienvenue dans l\'admin sécurisé ! 🎯',
            'user' => $this->getUser()->getUserIdentifier(),
        ]);
    }
}
