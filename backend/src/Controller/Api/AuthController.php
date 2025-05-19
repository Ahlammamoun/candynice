<?php


namespace App\Controller\Api;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\UserRepository;
use App\Repository\OrderRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface; // Corrigez ici l'interface
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class AuthController extends AbstractController
{
    private $jwtManager;
    private $userRepository;
    private $passwordHasher;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->jwtManager = $jwtManager;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/api/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (empty($email) || empty($password)) {
            return new JsonResponse(['error' => 'Email et mot de passe sont requis'], 400);
        }

        // Chercher l'utilisateur par email
        $user = $this->userRepository->findOneByEmail($email);

        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'Identifiants invalides'], 401);
        }
        // dd($user);
        // Générer le token JWT

        $token = $this->jwtManager->create($user);
        return new JsonResponse([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
                'name' => $user->getName(),
            ]
        ]);

    }

    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $role = $data['role'] ?? 'ROLE_USER'; // Par défaut, assigner 'ROLE_USER'
        $name = $data['name'] ?? null;


        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Email et mot de passe requis'], 400);
        }

        // Normaliser l'email (pour éviter les doublons causés par la casse)
        $email = strtolower($email);

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'Cet email est déjà utilisé'], 409);
        }

        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($email);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setName($name ?? '');


        // Attribuer les rôles
        $user->setRoles([$role]);

        // dd($user);
        $entityManager->persist($user);
        $entityManager->flush();

        $token = $jwtManager->create($user);

        return new JsonResponse([
            'message' => 'Inscription réussie',
            'token' => $token,
            'roles' => $user->getRoles(),
            'name' => $user->getName(),
        ], 201);
    }



    #[Route('/api/users', name: 'user_list', methods: ['GET'])]
    public function listUsers(UserRepository $userRepository): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $users = $userRepository->findAll();

        $data = array_map(function (User $user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
                'name' => $user->getName(),
            ];
        }, $users);

        return $this->json($data);
    }


    #[Route('/api/users', name: 'user_create_admin', methods: ['POST'])]
    public function createUserAsAdmin(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;
        $roles = $data['roles'] ?? ['ROLE_USER'];

        if (!$email || !$password) {
            return $this->json(['error' => 'Email et mot de passe requis'], 400);
        }

        if (!is_array($roles)) {
            $roles = [$roles];
        }

        if ($entityManager->getRepository(User::class)->findOneBy(['email' => $email])) {
            return $this->json(['error' => 'Email déjà utilisé'], 409);
        }

        $user = new User();
        $user->setEmail($email);
        $user->setPassword($passwordHasher->hashPassword($user, $password));
        $user->setRoles($roles);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'Utilisateur créé'], 201);
    }



    #[Route('/api/users/{id}', name: 'user_update_admin', methods: ['PUT'])]
    public function updateUser(
        int $id,
        Request $request,
        UserRepository $repo,
        EntityManagerInterface $em
    ): JsonResponse {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        $user = $repo->find($id);
        if (!$user) {
            return $this->json(['error' => 'Utilisateur introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!empty($data['name'])) {
            $user->setName($data['name']);
        }

        if (!empty($data['email'])) {
            $user->setEmail($data['email']);
        }

        if (!empty($data['roles']) && is_array($data['roles'])) {
            $user->setRoles($data['roles']);
        }

        $em->flush();

        return $this->json(['message' => 'Utilisateur mis à jour']);
    }



    #[Route('/api/users/{id}', name: 'user_delete_admin', methods: ['DELETE'])]
    public function deleteUser(
        int $id,
        EntityManagerInterface $em,
        OrderRepository $orderRepo
    ): JsonResponse {
        $user = $em->getRepository(User::class)->find($id);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non trouvé'], 404);
        }

        // 🔍 Vérifier s’il a des commandes via le repository
        $hasOrders = $orderRepo->createQueryBuilder('o')
            ->select('COUNT(o.id)')
            ->where('o.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getSingleScalarResult();

        if ($hasOrders > 0) {
            return new JsonResponse([
                'error' => 'Impossible de supprimer cet utilisateur car des commandes sont associées.',
                'code' => 'USER_HAS_ORDERS'
            ], 400);
        }

        // ✅ Supprimer l’utilisateur
        $em->remove($user);
        $em->flush();

        return new JsonResponse(['message' => 'Utilisateur supprimé']);
    }

























}
