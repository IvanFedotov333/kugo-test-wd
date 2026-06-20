<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$email = isset($_POST['email']) ? trim($_POST['email']) : '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['status' => 'error', 'message' => 'Введите корректный email']);
  exit;
}

$to = 'ivan_fedotov_2013@inbox.ru';
$subject = 'Новая подписка с сайта Kugoo';
$message = "Новый подписчик!\n\nEmail: {$email}\nДата: " . date('d.m.Y H:i:s');
$headers = "From: no-reply@kugoo-test.ru\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = mail($to, $subject, $message, $headers);

if ($mailSent) {
  echo json_encode(['status' => 'success', 'message' => 'Подписка активна!']);
} else {
  echo json_encode(['status' => 'error', 'message' => 'Ошибка отправки. Попробуйте позже.']);
}
