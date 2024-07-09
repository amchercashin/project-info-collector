# Project Info Collector

Project Info Collector - это скрипт на Node.js, который помогает собирать информацию о структуре проекта и содержимом выбранных файлов. Он предоставляет удобный интерфейс для выбора папки проекта и отдельных файлов, а затем генерирует отчет в формате Markdown.

## Возможности

- Интерактивный выбор папки проекта
- Древовидное представление структуры проекта для выбора файлов
- Генерация отчета, включающего:
  - Структуру проекта
  - Содержимое выбранных файлов
- Сохранение отчета в файл с именем, основанным на названии проекта

## Требования

- Node.js (версия 14 или выше)
- npm (обычно устанавливается вместе с Node.js)

## Установка

1. Клонируйте репозиторий:
   ```
   git clone https://github.com/YOUR_USERNAME/project-info-collector.git
   cd project-info-collector
   ```

2. Установите зависимости:
   ```
   npm install
   ```

## Использование

1. Запустите скрипт:
   ```
   node collect-project-info.mjs
   ```

2. Следуйте инструкциям в интерактивном меню:
   - Выберите головную папку проекта
   - Выберите файлы и папки для включения в отчет

3. После завершения работы скрипта, отчет будет сохранен в файл `[название_проекта]_info.md` в текущей директории.

## Зависимости

- inquirer (8.2.5)
- inquirer-tree-prompt (1.1.2)
- tree-node-cli

## Лицензия

The Unlicense

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>

## Автор

Alex Che

## Вклад в проект

Если вы хотите внести свой вклад в проект, пожалуйста, создайте issue или отправьте pull request.