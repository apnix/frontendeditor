<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

$resource_id = $modx->getOption('id', $scriptProperties, 0);

if($resource_id && is_numeric($resource_id)){
    
    if ($modx->user->isAuthenticated('mgr') && !$modx->hasPermission('save_document')) {
        return $modx->error->failure($modx->lexicon('access_denied'));
    }

    $resource = $modx->getObject('modResource', $resource_id);
    if (empty($resource)) return $modx->error->failure($modx->lexicon('resource_err_nfs',array('id' => $scriptProperties['id'])));
    
    if($resource && $resource->checkPolicy('save')){

        $resource_data = $resource->toArray();

        foreach ($scriptProperties as $key => $value) {
            if (in_array($key, ['content', 'pagetitle', 'longtitle', 'menutitle', 'description', 'introtext'])) {
                $resource_data[$key] = urldecode($value);
            }
            if(mb_strpos($key, 'tv-') === 0) {
                $resource->setTVValue(mb_substr($key, 3), urldecode($value));
            }
        }
        $resource_data['clearCache'] = true;

        $response = $modx->runProcessor(
            'resource/update',
            $resource_data,
            array(
                'processors_path' => $modx->getOption( 'processors_path' ),
                'action' => 'update'
            )
        );
        
        if ($response->isError()) {
            return $modx->error->failure($response->getMessage());
        }else{
            $result = $response->getResponse();
            return $result;
        }
        
    }
    
}else{
    return $modx->error->failure($modx->lexicon('error_resource_id',array('id' => $scriptProperties['id'])));
}
