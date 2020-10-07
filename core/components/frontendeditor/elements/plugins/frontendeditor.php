<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */
if($modx->user->isAuthenticated('mgr')){

    $frontendeditorAssetsPath = $modx->getOption('frontendeditor.assets_path', null, 'assets/components/frontendeditor/');

    $lang = $modx->getOption('manager_language',null,'en');
    $modx->lexicon->load($lang.':frontendeditor:frontend');
    $lexicon = $modx->lexicon->fetch('frontendeditor.', true);

    $scriptHtml = '
        <link href="'.$frontendeditorAssetsPath.'fontawesome-free/css/all.min.css?v=5.11.2" rel="stylesheet">
        <link href="'.$frontendeditorAssetsPath.'self/css/common.css?v=1.2" rel="stylesheet">
        
        <script type="text/javascript" src="'.$frontendeditorAssetsPath.'tinymce/tinymce.js?v=5.0.16"></script>
        <script type="text/javascript" src="'.$frontendeditorAssetsPath.'self/js/common.js?v=1.2"></script>

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
            }
            , ' . $modx->toJSON($lexicon) . ')
        
         });
        </script>';

    $modx->resource->_output = preg_replace("/(<\/body>)/i", $scriptHtml . "\n\\1", $modx->resource->_output);

}