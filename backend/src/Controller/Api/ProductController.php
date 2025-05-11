<?php
namespace App\Controller\Api;

use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Product;
use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/products', name: 'api_products_')]
class ProductController extends AbstractController
{
    #[Route('', methods: ['GET'], name: 'list')]
    public function list(ProductRepository $productRepository, CategoryRepository $categoryRepository, Request $request): JsonResponse
    {
        $categorySlug = $request->query->get('category');

        // Vérifier si une catégorie est spécifiée
        if ($categorySlug) {
            // Récupérer la catégorie principale via son slug
            $category = $categoryRepository->findOneBy(['slug' => $categorySlug]);

            if (!$category) {
                return $this->json(['error' => 'Catégorie non trouvée'], 404);
            }

            // Récupérer les produits de cette catégorie et de ses sous-catégories
            $products = $productRepository->findByCategorySlugWithSubcategories($category);
        } else {
            // Si aucune catégorie n'est spécifiée, récupérer tous les produits
            $products = $productRepository->findAll();
        }

        // Préparer les données pour la réponse JSON
        $data = [];
        foreach ($products as $product) {
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'stock' => $product->getStock(),
                'image' => $product->getImage(),
                'region' => $product->getRegion(),
                'category' => $product->getCategory()?->getSlug(),
                'parent_id' => $product->getCategory()?->getParent()?->getSlug(), // Si c'est une sous-catégorie
            ];
        }

        return $this->json($data);
    }

    
    #[Route('/{id}', methods: ['GET'], name: 'show')]
    public function show(int $id, ProductRepository $productRepository): JsonResponse
    {
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'region' => $product->getRegion(),
            'image' => $product->getImage(),
            'category' => $product->getCategory()?->getSlug(),
        ];

        return $this->json($data);
    }

    #[Route('', methods: ['POST'], name: 'create')]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Récupération des données JSON envoyées par le frontend
        $data = json_decode($request->getContent(), true);

        // Vérification des champs obligatoires
        if (empty($data['name']) || empty($data['description']) || !isset($data['price']) || empty($data['region'])) {
            return new JsonResponse(['error' => 'Les champs nom, description, prix et région sont obligatoires'], Response::HTTP_BAD_REQUEST);
        }

        if (empty($data['category'])) {
            return new JsonResponse(['error' => 'La catégorie principale est obligatoire'], Response::HTTP_BAD_REQUEST);
        }

        // Création du produit
        $product = new Product();
        $product->setName($data['name']);
        $product->setDescription($data['description']);
        $product->setPrice($data['price']);
        $product->setImage($data['image'] ?? '');
        $product->setStock($data['stock'] ?? 0);
        $product->setRegion($data['region']);

        // Récupération de la catégorie principale en utilisant le slug
        $category = $entityManager->getRepository(Category::class)->findOneBy(['slug' => $data['category']]);

        if (!$category) {
            return new JsonResponse(['error' => 'Catégorie principale invalide'], Response::HTTP_BAD_REQUEST);
        }

        // Si une sous-catégorie est fournie, on récupère la sous-catégorie en utilisant le slug
        if (!empty($data['subCategory'])) {
            $subCategory = $entityManager->getRepository(Category::class)->findOneBy(['slug' => $data['subCategory']]);
            if (!$subCategory || $subCategory->getParent() !== $category) {
                return new JsonResponse(['error' => 'Sous-catégorie invalide'], Response::HTTP_BAD_REQUEST);
            }
            $product->setCategory($subCategory); // Associer la sous-catégorie au produit
        } else {
            $product->setCategory($category); // Associer la catégorie principale au produit
        }

        // Enregistrer le produit
        $entityManager->persist($product);
        $entityManager->flush();

        return new JsonResponse(['status' => 'Produit créé !'], Response::HTTP_CREATED);
    }



    #[Route('/{id}', methods: ['PUT'], name: 'update')]
    public function update(int $id, Request $request, ProductRepository $productRepository, CategoryRepository $categoryRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $data = json_decode($request->getContent(), true);
    
        // Récupérer le produit à partir de l'ID
        $product = $productRepository->find($id);
    
        if (!$product) {
            return $this->json(['error' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }
    
        // Mise à jour des propriétés du produit
        $product->setName($data['name'] ?? $product->getName());
        $product->setDescription($data['description'] ?? $product->getDescription());
        $product->setPrice($data['price'] ?? $product->getPrice());
        $product->setImage($data['image'] ?? $product->getImage());
        $product->setStock($data['stock'] ?? $product->getStock());
        $product->setRegion($data['region'] ?? $product->getRegion());
    
        // Récupérer la catégorie par son slug
        if (isset($data['category'])) {
            $category = $categoryRepository->findOneBy(['slug' => $data['category']]);
            if ($category) {
                $product->setCategory($category);
            } else {
                return $this->json(['error' => 'Catégorie non trouvée'], Response::HTTP_BAD_REQUEST);
            }
        }
    
        // Si une sous-catégorie est fournie, on la récupère en utilisant le slug
        if (!empty($data['subCategory'])) {
            $subCategory = $categoryRepository->findOneBy(['slug' => $data['subCategory']]);
            if ($subCategory) {
                // Vérifier que la sous-catégorie appartient bien à la catégorie principale
                if ($subCategory->getParent() !== $product->getCategory()) {
                    return new JsonResponse(['error' => 'Sous-catégorie invalide'], Response::HTTP_BAD_REQUEST);
                }
                // Associer la sous-catégorie au produit
                $product->setCategory($subCategory);
            } else {
                return new JsonResponse(['error' => 'Sous-catégorie introuvable'], Response::HTTP_BAD_REQUEST);
            }
        }
    
        // Sauvegarder les changements en base de données
        $entityManager->flush();
    
        return $this->json(['status' => 'Product updated!']);
    }
    

    #[Route('/{id}', methods: ['DELETE'], name: 'delete', requirements: ['id' => '\d+'])]
    public function delete(int $id, ProductRepository $productRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // Vérifie si l'ID est bien un entier
        if (!is_int($id)) {
            return $this->json(['error' => 'L\'ID doit être un entier'], Response::HTTP_BAD_REQUEST);
        }

        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Produit non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Supprimer le produit
        $entityManager->remove($product);
        $entityManager->flush();

        return $this->json(['status' => 'Product deleted!']);
    }

}
















