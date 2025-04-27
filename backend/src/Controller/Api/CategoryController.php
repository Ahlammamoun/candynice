<?php

namespace App\Controller\Api;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CategoryController extends AbstractController
{
    #[Route('/api/categories', methods: ['GET'])]
    public function list(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy(['parent' => null]);
    
        $data = [];
    
        foreach ($categories as $category) {
            $children = [];
            foreach ($category->getCategories() as $child) {
                $children[] = [
                    'id' => $child->getId(),
                    'name' => $child->getName(),
                    'slug' => $child->getSlug(),
                    'parent_slug' => $category->getSlug(), // ➔ On ajoute ici 🔥
                ];
            }
    
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'slug' => $category->getSlug(),
                'children' => $children,
            ];
        }
    
        return $this->json($data);
    }
    
    
}
