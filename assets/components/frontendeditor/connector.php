<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$ml = $modx->getOption('manager_language',null,'en');
$modx->lexicon->load($ml.':frontendeditor:backend');

$_SERVER['HTTP_MODAUTH'] = $modx->user->getUserToken('mgr');

$frontendeditCorePath = $modx->getOption('frontendeditor.core_path', null, $modx->getOption('core_path').'components/frontendeditor/');
$modx->request->handleRequest(array(
    'processors_path' => $frontendeditCorePath . 'processors/',
    'location' => '',
));

?>