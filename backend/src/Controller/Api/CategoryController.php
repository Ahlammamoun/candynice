<?php

namespace App\Controller\Api;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Product;
use App\Entity\Category;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends AbstractController
{
    #[Route('/api/categories', methods: ['GET'])]
    public function list(CategoryRepository $categoryRepository): JsonResponse
    {
        $categories = $categoryRepository->findBy(['parent' => null]);

        $data = [];

        // On boucle sur chaque catégorie principale
        foreach ($categories as $category) {
            $children = [];

            // On boucle sur les sous-catégories de cette catégorie principale
            foreach ($category->getCategories() as $child) {
                $children[] = [
                    'id' => $child->getId(),
                    'name' => $child->getName(),
                    'slug' => $child->getSlug(),
                    'parent_id' => $category->getId(), // On garde aussi l'id du parent
                ];
            }

            // On ajoute la catégorie principale avec ses sous-catégories
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'slug' => $category->getSlug(),
                'parent_id' => $category->getSlug(),
                'children' => $children, // Sous-catégories
            ];
        }

        return $this->json($data);
    }


    // Récupérer les sous-catégories par slug
    #[Route("/{slug}/subcategories", methods: ['GET'], name: 'get_subcategories_by_slug')]
    public function getSubCategoriesBySlug(string $slug, CategoryRepository $categoryRepository): JsonResponse
    {
        // Récupérer la catégorie par son slug
        $category = $categoryRepository->findOneBy(['slug' => $slug]);

        if (!$category) {
            return $this->json(['error' => 'Category not found'], 404);
        }

        // Récupérer les sous-catégories associées à cette catégorie
        $subCategories = $category->getCategories(); // Les sous-catégories liées à la catégorie

        $data = [];
        foreach ($subCategories as $subCategory) {
            $data[] = [
                'id' => $subCategory->getId(),
                'name' => $subCategory->getName(),
                'slug' => $subCategory->getSlug(),
            ];
        }

        return $this->json($data);
    }


    #[Route('/api/categories', name: 'create_category', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);

        // Vérification des champs requis
        if (empty($data['name']) || empty($data['slug'])) {
            return new JsonResponse(['error' => 'Les champs name et slug sont obligatoires'], Response::HTTP_BAD_REQUEST);
        }

        $category = new Category();
        $category->setName($data['name']);
        $category->setSlug($data['slug']);

        // Si une catégorie parente est fournie (id), on la lie
        if (!empty($data['parent'])) {
            $parent = $entityManager->getRepository(Category::class)->find($data['parent']);

            if (!$parent) {
                return new JsonResponse(['error' => 'Catégorie parente invalide'], Response::HTTP_BAD_REQUEST);
            }

            $category->setParent($parent);
        }

        $entityManager->persist($category);
        $entityManager->flush();

        return new JsonResponse([
            'status' => 'Catégorie créée !',
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'parent_id' => $category->getParent()?->getId()
        ], Response::HTTP_CREATED);
    }


    #[Route('/api/categories/{id}', name: 'api_category_delete', methods: ['DELETE'])]
    public function delete(int $id, CategoryRepository $repository, EntityManagerInterface $em): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $category = $repository->find($id);
        if (!$category) {
            return $this->json(['error' => 'Catégorie introuvable'], 404);
        }

        $em->remove($category);
        $em->flush();

        return $this->json(['status' => 'Catégorie supprimée']);
    }




    #[Route('/api/categories/{id}', name: 'api_category_update', methods: ['PUT'])]
    public function update(
        int $id,
        Request $request,
        CategoryRepository $repository,
        EntityManagerInterface $em
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $category = $repository->find($id);
        if (!$category) {
            return $this->json(['error' => 'Catégorie introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $category->setName($data['name'] ?? $category->getName());
        $category->setSlug($data['slug'] ?? $category->getSlug());

        if (isset($data['parent']) && $data['parent'] !== '') {
            $parent = $repository->find($data['parent']);
            if (!$parent) {
                return $this->json(['error' => 'Catégorie parente invalide'], 400);
            }
            $category->setParent($parent);
        } else {
            $category->setParent(null);
        }

        $em->flush();

        return $this->json(['status' => 'Catégorie mise à jour']);
    }




}
