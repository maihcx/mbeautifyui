// a product of maihcx @maiphp
! function(_plugin, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((_plugin = "undefined" != typeof globalThis ? globalThis : _plugin || self).window = _plugin.window || {})
}(this, (function(_plugin) {
    "use strict";

    function MBeautifyUI(option){
        var $this = {};

        $this.Controler = {
            isNullOrEmpty: function(value){
                if (typeof value == "string") value = value.trim();
                if (typeof value == "boolean") return false;
                if (value == '' || value == null || value == undefined || value === 0 || value === '0'){
                    return true;
                }
                return false;
            }, CopyImageToClipboard: async function(options) {
                const is_safari = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent);
                const is_firefox = navigator.userAgent.indexOf("Firefox") >= 0;

                function imageToBlob(imageURL) {
                    const img = new Image;
                    var c = document.createElement("canvas");
                    const ctx = c.getContext("2d");
                    img.crossOrigin = "";
                    img.src = imageURL;
                    return new Promise(resolve => {
                        img.onload = function () {
                            c.width = this.naturalWidth;
                            c.height = this.naturalHeight;
                            ctx.drawImage(this, 0, 0);
                            c.toBlob((blob) => {
                                c = null;
                                resolve(blob);
                            }, "image/png", 0.75);
                        };
                    });
                }

                if(is_safari) {
                    navigator.clipboard.write([
                        new ClipboardItem({
                            "image/png": new Promise(async (resolve, reject) => {
                                try {
                                const blob = await imageToBlob(options.url);
                                    resolve(new Blob([blob], { type: "image/png" }));
                                } catch (err) {
                                    reject(err);
                                }
                            }),
                        }),
                    ]).then(() => function(){
                        if (options.complete){
                            options.complete();
                        }
                    }).catch((err) => function(){
                        // Error
                        if (options.error){
                            options.error('Lỗi không xác định');
                        }
                    });
                }
                else if (is_firefox){
                    if (options.error){
                        console.log(err);
                        options.error('Trình duyệt không được hỗ trợ');
                    }
                }
                else{
                    navigator?.permissions?.query({ name: "clipboard-write" }).then(async (result) => {
                        if (result.state === "granted") {
                            const type = "image/png";
                            const blob = await imageToBlob(options.url);
                            let data = [new ClipboardItem({ [type]: blob })];
                            navigator.clipboard.write(data).then(() => {
                                if (options.complete){
                                    options.complete();
                                }
                            }).catch((err) => {
                                if (options.error){
                                    options.error('Lỗi không xác định');
                                }
                            });
                        }
                        else{
                            if (options.error){
                                options.error('Không được cấp quyền ở hệ thống này!');
                            }
                        }
                    });
                }
            }, getElementsByQuery(queryCommon){
                var queryItems = null
                if (typeof queryCommon == 'string'){
                    queryItems = document.querySelectorAll(queryCommon)
                }
                else{
                    queryItems = queryCommon;
                }
                if ($this.Controler.isNullOrEmpty(queryItems)){
                    return false;
                }
                else {
                    if (!queryItems.entries){
                        queryItems = [queryItems];
                    }
                }
                return queryItems;
            }, onThemeChanged: function(callback){
                if ($this.EVENTS.SYSTEM_THEME_CHANGED == null){
                    $this.EVENTS.SYSTEM_THEME_CHANGED = [];
                }
                $this.EVENTS.SYSTEM_THEME_CHANGED.push(callback);
            }, offThemeChanged: function(){
                $this.EVENTS.SYSTEM_THEME_CHANGED = null;
            }, setTheme: function(THEME_NUM){
                var theme_str = 'NULL';

                const window_media_contructor = window.matchMedia('(prefers-color-scheme: dark)');
                $this.Controler.unbindEvents(window_media_contructor, {change: $this.MBEAUTIFYUI.WindowsThemeChangeEvent});
                if (THEME_NUM == $this.THEME.AUTO){
                    theme_str = "AUTO";
                    document.body.classList.add('auto-theme');
                    document.body.classList.remove('light-theme');
                    document.body.classList.remove('dark-theme');

                    if (window_media_contructor.matches){
                        document.body.classList.add('dark-theme');
                    }
                    else{
                        document.body.classList.add('light-theme');
                    }
    
                    $this.Controler.bindEvents(window_media_contructor, {change: $this.MBEAUTIFYUI.WindowsThemeChangeEvent});
                }
                else if (THEME_NUM == $this.THEME.LIGHT){
                    theme_str = "LIGHT";
                    document.body.classList.remove('auto-theme');
                    document.body.classList.add('light-theme');
                    document.body.classList.remove('dark-theme');
                }
                else if (THEME_NUM == $this.THEME.DARK){
                    theme_str = "DARK";
                    document.body.classList.remove('auto-theme');
                    document.body.classList.remove('light-theme');
                    document.body.classList.add('dark-theme');
                }

                if ($this.EVENTS.SYSTEM_THEME_CHANGED != null){
                    $this.EVENTS.SYSTEM_THEME_CHANGED.forEach(element => {
                        element({THEME: theme_str});
                    });
                }
            }, getPathOfEvent(event){
                return event.composedPath && event.composedPath();
            }, jsExtend() {
                function protected_ObjectMerge(current, updates) {
                    for (var key in updates) {
                        if (!current.hasOwnProperty(key) || typeof updates[key] !== 'object') current[key] = updates[key];
                        else protected_ObjectMerge(current[key], updates[key]);
                    }
                    return current;
                }

                var current = {};
                for (var key in arguments) {
                    const updates = arguments[key];
                    if (updates && !$this.Controler.isNullOrEmpty(updates)){
                        current = protected_ObjectMerge(current, updates);
                    }
                }
                return current;
            }, jsCopyObject(obj) {
                if (obj) {
                    return JSON.parse(JSON.stringify(obj));
                }
                return obj;
            }, eventStored: {
                getEventNames() {
                    return Object.keys($this.FORM_DATA.event_controlers);
                }, getEvent(element) {
                    return $this.FORM_DATA.event_controlers[event_name].filter(({node}) => node === element);
                }, setEvent(element, event_name, handler, options = null) {
                    if (!(event_name in $this.FORM_DATA.event_controlers)) {
                        $this.FORM_DATA.event_controlers[event_name] = []
                    }

                    $this.FORM_DATA.event_controlers[event_name].push({node: element, handler: handler, options: options});
                }, removeEvent(element, event_name, private_handler = null) {
                    var events_removed = [];
                    if (private_handler == null || private_handler == false) {
                        if ($this.FORM_DATA.event_controlers[event_name]) {
                            events_removed = $this.FORM_DATA.event_controlers[event_name].filter(({node}) => node === element);
                            $this.FORM_DATA.event_controlers[event_name] = $this.FORM_DATA.event_controlers[event_name].filter(({node}) => node !== element);
                        }
                    }
                    else {
                        var index_delete = 0;
                        $this.FORM_DATA.event_controlers[event_name] && $this.FORM_DATA.event_controlers[event_name].filter(({node}) => node === element).forEach(({node, handler, options}) => {
                            // node.removeEventListener(event, handler, options)
                            if ($this.FORM_DATA.event_controlers[event_name] && private_handler === handler) {
                                events_removed.push($this.FORM_DATA.event_controlers[event_name][index_delete]);
                                $this.FORM_DATA.event_controlers[event_name].splice(index_delete, 1);
                                return false;
                            }
                            index_delete++;
                        });
                    }

                    if ($this.FORM_DATA.event_controlers[event_name] && $this.FORM_DATA.event_controlers[event_name].length == 0) {
                        delete $this.FORM_DATA.event_controlers[event_name];
                    }

                    return events_removed;
                }
            }, bindEvents(queryCommon, bindOption, options = null) {
                var queryItems = $this.Controler.getElementsByQuery(queryCommon),
                    bindEvents = Object.keys(bindOption);
            
                if (queryItems){
                    if (queryItems.length > 0){
                        queryItems.forEach(item => {
                            bindEvents.forEach(event_name => {
                                const handler = bindOption[event_name];
                                $this.Controler.eventStored.setEvent(item, event_name, handler, options);

                                item.addEventListener(event_name, handler, options);
                            });
                        });
                    }
                }
            }, unbindEvents(queryCommon, bindOption){
                var queryItems = $this.Controler.getElementsByQuery(queryCommon),
                    bindEvents = Object.keys(bindOption);
            
                if (queryItems && queryItems.length > 0){
                    queryItems.forEach(item => {
                        bindEvents.forEach(event_name => {
                            $this.Controler.eventStored.removeEvent(item, event_name, bindOption[event_name]).forEach(function(event_data) {
                                if (bindOption[event_name] == undefined || (event_data.handler.name == bindOption[event_name].name && event_data.handler === bindOption[event_name])) {
                                    item.removeEventListener(event_name, event_data.handler, event_data.options);
                                }
                            });
                        });
                    });
                }
            }, unbindAllEvents(queryCommon){
                var queryItems = $this.Controler.getElementsByQuery(queryCommon);
                const SYSTEM_EVENT_STOREDS = $this.Controler.eventStored.getEventNames();

                if (queryItems){
                    if (queryItems.length > 0){
                        queryItems.forEach(item => {
                            SYSTEM_EVENT_STOREDS.forEach(event_name => {
                                $this.Controler.eventStored.removeEvent(item, event_name).forEach(event_data => {
                                    item.removeEventListener(event_name, event_data['handler']);
                                });
                            });
                        });
                    }
                }
            }, setStyleToElements(element, styles, value = null) {
                var apply_styles = {};
                if (typeof styles == 'string'){
                    apply_styles[styles] = value;
                }
                else{
                    Object.keys(styles).forEach(key => {
                        apply_styles[key] = styles[key];
                    });
                }
            
                var queryItems = null
                if (typeof element == 'string'){
                    queryItems = document.querySelectorAll(element)
                }
                else{
                    queryItems = element;
                }
            
                if (!$this.Controler.isNullOrEmpty(queryItems)){
                    if (queryItems.length > 0){
                        if (typeof queryItems == 'object'){
                            for (let i = 0; i < queryItems.length; i++){
                                const item = queryItems[i];
                                Object.keys(apply_styles).forEach(key => {
                                    item.style[key] = apply_styles[key];
                                });
                            }
                        }
                        else{
                            queryItems.forEach(item => {
                                if (!$this.Controler.isNullOrEmpty(item)) {
                                    Object.keys(apply_styles).forEach(key => {
                                        item.style[key] = apply_styles[key];
                                    });
                                }
                            });
                        }
                    }
                    else{
                        if (!$this.Controler.isNullOrEmpty(queryItems.style)) {
                            Object.keys(apply_styles).forEach(key => {
                                queryItems.style[key] = apply_styles[key];
                            });
                        }
                    }
                }
            }, eventTrigger(element, eventSTR) {
                var event = new Event(eventSTR);
                element.dispatchEvent(event);
            }, randomString(length = 5) {
                var result           = '';
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }, XHRSendRequest(objData) {
                var xmlhttp = new XMLHttpRequest(),
                    dataSend = null,
                    isForm = objData.data.constructor === FormData
                ;
                xmlhttp.open(objData.method ?? 'GET', objData.url, objData.async ?? true);
                if (objData.contentType === undefined) {
                    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                }
                else if (typeof objData.contentType === 'string') {
                    xmlhttp.setRequestHeader('Content-type', objData.contentType);
                }
                if (objData.event) {
                    xmlhttp.onreadystatechange = function() {
                        xmlhttp.readyState == 4 && (
                            (xmlhttp.status == 200 && objData.event.done && objData.event.done({statusCode: xmlhttp.status, data: xmlhttp.response})) ||
                            (xmlhttp.status != 200 && objData.event.error && objData.event.error({statusCode: xmlhttp.status, statusText: xmlhttp.statusText, data: xmlhttp.response}))
                        )
                    }
                }
                if (objData.data) {
                    if (isForm) {
                        dataSend = objData.data
                    }
                    else {
                        dataSend = new URLSearchParams();
                        Object.keys(objData.data).forEach(key => {
                            let data_value = objData.data[key];
                            if (!!data_value && data_value.constructor === Object) {
                                dataSend.set(key, JSON.stringify(data_value));
                            }
                            else if (!!data_value && data_value.constructor === Array) {
                                dataSend.set(key, data_value.toString());
                            }
                            else {
                                dataSend.set(key, data_value);
                            }
                        });
                    }
                }
                xmlhttp.send(dataSend);
                return xmlhttp;
            }, getStyleOfElement(queryCommon) {
                let style = getComputedStyle($this.Controler.getElementsByQuery(queryCommon)[0]);
                return style;
            }, async queueExcuteTasking(task) {
                for (let _task of task) {
                    await new Promise(resolve => {
                        _task(resolve);
                    });
                }
            }, async queueExcuteStories(task, key = 'main') {
                if (!$this.FORM_DATA.queue_stored[key]) $this.FORM_DATA.queue_stored[key] = [];
                $this.FORM_DATA.queue_stored[key].push(task);
                if (!$this.FORM_DATA.queue_stored[key].isStated) {
                    $this.FORM_DATA.queue_stored[key].isStated = true;

                    let index = 0;
                    while (true) {
                        if (index >= $this.FORM_DATA.queue_stored[key].length) {
                            $this.FORM_DATA.queue_stored[key] = [];
                            delete $this.FORM_DATA.queue_stored[key];
                            break;
                        }

                        await new Promise(resolve => {
                            $this.FORM_DATA.queue_stored[key][index](resolve);
                        });
                        
                        index++;
                    }
                }
            }, nodeCreator(data) {
                let element_creation = document.createElement(data.node);
                return this.nodeCloner(element_creation, data, true);
            }, nodeCloner(node = document.documentElement, _nodeOption = null, systemNodeCreate = false) {
                let nodeOption = $this.Controler.jsCopyObject(_nodeOption), element_creation = (systemNodeCreate == true) ? node : node.cloneNode(true);
                // (nodeOption.id) && (element_creation.id = nodeOption.id);
                // (nodeOption.id == null) && (element_creation.removeAttribute('id'));
                // (nodeOption.name) && (element_creation.name = nodeOption.name);
                // (nodeOption.name == null) && (element_creation.removeAttribute('name'));
                // (nodeOption.type) && (element_creation.type = nodeOption.type);
                // (nodeOption.textContent) && (element_creation.textContent = nodeOption.textContent);
                // (nodeOption.value) && (element_creation.value = nodeOption.value);
                // (nodeOption.src) && (element_creation.src = nodeOption.src);
                // (nodeOption.alt) && (element_creation.alt = nodeOption.alt);
                // (nodeOption.colSpan) && (element_creation.colSpan = nodeOption.colSpan);
                // (nodeOption.readOnly !== undefined) && (element_creation.readOnly = nodeOption.readOnly);

                (nodeOption.classList) && (((typeof nodeOption.classList == 'string') && element_creation.classList.add(nodeOption.classList)) || ((typeof nodeOption.classList == 'object') && element_creation.classList.add(...nodeOption.classList)));
                delete nodeOption.classList;

                const LOOP_PROPERTIES = ['style', 'dataset'];
                LOOP_PROPERTIES.forEach(LOOP_PROPERTY => {
                    for (let key in nodeOption[LOOP_PROPERTY]) {
                        element_creation[LOOP_PROPERTY][key] = nodeOption[LOOP_PROPERTY][key];
                    }
                    delete nodeOption[LOOP_PROPERTY];
                });
                if (nodeOption.event) {
                    for (let key in nodeOption.event) {
                        element_creation.addEventListener(key, nodeOption.event[key]);
                    }
                    delete nodeOption.event;
                }

                for (let key in nodeOption) {
                    (nodeOption[key] == null) ? (element_creation.removeAttribute(key)) : (element_creation[key] = nodeOption[key]);
                }
                return element_creation;
            }, f_text2node: function(text) {
                return document.createRange().createContextualFragment(text).firstChild;
            }, text2node: function(text) {
                return document.createRange().createContextualFragment(text).childNodes;
            }
        };

        $this.Controller = $this.Controler;
        
        $this.CONFIG = {
            UI_KEY: 'mBeautifyUi',
            IMG_SOURCE: '..',
            ID_KEY: 'MBeautifyUI',
            ANIMATION_TIME: 150,
            LOW_PROFILE_MODE: false
        };

        $this.SYSTEM = {
            get LOW_PROFILE_MODE() {
                return $this.CONFIG.LOW_PROFILE_MODE;
            },
            set LOW_PROFILE_MODE(mode) {
                $this.CONFIG.LOW_PROFILE_MODE = mode;

                if (mode == true){
                    document.body.classList.remove('high-end-devices');
                    document.body.classList.add('low-end-devices');
                }
                else {
                    document.body.classList.add('high-end-devices');
                    document.body.classList.remove('low-end-devices');
                }
            }
        };
    
        $this.DEF_UI = {
            renderNode: function(id_key) {
                const PARENT_PANEL = $this.Controller.nodeCreator({node: 'div', classList: 'MBeautifyUI', id: id_key}),
                      TOOLTIP_LAYOUT = $this.Controller.nodeCreator({node: 'div', classList: ['tooltip-layout', 'global-blur-background', 'global-border-radius-line', 'no-selector', 'm-no-display']})
                ;
                TOOLTIP_LAYOUT.appendChild($this.Controller.nodeCreator({node: 'div', classList: 'tooltip-layout-content'}));

                PARENT_PANEL.append(
                    document.createComment('HTML Poupup Box'),
                    $this.Controller.nodeCreator({node: 'div', classList: 'popup-center', id: 'popup_center'}),
                    document.createComment('HTML Tooltip Box'),
                    TOOLTIP_LAYOUT,
                    document.createComment('HTML ContextMenu'),
                    $this.Controller.nodeCreator({node: 'div', id: 'allContextMenu'}),
                    document.createComment('HTML File Infor'),
                    $this.Controller.nodeCreator({node: 'div', classList: ['background-blur-layout', 'file-infor-panel'], id: 'file_infor_layout'}),
                    document.createComment('TOAST NOTIFICATION'),
                    $this.Controller.nodeCreator({node: 'div', classList: ['m-toast-area', 'global-blur-background', 'm-no-display']})
                );

                return PARENT_PANEL;
            },
            unrenderHtml: {
                loading: '<div class="background-blur-child" id="loadingCus"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>'
            }
        };
    
        $this.FORM_DATA = {
            // key[str] -> content[data] -> control
            context_menu: [],
            context_menu_initialize: [],
            form_information: {},
            tooltip_storage: {is_intitialize: false, is_show: false, current_callback: null, current_element: null, callback_stored: {}, 
                setCallback: function(classet, callback) {
                    $this.FORM_DATA.tooltip_storage.callback_stored[classet] = callback;
                    $this.FORM_DATA.tooltip_storage.is_intitialize = true;
                }, getCallback: function(classet = null) {
                    if ($this.Controller.isNullOrEmpty(classet)) {
                        return this.callback_stored;
                    }
                    else {
                        return this.callback_stored[classet];
                    }
                }
            },
            event_controlers: [],
            messages_data: [],
            is_menu_touch: false,
            queue_stored: {}
        };

        $this.THEME = {
            AUTO: 0,
            LIGHT: 1,
            DARK: 2
        };

        $this.EVENTS = {
            SYSTEM_THEME_CHANGED: null,
            onThemeChanged: function(callback){
                if ($this.EVENTS.SYSTEM_THEME_CHANGED == null){
                    $this.EVENTS.SYSTEM_THEME_CHANGED = [];
                }
                $this.EVENTS.SYSTEM_THEME_CHANGED.push(callback);
            }, offThemeChanged: function(){
                $this.EVENTS.SYSTEM_THEME_CHANGED = null;
            }
        };

        $this.MBEAUTIFYUI = {
            WindowsThemeChangeEvent: function(event){
                const newColorScheme = event.matches ? "DARK" : "LIGHT";
                if (newColorScheme == "DARK"){
                    document.body.classList.add('auto-theme');
                    document.body.classList.remove('light-theme');
                    document.body.classList.add('dark-theme');
                }
                else{
                    document.body.classList.add('auto-theme');
                    document.body.classList.add('light-theme');
                    document.body.classList.remove('dark-theme');
                }

                if ($this.EVENTS.SYSTEM_THEME_CHANGED != null){
                    $this.EVENTS.SYSTEM_THEME_CHANGED.forEach(element => {
                        element({THEME: "AUTO", SYSTEM_THEME: newColorScheme});
                    });
                }
            }
        };
        
        var _CONFIG = $this.Controller.jsExtend($this.CONFIG, option);
        
        const m_is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        $this.renderAutoTooltip = function(apply_class, callback = null){
            // don't allower in mobile
            if (m_is_mobile){
                return false;
            }
            let tooltip_storage = $this.FORM_DATA.tooltip_storage;
            let flag_bind = tooltip_storage.is_intitialize;

            tooltip_storage.setCallback(apply_class, callback);
            if (!flag_bind && document.readyState == 'complete'){
                let tooltip_time = null, e_event = null, e_event_callback = {innerItem: null, is_ShowTooltip: false};
                const TOOLTIP_PANEL = document.getElementsByClassName('tooltip-layout')[0],
                moveRF = function(e){
                    if (e != null){
                        const tooltip_layout = document.getElementsByClassName('tooltip-layout')[0];
                        
                        if (TOOLTIP_PANEL.classList.contains('m-no-display')) {
                            fnc_closeTooltip();
                        }
                        
                        tooltip_layout.classList.remove('m-no-display');

                        let pageX = e.clientX,
                            pageY = e.clientY;
                        if (pageX == undefined){
                            pageX = e.detail.clientX;
                            pageY = e.detail.clientY;
                        }
    
                        if ((pageY + 20) - tooltip_layout.offsetHeight < 0 && (tooltip_layout.offsetHeight + (pageY + 20)) > window.innerHeight){
                            tooltip_layout.style.left = (pageX + 10) + 'px';
                            tooltip_layout.style.bottom = '0px';
                        }
                        else if ((tooltip_layout.offsetHeight + (pageY + 20)) > window.innerHeight){
                            tooltip_layout.style.left = (pageX + 10) + 'px';
                            tooltip_layout.style.top = (pageY - tooltip_layout.offsetHeight - 4) + 'px';
                        }
                        else{
                            tooltip_layout.style.left = (pageX + 10) + 'px';
                            tooltip_layout.style.top = (pageY + 20) + 'px';
                        }
        
                        if ((pageX + 10) - tooltip_layout.offsetWidth < 0 && (tooltip_layout.offsetWidth + (pageX + 10)) > window.innerWidth){
                            tooltip_layout.style.left = '0px';
                        }
                        else if ((tooltip_layout.offsetWidth + (pageX + 10)) > window.innerWidth){
                            tooltip_layout.style.left = (pageX - tooltip_layout.offsetWidth - 2)  + 'px';
                        }
                        else{
                            tooltip_layout.style.left = (pageX + 10) + 'px';
                        }

                        setTimeout(() => {
                            tooltip_layout.classList.add('view');
                        }, 1);
                    }
                }, my_load_event = function(e){
                    e_event = e;
                }, fnc_tooltipStart = function(bind_key_run, itemShowTooltip) {
                    if (tooltip_storage.current_element != itemShowTooltip && !tooltip_storage.is_show){
                        fnc_closeTooltip();
                        tooltip_storage.current_callback = tooltip_storage.getCallback(bind_key_run);
                        tooltip_storage.current_element = itemShowTooltip;
                        tooltip_storage.is_show = true;
                        $this.Controller.bindEvents(document, {mousemove: my_load_event});
                        tooltip_time = setTimeout(function(){
                            e_event_callback.is_ShowTooltip = true;
                            e_event_callback.innerItem = tooltip_storage.current_element;
                            let tooltip_content = tooltip_storage.current_element.dataset.title;
                            if ($this.Controller.isNullOrEmpty(tooltip_content)){
                                tooltip_content = tooltip_storage.current_element.getElementsByClassName("tooltip-content")[0].innerHTML;
                            }
                            document.querySelector('.tooltip-layout .tooltip-layout-content').innerHTML = tooltip_content;
                            $this.Controller.bindEvents(tooltip_storage.current_element, {mousemove: moveRF});
                            
                            moveRF(e_event);
                            $this.Controller.unbindEvents(document, {mousemove: my_load_event});

                            if (tooltip_storage.current_callback != null){
                                tooltip_storage.current_callback(e_event_callback);
                            }
                        }, 300);
                    }
                }, fnc_tooltipStop = function(event){
                    if (tooltip_storage.is_show) {
                        setTimeout(() => {
                            if (tooltip_time != null){
                                clearTimeout(tooltip_time);
                                if (tooltip_storage.current_element != null){
                                    $this.Controller.unbindEvents(tooltip_storage.current_element, {mousemove: moveRF});
                                    e_event_callback.is_ShowTooltip = false;
                                    if (tooltip_storage.current_callback != null){
                                        tooltip_storage.current_callback(e_event_callback);
                                    }
                                    e_event_callback.innerItem = null;
                                    tooltip_storage.current_element = null;
                                }
                            }
                            $this.Controller.unbindEvents(document, {mousemove: my_load_event});
    
                            $this.Controller.bindEvents(TOOLTIP_PANEL, {
                                transitionend: fnc_closeTooltip}
                            );
        
                            tooltip_storage.is_show = false;
                            TOOLTIP_PANEL.classList.remove('view');
                        }, 20);
                    }
                }, fnc_closeTooltip = function () {
                    $this.Controller.unbindEvents(TOOLTIP_PANEL, {
                        transitionend: fnc_closeTooltip}
                    );

                    if (tooltip_storage.is_show == false) {
                        TOOLTIP_PANEL.classList.add('m-no-display');
                    }
                };

                $this.Controller.bindEvents(window, {mousemove: function(event) {
                    const EVENT_PATH = $this.Controller.getPathOfEvent(event);
                    let flag_run = false,
                        item_start = null,
                        bind_key_run = null
                    ;

                    for (let bind_key in tooltip_storage.getCallback()) {
                        EVENT_PATH.forEach(element_path => {
                            if (!$this.Controller.isNullOrEmpty(element_path.classList) && element_path.classList.contains(bind_key)){
                                flag_run = true;
                                item_start = element_path;
                                bind_key_run = bind_key;
                                return true;
                            }
                        });
                        if (flag_run){
                            break;
                        }
                    }

                    if (flag_run){
                        if (tooltip_storage.current_element != item_start){
                            fnc_tooltipStop(event);
                        }
                        fnc_tooltipStart(bind_key_run, item_start);
                    }
                    else{
                        fnc_tooltipStop(event);
                    }
                }});
            }
        }
    
        $this.Message = {
            showToastNotification: async function(msg, time = 5000) {
                const TOAST_PANEL = $this.Controller.nodeCreator({node: 'div', classList: ['m-toast', 'global-blur-background']}),
                      TOAST_CONTENT = $this.Controller.nodeCreator({node: 'span', classList: 'm-toast-content', textContent: msg}),
                      TOAST_AREA = document.querySelector(`#${$this.CONFIG.ID_KEY} > .m-toast-area`)
                ;
                TOAST_AREA.classList.remove('m-no-display');

                TOAST_PANEL.appendChild(TOAST_CONTENT);

                const SHOWED_HANDLE = function() {
                    setTimeout(() => {
                        TOAST_PANEL.classList.add('hidding');
                        $this.Controller.unbindEvents(TOAST_PANEL, {
                            transitionend: SHOWED_HANDLE 
                        });
                        $this.Controller.setStyleToElements(TOAST_PANEL, {
                            height: '0px', padding: '0px'
                        });
                        $this.Controller.bindEvents(TOAST_PANEL, {
                            transitionend: function() {
                                TOAST_PANEL.remove();

                                if (!TOAST_AREA.querySelector('.m-toast:not(.hidding)')) {
                                    TOAST_AREA.classList.add('m-no-display');
                                }
                            } 
                        });
                    }, time);
                }

                $this.Controller.bindEvents(TOAST_PANEL, {
                    transitionend: SHOWED_HANDLE 
                });
                
                TOAST_AREA.insertBefore(TOAST_PANEL, TOAST_AREA.childNodes[0]);
                const FIXED_HEIGHT = TOAST_PANEL.offsetHeight;

                $this.Controller.setStyleToElements(TOAST_PANEL, {
                    height: '0px', padding: '0px', transition: `all ${$this.CONFIG.ANIMATION_TIME}ms`
                });

                setTimeout(() => {
                    $this.Controller.setStyleToElements(TOAST_PANEL, {
                        height: FIXED_HEIGHT + 'px', padding: null
                    });

                    $this.Controller.setStyleToElements(TOAST_AREA, {
                        width: 'fit-content'
                    });
                    const FIXED_WIDTH_AREA_TOAST = TOAST_AREA.offsetWidth;
                    $this.Controller.setStyleToElements(TOAST_AREA, {
                        width: (FIXED_WIDTH_AREA_TOAST + 1) + 'px'
                    });
                }, 10);
            }, showDialog: async function(object) {
                if ($this.FORM_DATA.messages_data.filter(arrData => arrData != undefined).length == 0) $this.FORM_DATA.messages_data = [];
                const MAIN_BACKGROUND = $this.Controller.nodeCreator({node: 'div', classList: ['background-blur-layout', 'popup-layout']}),
                      MAIN_POPUP_CONTENT = $this.Controller.nodeCreator({node: 'div', classList: ['popup-content', 'global-border-radius-8px']}),
                      INDEX_DATA = $this.FORM_DATA.messages_data.length
                ;
                var input_elements = [],
                    obj_input_elements = {},
                    box_data = {},
                    show_animate_zoomin_option = {}
                ;
                box_data.index = INDEX_DATA;
                box_data.backgroundElement = MAIN_BACKGROUND;
                box_data.popupElement = MAIN_POPUP_CONTENT;
                !object.type && (object.type = $this.Message.type.NOTIFICATION);
                
                MAIN_BACKGROUND.appendChild(MAIN_POPUP_CONTENT);
                object.style && $this.Controller.setStyleToElements(MAIN_POPUP_CONTENT, object.style);

                let dataBuilder = function() {
                    let returnData = null;
                    if (object.type == $this.Message.type.INPUTTEXT || object.type == $this.Message.type.QUESTION) {
                        if (input_elements.length > 0) {
                            if (object.inputs) {
                                returnData = {};
                                input_elements.forEach(inputItem => {
                                    obj_input_elements[inputItem.id] = inputItem;
                                    returnData[inputItem.id] = inputItem.type == 'checkbox' ? inputItem.checked : inputItem.value;
                                });
                            }
                            else {
                                obj_input_elements = input_elements[0];
                                returnData = input_elements[0].value;
                            }
                        }
                    }
                    return returnData;
                }, closeAnimate = function(callback = null) {
                    show_animate_zoomin_option.IsCancel = true;
                    $this.effector(MAIN_BACKGROUND).hide({done: function() {
                        delete $this.FORM_DATA.messages_data[INDEX_DATA];
                        if ($this.FORM_DATA.messages_data.filter(arrData => arrData != undefined).length == 0) $this.FORM_DATA.messages_data = [];
                        callback && callback();
                        MAIN_BACKGROUND.remove();
                    }});
                    $this.effector(MAIN_POPUP_CONTENT).zoomOut();
                }, handleBoxState = function(state) {
                    let terminal_processing = {cancel: false, targetObject: box_data, close: closeAnimate},
                        local_terminal_processing = terminal_processing;
                        
                    if (state !== null) {
                        if (object.type == $this.Message.type.NOTIFICATION) {
                            terminal_processing.value = true;
                        }
                        else if (object.type == $this.Message.type.QUESTION) {
                            dataBuilder();
                            terminal_processing.value = state;
                            terminal_processing.elements = obj_input_elements;
                        }
                        else if (object.type == $this.Message.type.INPUTTEXT) {
                            terminal_processing.elements = obj_input_elements;
                            terminal_processing.value = dataBuilder();
                        }
                        if (object.type != $this.Message.type.INPUTTEXT || state !== false) {
                            local_terminal_processing = terminal_processing;
                            object.events && object.events.confirming && object.events.confirming(local_terminal_processing);
                            if (!local_terminal_processing.cancel) {
                                local_terminal_processing = terminal_processing;
                                object.events && object.events.confirmed && object.events.confirmed(local_terminal_processing.value);
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    local_terminal_processing = terminal_processing;
                    const BACKWARD_DIALOG = $this.Message.getDialog(box_data).backward;
                    BACKWARD_DIALOG && BACKWARD_DIALOG.header.buttons[0].focus();
                    object.events && object.events.closing && object.events.closing(local_terminal_processing);
                    if (!local_terminal_processing.cancel) {
                        closeAnimate(function() {
                            object.events && object.events.close && object.events.close();
                        });
                    }
                    else {
                        return false;
                    }
                    return true;
                }

                // header render
                const HEADER_CONFIG = {
                    title: object.title,
                    canClose: object.canClose ?? true,
                    closeButton: {
                        events: {
                            click: function() {
                                if (object.type == $this.Message.type.NOTIFICATION) {
                                    handleBoxState(true);
                                }
                                else if (object.type == $this.Message.type.QUESTION) {
                                    handleBoxState(false);
                                }
                                else if (object.type == $this.Message.type.INPUTTEXT) {
                                    handleBoxState(null);
                                }
                            }
                        }
                    }
                }
                const headerCreated = $this.Message.DIALOG_HEADER_CREATOR(HEADER_CONFIG);
                MAIN_POPUP_CONTENT.appendChild(headerCreated.element);
                box_data.header = headerCreated;

                // body render
                const BODY_PANEL = $this.Controller.nodeCreator({node: 'div', classList: 'body-content'});
                box_data.body = {}
                if (object.type == $this.Message.type.NOTIFICATION || object.type == $this.Message.type.QUESTION) {
                    BODY_PANEL.innerHTML = `<div class="m-none_outline-box" style="width: 100%"><div class="m-none_outline-box-content">${object.contentText}</div></div>`;
                    box_data.body.contentText = object.contentText;

                    if (object.type == $this.Message.type.QUESTION) {
                        if (object.inputs) {
                            object.inputs.forEach(input => {
                                !input.events && (input.events = {});
                                const INPUT_CONFIG = {
                                    id: input.id ?? 'xbox'+$this.Controller.randomString(),
                                    value: input.value ?? '',
                                    checked: input.checked ?? false,
                                    type: input.type,
                                    text: input.text,
                                    events: {keypress: function(event) {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleBoxState(true);
                                        }
                                    }, ...input.events}
                                }
                                const PARENT_INPUT_NONE_OUTLINE = $this.Controller.nodeCreator({node: 'div', classList: 'm-none_outline-box'}), 
                                      INPUT_ELEMENT = $this.Message.DIALOG_INPUT_CREATOR(INPUT_CONFIG)
                                ;

                                PARENT_INPUT_NONE_OUTLINE.appendChild(INPUT_ELEMENT)
                                BODY_PANEL.appendChild(PARENT_INPUT_NONE_OUTLINE);
                                input_elements.push(INPUT_ELEMENT.getElementsByTagName('input')[0]);
                            });
                        }
                    }
                }
                else if (object.type == $this.Message.type.INPUTTEXT) {
                    if (object.inputs) {
                        const PARENT_INPUT_NONE_OUTLINE = $this.Controller.nodeCreator({node: 'div', classList: 'm-none_outline-box'});
                        object.inputs.forEach(input => {
                            !input.events && (input.events = {});
                            const INPUT_CONFIG = {
                                id: input.id ?? 'xbox'+$this.Controller.randomString(),
                                value: input.value ?? '',
                                checked: input.checked ?? false,
                                type: input.type,
                                text: input.text,
                                readOnly: input.readOnly,
                                events: {keypress: function(event) {
                                    if (event.key === "Enter" && input.type != 'textarea') {
                                        event.preventDefault();
                                        handleBoxState(true);
                                    }
                                }, ...input.events}
                            }
                            const INPUT_ELEMENT = $this.Message.DIALOG_INPUT_CREATOR(INPUT_CONFIG);
                            PARENT_INPUT_NONE_OUTLINE.appendChild(INPUT_ELEMENT)
                            input_elements.push(INPUT_ELEMENT.querySelector('input, textarea'));
                        });
                        BODY_PANEL.appendChild(PARENT_INPUT_NONE_OUTLINE);
                    }
                    else {
                        const INPUT_CONFIG = {
                            id: 'xbox'+$this.Controller.randomString(),
                            value: object.value ?? '',
                            type: 'text',
                            events: {keypress: function(event) {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleBoxState(true);
                                }
                            }}
                        }
                        const PARENT_INPUT_NONE_OUTLINE = $this.Controller.nodeCreator({node: 'div', classList: 'm-none_outline-box'}),
                              INPUT_ELEMENT = $this.Message.DIALOG_INPUT_CREATOR(INPUT_CONFIG)
                        ;

                        PARENT_INPUT_NONE_OUTLINE.appendChild(INPUT_ELEMENT);
                        BODY_PANEL.appendChild(PARENT_INPUT_NONE_OUTLINE);
                        input_elements.push(INPUT_ELEMENT.getElementsByTagName('input')[0]);
                    }
                }
                MAIN_POPUP_CONTENT.appendChild(BODY_PANEL);
                box_data.body.element = BODY_PANEL;
                box_data.body.inputs = input_elements;

                let footer_config = {buttons: []};
                if (object.footerButtons) {
                    // chưa có ý tưởng
                    object.footerButtons.forEach(footer_button => {
                        let constructor_button = {
                            text: footer_button.text,
                            value: footer_button.value,
                            events: {...footer_button.events},
                            allowSubmit: footer_button.allowSubmit 
                        }
                        if (constructor_button.allowSubmit) {
                            constructor_button.events.click = function() {
                                handleBoxState(constructor_button.value);
                            }
                        }
                        footer_config.buttons.push(constructor_button);
                    });
                }
                else {
                    if (object.type == $this.Message.type.NOTIFICATION) {
                        footer_config.buttons.push({
                            text: 'OK', events: {
                                click: function() {
                                    handleBoxState(true);
                                }
                            }
                        });
                        MAIN_BACKGROUND.addEventListener('mousedown', function() {
                            handleBoxState(true);
                        });
                    }
                    else if (object.type == $this.Message.type.QUESTION || object.type == $this.Message.type.INPUTTEXT) {
                        footer_config.buttons.push({
                            text: 'Huỷ', events: {
                                click: function() {
                                    handleBoxState(false);
                                }
                            }
                        });
    
                        footer_config.buttons.push({
                            text: 'OK', events: {
                                click: function() {
                                    handleBoxState(true);
                                }
                            }
                        });
                        MAIN_BACKGROUND.addEventListener('mousedown', function() {
                            handleBoxState(false);
                        });
                    }
                }

                // footer render
                const footerCreated = $this.Message.DIALOG_FOOTER_CREATOR(footer_config);
                MAIN_POPUP_CONTENT.appendChild(footerCreated.element);
                box_data.footer = footerCreated;

                // add popup to page
                document.getElementById('popup_center').appendChild(MAIN_BACKGROUND);

                // animation open
                $this.effector(MAIN_BACKGROUND).show({done: function() {
                    if (object.type == $this.Message.type.INPUTTEXT) {
                        input_elements[0].focus();
                        input_elements[0].value += ' ';
                        input_elements[0].value = input_elements[0].value.trim();
                    }
                    else {
                        footerCreated.buttons[0].focus();
                    }
                    object.events && object.events.render && object.events.render(box_data);
                }});
                $this.effector(MAIN_POPUP_CONTENT).zoomIn(show_animate_zoomin_option);

                // handle events
                MAIN_POPUP_CONTENT.addEventListener('mousedown', function() {
                    window.event.cancelBubble = true;
                });
                $this.FORM_DATA.messages_data[INDEX_DATA] = box_data;
                object.events && object.events.ready && object.events.ready(box_data);
            }, DIALOG_HEADER_CREATOR: function(object) {
                const HEAD_PANEL = $this.Controller.nodeCreator({node: 'div', classList: 'header-controls'}),
                      HEAD_TITLE = $this.Controller.nodeCreator({node: 'span', classList: 'popup-title', innerHTML: object.title}),
                      CLOSE_BUTTON = document.createElement('button')
                ;
                let buttons_created = [];

                HEAD_PANEL.appendChild(HEAD_TITLE);

                if (object.canClose !== false) {
                    !object.closeButton && (object.closeButton = {});
                    CLOSE_BUTTON.classList.add('m-box-button', 'mini', 'close', 'm-tooltip-box');
                    CLOSE_BUTTON.dataset.title = object.closeButton.title ?? 'Đóng';
                    if (object.closeButton.events) {
                        Object.keys(object.closeButton.events).forEach(eventName => {
                            CLOSE_BUTTON.addEventListener(eventName, object.closeButton.events[eventName]);
                        });
                    }

                    buttons_created.push(CLOSE_BUTTON);
                    HEAD_PANEL.appendChild(CLOSE_BUTTON);
                }
                return {element: HEAD_PANEL, buttons: buttons_created};
            }, DIALOG_INPUT_CREATOR: function(object) {
                const INPUT_PANEL = $this.Controller.nodeCreator({node: 'div', classList: 'm-outline-box'}),
                      INPUT_BOX = $this.Controller.nodeCreator({node: 'div', classList: 'content-input-box'}),
                      INPUT_ELEMENT = $this.Controller.nodeCreator({node: object.type == 'textarea' ? 'textarea' : 'input', classList: 'input-text', id: object.id, value: object.value ?? '', readOnly: object.readOnly ?? false})
                ;

                if (!$this.Controller.isNullOrEmpty(object.text)) {
                    INPUT_PANEL.appendChild($this.Controller.nodeCreator({node: 'span', classList: 'content-input-text', innerHTML: object.text}));
                }

                INPUT_ELEMENT.type != 'textarea' && (INPUT_ELEMENT.type = object.type ?? 'text');
                // (object.style) && (INPUT_ELEMENT.style = object.style);

                if (object.type == 'checkbox') {
                    INPUT_PANEL.classList.add('check-box');
                    INPUT_ELEMENT.checked = object.checked ?? false
                }

                if (object.events) {
                    Object.keys(object.events).forEach(eventName => {
                        INPUT_ELEMENT.addEventListener(eventName, object.events[eventName]);
                    });
                }

                // object.event && $this.Controller.bindEvents(INPUT_ELEMENT, object.event);
                INPUT_BOX.appendChild(INPUT_ELEMENT);
                INPUT_PANEL.appendChild(INPUT_BOX);

                return INPUT_PANEL;
            }, DIALOG_FOOTER_CREATOR: function(object) {
                const FOOTER_PANEL = $this.Controller.nodeCreator({node: 'div', classList: 'footer-controls'});
                let buttonElements = [];

                if (object.buttons) {
                    object.buttons.forEach(button => {
                        const BUTTON_CREATOR = $this.Controller.nodeCreator({node: 'button', classList: 'global-border-radius-4px', textContent: button.text});
                        
                        if (button.events) {
                            Object.keys(button.events).forEach(eventName => {
                                BUTTON_CREATOR.addEventListener(eventName, button.events[eventName]);
                            });
                        }

                        FOOTER_PANEL.appendChild(BUTTON_CREATOR);
                        buttonElements.push(BUTTON_CREATOR);
                    });
                }

                return {element: FOOTER_PANEL, buttons: buttonElements};
            }, get type() {
                return {
                    NOTIFICATION: 0,
                    INPUTTEXT: 1,
                    QUESTION: 2,
                };
            }, getDialog: function(currentDialog = null) {
                let returnData = null;
                if ($this.FORM_DATA.messages_data.filter(arrData => arrData != undefined).length == 0){
                    $this.FORM_DATA.messages_data = [];
                    returnData = {data: []};
                }
                else {
                    returnData = {data: $this.FORM_DATA.messages_data};
                    if (currentDialog) {
                        const BACK_DATA = $this.FORM_DATA.messages_data.filter(arrData => arrData != undefined && arrData.index < currentDialog.index),
                              NEXT_DATA = $this.FORM_DATA.messages_data.filter(arrData => arrData != undefined && arrData.index > currentDialog.index);
                        returnData.backward = BACK_DATA ? BACK_DATA[BACK_DATA.length - 1] : null;
                        returnData.forward = NEXT_DATA ? NEXT_DATA[NEXT_DATA.length - 1] : null;
                    }
                }
                
                return returnData;
            }
        }
    
        $this.ContextMenu = {
            set: function(strKey, control) {
                delete $this.FORM_DATA.context_menu[strKey];
                $this.FORM_DATA.context_menu[strKey] = $this.Controller.jsExtend($this.FORM_DATA.context_menu[strKey], control);
                $this.ContextMenu.renderContextMenu(strKey);

                if (m_is_mobile) {
                    let intermediate_processing = function (event) {
                        const MENU_CHECKED = event.srcElement || event.target;
                        if (!MENU_CHECKED || !MENU_CHECKED.classList || (!MENU_CHECKED.classList.contains('line-context-item-containt') && !MENU_CHECKED.classList.contains('context-item'))) {
                            $this.Controller.unbindEvents(window, {
                                blur: intermediate_processing
                            });
                            $this.Controller.unbindEvents(document, {
                                touchstart: intermediate_processing
                            });
                            $this.ContextMenu.hide(strKey);
                        }
                    }
    
                    $this.Controller.bindEvents(window, {
                        blur: intermediate_processing
                    }, {once : true});
                    $this.Controller.bindEvents(document, {
                        touchstart: intermediate_processing
                    }, {once : true});
                }
                else {
                    let intermediate_processing = function () {
                        $this.Controller.unbindEvents(window, {
                            blur: intermediate_processing
                        });
                        $this.Controller.unbindEvents(document, {
                            click: intermediate_processing
                        });
                        $this.ContextMenu.hide(strKey);
                    }
    
                    $this.Controller.bindEvents(window, {
                        blur: intermediate_processing
                    }, {once : true});
                    $this.Controller.bindEvents(document, {
                        click: intermediate_processing
                    }, {once : true});
                }
            }, get: function(strKey){
                return $this.FORM_DATA.context_menu[strKey].deffData;
            }, show: async function(strKey, event) {
                $this.ContextMenu.hideOrder(strKey);
                var pageX = event.pageX,
                    pageY = event.pageY;
                if (pageX == undefined){
                    pageX = event.detail.clientX;
                    pageY = event.detail.clientY;
                }
                if (pageX == undefined){
                    pageX = event.targetTouches[0].pageX;
                    pageY = event.targetTouches[0].pageY;
                }
                const PANEL_MENUCONTEXT = document.querySelector(`#${$this.CONFIG.ID_KEY} > #allContextMenu`),
                      PANEL_INSIDE_MENUCONTEXT = PANEL_MENUCONTEXT.querySelector(`#HEAD_${strKey}`)
                ;
                if (!$this.Controller.isNullOrEmpty(PANEL_INSIDE_MENUCONTEXT)){
                    const MENUCONTEXT_CONTENT = PANEL_INSIDE_MENUCONTEXT.querySelector(`#${strKey}`),
                          WIDTH_MENU = MENUCONTEXT_CONTENT.offsetWidth,
                          HEIGHT_MENU = MENUCONTEXT_CONTENT.offsetHeight,
                          MENU_ITEM = MENUCONTEXT_CONTENT.getElementsByClassName('context-item');
                          
                    const PROMISE1 = new Promise(function(resolve, reject) {
                        $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, {transition: 'none', transform: 'translateY(-50px)', opacity: 0.1});
                        PANEL_INSIDE_MENUCONTEXT.dataset.axisY = 'top';
                        if ((pageY - 12) - HEIGHT_MENU < 0 && (HEIGHT_MENU + pageY + 12) > window.innerHeight){
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, 'top', (window.innerHeight - HEIGHT_MENU) + 'px');
                        }
                        else if ((HEIGHT_MENU + pageY + 12) > window.innerHeight){
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, 'bottom', (window.innerHeight - pageY - 0) + 'px');
                            PANEL_INSIDE_MENUCONTEXT.dataset.axisY = 'bottom';
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, {transition: 'none', transform: 'translateY(50px)', opacity: 0.1});
                        }
                        else{
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, 'top', (pageY + 12) + 'px');
                        }
        
                        PANEL_INSIDE_MENUCONTEXT.dataset.axisX = 'left';
                        // $this.Controller.setStyleToElements(MENU_ITEM, 'left', '-100px');
                        if ((pageX + 12) - WIDTH_MENU < 0 && (WIDTH_MENU + pageX + 12) > window.innerWidth){
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, 'left', '12px');
                        }
                        else if ((WIDTH_MENU + pageX + 12) > window.innerWidth){
                            // $this.Controller.setStyleToElements(MENU_ITEM, 'left', '100px');
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, 'right', (window.innerWidth - pageX + 6) + 'px');
                            PANEL_INSIDE_MENUCONTEXT.dataset.axisX = 'right';
                        }
                        else{
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, 'left', (pageX + 12) + 'px');
                        }
                        resolve();
                    });
                    await PROMISE1;

                    const PROMISE2 = new Promise(function(resolve, reject) {

                        setTimeout(function() {
                            let transform = 'translateY(-5px)';
                            if (PANEL_INSIDE_MENUCONTEXT.dataset.axisY == 'top') {
                                transform = 'translateY(5px)';
                            }
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, {transition: ($this.CONFIG.ANIMATION_TIME) + 'ms', transform: transform, opacity: 0.85});
                        }, 20);

                        setTimeout(() => {
                            $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, {transition: ($this.CONFIG.ANIMATION_TIME / 2) + 'ms', transform: null, opacity: 1});
                        }, ($this.CONFIG.ANIMATION_TIME) + 20);

                        resolve();
                    });

                    await PROMISE2;
                }
            }, hide: async function(strKey){
                const PANEL_MENUCONTEXT = document.querySelector(`#${$this.CONFIG.ID_KEY} > #allContextMenu`),
                      PANEL_INSIDE_MENUCONTEXT = PANEL_MENUCONTEXT.querySelector(`#HEAD_${strKey}`)
                ;
                if (!$this.Controller.isNullOrEmpty(PANEL_INSIDE_MENUCONTEXT)){
                    const CONTEXT_MENU_ITEMS = $this.FORM_DATA.context_menu[strKey].itemData;
                    for (let key_inside in CONTEXT_MENU_ITEMS) {
                        $this.Controller.unbindEvents(CONTEXT_MENU_ITEMS[key_inside].element, {click: CONTEXT_MENU_ITEMS[key_inside].event.onclick});
                    }
                    const MENUCONTEXT_CONTENT = PANEL_INSIDE_MENUCONTEXT.querySelector(`#${strKey}`);

                    setTimeout(() => {
                        let transform = 'translateY(50px)';
                        if (PANEL_INSIDE_MENUCONTEXT.dataset.axisY == 'top') {
                            transform = 'translateY(-50px)';
                        }
                        $this.Controller.setStyleToElements(MENUCONTEXT_CONTENT, {transition: ($this.CONFIG.ANIMATION_TIME) + 'ms', opacity: 0, transform: transform});
                    }, 20);

                    setTimeout(() => {
                        PANEL_INSIDE_MENUCONTEXT.remove();
                        delete $this.FORM_DATA.context_menu[strKey];
                    }, ($this.CONFIG.ANIMATION_TIME) + 20);
                }
            }, hideOrder: function(strKey_keep){
                const PANEL_INSIDE_MENUCONTEXT = document.querySelectorAll(`#${$this.CONFIG.ID_KEY} > #allContextMenu > div:not([id="HEAD_${strKey_keep}"]) > div`);

                if (PANEL_INSIDE_MENUCONTEXT.length > 0){
                    for (let index = 0; index < PANEL_INSIDE_MENUCONTEXT.length; index++) {
                        $this.ContextMenu.hide(PANEL_INSIDE_MENUCONTEXT[index].id);
                    }
                }
            }, renderContextMenu: function(contextKey){
                let renderArray = [],
                    style_injection_text = '',
                    style_injection_element = document.createElement('style')
                ;

                const deffData = $this.FORM_DATA.context_menu[contextKey].deffData,
                      itemData = $this.FORM_DATA.context_menu[contextKey].itemData;
                if (deffData && itemData) {
                    const PANEL_CONTEXT_MENU = document.querySelector(`#${$this.CONFIG.ID_KEY} > #allContextMenu`),
                          CONTEXT_INJECTION_ELEMENT = $this.Controller.nodeCreator({node: 'div', classList: ['context-menu', 'global-blur-background', 'global-border-radius-line', 'hide-ui'], id: contextKey})
                    ;
                    let panel_inside_menucontext = PANEL_CONTEXT_MENU.querySelector(`#HEAD_${contextKey}`);

                    for (const key in itemData) {
                        const _itemData = itemData[key];
                        var insideRender = renderArray[_itemData.index] = {
                            index: _itemData.index,
                            visible: _itemData.visible,
                            name: key,
                            text: _itemData.text,
                            style: _itemData.style,
                            event: _itemData.event
                        };

                        if (insideRender.visible){
                            style_injection_text += $this.ContextMenu.itemStyleInjectorText({style: insideRender.style, data: {name: insideRender.name}});
                            CONTEXT_INJECTION_ELEMENT.appendChild($this.ContextMenu.itemInjectorElement({name: insideRender.name, text: insideRender.text}));
                        }
                    }

                    style_injection_element.appendChild($this.Controller.f_text2node(style_injection_text));

                    for (const key in deffData) {
                        CONTEXT_INJECTION_ELEMENT.dataset[key] = deffData[key];
                    }

                    // render to display
                    
                    if ($this.Controller.isNullOrEmpty(panel_inside_menucontext)){
                        panel_inside_menucontext = document.createElement('div');
                        panel_inside_menucontext.id = "HEAD_" + contextKey;

                        PANEL_CONTEXT_MENU.appendChild(panel_inside_menucontext);
                    }
                    else{
                        panel_inside_menucontext.innerHTML = '';
                    }
                    
                    panel_inside_menucontext.appendChild(style_injection_element);
                    panel_inside_menucontext.appendChild(CONTEXT_INJECTION_ELEMENT);
                    
                    // bind event handlers
                    renderArray.forEach(insideRender => {
                        const MENU_PANEL = document.querySelector(`#allContextMenu > #HEAD_${contextKey} > #${contextKey} > #${insideRender.name}`);
                        if (MENU_PANEL && insideRender.event && insideRender.event.onclick){
                            $this.FORM_DATA.context_menu[contextKey].itemData[MENU_PANEL.id]['element'] = MENU_PANEL;

                            if (m_is_mobile) {
                                $this.Controller.unbindEvents(MENU_PANEL, {
                                    touchend: null
                                });
                                $this.Controller.bindEvents(MENU_PANEL, {
                                    touchend: function(event) {
                                        insideRender.event.onclick(event);
                                        $this.ContextMenu.hide(contextKey);
                                    }
                                });
                            }
                            else {
                                $this.Controller.unbindEvents(MENU_PANEL, {
                                    click: insideRender.event.onclick
                                });
                                $this.Controller.bindEvents(MENU_PANEL, {
                                    click: insideRender.event.onclick
                                });
                            }
                        }
                    });
                }
            }, itemInjectorElement: function(obj){
                var content_element = $this.Controller.nodeCreator({node: 'div', classList: ['context-item', 'global-border-radius-4px', 'no-selector'], id: obj.name}),
                    child_content_element = $this.Controller.nodeCreator({node: 'div', classList: 'line-context-item-containt', textContent: obj.text})
                ;
                content_element.appendChild(child_content_element);
                return content_element;
            }, itemStyleInjectorText: function(obj){
                var style_injection_text = '',
                    style_injection_text_before_after = ''
                ;
                const obj_style = obj.style,
                      obj_data = obj.data
                ;
                for (const mask_key in obj_style) {
                    if (mask_key == 'after' || mask_key == 'before'){
                        style_injection_text_before_after += `#${obj_data.name} > .line-context-item-containt:${mask_key}{`;
                        for (const key in obj_style[mask_key]) {
                            style_injection_text_before_after += `${key}: ${obj_style[mask_key][key]}`;
                        }
                        style_injection_text_before_after += '}'
                    }
                    else{
                        if (style_injection_text == ''){
                            style_injection_text += `#${obj_data.name} > .line-context-item-containt {`;
                        }
                        style_injection_text += `${mask_key}: ${obj_style[mask_key]}`;
                    }
    
                    if (style_injection_text != ''){
                        style_injection_text += '}';
                    }
                }

                return style_injection_text+style_injection_text_before_after;
            }, getContextMenu: function(strKey) {
                if ($this.Controller.isNullOrEmpty(strKey)) {
                    return $this.FORM_DATA.context_menu
                }
                else {
                    return $this.FORM_DATA.context_menu['strKey'];
                }
            }
        };

        $this.FormInformation = {
            prevent_parent: function(e){
                e.stopPropagation();
            }, set: function(obj){
                $this.FORM_DATA.form_information = $this.Controller.jsExtend($this.FORM_DATA.form_information, obj);
                $this.FormInformation.render();
            }, clear: function() {
                $this.FORM_DATA.form_information = {};
            }, show: function() {
                const FILE_PANEL_LAYOUT = document.getElementById('file_infor_layout');
                $this.Controller.unbindEvents(FILE_PANEL_LAYOUT, {
                    transitionend: null
                });

                FILE_PANEL_LAYOUT.classList.add('show-ui');
                setTimeout(() => {
                    $this.Controller.setStyleToElements(FILE_PANEL_LAYOUT, {'opacity': 1, 'transition': $this.CONFIG.ANIMATION_TIME + 'ms'});
                }, 10);

                $this.Controller.bindEvents(FILE_PANEL_LAYOUT, {
                    mousedown: $this.FormInformation.hide
                });
                $this.Controller.bindEvents(FILE_PANEL_LAYOUT.querySelector('#file_infor'), {
                    mousedown: $this.FormInformation.prevent_parent
                });
            }, hide: function() {
                const FILE_PANEL_LAYOUT = document.getElementById('file_infor_layout');
                $this.Controller.bindEvents(FILE_PANEL_LAYOUT, {
                    transitionend: $this.FormInformation.eraseRender
                });

                $this.Controller.setStyleToElements(FILE_PANEL_LAYOUT, 'opacity', 0);
                setTimeout(() => {
                    FILE_PANEL_LAYOUT.classList.remove('show-ui');
                }, 200);

                $this.Controller.unbindEvents(FILE_PANEL_LAYOUT, {
                    mousedown: $this.FormInformation.hide
                });
                $this.Controller.unbindEvents(FILE_PANEL_LAYOUT.querySelector('#file_infor'), {
                    mousedown: $this.FormInformation.prevent_parent
                });
            }, render: function() {
                const ITEM_DATA = $this.FORM_DATA.form_information
                ;
                
                var file_infor = $this.Controller.nodeCreator({node: 'div', id: 'file_infor', classList: ['file-infor', 'global-blur-background', 'global-border-radius-line', 'global-border-radius-8px']}),
                    file_infor_head = $this.Controller.nodeCreator({node: 'div', id: 'file_infor_head', classList: ['file-infor-head', 'prevent-mouse-event']}),
                    file_infor_body = $this.Controller.nodeCreator({node: 'div', id: 'file_infor_body', classList: 'file-infor-body'})
                ;

                for (const key in ITEM_DATA) {
                    if (key == 'image'){
                        file_infor_head.appendChild($this.FormInformation.htmlInjectionImage(ITEM_DATA[key]));
                    }
                    else{
                        file_infor_body.appendChild($this.FormInformation.htmlInjectionDivElement(ITEM_DATA[key]));
                    }
                }
                
                if (!$this.Controller.isNullOrEmpty(file_infor_head.innerHTML)){
                    file_infor.appendChild(file_infor_head);
                }
                file_infor.appendChild(file_infor_body);

                document.getElementById('file_infor_layout').appendChild(file_infor);
            }, htmlInjectionImage: function(data = {}) {
                return $this.Controller.nodeCreator({node: 'img', id: 'file_infor_image', classList: 'file-infor-image', src: data.src});
            }, htmlInjectionDivElement: function(data = {}) {
                let div_infor = $this.Controller.nodeCreator({node: 'div', classList: 'file-infor-content'});
                
                div_infor.append($this.Controller.nodeCreator({node: 'span', classList: 'file-infor-title', textContent: data.title}), 
                    $this.Controller.nodeCreator({node: 'span', classList: 'file-infor-content', textContent: data.content}));

                return div_infor;
            }, eraseRender: function(event) {
                const EVENT_PATH = $this.Controller.getPathOfEvent(event);

                $this.Controller.unbindEvents(EVENT_PATH[0], {
                    transitionend: null
                });

                EVENT_PATH[0].innerHTML = '';
            }, get isShowing() {
                if (document.getElementById('file_infor_layout').classList.contains('show-ui')) {
                    return true;
                }
                return false;
            }
        };

        $this.LoadingPanel = {
            storedSyncEvents: {syncRunner:[], state: 'hide'},
            protect_HIDE_ELEMENT_END: function() {
                const PANEL = $this.LoadingPanel.getPanel();
                $this.Controller.unbindEvents(PANEL, {transitionend: this.protect_HIDE_ELEMENT_END});
                PANEL.classList.remove('show-ui');
            }, getPanel: function() {
                return document.getElementById('loadingCus');
            }, setParentID: function (parentID) {
                document.getElementById(parentID).appendChild($this.Controller.f_text2node($this.DEF_UI.unrenderHtml.loading));
            }, show: async function () {
                $this.LoadingPanel.storedSyncEvents.syncRunner.push('show');
                if ($this.LoadingPanel.storedSyncEvents.syncRunner.length == 1) {
                    this.advancedProcessing();
                }
            }, hide: async function() {
                $this.LoadingPanel.storedSyncEvents.syncRunner.push('hide');
                if ($this.LoadingPanel.storedSyncEvents.syncRunner.length == 1) {
                    this.advancedProcessing();
                }
            }, async advancedProcessing() {
                const PANEL = $this.LoadingPanel.getPanel();
                if ($this.LoadingPanel.storedSyncEvents.syncRunner.length > 0) {
                    while (true) {
                        const TYPE_DISPLAY = $this.LoadingPanel.storedSyncEvents.syncRunner[0];
                        const promise_runner = new Promise(resolve => {
                            if (TYPE_DISPLAY == $this.LoadingPanel.storedSyncEvents.state) {
                                resolve();
                            }
                            else {
                                $this.LoadingPanel.storedSyncEvents.state = TYPE_DISPLAY;
                                let handleProcess = null;
                                if (TYPE_DISPLAY == 'show') {
                                    handleProcess = function() {
                                        $this.Controller.setStyleToElements(PANEL, {opacity: 1, transition: $this.CONFIG.ANIMATION_TIME + 'ms'});
                                        PANEL.classList.add('show-ui');
                                    }
                                }
                                else {
                                    handleProcess = function() {
                                        $this.Controller.setStyleToElements(PANEL, {opacity: 0, transition: $this.CONFIG.ANIMATION_TIME + 'ms'});
                                    }
                                }
    
                                handleProcess();
    
                                setTimeout(() => {
                                    if (TYPE_DISPLAY == 'hide') {
                                        PANEL.classList.remove('show-ui');
                                    }
                                    $this.Controller.setStyleToElements(PANEL, {transition: 'none'});
                                    resolve();
                                }, $this.CONFIG.ANIMATION_TIME + 20);
                            }
                        });
                        await promise_runner;
                        $this.LoadingPanel.storedSyncEvents.syncRunner.splice(0, 1);
                        if ($this.LoadingPanel.storedSyncEvents.syncRunner.length == 0) {
                            break;
                        }
                    }
                }
            }
        };

        // no longer development
        $this.animate = function(element) {
            const ELEMENTS = $this.Controller.getElementsByQuery(element);
            var localCallback = null;

            const protect_METHOD = {
                protect_HIDE_ELEMENT_END: function() {
                    ELEMENTS.forEach(item => {
                        $this.Controller.unbindEvents(item, {transitionend: protect_METHOD.protect_HIDE_ELEMENT_END});
                        $this.Controller.setStyleToElements(item, {display: 'none', transition: null, opacity: null});
                    });
                    localCallback && localCallback();
                }, protect_SHOW_ELEMENT_END: function() {
                    ELEMENTS.forEach(item => {
                        $this.Controller.unbindEvents(item, {transitionend: protect_METHOD.protect_SHOW_ELEMENT_END});
                        $this.Controller.setStyleToElements(item, {display: 'block', transition: null, opacity: null});
                    });
                    localCallback && localCallback();
                }, protect_HIDE_SWIPE_ELEMENT_END: function() {
                    ELEMENTS.forEach(item => {
                        $this.Controller.unbindEvents(item, {transitionend: protect_METHOD.protect_HIDE_SWIPE_ELEMENT_END});
                        $this.Controller.setStyleToElements(item, {display: 'none', transform: null, transition: null, opacity: null});
                    });
                    localCallback && localCallback();
                }, protect_SHOW_SWIPE_ELEMENT_END: function() {
                    ELEMENTS.forEach(item => {
                        $this.Controller.unbindEvents(item, {transitionend: protect_METHOD.protect_SHOW_SWIPE_ELEMENT_END});
                        $this.Controller.setStyleToElements(item, {display: 'block', transform: null, transition: null, opacity: null});
                    });
                    localCallback && localCallback();
                }, protect_COLLAPSE_ELEMENT_END: function() {
                    ELEMENTS.forEach(item => {
                        $this.Controller.unbindEvents(item, {transitionend: protect_METHOD.protect_COLLAPSE_ELEMENT_END});
                        $this.Controller.setStyleToElements(item, {display: 'none', overflow: null, transition: null, minHeight: null, height: null});
                    });
                    localCallback && localCallback();
                }, protect_EXPAND_ELEMENT_END: function() {
                    ELEMENTS.forEach(item => {
                        $this.Controller.unbindEvents(item, {transitionend: protect_METHOD.protect_EXPAND_ELEMENT_END});
                        $this.Controller.setStyleToElements(item, {display: 'block', overflow: null, transition: null, minHeight: null, height: null});
                    });
                    localCallback && localCallback();
                }
            }

            const ACTIONS = {
                hide: function(animateTime = $this.CONFIG.ANIMATION_TIME, callback = null) {
                    protect_METHOD.protect_SHOW_ELEMENT_END();
                    localCallback = callback;
                    ELEMENTS.forEach(item => {
                        $this.Controller.setStyleToElements(item, {opacity: '1', transition: `all ${animateTime}ms`});

                        setTimeout(() => {
                            $this.Controller.setStyleToElements(item, 'opacity', '0');
                        }, 10);
                    });
                    $this.Controller.bindEvents(ELEMENTS, {transitionend: protect_METHOD.protect_HIDE_ELEMENT_END});
                    return ACTIONS;
                }, show: function(animateTime = $this.CONFIG.ANIMATION_TIME, callback = null) {
                    protect_METHOD.protect_HIDE_ELEMENT_END();
                    localCallback = callback;
                    ELEMENTS.forEach(item => {
                        $this.Controller.setStyleToElements(item, {display: 'block', opacity: '0', transition: `all ${animateTime}ms`});

                        setTimeout(() => {
                            $this.Controller.setStyleToElements(item, 'opacity', '1');
                        }, 10);
                    });
                    $this.Controller.bindEvents(ELEMENTS, {transitionend: protect_METHOD.protect_SHOW_ELEMENT_END});
                    return ACTIONS;
                }, collapse: function(animateTime = $this.CONFIG.ANIMATION_TIME, callback = null) {
                    protect_METHOD.protect_EXPAND_ELEMENT_END();
                    localCallback = callback;
                    ELEMENTS.forEach(item => {
                        $this.Controller.setStyleToElements(item, {display: 'block', height: 'fit-content', minHeight: null, transition: null});
                        const NEW_HEIGHT = item.offsetHeight;
                        $this.Controller.setStyleToElements(item, {display: 'block', height: `${NEW_HEIGHT}px`, minHeight: `${NEW_HEIGHT}px`, transition: `all ${animateTime}ms`});

                        setTimeout(() => {
                            $this.Controller.setStyleToElements(item, {display: 'block', height: '0px', minHeight: '0px', overflow: 'hidden'});
                        }, 10);
                    });
                    $this.Controller.bindEvents(ELEMENTS, {transitionend: protect_METHOD.protect_COLLAPSE_ELEMENT_END});
                    return ACTIONS;
                }, expand: function(animateTime = $this.CONFIG.ANIMATION_TIME, callback = null) {
                    protect_METHOD.protect_COLLAPSE_ELEMENT_END();
                    localCallback = callback;
                    ELEMENTS.forEach(item => {
                        $this.Controller.setStyleToElements(item, {display: 'block', height: 'fit-content', minHeight: null, transition: null});
                        const NEW_HEIGHT = item.offsetHeight;
                        $this.Controller.setStyleToElements(item, {display: 'block', height: '0px', minHeight: '0px', transition: `all ${animateTime}ms`});
                        setTimeout(() => {
                            $this.Controller.setStyleToElements(item, {display: 'block', height: `${NEW_HEIGHT}px`, minHeight: `${NEW_HEIGHT}px`, overflow: 'hidden'});
                        }, 10);
                    });
                    $this.Controller.bindEvents(ELEMENTS, {transitionend: protect_METHOD.protect_EXPAND_ELEMENT_END});
                    return ACTIONS;
                }, scrollTop: function(location) {
                    ELEMENTS.forEach(item => {
                        item.scrollTo({top: location, behavior: 'smooth'});
                    });
                }, hideSwipe: function(animateTime = $this.CONFIG.ANIMATION_TIME, callback = null, type = "left") {
                    protect_METHOD.protect_SHOW_ELEMENT_END();
                    localCallback = callback;
                    let transform = "translateX(-100%)";
                    if (type == 'right') {
                        transform = "translateX(100%)";
                    }
                    ELEMENTS.forEach(item => {
                        $this.Controller.setStyleToElements(item, {opacity: '1', position: 'relative', transition: `${animateTime}ms`});

                        setTimeout(() => {
                            $this.Controller.setStyleToElements(item, {opacity: '0', transform: transform});
                        }, 10);
                    });
                    $this.Controller.bindEvents(ELEMENTS, {transitionend: protect_METHOD.protect_HIDE_SWIPE_ELEMENT_END});
                    return ACTIONS;
                }, showSwipe: function(animateTime = $this.CONFIG.ANIMATION_TIME, callback = null, type = "left") {
                    protect_METHOD.protect_HIDE_ELEMENT_END();
                    localCallback = callback;
                    let transform = "translateX(-100%)";
                    if (type == 'right') {
                        transform = "translateX(100%)";
                    }
                    ELEMENTS.forEach(item => {
                        $this.Controller.setStyleToElements(item, {display: 'block', opacity: '0', transform: transform, transition: `all ${animateTime}ms`});

                        setTimeout(() => {
                            $this.Controller.setStyleToElements(item, {opacity: '1', transform: null});
                        }, 10);
                    });
                    $this.Controller.bindEvents(ELEMENTS, {transitionend: protect_METHOD.protect_SHOW_SWIPE_ELEMENT_END});
                    return ACTIONS;
                }
            }
            return ACTIONS;
        }

        $this.effector = function(element) {
            const ELEMENTS = $this.Controller.getElementsByQuery(element);
            const ACTIONS = {
                show: function(_opts) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
    
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', opacity: '0', transition: null});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 10);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {opacity: '1', transition: `all ${animateTime}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                        resolve();
                                    }, animateTime - 10);
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'show_eff');
                }, hide: function(_opts) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
    
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {opacity: '1', transition: `all ${animateTime - 10}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 10);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, 'opacity', '0');
                                    setTimeout(() => {
                                        $this.Controller.setStyleToElements(item, {display: 'none', transition: null, opacity: null});
                                        child_resolve();
                                        resolve();
                                    }, animateTime - 10);
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'hide_eff');
                }, showSwipe: function(_opts) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME),
                            type = ((_opts && _opts.type) ? _opts.type : 'left'),
                            transform = " translateX(-100%)"
                        ;
    
                        if (type == 'right') {
                            transform = " translateX(100%)";
                        }
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                let StyleOfElement = $this.Controller.getStyleOfElement(item),
                                    HistoryTransform = (StyleOfElement.transform && StyleOfElement.transform != 'none') ? StyleOfElement.transform : '',
                                    HistoryCurentTransform = $this.Controller.isNullOrEmpty(item.transform) ? null : item.transform,
                                    HistoryPosition = (StyleOfElement.position) ? StyleOfElement.position : '',
                                    position = ($this.Controller.isNullOrEmpty(HistoryPosition) || HistoryPosition == 'static') ? 'relative' : HistoryPosition
                                ;
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', opacity: '0', position: position, transform: HistoryTransform + transform, transition: null});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 20);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {opacity: '1', transform: HistoryCurentTransform, transition: `all ${animateTime}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                        resolve();
                                    }, animateTime);
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done(ELEMENTS);
                            resolve();
                            main_resolve();
                        }]);
                    }, 'show_sw_eff');
                }, showSwipeWidth: function(_opts) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
    
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                let stockWidth = '0px';
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', opacity: '0', overflow: 'none', transition: null});
                                    stockWidth = $this.Controller.getStyleOfElement(item).width;
                                    $this.Controller.setStyleToElements(item, {width: '0px'});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 20);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {opacity: '1', width: stockWidth, transition: `all ${animateTime}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, animateTime);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {overflow: null, transition: null});
                                    child_resolve();
                                    resolve();
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'show_sw_w_eff');
                }, hideSwipe: function(_opts) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME),
                            type = ((_opts && _opts.type) ? _opts.type : 'left'),
                            transform = " translateX(-100%)"
                        ;
    
                        if (type == 'right') {
                            transform = " translateX(100%)";
                        }
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                let StyleOfElement = $this.Controller.getStyleOfElement(item),
                                    HistoryTransform = (StyleOfElement.transform && StyleOfElement.transform != 'none') ? StyleOfElement.transform : '',
                                    HistoryPosition = (StyleOfElement.position) ? StyleOfElement.position : '',
                                    position = ($this.Controller.isNullOrEmpty(HistoryPosition) || HistoryPosition == 'static') ? 'relative' : HistoryPosition
                                ;
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', opacity: '1', position: position, transition: null});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 10);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {opacity: '0', transform: HistoryTransform + transform, transition: `all ${animateTime}ms`});
                                    setTimeout(() => {
                                        $this.Controller.setStyleToElements(item, {display: 'none', transition: null, opacity: null, transform: HistoryTransform});
                                        child_resolve();
                                        resolve();
                                    }, animateTime);
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done(ELEMENTS);
                            resolve();
                            main_resolve();
                        }]);
                    }, 'hide_sw_eff');
                }, hideSwipeWidth: function(_opts = null) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
    
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {opacity: '0', width: '0px', overflow: 'none', transition: `all ${animateTime}ms`});
                                    setTimeout(() => {
                                        $this.Controller.setStyleToElements(item, {display: 'none', width: null, overflow: null, opacity: null, transition: null});
                                        child_resolve();
                                        resolve();
                                    }, animateTime);
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'hide_sw_w_eff');
                }, zoomIn: function(_opts = null) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
    
                        const CheckCancel = function(resolve, child_resolve) {
                            if (_opts && _opts.IsCancel == true) {
                                child_resolve();
                                resolve();
                                return true;
                            }
                            return false;
                        }
    
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                let HISTORY_TRANSFORM = $this.Controller.getStyleOfElement(item).transform,
                                    ELEMENT_TRANSFORM = item.style.transform;
                                (!HISTORY_TRANSFORM) && (HISTORY_TRANSFORM = '');
                                ($this.Controller.isNullOrEmpty(ELEMENT_TRANSFORM)) && (ELEMENT_TRANSFORM = null);
        
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(0.7)', transition: null});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 20);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(1)', transition: `all cubic-bezier(0.6, 1.35, 0.75, 1.35) ${animateTime}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, animateTime + 20);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {transform: null});
                                    child_resolve();
                                    resolve();
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'zoom_in_eff');
                }, zoomOut: function(_opts = null) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
    
                        const CheckCancel = function(resolve, child_resolve) {
                            if (_opts && _opts.IsCancel == true) {
                                child_resolve();
                                resolve();
                                return true;
                            }
                            return false;
                        }
    
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                let HISTORY_TRANSFORM = $this.Controller.getStyleOfElement(item).transform,
                                    ELEMENT_TRANSFORM = item.style.transform;
                                (!HISTORY_TRANSFORM) && (HISTORY_TRANSFORM = '');
                                ($this.Controller.isNullOrEmpty(ELEMENT_TRANSFORM)) && (ELEMENT_TRANSFORM = null);
        
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(1)', transition: null});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 20);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {transform: HISTORY_TRANSFORM + ' scale(0.7)', transition: `all cubic-bezier(0, -0.53, 0.68, 0.41) ${animateTime}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, animateTime + 20);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {transform: null});
                                    child_resolve();
                                    resolve();
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'zoom_out_eff');
                }, collapse: function(_opts = null) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
    
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', height: 'fit-content', minHeight: null, transition: null});
                                    const NEW_HEIGHT = item.offsetHeight;
                                    $this.Controller.setStyleToElements(item, {display: 'block', height: `${NEW_HEIGHT}px`, minHeight: `${NEW_HEIGHT}px`, transition: `all ${animateTime}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 10);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', height: '0px', minHeight: '0px', overflow: 'hidden'});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, animateTime);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'none', overflow: null, transition: null, minHeight: null, height: null});
                                    child_resolve();
                                    resolve();
                                }]);
                            });
                        }, function(resolve) {
                            (_opts) && (_opts.self = ELEMENTS);
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'collapse_expand_eff');
                }, expand: function(_opts = null) {
                    if (ELEMENTS.length == 0) return false;
                    $this.Controller.queueExcuteStories(function(main_resolve) {
                        let animateTime = ((_opts && _opts.time) ? _opts.time : $this.CONFIG.ANIMATION_TIME);
                        
                        $this.Controller.queueExcuteTasking([function(resolve) {
                            ELEMENTS.forEach(item => {
                                let NEW_HEIGHT = 0;
                                $this.Controller.queueExcuteTasking([function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', height: 'fit-content', minHeight: null, transition: null, overflow: 'hidden'});
                                    NEW_HEIGHT = item.offsetHeight;
                                    $this.Controller.setStyleToElements(item, {display: 'block', height: '0px', minHeight: '0px'});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, 10)
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', height: `${NEW_HEIGHT}px`, minHeight: `${NEW_HEIGHT}px`, transition: `all ${animateTime}ms`});
                                    setTimeout(() => {
                                        child_resolve();
                                    }, animateTime);
                                }, function(child_resolve) {
                                    $this.Controller.setStyleToElements(item, {display: 'block', overflow: null, transition: null, minHeight: null, height: null});
                                    child_resolve();
                                    resolve();
                                }]);
                            });
                        }, function(resolve) {
                            (_opts && _opts.done) && _opts.done();
                            resolve();
                            main_resolve();
                        }]);
                    }, 'collapse_expand_eff');
                }, scrollTop: function(location) {
                    ELEMENTS.forEach(item => {
                        item.scrollTo({top: location, behavior: 'smooth'});
                    });
                }
            }
            return ACTIONS;
        }
        
        $this.INIT = function() {
            if (document.body.dataset[_CONFIG.UI_KEY] == undefined || document.body.dataset[_CONFIG.UI_KEY] == null) {
                document.body.dataset[_CONFIG.UI_KEY] = true;
                document.body.appendChild($this.DEF_UI.renderNode(_CONFIG.ID_KEY))
            }
            $this.SYSTEM.LOW_PROFILE_MODE = _CONFIG.LOW_PROFILE_MODE;
            if (!m_is_mobile){
                $this.renderAutoTooltip('m-tooltip-box');
            }
        }

        if (document.readyState == 'complete') {
            $this.INIT();
        }
        else {
            $this.Controller.bindEvents(window, {load: function() {
                $this.INIT();
                $this.FORM_DATA.tooltip_storage.is_intitialize = false;
                for (let classet_tooltip in $this.FORM_DATA.tooltip_storage.getCallback()) {
                    $this.renderAutoTooltip(classet_tooltip);
                }
            }});
        }
        return $this;
    }

    _plugin.MBeautifyUI = function(e){
        return MBeautifyUI(e);
    }
}));