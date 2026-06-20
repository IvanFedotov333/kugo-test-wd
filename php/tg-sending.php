<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
if (empty($phone)) {
  echo json_encode(['status' => 'error', 'message' => 'Введите номер телефона']);
  exit;
}


$token = '8852821334:AAFcLnrXPq5JLvrulD8xasyCo4Jr515cXO8';
$chat_id = '1638501939';

$text = "🎉 Новая заявка на сайте Kugoo!\n";
$text .= "✨ Телефон: " . $phone . "\n";
$text .= "🎁 Дата: " . date("d.m.Y H:i:s");

$url = "https://api.telegram.org/bot{$token}/sendMessage";
$data = [
  'chat_id'    => $chat_id,
  'text'       => $text,
  'parse_mode' => 'HTML'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
if ($result && $result['ok']) {
  echo json_encode(['status' => 'success', 'message' => 'Заявка отправлена!']);
} else {
  $errorDescription = $result['description'] ?? 'Неизвестная ошибка Telegram';
  echo json_encode(['status' => 'error', 'message' => $errorDescription]);
}
