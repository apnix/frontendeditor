"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FrontendEditor = function () {
    function FrontendEditor() {
        _classCallCheck(this, FrontendEditor);

        this.editingMode = false;
        this.saved = false;

        document.querySelector("body").innerHTML += "<div class=\"frontendeditor-topbabr\">\n            <div class=\"frontendeditor-message-box\"></div>\n            <button class=\"frontendeditor-button frontendeditor-button-edit\"><i class=\"far fa-edit\"></i><i class=\"far fa-times-circle\"></i></button>\n            <button class=\"frontendeditor-button frontendeditor-button-save\"><i class=\"far fa-save\"></i></button>\n        </div>";
    }

    _createClass(FrontendEditor, [{
        key: "init",
        value: function init(frontendEditorOptions, frontendEditorLexicon) {
            this.options = frontendEditorOptions;
            this.lexicon = frontendEditorLexicon;

            if (this.options.editPermission !== "1") {
                document.querySelector(".frontendeditor-button-edit").disabled = true;
            } else {
                var fe = this;
                fe.editableAreas = [].concat(_toConsumableArray(document.querySelectorAll(fe.options.selector)));

                [].forEach.call(document.querySelectorAll(".frontendeditor-button-edit"), function (el) {
                    el.addEventListener("click", fe.edit.bind(fe), false);
                    el.frontendeditor = fe;
                });

                [].forEach.call(document.querySelectorAll(".frontendeditor-button-save"), function (el) {
                    el.addEventListener("click", fe.save.bind(fe));
                });
            }
        }
    }, {
        key: "loadContent",
        value: function loadContent($onloadFunction) {
            var $process = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            var data = new FormData();
            data.append("action", "getall");
            data.append("id", this.options.id);
            data.append("process", $process);

            this._send(data, function (_ref) {
                var currentTarget = _ref.currentTarget;

                var error = false;
                if (currentTarget.status === 200 && currentTarget.response.success) {
                    var fileds = currentTarget.response.object;
                    this.editableAreas.forEach(function (el) {
                        el.id = this.constructor.generateUUID();
                        if (el.dataset.frontendeditor in fileds) {
                            el.innerHTML = fileds[el.dataset.frontendeditor];
                            el.dataset.frontendeditorLoadData = "true";
                        } else {
                            this.constructor.messageBoxShow(5000, "error").innerHTML = this.lexicon['error_content_for'] + " " + el.dataset.frontendeditor;
                            error = true;
                        }
                    }.bind(this));
                } else {
                    this.constructor.messageBoxShow(5000, "error").innerHTML = this.lexicon['error_content_load'] + "<br>" + currentTarget.status;
                    error = true;
                }
                if (!error) {
                    $onloadFunction();
                }
            }.bind(this));
        }
    }, {
        key: "edit",
        value: function edit(_ref2) {
            var currentTarget = _ref2.currentTarget;

            var fe = this;

            if (!fe.editingMode) {

                // checking browser "Quirks Mode"
                if (document.compatMode === "BackCompat") {
                    this.constructor.messageBoxShow(3600000, "error").innerHTML = this.lexicon['error_browser_back_compat'] + " <a href=\"" + this.options.assetsPath + "self/doc/quirksmode.txt\" target=\"_blank\">" + this.lexicon['see_more'] + "</a>";
                    document.querySelector(".frontendeditor-button-edit").disabled = true;
                    return;
                }

                if (fe.editableAreas.length === 0) {
                    this.constructor.messageBoxShow(10000, "error").innerHTML = this.lexicon['error_no_editable_areas'] + " ";
                    document.querySelector(".frontendeditor-button-edit").disabled = true;
                    return;
                }

                currentTarget.parentElement.children[1].style.visibility = "visible";

                currentTarget.disabled = true;
                document.querySelector(".frontendeditor-topbabr").classList.add("frontendeditor-loading-data");
                fe.loadContent(function () {
                    fe.editableAreas.forEach(function (el) {
                        if (el.dataset.frontendeditorLoadData) fe.constructor.tinymceInit(el, fe);
                    });
                    fe.editingMode = true;
                    fe.saved = false;
                    currentTarget.parentElement.classList.toggle("frontendeditor-edit-mode");
                    document.querySelector("body").classList.add("frontendeditor-areas-highlight");
                    currentTarget.disabled = false;
                    document.querySelector(".frontendeditor-topbabr").classList.remove("frontendeditor-loading-data");
                }, false);
            } else {
                if (fe.saved || !fe.hasChange() || confirm(fe.lexicon['exit_without_saving'])) {
                    tinymce.remove();
                    fe.editingMode = false;
                    currentTarget.disabled = true;
                    document.querySelector(".frontendeditor-topbabr").classList.add("frontendeditor-loading-data");
                    fe.loadContent(function () {
                        currentTarget.disabled = false;
                        document.querySelector(".frontendeditor-topbabr").classList.remove("frontendeditor-loading-data");
                    }, true);

                    currentTarget.parentElement.classList.toggle("frontendeditor-edit-mode");
                    document.querySelector("body").classList.remove("frontendeditor-areas-highlight");
                }
            }
        }
    }, {
        key: "hasChange",
        value: function hasChange() {
            var result = false;
            this.editableAreas.forEach(function (el) {
                if (tinyMCE.get(el.id).undoManager.hasUndo()) result = true;
            });
            return result;
        }
    }, {
        key: "save",
        value: function save() {
            var data = new FormData();
            data.append("action", "update");
            data.append("id", this.options.id);

            this.editableAreas.forEach(function (el) {
                if (el.dataset.frontendeditorLoadData) data.append(el.dataset.frontendeditor, encodeURIComponent(el.innerHTML));
            });

            this._send(data, function (_ref3) {
                var currentTarget = _ref3.currentTarget;

                if (currentTarget.status === 200 && currentTarget.response.success) {
                    this.constructor.messageBoxShow().innerHTML = this.lexicon['exit_saving'];
                    this.saved = true;
                } else {
                    this.constructor.messageBoxShow(5000, "error").innerHTML = this.lexicon['error'] + "<br>" + (currentTarget.status === 200 ? currentTarget.response.success : currentTarget.status);
                }
            }.bind(this));
        }
    }, {
        key: "_send",
        value: function _send(data, onloadFunction) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", this.options.url);
            xhr.responseType = 'json';
            xhr.onload = onloadFunction;
            xhr.send(data);
        }
    }], [{
        key: "messageBoxShow",
        value: function messageBoxShow() {
            var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5000;
            var addclass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

            var messageBox = document.querySelector(".frontendeditor-message-box");
            messageBox.classList.add("frontendeditor-box-show");
            if (addclass !== "") messageBox.classList.add(addclass);
            setTimeout(function () {
                if (addclass !== "") messageBox.classList.remove(addclass);
                messageBox.classList.remove("frontendeditor-box-show");
            }, timeout);
            return messageBox;
        }
    }, {
        key: "tinymceInit",
        value: function tinymceInit(el, fe) {

            var config = {
                selector: "#" + el.id,
                language: fe.options.lang,
                images_upload_handler: function images_upload_handler(blobInfo, success, failure) {

                    var formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    formData.append("action", "upload");
                    formData.append("id", fe.options.id);

                    fe._send(formData, function (_ref4) {
                        var currentTarget = _ref4.currentTarget;

                        if (currentTarget.status === 200 && currentTarget.response.success) {
                            success(currentTarget.response.object["url"]);
                        } else {
                            failure('Error: ' + currentTarget.response.message);
                        }
                    }.bind(this));
                }
            };

            if (fe.options.tinymceConfig) {
                var tinymceConfigString = fe.constructor._decodeEntities(fe.options.tinymceConfig);
                config = Object.assign(config, JSON.parse(tinymceConfigString));
            }

            tinymce.init(config);
        }
    }, {
        key: "generateUUID",
        value: function generateUUID() {
            var d = new Date().getTime();
            var d2 = performance && performance.now && performance.now() * 1000 || 0;
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
                var r = Math.random() * 16;
                if (d > 0) {
                    r = (d + r) % 16 | 0;
                    d = Math.floor(d / 16);
                } else {
                    r = (d2 + r) % 16 | 0;
                    d2 = Math.floor(d2 / 16);
                }
                return (c === "x" ? r : r & 0x3 | 0x8).toString(16);
            });
        }
    }, {
        key: "_decodeEntities",
        value: function _decodeEntities(encodedString) {
            var textArea = document.createElement('textarea');
            textArea.innerHTML = encodedString;
            return textArea.value;
        }
    }]);

    return FrontendEditor;
}();

var frontendeditor = new FrontendEditor();
//# sourceMappingURL=common.js.map