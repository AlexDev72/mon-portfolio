<?php 

// src/Service/ContactMailer.php
namespace App\Service;

use App\Entity\Contact;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

class ContactMailer
{
    private string $adminEmail;

    public function __construct(
        private MailerInterface $mailer,
        string $adminEmail
    ) {
        $this->adminEmail = $adminEmail;
    }

    public function sendContactNotification(Contact $contact): void
    {
        $email = (new TemplatedEmail())
            ->from(new Address($contact->getEmail(), $contact->getName()))
            ->to($this->adminEmail)
            ->subject('Nouveau message de contact')
            ->htmlTemplate('emails/contact.html.twig')
            ->context(['contact' => $contact]);

        $this->mailer->send($email);
    }
}