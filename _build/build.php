<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

$config =  [
    'modx_core' => '/var/www/modx.local/core/',

    'name' => 'Frontend Editor',
    'name_lower' => 'frontendeditor',
    'version' => '1.2',
    'release' => 'pl',
    'install' => false,

    'plugins' => [
        'static' => false,
        'update' => true,
        'plugins' => [
            'frontendeditor' => [
                'file' => 'frontendeditor',
                'description' => '',
                'events' => [
                    'OnWebPagePrerender' => [],
                ],
            ],
            'FrontendEditorEventBrowserInit' => [
                'file' => 'FrontendEditorEventBrowserInit',
                'description' => '',
                'events' => [
                    'OnRichTextBrowserInit' => [],
                ],
            ],
        ]
    ],
    'settings' =>[
        'tinymce_init_default' => [
            'xtype' => 'textfield',
            'value' => "{\"menubar\":true,\"image_title\":true,\"image_caption\":true,\"convert_urls\":false,\"inline\":true,\"browser_spellcheck\":true,\"contextmenu\":false,\"plugins\":[\"wordcount table lists link media autolink image imagetools codesample code paste\"],\"toolbar\":\"undo redo | bold italic | forecolor backcolor | codesample |  alignleft aligncenter alignright alignjustify | bullist numlist | link unlink | image insert | code \",\"imagetools_toolbar\":\" editimage | imageoptions\"}",
            'area' => 'frontendeditor',
        ],
        'upload_file_name' => [
            'xtype' => 'textfield',
            'value' => "",
            'area' => 'frontendeditor',
        ],
        'upload_path' => [
            'xtype' => 'textfield',
            'value' => "images/Article Pictures/",
            'area' => 'frontendeditor',
        ],
        'menutitle_behavior' => [
            'xtype' => 'textfield',
            'value' => "1",
            'area' => 'frontendeditor',
        ],
        'media_source_id' => [
            'xtype' => 'textfield',
            'value' => "",
            'area' => 'frontendeditor',
        ],
        'update' => true
    ]

];

require_once($config['modx_core'].'config/config.inc.php');
require_once($config['modx_core'].'model/modx/modx.class.php');
$modx = new modX();
$modx->initialize('mgr');

$builder = $modx->getService('transport.modPackageBuilder');
$builder->createPackage($config['name_lower'], $config['version'], $config['release']);
$builder->registerNamespace($config['name_lower'], false, true, '{core_path}components/' . $config['name_lower'] . '/');

$category = $modx->newObject('modCategory');
$category->set('category', $config['name']);
$category_attributes = [
    xPDOTransport::UNIQUE_KEY => 'category',
    xPDOTransport::PRESERVE_KEYS => false,
    xPDOTransport::UPDATE_OBJECT => true,
    xPDOTransport::RELATED_OBJECTS => true,
    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [],
];

$category_attributes[xPDOTransport::RELATED_OBJECT_ATTRIBUTES]['Plugins'] = [
    xPDOTransport::UNIQUE_KEY => 'name',
    xPDOTransport::PRESERVE_KEYS => false,
    xPDOTransport::UPDATE_OBJECT => !empty($config['plugins']['update']),
    xPDOTransport::RELATED_OBJECTS => true,
    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => [
        'PluginEvents' => [
            xPDOTransport::PRESERVE_KEYS => true,
            xPDOTransport::UPDATE_OBJECT => true,
            xPDOTransport::UNIQUE_KEY => ['pluginid', 'event'],
        ],
    ],
];

$objects = [];
foreach ($config['plugins']['plugins'] as $name => $data) {

    $plugin = $modx->newObject('modPlugin');
    $plugin->fromArray(array_merge([
        'name' => $name,
        'category' => 0,
        'description' => @$data['description'],
        'plugincode' => getContent(dirname(dirname(__FILE__)).'/core/components/frontendeditor/' . 'elements/plugins/' . $data['file'] . '.php'),
        'static' => !empty($config['plugins']['static']),
        'source' => 1,
        'static_file' => '/core/components/' . $config['name_lower'] . '/elements/plugins/' . $data['file'] . '.php',
    ], $data), '', true, true);

    $events = [];
    if (!empty($data['events'])) {
        foreach ($data['events'] as $event_name => $event_data) {
            $event = $modx->newObject('modPluginEvent');
            $event->fromArray(array_merge([
                'event' => $event_name,
                'priority' => 0,
                'propertyset' => 0,
            ], $event_data), '', true, true);
            $events[] = $event;
        }
    }

    if (!empty($events)) {
        $plugin->addMany($events);
    }

    $objects[] = $plugin;
}

$category->addMany($objects);


$attributes = [
    xPDOTransport::UNIQUE_KEY => 'key',
    xPDOTransport::PRESERVE_KEYS => true,
    xPDOTransport::UPDATE_OBJECT => !empty($config['settings']['update']),
    xPDOTransport::RELATED_OBJECTS => false,
];

foreach ($config['settings'] as $name => $data) {
    if($name == "update") continue;
    $setting = $modx->newObject('modSystemSetting');
    $setting->fromArray(array_merge([
        'key' => $config['name_lower'] . '.' . $name,
        'namespace' => $config['name_lower'],
    ], $data), '', true, true);
    $vehicle = $builder->createVehicle($setting, $attributes);
    $builder->putVehicle($vehicle);
}


$vehicle = $builder->createVehicle($category, $category_attributes);

$vehicle->resolve('file', [
    'source' => dirname(dirname(__FILE__)).'/core/components/frontendeditor/',
    'target' => "return MODX_CORE_PATH . 'components/';",
]);

$vehicle->resolve('file', [
    'source' => dirname(dirname(__FILE__)).'/assets/components/frontendeditor/',
    'target' => "return MODX_ASSETS_PATH . 'components/';",
]);

$builder->putVehicle($vehicle);

$builder->setPackageAttributes([
    'changelog' => file_get_contents(dirname(dirname(__FILE__)) . '/core/components/frontendeditor/docs/changelog.txt'),
    'license' => file_get_contents(dirname(dirname(__FILE__)) . '/core/components/frontendeditor/docs/license.txt'),
    'readme' => file_get_contents(dirname(dirname(__FILE__)) . '/core/components/frontendeditor/docs/readme.txt'),
]);

if($builder->pack())
    echo  "Completed: " . $builder->directory . $builder->filename . "\r\n";

if($config['install']){
    $signature = $builder->getSignature();
    $sig = explode('-', $signature);
    $versionSignature = explode('.', $sig[1]);

    if (!$package = $modx->getObject('transport.modTransportPackage', ['signature' => $signature])) {
        $package = $modx->newObject('transport.modTransportPackage');
        $package->set('signature', $signature);
        $package->fromArray([
            'created' => date('Y-m-d h:i:s'),
            'updated' => null,
            'state' => 1,
            'workspace' => 1,
            'provider' => 0,
            'source' => $signature . '.transport.zip',
            'package_name' => $config['name'],
            'version_major' => $versionSignature[0],
            'version_minor' => !empty($versionSignature[1]) ? $versionSignature[1] : 0,
            'version_patch' => !empty($versionSignature[2]) ? $versionSignature[2] : 0,
        ]);
        if (!empty($sig[2])) {
            $r = preg_split('#([0-9]+)#', $sig[2], -1, PREG_SPLIT_DELIM_CAPTURE);
            if (is_array($r) && !empty($r)) {
                $package->set('release', $r[0]);
                $package->set('release_index', (isset($r[1]) ? $r[1] : '0'));
            } else {
                $package->set('release', $sig[2]);
            }
        }
        $package->save();
    }

    if ($package->install()) {
        echo "Install Ok";
    }

}

$modx->runProcessor('system/clearcache');

function getContent($filename)
    {
        if (file_exists($filename)) {
            $file = trim(file_get_contents($filename));

            return preg_match('#\<\?php(.*)#is', $file, $data)
                ? rtrim(rtrim(trim(@$data[1]), '?>'))
                : $file;
        }
        return '';
    }
