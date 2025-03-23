<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

class GetAllProcessor extends modProcessor
{
    public function process()
    {
        if (!$this->modx->user->isAuthenticated('mgr')) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $scriptProperties = $this->getProperties();

        if (empty($scriptProperties['ids'])) {
            return $this->failure($this->modx->lexicon('error_resource_id', array('id' => $scriptProperties['id'])));
        }

        $returnArray = Array();

        foreach ($scriptProperties['ids'] as $id) {
            $resource = $this->modx->getObject('modResource', $id);
            if (empty($resource)) {
                array_push($returnArray, $this->failure($this->modx->lexicon('error_resource', array('id' => $id))));
                continue;
            }

            $tvList = $resource->getTemplateVars();
            $tvListResult = [];

            foreach ($tvList as $tv) {
                $t = $tv->toArray();
                $tvListResult['tv-'.$t['name']] = $t['value'];
            }

            $returnArray[$id] = array_merge($resource->toArray(), $tvListResult);

            if($scriptProperties['process'] === 'true') {
                if (!empty($returnArray['content'])) {
                    $parser = $this->modx->getParser();
                    $parser->processElementTags('', $returnArray['content'], true, false, '[[', ']]', array(), 10);
                    $parser->processElementTags('', $returnArray['content'], true, true, '[[', ']]', array(), 10);
                }
            }
        }

        return $this->success('', $returnArray);
    }
}

return 'GetAllProcessor';