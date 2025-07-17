<?php

namespace App\Services;

use Microsoft\Graph\Graph;
use Microsoft\Graph\Model;

class GraphMailService
{
    public function sendMail($accessToken, $fromEmail, $toEmail, $subject, $bodyText)
    {
        $graph = new Graph();
        $graph->setAccessToken($accessToken);

        $message = [
            'message' => [
                'subject' => $subject,
                'body' => [
                    'contentType' => 'Text',
                    'content' => $bodyText,
                ],
                'from' => [
                    'emailAddress' => [
                        'address' => $fromEmail,
                    ],
                ],
                'toRecipients' => [
                    [
                        'emailAddress' => [
                            'address' => $toEmail,
                        ],
                    ],
                ],
            ],
            'saveToSentItems' => 'true',
        ];
        try {
            $response = $graph->createRequest("POST", "/users/{$fromEmail}/sendMail")
                ->attachBody($message)
                ->execute();

            return $response;
        } catch (\Exception $e) {
            // Handle exceptions, log errors, etc.
            throw new \Exception('Error sending email: ' . $e->getMessage());
        }
    }
}
