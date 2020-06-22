<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

if (!$modx->user->isAuthenticated('mgr')) {
    return $modx->error->failure($modx->lexicon('access_denied'));
}

if (empty($scriptProperties['ids']))
    return $modx->error->failure($modx->lexicon('error_resource_id', array('id' => $scriptProperties['id'])));

$returnArray = Array();

foreach ($scriptProperties['ids'] as $id) {
    $resource = $modx->getObject('modResource',$id);
    if (empty($resource)) {
        array_push($returnArray, $modx->error->failure($modx->lexicon('error_resource', array('id' => $id))));
        continue;
    }

    $tvsCollection = $resource->getTemplateVars();

    $tvList = $resource->getTemplateVars();
    $tvListResult = [];

    foreach ($tvList as $key => $tv) {
        $t = $tv->toArray();
        $tvListResult['tv-'.$t['name']] = $t['value'];
    }

    $returnArray[$id] = array_merge($resource->toArray(), $tvListResult);

    if($scriptProperties['process'] === 'true') {
        if (!empty($returnArray['content'])) {
            $parser = $modx->getParser();
            $parser->processElementTags('', $returnArray['content'], true, false, '[[', ']]', array(), 10);
            $parser->processElementTags('', $returnArray['content'], true, true, '[[', ']]', array(), 10);
        }
    }

}

return $modx->error->success('',$returnArray);
