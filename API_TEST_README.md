# Celebrity Lookalike API Test Script

Этот скрипт позволяет протестировать ваш API на `localhost:5000/find` перед интеграцией с фронтендом.

## Установка

1. Установите зависимости:
```bash
pip install -r requirements.txt
```

## Использование

### Вариант 1: Автоматический поиск изображений
```bash
python test_api.py
```
Скрипт автоматически найдет первое изображение в текущей папке и протестирует API.

### Вариант 2: Указать конкретное изображение
```bash
python test_api.py photo.jpg
```

### Вариант 3: Указать другой URL API
```bash
python test_api.py photo.jpg http://localhost:3000/find
```

## Что проверяет скрипт

✅ **Функциональность:**
- Конвертация изображения в base64 (без префикса data URL)
- Отправка POST запроса с правильными заголовками
- Обработка всех типов ответов API

✅ **Обработка ошибок:**
- 400 (неверный формат изображения)
- 422 (изображение слишком большое)
- Пустой ответ (лицо не найдено)
- Проблемы с соединением

✅ **Валидация ответа:**
- Проверка формата JSON
- Проверка структуры данных `[{name, similarity}]`
- Отображение топ-5 совпадений

## Пример успешного вывода

```
🎭 Celebrity Lookalike API Test Script
==================================================
🔍 Testing Celebrity Lookalike API
📁 Image: photo.jpg
🌐 API URL: http://localhost:5000/find
--------------------------------------------------
📷 Converting image to base64...
✅ Image converted successfully (size: 45280 chars)
🚀 Sending request to API...
📊 Response Status: 200
✅ API Response received successfully!
📋 Response: [
  {
    "name": "Ryan Reynolds",
    "similarity": 0.8534
  },
  {
    "name": "Chris Evans",
    "similarity": 0.7892
  }
]
🎭 Found 2 celebrity matches:
  1. Ryan Reynolds - 85.3% similarity
  2. Chris Evans - 78.9% similarity
--------------------------------------------------
✅ Test completed successfully!
```

## Возможные проблемы

❌ **"Cannot connect to API"** - Убедитесь, что ваш бэкенд запущен на localhost:5000

❌ **"Error 400: Bad image data format"** - Проверьте, что изображение корректно конвертируется

❌ **"Error 422: Image too large"** - Уменьшите размер изображения

❌ **"No celebrity matches found"** - API не нашел лиц на изображении

## Поддерживаемые форматы

- JPG/JPEG
- PNG  
- WebP

Скрипт автоматически конвертирует любой формат в base64 для отправки в API. 