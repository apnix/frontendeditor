## Frontend Editor
Frontend Editor is a simple plugin that allows you to edit content without having to log in through the manager interface to do this. It includes TinyMCE 5 for easy editing.

## Features
- In the current version, only editing the content field is supported.
- Easy image loading without using a resource manager.

## Installation
Install the extension. Add the ```data-frontendeditor="content"``` attribute to the element, for example:
```html
<div data-frontendeditor="content">
    [[*content]]
</div>
```

## Additional settings
```frontendeditor.tinymce_init_default``` - TinyMCE configuration settings. For more details see [TinyMCE 5.0 Documentation](https://www.tiny.cloud/docs/)

```frontendeditor.upload_path``` - image upload directory

```frontendeditor.upload_file_name``` - processing the file name, can take the following values:
* empty (by default) - does nothing;
* sanitize - removes the characters ``` $-+!*'(),{}|\\^~[]`<>#%\";/?:@&="```
* uniqid - generates a unique name such as 5db365920976f.png

## System Requirements
* On those pages where you are going to use the editor, DOCTYPE should be indicated such as: <!DOCTYPE html>
* TinyMCE 5 should support your browser: https://www.tiny.cloud/docs/general-configuration-guide/system-requirements

___
Frontend Editor это простой плагин который позволяет редактировать контент не заходя в админ панель. Он включает в себя TinyMCE 5 для удобного редактирования.

## Особенности
- В текущей версии поддерживается только редактирования поля контент.
- Простая загрузка изображений без использования менеджера ресурсов.

## Установка
Установите расширение. Добавьте атрибут ```data-frontendeditor="content"``` элементу, например так:
```html
<div data-frontendeditor="content">
    [[*content]]
</div>
```

## Дополнительные настройки
```frontendeditor.tinymce_init_default``` - конфигурация TinyMCE подробнее смотрите [документацию TinyMCE 5.0 ](https://www.tiny.cloud/docs/)

```frontendeditor.upload_path``` - директория загрузки изображений

```frontendeditor.upload_file_name``` - обработка имени файла, может принимать следующие значения: 
* пусто(по умолчанию) - ничего не делает;
* sanitize - удаляет символы ``` $-+!*'(),{}|\\^~[]`<>#%\";/?:@&=``` 
* uniqid - генерирует уникальное имя вида 5db365920976f.png

## Системные требования
* На тех страницах где вы собираетесь использовать редактор должен быть указан DOCTYPE такой как: <!DOCTYPE html>
* TinyMCE 5 должен поддерживать ваш браузер: https://www.tiny.cloud/docs/general-configuration-guide/system-requirements
