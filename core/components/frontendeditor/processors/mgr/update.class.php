<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

class UpdateProcessor extends modProcessor
{
    public function process()
    {
        $scriptProperties = $this->getProperties();

        unset($scriptProperties['action']);

        $result = Array();
        $error = false;

        foreach ($scriptProperties as $properties) {
            $resource_id = $this->modx->getOption('id', $properties, 0);

            if (    $resource_id && is_numeric($resource_id)) {
                if ($this->modx->user->isAuthenticated('mgr') && !$this->modx->hasPermission('save_document')) {
                    return $this->failure($this->modx->lexicon('access_denied'));
                }

                $resource = $this->modx->getObject('modResource', $resource_id);
                if (empty($resource)) {
                    return $this->failure($this->modx->lexicon('frontendeditor.resource_err_nfs', array('id' => $resource_id)));
                }

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

                    $response = $this->modx->runProcessor(
                        'resource/update',
                        $resource_data,
                        array(
                            'processors_path' => $this->modx->getOption('processors_path'),
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
                return $this->failure($this->modx->lexicon('frontendeditor.error_resource_id', array('id' => $resource_id)));
            }
        }

        if ($error) {
            return $this->failure('', $result);
        } else {
            return $this->success('', $result);
        }
    }
}

return 'UpdateProcessor';