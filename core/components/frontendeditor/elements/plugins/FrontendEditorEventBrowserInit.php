<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

if($modx->user->isAuthenticated('mgr')){

    if(isset($frontendeditor)) {
        $frontendeditorAssetsPath = $modx->getOption('frontendeditor.assets_path', null, MODX_ASSETS_URL . 'components/frontendeditor/');
        $modx->controller->addJavascript($frontendeditorAssetsPath . 'self/js/browser.js?v=1.2.2');
        $modx->event->output('FrontendEditor.browserCallback');
    }

}
