<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UploadController extends AbstractController
{
    #[Route('/api/upload', name: 'api_upload_image', methods: ['POST'])]
    public function upload(Request $request): JsonResponse
    {
        $file = $request->files->get('image');

        if (!$file) {
            return new JsonResponse(['error' => 'Aucun fichier reçu'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifie que le dossier existe
        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/images';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Nom de fichier unique
        $newFilename = uniqid() . '.' . $file->guessExtension();

        // Déplacement du fichier
        try {
            $file->move($uploadDir, $newFilename);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Erreur lors de l\'upload'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // Retourne le chemin accessible publiquement
        return new JsonResponse([
            'imageUrl' => '/uploads/images/' . $newFilename
        ]);
    }
}
