<?php
/**
 * Frontend Editor
 *
 * @package frontendeditor
 */

$resource_id = $modx->getOption('id', $scriptProperties, 0);

if($resource_id && is_numeric($resource_id)){
    
    if ($modx->user->isAuthenticated('mgr') && !$modx->hasPermission('file_manager')) {
        return $modx->error->failure($modx->lexicon('access_denied'));
    }

    $resource = $modx->getObject('modResource', $resource_id);
    if (empty($resource)) return $modx->error->failure($modx->lexicon('error_resource',array('id' => $scriptProperties['id'])));

    reset($_FILES);
    $temp = current($_FILES);
    if (is_uploaded_file($temp['tmp_name'])) {

        switch ($modx->getOption('frontendeditor.upload_file_name', null, "")) {
            case "sanitize":
                $temp['name'] = sanitizeFileName( $temp['name']);
                break;
            case "uniqid":
                $temp['name'] = uniqid().".".pathinfo($temp['name'], PATHINFO_EXTENSION);
                break;
        }

        if (!in_array(strtolower(pathinfo($temp['name'], PATHINFO_EXTENSION)), array("gif", "jpg", "png", "bmp"))) {
            return $modx->error->failure($modx->lexicon('frontendeditor.error_file_extension'));
        }

        $path = $modx->getOption('frontendeditor.upload_path', null, "images/Article Pictures/");

        $resourcePath = MODX_ASSETS_PATH . $path. "resource-id-" . $resource_id . "/";

        if(!is_dir($resourcePath) ? mkdir($resourcePath, 0755, true) : true) {
            move_uploaded_file($temp['tmp_name'], $resourcePath . $temp['name']);
        }else{
            return $modx->error->failure($modx->lexicon('frontendeditor.error_create_upload_folder') . ": ". $resourcePath, array('id' => $scriptProperties['id']));
        }

        $response['url'] = $fileUrl = MODX_ASSETS_URL . $path.  "resource-id-" . $resource_id . "/" . $temp['name'];
        return $modx->error->success('', $response);
    } else {
        return $modx->error->failure($modx->lexicon('frontendeditor.error_no_upload_file'));
    }

}else{
    return $modx->error->failure($modx->lexicon('error_resource_id',array('id' => $scriptProperties['id'])));
}

function sanitizeFileName($dangerousFilename, $replace = '_'){
    $string = " $-+!*'(),{}|\\^~[]`<>#%\";/?:@&=";
    $length = strlen($string);
    $dangerousCharacters = array();
    for ($i=0; $i<$length; $i++) {
        $dangerousCharacters[$i] = $string[$i];
    }
return str_replace($dangerousCharacters, $replace, $dangerousFilename);
}