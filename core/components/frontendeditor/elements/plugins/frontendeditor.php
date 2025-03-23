<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */
if($modx->user->isAuthenticated('mgr')){

    $frontendeditorAssetsPath = $modx->getOption('frontendeditor.assets_path', null, 'assets/components/frontendeditor/');

    $modx->lexicon->load('frontendeditor:frontend');
    $lexicon = $modx->lexicon->fetch('frontendeditor.', true);
    $managerurl = defined('MODX_MANAGER_URL') ? MODX_MANAGER_URL : $managerurl = '/manager/';

    $scriptHtml = '
        <link href="'.$frontendeditorAssetsPath.'fontawesome-free/css/all.min.css?v=5.11.2" rel="stylesheet">
        <link href="'.$frontendeditorAssetsPath.'self/css/common.css?v=1.3.0" rel="stylesheet">
        
        <script type="text/javascript" src="'.$frontendeditorAssetsPath.'tinymce/tinymce.js?v=5.0.16"></script>
        <script type="text/javascript" src="'.$frontendeditorAssetsPath.'self/js/common.js?v=1.3.0"></script>

        <script type="text/javascript">
          document.addEventListener("DOMContentLoaded", function() {
            frontendeditor.init({
                selector: "[data-frontendeditor]",
                assetsPath: "'.$frontendeditorAssetsPath.'",
                url: "'.$frontendeditorAssetsPath.'connector.php",
                id: "' . $modx->resource->id . '",
                lang: "' . $lang . '",
                editPermission: "' . $modx->hasPermission('edit_document') . '",
                tinymceConfig: "' . htmlspecialchars($modx->getOption('frontendeditor.tinymce_init_default', null, false)) . '",
                menutitleBehavior: "' . htmlspecialchars($modx->getOption('frontendeditor.menutitle_behavior', null, '1')) . '",
                managerurl: "'.$managerurl.'",
            }
            , ' . $modx->toJSON($lexicon) . ')
        
         });
        </script>';

    $modx->resource->_output = preg_replace("/(<\/body>)/i", $scriptHtml . "\n\\1", $modx->resource->_output);

}