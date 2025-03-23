<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

require_once dirname(__FILE__, 4) . '/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$modx->lexicon->load('frontendeditor:backend');

$_SERVER['HTTP_MODAUTH'] = $modx->user->getUserToken('mgr');

$_REQUEST['action'] = 'mgr/' . $_REQUEST['action'];

$frontendeditCorePath = $modx->getOption('frontendeditor.core_path', null, $modx->getOption('core_path').'components/frontendeditor/');
$modx->request->handleRequest(array(
    'processors_path' => $frontendeditCorePath . 'processors/',
    'location' => '',
));