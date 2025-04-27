<?php 

namespace App\Controller;

use App\Entity\Contact;
use App\Form\ContactType;
use App\Service\ContactMailer;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    private LoggerInterface $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/', name: 'home')]
    public function index(
        Request $request,
        EntityManagerInterface $entityManager,
        ContactMailer $contactMailer
    ): Response {
        $contact = new Contact();
        $form = $this->createForm(ContactType::class, $contact);
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            // Vérification du consentement RGPD
            if (!$contact->isRgpdConsent()) {
                $this->addFlash('error', 'Vous devez accepter notre politique de confidentialité pour envoyer le formulaire.');
                return $this->redirectToRoute('home');
            }

            try {
                $contact->setCreatedAt(new \DateTimeImmutable());
                $entityManager->persist($contact);
                $entityManager->flush();
                
                $this->addFlash('info', 'Données sauvegardées avec succès.');
                
                $this->logger->info('Tentative d\'envoi d\'email...');
                $contactMailer->sendContactNotification($contact);
                
                $this->addFlash('success', 'Votre message a été envoyé !');
                return $this->redirectToRoute('home');
            } catch (\Exception $e) {
                $this->logger->error('Erreur lors de l\'envoi: '.$e->getMessage());
                $this->logger->error($e->getTraceAsString());
                
                $this->addFlash('error', 'Erreur lors de l\'envoi: '.$e->getMessage());
            }
        }

        return $this->render('home/index.html.twig', [
            'contactForm' => $form->createView(),
        ]);
    }
}