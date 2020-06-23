## Frontend Editor
Frontend Editor is a simple plugin that allows you to edit content without having to log in through the manager interface to do this. It includes TinyMCE 5 for easy editing.

<p align="center">
  <img src="https://github.com/apnix/frontendeditor/blob/master/_screenlets/screen-1.png?raw=true" alt="Frontend Editor" title="Frontend Editor" style="max-height: 480px;"/>
</p>

## Features
- Supported editing of document fields including TV fields.
- Easy image loading without using a resource manager.
- Editing fields by resource ID (useful for creating editable menus, breadcrumbs, etc.)

## Installation
Install the extension. Wrap the fields you want to edit with the tag with attribute ```data-frontendeditor="content"```  specify the field name as the attribute value. For example:
```html
<div data-frontendeditor="content">
    [[*content]]
</div>
```
Available values: ```content, pagetitle, longtitle, menutitle, description, introtext```

#### Editing TV fields
For editing TV fields as attribute value must be specified ```tv-``` in front of the field name.
```html
<div data-frontendeditor="tv-myTvField">
    [[*myTvField]]
</div>
```

####Editor's Choice
For each field, you can specify one of two types of editors: TinyMCE ```tinymce``` (no need to specify by default) or a simple input field ```simple```.
```html
<div data-frontendeditor="tv-myTvField, simple">
    [[*myTvField]]
</div>
```
####Editing values by resource ID
If you need to edit the fields of another resource, you need to specify its id as the first option. This is especially useful for creating editable menus, breadcrumbs, and other interface elements.

Example of editing of ```pagetitle``` for a resource with id – ```2```
```html
<a href="/index.php?id=2" data-frontendeditor="2, pagetitle, simple">
    [[pdoField?&id=`2`&field=`pagetitle`]]
</a>
```

Example of an editable menu:
```html
[[pdoMenu?
    &parents=`0`
    &tpl=`@INLINE <li><a href="[[+link]]" data-frontendeditor="[[+id]], menutitle, simple">[[+menutitle]]</a>[[+wrapper]]</li>`
]]
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

## Возможности
- Поддерживается редактирование полей документа включая TV поля.
- Простая загрузка изображений без использования менеджера ресурсов.
- Редактирование полей по ID ресурса (полезно для создания редактируемых, меню, breadcrumbs и т.д.)


## Установка и использование
Установите расширение. Оберните поля которые хотите редактировать тегом с атрибутом ```data-frontendeditor``` в качестве значения атрибута укажите название поля. Например так:
```html
<div data-frontendeditor="content">
    [[*content]]
</div>
```
Доступные значения: ```content, pagetitle, longtitle, menutitle, description, introtext```

#### Редактирование TV полей
Для редактирования TV полей в качестве значения атрибута необходимо указать  ```tv-``` перед названием поля.
```html
<div data-frontendeditor="tv-myTvField">
    [[*myTvField]]
</div>
```

#### Выбор редактора
Для каждого поля можно указать один из двух типов редакторов: TinyMCE ```tinymce``` (по умолчанию можно не указывать) или простое поле ввода ```simple```.
```html
<div data-frontendeditor="tv-myTvField, simple">
    [[*myTvField]]
</div>
```

#### Редактирование значений по ID ресурса
Если нужно отредактировать поля другого ресурса нужно указать его id в качестве первой опции. Это особенно полезно для создания редактируемых меню, breadcrumbs и других элементов интерфейса. 

Пример редактирования ```pagetitle``` для ресурса с id - ```2```
```html
<a href="/index.php?id=2" data-frontendeditor="2, pagetitle, simple">
    [[pdoField?&id=`2`&field=`pagetitle`]]
</a>
```

Пример редактируемого меню:
```html
[[pdoMenu?
    &parents=`0`
    &tpl=`@INLINE <li><a href="[[+link]]" data-frontendeditor="[[+id]], menutitle, simple">[[+menutitle]]</a>[[+wrapper]]</li>`
]]
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
