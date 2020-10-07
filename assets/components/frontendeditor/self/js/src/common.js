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
        this.state = {};

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

            this.initOptions();
            this.initEditableAreasEvents();
        }
    }

    initOptions() {
        this.editableAreas.forEach((el) => {
            el.id = this.constructor.generateUUID();
            let options = el.dataset.frontendeditor.split(",");
            let firstOption = options[0].trim();

            if(this._isInt(firstOption)) {
                el.dataset.frontendeditorResourceId = firstOption;
                el.title = `ID: ${firstOption}`;

                if (1 in options) {
                    el.dataset.frontendeditor = options[1].trim();
                    el.title = `ID: ${firstOption} Filed: ${options[1].trim()}`;
                }else{
                    console.log(`${this.lexicon['error_options_format']} ${options}`)
                    return;
                }
                if (2 in options)
                    el.dataset.frontendeditorEditor = options[2].trim();
            }else{
                el.dataset.frontendeditorResourceId = this.options.id;
                el.dataset.frontendeditor = firstOption;
                el.title = `Filed: ${firstOption}`;

                if (1 in options) {
                    el.dataset.frontendeditorEditor = options[1].trim();
                }
            }


        });
    }

    initEditableAreasEvents() {
        this.editableAreas.forEach((elin) => {
            const fe = this;
            elin.oninput = function() {
                fe.editableAreas.forEach((elout) => {
                    if(elin.dataset.frontendeditorResourceId === elout.dataset.frontendeditorResourceId)
                        if(this.options.menutitleBehavior === '2' && 'linked' in elin.dataset) {
                            if ((elout.dataset.frontendeditor === elin.dataset.linked || elin.dataset.frontendeditor === elout.dataset.frontendeditor) && elin !== elout)
                                elout.innerHTML = elin.innerHTML;
                        } else {
                            if (elin.dataset.frontendeditor === elout.dataset.frontendeditor && elin !== elout )
                                elout.innerHTML = elin.innerHTML;
                        }
                });
            }.bind(fe, elin);
        });
    }

    loadContent($onloadFunction, $process = false) {

        let data = new FormData();
        data.append("action", "getall");

        this.editableAreas.forEach((el) => {
            let id = el.dataset.frontendeditorResourceId;
            if (!data.getAll("ids[]").includes(id))
                data.append("ids[]", id);
        });

        data.append("process", $process);


        this._send(data, function ({currentTarget}) {
            let error = false;
            if (currentTarget.status === 200 && currentTarget.response.success) {
                let objects = currentTarget.response.object;
                this.editableAreas.forEach((el) => {
                    el.id = this.constructor.generateUUID();
                    let id = el.dataset.frontendeditorResourceId;
                    let field = el.dataset.frontendeditor;

                    if (field in objects[id]) {
                        if((this.options.menutitleBehavior === '1' || this.options.menutitleBehavior === '2') && field === 'menutitle' && objects[id]['menutitle'] === '') {
                            el.dataset.linked = 'pagetitle';

                            if(this.options.menutitleBehavior === '2')
                                if(el.dataset.frontendeditorResourceId !== this.options.id) {
                                    el.title = `ID: ${el.dataset.frontendeditorResourceId} Filed: ${field} -> ${el.dataset.linked}`;
                                }else{
                                    el.title = `Filed: ${field} -> ${el.dataset.linked}`;
                                }

                            this.editableAreas.forEach((elp) => {
                                if(elp.dataset.frontendeditorResourceId === el.dataset.frontendeditorResourceId && elp.dataset.frontendeditor === el.dataset.linked) {
                                    elp.dataset.linked = 'menutitle';
                                }
                            });
                        }
                        if('linked' in el.dataset && objects[id]['pagetitle'] !== '')
                            el.innerHTML = objects[id]['pagetitle'];
                        else
                            el.innerHTML = objects[id][field];
                        el.dataset.frontendeditorLoadData = `true`;
                        this.state[el.id] = el.innerHTML;
                    }else{
                        this.constructor.messageBoxShow(5000, "error").innerHTML = `${this.lexicon['error_content_for']} ${field}`;
                        error = true;
                        this.state[el.id] = null;
                    }
                });
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
                        switch (el.dataset.frontendeditorEditor) {
                            case 'simple':
                                el.setAttribute('contenteditable',true);
                                break;
                            case 'tinymce':
                            default:
                                fe.constructor.tinymceInit(el, fe);
                                break;
                        }
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
                fe.editableAreas.forEach(function (el) {
                    if(el.dataset.frontendeditorEditor === 'simple')
                        el.removeAttribute('contenteditable');
                });
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
            if(tinyMCE.get(el.id) && tinyMCE.get(el.id).undoManager.hasUndo())
                result = true;
        });
        return result
    }

    save() {
        let data = new FormData();
        data.append("action", "update");

        this.editableAreas.forEach((el) => {
            if(el.dataset.frontendeditorLoadData && this.state[el.id] !== null && this.state[el.id] !== el.innerHTML) {
                let ResourceId = "r" + el.dataset.frontendeditorResourceId;
                if (!data.has(ResourceId+ "[id]"))
                    data.append(ResourceId+ "[id]", el.dataset.frontendeditorResourceId);

                if(!(this.options.menutitleBehavior === '2' && el.dataset.frontendeditor === 'menutitle'))
                    if (!data.has(ResourceId + "[" + el.dataset.frontendeditor + "]"))
                        data.append(ResourceId + "[" + el.dataset.frontendeditor + "]", encodeURIComponent(el.innerHTML));

                this.state[el.id] = el.innerHTML;
            }
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

    _isInt(value) {
        return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
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
            file_picker_types: 'image',
            file_picker_callback: function(callback, url, type) {
                tinymce.activeEditor.windowManager.openUrl({
                    title: "MODX Resource Browser",
                    url: '/manager/index.php?a=browser'+ (fe.options.media !== "" ? '&source=' + fe.options.madia : '') +'&frontendeditor=1',
                    onMessage: function (api, data) {
                        if (data.mceAction === 'browserSelectCompleted') {
                            callback(data.url);
                            api.close();
                        }
                    }
                });
                return false;
            }
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

