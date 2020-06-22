<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

unset($scriptProperties['action']);

$result = Array();
$error = false;

foreach ($scriptProperties as $id => $properties) {

    $resource_id = $modx->getOption('id', $properties, 0);

    if ($resource_id && is_numeric($resource_id)) {

        if ($modx->user->isAuthenticated('mgr') && !$modx->hasPermission('save_document')) {
            return $modx->error->failure($modx->lexicon('access_denied'));
        }

        $resource = $modx->getObject('modResource', $resource_id);
        if (empty($resource)) return $modx->error->failure($modx->lexicon('resource_err_nfs', array('id' => $properties['id'])));

        if ($resource && $resource->checkPolicy('save')) {

            $resource_data = $resource->toArray();

            foreach ($properties as $key => $value) {
                if (in_array($key, ['content', 'pagetitle', 'longtitle', 'menutitle', 'description', 'introtext'])) {
                    $resource_data[$key] = urldecode($value);
                }
                if (mb_strpos($key, 'tv-') === 0) {
                    $resource->setTVValue(mb_substr($key, 3), urldecode($value));
                }
            }
            $resource_data['clearCache'] = true;

            $response = $modx->runProcessor(
                'resource/update',
                $resource_data,
                array(
                    'processors_path' => $modx->getOption('processors_path'),
                    'action' => 'update'
                )
            );

            if ($response->isError()) {
                array_push($result, $response->getMessage());
                $error = true;
            } else {
                array_push($result, $response->getResponse());
            }

        }

    } else {
        return $modx->error->failure($modx->lexicon('error_resource_id', array('id' => $scriptProperties['id'])));
    }
}

if($error)
    return $modx->error->failure('', $result);
else
    return $modx->error->success('', $result);
