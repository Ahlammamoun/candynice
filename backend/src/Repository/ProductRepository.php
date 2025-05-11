<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Category;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

//    /**
//     * @return Product[] Returns an array of Product objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Product
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }



public function findByCategorySlug(string $slug): array
{
    return $this->createQueryBuilder('p')
        ->join('p.category', 'c')
        ->where('c.slug = :slug')
        ->setParameter('slug', $slug)
        ->getQuery()
        ->getResult();
}



public function findByCategorySlugWithSubcategories(Category $category): array
{
    return $this->createQueryBuilder('p')
        ->join('p.category', 'c')
        // Jointure pour récupérer les sous-catégories via le parent
        ->leftJoin('c.parent', 'parent')
        ->where('c.slug = :slug OR parent.slug = :slug')
        ->setParameter('slug', $category->getSlug())
        ->getQuery()
        ->getResult();
}


















}
