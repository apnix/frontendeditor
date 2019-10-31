class FrontendEditor {

    constructor(){
        this.editingMode = false;
        this.saved = false;

        document.querySelector(`body`).innerHTML+= `<div class="frontendeditor-topbabr">
            <div class="frontendeditor-message-box"></div>
            <button class="frontendeditor-button frontendeditor-button-edit"><i class="far fa-edit"></i><i class="far fa-times-circle"></i></button>
            <button class="frontendeditor-button frontendeditor-button-save"><i class="far fa-save"></i></button>
        </div>`;

    }

    init(frontendEditorOptions, frontendEditorLexicon){
        this.options = frontendEditorOptions;
        this.lexicon = frontendEditorLexicon;

        if(this.options.editPermission !== `1`){
            document.querySelector(`.frontendeditor-button-edit`).disabled = true;
        }else{
            const fe = this;
            fe.editableAreas = [...document.querySelectorAll(fe.options.selector)];

            [].forEach.call(document.querySelectorAll(`.frontendeditor-button-edit`), function (el) {
                el.addEventListener(`click`, fe.edit.bind(fe), false);
                el.frontendeditor = fe;
            });

            [].forEach.call(document.querySelectorAll(`.frontendeditor-button-save`), function (el) {
                el.addEventListener(`click`, fe.save.bind(fe));
            });
        }
    }

    loadContent($onloadFunction, $process = false) {

        let data = new FormData();
        data.append("action", "getall");
        data.append("id", this.options.id);
        data.append("process", $process);

        this._send(data, function ({currentTarget}) {
            let error = false;
            if (currentTarget.status === 200 && currentTarget.response.success) {
                let fileds = currentTarget.response.object;
                this.editableAreas.forEach(function (el) {
                    el.id = this.constructor.generateUUID();
                    if(el.dataset.frontendeditor in fileds) {
                        el.innerHTML = fileds[el.dataset.frontendeditor];
                        el.dataset.frontendeditorLoadData = `true`;
                    }else{
                        this.constructor.messageBoxShow(5000, "error").innerHTML = `${this.lexicon['error_content_for']} ${el.dataset.frontendeditor}`;
                        error = true;
                    }
                }.bind(this));
            } else {
                this.constructor.messageBoxShow(5000, "error").innerHTML = `${this.lexicon['error_content_load']}<br>${currentTarget.status}`;
                error = true;
            }
            if(!error){
                $onloadFunction();
            }
        }.bind(this))
    }

    edit({currentTarget}) {
        const fe = this;

        if(!fe.editingMode) {

            // checking browser "Quirks Mode"
            if(document.compatMode === "BackCompat"){
                this.constructor.messageBoxShow(3600000, "error").innerHTML = `${this.lexicon['error_browser_back_compat']} <a href="${this.options.assetsPath}self/doc/quirksmode.txt" target="_blank">${this.lexicon['see_more']}</a>`;
                document.querySelector(`.frontendeditor-button-edit`).disabled = true;
                return;
            }

            if(fe.editableAreas.length === 0 ){
                this.constructor.messageBoxShow(10000, "error").innerHTML = `${this.lexicon['error_no_editable_areas']} `;
                document.querySelector(`.frontendeditor-button-edit`).disabled = true;
                return;
            }

            currentTarget.disabled = true;
            document.querySelector(`.frontendeditor-topbabr`).classList.add(`frontendeditor-loading-data`);
            fe.loadContent(function () {
                fe.editableAreas.forEach(function (el) {
                    if(el.dataset.frontendeditorLoadData)
                        fe.constructor.tinymceInit(el, fe);
                });
                fe.editingMode = true;
                fe.saved = false;
                currentTarget.parentElement.classList.toggle(`frontendeditor-edit-mode`);
                document.querySelector(`body`).classList.add(`frontendeditor-areas-highlight`);
                currentTarget.disabled = false;
                document.querySelector(`.frontendeditor-topbabr`).classList.remove(`frontendeditor-loading-data`);
            }, false);
        }else{
            if(fe.saved || !fe.hasChange() || confirm(fe.lexicon['exit_without_saving'])) {
                tinymce.remove();
                fe.editingMode = false;
                currentTarget.disabled = true;
                document.querySelector(`.frontendeditor-topbabr`).classList.add(`frontendeditor-loading-data`);
                fe.loadContent(function () {
                    currentTarget.disabled = false;
                    document.querySelector(`.frontendeditor-topbabr`).classList.remove(`frontendeditor-loading-data`);
                }, true);

                currentTarget.parentElement.classList.toggle(`frontendeditor-edit-mode`);
                document.querySelector(`body`).classList.remove(`frontendeditor-areas-highlight`);

            }
        }
    }

    hasChange() {
        let result = false;
        this.editableAreas.forEach(function (el) {
            if(tinyMCE.get(el.id).undoManager.hasUndo())
                result = true;
        });
        return result
    }

    save() {
        let data = new FormData();
        data.append("action", "update");
        data.append("id", this.options.id);

        this.editableAreas.forEach(function (el) {
            if(el.dataset.frontendeditorLoadData)
                data.append(el.dataset.frontendeditor, encodeURIComponent(el.innerHTML));
        });

        this._send(data, function({currentTarget}) {
            if (currentTarget.status === 200 && currentTarget.response.success) {
                this.constructor.messageBoxShow().innerHTML = this.lexicon['exit_saving'];
                this.saved = true;
            } else {
                this.constructor.messageBoxShow(5000, "error").innerHTML = `${this.lexicon['error']}<br>${currentTarget.status === 200 ? currentTarget.response.success : currentTarget.status}`;
            }
        }.bind(this))
    }

    _send(data, onloadFunction) {
        const xhr = new XMLHttpRequest();
        xhr.open(`POST`, this.options.url);
        xhr.responseType = 'json';
        xhr.onload = onloadFunction;
        xhr.send(data);
    }

    static messageBoxShow(timeout = 5000, addclass = "") {
        let messageBox = document.querySelector(`.frontendeditor-message-box`);
        messageBox.classList.add(`frontendeditor-box-show`);
        if(addclass !== "") messageBox.classList.add(addclass);
        setTimeout(function () {
            if(addclass !== "") messageBox.classList.remove(addclass);
            messageBox.classList.remove(`frontendeditor-box-show`);
        }, timeout);
        return messageBox;
    }

    static tinymceInit(el, fe) {

        let config = {
            selector: `#${el.id}`,
            language: fe.options.lang,
            images_upload_handler: function (blobInfo, success, failure) {

                let formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                formData.append("action", "upload");
                formData.append("id", fe.options.id);

                fe._send(formData, function({currentTarget}) {
                    if (currentTarget.status === 200 && currentTarget.response.success) {
                        success(currentTarget.response.object[`url`]);
                    } else {
                        failure('Error: ' + currentTarget.response.message);
                    }
                }.bind(this));
            },
        };

        if(fe.options.tinymceConfig) {
            let tinymceConfigString = fe.constructor._decodeEntities(fe.options.tinymceConfig);
            config = Object.assign(config, JSON.parse(tinymceConfigString));
        }

        tinymce.init(config);
    }

    static generateUUID() {
        let d = new Date().getTime();
        let d2 = (performance && performance.now && (performance.now()*1000)) || 0;
        return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;
            if(d > 0){
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === `x` ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    static _decodeEntities(encodedString) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }

}

var frontendeditor = new FrontendEditor();

