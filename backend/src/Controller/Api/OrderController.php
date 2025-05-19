<?php

namespace App\Controller\Api;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Dompdf\Dompdf;
use Dompdf\Options;

class OrderController extends AbstractController
{
    #[Route('/api/orders', name: 'create_order', methods: ['POST'])]
    public function createOrder(
        Request $request,
        EntityManagerInterface $em,
        ProductRepository $productRepository
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Non connecté'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!is_array($data) || empty($data)) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $order = new Order();
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setUser($user);

        $total = 0;

        foreach ($data as $item) {
            if (!isset($item['id'], $item['quantity'])) {
                continue;
            }

            $product = $productRepository->find($item['id']);
            if (!$product) {
                continue;
            }

            $quantity = (int)$item['quantity'];
            $price = $product->getPrice();

            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($quantity);
            $orderItem->setUnitPrice($price);
            $orderItem->setCommande($order);

            $em->persist($orderItem);
            $order->addOrderItem($orderItem);

            $total += $price * $quantity;
        }

        if (count($order->getOrderItems()) === 0) {
            return new JsonResponse(['error' => 'La commande est vide. Aucun produit valide.'], 400);
        }

        $order->setTotalPrice($total);

        $em->persist($order);
        $em->flush();

        return new JsonResponse(['message' => 'Commande enregistrée', 'id' => $order->getId()], 201);
    }

    #[Route('/api/orders', name: 'get_user_orders', methods: ['GET'])]
    public function getUserOrders(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Non connecté'], 401);
        }

        $orders = $em->getRepository(Order::class)->findBy(['user' => $user], ['createdAt' => 'DESC']);

        $data = [];

        foreach ($orders as $order) {
            $items = [];

            foreach ($order->getOrderItems() as $item) {
                $items[] = [
                    'product' => $item->getProduct()->getName(),
                    'quantity' => $item->getQuantity(),
                    'unit_price' => $item->getUnitPrice(),
                ];
            }

            $data[] = [
                'id' => $order->getId(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i'),
                'total' => $order->getTotalPrice(),
                'items' => $items,
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/orders/{id}/invoice', name: 'order_invoice', methods: ['GET'])]
    public function generateInvoice(int $id, EntityManagerInterface $em): Response
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Non connecté'], 401);
        }

        $order = $em->getRepository(Order::class)->find($id);

        if (!$order || $order->getUser() !== $user) {
            return new JsonResponse(['error' => 'Commande non trouvée'], 404);
        }

        // Génération HTML de la facture
        $html = "<h2>Facture - Commande #{$order->getId()}</h2>";
        $html .= "<p>Date : {$order->getCreatedAt()->format('Y-m-d H:i')}</p>";
        $html .= "<p>Total : {$order->getTotalPrice()} €</p>";
        $html .= "<table border='1' cellspacing='0' cellpadding='6' style='width:100%;'>
                    <thead><tr><th>Produit</th><th>Quantité</th><th>Prix unitaire</th></tr></thead><tbody>";

        foreach ($order->getOrderItems() as $item) {
            $html .= "<tr>
                        <td>{$item->getProduct()->getName()}</td>
                        <td>{$item->getQuantity()}</td>
                        <td>{$item->getUnitPrice()} €</td>
                      </tr>";
        }

        $html .= "</tbody></table>";

        // PDF
        $options = new Options();
        $options->set('defaultFont', 'Arial');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return new Response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="facture-commande-' . $order->getId() . '.pdf"',
        ]);
    }
}
