<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;


class MeController extends AbstractController
{
#[Route('/api/me', name: 'api_me', methods: ['GET'])]
public function me(): JsonResponse
{
    $user = $this->getUser();
 if (!$user instanceof \App\Entity\User) {
    return new JsonResponse(['error' => 'Non connecté'], 401);
}

    return $this->json([
        'id' => $user->getId(),
        'email' => $user->getUserIdentifier(),
        'roles' => $user->getRoles(),
        'name' => $user->getName(),
    ]);
}

}
