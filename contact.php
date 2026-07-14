<?php
// =====================================================================
// DESACTIVE : ancien script PHP (PHPMailer). Ne fonctionne PAS sur Vercel
// (pas de runtime PHP sur cet hebergement).
// Remplace par la fonction serverless Node.js : /api/contact.js
// Rien n'a ete supprime : tout le code original est conserve ci-dessous,
// ligne par ligne en commentaire, pour reference / retour arriere eventuel.
// =====================================================================

// <?php
// header('Content-Type: application/json');
//
// // Honeypot : si ce champ est rempli, c'est un bot
// if (!empty($_POST['website'])) {
//   echo json_encode(['success' => true, 'message' => '✓ Votre demande a été envoyée.']);
//   exit;
// }
//
// error_reporting(E_ALL);
// ini_set('display_errors', 0);
// ini_set('log_errors', 1);
//
// header('Content-Type: application/json; charset=utf-8');
//
// require __DIR__ . '/PHPMailer-7.1.1/src/Exception.php';
// require __DIR__ . '/PHPMailer-7.1.1/src/PHPMailer.php';
// require __DIR__ . '/PHPMailer-7.1.1/src/SMTP.php';
//
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;
//
// /* ── Lecture et nettoyage ── */
// $name    = trim(strip_tags($_POST['n'] ?? ''));
// $email   = trim($_POST['e'] ?? '');
// $service = trim(strip_tags($_POST['s'] ?? ''));
// $message = trim(strip_tags($_POST['m'] ?? ''));
//
// /* ── Validation ── */
// $errors = [];
//
// if ($name === '') {
//     $errors[] = 'Le nom est requis.';
// }
//
// if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//     $errors[] = 'Email invalide.';
// }
//
// if ($service === '') {
//     $errors[] = 'Veuillez sélectionner un service.';
// }
//
// if ($message === '') {
//     $errors[] = 'Le message est requis.';
// }
//
// if (!empty($errors)) {
//     http_response_code(422);
//
//     echo json_encode([
//         'success' => false,
//         'message' => implode(' ', $errors)
//     ]);
//
//     exit;
// }
//
// $safeName  = preg_replace('/[\r\n]+/', '', $name);
// $safeEmail = filter_var($email, FILTER_SANITIZE_EMAIL);
// $formattedMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
//
// /* ── Envoi ── */
// $mail = new PHPMailer(true);
//
// try {
//
//     $mail->isSMTP();
//     $mail->Host       = 'smtp.solutechtic.com'; // TODO: à remplacer par le vrai host SMTP de info@solutechtic.com
//     $mail->SMTPAuth   = true;
//     $mail->Username   = 'info@solutechtic.com';
//     $mail->Password   = 'MOT_DE_PASSE_A_RENSEIGNER'; // TODO: mot de passe de la boîte info@solutechtic.com
//     $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
//     $mail->Port       = 587;
//     $mail->CharSet    = 'UTF-8';
//
//     $mail->setFrom(
//         'info@solutechtic.com',
//         'Solutech Innovation Group'
//     );
//
//     $mail->addAddress(
//         'info@solutechtic.com',
//         'Solutech'
//     );
//
//     $mail->addReplyTo($safeEmail, $safeName);
//
//     $mail->isHTML(true);
//
//     // Logo intégré à l'e-mail (fonctionne même si les images distantes sont bloquées)
//     $logoPath = __DIR__ . '/images/logo_solutech2.png';
//     if (file_exists($logoPath)) {
//         $mail->addEmbeddedImage($logoPath, 'logoSolutech');
//     }
//
//     $mail->Subject = 'Nouveau message depuis le formulaire de contact — ' . $safeName;
//
//     $dateFr = (new DateTime('now', new DateTimeZone('Africa/Lome')))->format('d/m/Y à H:i');
//
//     $mail->Body = <<<HTML
// <!DOCTYPE html>
// <html lang="fr">
// <head><meta charset="UTF-8"></head>
// <body style="margin:0;padding:0;background:#F4F4F7;font-family:'Segoe UI',Arial,Helvetica,sans-serif;">
//   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F7;padding:32px 0;">
//     <tr>
//       <td align="center">
//         <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:10px;overflow:hidden;box-shadow:0 4px 18px rgba(3,20,57,.08);">
//
//           <!-- En-tête -->
//           <tr>
//             <td style="background:#031439;padding:28px 32px;">
//               <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
//                 <tr>
//                   <td style="vertical-align:middle;">
//                     <img src="cid:logoSolutech" alt="Solutech" width="46" height="46" style="display:block;border-radius:8px;background:#fff;padding:4px;">
//                   </td>
//                   <td style="vertical-align:middle;padding-left:14px;">
//                     <span style="font-family:Arial,sans-serif;font-size:18px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#FFFFFF;">SOLUTECH</span><br>
//                     <span style="font-family:Arial,sans-serif;font-size:9px;font-weight:400;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.5);">Innovation Group</span>
//                   </td>
//                 </tr>
//               </table>
//             </td>
//           </tr>
//
//           <!-- Bandeau couleur -->
//           <tr>
//             <td style="height:4px;line-height:4px;font-size:0;background:linear-gradient(90deg,#C0221E,#2563EB);">&nbsp;</td>
//           </tr>
//
//           <!-- Corps -->
//           <tr>
//             <td style="padding:32px;">
//               <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#C0221E;">Nouveau message</p>
//               <h2 style="margin:0 0 22px;font-size:20px;color:#031439;">Formulaire de contact du site</h2>
//
//               <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:22px;">
//                 <tr>
//                   <td style="padding:10px 14px;background:#F4F4F7;border-left:3px solid #C0221E;font-size:13px;color:#031439;">
//                     <strong style="color:#6B6F7E;font-weight:600;">Nom&nbsp;:</strong> {$safeName}
//                   </td>
//                 </tr>
//                 <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>
//                 <tr>
//                   <td style="padding:10px 14px;background:#F4F4F7;border-left:3px solid #2563EB;font-size:13px;color:#031439;">
//                     <strong style="color:#6B6F7E;font-weight:600;">Email&nbsp;:</strong> <a href="mailto:{$safeEmail}" style="color:#2563EB;text-decoration:none;">{$safeEmail}</a>
//                   </td>
//                 </tr>
//                 <tr><td style="height:8px;font-size:0;">&nbsp;</td></tr>
//                 <tr>
//                   <td style="padding:10px 14px;background:#F4F4F7;border-left:3px solid #C0221E;font-size:13px;color:#031439;">
//                     <strong style="color:#6B6F7E;font-weight:600;">Service&nbsp;:</strong> {$service}
//                   </td>
//                 </tr>
//               </table>
//
//               <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#6B6F7E;">Message</p>
//               <div style="padding:16px 18px;background:#F4F4F7;border-radius:6px;font-size:14px;line-height:1.7;color:#031439;">
//                 {$formattedMessage}
//               </div>
//             </td>
//           </tr>
//
//           <!-- Pied de page -->
//           <tr>
//             <td style="padding:20px 32px;background:#F4F4F7;border-top:1px solid #DEDFE6;">
//               <p style="margin:0;font-size:11px;color:#6B6F7E;">
//                 Reçu le {$dateFr} via le formulaire de contact du site — Solutech Innovation Group.
//               </p>
//             </td>
//           </tr>
//
//         </table>
//       </td>
//     </tr>
//   </table>
// </body>
// </html>
// HTML;
//
//     $mail->AltBody =
//         "Nouveau message depuis le formulaire de contact\n\n" .
//         "Nom : {$safeName}\n" .
//         "Email : {$safeEmail}\n" .
//         "Service : {$service}\n\n" .
//         "Message :\n{$message}\n\n" .
//         "Reçu le {$dateFr} — Solutech Innovation Group";
//
//     $mail->send();
//
//     echo json_encode([
//         'success' => true,
//         'message' => 'Mail envoyé avec succès.'
//     ]);
//
// } catch (Throwable $e) {
//
//     http_response_code(500);
//
//     echo json_encode([
//         'success'      => false,
//         'message'      => 'Erreur lors de l\'envoi du mail.',
//         'exception'    => $e->getMessage(),
//         'mailer_error' => $mail->ErrorInfo
//     ]);
// }