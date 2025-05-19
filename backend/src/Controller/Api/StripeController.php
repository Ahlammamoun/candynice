<?php

namespace App\Controller\Api;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeController extends AbstractController
{
    #[Route('/api/create-checkout-session', name: 'create_checkout_session', methods: ['POST'])]
   public function createCheckoutSession(Request $request, ProductRepository $productRepository): JsonResponse
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $data = json_decode($request->getContent(), true);

        if (!isset($data['cart']) || !is_array($data['cart'])) {
            return new JsonResponse(['error' => 'Données panier manquantes ou invalides'], 400);
        }

        $cart = $data['cart'];
        $email = $data['email'] ?? 'guest@unknown.com';

        $lineItems = [];

        foreach ($cart as $item) {
            if (!isset($item['id'], $item['quantity'])) {
                continue;
            }

            $product = $productRepository->find($item['id']);
            if (!$product) {
                continue;
            }

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => (int)($product->getPrice() * 100),
                    'product_data' => ['name' => $product->getName()],
                ],
                'quantity' => $item['quantity'],
            ];
        }

        if (empty($lineItems)) {
            return new JsonResponse(['error' => 'Aucun article valide dans le panier'], 400);
        }

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => 'http://localhost:8000/success',
            'cancel_url' => 'http://localhost:8000/cancel',
            'metadata' => [
                'cart' => json_encode($cart),
                'email' => $email,
            ],
            'customer_email' => $email,
        ]);

        return new JsonResponse(['id' => $session->id]);
    }
}
