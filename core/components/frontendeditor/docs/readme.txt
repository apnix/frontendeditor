---------------------------------------
Frontend Editor v1.2.2
---------------------------------------
Version: 1.2.2
Author: Artemiy Titov <arien85@gmail.com>
---------------------------------------

Frontend Editor is a simple plugin that allows you to edit content without having to log in through the manager interface to do this. It includes TinyMCE 5 for easy editing.

GitHub: https://github.com/apnix/frontendeditor

FEATURES
Supported editing of document fields including TV fields.
Easy image loading without using a resource manager.
Editing fields by resource ID (useful for creating editable menus, breadcrumbs, etc.)

INSTALLATION
Install the extension. Wrap the fields you want to edit with the tag with attribute data-frontendeditor="content" specify the field name as the attribute value. For example:
<div data-frontendeditor="content">
    [[*content]]
</div>
Available values: content, pagetitle, longtitle, menutitle, description, introtext

EDITING TV FIELDS
For editing TV fields as attribute value must be specified tv- in front of the field name.
<div data-frontendeditor="tv-myTvField">
    [[*myTvField]]
</div>

EDITOR'S CHOICE
For each field, you can specify one of two types of editors: TinyMCE tinymce (no need to specify by default) or a simple input field simple.
<div data-frontendeditor="tv-myTvField, simple">
    [[*myTvField]]
</div>

EDITING VALUES BY RESOURCE ID
If you need to edit the fields of another resource, you need to specify its id as the first option. This is especially useful for creating editable menus, breadcrumbs, and other interface elements.
Example of editing of pagetitle for a resource with id – 2
<a href="/index.php?id=2" data-frontendeditor="2, pagetitle, simple">
    [[pdoField?&id=`2`&field=`pagetitle`]]
</a>

Example of an editable menu::
[[pdoMenu?
    &parents=`0`
    &tpl=`@INLINE <li><a href="[[+link]]" data-frontendeditor="[[+id]], menutitle, simple">[[+menutitle]]</a>[[+wrapper]]</li>`
]]

## Field menutitle
For editable fields menutitle if they are empty special behavior are provided. They are filled with the value from pagetitle, and the result is saved in menutitle. These behavior can be changed, see advanced settings.

ADDITIONAL SETTINGS
frontendeditor.tinymce_init_default - TinyMCE configuration settings. For more details see TinyMCE 5.0 Documentation

frontendeditor.upload_path - image upload directory

frontendeditor.upload_file_name - processing the file name, can take the following values:
empty (by default) - does nothing
sanitize - removes the characters $-+!*'(),{}|\\^~[]`<>#%\";/?:@&="
uniqid - generates a unique name such as 5db365920976f.png

frontendeditor.menutitle_behavior - editor behavior for empty menutitle fields. It can take the following values:
0 - the editor works with empty menutitle as well as with other fields.
1 (default) - Empty menutitle field is substituted with the value from pagetitle and the result is saved in  menutitle.
2 - Empty menutitle field is substituted with the value from pagetitle and the result is saved in pagetitle.

SYSTEM REQUIREMENTS
On those pages where you are going to use the editor, DOCTYPE should be indicated such as: <!DOCTYPE html>
TinyMCE 5 should support your browser: https://www.tiny.cloud/docs/general-configuration-guide/system-requirements


======= Russian =======

Frontend Editor это простой плагин который позволяет редактировать контент не заходя в админ панель. Он включает в себя TinyMCE 5 для удобного редактирования.

GitHub: https://github.com/apnix/frontendeditor

ВОЗМОЖНОСТИ
- Поддерживается редактирование полей документа включая TV поля.
- Простая загрузка изображений без использования менеджера ресурсов.
- Редактирование полей по ID ресурса (полезно для создания редактируемых, меню, breadcrumbs и т.д.)

Установка и использование
Установите расширение. Оберните поля которые хотите редактировать тегом с атрибутом data-frontendeditor в качестве значения атрибута укажите название поля. Например так:
<div data-frontendeditor="content">
    [[*content]]
</div>
Доступные значения: content, pagetitle, longtitle, menutitle, description, introtext

РЕДАКТИРОВАНИЕ TV ПОЛЕЙ
Для редактирования TV полей в качестве значения атрибута необходимо указать tv- перед названием поля.
<div data-frontendeditor="tv-myTvField">
    [[*myTvField]]
</div>

ВЫБОР РЕДАКТОРА
Для каждого поля можно указать один из двух типов редакторов: TinyMCE tinymce (по умолчанию можно не указывать) или простое поле ввода simple.
<div data-frontendeditor="tv-myTvField, simple">
    [[*myTvField]]
</div>

РЕДАКТИРОВАНИЕ ЗНАЧЕНИЙ ПО ID РЕСУРСА
Если нужно отредактировать поля другого ресурса нужно указать его id в качестве первой опции. Это особенно полезно для создания редактируемых меню, breadcrumbs и других элементов интерфейса.
Пример редактирования pagetitle для ресурса с id - 2
<a href="/index.php?id=2" data-frontendeditor="2, pagetitle, simple">
    [[pdoField?&id=`2`&field=`pagetitle`]]
</a>

Пример редактируемого меню:
[[pdoMenu?
    &parents=`0`
    &tpl=`@INLINE <li><a href="[[+link]]" data-frontendeditor="[[+id]], menutitle, simple">[[+menutitle]]</a>[[+wrapper]]</li>`
]]

## Поле menutitle
Для редактируемых полей menutitle если они пусты предусмотрено особое поведение. В них подставляется значение из pagetitle, а результат сохраняются в menutitle. Это поведение можно изменить см. дополнительные настройки.

ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ
frontendeditor.tinymce_init_default - конфигурация TinyMCE подробнее смотрите документацию TinyMCE 5.0

frontendeditor.upload_path - директория загрузки изображений

frontendeditor.upload_file_name - обработка имени файла, может принимать следующие значения:
пусто(по умолчанию) - ничего не делает
sanitize - удаляет символы $-+!*'(),{}|\\^~[]`<>#%\";/?:@&=
uniqid - генерирует уникальное имя вида 5db365920976f.png

frontendeditor.menutitle_behavior - поведение редактора для пустых полей menutitle. Может принимать следующие значения:
0 - редактор работает с пустыми menutitle так же как и с остальными полями.
1(по умолчанию) - В пустые поля menutitle подставляется значение из pagetitle, а сохраняются menutitle.
2 - В пустые поля menutitle подставляется значение из pagetitle и сохраняются pagetitle.

СИСТЕМНЫЕ ТРЕБОВАНИЯ
На тех страницах где вы собираетесь использовать редактор должен быть указан DOCTYPE такой как: <!DOCTYPE html>
TinyMCE 5 должен поддерживать ваш браузер: https://www.tiny.cloud/docs/general-configuration-guide/system-requirements
