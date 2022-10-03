(() => {
    "use strict";
    const flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length) {
                    spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
                    spollerTitles.forEach((spollerTitle => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    }));
                }
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("[data-spoller]")) {
                    const spollerTitle = el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
                        spollerTitle.classList.toggle("_spoller-active");
                        _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                    }
                    e.preventDefault();
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
                const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                }
            }
            const spollersClose = document.querySelectorAll("[data-spoller-close]");
            if (spollersClose.length) document.addEventListener("click", (function(e) {
                const el = e.target;
                if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
                    const spollersBlock = spollerClose.closest("[data-spollers]");
                    if (spollersBlock.classList.contains("_spoller-init")) {
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        spollerClose.classList.remove("_spoller-active");
                        _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                    }
                }));
            }));
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if ("undefined" !== typeof SmoothScroll) (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function formSubmit() {
        const forms = document.forms;
        if (forms.length) for (const form of forms) {
            form.addEventListener("submit", (function(e) {
                const form = e.target;
                formSubmitAction(form, e);
            }));
            form.addEventListener("reset", (function(e) {
                const form = e.target;
                formValidate.formClean(form);
            }));
        }
        async function formSubmitAction(form, e) {
            const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
            if (0 === error) {
                const ajax = form.hasAttribute("data-ajax");
                if (ajax) {
                    e.preventDefault();
                    const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
                    const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
                    const formData = new FormData(form);
                    form.classList.add("_sending");
                    const response = await fetch(formAction, {
                        method: formMethod,
                        body: formData
                    });
                    if (response.ok) {
                        let responseResult = await response.json();
                        form.classList.remove("_sending");
                        formSent(form, responseResult);
                    } else {
                        alert("Ошибка");
                        form.classList.remove("_sending");
                    }
                } else if (form.hasAttribute("data-dev")) {
                    e.preventDefault();
                    formSent(form);
                }
            } else {
                e.preventDefault();
                if (form.querySelector("._form-error") && form.hasAttribute("data-goto-error")) {
                    const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : "._form-error";
                    gotoblock_gotoBlock(formGoToErrorClass, true, 1e3);
                }
            }
        }
        function formSent(form, responseResult = ``) {
            document.dispatchEvent(new CustomEvent("formSent", {
                detail: {
                    form
                }
            }));
            setTimeout((() => {
                if (flsModules.popup) {
                    const popup = form.dataset.popupMessage;
                    popup ? flsModules.popup.open(popup) : null;
                }
            }), 0);
            formValidate.formClean(form);
            formLogging(`Форма отправлена!`);
        }
        function formLogging(message) {
            FLS(`[Формы]: ${message}`);
        }
    }
    function ssr_window_esm_isObject(obj) {
        return null !== obj && "object" === typeof obj && "constructor" in obj && obj.constructor === Object;
    }
    function extend(target = {}, src = {}) {
        Object.keys(src).forEach((key => {
            if ("undefined" === typeof target[key]) target[key] = src[key]; else if (ssr_window_esm_isObject(src[key]) && ssr_window_esm_isObject(target[key]) && Object.keys(src[key]).length > 0) extend(target[key], src[key]);
        }));
    }
    const ssrDocument = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector() {
            return null;
        },
        querySelectorAll() {
            return [];
        },
        getElementById() {
            return null;
        },
        createEvent() {
            return {
                initEvent() {}
            };
        },
        createElement() {
            return {
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName() {
                    return [];
                }
            };
        },
        createElementNS() {
            return {};
        },
        importNode() {
            return null;
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };
    function ssr_window_esm_getDocument() {
        const doc = "undefined" !== typeof document ? document : {};
        extend(doc, ssrDocument);
        return doc;
    }
    const ssrWindow = {
        document: ssrDocument,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function CustomEvent() {
            return this;
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle() {
            return {
                getPropertyValue() {
                    return "";
                }
            };
        },
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia() {
            return {};
        },
        requestAnimationFrame(callback) {
            if ("undefined" === typeof setTimeout) {
                callback();
                return null;
            }
            return setTimeout(callback, 0);
        },
        cancelAnimationFrame(id) {
            if ("undefined" === typeof setTimeout) return;
            clearTimeout(id);
        }
    };
    function ssr_window_esm_getWindow() {
        const win = "undefined" !== typeof window ? window : {};
        extend(win, ssrWindow);
        return win;
    }
    function makeReactive(obj) {
        const proto = obj.__proto__;
        Object.defineProperty(obj, "__proto__", {
            get() {
                return proto;
            },
            set(value) {
                proto.__proto__ = value;
            }
        });
    }
    class Dom7 extends Array {
        constructor(items) {
            if ("number" === typeof items) super(items); else {
                super(...items || []);
                makeReactive(this);
            }
        }
    }
    function arrayFlat(arr = []) {
        const res = [];
        arr.forEach((el => {
            if (Array.isArray(el)) res.push(...arrayFlat(el)); else res.push(el);
        }));
        return res;
    }
    function arrayFilter(arr, callback) {
        return Array.prototype.filter.call(arr, callback);
    }
    function arrayUnique(arr) {
        const uniqueArray = [];
        for (let i = 0; i < arr.length; i += 1) if (-1 === uniqueArray.indexOf(arr[i])) uniqueArray.push(arr[i]);
        return uniqueArray;
    }
    function qsa(selector, context) {
        if ("string" !== typeof selector) return [ selector ];
        const a = [];
        const res = context.querySelectorAll(selector);
        for (let i = 0; i < res.length; i += 1) a.push(res[i]);
        return a;
    }
    function dom7_esm_$(selector, context) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        let arr = [];
        if (!context && selector instanceof Dom7) return selector;
        if (!selector) return new Dom7(arr);
        if ("string" === typeof selector) {
            const html = selector.trim();
            if (html.indexOf("<") >= 0 && html.indexOf(">") >= 0) {
                let toCreate = "div";
                if (0 === html.indexOf("<li")) toCreate = "ul";
                if (0 === html.indexOf("<tr")) toCreate = "tbody";
                if (0 === html.indexOf("<td") || 0 === html.indexOf("<th")) toCreate = "tr";
                if (0 === html.indexOf("<tbody")) toCreate = "table";
                if (0 === html.indexOf("<option")) toCreate = "select";
                const tempParent = document.createElement(toCreate);
                tempParent.innerHTML = html;
                for (let i = 0; i < tempParent.childNodes.length; i += 1) arr.push(tempParent.childNodes[i]);
            } else arr = qsa(selector.trim(), context || document);
        } else if (selector.nodeType || selector === window || selector === document) arr.push(selector); else if (Array.isArray(selector)) {
            if (selector instanceof Dom7) return selector;
            arr = selector;
        }
        return new Dom7(arrayUnique(arr));
    }
    dom7_esm_$.fn = Dom7.prototype;
    function addClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.add(...classNames);
        }));
        return this;
    }
    function removeClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            el.classList.remove(...classNames);
        }));
        return this;
    }
    function toggleClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        this.forEach((el => {
            classNames.forEach((className => {
                el.classList.toggle(className);
            }));
        }));
    }
    function hasClass(...classes) {
        const classNames = arrayFlat(classes.map((c => c.split(" "))));
        return arrayFilter(this, (el => classNames.filter((className => el.classList.contains(className))).length > 0)).length > 0;
    }
    function attr(attrs, value) {
        if (1 === arguments.length && "string" === typeof attrs) {
            if (this[0]) return this[0].getAttribute(attrs);
            return;
        }
        for (let i = 0; i < this.length; i += 1) if (2 === arguments.length) this[i].setAttribute(attrs, value); else for (const attrName in attrs) {
            this[i][attrName] = attrs[attrName];
            this[i].setAttribute(attrName, attrs[attrName]);
        }
        return this;
    }
    function removeAttr(attr) {
        for (let i = 0; i < this.length; i += 1) this[i].removeAttribute(attr);
        return this;
    }
    function transform(transform) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transform = transform;
        return this;
    }
    function transition(duration) {
        for (let i = 0; i < this.length; i += 1) this[i].style.transitionDuration = "string" !== typeof duration ? `${duration}ms` : duration;
        return this;
    }
    function on(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        function handleLiveEvent(e) {
            const target = e.target;
            if (!target) return;
            const eventData = e.target.dom7EventData || [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            if (dom7_esm_$(target).is(targetSelector)) listener.apply(target, eventData); else {
                const parents = dom7_esm_$(target).parents();
                for (let k = 0; k < parents.length; k += 1) if (dom7_esm_$(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
            }
        }
        function handleEvent(e) {
            const eventData = e && e.target ? e.target.dom7EventData || [] : [];
            if (eventData.indexOf(e) < 0) eventData.unshift(e);
            listener.apply(this, eventData);
        }
        const events = eventType.split(" ");
        let j;
        for (let i = 0; i < this.length; i += 1) {
            const el = this[i];
            if (!targetSelector) for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7Listeners) el.dom7Listeners = {};
                if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
                el.dom7Listeners[event].push({
                    listener,
                    proxyListener: handleEvent
                });
                el.addEventListener(event, handleEvent, capture);
            } else for (j = 0; j < events.length; j += 1) {
                const event = events[j];
                if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
                if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
                el.dom7LiveListeners[event].push({
                    listener,
                    proxyListener: handleLiveEvent
                });
                el.addEventListener(event, handleLiveEvent, capture);
            }
        }
        return this;
    }
    function off(...args) {
        let [eventType, targetSelector, listener, capture] = args;
        if ("function" === typeof args[1]) {
            [eventType, listener, capture] = args;
            targetSelector = void 0;
        }
        if (!capture) capture = false;
        const events = eventType.split(" ");
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                let handlers;
                if (!targetSelector && el.dom7Listeners) handlers = el.dom7Listeners[event]; else if (targetSelector && el.dom7LiveListeners) handlers = el.dom7LiveListeners[event];
                if (handlers && handlers.length) for (let k = handlers.length - 1; k >= 0; k -= 1) {
                    const handler = handlers[k];
                    if (listener && handler.listener === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    } else if (!listener) {
                        el.removeEventListener(event, handler.proxyListener, capture);
                        handlers.splice(k, 1);
                    }
                }
            }
        }
        return this;
    }
    function trigger(...args) {
        const window = ssr_window_esm_getWindow();
        const events = args[0].split(" ");
        const eventData = args[1];
        for (let i = 0; i < events.length; i += 1) {
            const event = events[i];
            for (let j = 0; j < this.length; j += 1) {
                const el = this[j];
                if (window.CustomEvent) {
                    const evt = new window.CustomEvent(event, {
                        detail: eventData,
                        bubbles: true,
                        cancelable: true
                    });
                    el.dom7EventData = args.filter(((data, dataIndex) => dataIndex > 0));
                    el.dispatchEvent(evt);
                    el.dom7EventData = [];
                    delete el.dom7EventData;
                }
            }
        }
        return this;
    }
    function transitionEnd(callback) {
        const dom = this;
        function fireCallBack(e) {
            if (e.target !== this) return;
            callback.call(this, e);
            dom.off("transitionend", fireCallBack);
        }
        if (callback) dom.on("transitionend", fireCallBack);
        return this;
    }
    function dom7_esm_outerWidth(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue("margin-right")) + parseFloat(styles.getPropertyValue("margin-left"));
            }
            return this[0].offsetWidth;
        }
        return null;
    }
    function dom7_esm_outerHeight(includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                const styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue("margin-top")) + parseFloat(styles.getPropertyValue("margin-bottom"));
            }
            return this[0].offsetHeight;
        }
        return null;
    }
    function offset() {
        if (this.length > 0) {
            const window = ssr_window_esm_getWindow();
            const document = ssr_window_esm_getDocument();
            const el = this[0];
            const box = el.getBoundingClientRect();
            const body = document.body;
            const clientTop = el.clientTop || body.clientTop || 0;
            const clientLeft = el.clientLeft || body.clientLeft || 0;
            const scrollTop = el === window ? window.scrollY : el.scrollTop;
            const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        return null;
    }
    function styles() {
        const window = ssr_window_esm_getWindow();
        if (this[0]) return window.getComputedStyle(this[0], null);
        return {};
    }
    function css(props, value) {
        const window = ssr_window_esm_getWindow();
        let i;
        if (1 === arguments.length) if ("string" === typeof props) {
            if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
        } else {
            for (i = 0; i < this.length; i += 1) for (const prop in props) this[i].style[prop] = props[prop];
            return this;
        }
        if (2 === arguments.length && "string" === typeof props) {
            for (i = 0; i < this.length; i += 1) this[i].style[props] = value;
            return this;
        }
        return this;
    }
    function each(callback) {
        if (!callback) return this;
        this.forEach(((el, index) => {
            callback.apply(el, [ el, index ]);
        }));
        return this;
    }
    function filter(callback) {
        const result = arrayFilter(this, callback);
        return dom7_esm_$(result);
    }
    function html(html) {
        if ("undefined" === typeof html) return this[0] ? this[0].innerHTML : null;
        for (let i = 0; i < this.length; i += 1) this[i].innerHTML = html;
        return this;
    }
    function dom7_esm_text(text) {
        if ("undefined" === typeof text) return this[0] ? this[0].textContent.trim() : null;
        for (let i = 0; i < this.length; i += 1) this[i].textContent = text;
        return this;
    }
    function is(selector) {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        const el = this[0];
        let compareWith;
        let i;
        if (!el || "undefined" === typeof selector) return false;
        if ("string" === typeof selector) {
            if (el.matches) return el.matches(selector);
            if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            compareWith = dom7_esm_$(selector);
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        if (selector === document) return el === document;
        if (selector === window) return el === window;
        if (selector.nodeType || selector instanceof Dom7) {
            compareWith = selector.nodeType ? [ selector ] : selector;
            for (i = 0; i < compareWith.length; i += 1) if (compareWith[i] === el) return true;
            return false;
        }
        return false;
    }
    function index() {
        let child = this[0];
        let i;
        if (child) {
            i = 0;
            while (null !== (child = child.previousSibling)) if (1 === child.nodeType) i += 1;
            return i;
        }
        return;
    }
    function eq(index) {
        if ("undefined" === typeof index) return this;
        const length = this.length;
        if (index > length - 1) return dom7_esm_$([]);
        if (index < 0) {
            const returnIndex = length + index;
            if (returnIndex < 0) return dom7_esm_$([]);
            return dom7_esm_$([ this[returnIndex] ]);
        }
        return dom7_esm_$([ this[index] ]);
    }
    function append(...els) {
        let newChild;
        const document = ssr_window_esm_getDocument();
        for (let k = 0; k < els.length; k += 1) {
            newChild = els[k];
            for (let i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) this[i].appendChild(tempDiv.firstChild);
            } else if (newChild instanceof Dom7) for (let j = 0; j < newChild.length; j += 1) this[i].appendChild(newChild[j]); else this[i].appendChild(newChild);
        }
        return this;
    }
    function prepend(newChild) {
        const document = ssr_window_esm_getDocument();
        let i;
        let j;
        for (i = 0; i < this.length; i += 1) if ("string" === typeof newChild) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = newChild;
            for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
        } else if (newChild instanceof Dom7) for (j = 0; j < newChild.length; j += 1) this[i].insertBefore(newChild[j], this[i].childNodes[0]); else this[i].insertBefore(newChild, this[i].childNodes[0]);
        return this;
    }
    function next(selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && dom7_esm_$(this[0].nextElementSibling).is(selector)) return dom7_esm_$([ this[0].nextElementSibling ]);
                return dom7_esm_$([]);
            }
            if (this[0].nextElementSibling) return dom7_esm_$([ this[0].nextElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function nextAll(selector) {
        const nextEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.nextElementSibling) {
            const next = el.nextElementSibling;
            if (selector) {
                if (dom7_esm_$(next).is(selector)) nextEls.push(next);
            } else nextEls.push(next);
            el = next;
        }
        return dom7_esm_$(nextEls);
    }
    function prev(selector) {
        if (this.length > 0) {
            const el = this[0];
            if (selector) {
                if (el.previousElementSibling && dom7_esm_$(el.previousElementSibling).is(selector)) return dom7_esm_$([ el.previousElementSibling ]);
                return dom7_esm_$([]);
            }
            if (el.previousElementSibling) return dom7_esm_$([ el.previousElementSibling ]);
            return dom7_esm_$([]);
        }
        return dom7_esm_$([]);
    }
    function prevAll(selector) {
        const prevEls = [];
        let el = this[0];
        if (!el) return dom7_esm_$([]);
        while (el.previousElementSibling) {
            const prev = el.previousElementSibling;
            if (selector) {
                if (dom7_esm_$(prev).is(selector)) prevEls.push(prev);
            } else prevEls.push(prev);
            el = prev;
        }
        return dom7_esm_$(prevEls);
    }
    function dom7_esm_parent(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) if (null !== this[i].parentNode) if (selector) {
            if (dom7_esm_$(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
        } else parents.push(this[i].parentNode);
        return dom7_esm_$(parents);
    }
    function parents(selector) {
        const parents = [];
        for (let i = 0; i < this.length; i += 1) {
            let parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if (dom7_esm_$(parent).is(selector)) parents.push(parent);
                } else parents.push(parent);
                parent = parent.parentNode;
            }
        }
        return dom7_esm_$(parents);
    }
    function closest(selector) {
        let closest = this;
        if ("undefined" === typeof selector) return dom7_esm_$([]);
        if (!closest.is(selector)) closest = closest.parents(selector).eq(0);
        return closest;
    }
    function find(selector) {
        const foundElements = [];
        for (let i = 0; i < this.length; i += 1) {
            const found = this[i].querySelectorAll(selector);
            for (let j = 0; j < found.length; j += 1) foundElements.push(found[j]);
        }
        return dom7_esm_$(foundElements);
    }
    function children(selector) {
        const children = [];
        for (let i = 0; i < this.length; i += 1) {
            const childNodes = this[i].children;
            for (let j = 0; j < childNodes.length; j += 1) if (!selector || dom7_esm_$(childNodes[j]).is(selector)) children.push(childNodes[j]);
        }
        return dom7_esm_$(children);
    }
    function remove() {
        for (let i = 0; i < this.length; i += 1) if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        return this;
    }
    const noTrigger = "resize scroll".split(" ");
    function shortcut(name) {
        function eventHandler(...args) {
            if ("undefined" === typeof args[0]) {
                for (let i = 0; i < this.length; i += 1) if (noTrigger.indexOf(name) < 0) if (name in this[i]) this[i][name](); else dom7_esm_$(this[i]).trigger(name);
                return this;
            }
            return this.on(name, ...args);
        }
        return eventHandler;
    }
    shortcut("click");
    shortcut("blur");
    shortcut("focus");
    shortcut("focusin");
    shortcut("focusout");
    shortcut("keyup");
    shortcut("keydown");
    shortcut("keypress");
    shortcut("submit");
    shortcut("change");
    shortcut("mousedown");
    shortcut("mousemove");
    shortcut("mouseup");
    shortcut("mouseenter");
    shortcut("mouseleave");
    shortcut("mouseout");
    shortcut("mouseover");
    shortcut("touchstart");
    shortcut("touchend");
    shortcut("touchmove");
    shortcut("resize");
    shortcut("scroll");
    const Methods = {
        addClass,
        removeClass,
        hasClass,
        toggleClass,
        attr,
        removeAttr,
        transform,
        transition,
        on,
        off,
        trigger,
        transitionEnd,
        outerWidth: dom7_esm_outerWidth,
        outerHeight: dom7_esm_outerHeight,
        styles,
        offset,
        css,
        each,
        html,
        text: dom7_esm_text,
        is,
        index,
        eq,
        append,
        prepend,
        next,
        nextAll,
        prev,
        prevAll,
        parent: dom7_esm_parent,
        parents,
        closest,
        find,
        children,
        filter,
        remove
    };
    Object.keys(Methods).forEach((methodName => {
        Object.defineProperty(dom7_esm_$.fn, methodName, {
            value: Methods[methodName],
            writable: true
        });
    }));
    const dom = dom7_esm_$;
    function deleteProps(obj) {
        const object = obj;
        Object.keys(object).forEach((key => {
            try {
                object[key] = null;
            } catch (e) {}
            try {
                delete object[key];
            } catch (e) {}
        }));
    }
    function utils_nextTick(callback, delay = 0) {
        return setTimeout(callback, delay);
    }
    function utils_now() {
        return Date.now();
    }
    function utils_getComputedStyle(el) {
        const window = ssr_window_esm_getWindow();
        let style;
        if (window.getComputedStyle) style = window.getComputedStyle(el, null);
        if (!style && el.currentStyle) style = el.currentStyle;
        if (!style) style = el.style;
        return style;
    }
    function utils_getTranslate(el, axis = "x") {
        const window = ssr_window_esm_getWindow();
        let matrix;
        let curTransform;
        let transformMatrix;
        const curStyle = utils_getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            curTransform = curStyle.transform || curStyle.webkitTransform;
            if (curTransform.split(",").length > 6) curTransform = curTransform.split(", ").map((a => a.replace(",", "."))).join(", ");
            transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform);
        } else {
            transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
            matrix = transformMatrix.toString().split(",");
        }
        if ("x" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; else if (16 === matrix.length) curTransform = parseFloat(matrix[12]); else curTransform = parseFloat(matrix[4]);
        if ("y" === axis) if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; else if (16 === matrix.length) curTransform = parseFloat(matrix[13]); else curTransform = parseFloat(matrix[5]);
        return curTransform || 0;
    }
    function utils_isObject(o) {
        return "object" === typeof o && null !== o && o.constructor && "Object" === Object.prototype.toString.call(o).slice(8, -1);
    }
    function isNode(node) {
        if ("undefined" !== typeof window && "undefined" !== typeof window.HTMLElement) return node instanceof HTMLElement;
        return node && (1 === node.nodeType || 11 === node.nodeType);
    }
    function utils_extend(...args) {
        const to = Object(args[0]);
        const noExtend = [ "__proto__", "constructor", "prototype" ];
        for (let i = 1; i < args.length; i += 1) {
            const nextSource = args[i];
            if (void 0 !== nextSource && null !== nextSource && !isNode(nextSource)) {
                const keysArray = Object.keys(Object(nextSource)).filter((key => noExtend.indexOf(key) < 0));
                for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
                    const nextKey = keysArray[nextIndex];
                    const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (void 0 !== desc && desc.enumerable) if (utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]); else if (!utils_isObject(to[nextKey]) && utils_isObject(nextSource[nextKey])) {
                        to[nextKey] = {};
                        if (nextSource[nextKey].__swiper__) to[nextKey] = nextSource[nextKey]; else utils_extend(to[nextKey], nextSource[nextKey]);
                    } else to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    }
    function utils_setCSSProperty(el, varName, varValue) {
        el.style.setProperty(varName, varValue);
    }
    function animateCSSModeScroll({swiper, targetPosition, side}) {
        const window = ssr_window_esm_getWindow();
        const startPosition = -swiper.translate;
        let startTime = null;
        let time;
        const duration = swiper.params.speed;
        swiper.wrapperEl.style.scrollSnapType = "none";
        window.cancelAnimationFrame(swiper.cssModeFrameID);
        const dir = targetPosition > startPosition ? "next" : "prev";
        const isOutOfBound = (current, target) => "next" === dir && current >= target || "prev" === dir && current <= target;
        const animate = () => {
            time = (new Date).getTime();
            if (null === startTime) startTime = time;
            const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            const easeProgress = .5 - Math.cos(progress * Math.PI) / 2;
            let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
            if (isOutOfBound(currentPosition, targetPosition)) currentPosition = targetPosition;
            swiper.wrapperEl.scrollTo({
                [side]: currentPosition
            });
            if (isOutOfBound(currentPosition, targetPosition)) {
                swiper.wrapperEl.style.overflow = "hidden";
                swiper.wrapperEl.style.scrollSnapType = "";
                setTimeout((() => {
                    swiper.wrapperEl.style.overflow = "";
                    swiper.wrapperEl.scrollTo({
                        [side]: currentPosition
                    });
                }));
                window.cancelAnimationFrame(swiper.cssModeFrameID);
                return;
            }
            swiper.cssModeFrameID = window.requestAnimationFrame(animate);
        };
        animate();
    }
    let support;
    function calcSupport() {
        const window = ssr_window_esm_getWindow();
        const document = ssr_window_esm_getDocument();
        return {
            smoothScroll: document.documentElement && "scrollBehavior" in document.documentElement.style,
            touch: !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
            passiveListener: function checkPassiveListener() {
                let supportsPassive = false;
                try {
                    const opts = Object.defineProperty({}, "passive", {
                        get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("testPassiveListener", null, opts);
                } catch (e) {}
                return supportsPassive;
            }(),
            gestures: function checkGestures() {
                return "ongesturestart" in window;
            }()
        };
    }
    function getSupport() {
        if (!support) support = calcSupport();
        return support;
    }
    let deviceCached;
    function calcDevice({userAgent} = {}) {
        const support = getSupport();
        const window = ssr_window_esm_getWindow();
        const platform = window.navigator.platform;
        const ua = userAgent || window.navigator.userAgent;
        const device = {
            ios: false,
            android: false
        };
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        const windows = "Win32" === platform;
        let macos = "MacIntel" === platform;
        const iPadScreens = [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ];
        if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
            ipad = ua.match(/(Version)\/([\d.]+)/);
            if (!ipad) ipad = [ 0, 1, "13_0_0" ];
            macos = false;
        }
        if (android && !windows) {
            device.os = "android";
            device.android = true;
        }
        if (ipad || iphone || ipod) {
            device.os = "ios";
            device.ios = true;
        }
        return device;
    }
    function getDevice(overrides = {}) {
        if (!deviceCached) deviceCached = calcDevice(overrides);
        return deviceCached;
    }
    let browser;
    function calcBrowser() {
        const window = ssr_window_esm_getWindow();
        function isSafari() {
            const ua = window.navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }
        return {
            isSafari: isSafari(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
        };
    }
    function getBrowser() {
        if (!browser) browser = calcBrowser();
        return browser;
    }
    function Resize({swiper, on, emit}) {
        const window = ssr_window_esm_getWindow();
        let observer = null;
        let animationFrame = null;
        const resizeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("beforeResize");
            emit("resize");
        };
        const createObserver = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            observer = new ResizeObserver((entries => {
                animationFrame = window.requestAnimationFrame((() => {
                    const {width, height} = swiper;
                    let newWidth = width;
                    let newHeight = height;
                    entries.forEach((({contentBoxSize, contentRect, target}) => {
                        if (target && target !== swiper.el) return;
                        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
                        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
                    }));
                    if (newWidth !== width || newHeight !== height) resizeHandler();
                }));
            }));
            observer.observe(swiper.el);
        };
        const removeObserver = () => {
            if (animationFrame) window.cancelAnimationFrame(animationFrame);
            if (observer && observer.unobserve && swiper.el) {
                observer.unobserve(swiper.el);
                observer = null;
            }
        };
        const orientationChangeHandler = () => {
            if (!swiper || swiper.destroyed || !swiper.initialized) return;
            emit("orientationchange");
        };
        on("init", (() => {
            if (swiper.params.resizeObserver && "undefined" !== typeof window.ResizeObserver) {
                createObserver();
                return;
            }
            window.addEventListener("resize", resizeHandler);
            window.addEventListener("orientationchange", orientationChangeHandler);
        }));
        on("destroy", (() => {
            removeObserver();
            window.removeEventListener("resize", resizeHandler);
            window.removeEventListener("orientationchange", orientationChangeHandler);
        }));
    }
    function Observer({swiper, extendParams, on, emit}) {
        const observers = [];
        const window = ssr_window_esm_getWindow();
        const attach = (target, options = {}) => {
            const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            const observer = new ObserverFunc((mutations => {
                if (1 === mutations.length) {
                    emit("observerUpdate", mutations[0]);
                    return;
                }
                const observerUpdate = function observerUpdate() {
                    emit("observerUpdate", mutations[0]);
                };
                if (window.requestAnimationFrame) window.requestAnimationFrame(observerUpdate); else window.setTimeout(observerUpdate, 0);
            }));
            observer.observe(target, {
                attributes: "undefined" === typeof options.attributes ? true : options.attributes,
                childList: "undefined" === typeof options.childList ? true : options.childList,
                characterData: "undefined" === typeof options.characterData ? true : options.characterData
            });
            observers.push(observer);
        };
        const init = () => {
            if (!swiper.params.observer) return;
            if (swiper.params.observeParents) {
                const containerParents = swiper.$el.parents();
                for (let i = 0; i < containerParents.length; i += 1) attach(containerParents[i]);
            }
            attach(swiper.$el[0], {
                childList: swiper.params.observeSlideChildren
            });
            attach(swiper.$wrapperEl[0], {
                attributes: false
            });
        };
        const destroy = () => {
            observers.forEach((observer => {
                observer.disconnect();
            }));
            observers.splice(0, observers.length);
        };
        extendParams({
            observer: false,
            observeParents: false,
            observeSlideChildren: false
        });
        on("init", init);
        on("destroy", destroy);
    }
    const events_emitter = {
        on(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            events.split(" ").forEach((event => {
                if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
                self.eventsListeners[event][method](handler);
            }));
            return self;
        },
        once(events, handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            function onceHandler(...args) {
                self.off(events, onceHandler);
                if (onceHandler.__emitterProxy) delete onceHandler.__emitterProxy;
                handler.apply(self, args);
            }
            onceHandler.__emitterProxy = handler;
            return self.on(events, onceHandler, priority);
        },
        onAny(handler, priority) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if ("function" !== typeof handler) return self;
            const method = priority ? "unshift" : "push";
            if (self.eventsAnyListeners.indexOf(handler) < 0) self.eventsAnyListeners[method](handler);
            return self;
        },
        offAny(handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsAnyListeners) return self;
            const index = self.eventsAnyListeners.indexOf(handler);
            if (index >= 0) self.eventsAnyListeners.splice(index, 1);
            return self;
        },
        off(events, handler) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            events.split(" ").forEach((event => {
                if ("undefined" === typeof handler) self.eventsListeners[event] = []; else if (self.eventsListeners[event]) self.eventsListeners[event].forEach(((eventHandler, index) => {
                    if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) self.eventsListeners[event].splice(index, 1);
                }));
            }));
            return self;
        },
        emit(...args) {
            const self = this;
            if (!self.eventsListeners || self.destroyed) return self;
            if (!self.eventsListeners) return self;
            let events;
            let data;
            let context;
            if ("string" === typeof args[0] || Array.isArray(args[0])) {
                events = args[0];
                data = args.slice(1, args.length);
                context = self;
            } else {
                events = args[0].events;
                data = args[0].data;
                context = args[0].context || self;
            }
            data.unshift(context);
            const eventsArray = Array.isArray(events) ? events : events.split(" ");
            eventsArray.forEach((event => {
                if (self.eventsAnyListeners && self.eventsAnyListeners.length) self.eventsAnyListeners.forEach((eventHandler => {
                    eventHandler.apply(context, [ event, ...data ]);
                }));
                if (self.eventsListeners && self.eventsListeners[event]) self.eventsListeners[event].forEach((eventHandler => {
                    eventHandler.apply(context, data);
                }));
            }));
            return self;
        }
    };
    function updateSize() {
        const swiper = this;
        let width;
        let height;
        const $el = swiper.$el;
        if ("undefined" !== typeof swiper.params.width && null !== swiper.params.width) width = swiper.params.width; else width = $el[0].clientWidth;
        if ("undefined" !== typeof swiper.params.height && null !== swiper.params.height) height = swiper.params.height; else height = $el[0].clientHeight;
        if (0 === width && swiper.isHorizontal() || 0 === height && swiper.isVertical()) return;
        width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
        height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
        if (Number.isNaN(width)) width = 0;
        if (Number.isNaN(height)) height = 0;
        Object.assign(swiper, {
            width,
            height,
            size: swiper.isHorizontal() ? width : height
        });
    }
    function updateSlides() {
        const swiper = this;
        function getDirectionLabel(property) {
            if (swiper.isHorizontal()) return property;
            return {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            }[property];
        }
        function getDirectionPropertyValue(node, label) {
            return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
        }
        const params = swiper.params;
        const {$wrapperEl, size: swiperSize, rtlTranslate: rtl, wrongRTL} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
        const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
        const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
        let snapGrid = [];
        const slidesGrid = [];
        const slidesSizesGrid = [];
        let offsetBefore = params.slidesOffsetBefore;
        if ("function" === typeof offsetBefore) offsetBefore = params.slidesOffsetBefore.call(swiper);
        let offsetAfter = params.slidesOffsetAfter;
        if ("function" === typeof offsetAfter) offsetAfter = params.slidesOffsetAfter.call(swiper);
        const previousSnapGridLength = swiper.snapGrid.length;
        const previousSlidesGridLength = swiper.slidesGrid.length;
        let spaceBetween = params.spaceBetween;
        let slidePosition = -offsetBefore;
        let prevSlideSize = 0;
        let index = 0;
        if ("undefined" === typeof swiperSize) return;
        if ("string" === typeof spaceBetween && spaceBetween.indexOf("%") >= 0) spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
        swiper.virtualSize = -spaceBetween;
        if (rtl) slides.css({
            marginLeft: "",
            marginBottom: "",
            marginTop: ""
        }); else slides.css({
            marginRight: "",
            marginBottom: "",
            marginTop: ""
        });
        if (params.centeredSlides && params.cssMode) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", "");
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", "");
        }
        const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
        if (gridEnabled) swiper.grid.initSlides(slidesLength);
        let slideSize;
        const shouldResetSlideSize = "auto" === params.slidesPerView && params.breakpoints && Object.keys(params.breakpoints).filter((key => "undefined" !== typeof params.breakpoints[key].slidesPerView)).length > 0;
        for (let i = 0; i < slidesLength; i += 1) {
            slideSize = 0;
            const slide = slides.eq(i);
            if (gridEnabled) swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
            if ("none" === slide.css("display")) continue;
            if ("auto" === params.slidesPerView) {
                if (shouldResetSlideSize) slides[i].style[getDirectionLabel("width")] = ``;
                const slideStyles = getComputedStyle(slide[0]);
                const currentTransform = slide[0].style.transform;
                const currentWebKitTransform = slide[0].style.webkitTransform;
                if (currentTransform) slide[0].style.transform = "none";
                if (currentWebKitTransform) slide[0].style.webkitTransform = "none";
                if (params.roundLengths) slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true); else {
                    const width = getDirectionPropertyValue(slideStyles, "width");
                    const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
                    const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
                    const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
                    const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
                    const boxSizing = slideStyles.getPropertyValue("box-sizing");
                    if (boxSizing && "border-box" === boxSizing) slideSize = width + marginLeft + marginRight; else {
                        const {clientWidth, offsetWidth} = slide[0];
                        slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
                    }
                }
                if (currentTransform) slide[0].style.transform = currentTransform;
                if (currentWebKitTransform) slide[0].style.webkitTransform = currentWebKitTransform;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
            } else {
                slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
                if (params.roundLengths) slideSize = Math.floor(slideSize);
                if (slides[i]) slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
            }
            if (slides[i]) slides[i].swiperSlideSize = slideSize;
            slidesSizesGrid.push(slideSize);
            if (params.centeredSlides) {
                slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                if (0 === prevSlideSize && 0 !== i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (0 === i) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
                if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
            } else {
                if (params.roundLengths) slidePosition = Math.floor(slidePosition);
                if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
                slidesGrid.push(slidePosition);
                slidePosition = slidePosition + slideSize + spaceBetween;
            }
            swiper.virtualSize += slideSize + spaceBetween;
            prevSlideSize = slideSize;
            index += 1;
        }
        swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
        if (rtl && wrongRTL && ("slide" === params.effect || "coverflow" === params.effect)) $wrapperEl.css({
            width: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (params.setWrapperSize) $wrapperEl.css({
            [getDirectionLabel("width")]: `${swiper.virtualSize + params.spaceBetween}px`
        });
        if (gridEnabled) swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
        if (!params.centeredSlides) {
            const newSlidesGrid = [];
            for (let i = 0; i < snapGrid.length; i += 1) {
                let slidesGridItem = snapGrid[i];
                if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
                if (snapGrid[i] <= swiper.virtualSize - swiperSize) newSlidesGrid.push(slidesGridItem);
            }
            snapGrid = newSlidesGrid;
            if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) snapGrid.push(swiper.virtualSize - swiperSize);
        }
        if (0 === snapGrid.length) snapGrid = [ 0 ];
        if (0 !== params.spaceBetween) {
            const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
            slides.filter(((_, slideIndex) => {
                if (!params.cssMode) return true;
                if (slideIndex === slides.length - 1) return false;
                return true;
            })).css({
                [key]: `${spaceBetween}px`
            });
        }
        if (params.centeredSlides && params.centeredSlidesBounds) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            const maxSnap = allSlidesSize - swiperSize;
            snapGrid = snapGrid.map((snap => {
                if (snap < 0) return -offsetBefore;
                if (snap > maxSnap) return maxSnap + offsetAfter;
                return snap;
            }));
        }
        if (params.centerInsufficientSlides) {
            let allSlidesSize = 0;
            slidesSizesGrid.forEach((slideSizeValue => {
                allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
            }));
            allSlidesSize -= params.spaceBetween;
            if (allSlidesSize < swiperSize) {
                const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
                snapGrid.forEach(((snap, snapIndex) => {
                    snapGrid[snapIndex] = snap - allSlidesOffset;
                }));
                slidesGrid.forEach(((snap, snapIndex) => {
                    slidesGrid[snapIndex] = snap + allSlidesOffset;
                }));
            }
        }
        Object.assign(swiper, {
            slides,
            snapGrid,
            slidesGrid,
            slidesSizesGrid
        });
        if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
            utils_setCSSProperty(swiper.wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
            const addToSnapGrid = -swiper.snapGrid[0];
            const addToSlidesGrid = -swiper.slidesGrid[0];
            swiper.snapGrid = swiper.snapGrid.map((v => v + addToSnapGrid));
            swiper.slidesGrid = swiper.slidesGrid.map((v => v + addToSlidesGrid));
        }
        if (slidesLength !== previousSlidesLength) swiper.emit("slidesLengthChange");
        if (snapGrid.length !== previousSnapGridLength) {
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            swiper.emit("snapGridLengthChange");
        }
        if (slidesGrid.length !== previousSlidesGridLength) swiper.emit("slidesGridLengthChange");
        if (params.watchSlidesProgress) swiper.updateSlidesOffset();
        if (!isVirtual && !params.cssMode && ("slide" === params.effect || "fade" === params.effect)) {
            const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
            const hasClassBackfaceClassAdded = swiper.$el.hasClass(backFaceHiddenClass);
            if (slidesLength <= params.maxBackfaceHiddenSlides) {
                if (!hasClassBackfaceClassAdded) swiper.$el.addClass(backFaceHiddenClass);
            } else if (hasClassBackfaceClassAdded) swiper.$el.removeClass(backFaceHiddenClass);
        }
    }
    function updateAutoHeight(speed) {
        const swiper = this;
        const activeSlides = [];
        const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
        let newHeight = 0;
        let i;
        if ("number" === typeof speed) swiper.setTransition(speed); else if (true === speed) swiper.setTransition(swiper.params.speed);
        const getSlideByIndex = index => {
            if (isVirtual) return swiper.slides.filter((el => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index))[0];
            return swiper.slides.eq(index)[0];
        };
        if ("auto" !== swiper.params.slidesPerView && swiper.params.slidesPerView > 1) if (swiper.params.centeredSlides) (swiper.visibleSlides || dom([])).each((slide => {
            activeSlides.push(slide);
        })); else for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
            const index = swiper.activeIndex + i;
            if (index > swiper.slides.length && !isVirtual) break;
            activeSlides.push(getSlideByIndex(index));
        } else activeSlides.push(getSlideByIndex(swiper.activeIndex));
        for (i = 0; i < activeSlides.length; i += 1) if ("undefined" !== typeof activeSlides[i]) {
            const height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
        if (newHeight || 0 === newHeight) swiper.$wrapperEl.css("height", `${newHeight}px`);
    }
    function updateSlidesOffset() {
        const swiper = this;
        const slides = swiper.slides;
        for (let i = 0; i < slides.length; i += 1) slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
    }
    function updateSlidesProgress(translate = this && this.translate || 0) {
        const swiper = this;
        const params = swiper.params;
        const {slides, rtlTranslate: rtl, snapGrid} = swiper;
        if (0 === slides.length) return;
        if ("undefined" === typeof slides[0].swiperSlideOffset) swiper.updateSlidesOffset();
        let offsetCenter = -translate;
        if (rtl) offsetCenter = translate;
        slides.removeClass(params.slideVisibleClass);
        swiper.visibleSlidesIndexes = [];
        swiper.visibleSlides = [];
        for (let i = 0; i < slides.length; i += 1) {
            const slide = slides[i];
            let slideOffset = slide.swiperSlideOffset;
            if (params.cssMode && params.centeredSlides) slideOffset -= slides[0].swiperSlideOffset;
            const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
            const slideBefore = -(offsetCenter - slideOffset);
            const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
            const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
            if (isVisible) {
                swiper.visibleSlides.push(slide);
                swiper.visibleSlidesIndexes.push(i);
                slides.eq(i).addClass(params.slideVisibleClass);
            }
            slide.progress = rtl ? -slideProgress : slideProgress;
            slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
        }
        swiper.visibleSlides = dom(swiper.visibleSlides);
    }
    function updateProgress(translate) {
        const swiper = this;
        if ("undefined" === typeof translate) {
            const multiplier = swiper.rtlTranslate ? -1 : 1;
            translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
        }
        const params = swiper.params;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        let {progress, isBeginning, isEnd} = swiper;
        const wasBeginning = isBeginning;
        const wasEnd = isEnd;
        if (0 === translatesDiff) {
            progress = 0;
            isBeginning = true;
            isEnd = true;
        } else {
            progress = (translate - swiper.minTranslate()) / translatesDiff;
            isBeginning = progress <= 0;
            isEnd = progress >= 1;
        }
        Object.assign(swiper, {
            progress,
            isBeginning,
            isEnd
        });
        if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);
        if (isBeginning && !wasBeginning) swiper.emit("reachBeginning toEdge");
        if (isEnd && !wasEnd) swiper.emit("reachEnd toEdge");
        if (wasBeginning && !isBeginning || wasEnd && !isEnd) swiper.emit("fromEdge");
        swiper.emit("progress", progress);
    }
    function updateSlidesClasses() {
        const swiper = this;
        const {slides, params, $wrapperEl, activeIndex, realIndex} = swiper;
        const isVirtual = swiper.virtual && params.virtual.enabled;
        slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
        let activeSlide;
        if (isVirtual) activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`); else activeSlide = slides.eq(activeIndex);
        activeSlide.addClass(params.slideActiveClass);
        if (params.loop) if (activeSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
        let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
        if (params.loop && 0 === nextSlide.length) {
            nextSlide = slides.eq(0);
            nextSlide.addClass(params.slideNextClass);
        }
        let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
        if (params.loop && 0 === prevSlide.length) {
            prevSlide = slides.eq(-1);
            prevSlide.addClass(params.slidePrevClass);
        }
        if (params.loop) {
            if (nextSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
            if (prevSlide.hasClass(params.slideDuplicateClass)) $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass); else $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
        }
        swiper.emitSlidesClasses();
    }
    function updateActiveIndex(newActiveIndex) {
        const swiper = this;
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        const {slidesGrid, snapGrid, params, activeIndex: previousIndex, realIndex: previousRealIndex, snapIndex: previousSnapIndex} = swiper;
        let activeIndex = newActiveIndex;
        let snapIndex;
        if ("undefined" === typeof activeIndex) {
            for (let i = 0; i < slidesGrid.length; i += 1) if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) activeIndex = i; else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) activeIndex = i + 1;
            } else if (translate >= slidesGrid[i]) activeIndex = i;
            if (params.normalizeSlideIndex) if (activeIndex < 0 || "undefined" === typeof activeIndex) activeIndex = 0;
        }
        if (snapGrid.indexOf(translate) >= 0) snapIndex = snapGrid.indexOf(translate); else {
            const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
            snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
        }
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        if (activeIndex === previousIndex) {
            if (snapIndex !== previousSnapIndex) {
                swiper.snapIndex = snapIndex;
                swiper.emit("snapIndexChange");
            }
            return;
        }
        const realIndex = parseInt(swiper.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
        Object.assign(swiper, {
            snapIndex,
            realIndex,
            previousIndex,
            activeIndex
        });
        swiper.emit("activeIndexChange");
        swiper.emit("snapIndexChange");
        if (previousRealIndex !== realIndex) swiper.emit("realIndexChange");
        if (swiper.initialized || swiper.params.runCallbacksOnInit) swiper.emit("slideChange");
    }
    function updateClickedSlide(e) {
        const swiper = this;
        const params = swiper.params;
        const slide = dom(e).closest(`.${params.slideClass}`)[0];
        let slideFound = false;
        let slideIndex;
        if (slide) for (let i = 0; i < swiper.slides.length; i += 1) if (swiper.slides[i] === slide) {
            slideFound = true;
            slideIndex = i;
            break;
        }
        if (slide && slideFound) {
            swiper.clickedSlide = slide;
            if (swiper.virtual && swiper.params.virtual.enabled) swiper.clickedIndex = parseInt(dom(slide).attr("data-swiper-slide-index"), 10); else swiper.clickedIndex = slideIndex;
        } else {
            swiper.clickedSlide = void 0;
            swiper.clickedIndex = void 0;
            return;
        }
        if (params.slideToClickedSlide && void 0 !== swiper.clickedIndex && swiper.clickedIndex !== swiper.activeIndex) swiper.slideToClickedSlide();
    }
    const update = {
        updateSize,
        updateSlides,
        updateAutoHeight,
        updateSlidesOffset,
        updateSlidesProgress,
        updateProgress,
        updateSlidesClasses,
        updateActiveIndex,
        updateClickedSlide
    };
    function getSwiperTranslate(axis = (this.isHorizontal() ? "x" : "y")) {
        const swiper = this;
        const {params, rtlTranslate: rtl, translate, $wrapperEl} = swiper;
        if (params.virtualTranslate) return rtl ? -translate : translate;
        if (params.cssMode) return translate;
        let currentTranslate = utils_getTranslate($wrapperEl[0], axis);
        if (rtl) currentTranslate = -currentTranslate;
        return currentTranslate || 0;
    }
    function setTranslate(translate, byController) {
        const swiper = this;
        const {rtlTranslate: rtl, params, $wrapperEl, wrapperEl, progress} = swiper;
        let x = 0;
        let y = 0;
        const z = 0;
        if (swiper.isHorizontal()) x = rtl ? -translate : translate; else y = translate;
        if (params.roundLengths) {
            x = Math.floor(x);
            y = Math.floor(y);
        }
        if (params.cssMode) wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x : -y; else if (!params.virtualTranslate) $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
        swiper.previousTranslate = swiper.translate;
        swiper.translate = swiper.isHorizontal() ? x : y;
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== progress) swiper.updateProgress(translate);
        swiper.emit("setTranslate", swiper.translate, byController);
    }
    function minTranslate() {
        return -this.snapGrid[0];
    }
    function maxTranslate() {
        return -this.snapGrid[this.snapGrid.length - 1];
    }
    function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
        const swiper = this;
        const {params, wrapperEl} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition) return false;
        const minTranslate = swiper.minTranslate();
        const maxTranslate = swiper.maxTranslate();
        let newTranslate;
        if (translateBounds && translate > minTranslate) newTranslate = minTranslate; else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate; else newTranslate = translate;
        swiper.updateProgress(newTranslate);
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            if (0 === speed) wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate; else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: -newTranslate,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: -newTranslate,
                    behavior: "smooth"
                });
            }
            return true;
        }
        if (0 === speed) {
            swiper.setTransition(0);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionEnd");
            }
        } else {
            swiper.setTransition(speed);
            swiper.setTranslate(newTranslate);
            if (runCallbacks) {
                swiper.emit("beforeTransitionStart", speed, internal);
                swiper.emit("transitionStart");
            }
            if (!swiper.animating) {
                swiper.animating = true;
                if (!swiper.onTranslateToWrapperTransitionEnd) swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
                    if (!swiper || swiper.destroyed) return;
                    if (e.target !== this) return;
                    swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
                    swiper.onTranslateToWrapperTransitionEnd = null;
                    delete swiper.onTranslateToWrapperTransitionEnd;
                    if (runCallbacks) swiper.emit("transitionEnd");
                };
                swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
                swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onTranslateToWrapperTransitionEnd);
            }
        }
        return true;
    }
    const translate = {
        getTranslate: getSwiperTranslate,
        setTranslate,
        minTranslate,
        maxTranslate,
        translateTo
    };
    function setTransition(duration, byController) {
        const swiper = this;
        if (!swiper.params.cssMode) swiper.$wrapperEl.transition(duration);
        swiper.emit("setTransition", duration, byController);
    }
    function transitionEmit({swiper, runCallbacks, direction, step}) {
        const {activeIndex, previousIndex} = swiper;
        let dir = direction;
        if (!dir) if (activeIndex > previousIndex) dir = "next"; else if (activeIndex < previousIndex) dir = "prev"; else dir = "reset";
        swiper.emit(`transition${step}`);
        if (runCallbacks && activeIndex !== previousIndex) {
            if ("reset" === dir) {
                swiper.emit(`slideResetTransition${step}`);
                return;
            }
            swiper.emit(`slideChangeTransition${step}`);
            if ("next" === dir) swiper.emit(`slideNextTransition${step}`); else swiper.emit(`slidePrevTransition${step}`);
        }
    }
    function transitionStart(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        if (params.cssMode) return;
        if (params.autoHeight) swiper.updateAutoHeight();
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "Start"
        });
    }
    function transitionEnd_transitionEnd(runCallbacks = true, direction) {
        const swiper = this;
        const {params} = swiper;
        swiper.animating = false;
        if (params.cssMode) return;
        swiper.setTransition(0);
        transitionEmit({
            swiper,
            runCallbacks,
            direction,
            step: "End"
        });
    }
    const core_transition = {
        setTransition,
        transitionStart,
        transitionEnd: transitionEnd_transitionEnd
    };
    function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
        if ("number" !== typeof index && "string" !== typeof index) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let slideIndex = index;
        if (slideIndex < 0) slideIndex = 0;
        const {params, snapGrid, slidesGrid, previousIndex, activeIndex, rtlTranslate: rtl, wrapperEl, enabled} = swiper;
        if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) return false;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
        let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
        if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
        const translate = -snapGrid[snapIndex];
        if (params.normalizeSlideIndex) for (let i = 0; i < slidesGrid.length; i += 1) {
            const normalizedTranslate = -Math.floor(100 * translate);
            const normalizedGrid = Math.floor(100 * slidesGrid[i]);
            const normalizedGridNext = Math.floor(100 * slidesGrid[i + 1]);
            if ("undefined" !== typeof slidesGrid[i + 1]) {
                if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) slideIndex = i; else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) slideIndex = i + 1;
            } else if (normalizedTranslate >= normalizedGrid) slideIndex = i;
        }
        if (swiper.initialized && slideIndex !== activeIndex) {
            if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) return false;
            if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) if ((activeIndex || 0) !== slideIndex) return false;
        }
        if (slideIndex !== (previousIndex || 0) && runCallbacks) swiper.emit("beforeSlideChangeStart");
        swiper.updateProgress(translate);
        let direction;
        if (slideIndex > activeIndex) direction = "next"; else if (slideIndex < activeIndex) direction = "prev"; else direction = "reset";
        if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
            swiper.updateActiveIndex(slideIndex);
            if (params.autoHeight) swiper.updateAutoHeight();
            swiper.updateSlidesClasses();
            if ("slide" !== params.effect) swiper.setTranslate(translate);
            if ("reset" !== direction) {
                swiper.transitionStart(runCallbacks, direction);
                swiper.transitionEnd(runCallbacks, direction);
            }
            return false;
        }
        if (params.cssMode) {
            const isH = swiper.isHorizontal();
            const t = rtl ? translate : -translate;
            if (0 === speed) {
                const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
                if (isVirtual) {
                    swiper.wrapperEl.style.scrollSnapType = "none";
                    swiper._immediateVirtual = true;
                }
                wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
                if (isVirtual) requestAnimationFrame((() => {
                    swiper.wrapperEl.style.scrollSnapType = "";
                    swiper._swiperImmediateVirtual = false;
                }));
            } else {
                if (!swiper.support.smoothScroll) {
                    animateCSSModeScroll({
                        swiper,
                        targetPosition: t,
                        side: isH ? "left" : "top"
                    });
                    return true;
                }
                wrapperEl.scrollTo({
                    [isH ? "left" : "top"]: t,
                    behavior: "smooth"
                });
            }
            return true;
        }
        swiper.setTransition(speed);
        swiper.setTranslate(translate);
        swiper.updateActiveIndex(slideIndex);
        swiper.updateSlidesClasses();
        swiper.emit("beforeTransitionStart", speed, internal);
        swiper.transitionStart(runCallbacks, direction);
        if (0 === speed) swiper.transitionEnd(runCallbacks, direction); else if (!swiper.animating) {
            swiper.animating = true;
            if (!swiper.onSlideToWrapperTransitionEnd) swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
                if (!swiper || swiper.destroyed) return;
                if (e.target !== this) return;
                swiper.$wrapperEl[0].removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
                swiper.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
                swiper.onSlideToWrapperTransitionEnd = null;
                delete swiper.onSlideToWrapperTransitionEnd;
                swiper.transitionEnd(runCallbacks, direction);
            };
            swiper.$wrapperEl[0].addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
            swiper.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper.onSlideToWrapperTransitionEnd);
        }
        return true;
    }
    function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
        if ("string" === typeof index) {
            const indexAsNumber = parseInt(index, 10);
            const isValidNumber = isFinite(indexAsNumber);
            if (!isValidNumber) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
            index = indexAsNumber;
        }
        const swiper = this;
        let newIndex = index;
        if (swiper.params.loop) newIndex += swiper.loopedSlides;
        return swiper.slideTo(newIndex, speed, runCallbacks, internal);
    }
    function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {animating, enabled, params} = swiper;
        if (!enabled) return swiper;
        let perGroup = params.slidesPerGroup;
        if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
        const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        if (params.rewind && swiper.isEnd) return swiper.slideTo(0, speed, runCallbacks, internal);
        return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
    }
    function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        const {params, animating, snapGrid, slidesGrid, rtlTranslate, enabled} = swiper;
        if (!enabled) return swiper;
        if (params.loop) {
            if (animating && params.loopPreventsSlide) return false;
            swiper.loopFix();
            swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
        }
        const translate = rtlTranslate ? swiper.translate : -swiper.translate;
        function normalize(val) {
            if (val < 0) return -Math.floor(Math.abs(val));
            return Math.floor(val);
        }
        const normalizedTranslate = normalize(translate);
        const normalizedSnapGrid = snapGrid.map((val => normalize(val)));
        let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
        if ("undefined" === typeof prevSnap && params.cssMode) {
            let prevSnapIndex;
            snapGrid.forEach(((snap, snapIndex) => {
                if (normalizedTranslate >= snap) prevSnapIndex = snapIndex;
            }));
            if ("undefined" !== typeof prevSnapIndex) prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
        }
        let prevIndex = 0;
        if ("undefined" !== typeof prevSnap) {
            prevIndex = slidesGrid.indexOf(prevSnap);
            if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
            if ("auto" === params.slidesPerView && 1 === params.slidesPerGroup && params.slidesPerGroupAuto) {
                prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
                prevIndex = Math.max(prevIndex, 0);
            }
        }
        if (params.rewind && swiper.isBeginning) {
            const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
            return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
        }
        return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    }
    function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
        const swiper = this;
        return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
    }
    function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = .5) {
        const swiper = this;
        let index = swiper.activeIndex;
        const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
        const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
        const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
        if (translate >= swiper.snapGrid[snapIndex]) {
            const currentSnap = swiper.snapGrid[snapIndex];
            const nextSnap = swiper.snapGrid[snapIndex + 1];
            if (translate - currentSnap > (nextSnap - currentSnap) * threshold) index += swiper.params.slidesPerGroup;
        } else {
            const prevSnap = swiper.snapGrid[snapIndex - 1];
            const currentSnap = swiper.snapGrid[snapIndex];
            if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) index -= swiper.params.slidesPerGroup;
        }
        index = Math.max(index, 0);
        index = Math.min(index, swiper.slidesGrid.length - 1);
        return swiper.slideTo(index, speed, runCallbacks, internal);
    }
    function slideToClickedSlide() {
        const swiper = this;
        const {params, $wrapperEl} = swiper;
        const slidesPerView = "auto" === params.slidesPerView ? swiper.slidesPerViewDynamic() : params.slidesPerView;
        let slideToIndex = swiper.clickedIndex;
        let realIndex;
        if (params.loop) {
            if (swiper.animating) return;
            realIndex = parseInt(dom(swiper.clickedSlide).attr("data-swiper-slide-index"), 10);
            if (params.centeredSlides) if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex); else if (slideToIndex > swiper.slides.length - slidesPerView) {
                swiper.loopFix();
                slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
                utils_nextTick((() => {
                    swiper.slideTo(slideToIndex);
                }));
            } else swiper.slideTo(slideToIndex);
        } else swiper.slideTo(slideToIndex);
    }
    const slide = {
        slideTo,
        slideToLoop,
        slideNext,
        slidePrev,
        slideReset,
        slideToClosest,
        slideToClickedSlide
    };
    function loopCreate() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, $wrapperEl} = swiper;
        const $selector = $wrapperEl.children().length > 0 ? dom($wrapperEl.children()[0].parentNode) : $wrapperEl;
        $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
        let slides = $selector.children(`.${params.slideClass}`);
        if (params.loopFillGroupWithBlank) {
            const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
            if (blankSlidesNum !== params.slidesPerGroup) {
                for (let i = 0; i < blankSlidesNum; i += 1) {
                    const blankNode = dom(document.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
                    $selector.append(blankNode);
                }
                slides = $selector.children(`.${params.slideClass}`);
            }
        }
        if ("auto" === params.slidesPerView && !params.loopedSlides) params.loopedSlides = slides.length;
        swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
        swiper.loopedSlides += params.loopAdditionalSlides;
        if (swiper.loopedSlides > slides.length && swiper.params.loopedSlidesLimit) swiper.loopedSlides = slides.length;
        const prependSlides = [];
        const appendSlides = [];
        slides.each(((el, index) => {
            const slide = dom(el);
            slide.attr("data-swiper-slide-index", index);
        }));
        for (let i = 0; i < swiper.loopedSlides; i += 1) {
            const index = i - Math.floor(i / slides.length) * slides.length;
            appendSlides.push(slides.eq(index)[0]);
            prependSlides.unshift(slides.eq(slides.length - index - 1)[0]);
        }
        for (let i = 0; i < appendSlides.length; i += 1) $selector.append(dom(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
        for (let i = prependSlides.length - 1; i >= 0; i -= 1) $selector.prepend(dom(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
    }
    function loopFix() {
        const swiper = this;
        swiper.emit("beforeLoopFix");
        const {activeIndex, slides, loopedSlides, allowSlidePrev, allowSlideNext, snapGrid, rtlTranslate: rtl} = swiper;
        let newIndex;
        swiper.allowSlidePrev = true;
        swiper.allowSlideNext = true;
        const snapTranslate = -snapGrid[activeIndex];
        const diff = snapTranslate - swiper.getTranslate();
        if (activeIndex < loopedSlides) {
            newIndex = slides.length - 3 * loopedSlides + activeIndex;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        } else if (activeIndex >= slides.length - loopedSlides) {
            newIndex = -slides.length + activeIndex + loopedSlides;
            newIndex += loopedSlides;
            const slideChanged = swiper.slideTo(newIndex, 0, false, true);
            if (slideChanged && 0 !== diff) swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
        }
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        swiper.emit("loopFix");
    }
    function loopDestroy() {
        const swiper = this;
        const {$wrapperEl, params, slides} = swiper;
        $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
        slides.removeAttr("data-swiper-slide-index");
    }
    const loop = {
        loopCreate,
        loopFix,
        loopDestroy
    };
    function setGrabCursor(moving) {
        const swiper = this;
        if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        const el = "container" === swiper.params.touchEventsTarget ? swiper.el : swiper.wrapperEl;
        el.style.cursor = "move";
        el.style.cursor = moving ? "grabbing" : "grab";
    }
    function unsetGrabCursor() {
        const swiper = this;
        if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
        swiper["container" === swiper.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "";
    }
    const grab_cursor = {
        setGrabCursor,
        unsetGrabCursor
    };
    function closestElement(selector, base = this) {
        function __closestFrom(el) {
            if (!el || el === ssr_window_esm_getDocument() || el === ssr_window_esm_getWindow()) return null;
            if (el.assignedSlot) el = el.assignedSlot;
            const found = el.closest(selector);
            if (!found && !el.getRootNode) return null;
            return found || __closestFrom(el.getRootNode().host);
        }
        return __closestFrom(base);
    }
    function onTouchStart(event) {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const window = ssr_window_esm_getWindow();
        const data = swiper.touchEventsData;
        const {params, touches, enabled} = swiper;
        if (!enabled) return;
        if (swiper.animating && params.preventInteractionOnTransition) return;
        if (!swiper.animating && params.cssMode && params.loop) swiper.loopFix();
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        let $targetEl = dom(e.target);
        if ("wrapper" === params.touchEventsTarget) if (!$targetEl.closest(swiper.wrapperEl).length) return;
        data.isTouchEvent = "touchstart" === e.type;
        if (!data.isTouchEvent && "which" in e && 3 === e.which) return;
        if (!data.isTouchEvent && "button" in e && e.button > 0) return;
        if (data.isTouched && data.isMoved) return;
        const swipingClassHasValue = !!params.noSwipingClass && "" !== params.noSwipingClass;
        const eventPath = event.composedPath ? event.composedPath() : event.path;
        if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) $targetEl = dom(eventPath[0]);
        const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
        const isTargetShadow = !!(e.target && e.target.shadowRoot);
        if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
            swiper.allowClick = true;
            return;
        }
        if (params.swipeHandler) if (!$targetEl.closest(params.swipeHandler)[0]) return;
        touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX;
        touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
        const startX = touches.currentX;
        const startY = touches.currentY;
        const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
        const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
        if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) if ("prevent" === edgeSwipeDetection) event.preventDefault(); else return;
        Object.assign(data, {
            isTouched: true,
            isMoved: false,
            allowTouchCallbacks: true,
            isScrolling: void 0,
            startMoving: void 0
        });
        touches.startX = startX;
        touches.startY = startY;
        data.touchStartTime = utils_now();
        swiper.allowClick = true;
        swiper.updateSize();
        swiper.swipeDirection = void 0;
        if (params.threshold > 0) data.allowThresholdMove = false;
        if ("touchstart" !== e.type) {
            let preventDefault = true;
            if ($targetEl.is(data.focusableElements)) {
                preventDefault = false;
                if ("SELECT" === $targetEl[0].nodeName) data.isTouched = false;
            }
            if (document.activeElement && dom(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) document.activeElement.blur();
            const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
            if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) e.preventDefault();
        }
        if (swiper.params.freeMode && swiper.params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) swiper.freeMode.onTouchStart();
        swiper.emit("touchStart", e);
    }
    function onTouchMove(event) {
        const document = ssr_window_esm_getDocument();
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (!data.isTouched) {
            if (data.startMoving && data.isScrolling) swiper.emit("touchMoveOpposite", e);
            return;
        }
        if (data.isTouchEvent && "touchmove" !== e.type) return;
        const targetTouch = "touchmove" === e.type && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
        const pageX = "touchmove" === e.type ? targetTouch.pageX : e.pageX;
        const pageY = "touchmove" === e.type ? targetTouch.pageY : e.pageY;
        if (e.preventedByNestedSwiper) {
            touches.startX = pageX;
            touches.startY = pageY;
            return;
        }
        if (!swiper.allowTouchMove) {
            if (!dom(e.target).is(data.focusableElements)) swiper.allowClick = false;
            if (data.isTouched) {
                Object.assign(touches, {
                    startX: pageX,
                    startY: pageY,
                    currentX: pageX,
                    currentY: pageY
                });
                data.touchStartTime = utils_now();
            }
            return;
        }
        if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) if (swiper.isVertical()) {
            if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
                data.isTouched = false;
                data.isMoved = false;
                return;
            }
        } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) return;
        if (data.isTouchEvent && document.activeElement) if (e.target === document.activeElement && dom(e.target).is(data.focusableElements)) {
            data.isMoved = true;
            swiper.allowClick = false;
            return;
        }
        if (data.allowTouchCallbacks) swiper.emit("touchMove", e);
        if (e.targetTouches && e.targetTouches.length > 1) return;
        touches.currentX = pageX;
        touches.currentY = pageY;
        const diffX = touches.currentX - touches.startX;
        const diffY = touches.currentY - touches.startY;
        if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;
        if ("undefined" === typeof data.isScrolling) {
            let touchAngle;
            if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) data.isScrolling = false; else if (diffX * diffX + diffY * diffY >= 25) {
                touchAngle = 180 * Math.atan2(Math.abs(diffY), Math.abs(diffX)) / Math.PI;
                data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
            }
        }
        if (data.isScrolling) swiper.emit("touchMoveOpposite", e);
        if ("undefined" === typeof data.startMoving) if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) data.startMoving = true;
        if (data.isScrolling) {
            data.isTouched = false;
            return;
        }
        if (!data.startMoving) return;
        swiper.allowClick = false;
        if (!params.cssMode && e.cancelable) e.preventDefault();
        if (params.touchMoveStopPropagation && !params.nested) e.stopPropagation();
        if (!data.isMoved) {
            if (params.loop && !params.cssMode) swiper.loopFix();
            data.startTranslate = swiper.getTranslate();
            swiper.setTransition(0);
            if (swiper.animating) swiper.$wrapperEl.trigger("webkitTransitionEnd transitionend");
            data.allowMomentumBounce = false;
            if (params.grabCursor && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(true);
            swiper.emit("sliderFirstMove", e);
        }
        swiper.emit("sliderMove", e);
        data.isMoved = true;
        let diff = swiper.isHorizontal() ? diffX : diffY;
        touches.diff = diff;
        diff *= params.touchRatio;
        if (rtl) diff = -diff;
        swiper.swipeDirection = diff > 0 ? "prev" : "next";
        data.currentTranslate = diff + data.startTranslate;
        let disableParentSwiper = true;
        let resistanceRatio = params.resistanceRatio;
        if (params.touchReleaseOnEdges) resistanceRatio = 0;
        if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
        } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
            disableParentSwiper = false;
            if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
        }
        if (disableParentSwiper) e.preventedByNestedSwiper = true;
        if (!swiper.allowSlideNext && "next" === swiper.swipeDirection && data.currentTranslate < data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && "prev" === swiper.swipeDirection && data.currentTranslate > data.startTranslate) data.currentTranslate = data.startTranslate;
        if (!swiper.allowSlidePrev && !swiper.allowSlideNext) data.currentTranslate = data.startTranslate;
        if (params.threshold > 0) if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
            if (!data.allowThresholdMove) {
                data.allowThresholdMove = true;
                touches.startX = touches.currentX;
                touches.startY = touches.currentY;
                data.currentTranslate = data.startTranslate;
                touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
                return;
            }
        } else {
            data.currentTranslate = data.startTranslate;
            return;
        }
        if (!params.followFinger || params.cssMode) return;
        if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) swiper.freeMode.onTouchMove();
        swiper.updateProgress(data.currentTranslate);
        swiper.setTranslate(data.currentTranslate);
    }
    function onTouchEnd(event) {
        const swiper = this;
        const data = swiper.touchEventsData;
        const {params, touches, rtlTranslate: rtl, slidesGrid, enabled} = swiper;
        if (!enabled) return;
        let e = event;
        if (e.originalEvent) e = e.originalEvent;
        if (data.allowTouchCallbacks) swiper.emit("touchEnd", e);
        data.allowTouchCallbacks = false;
        if (!data.isTouched) {
            if (data.isMoved && params.grabCursor) swiper.setGrabCursor(false);
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        if (params.grabCursor && data.isMoved && data.isTouched && (true === swiper.allowSlideNext || true === swiper.allowSlidePrev)) swiper.setGrabCursor(false);
        const touchEndTime = utils_now();
        const timeDiff = touchEndTime - data.touchStartTime;
        if (swiper.allowClick) {
            const pathTree = e.path || e.composedPath && e.composedPath();
            swiper.updateClickedSlide(pathTree && pathTree[0] || e.target);
            swiper.emit("tap click", e);
            if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) swiper.emit("doubleTap doubleClick", e);
        }
        data.lastClickTime = utils_now();
        utils_nextTick((() => {
            if (!swiper.destroyed) swiper.allowClick = true;
        }));
        if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || 0 === touches.diff || data.currentTranslate === data.startTranslate) {
            data.isTouched = false;
            data.isMoved = false;
            data.startMoving = false;
            return;
        }
        data.isTouched = false;
        data.isMoved = false;
        data.startMoving = false;
        let currentPos;
        if (params.followFinger) currentPos = rtl ? swiper.translate : -swiper.translate; else currentPos = -data.currentTranslate;
        if (params.cssMode) return;
        if (swiper.params.freeMode && params.freeMode.enabled) {
            swiper.freeMode.onTouchEnd({
                currentPos
            });
            return;
        }
        let stopIndex = 0;
        let groupSize = swiper.slidesSizesGrid[0];
        for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
            const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
            if ("undefined" !== typeof slidesGrid[i + increment]) {
                if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
                    stopIndex = i;
                    groupSize = slidesGrid[i + increment] - slidesGrid[i];
                }
            } else if (currentPos >= slidesGrid[i]) {
                stopIndex = i;
                groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
            }
        }
        let rewindFirstIndex = null;
        let rewindLastIndex = null;
        if (params.rewind) if (swiper.isBeginning) rewindLastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1; else if (swiper.isEnd) rewindFirstIndex = 0;
        const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
        const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
        if (timeDiff > params.longSwipesMs) {
            if (!params.longSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            if ("next" === swiper.swipeDirection) if (ratio >= params.longSwipesRatio) swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment); else swiper.slideTo(stopIndex);
            if ("prev" === swiper.swipeDirection) if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment); else if (null !== rewindLastIndex && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) swiper.slideTo(rewindLastIndex); else swiper.slideTo(stopIndex);
        } else {
            if (!params.shortSwipes) {
                swiper.slideTo(swiper.activeIndex);
                return;
            }
            const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);
            if (!isNavButtonTarget) {
                if ("next" === swiper.swipeDirection) swiper.slideTo(null !== rewindFirstIndex ? rewindFirstIndex : stopIndex + increment);
                if ("prev" === swiper.swipeDirection) swiper.slideTo(null !== rewindLastIndex ? rewindLastIndex : stopIndex);
            } else if (e.target === swiper.navigation.nextEl) swiper.slideTo(stopIndex + increment); else swiper.slideTo(stopIndex);
        }
    }
    function onResize() {
        const swiper = this;
        const {params, el} = swiper;
        if (el && 0 === el.offsetWidth) return;
        if (params.breakpoints) swiper.setBreakpoint();
        const {allowSlideNext, allowSlidePrev, snapGrid} = swiper;
        swiper.allowSlideNext = true;
        swiper.allowSlidePrev = true;
        swiper.updateSize();
        swiper.updateSlides();
        swiper.updateSlidesClasses();
        if (("auto" === params.slidesPerView || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) swiper.slideTo(swiper.slides.length - 1, 0, false, true); else swiper.slideTo(swiper.activeIndex, 0, false, true);
        if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) swiper.autoplay.run();
        swiper.allowSlidePrev = allowSlidePrev;
        swiper.allowSlideNext = allowSlideNext;
        if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
    }
    function onClick(e) {
        const swiper = this;
        if (!swiper.enabled) return;
        if (!swiper.allowClick) {
            if (swiper.params.preventClicks) e.preventDefault();
            if (swiper.params.preventClicksPropagation && swiper.animating) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }
    }
    function onScroll() {
        const swiper = this;
        const {wrapperEl, rtlTranslate, enabled} = swiper;
        if (!enabled) return;
        swiper.previousTranslate = swiper.translate;
        if (swiper.isHorizontal()) swiper.translate = -wrapperEl.scrollLeft; else swiper.translate = -wrapperEl.scrollTop;
        if (0 === swiper.translate) swiper.translate = 0;
        swiper.updateActiveIndex();
        swiper.updateSlidesClasses();
        let newProgress;
        const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
        if (0 === translatesDiff) newProgress = 0; else newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
        if (newProgress !== swiper.progress) swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
        swiper.emit("setTranslate", swiper.translate, false);
    }
    let dummyEventAttached = false;
    function dummyEventListener() {}
    const events = (swiper, method) => {
        const document = ssr_window_esm_getDocument();
        const {params, touchEvents, el, wrapperEl, device, support} = swiper;
        const capture = !!params.nested;
        const domMethod = "on" === method ? "addEventListener" : "removeEventListener";
        const swiperMethod = method;
        if (!support.touch) {
            el[domMethod](touchEvents.start, swiper.onTouchStart, false);
            document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
            document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
        } else {
            const passiveListener = "touchstart" === touchEvents.start && support.passiveListener && params.passiveListeners ? {
                passive: true,
                capture: false
            } : false;
            el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
            el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
                passive: false,
                capture
            } : capture);
            el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);
            if (touchEvents.cancel) el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
        }
        if (params.preventClicks || params.preventClicksPropagation) el[domMethod]("click", swiper.onClick, true);
        if (params.cssMode) wrapperEl[domMethod]("scroll", swiper.onScroll);
        if (params.updateOnWindowResize) swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true); else swiper[swiperMethod]("observerUpdate", onResize, true);
    };
    function attachEvents() {
        const swiper = this;
        const document = ssr_window_esm_getDocument();
        const {params, support} = swiper;
        swiper.onTouchStart = onTouchStart.bind(swiper);
        swiper.onTouchMove = onTouchMove.bind(swiper);
        swiper.onTouchEnd = onTouchEnd.bind(swiper);
        if (params.cssMode) swiper.onScroll = onScroll.bind(swiper);
        swiper.onClick = onClick.bind(swiper);
        if (support.touch && !dummyEventAttached) {
            document.addEventListener("touchstart", dummyEventListener);
            dummyEventAttached = true;
        }
        events(swiper, "on");
    }
    function detachEvents() {
        const swiper = this;
        events(swiper, "off");
    }
    const core_events = {
        attachEvents,
        detachEvents
    };
    const isGridEnabled = (swiper, params) => swiper.grid && params.grid && params.grid.rows > 1;
    function setBreakpoint() {
        const swiper = this;
        const {activeIndex, initialized, loopedSlides = 0, params, $el} = swiper;
        const breakpoints = params.breakpoints;
        if (!breakpoints || breakpoints && 0 === Object.keys(breakpoints).length) return;
        const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
        if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
        const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : void 0;
        const breakpointParams = breakpointOnlyParams || swiper.originalParams;
        const wasMultiRow = isGridEnabled(swiper, params);
        const isMultiRow = isGridEnabled(swiper, breakpointParams);
        const wasEnabled = params.enabled;
        if (wasMultiRow && !isMultiRow) {
            $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        } else if (!wasMultiRow && isMultiRow) {
            $el.addClass(`${params.containerModifierClass}grid`);
            if (breakpointParams.grid.fill && "column" === breakpointParams.grid.fill || !breakpointParams.grid.fill && "column" === params.grid.fill) $el.addClass(`${params.containerModifierClass}grid-column`);
            swiper.emitContainerClasses();
        }
        [ "navigation", "pagination", "scrollbar" ].forEach((prop => {
            const wasModuleEnabled = params[prop] && params[prop].enabled;
            const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
            if (wasModuleEnabled && !isModuleEnabled) swiper[prop].disable();
            if (!wasModuleEnabled && isModuleEnabled) swiper[prop].enable();
        }));
        const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
        const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
        if (directionChanged && initialized) swiper.changeDirection();
        utils_extend(swiper.params, breakpointParams);
        const isEnabled = swiper.params.enabled;
        Object.assign(swiper, {
            allowTouchMove: swiper.params.allowTouchMove,
            allowSlideNext: swiper.params.allowSlideNext,
            allowSlidePrev: swiper.params.allowSlidePrev
        });
        if (wasEnabled && !isEnabled) swiper.disable(); else if (!wasEnabled && isEnabled) swiper.enable();
        swiper.currentBreakpoint = breakpoint;
        swiper.emit("_beforeBreakpoint", breakpointParams);
        if (needsReLoop && initialized) {
            swiper.loopDestroy();
            swiper.loopCreate();
            swiper.updateSlides();
            swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
        }
        swiper.emit("breakpoint", breakpointParams);
    }
    function getBreakpoint(breakpoints, base = "window", containerEl) {
        if (!breakpoints || "container" === base && !containerEl) return;
        let breakpoint = false;
        const window = ssr_window_esm_getWindow();
        const currentHeight = "window" === base ? window.innerHeight : containerEl.clientHeight;
        const points = Object.keys(breakpoints).map((point => {
            if ("string" === typeof point && 0 === point.indexOf("@")) {
                const minRatio = parseFloat(point.substr(1));
                const value = currentHeight * minRatio;
                return {
                    value,
                    point
                };
            }
            return {
                value: point,
                point
            };
        }));
        points.sort(((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10)));
        for (let i = 0; i < points.length; i += 1) {
            const {point, value} = points[i];
            if ("window" === base) {
                if (window.matchMedia(`(min-width: ${value}px)`).matches) breakpoint = point;
            } else if (value <= containerEl.clientWidth) breakpoint = point;
        }
        return breakpoint || "max";
    }
    const breakpoints = {
        setBreakpoint,
        getBreakpoint
    };
    function prepareClasses(entries, prefix) {
        const resultClasses = [];
        entries.forEach((item => {
            if ("object" === typeof item) Object.keys(item).forEach((classNames => {
                if (item[classNames]) resultClasses.push(prefix + classNames);
            })); else if ("string" === typeof item) resultClasses.push(prefix + item);
        }));
        return resultClasses;
    }
    function addClasses() {
        const swiper = this;
        const {classNames, params, rtl, $el, device, support} = swiper;
        const suffixes = prepareClasses([ "initialized", params.direction, {
            "pointer-events": !support.touch
        }, {
            "free-mode": swiper.params.freeMode && params.freeMode.enabled
        }, {
            autoheight: params.autoHeight
        }, {
            rtl
        }, {
            grid: params.grid && params.grid.rows > 1
        }, {
            "grid-column": params.grid && params.grid.rows > 1 && "column" === params.grid.fill
        }, {
            android: device.android
        }, {
            ios: device.ios
        }, {
            "css-mode": params.cssMode
        }, {
            centered: params.cssMode && params.centeredSlides
        }, {
            "watch-progress": params.watchSlidesProgress
        } ], params.containerModifierClass);
        classNames.push(...suffixes);
        $el.addClass([ ...classNames ].join(" "));
        swiper.emitContainerClasses();
    }
    function removeClasses_removeClasses() {
        const swiper = this;
        const {$el, classNames} = swiper;
        $el.removeClass(classNames.join(" "));
        swiper.emitContainerClasses();
    }
    const classes = {
        addClasses,
        removeClasses: removeClasses_removeClasses
    };
    function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
        const window = ssr_window_esm_getWindow();
        let image;
        function onReady() {
            if (callback) callback();
        }
        const isPicture = dom(imageEl).parent("picture")[0];
        if (!isPicture && (!imageEl.complete || !checkForComplete)) if (src) {
            image = new window.Image;
            image.onload = onReady;
            image.onerror = onReady;
            if (sizes) image.sizes = sizes;
            if (srcset) image.srcset = srcset;
            if (src) image.src = src;
        } else onReady(); else onReady();
    }
    function preloadImages() {
        const swiper = this;
        swiper.imagesToLoad = swiper.$el.find("img");
        function onReady() {
            if ("undefined" === typeof swiper || null === swiper || !swiper || swiper.destroyed) return;
            if (void 0 !== swiper.imagesLoaded) swiper.imagesLoaded += 1;
            if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
                if (swiper.params.updateOnImagesReady) swiper.update();
                swiper.emit("imagesReady");
            }
        }
        for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
            const imageEl = swiper.imagesToLoad[i];
            swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
        }
    }
    const core_images = {
        loadImage,
        preloadImages
    };
    function checkOverflow() {
        const swiper = this;
        const {isLocked: wasLocked, params} = swiper;
        const {slidesOffsetBefore} = params;
        if (slidesOffsetBefore) {
            const lastSlideIndex = swiper.slides.length - 1;
            const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + 2 * slidesOffsetBefore;
            swiper.isLocked = swiper.size > lastSlideRightEdge;
        } else swiper.isLocked = 1 === swiper.snapGrid.length;
        if (true === params.allowSlideNext) swiper.allowSlideNext = !swiper.isLocked;
        if (true === params.allowSlidePrev) swiper.allowSlidePrev = !swiper.isLocked;
        if (wasLocked && wasLocked !== swiper.isLocked) swiper.isEnd = false;
        if (wasLocked !== swiper.isLocked) swiper.emit(swiper.isLocked ? "lock" : "unlock");
    }
    const check_overflow = {
        checkOverflow
    };
    const defaults = {
        init: true,
        direction: "horizontal",
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: false,
        updateOnWindowResize: true,
        resizeObserver: true,
        nested: false,
        createElements: false,
        enabled: true,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: false,
        userAgent: null,
        url: null,
        edgeSwipeDetection: false,
        edgeSwipeThreshold: 20,
        autoHeight: false,
        setWrapperSize: false,
        virtualTranslate: false,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: false,
        centeredSlides: false,
        centeredSlidesBounds: false,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: true,
        centerInsufficientSlides: false,
        watchOverflow: true,
        roundLengths: false,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: true,
        shortSwipes: true,
        longSwipes: true,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: true,
        allowTouchMove: true,
        threshold: 0,
        touchMoveStopPropagation: false,
        touchStartPreventDefault: true,
        touchStartForcePreventDefault: false,
        touchReleaseOnEdges: false,
        uniqueNavElements: true,
        resistance: true,
        resistanceRatio: .85,
        watchSlidesProgress: false,
        grabCursor: false,
        preventClicks: true,
        preventClicksPropagation: true,
        slideToClickedSlide: false,
        preloadImages: true,
        updateOnImagesReady: true,
        loop: false,
        loopAdditionalSlides: 0,
        loopedSlides: null,
        loopedSlidesLimit: true,
        loopFillGroupWithBlank: false,
        loopPreventsSlide: true,
        rewind: false,
        allowSlidePrev: true,
        allowSlideNext: true,
        swipeHandler: null,
        noSwiping: true,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: true,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-invisible-blank",
        slideActiveClass: "swiper-slide-active",
        slideDuplicateActiveClass: "swiper-slide-duplicate-active",
        slideVisibleClass: "swiper-slide-visible",
        slideDuplicateClass: "swiper-slide-duplicate",
        slideNextClass: "swiper-slide-next",
        slideDuplicateNextClass: "swiper-slide-duplicate-next",
        slidePrevClass: "swiper-slide-prev",
        slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
        wrapperClass: "swiper-wrapper",
        runCallbacksOnInit: true,
        _emitClasses: false
    };
    function moduleExtendParams(params, allModulesParams) {
        return function extendParams(obj = {}) {
            const moduleParamName = Object.keys(obj)[0];
            const moduleParams = obj[moduleParamName];
            if ("object" !== typeof moduleParams || null === moduleParams) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if ([ "navigation", "pagination", "scrollbar" ].indexOf(moduleParamName) >= 0 && true === params[moduleParamName]) params[moduleParamName] = {
                auto: true
            };
            if (!(moduleParamName in params && "enabled" in moduleParams)) {
                utils_extend(allModulesParams, obj);
                return;
            }
            if (true === params[moduleParamName]) params[moduleParamName] = {
                enabled: true
            };
            if ("object" === typeof params[moduleParamName] && !("enabled" in params[moduleParamName])) params[moduleParamName].enabled = true;
            if (!params[moduleParamName]) params[moduleParamName] = {
                enabled: false
            };
            utils_extend(allModulesParams, obj);
        };
    }
    const prototypes = {
        eventsEmitter: events_emitter,
        update,
        translate,
        transition: core_transition,
        slide,
        loop,
        grabCursor: grab_cursor,
        events: core_events,
        breakpoints,
        checkOverflow: check_overflow,
        classes,
        images: core_images
    };
    const extendedDefaults = {};
    class core_Swiper {
        constructor(...args) {
            let el;
            let params;
            if (1 === args.length && args[0].constructor && "Object" === Object.prototype.toString.call(args[0]).slice(8, -1)) params = args[0]; else [el, params] = args;
            if (!params) params = {};
            params = utils_extend({}, params);
            if (el && !params.el) params.el = el;
            if (params.el && dom(params.el).length > 1) {
                const swipers = [];
                dom(params.el).each((containerEl => {
                    const newParams = utils_extend({}, params, {
                        el: containerEl
                    });
                    swipers.push(new core_Swiper(newParams));
                }));
                return swipers;
            }
            const swiper = this;
            swiper.__swiper__ = true;
            swiper.support = getSupport();
            swiper.device = getDevice({
                userAgent: params.userAgent
            });
            swiper.browser = getBrowser();
            swiper.eventsListeners = {};
            swiper.eventsAnyListeners = [];
            swiper.modules = [ ...swiper.__modules__ ];
            if (params.modules && Array.isArray(params.modules)) swiper.modules.push(...params.modules);
            const allModulesParams = {};
            swiper.modules.forEach((mod => {
                mod({
                    swiper,
                    extendParams: moduleExtendParams(params, allModulesParams),
                    on: swiper.on.bind(swiper),
                    once: swiper.once.bind(swiper),
                    off: swiper.off.bind(swiper),
                    emit: swiper.emit.bind(swiper)
                });
            }));
            const swiperParams = utils_extend({}, defaults, allModulesParams);
            swiper.params = utils_extend({}, swiperParams, extendedDefaults, params);
            swiper.originalParams = utils_extend({}, swiper.params);
            swiper.passedParams = utils_extend({}, params);
            if (swiper.params && swiper.params.on) Object.keys(swiper.params.on).forEach((eventName => {
                swiper.on(eventName, swiper.params.on[eventName]);
            }));
            if (swiper.params && swiper.params.onAny) swiper.onAny(swiper.params.onAny);
            swiper.$ = dom;
            Object.assign(swiper, {
                enabled: swiper.params.enabled,
                el,
                classNames: [],
                slides: dom(),
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal() {
                    return "horizontal" === swiper.params.direction;
                },
                isVertical() {
                    return "vertical" === swiper.params.direction;
                },
                activeIndex: 0,
                realIndex: 0,
                isBeginning: true,
                isEnd: false,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: false,
                allowSlideNext: swiper.params.allowSlideNext,
                allowSlidePrev: swiper.params.allowSlidePrev,
                touchEvents: function touchEvents() {
                    const touch = [ "touchstart", "touchmove", "touchend", "touchcancel" ];
                    const desktop = [ "pointerdown", "pointermove", "pointerup" ];
                    swiper.touchEventsTouch = {
                        start: touch[0],
                        move: touch[1],
                        end: touch[2],
                        cancel: touch[3]
                    };
                    swiper.touchEventsDesktop = {
                        start: desktop[0],
                        move: desktop[1],
                        end: desktop[2]
                    };
                    return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
                }(),
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: swiper.params.focusableElements,
                    lastClickTime: utils_now(),
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    isTouchEvent: void 0,
                    startMoving: void 0
                },
                allowClick: true,
                allowTouchMove: swiper.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            });
            swiper.emit("_swiper");
            if (swiper.params.init) swiper.init();
            return swiper;
        }
        enable() {
            const swiper = this;
            if (swiper.enabled) return;
            swiper.enabled = true;
            if (swiper.params.grabCursor) swiper.setGrabCursor();
            swiper.emit("enable");
        }
        disable() {
            const swiper = this;
            if (!swiper.enabled) return;
            swiper.enabled = false;
            if (swiper.params.grabCursor) swiper.unsetGrabCursor();
            swiper.emit("disable");
        }
        setProgress(progress, speed) {
            const swiper = this;
            progress = Math.min(Math.max(progress, 0), 1);
            const min = swiper.minTranslate();
            const max = swiper.maxTranslate();
            const current = (max - min) * progress + min;
            swiper.translateTo(current, "undefined" === typeof speed ? 0 : speed);
            swiper.updateActiveIndex();
            swiper.updateSlidesClasses();
        }
        emitContainerClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const cls = swiper.el.className.split(" ").filter((className => 0 === className.indexOf("swiper") || 0 === className.indexOf(swiper.params.containerModifierClass)));
            swiper.emit("_containerClasses", cls.join(" "));
        }
        getSlideClasses(slideEl) {
            const swiper = this;
            if (swiper.destroyed) return "";
            return slideEl.className.split(" ").filter((className => 0 === className.indexOf("swiper-slide") || 0 === className.indexOf(swiper.params.slideClass))).join(" ");
        }
        emitSlidesClasses() {
            const swiper = this;
            if (!swiper.params._emitClasses || !swiper.el) return;
            const updates = [];
            swiper.slides.each((slideEl => {
                const classNames = swiper.getSlideClasses(slideEl);
                updates.push({
                    slideEl,
                    classNames
                });
                swiper.emit("_slideClass", slideEl, classNames);
            }));
            swiper.emit("_slideClasses", updates);
        }
        slidesPerViewDynamic(view = "current", exact = false) {
            const swiper = this;
            const {params, slides, slidesGrid, slidesSizesGrid, size: swiperSize, activeIndex} = swiper;
            let spv = 1;
            if (params.centeredSlides) {
                let slideSize = slides[activeIndex].swiperSlideSize;
                let breakLoop;
                for (let i = activeIndex + 1; i < slides.length; i += 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
                for (let i = activeIndex - 1; i >= 0; i -= 1) if (slides[i] && !breakLoop) {
                    slideSize += slides[i].swiperSlideSize;
                    spv += 1;
                    if (slideSize > swiperSize) breakLoop = true;
                }
            } else if ("current" === view) for (let i = activeIndex + 1; i < slides.length; i += 1) {
                const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
                if (slideInView) spv += 1;
            } else for (let i = activeIndex - 1; i >= 0; i -= 1) {
                const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
                if (slideInView) spv += 1;
            }
            return spv;
        }
        update() {
            const swiper = this;
            if (!swiper || swiper.destroyed) return;
            const {snapGrid, params} = swiper;
            if (params.breakpoints) swiper.setBreakpoint();
            swiper.updateSize();
            swiper.updateSlides();
            swiper.updateProgress();
            swiper.updateSlidesClasses();
            function setTranslate() {
                const translateValue = swiper.rtlTranslate ? -1 * swiper.translate : swiper.translate;
                const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
                swiper.setTranslate(newTranslate);
                swiper.updateActiveIndex();
                swiper.updateSlidesClasses();
            }
            let translated;
            if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
                setTranslate();
                if (swiper.params.autoHeight) swiper.updateAutoHeight();
            } else {
                if (("auto" === swiper.params.slidesPerView || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true); else translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
                if (!translated) setTranslate();
            }
            if (params.watchOverflow && snapGrid !== swiper.snapGrid) swiper.checkOverflow();
            swiper.emit("update");
        }
        changeDirection(newDirection, needUpdate = true) {
            const swiper = this;
            const currentDirection = swiper.params.direction;
            if (!newDirection) newDirection = "horizontal" === currentDirection ? "vertical" : "horizontal";
            if (newDirection === currentDirection || "horizontal" !== newDirection && "vertical" !== newDirection) return swiper;
            swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
            swiper.emitContainerClasses();
            swiper.params.direction = newDirection;
            swiper.slides.each((slideEl => {
                if ("vertical" === newDirection) slideEl.style.width = ""; else slideEl.style.height = "";
            }));
            swiper.emit("changeDirection");
            if (needUpdate) swiper.update();
            return swiper;
        }
        changeLanguageDirection(direction) {
            const swiper = this;
            if (swiper.rtl && "rtl" === direction || !swiper.rtl && "ltr" === direction) return;
            swiper.rtl = "rtl" === direction;
            swiper.rtlTranslate = "horizontal" === swiper.params.direction && swiper.rtl;
            if (swiper.rtl) {
                swiper.$el.addClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "rtl";
            } else {
                swiper.$el.removeClass(`${swiper.params.containerModifierClass}rtl`);
                swiper.el.dir = "ltr";
            }
            swiper.update();
        }
        mount(el) {
            const swiper = this;
            if (swiper.mounted) return true;
            const $el = dom(el || swiper.params.el);
            el = $el[0];
            if (!el) return false;
            el.swiper = swiper;
            const getWrapperSelector = () => `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
            const getWrapper = () => {
                if (el && el.shadowRoot && el.shadowRoot.querySelector) {
                    const res = dom(el.shadowRoot.querySelector(getWrapperSelector()));
                    res.children = options => $el.children(options);
                    return res;
                }
                if (!$el.children) return dom($el).children(getWrapperSelector());
                return $el.children(getWrapperSelector());
            };
            let $wrapperEl = getWrapper();
            if (0 === $wrapperEl.length && swiper.params.createElements) {
                const document = ssr_window_esm_getDocument();
                const wrapper = document.createElement("div");
                $wrapperEl = dom(wrapper);
                wrapper.className = swiper.params.wrapperClass;
                $el.append(wrapper);
                $el.children(`.${swiper.params.slideClass}`).each((slideEl => {
                    $wrapperEl.append(slideEl);
                }));
            }
            Object.assign(swiper, {
                $el,
                el,
                $wrapperEl,
                wrapperEl: $wrapperEl[0],
                mounted: true,
                rtl: "rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction"),
                rtlTranslate: "horizontal" === swiper.params.direction && ("rtl" === el.dir.toLowerCase() || "rtl" === $el.css("direction")),
                wrongRTL: "-webkit-box" === $wrapperEl.css("display")
            });
            return true;
        }
        init(el) {
            const swiper = this;
            if (swiper.initialized) return swiper;
            const mounted = swiper.mount(el);
            if (false === mounted) return swiper;
            swiper.emit("beforeInit");
            if (swiper.params.breakpoints) swiper.setBreakpoint();
            swiper.addClasses();
            if (swiper.params.loop) swiper.loopCreate();
            swiper.updateSize();
            swiper.updateSlides();
            if (swiper.params.watchOverflow) swiper.checkOverflow();
            if (swiper.params.grabCursor && swiper.enabled) swiper.setGrabCursor();
            if (swiper.params.preloadImages) swiper.preloadImages();
            if (swiper.params.loop) swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true); else swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
            swiper.attachEvents();
            swiper.initialized = true;
            swiper.emit("init");
            swiper.emit("afterInit");
            return swiper;
        }
        destroy(deleteInstance = true, cleanStyles = true) {
            const swiper = this;
            const {params, $el, $wrapperEl, slides} = swiper;
            if ("undefined" === typeof swiper.params || swiper.destroyed) return null;
            swiper.emit("beforeDestroy");
            swiper.initialized = false;
            swiper.detachEvents();
            if (params.loop) swiper.loopDestroy();
            if (cleanStyles) {
                swiper.removeClasses();
                $el.removeAttr("style");
                $wrapperEl.removeAttr("style");
                if (slides && slides.length) slides.removeClass([ params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
            }
            swiper.emit("destroy");
            Object.keys(swiper.eventsListeners).forEach((eventName => {
                swiper.off(eventName);
            }));
            if (false !== deleteInstance) {
                swiper.$el[0].swiper = null;
                deleteProps(swiper);
            }
            swiper.destroyed = true;
            return null;
        }
        static extendDefaults(newDefaults) {
            utils_extend(extendedDefaults, newDefaults);
        }
        static get extendedDefaults() {
            return extendedDefaults;
        }
        static get defaults() {
            return defaults;
        }
        static installModule(mod) {
            if (!core_Swiper.prototype.__modules__) core_Swiper.prototype.__modules__ = [];
            const modules = core_Swiper.prototype.__modules__;
            if ("function" === typeof mod && modules.indexOf(mod) < 0) modules.push(mod);
        }
        static use(module) {
            if (Array.isArray(module)) {
                module.forEach((m => core_Swiper.installModule(m)));
                return core_Swiper;
            }
            core_Swiper.installModule(module);
            return core_Swiper;
        }
    }
    Object.keys(prototypes).forEach((prototypeGroup => {
        Object.keys(prototypes[prototypeGroup]).forEach((protoMethod => {
            core_Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
        }));
    }));
    core_Swiper.use([ Resize, Observer ]);
    const core = core_Swiper;
    function create_element_if_not_defined_createElementIfNotDefined(swiper, originalParams, params, checkProps) {
        const document = ssr_window_esm_getDocument();
        if (swiper.params.createElements) Object.keys(checkProps).forEach((key => {
            if (!params[key] && true === params.auto) {
                let element = swiper.$el.children(`.${checkProps[key]}`)[0];
                if (!element) {
                    element = document.createElement("div");
                    element.className = checkProps[key];
                    swiper.$el.append(element);
                }
                params[key] = element;
                originalParams[key] = element;
            }
        }));
        return params;
    }
    function Navigation({swiper, extendParams, on, emit}) {
        extendParams({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: false,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        });
        swiper.navigation = {
            nextEl: null,
            $nextEl: null,
            prevEl: null,
            $prevEl: null
        };
        function getEl(el) {
            let $el;
            if (el) {
                $el = dom(el);
                if (swiper.params.uniqueNavElements && "string" === typeof el && $el.length > 1 && 1 === swiper.$el.find(el).length) $el = swiper.$el.find(el);
            }
            return $el;
        }
        function toggleEl($el, disabled) {
            const params = swiper.params.navigation;
            if ($el && $el.length > 0) {
                $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
                if ($el[0] && "BUTTON" === $el[0].tagName) $el[0].disabled = disabled;
                if (swiper.params.watchOverflow && swiper.enabled) $el[swiper.isLocked ? "addClass" : "removeClass"](params.lockClass);
            }
        }
        function update() {
            if (swiper.params.loop) return;
            const {$nextEl, $prevEl} = swiper.navigation;
            toggleEl($prevEl, swiper.isBeginning && !swiper.params.rewind);
            toggleEl($nextEl, swiper.isEnd && !swiper.params.rewind);
        }
        function onPrevClick(e) {
            e.preventDefault();
            if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slidePrev();
            emit("navigationPrev");
        }
        function onNextClick(e) {
            e.preventDefault();
            if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
            swiper.slideNext();
            emit("navigationNext");
        }
        function init() {
            const params = swiper.params.navigation;
            swiper.params.navigation = create_element_if_not_defined_createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
                nextEl: "swiper-button-next",
                prevEl: "swiper-button-prev"
            });
            if (!(params.nextEl || params.prevEl)) return;
            const $nextEl = getEl(params.nextEl);
            const $prevEl = getEl(params.prevEl);
            if ($nextEl && $nextEl.length > 0) $nextEl.on("click", onNextClick);
            if ($prevEl && $prevEl.length > 0) $prevEl.on("click", onPrevClick);
            Object.assign(swiper.navigation, {
                $nextEl,
                nextEl: $nextEl && $nextEl[0],
                $prevEl,
                prevEl: $prevEl && $prevEl[0]
            });
            if (!swiper.enabled) {
                if ($nextEl) $nextEl.addClass(params.lockClass);
                if ($prevEl) $prevEl.addClass(params.lockClass);
            }
        }
        function destroy() {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl && $nextEl.length) {
                $nextEl.off("click", onNextClick);
                $nextEl.removeClass(swiper.params.navigation.disabledClass);
            }
            if ($prevEl && $prevEl.length) {
                $prevEl.off("click", onPrevClick);
                $prevEl.removeClass(swiper.params.navigation.disabledClass);
            }
        }
        on("init", (() => {
            if (false === swiper.params.navigation.enabled) disable(); else {
                init();
                update();
            }
        }));
        on("toEdge fromEdge lock unlock", (() => {
            update();
        }));
        on("destroy", (() => {
            destroy();
        }));
        on("enable disable", (() => {
            const {$nextEl, $prevEl} = swiper.navigation;
            if ($nextEl) $nextEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
            if ($prevEl) $prevEl[swiper.enabled ? "removeClass" : "addClass"](swiper.params.navigation.lockClass);
        }));
        on("click", ((_s, e) => {
            const {$nextEl, $prevEl} = swiper.navigation;
            const targetEl = e.target;
            if (swiper.params.navigation.hideOnClick && !dom(targetEl).is($prevEl) && !dom(targetEl).is($nextEl)) {
                if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
                let isHidden;
                if ($nextEl) isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass); else if ($prevEl) isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
                if (true === isHidden) emit("navigationShow"); else emit("navigationHide");
                if ($nextEl) $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
                if ($prevEl) $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
            }
        }));
        const enable = () => {
            swiper.$el.removeClass(swiper.params.navigation.navigationDisabledClass);
            init();
            update();
        };
        const disable = () => {
            swiper.$el.addClass(swiper.params.navigation.navigationDisabledClass);
            destroy();
        };
        Object.assign(swiper.navigation, {
            enable,
            disable,
            update,
            init,
            destroy
        });
    }
    !function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).Swiper = t();
    }(void 0, (function() {
        "use strict";
        function e(e) {
            return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object;
        }
        function t(s, a) {
            void 0 === s && (s = {}), void 0 === a && (a = {}), Object.keys(a).forEach((i => {
                void 0 === s[i] ? s[i] = a[i] : e(a[i]) && e(s[i]) && Object.keys(a[i]).length > 0 && t(s[i], a[i]);
            }));
        }
        const s = {
            body: {},
            addEventListener() {},
            removeEventListener() {},
            activeElement: {
                blur() {},
                nodeName: ""
            },
            querySelector: () => null,
            querySelectorAll: () => [],
            getElementById: () => null,
            createEvent: () => ({
                initEvent() {}
            }),
            createElement: () => ({
                children: [],
                childNodes: [],
                style: {},
                setAttribute() {},
                getElementsByTagName: () => []
            }),
            createElementNS: () => ({}),
            importNode: () => null,
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            }
        };
        function a() {
            const e = "undefined" != typeof document ? document : {};
            return t(e, s), e;
        }
        const i = {
            document: s,
            navigator: {
                userAgent: ""
            },
            location: {
                hash: "",
                host: "",
                hostname: "",
                href: "",
                origin: "",
                pathname: "",
                protocol: "",
                search: ""
            },
            history: {
                replaceState() {},
                pushState() {},
                go() {},
                back() {}
            },
            CustomEvent: function() {
                return this;
            },
            addEventListener() {},
            removeEventListener() {},
            getComputedStyle: () => ({
                getPropertyValue: () => ""
            }),
            Image() {},
            Date() {},
            screen: {},
            setTimeout() {},
            clearTimeout() {},
            matchMedia: () => ({}),
            requestAnimationFrame: e => "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0),
            cancelAnimationFrame(e) {
                "undefined" != typeof setTimeout && clearTimeout(e);
            }
        };
        function r() {
            const e = "undefined" != typeof window ? window : {};
            return t(e, i), e;
        }
        class n extends Array {
            constructor(e) {
                "number" == typeof e ? super(e) : (super(...e || []), function(e) {
                    const t = e.__proto__;
                    Object.defineProperty(e, "__proto__", {
                        get: () => t,
                        set(e) {
                            t.__proto__ = e;
                        }
                    });
                }(this));
            }
        }
        function l(e) {
            void 0 === e && (e = []);
            const t = [];
            return e.forEach((e => {
                Array.isArray(e) ? t.push(...l(e)) : t.push(e);
            })), t;
        }
        function o(e, t) {
            return Array.prototype.filter.call(e, t);
        }
        function d(e, t) {
            const s = r(), i = a();
            let l = [];
            if (!t && e instanceof n) return e;
            if (!e) return new n(l);
            if ("string" == typeof e) {
                const s = e.trim();
                if (s.indexOf("<") >= 0 && s.indexOf(">") >= 0) {
                    let e = "div";
                    0 === s.indexOf("<li") && (e = "ul"), 0 === s.indexOf("<tr") && (e = "tbody"), 0 !== s.indexOf("<td") && 0 !== s.indexOf("<th") || (e = "tr"), 
                    0 === s.indexOf("<tbody") && (e = "table"), 0 === s.indexOf("<option") && (e = "select");
                    const t = i.createElement(e);
                    t.innerHTML = s;
                    for (let e = 0; e < t.childNodes.length; e += 1) l.push(t.childNodes[e]);
                } else l = function(e, t) {
                    if ("string" != typeof e) return [ e ];
                    const s = [], a = t.querySelectorAll(e);
                    for (let e = 0; e < a.length; e += 1) s.push(a[e]);
                    return s;
                }(e.trim(), t || i);
            } else if (e.nodeType || e === s || e === i) l.push(e); else if (Array.isArray(e)) {
                if (e instanceof n) return e;
                l = e;
            }
            return new n(function(e) {
                const t = [];
                for (let s = 0; s < e.length; s += 1) -1 === t.indexOf(e[s]) && t.push(e[s]);
                return t;
            }(l));
        }
        d.fn = n.prototype;
        const c = {
            addClass: function() {
                for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
                const a = l(t.map((e => e.split(" "))));
                return this.forEach((e => {
                    e.classList.add(...a);
                })), this;
            },
            removeClass: function() {
                for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
                const a = l(t.map((e => e.split(" "))));
                return this.forEach((e => {
                    e.classList.remove(...a);
                })), this;
            },
            hasClass: function() {
                for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
                const a = l(t.map((e => e.split(" "))));
                return o(this, (e => a.filter((t => e.classList.contains(t))).length > 0)).length > 0;
            },
            toggleClass: function() {
                for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
                const a = l(t.map((e => e.split(" "))));
                this.forEach((e => {
                    a.forEach((t => {
                        e.classList.toggle(t);
                    }));
                }));
            },
            attr: function(e, t) {
                if (1 === arguments.length && "string" == typeof e) return this[0] ? this[0].getAttribute(e) : void 0;
                for (let s = 0; s < this.length; s += 1) if (2 === arguments.length) this[s].setAttribute(e, t); else for (const t in e) this[s][t] = e[t], 
                this[s].setAttribute(t, e[t]);
                return this;
            },
            removeAttr: function(e) {
                for (let t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
                return this;
            },
            transform: function(e) {
                for (let t = 0; t < this.length; t += 1) this[t].style.transform = e;
                return this;
            },
            transition: function(e) {
                for (let t = 0; t < this.length; t += 1) this[t].style.transitionDuration = "string" != typeof e ? `${e}ms` : e;
                return this;
            },
            on: function() {
                for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
                let [a, i, r, n] = t;
                function l(e) {
                    const t = e.target;
                    if (!t) return;
                    const s = e.target.dom7EventData || [];
                    if (s.indexOf(e) < 0 && s.unshift(e), d(t).is(i)) r.apply(t, s); else {
                        const e = d(t).parents();
                        for (let t = 0; t < e.length; t += 1) d(e[t]).is(i) && r.apply(e[t], s);
                    }
                }
                function o(e) {
                    const t = e && e.target && e.target.dom7EventData || [];
                    t.indexOf(e) < 0 && t.unshift(e), r.apply(this, t);
                }
                "function" == typeof t[1] && ([a, r, n] = t, i = void 0), n || (n = !1);
                const c = a.split(" ");
                let p;
                for (let e = 0; e < this.length; e += 1) {
                    const t = this[e];
                    if (i) for (p = 0; p < c.length; p += 1) {
                        const e = c[p];
                        t.dom7LiveListeners || (t.dom7LiveListeners = {}), t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []), 
                        t.dom7LiveListeners[e].push({
                            listener: r,
                            proxyListener: l
                        }), t.addEventListener(e, l, n);
                    } else for (p = 0; p < c.length; p += 1) {
                        const e = c[p];
                        t.dom7Listeners || (t.dom7Listeners = {}), t.dom7Listeners[e] || (t.dom7Listeners[e] = []), 
                        t.dom7Listeners[e].push({
                            listener: r,
                            proxyListener: o
                        }), t.addEventListener(e, o, n);
                    }
                }
                return this;
            },
            off: function() {
                for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++) t[s] = arguments[s];
                let [a, i, r, n] = t;
                "function" == typeof t[1] && ([a, r, n] = t, i = void 0), n || (n = !1);
                const l = a.split(" ");
                for (let e = 0; e < l.length; e += 1) {
                    const t = l[e];
                    for (let e = 0; e < this.length; e += 1) {
                        const s = this[e];
                        let a;
                        if (!i && s.dom7Listeners ? a = s.dom7Listeners[t] : i && s.dom7LiveListeners && (a = s.dom7LiveListeners[t]), 
                        a && a.length) for (let e = a.length - 1; e >= 0; e -= 1) {
                            const i = a[e];
                            r && i.listener === r || r && i.listener && i.listener.dom7proxy && i.listener.dom7proxy === r ? (s.removeEventListener(t, i.proxyListener, n), 
                            a.splice(e, 1)) : r || (s.removeEventListener(t, i.proxyListener, n), a.splice(e, 1));
                        }
                    }
                }
                return this;
            },
            trigger: function() {
                const e = r();
                for (var t = arguments.length, s = new Array(t), a = 0; a < t; a++) s[a] = arguments[a];
                const i = s[0].split(" "), n = s[1];
                for (let t = 0; t < i.length; t += 1) {
                    const a = i[t];
                    for (let t = 0; t < this.length; t += 1) {
                        const i = this[t];
                        if (e.CustomEvent) {
                            const t = new e.CustomEvent(a, {
                                detail: n,
                                bubbles: !0,
                                cancelable: !0
                            });
                            i.dom7EventData = s.filter(((e, t) => t > 0)), i.dispatchEvent(t), i.dom7EventData = [], 
                            delete i.dom7EventData;
                        }
                    }
                }
                return this;
            },
            transitionEnd: function(e) {
                const t = this;
                return e && t.on("transitionend", (function s(a) {
                    a.target === this && (e.call(this, a), t.off("transitionend", s));
                })), this;
            },
            outerWidth: function(e) {
                if (this.length > 0) {
                    if (e) {
                        const e = this.styles();
                        return this[0].offsetWidth + parseFloat(e.getPropertyValue("margin-right")) + parseFloat(e.getPropertyValue("margin-left"));
                    }
                    return this[0].offsetWidth;
                }
                return null;
            },
            outerHeight: function(e) {
                if (this.length > 0) {
                    if (e) {
                        const e = this.styles();
                        return this[0].offsetHeight + parseFloat(e.getPropertyValue("margin-top")) + parseFloat(e.getPropertyValue("margin-bottom"));
                    }
                    return this[0].offsetHeight;
                }
                return null;
            },
            styles: function() {
                const e = r();
                return this[0] ? e.getComputedStyle(this[0], null) : {};
            },
            offset: function() {
                if (this.length > 0) {
                    const e = r(), t = a(), s = this[0], i = s.getBoundingClientRect(), n = t.body, l = s.clientTop || n.clientTop || 0, o = s.clientLeft || n.clientLeft || 0, d = s === e ? e.scrollY : s.scrollTop, c = s === e ? e.scrollX : s.scrollLeft;
                    return {
                        top: i.top + d - l,
                        left: i.left + c - o
                    };
                }
                return null;
            },
            css: function(e, t) {
                const s = r();
                let a;
                if (1 === arguments.length) {
                    if ("string" != typeof e) {
                        for (a = 0; a < this.length; a += 1) for (const t in e) this[a].style[t] = e[t];
                        return this;
                    }
                    if (this[0]) return s.getComputedStyle(this[0], null).getPropertyValue(e);
                }
                if (2 === arguments.length && "string" == typeof e) {
                    for (a = 0; a < this.length; a += 1) this[a].style[e] = t;
                    return this;
                }
                return this;
            },
            each: function(e) {
                return e ? (this.forEach(((t, s) => {
                    e.apply(t, [ t, s ]);
                })), this) : this;
            },
            html: function(e) {
                if (void 0 === e) return this[0] ? this[0].innerHTML : null;
                for (let t = 0; t < this.length; t += 1) this[t].innerHTML = e;
                return this;
            },
            text: function(e) {
                if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
                for (let t = 0; t < this.length; t += 1) this[t].textContent = e;
                return this;
            },
            is: function(e) {
                const t = r(), s = a(), i = this[0];
                let l, o;
                if (!i || void 0 === e) return !1;
                if ("string" == typeof e) {
                    if (i.matches) return i.matches(e);
                    if (i.webkitMatchesSelector) return i.webkitMatchesSelector(e);
                    if (i.msMatchesSelector) return i.msMatchesSelector(e);
                    for (l = d(e), o = 0; o < l.length; o += 1) if (l[o] === i) return !0;
                    return !1;
                }
                if (e === s) return i === s;
                if (e === t) return i === t;
                if (e.nodeType || e instanceof n) {
                    for (l = e.nodeType ? [ e ] : e, o = 0; o < l.length; o += 1) if (l[o] === i) return !0;
                    return !1;
                }
                return !1;
            },
            index: function() {
                let e, t = this[0];
                if (t) {
                    for (e = 0; null !== (t = t.previousSibling); ) 1 === t.nodeType && (e += 1);
                    return e;
                }
            },
            eq: function(e) {
                if (void 0 === e) return this;
                const t = this.length;
                if (e > t - 1) return d([]);
                if (e < 0) {
                    const s = t + e;
                    return d(s < 0 ? [] : [ this[s] ]);
                }
                return d([ this[e] ]);
            },
            append: function() {
                let e;
                const t = a();
                for (let s = 0; s < arguments.length; s += 1) {
                    e = s < 0 || arguments.length <= s ? void 0 : arguments[s];
                    for (let s = 0; s < this.length; s += 1) if ("string" == typeof e) {
                        const a = t.createElement("div");
                        for (a.innerHTML = e; a.firstChild; ) this[s].appendChild(a.firstChild);
                    } else if (e instanceof n) for (let t = 0; t < e.length; t += 1) this[s].appendChild(e[t]); else this[s].appendChild(e);
                }
                return this;
            },
            prepend: function(e) {
                const t = a();
                let s, i;
                for (s = 0; s < this.length; s += 1) if ("string" == typeof e) {
                    const a = t.createElement("div");
                    for (a.innerHTML = e, i = a.childNodes.length - 1; i >= 0; i -= 1) this[s].insertBefore(a.childNodes[i], this[s].childNodes[0]);
                } else if (e instanceof n) for (i = 0; i < e.length; i += 1) this[s].insertBefore(e[i], this[s].childNodes[0]); else this[s].insertBefore(e, this[s].childNodes[0]);
                return this;
            },
            next: function(e) {
                return this.length > 0 ? e ? this[0].nextElementSibling && d(this[0].nextElementSibling).is(e) ? d([ this[0].nextElementSibling ]) : d([]) : this[0].nextElementSibling ? d([ this[0].nextElementSibling ]) : d([]) : d([]);
            },
            nextAll: function(e) {
                const t = [];
                let s = this[0];
                if (!s) return d([]);
                for (;s.nextElementSibling; ) {
                    const a = s.nextElementSibling;
                    e ? d(a).is(e) && t.push(a) : t.push(a), s = a;
                }
                return d(t);
            },
            prev: function(e) {
                if (this.length > 0) {
                    const t = this[0];
                    return e ? t.previousElementSibling && d(t.previousElementSibling).is(e) ? d([ t.previousElementSibling ]) : d([]) : t.previousElementSibling ? d([ t.previousElementSibling ]) : d([]);
                }
                return d([]);
            },
            prevAll: function(e) {
                const t = [];
                let s = this[0];
                if (!s) return d([]);
                for (;s.previousElementSibling; ) {
                    const a = s.previousElementSibling;
                    e ? d(a).is(e) && t.push(a) : t.push(a), s = a;
                }
                return d(t);
            },
            parent: function(e) {
                const t = [];
                for (let s = 0; s < this.length; s += 1) null !== this[s].parentNode && (e ? d(this[s].parentNode).is(e) && t.push(this[s].parentNode) : t.push(this[s].parentNode));
                return d(t);
            },
            parents: function(e) {
                const t = [];
                for (let s = 0; s < this.length; s += 1) {
                    let a = this[s].parentNode;
                    for (;a; ) e ? d(a).is(e) && t.push(a) : t.push(a), a = a.parentNode;
                }
                return d(t);
            },
            closest: function(e) {
                let t = this;
                return void 0 === e ? d([]) : (t.is(e) || (t = t.parents(e).eq(0)), t);
            },
            find: function(e) {
                const t = [];
                for (let s = 0; s < this.length; s += 1) {
                    const a = this[s].querySelectorAll(e);
                    for (let e = 0; e < a.length; e += 1) t.push(a[e]);
                }
                return d(t);
            },
            children: function(e) {
                const t = [];
                for (let s = 0; s < this.length; s += 1) {
                    const a = this[s].children;
                    for (let s = 0; s < a.length; s += 1) e && !d(a[s]).is(e) || t.push(a[s]);
                }
                return d(t);
            },
            filter: function(e) {
                return d(o(this, e));
            },
            remove: function() {
                for (let e = 0; e < this.length; e += 1) this[e].parentNode && this[e].parentNode.removeChild(this[e]);
                return this;
            }
        };
        function p(e, t) {
            return void 0 === t && (t = 0), setTimeout(e, t);
        }
        function u() {
            return Date.now();
        }
        function h(e, t) {
            void 0 === t && (t = "x");
            const s = r();
            let a, i, n;
            const l = function(e) {
                const t = r();
                let s;
                return t.getComputedStyle && (s = t.getComputedStyle(e, null)), !s && e.currentStyle && (s = e.currentStyle), 
                s || (s = e.style), s;
            }(e);
            return s.WebKitCSSMatrix ? (i = l.transform || l.webkitTransform, i.split(",").length > 6 && (i = i.split(", ").map((e => e.replace(",", "."))).join(", ")), 
            n = new s.WebKitCSSMatrix("none" === i ? "" : i)) : (n = l.MozTransform || l.OTransform || l.MsTransform || l.msTransform || l.transform || l.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), 
            a = n.toString().split(",")), "x" === t && (i = s.WebKitCSSMatrix ? n.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])), 
            "y" === t && (i = s.WebKitCSSMatrix ? n.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])), 
            i || 0;
        }
        function m(e) {
            return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1);
        }
        function f(e) {
            return "undefined" != typeof window && void 0 !== window.HTMLElement ? e instanceof HTMLElement : e && (1 === e.nodeType || 11 === e.nodeType);
        }
        function g() {
            const e = Object(arguments.length <= 0 ? void 0 : arguments[0]), t = [ "__proto__", "constructor", "prototype" ];
            for (let s = 1; s < arguments.length; s += 1) {
                const a = s < 0 || arguments.length <= s ? void 0 : arguments[s];
                if (null != a && !f(a)) {
                    const s = Object.keys(Object(a)).filter((e => t.indexOf(e) < 0));
                    for (let t = 0, i = s.length; t < i; t += 1) {
                        const i = s[t], r = Object.getOwnPropertyDescriptor(a, i);
                        void 0 !== r && r.enumerable && (m(e[i]) && m(a[i]) ? a[i].__swiper__ ? e[i] = a[i] : g(e[i], a[i]) : !m(e[i]) && m(a[i]) ? (e[i] = {}, 
                        a[i].__swiper__ ? e[i] = a[i] : g(e[i], a[i])) : e[i] = a[i]);
                    }
                }
            }
            return e;
        }
        function v(e, t, s) {
            e.style.setProperty(t, s);
        }
        function w(e) {
            let {swiper: t, targetPosition: s, side: a} = e;
            const i = r(), n = -t.translate;
            let l, o = null;
            const d = t.params.speed;
            t.wrapperEl.style.scrollSnapType = "none", i.cancelAnimationFrame(t.cssModeFrameID);
            const c = s > n ? "next" : "prev", p = (e, t) => "next" === c && e >= t || "prev" === c && e <= t, u = () => {
                l = (new Date).getTime(), null === o && (o = l);
                const e = Math.max(Math.min((l - o) / d, 1), 0), r = .5 - Math.cos(e * Math.PI) / 2;
                let c = n + r * (s - n);
                if (p(c, s) && (c = s), t.wrapperEl.scrollTo({
                    [a]: c
                }), p(c, s)) return t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.scrollSnapType = "", 
                setTimeout((() => {
                    t.wrapperEl.style.overflow = "", t.wrapperEl.scrollTo({
                        [a]: c
                    });
                })), void i.cancelAnimationFrame(t.cssModeFrameID);
                t.cssModeFrameID = i.requestAnimationFrame(u);
            };
            u();
        }
        let b, x, y;
        function E() {
            return b || (b = function() {
                const e = r(), t = a();
                return {
                    smoothScroll: t.documentElement && "scrollBehavior" in t.documentElement.style,
                    touch: !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch),
                    passiveListener: function() {
                        let t = !1;
                        try {
                            const s = Object.defineProperty({}, "passive", {
                                get() {
                                    t = !0;
                                }
                            });
                            e.addEventListener("testPassiveListener", null, s);
                        } catch (e) {}
                        return t;
                    }(),
                    gestures: "ongesturestart" in e
                };
            }()), b;
        }
        function C(e) {
            return void 0 === e && (e = {}), x || (x = function(e) {
                let {userAgent: t} = void 0 === e ? {} : e;
                const s = E(), a = r(), i = a.navigator.platform, n = t || a.navigator.userAgent, l = {
                    ios: !1,
                    android: !1
                }, o = a.screen.width, d = a.screen.height, c = n.match(/(Android);?[\s\/]+([\d.]+)?/);
                let p = n.match(/(iPad).*OS\s([\d_]+)/);
                const u = n.match(/(iPod)(.*OS\s([\d_]+))?/), h = !p && n.match(/(iPhone\sOS|iOS)\s([\d_]+)/), m = "Win32" === i;
                let f = "MacIntel" === i;
                return !p && f && s.touch && [ "1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810" ].indexOf(`${o}x${d}`) >= 0 && (p = n.match(/(Version)\/([\d.]+)/), 
                p || (p = [ 0, 1, "13_0_0" ]), f = !1), c && !m && (l.os = "android", l.android = !0), 
                (p || h || u) && (l.os = "ios", l.ios = !0), l;
            }(e)), x;
        }
        function T() {
            return y || (y = function() {
                const e = r();
                return {
                    isSafari: function() {
                        const t = e.navigator.userAgent.toLowerCase();
                        return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0;
                    }(),
                    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)
                };
            }()), y;
        }
        Object.keys(c).forEach((e => {
            Object.defineProperty(d.fn, e, {
                value: c[e],
                writable: !0
            });
        }));
        var $ = {
            on(e, t, s) {
                const a = this;
                if (!a.eventsListeners || a.destroyed) return a;
                if ("function" != typeof t) return a;
                const i = s ? "unshift" : "push";
                return e.split(" ").forEach((e => {
                    a.eventsListeners[e] || (a.eventsListeners[e] = []), a.eventsListeners[e][i](t);
                })), a;
            },
            once(e, t, s) {
                const a = this;
                if (!a.eventsListeners || a.destroyed) return a;
                if ("function" != typeof t) return a;
                function i() {
                    a.off(e, i), i.__emitterProxy && delete i.__emitterProxy;
                    for (var s = arguments.length, r = new Array(s), n = 0; n < s; n++) r[n] = arguments[n];
                    t.apply(a, r);
                }
                return i.__emitterProxy = t, a.on(e, i, s);
            },
            onAny(e, t) {
                const s = this;
                if (!s.eventsListeners || s.destroyed) return s;
                if ("function" != typeof e) return s;
                const a = t ? "unshift" : "push";
                return s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[a](e), s;
            },
            offAny(e) {
                const t = this;
                if (!t.eventsListeners || t.destroyed) return t;
                if (!t.eventsAnyListeners) return t;
                const s = t.eventsAnyListeners.indexOf(e);
                return s >= 0 && t.eventsAnyListeners.splice(s, 1), t;
            },
            off(e, t) {
                const s = this;
                return !s.eventsListeners || s.destroyed ? s : s.eventsListeners ? (e.split(" ").forEach((e => {
                    void 0 === t ? s.eventsListeners[e] = [] : s.eventsListeners[e] && s.eventsListeners[e].forEach(((a, i) => {
                        (a === t || a.__emitterProxy && a.__emitterProxy === t) && s.eventsListeners[e].splice(i, 1);
                    }));
                })), s) : s;
            },
            emit() {
                const e = this;
                if (!e.eventsListeners || e.destroyed) return e;
                if (!e.eventsListeners) return e;
                let t, s, a;
                for (var i = arguments.length, r = new Array(i), n = 0; n < i; n++) r[n] = arguments[n];
                "string" == typeof r[0] || Array.isArray(r[0]) ? (t = r[0], s = r.slice(1, r.length), 
                a = e) : (t = r[0].events, s = r[0].data, a = r[0].context || e), s.unshift(a);
                return (Array.isArray(t) ? t : t.split(" ")).forEach((t => {
                    e.eventsAnyListeners && e.eventsAnyListeners.length && e.eventsAnyListeners.forEach((e => {
                        e.apply(a, [ t, ...s ]);
                    })), e.eventsListeners && e.eventsListeners[t] && e.eventsListeners[t].forEach((e => {
                        e.apply(a, s);
                    }));
                })), e;
            }
        };
        var S = {
            updateSize: function() {
                const e = this;
                let t, s;
                const a = e.$el;
                t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : a[0].clientWidth, 
                s = void 0 !== e.params.height && null !== e.params.height ? e.params.height : a[0].clientHeight, 
                0 === t && e.isHorizontal() || 0 === s && e.isVertical() || (t = t - parseInt(a.css("padding-left") || 0, 10) - parseInt(a.css("padding-right") || 0, 10), 
                s = s - parseInt(a.css("padding-top") || 0, 10) - parseInt(a.css("padding-bottom") || 0, 10), 
                Number.isNaN(t) && (t = 0), Number.isNaN(s) && (s = 0), Object.assign(e, {
                    width: t,
                    height: s,
                    size: e.isHorizontal() ? t : s
                }));
            },
            updateSlides: function() {
                const e = this;
                function t(t) {
                    return e.isHorizontal() ? t : {
                        width: "height",
                        "margin-top": "margin-left",
                        "margin-bottom ": "margin-right",
                        "margin-left": "margin-top",
                        "margin-right": "margin-bottom",
                        "padding-left": "padding-top",
                        "padding-right": "padding-bottom",
                        marginRight: "marginBottom"
                    }[t];
                }
                function s(e, s) {
                    return parseFloat(e.getPropertyValue(t(s)) || 0);
                }
                const a = e.params, {$wrapperEl: i, size: r, rtlTranslate: n, wrongRTL: l} = e, o = e.virtual && a.virtual.enabled, d = o ? e.virtual.slides.length : e.slides.length, c = i.children(`.${e.params.slideClass}`), p = o ? e.virtual.slides.length : c.length;
                let u = [];
                const h = [], m = [];
                let f = a.slidesOffsetBefore;
                "function" == typeof f && (f = a.slidesOffsetBefore.call(e));
                let g = a.slidesOffsetAfter;
                "function" == typeof g && (g = a.slidesOffsetAfter.call(e));
                const w = e.snapGrid.length, b = e.slidesGrid.length;
                let x = a.spaceBetween, y = -f, E = 0, C = 0;
                if (void 0 === r) return;
                "string" == typeof x && x.indexOf("%") >= 0 && (x = parseFloat(x.replace("%", "")) / 100 * r), 
                e.virtualSize = -x, n ? c.css({
                    marginLeft: "",
                    marginBottom: "",
                    marginTop: ""
                }) : c.css({
                    marginRight: "",
                    marginBottom: "",
                    marginTop: ""
                }), a.centeredSlides && a.cssMode && (v(e.wrapperEl, "--swiper-centered-offset-before", ""), 
                v(e.wrapperEl, "--swiper-centered-offset-after", ""));
                const T = a.grid && a.grid.rows > 1 && e.grid;
                let $;
                T && e.grid.initSlides(p);
                const S = "auto" === a.slidesPerView && a.breakpoints && Object.keys(a.breakpoints).filter((e => void 0 !== a.breakpoints[e].slidesPerView)).length > 0;
                for (let i = 0; i < p; i += 1) {
                    $ = 0;
                    const n = c.eq(i);
                    if (T && e.grid.updateSlide(i, n, p, t), "none" !== n.css("display")) {
                        if ("auto" === a.slidesPerView) {
                            S && (c[i].style[t("width")] = "");
                            const r = getComputedStyle(n[0]), l = n[0].style.transform, o = n[0].style.webkitTransform;
                            if (l && (n[0].style.transform = "none"), o && (n[0].style.webkitTransform = "none"), 
                            a.roundLengths) $ = e.isHorizontal() ? n.outerWidth(!0) : n.outerHeight(!0); else {
                                const e = s(r, "width"), t = s(r, "padding-left"), a = s(r, "padding-right"), i = s(r, "margin-left"), l = s(r, "margin-right"), o = r.getPropertyValue("box-sizing");
                                if (o && "border-box" === o) $ = e + i + l; else {
                                    const {clientWidth: s, offsetWidth: r} = n[0];
                                    $ = e + t + a + i + l + (r - s);
                                }
                            }
                            l && (n[0].style.transform = l), o && (n[0].style.webkitTransform = o), a.roundLengths && ($ = Math.floor($));
                        } else $ = (r - (a.slidesPerView - 1) * x) / a.slidesPerView, a.roundLengths && ($ = Math.floor($)), 
                        c[i] && (c[i].style[t("width")] = `${$}px`);
                        c[i] && (c[i].swiperSlideSize = $), m.push($), a.centeredSlides ? (y = y + $ / 2 + E / 2 + x, 
                        0 === E && 0 !== i && (y = y - r / 2 - x), 0 === i && (y = y - r / 2 - x), Math.abs(y) < .001 && (y = 0), 
                        a.roundLengths && (y = Math.floor(y)), C % a.slidesPerGroup == 0 && u.push(y), h.push(y)) : (a.roundLengths && (y = Math.floor(y)), 
                        (C - Math.min(e.params.slidesPerGroupSkip, C)) % e.params.slidesPerGroup == 0 && u.push(y), 
                        h.push(y), y = y + $ + x), e.virtualSize += $ + x, E = $, C += 1;
                    }
                }
                if (e.virtualSize = Math.max(e.virtualSize, r) + g, n && l && ("slide" === a.effect || "coverflow" === a.effect) && i.css({
                    width: `${e.virtualSize + a.spaceBetween}px`
                }), a.setWrapperSize && i.css({
                    [t("width")]: `${e.virtualSize + a.spaceBetween}px`
                }), T && e.grid.updateWrapperSize($, u, t), !a.centeredSlides) {
                    const t = [];
                    for (let s = 0; s < u.length; s += 1) {
                        let i = u[s];
                        a.roundLengths && (i = Math.floor(i)), u[s] <= e.virtualSize - r && t.push(i);
                    }
                    u = t, Math.floor(e.virtualSize - r) - Math.floor(u[u.length - 1]) > 1 && u.push(e.virtualSize - r);
                }
                if (0 === u.length && (u = [ 0 ]), 0 !== a.spaceBetween) {
                    const s = e.isHorizontal() && n ? "marginLeft" : t("marginRight");
                    c.filter(((e, t) => !a.cssMode || t !== c.length - 1)).css({
                        [s]: `${x}px`
                    });
                }
                if (a.centeredSlides && a.centeredSlidesBounds) {
                    let e = 0;
                    m.forEach((t => {
                        e += t + (a.spaceBetween ? a.spaceBetween : 0);
                    })), e -= a.spaceBetween;
                    const t = e - r;
                    u = u.map((e => e < 0 ? -f : e > t ? t + g : e));
                }
                if (a.centerInsufficientSlides) {
                    let e = 0;
                    if (m.forEach((t => {
                        e += t + (a.spaceBetween ? a.spaceBetween : 0);
                    })), e -= a.spaceBetween, e < r) {
                        const t = (r - e) / 2;
                        u.forEach(((e, s) => {
                            u[s] = e - t;
                        })), h.forEach(((e, s) => {
                            h[s] = e + t;
                        }));
                    }
                }
                if (Object.assign(e, {
                    slides: c,
                    snapGrid: u,
                    slidesGrid: h,
                    slidesSizesGrid: m
                }), a.centeredSlides && a.cssMode && !a.centeredSlidesBounds) {
                    v(e.wrapperEl, "--swiper-centered-offset-before", -u[0] + "px"), v(e.wrapperEl, "--swiper-centered-offset-after", e.size / 2 - m[m.length - 1] / 2 + "px");
                    const t = -e.snapGrid[0], s = -e.slidesGrid[0];
                    e.snapGrid = e.snapGrid.map((e => e + t)), e.slidesGrid = e.slidesGrid.map((e => e + s));
                }
                if (p !== d && e.emit("slidesLengthChange"), u.length !== w && (e.params.watchOverflow && e.checkOverflow(), 
                e.emit("snapGridLengthChange")), h.length !== b && e.emit("slidesGridLengthChange"), 
                a.watchSlidesProgress && e.updateSlidesOffset(), !(o || a.cssMode || "slide" !== a.effect && "fade" !== a.effect)) {
                    const t = `${a.containerModifierClass}backface-hidden`, s = e.$el.hasClass(t);
                    p <= a.maxBackfaceHiddenSlides ? s || e.$el.addClass(t) : s && e.$el.removeClass(t);
                }
            },
            updateAutoHeight: function(e) {
                const t = this, s = [], a = t.virtual && t.params.virtual.enabled;
                let i, r = 0;
                "number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
                const n = e => a ? t.slides.filter((t => parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e))[0] : t.slides.eq(e)[0];
                if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1) if (t.params.centeredSlides) (t.visibleSlides || d([])).each((e => {
                    s.push(e);
                })); else for (i = 0; i < Math.ceil(t.params.slidesPerView); i += 1) {
                    const e = t.activeIndex + i;
                    if (e > t.slides.length && !a) break;
                    s.push(n(e));
                } else s.push(n(t.activeIndex));
                for (i = 0; i < s.length; i += 1) if (void 0 !== s[i]) {
                    const e = s[i].offsetHeight;
                    r = e > r ? e : r;
                }
                (r || 0 === r) && t.$wrapperEl.css("height", `${r}px`);
            },
            updateSlidesOffset: function() {
                const e = this, t = e.slides;
                for (let s = 0; s < t.length; s += 1) t[s].swiperSlideOffset = e.isHorizontal() ? t[s].offsetLeft : t[s].offsetTop;
            },
            updateSlidesProgress: function(e) {
                void 0 === e && (e = this && this.translate || 0);
                const t = this, s = t.params, {slides: a, rtlTranslate: i, snapGrid: r} = t;
                if (0 === a.length) return;
                void 0 === a[0].swiperSlideOffset && t.updateSlidesOffset();
                let n = -e;
                i && (n = e), a.removeClass(s.slideVisibleClass), t.visibleSlidesIndexes = [], t.visibleSlides = [];
                for (let e = 0; e < a.length; e += 1) {
                    const l = a[e];
                    let o = l.swiperSlideOffset;
                    s.cssMode && s.centeredSlides && (o -= a[0].swiperSlideOffset);
                    const d = (n + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween), c = (n - r[0] + (s.centeredSlides ? t.minTranslate() : 0) - o) / (l.swiperSlideSize + s.spaceBetween), p = -(n - o), u = p + t.slidesSizesGrid[e];
                    (p >= 0 && p < t.size - 1 || u > 1 && u <= t.size || p <= 0 && u >= t.size) && (t.visibleSlides.push(l), 
                    t.visibleSlidesIndexes.push(e), a.eq(e).addClass(s.slideVisibleClass)), l.progress = i ? -d : d, 
                    l.originalProgress = i ? -c : c;
                }
                t.visibleSlides = d(t.visibleSlides);
            },
            updateProgress: function(e) {
                const t = this;
                if (void 0 === e) {
                    const s = t.rtlTranslate ? -1 : 1;
                    e = t && t.translate && t.translate * s || 0;
                }
                const s = t.params, a = t.maxTranslate() - t.minTranslate();
                let {progress: i, isBeginning: r, isEnd: n} = t;
                const l = r, o = n;
                0 === a ? (i = 0, r = !0, n = !0) : (i = (e - t.minTranslate()) / a, r = i <= 0, 
                n = i >= 1), Object.assign(t, {
                    progress: i,
                    isBeginning: r,
                    isEnd: n
                }), (s.watchSlidesProgress || s.centeredSlides && s.autoHeight) && t.updateSlidesProgress(e), 
                r && !l && t.emit("reachBeginning toEdge"), n && !o && t.emit("reachEnd toEdge"), 
                (l && !r || o && !n) && t.emit("fromEdge"), t.emit("progress", i);
            },
            updateSlidesClasses: function() {
                const e = this, {slides: t, params: s, $wrapperEl: a, activeIndex: i, realIndex: r} = e, n = e.virtual && s.virtual.enabled;
                let l;
                t.removeClass(`${s.slideActiveClass} ${s.slideNextClass} ${s.slidePrevClass} ${s.slideDuplicateActiveClass} ${s.slideDuplicateNextClass} ${s.slideDuplicatePrevClass}`), 
                l = n ? e.$wrapperEl.find(`.${s.slideClass}[data-swiper-slide-index="${i}"]`) : t.eq(i), 
                l.addClass(s.slideActiveClass), s.loop && (l.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${r}"]`).addClass(s.slideDuplicateActiveClass));
                let o = l.nextAll(`.${s.slideClass}`).eq(0).addClass(s.slideNextClass);
                s.loop && 0 === o.length && (o = t.eq(0), o.addClass(s.slideNextClass));
                let d = l.prevAll(`.${s.slideClass}`).eq(0).addClass(s.slidePrevClass);
                s.loop && 0 === d.length && (d = t.eq(-1), d.addClass(s.slidePrevClass)), s.loop && (o.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${o.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicateNextClass), 
                d.hasClass(s.slideDuplicateClass) ? a.children(`.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass) : a.children(`.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${d.attr("data-swiper-slide-index")}"]`).addClass(s.slideDuplicatePrevClass)), 
                e.emitSlidesClasses();
            },
            updateActiveIndex: function(e) {
                const t = this, s = t.rtlTranslate ? t.translate : -t.translate, {slidesGrid: a, snapGrid: i, params: r, activeIndex: n, realIndex: l, snapIndex: o} = t;
                let d, c = e;
                if (void 0 === c) {
                    for (let e = 0; e < a.length; e += 1) void 0 !== a[e + 1] ? s >= a[e] && s < a[e + 1] - (a[e + 1] - a[e]) / 2 ? c = e : s >= a[e] && s < a[e + 1] && (c = e + 1) : s >= a[e] && (c = e);
                    r.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0);
                }
                if (i.indexOf(s) >= 0) d = i.indexOf(s); else {
                    const e = Math.min(r.slidesPerGroupSkip, c);
                    d = e + Math.floor((c - e) / r.slidesPerGroup);
                }
                if (d >= i.length && (d = i.length - 1), c === n) return void (d !== o && (t.snapIndex = d, 
                t.emit("snapIndexChange")));
                const p = parseInt(t.slides.eq(c).attr("data-swiper-slide-index") || c, 10);
                Object.assign(t, {
                    snapIndex: d,
                    realIndex: p,
                    previousIndex: n,
                    activeIndex: c
                }), t.emit("activeIndexChange"), t.emit("snapIndexChange"), l !== p && t.emit("realIndexChange"), 
                (t.initialized || t.params.runCallbacksOnInit) && t.emit("slideChange");
            },
            updateClickedSlide: function(e) {
                const t = this, s = t.params, a = d(e).closest(`.${s.slideClass}`)[0];
                let i, r = !1;
                if (a) for (let e = 0; e < t.slides.length; e += 1) if (t.slides[e] === a) {
                    r = !0, i = e;
                    break;
                }
                if (!a || !r) return t.clickedSlide = void 0, void (t.clickedIndex = void 0);
                t.clickedSlide = a, t.virtual && t.params.virtual.enabled ? t.clickedIndex = parseInt(d(a).attr("data-swiper-slide-index"), 10) : t.clickedIndex = i, 
                s.slideToClickedSlide && void 0 !== t.clickedIndex && t.clickedIndex !== t.activeIndex && t.slideToClickedSlide();
            }
        };
        var M = {
            getTranslate: function(e) {
                void 0 === e && (e = this.isHorizontal() ? "x" : "y");
                const {params: t, rtlTranslate: s, translate: a, $wrapperEl: i} = this;
                if (t.virtualTranslate) return s ? -a : a;
                if (t.cssMode) return a;
                let r = h(i[0], e);
                return s && (r = -r), r || 0;
            },
            setTranslate: function(e, t) {
                const s = this, {rtlTranslate: a, params: i, $wrapperEl: r, wrapperEl: n, progress: l} = s;
                let o, d = 0, c = 0;
                s.isHorizontal() ? d = a ? -e : e : c = e, i.roundLengths && (d = Math.floor(d), 
                c = Math.floor(c)), i.cssMode ? n[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal() ? -d : -c : i.virtualTranslate || r.transform(`translate3d(${d}px, ${c}px, 0px)`), 
                s.previousTranslate = s.translate, s.translate = s.isHorizontal() ? d : c;
                const p = s.maxTranslate() - s.minTranslate();
                o = 0 === p ? 0 : (e - s.minTranslate()) / p, o !== l && s.updateProgress(e), s.emit("setTranslate", s.translate, t);
            },
            minTranslate: function() {
                return -this.snapGrid[0];
            },
            maxTranslate: function() {
                return -this.snapGrid[this.snapGrid.length - 1];
            },
            translateTo: function(e, t, s, a, i) {
                void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), 
                void 0 === a && (a = !0);
                const r = this, {params: n, wrapperEl: l} = r;
                if (r.animating && n.preventInteractionOnTransition) return !1;
                const o = r.minTranslate(), d = r.maxTranslate();
                let c;
                if (c = a && e > o ? o : a && e < d ? d : e, r.updateProgress(c), n.cssMode) {
                    const e = r.isHorizontal();
                    if (0 === t) l[e ? "scrollLeft" : "scrollTop"] = -c; else {
                        if (!r.support.smoothScroll) return w({
                            swiper: r,
                            targetPosition: -c,
                            side: e ? "left" : "top"
                        }), !0;
                        l.scrollTo({
                            [e ? "left" : "top"]: -c,
                            behavior: "smooth"
                        });
                    }
                    return !0;
                }
                return 0 === t ? (r.setTransition(0), r.setTranslate(c), s && (r.emit("beforeTransitionStart", t, i), 
                r.emit("transitionEnd"))) : (r.setTransition(t), r.setTranslate(c), s && (r.emit("beforeTransitionStart", t, i), 
                r.emit("transitionStart")), r.animating || (r.animating = !0, r.onTranslateToWrapperTransitionEnd || (r.onTranslateToWrapperTransitionEnd = function(e) {
                    r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd), 
                    r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd), 
                    r.onTranslateToWrapperTransitionEnd = null, delete r.onTranslateToWrapperTransitionEnd, 
                    s && r.emit("transitionEnd"));
                }), r.$wrapperEl[0].addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd), 
                r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onTranslateToWrapperTransitionEnd))), 
                !0;
            }
        };
        function P(e) {
            let {swiper: t, runCallbacks: s, direction: a, step: i} = e;
            const {activeIndex: r, previousIndex: n} = t;
            let l = a;
            if (l || (l = r > n ? "next" : r < n ? "prev" : "reset"), t.emit(`transition${i}`), 
            s && r !== n) {
                if ("reset" === l) return void t.emit(`slideResetTransition${i}`);
                t.emit(`slideChangeTransition${i}`), "next" === l ? t.emit(`slideNextTransition${i}`) : t.emit(`slidePrevTransition${i}`);
            }
        }
        var k = {
            slideTo: function(e, t, s, a, i) {
                if (void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), 
                "number" != typeof e && "string" != typeof e) throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof e}] given.`);
                if ("string" == typeof e) {
                    const t = parseInt(e, 10);
                    if (!isFinite(t)) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);
                    e = t;
                }
                const r = this;
                let n = e;
                n < 0 && (n = 0);
                const {params: l, snapGrid: o, slidesGrid: d, previousIndex: c, activeIndex: p, rtlTranslate: u, wrapperEl: h, enabled: m} = r;
                if (r.animating && l.preventInteractionOnTransition || !m && !a && !i) return !1;
                const f = Math.min(r.params.slidesPerGroupSkip, n);
                let g = f + Math.floor((n - f) / r.params.slidesPerGroup);
                g >= o.length && (g = o.length - 1);
                const v = -o[g];
                if (l.normalizeSlideIndex) for (let e = 0; e < d.length; e += 1) {
                    const t = -Math.floor(100 * v), s = Math.floor(100 * d[e]), a = Math.floor(100 * d[e + 1]);
                    void 0 !== d[e + 1] ? t >= s && t < a - (a - s) / 2 ? n = e : t >= s && t < a && (n = e + 1) : t >= s && (n = e);
                }
                if (r.initialized && n !== p) {
                    if (!r.allowSlideNext && v < r.translate && v < r.minTranslate()) return !1;
                    if (!r.allowSlidePrev && v > r.translate && v > r.maxTranslate() && (p || 0) !== n) return !1;
                }
                let b;
                if (n !== (c || 0) && s && r.emit("beforeSlideChangeStart"), r.updateProgress(v), 
                b = n > p ? "next" : n < p ? "prev" : "reset", u && -v === r.translate || !u && v === r.translate) return r.updateActiveIndex(n), 
                l.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== l.effect && r.setTranslate(v), 
                "reset" !== b && (r.transitionStart(s, b), r.transitionEnd(s, b)), !1;
                if (l.cssMode) {
                    const e = r.isHorizontal(), s = u ? v : -v;
                    if (0 === t) {
                        const t = r.virtual && r.params.virtual.enabled;
                        t && (r.wrapperEl.style.scrollSnapType = "none", r._immediateVirtual = !0), h[e ? "scrollLeft" : "scrollTop"] = s, 
                        t && requestAnimationFrame((() => {
                            r.wrapperEl.style.scrollSnapType = "", r._swiperImmediateVirtual = !1;
                        }));
                    } else {
                        if (!r.support.smoothScroll) return w({
                            swiper: r,
                            targetPosition: s,
                            side: e ? "left" : "top"
                        }), !0;
                        h.scrollTo({
                            [e ? "left" : "top"]: s,
                            behavior: "smooth"
                        });
                    }
                    return !0;
                }
                return r.setTransition(t), r.setTranslate(v), r.updateActiveIndex(n), r.updateSlidesClasses(), 
                r.emit("beforeTransitionStart", t, a), r.transitionStart(s, b), 0 === t ? r.transitionEnd(s, b) : r.animating || (r.animating = !0, 
                r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function(e) {
                    r && !r.destroyed && e.target === this && (r.$wrapperEl[0].removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), 
                    r.$wrapperEl[0].removeEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd), 
                    r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, 
                    r.transitionEnd(s, b));
                }), r.$wrapperEl[0].addEventListener("transitionend", r.onSlideToWrapperTransitionEnd), 
                r.$wrapperEl[0].addEventListener("webkitTransitionEnd", r.onSlideToWrapperTransitionEnd)), 
                !0;
            },
            slideToLoop: function(e, t, s, a) {
                if (void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), 
                "string" == typeof e) {
                    const t = parseInt(e, 10);
                    if (!isFinite(t)) throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`);
                    e = t;
                }
                const i = this;
                let r = e;
                return i.params.loop && (r += i.loopedSlides), i.slideTo(r, t, s, a);
            },
            slideNext: function(e, t, s) {
                void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
                const a = this, {animating: i, enabled: r, params: n} = a;
                if (!r) return a;
                let l = n.slidesPerGroup;
                "auto" === n.slidesPerView && 1 === n.slidesPerGroup && n.slidesPerGroupAuto && (l = Math.max(a.slidesPerViewDynamic("current", !0), 1));
                const o = a.activeIndex < n.slidesPerGroupSkip ? 1 : l;
                if (n.loop) {
                    if (i && n.loopPreventsSlide) return !1;
                    a.loopFix(), a._clientLeft = a.$wrapperEl[0].clientLeft;
                }
                return n.rewind && a.isEnd ? a.slideTo(0, e, t, s) : a.slideTo(a.activeIndex + o, e, t, s);
            },
            slidePrev: function(e, t, s) {
                void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
                const a = this, {params: i, animating: r, snapGrid: n, slidesGrid: l, rtlTranslate: o, enabled: d} = a;
                if (!d) return a;
                if (i.loop) {
                    if (r && i.loopPreventsSlide) return !1;
                    a.loopFix(), a._clientLeft = a.$wrapperEl[0].clientLeft;
                }
                function c(e) {
                    return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
                }
                const p = c(o ? a.translate : -a.translate), u = n.map((e => c(e)));
                let h = n[u.indexOf(p) - 1];
                if (void 0 === h && i.cssMode) {
                    let e;
                    n.forEach(((t, s) => {
                        p >= t && (e = s);
                    })), void 0 !== e && (h = n[e > 0 ? e - 1 : e]);
                }
                let m = 0;
                if (void 0 !== h && (m = l.indexOf(h), m < 0 && (m = a.activeIndex - 1), "auto" === i.slidesPerView && 1 === i.slidesPerGroup && i.slidesPerGroupAuto && (m = m - a.slidesPerViewDynamic("previous", !0) + 1, 
                m = Math.max(m, 0))), i.rewind && a.isBeginning) {
                    const i = a.params.virtual && a.params.virtual.enabled && a.virtual ? a.virtual.slides.length - 1 : a.slides.length - 1;
                    return a.slideTo(i, e, t, s);
                }
                return a.slideTo(m, e, t, s);
            },
            slideReset: function(e, t, s) {
                return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, s);
            },
            slideToClosest: function(e, t, s, a) {
                void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === a && (a = .5);
                const i = this;
                let r = i.activeIndex;
                const n = Math.min(i.params.slidesPerGroupSkip, r), l = n + Math.floor((r - n) / i.params.slidesPerGroup), o = i.rtlTranslate ? i.translate : -i.translate;
                if (o >= i.snapGrid[l]) {
                    const e = i.snapGrid[l];
                    o - e > (i.snapGrid[l + 1] - e) * a && (r += i.params.slidesPerGroup);
                } else {
                    const e = i.snapGrid[l - 1];
                    o - e <= (i.snapGrid[l] - e) * a && (r -= i.params.slidesPerGroup);
                }
                return r = Math.max(r, 0), r = Math.min(r, i.slidesGrid.length - 1), i.slideTo(r, e, t, s);
            },
            slideToClickedSlide: function() {
                const e = this, {params: t, $wrapperEl: s} = e, a = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
                let i, r = e.clickedIndex;
                if (t.loop) {
                    if (e.animating) return;
                    i = parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10), t.centeredSlides ? r < e.loopedSlides - a / 2 || r > e.slides.length - e.loopedSlides + a / 2 ? (e.loopFix(), 
                    r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index(), 
                    p((() => {
                        e.slideTo(r);
                    }))) : e.slideTo(r) : r > e.slides.length - a ? (e.loopFix(), r = s.children(`.${t.slideClass}[data-swiper-slide-index="${i}"]:not(.${t.slideDuplicateClass})`).eq(0).index(), 
                    p((() => {
                        e.slideTo(r);
                    }))) : e.slideTo(r);
                } else e.slideTo(r);
            }
        };
        var z = {
            loopCreate: function() {
                const e = this, t = a(), {params: s, $wrapperEl: i} = e, r = i.children().length > 0 ? d(i.children()[0].parentNode) : i;
                r.children(`.${s.slideClass}.${s.slideDuplicateClass}`).remove();
                let n = r.children(`.${s.slideClass}`);
                if (s.loopFillGroupWithBlank) {
                    const e = s.slidesPerGroup - n.length % s.slidesPerGroup;
                    if (e !== s.slidesPerGroup) {
                        for (let a = 0; a < e; a += 1) {
                            const e = d(t.createElement("div")).addClass(`${s.slideClass} ${s.slideBlankClass}`);
                            r.append(e);
                        }
                        n = r.children(`.${s.slideClass}`);
                    }
                }
                "auto" !== s.slidesPerView || s.loopedSlides || (s.loopedSlides = n.length), e.loopedSlides = Math.ceil(parseFloat(s.loopedSlides || s.slidesPerView, 10)), 
                e.loopedSlides += s.loopAdditionalSlides, e.loopedSlides > n.length && e.params.loopedSlidesLimit && (e.loopedSlides = n.length);
                const l = [], o = [];
                n.each(((e, t) => {
                    d(e).attr("data-swiper-slide-index", t);
                }));
                for (let t = 0; t < e.loopedSlides; t += 1) {
                    const e = t - Math.floor(t / n.length) * n.length;
                    o.push(n.eq(e)[0]), l.unshift(n.eq(n.length - e - 1)[0]);
                }
                for (let e = 0; e < o.length; e += 1) r.append(d(o[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
                for (let e = l.length - 1; e >= 0; e -= 1) r.prepend(d(l[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
            },
            loopFix: function() {
                const e = this;
                e.emit("beforeLoopFix");
                const {activeIndex: t, slides: s, loopedSlides: a, allowSlidePrev: i, allowSlideNext: r, snapGrid: n, rtlTranslate: l} = e;
                let o;
                e.allowSlidePrev = !0, e.allowSlideNext = !0;
                const d = -n[t] - e.getTranslate();
                if (t < a) {
                    o = s.length - 3 * a + t, o += a;
                    e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d);
                } else if (t >= s.length - a) {
                    o = -s.length + t + a, o += a;
                    e.slideTo(o, 0, !1, !0) && 0 !== d && e.setTranslate((l ? -e.translate : e.translate) - d);
                }
                e.allowSlidePrev = i, e.allowSlideNext = r, e.emit("loopFix");
            },
            loopDestroy: function() {
                const {$wrapperEl: e, params: t, slides: s} = this;
                e.children(`.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`).remove(), 
                s.removeAttr("data-swiper-slide-index");
            }
        };
        function L(e) {
            const t = this, s = a(), i = r(), n = t.touchEventsData, {params: l, touches: o, enabled: c} = t;
            if (!c) return;
            if (t.animating && l.preventInteractionOnTransition) return;
            !t.animating && l.cssMode && l.loop && t.loopFix();
            let p = e;
            p.originalEvent && (p = p.originalEvent);
            let h = d(p.target);
            if ("wrapper" === l.touchEventsTarget && !h.closest(t.wrapperEl).length) return;
            if (n.isTouchEvent = "touchstart" === p.type, !n.isTouchEvent && "which" in p && 3 === p.which) return;
            if (!n.isTouchEvent && "button" in p && p.button > 0) return;
            if (n.isTouched && n.isMoved) return;
            const m = !!l.noSwipingClass && "" !== l.noSwipingClass, f = e.composedPath ? e.composedPath() : e.path;
            m && p.target && p.target.shadowRoot && f && (h = d(f[0]));
            const g = l.noSwipingSelector ? l.noSwipingSelector : `.${l.noSwipingClass}`, v = !(!p.target || !p.target.shadowRoot);
            if (l.noSwiping && (v ? function(e, t) {
                return void 0 === t && (t = this), function t(s) {
                    if (!s || s === a() || s === r()) return null;
                    s.assignedSlot && (s = s.assignedSlot);
                    const i = s.closest(e);
                    return i || s.getRootNode ? i || t(s.getRootNode().host) : null;
                }(t);
            }(g, h[0]) : h.closest(g)[0])) return void (t.allowClick = !0);
            if (l.swipeHandler && !h.closest(l.swipeHandler)[0]) return;
            o.currentX = "touchstart" === p.type ? p.targetTouches[0].pageX : p.pageX, o.currentY = "touchstart" === p.type ? p.targetTouches[0].pageY : p.pageY;
            const w = o.currentX, b = o.currentY, x = l.edgeSwipeDetection || l.iOSEdgeSwipeDetection, y = l.edgeSwipeThreshold || l.iOSEdgeSwipeThreshold;
            if (x && (w <= y || w >= i.innerWidth - y)) {
                if ("prevent" !== x) return;
                e.preventDefault();
            }
            if (Object.assign(n, {
                isTouched: !0,
                isMoved: !1,
                allowTouchCallbacks: !0,
                isScrolling: void 0,
                startMoving: void 0
            }), o.startX = w, o.startY = b, n.touchStartTime = u(), t.allowClick = !0, t.updateSize(), 
            t.swipeDirection = void 0, l.threshold > 0 && (n.allowThresholdMove = !1), "touchstart" !== p.type) {
                let e = !0;
                h.is(n.focusableElements) && (e = !1, "SELECT" === h[0].nodeName && (n.isTouched = !1)), 
                s.activeElement && d(s.activeElement).is(n.focusableElements) && s.activeElement !== h[0] && s.activeElement.blur();
                const a = e && t.allowTouchMove && l.touchStartPreventDefault;
                !l.touchStartForcePreventDefault && !a || h[0].isContentEditable || p.preventDefault();
            }
            t.params.freeMode && t.params.freeMode.enabled && t.freeMode && t.animating && !l.cssMode && t.freeMode.onTouchStart(), 
            t.emit("touchStart", p);
        }
        function O(e) {
            const t = a(), s = this, i = s.touchEventsData, {params: r, touches: n, rtlTranslate: l, enabled: o} = s;
            if (!o) return;
            let c = e;
            if (c.originalEvent && (c = c.originalEvent), !i.isTouched) return void (i.startMoving && i.isScrolling && s.emit("touchMoveOpposite", c));
            if (i.isTouchEvent && "touchmove" !== c.type) return;
            const p = "touchmove" === c.type && c.targetTouches && (c.targetTouches[0] || c.changedTouches[0]), h = "touchmove" === c.type ? p.pageX : c.pageX, m = "touchmove" === c.type ? p.pageY : c.pageY;
            if (c.preventedByNestedSwiper) return n.startX = h, void (n.startY = m);
            if (!s.allowTouchMove) return d(c.target).is(i.focusableElements) || (s.allowClick = !1), 
            void (i.isTouched && (Object.assign(n, {
                startX: h,
                startY: m,
                currentX: h,
                currentY: m
            }), i.touchStartTime = u()));
            if (i.isTouchEvent && r.touchReleaseOnEdges && !r.loop) if (s.isVertical()) {
                if (m < n.startY && s.translate <= s.maxTranslate() || m > n.startY && s.translate >= s.minTranslate()) return i.isTouched = !1, 
                void (i.isMoved = !1);
            } else if (h < n.startX && s.translate <= s.maxTranslate() || h > n.startX && s.translate >= s.minTranslate()) return;
            if (i.isTouchEvent && t.activeElement && c.target === t.activeElement && d(c.target).is(i.focusableElements)) return i.isMoved = !0, 
            void (s.allowClick = !1);
            if (i.allowTouchCallbacks && s.emit("touchMove", c), c.targetTouches && c.targetTouches.length > 1) return;
            n.currentX = h, n.currentY = m;
            const f = n.currentX - n.startX, g = n.currentY - n.startY;
            if (s.params.threshold && Math.sqrt(f ** 2 + g ** 2) < s.params.threshold) return;
            if (void 0 === i.isScrolling) {
                let e;
                s.isHorizontal() && n.currentY === n.startY || s.isVertical() && n.currentX === n.startX ? i.isScrolling = !1 : f * f + g * g >= 25 && (e = 180 * Math.atan2(Math.abs(g), Math.abs(f)) / Math.PI, 
                i.isScrolling = s.isHorizontal() ? e > r.touchAngle : 90 - e > r.touchAngle);
            }
            if (i.isScrolling && s.emit("touchMoveOpposite", c), void 0 === i.startMoving && (n.currentX === n.startX && n.currentY === n.startY || (i.startMoving = !0)), 
            i.isScrolling) return void (i.isTouched = !1);
            if (!i.startMoving) return;
            s.allowClick = !1, !r.cssMode && c.cancelable && c.preventDefault(), r.touchMoveStopPropagation && !r.nested && c.stopPropagation(), 
            i.isMoved || (r.loop && !r.cssMode && s.loopFix(), i.startTranslate = s.getTranslate(), 
            s.setTransition(0), s.animating && s.$wrapperEl.trigger("webkitTransitionEnd transitionend"), 
            i.allowMomentumBounce = !1, !r.grabCursor || !0 !== s.allowSlideNext && !0 !== s.allowSlidePrev || s.setGrabCursor(!0), 
            s.emit("sliderFirstMove", c)), s.emit("sliderMove", c), i.isMoved = !0;
            let v = s.isHorizontal() ? f : g;
            n.diff = v, v *= r.touchRatio, l && (v = -v), s.swipeDirection = v > 0 ? "prev" : "next", 
            i.currentTranslate = v + i.startTranslate;
            let w = !0, b = r.resistanceRatio;
            if (r.touchReleaseOnEdges && (b = 0), v > 0 && i.currentTranslate > s.minTranslate() ? (w = !1, 
            r.resistance && (i.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + i.startTranslate + v) ** b)) : v < 0 && i.currentTranslate < s.maxTranslate() && (w = !1, 
            r.resistance && (i.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - i.startTranslate - v) ** b)), 
            w && (c.preventedByNestedSwiper = !0), !s.allowSlideNext && "next" === s.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate), 
            !s.allowSlidePrev && "prev" === s.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate), 
            s.allowSlidePrev || s.allowSlideNext || (i.currentTranslate = i.startTranslate), 
            r.threshold > 0) {
                if (!(Math.abs(v) > r.threshold || i.allowThresholdMove)) return void (i.currentTranslate = i.startTranslate);
                if (!i.allowThresholdMove) return i.allowThresholdMove = !0, n.startX = n.currentX, 
                n.startY = n.currentY, i.currentTranslate = i.startTranslate, void (n.diff = s.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY);
            }
            r.followFinger && !r.cssMode && ((r.freeMode && r.freeMode.enabled && s.freeMode || r.watchSlidesProgress) && (s.updateActiveIndex(), 
            s.updateSlidesClasses()), s.params.freeMode && r.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(), 
            s.updateProgress(i.currentTranslate), s.setTranslate(i.currentTranslate));
        }
        function I(e) {
            const t = this, s = t.touchEventsData, {params: a, touches: i, rtlTranslate: r, slidesGrid: n, enabled: l} = t;
            if (!l) return;
            let o = e;
            if (o.originalEvent && (o = o.originalEvent), s.allowTouchCallbacks && t.emit("touchEnd", o), 
            s.allowTouchCallbacks = !1, !s.isTouched) return s.isMoved && a.grabCursor && t.setGrabCursor(!1), 
            s.isMoved = !1, void (s.startMoving = !1);
            a.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
            const d = u(), c = d - s.touchStartTime;
            if (t.allowClick) {
                const e = o.path || o.composedPath && o.composedPath();
                t.updateClickedSlide(e && e[0] || o.target), t.emit("tap click", o), c < 300 && d - s.lastClickTime < 300 && t.emit("doubleTap doubleClick", o);
            }
            if (s.lastClickTime = u(), p((() => {
                t.destroyed || (t.allowClick = !0);
            })), !s.isTouched || !s.isMoved || !t.swipeDirection || 0 === i.diff || s.currentTranslate === s.startTranslate) return s.isTouched = !1, 
            s.isMoved = !1, void (s.startMoving = !1);
            let h;
            if (s.isTouched = !1, s.isMoved = !1, s.startMoving = !1, h = a.followFinger ? r ? t.translate : -t.translate : -s.currentTranslate, 
            a.cssMode) return;
            if (t.params.freeMode && a.freeMode.enabled) return void t.freeMode.onTouchEnd({
                currentPos: h
            });
            let m = 0, f = t.slidesSizesGrid[0];
            for (let e = 0; e < n.length; e += e < a.slidesPerGroupSkip ? 1 : a.slidesPerGroup) {
                const t = e < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
                void 0 !== n[e + t] ? h >= n[e] && h < n[e + t] && (m = e, f = n[e + t] - n[e]) : h >= n[e] && (m = e, 
                f = n[n.length - 1] - n[n.length - 2]);
            }
            let g = null, v = null;
            a.rewind && (t.isBeginning ? v = t.params.virtual && t.params.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1 : t.isEnd && (g = 0));
            const w = (h - n[m]) / f, b = m < a.slidesPerGroupSkip - 1 ? 1 : a.slidesPerGroup;
            if (c > a.longSwipesMs) {
                if (!a.longSwipes) return void t.slideTo(t.activeIndex);
                "next" === t.swipeDirection && (w >= a.longSwipesRatio ? t.slideTo(a.rewind && t.isEnd ? g : m + b) : t.slideTo(m)), 
                "prev" === t.swipeDirection && (w > 1 - a.longSwipesRatio ? t.slideTo(m + b) : null !== v && w < 0 && Math.abs(w) > a.longSwipesRatio ? t.slideTo(v) : t.slideTo(m));
            } else {
                if (!a.shortSwipes) return void t.slideTo(t.activeIndex);
                t.navigation && (o.target === t.navigation.nextEl || o.target === t.navigation.prevEl) ? o.target === t.navigation.nextEl ? t.slideTo(m + b) : t.slideTo(m) : ("next" === t.swipeDirection && t.slideTo(null !== g ? g : m + b), 
                "prev" === t.swipeDirection && t.slideTo(null !== v ? v : m));
            }
        }
        function A() {
            const e = this, {params: t, el: s} = e;
            if (s && 0 === s.offsetWidth) return;
            t.breakpoints && e.setBreakpoint();
            const {allowSlideNext: a, allowSlidePrev: i, snapGrid: r} = e;
            e.allowSlideNext = !0, e.allowSlidePrev = !0, e.updateSize(), e.updateSlides(), 
            e.updateSlidesClasses(), ("auto" === t.slidesPerView || t.slidesPerView > 1) && e.isEnd && !e.isBeginning && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0), 
            e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(), e.allowSlidePrev = i, 
            e.allowSlideNext = a, e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow();
        }
        function D(e) {
            const t = this;
            t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), 
            e.stopImmediatePropagation())));
        }
        function G() {
            const e = this, {wrapperEl: t, rtlTranslate: s, enabled: a} = e;
            if (!a) return;
            let i;
            e.previousTranslate = e.translate, e.isHorizontal() ? e.translate = -t.scrollLeft : e.translate = -t.scrollTop, 
            0 === e.translate && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses();
            const r = e.maxTranslate() - e.minTranslate();
            i = 0 === r ? 0 : (e.translate - e.minTranslate()) / r, i !== e.progress && e.updateProgress(s ? -e.translate : e.translate), 
            e.emit("setTranslate", e.translate, !1);
        }
        let N = !1;
        function B() {}
        const H = (e, t) => {
            const s = a(), {params: i, touchEvents: r, el: n, wrapperEl: l, device: o, support: d} = e, c = !!i.nested, p = "on" === t ? "addEventListener" : "removeEventListener", u = t;
            if (d.touch) {
                const t = !("touchstart" !== r.start || !d.passiveListener || !i.passiveListeners) && {
                    passive: !0,
                    capture: !1
                };
                n[p](r.start, e.onTouchStart, t), n[p](r.move, e.onTouchMove, d.passiveListener ? {
                    passive: !1,
                    capture: c
                } : c), n[p](r.end, e.onTouchEnd, t), r.cancel && n[p](r.cancel, e.onTouchEnd, t);
            } else n[p](r.start, e.onTouchStart, !1), s[p](r.move, e.onTouchMove, c), s[p](r.end, e.onTouchEnd, !1);
            (i.preventClicks || i.preventClicksPropagation) && n[p]("click", e.onClick, !0), 
            i.cssMode && l[p]("scroll", e.onScroll), i.updateOnWindowResize ? e[u](o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", A, !0) : e[u]("observerUpdate", A, !0);
        };
        var X = {
            attachEvents: function() {
                const e = this, t = a(), {params: s, support: i} = e;
                e.onTouchStart = L.bind(e), e.onTouchMove = O.bind(e), e.onTouchEnd = I.bind(e), 
                s.cssMode && (e.onScroll = G.bind(e)), e.onClick = D.bind(e), i.touch && !N && (t.addEventListener("touchstart", B), 
                N = !0), H(e, "on");
            },
            detachEvents: function() {
                H(this, "off");
            }
        };
        const Y = (e, t) => e.grid && t.grid && t.grid.rows > 1;
        var R = {
            addClasses: function() {
                const e = this, {classNames: t, params: s, rtl: a, $el: i, device: r, support: n} = e, l = function(e, t) {
                    const s = [];
                    return e.forEach((e => {
                        "object" == typeof e ? Object.keys(e).forEach((a => {
                            e[a] && s.push(t + a);
                        })) : "string" == typeof e && s.push(t + e);
                    })), s;
                }([ "initialized", s.direction, {
                    "pointer-events": !n.touch
                }, {
                    "free-mode": e.params.freeMode && s.freeMode.enabled
                }, {
                    autoheight: s.autoHeight
                }, {
                    rtl: a
                }, {
                    grid: s.grid && s.grid.rows > 1
                }, {
                    "grid-column": s.grid && s.grid.rows > 1 && "column" === s.grid.fill
                }, {
                    android: r.android
                }, {
                    ios: r.ios
                }, {
                    "css-mode": s.cssMode
                }, {
                    centered: s.cssMode && s.centeredSlides
                }, {
                    "watch-progress": s.watchSlidesProgress
                } ], s.containerModifierClass);
                t.push(...l), i.addClass([ ...t ].join(" ")), e.emitContainerClasses();
            },
            removeClasses: function() {
                const {$el: e, classNames: t} = this;
                e.removeClass(t.join(" ")), this.emitContainerClasses();
            }
        };
        var W = {
            init: !0,
            direction: "horizontal",
            touchEventsTarget: "wrapper",
            initialSlide: 0,
            speed: 300,
            cssMode: !1,
            updateOnWindowResize: !0,
            resizeObserver: !0,
            nested: !1,
            createElements: !1,
            enabled: !0,
            focusableElements: "input, select, option, textarea, button, video, label",
            width: null,
            height: null,
            preventInteractionOnTransition: !1,
            userAgent: null,
            url: null,
            edgeSwipeDetection: !1,
            edgeSwipeThreshold: 20,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            breakpoints: void 0,
            breakpointsBase: "window",
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerGroup: 1,
            slidesPerGroupSkip: 0,
            slidesPerGroupAuto: !1,
            centeredSlides: !1,
            centeredSlidesBounds: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            normalizeSlideIndex: !0,
            centerInsufficientSlides: !1,
            watchOverflow: !0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            allowTouchMove: !0,
            threshold: 0,
            touchMoveStopPropagation: !1,
            touchStartPreventDefault: !0,
            touchStartForcePreventDefault: !1,
            touchReleaseOnEdges: !1,
            uniqueNavElements: !0,
            resistance: !0,
            resistanceRatio: .85,
            watchSlidesProgress: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            loopedSlidesLimit: !0,
            loopFillGroupWithBlank: !1,
            loopPreventsSlide: !0,
            rewind: !1,
            allowSlidePrev: !0,
            allowSlideNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            noSwipingSelector: null,
            passiveListeners: !0,
            maxBackfaceHiddenSlides: 10,
            containerModifierClass: "swiper-",
            slideClass: "swiper-slide",
            slideBlankClass: "swiper-slide-invisible-blank",
            slideActiveClass: "swiper-slide-active",
            slideDuplicateActiveClass: "swiper-slide-duplicate-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slideDuplicateNextClass: "swiper-slide-duplicate-next",
            slidePrevClass: "swiper-slide-prev",
            slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
            wrapperClass: "swiper-wrapper",
            runCallbacksOnInit: !0,
            _emitClasses: !1
        };
        function j(e, t) {
            return function(s) {
                void 0 === s && (s = {});
                const a = Object.keys(s)[0], i = s[a];
                "object" == typeof i && null !== i ? ([ "navigation", "pagination", "scrollbar" ].indexOf(a) >= 0 && !0 === e[a] && (e[a] = {
                    auto: !0
                }), a in e && "enabled" in i ? (!0 === e[a] && (e[a] = {
                    enabled: !0
                }), "object" != typeof e[a] || "enabled" in e[a] || (e[a].enabled = !0), e[a] || (e[a] = {
                    enabled: !1
                }), g(t, s)) : g(t, s)) : g(t, s);
            };
        }
        const q = {
            eventsEmitter: $,
            update: S,
            translate: M,
            transition: {
                setTransition: function(e, t) {
                    const s = this;
                    s.params.cssMode || s.$wrapperEl.transition(e), s.emit("setTransition", e, t);
                },
                transitionStart: function(e, t) {
                    void 0 === e && (e = !0);
                    const s = this, {params: a} = s;
                    a.cssMode || (a.autoHeight && s.updateAutoHeight(), P({
                        swiper: s,
                        runCallbacks: e,
                        direction: t,
                        step: "Start"
                    }));
                },
                transitionEnd: function(e, t) {
                    void 0 === e && (e = !0);
                    const s = this, {params: a} = s;
                    s.animating = !1, a.cssMode || (s.setTransition(0), P({
                        swiper: s,
                        runCallbacks: e,
                        direction: t,
                        step: "End"
                    }));
                }
            },
            slide: k,
            loop: z,
            grabCursor: {
                setGrabCursor: function(e) {
                    const t = this;
                    if (t.support.touch || !t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode) return;
                    const s = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
                    s.style.cursor = "move", s.style.cursor = e ? "grabbing" : "grab";
                },
                unsetGrabCursor: function() {
                    const e = this;
                    e.support.touch || e.params.watchOverflow && e.isLocked || e.params.cssMode || (e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "");
                }
            },
            events: X,
            breakpoints: {
                setBreakpoint: function() {
                    const e = this, {activeIndex: t, initialized: s, loopedSlides: a = 0, params: i, $el: r} = e, n = i.breakpoints;
                    if (!n || n && 0 === Object.keys(n).length) return;
                    const l = e.getBreakpoint(n, e.params.breakpointsBase, e.el);
                    if (!l || e.currentBreakpoint === l) return;
                    const o = (l in n ? n[l] : void 0) || e.originalParams, d = Y(e, i), c = Y(e, o), p = i.enabled;
                    d && !c ? (r.removeClass(`${i.containerModifierClass}grid ${i.containerModifierClass}grid-column`), 
                    e.emitContainerClasses()) : !d && c && (r.addClass(`${i.containerModifierClass}grid`), 
                    (o.grid.fill && "column" === o.grid.fill || !o.grid.fill && "column" === i.grid.fill) && r.addClass(`${i.containerModifierClass}grid-column`), 
                    e.emitContainerClasses()), [ "navigation", "pagination", "scrollbar" ].forEach((t => {
                        const s = i[t] && i[t].enabled, a = o[t] && o[t].enabled;
                        s && !a && e[t].disable(), !s && a && e[t].enable();
                    }));
                    const u = o.direction && o.direction !== i.direction, h = i.loop && (o.slidesPerView !== i.slidesPerView || u);
                    u && s && e.changeDirection(), g(e.params, o);
                    const m = e.params.enabled;
                    Object.assign(e, {
                        allowTouchMove: e.params.allowTouchMove,
                        allowSlideNext: e.params.allowSlideNext,
                        allowSlidePrev: e.params.allowSlidePrev
                    }), p && !m ? e.disable() : !p && m && e.enable(), e.currentBreakpoint = l, e.emit("_beforeBreakpoint", o), 
                    h && s && (e.loopDestroy(), e.loopCreate(), e.updateSlides(), e.slideTo(t - a + e.loopedSlides, 0, !1)), 
                    e.emit("breakpoint", o);
                },
                getBreakpoint: function(e, t, s) {
                    if (void 0 === t && (t = "window"), !e || "container" === t && !s) return;
                    let a = !1;
                    const i = r(), n = "window" === t ? i.innerHeight : s.clientHeight, l = Object.keys(e).map((e => {
                        if ("string" == typeof e && 0 === e.indexOf("@")) {
                            const t = parseFloat(e.substr(1));
                            return {
                                value: n * t,
                                point: e
                            };
                        }
                        return {
                            value: e,
                            point: e
                        };
                    }));
                    l.sort(((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10)));
                    for (let e = 0; e < l.length; e += 1) {
                        const {point: r, value: n} = l[e];
                        "window" === t ? i.matchMedia(`(min-width: ${n}px)`).matches && (a = r) : n <= s.clientWidth && (a = r);
                    }
                    return a || "max";
                }
            },
            checkOverflow: {
                checkOverflow: function() {
                    const e = this, {isLocked: t, params: s} = e, {slidesOffsetBefore: a} = s;
                    if (a) {
                        const t = e.slides.length - 1, s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * a;
                        e.isLocked = e.size > s;
                    } else e.isLocked = 1 === e.snapGrid.length;
                    !0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked), !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked), 
                    t && t !== e.isLocked && (e.isEnd = !1), t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
                }
            },
            classes: R,
            images: {
                loadImage: function(e, t, s, a, i, n) {
                    const l = r();
                    let o;
                    function c() {
                        n && n();
                    }
                    d(e).parent("picture")[0] || e.complete && i ? c() : t ? (o = new l.Image, o.onload = c, 
                    o.onerror = c, a && (o.sizes = a), s && (o.srcset = s), t && (o.src = t)) : c();
                },
                preloadImages: function() {
                    const e = this;
                    function t() {
                        null != e && e && !e.destroyed && (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1), 
                        e.imagesLoaded === e.imagesToLoad.length && (e.params.updateOnImagesReady && e.update(), 
                        e.emit("imagesReady")));
                    }
                    e.imagesToLoad = e.$el.find("img");
                    for (let s = 0; s < e.imagesToLoad.length; s += 1) {
                        const a = e.imagesToLoad[s];
                        e.loadImage(a, a.currentSrc || a.getAttribute("src"), a.srcset || a.getAttribute("srcset"), a.sizes || a.getAttribute("sizes"), !0, t);
                    }
                }
            }
        }, _ = {};
        class V {
            constructor() {
                let e, t;
                for (var s = arguments.length, a = new Array(s), i = 0; i < s; i++) a[i] = arguments[i];
                if (1 === a.length && a[0].constructor && "Object" === Object.prototype.toString.call(a[0]).slice(8, -1) ? t = a[0] : [e, t] = a, 
                t || (t = {}), t = g({}, t), e && !t.el && (t.el = e), t.el && d(t.el).length > 1) {
                    const e = [];
                    return d(t.el).each((s => {
                        const a = g({}, t, {
                            el: s
                        });
                        e.push(new V(a));
                    })), e;
                }
                const r = this;
                r.__swiper__ = !0, r.support = E(), r.device = C({
                    userAgent: t.userAgent
                }), r.browser = T(), r.eventsListeners = {}, r.eventsAnyListeners = [], r.modules = [ ...r.__modules__ ], 
                t.modules && Array.isArray(t.modules) && r.modules.push(...t.modules);
                const n = {};
                r.modules.forEach((e => {
                    e({
                        swiper: r,
                        extendParams: j(t, n),
                        on: r.on.bind(r),
                        once: r.once.bind(r),
                        off: r.off.bind(r),
                        emit: r.emit.bind(r)
                    });
                }));
                const l = g({}, W, n);
                return r.params = g({}, l, _, t), r.originalParams = g({}, r.params), r.passedParams = g({}, t), 
                r.params && r.params.on && Object.keys(r.params.on).forEach((e => {
                    r.on(e, r.params.on[e]);
                })), r.params && r.params.onAny && r.onAny(r.params.onAny), r.$ = d, Object.assign(r, {
                    enabled: r.params.enabled,
                    el: e,
                    classNames: [],
                    slides: d(),
                    slidesGrid: [],
                    snapGrid: [],
                    slidesSizesGrid: [],
                    isHorizontal: () => "horizontal" === r.params.direction,
                    isVertical: () => "vertical" === r.params.direction,
                    activeIndex: 0,
                    realIndex: 0,
                    isBeginning: !0,
                    isEnd: !1,
                    translate: 0,
                    previousTranslate: 0,
                    progress: 0,
                    velocity: 0,
                    animating: !1,
                    allowSlideNext: r.params.allowSlideNext,
                    allowSlidePrev: r.params.allowSlidePrev,
                    touchEvents: function() {
                        const e = [ "touchstart", "touchmove", "touchend", "touchcancel" ], t = [ "pointerdown", "pointermove", "pointerup" ];
                        return r.touchEventsTouch = {
                            start: e[0],
                            move: e[1],
                            end: e[2],
                            cancel: e[3]
                        }, r.touchEventsDesktop = {
                            start: t[0],
                            move: t[1],
                            end: t[2]
                        }, r.support.touch || !r.params.simulateTouch ? r.touchEventsTouch : r.touchEventsDesktop;
                    }(),
                    touchEventsData: {
                        isTouched: void 0,
                        isMoved: void 0,
                        allowTouchCallbacks: void 0,
                        touchStartTime: void 0,
                        isScrolling: void 0,
                        currentTranslate: void 0,
                        startTranslate: void 0,
                        allowThresholdMove: void 0,
                        focusableElements: r.params.focusableElements,
                        lastClickTime: u(),
                        clickTimeout: void 0,
                        velocities: [],
                        allowMomentumBounce: void 0,
                        isTouchEvent: void 0,
                        startMoving: void 0
                    },
                    allowClick: !0,
                    allowTouchMove: r.params.allowTouchMove,
                    touches: {
                        startX: 0,
                        startY: 0,
                        currentX: 0,
                        currentY: 0,
                        diff: 0
                    },
                    imagesToLoad: [],
                    imagesLoaded: 0
                }), r.emit("_swiper"), r.params.init && r.init(), r;
            }
            enable() {
                const e = this;
                e.enabled || (e.enabled = !0, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"));
            }
            disable() {
                const e = this;
                e.enabled && (e.enabled = !1, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"));
            }
            setProgress(e, t) {
                const s = this;
                e = Math.min(Math.max(e, 0), 1);
                const a = s.minTranslate(), i = (s.maxTranslate() - a) * e + a;
                s.translateTo(i, void 0 === t ? 0 : t), s.updateActiveIndex(), s.updateSlidesClasses();
            }
            emitContainerClasses() {
                const e = this;
                if (!e.params._emitClasses || !e.el) return;
                const t = e.el.className.split(" ").filter((t => 0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass)));
                e.emit("_containerClasses", t.join(" "));
            }
            getSlideClasses(e) {
                const t = this;
                return t.destroyed ? "" : e.className.split(" ").filter((e => 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))).join(" ");
            }
            emitSlidesClasses() {
                const e = this;
                if (!e.params._emitClasses || !e.el) return;
                const t = [];
                e.slides.each((s => {
                    const a = e.getSlideClasses(s);
                    t.push({
                        slideEl: s,
                        classNames: a
                    }), e.emit("_slideClass", s, a);
                })), e.emit("_slideClasses", t);
            }
            slidesPerViewDynamic(e, t) {
                void 0 === e && (e = "current"), void 0 === t && (t = !1);
                const {params: s, slides: a, slidesGrid: i, slidesSizesGrid: r, size: n, activeIndex: l} = this;
                let o = 1;
                if (s.centeredSlides) {
                    let e, t = a[l].swiperSlideSize;
                    for (let s = l + 1; s < a.length; s += 1) a[s] && !e && (t += a[s].swiperSlideSize, 
                    o += 1, t > n && (e = !0));
                    for (let s = l - 1; s >= 0; s -= 1) a[s] && !e && (t += a[s].swiperSlideSize, o += 1, 
                    t > n && (e = !0));
                } else if ("current" === e) for (let e = l + 1; e < a.length; e += 1) (t ? i[e] + r[e] - i[l] < n : i[e] - i[l] < n) && (o += 1); else for (let e = l - 1; e >= 0; e -= 1) i[l] - i[e] < n && (o += 1);
                return o;
            }
            update() {
                const e = this;
                if (!e || e.destroyed) return;
                const {snapGrid: t, params: s} = e;
                function a() {
                    const t = e.rtlTranslate ? -1 * e.translate : e.translate, s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                    e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses();
                }
                let i;
                s.breakpoints && e.setBreakpoint(), e.updateSize(), e.updateSlides(), e.updateProgress(), 
                e.updateSlidesClasses(), e.params.freeMode && e.params.freeMode.enabled ? (a(), 
                e.params.autoHeight && e.updateAutoHeight()) : (i = ("auto" === e.params.slidesPerView || e.params.slidesPerView > 1) && e.isEnd && !e.params.centeredSlides ? e.slideTo(e.slides.length - 1, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0), 
                i || a()), s.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update");
            }
            changeDirection(e, t) {
                void 0 === t && (t = !0);
                const s = this, a = s.params.direction;
                return e || (e = "horizontal" === a ? "vertical" : "horizontal"), e === a || "horizontal" !== e && "vertical" !== e || (s.$el.removeClass(`${s.params.containerModifierClass}${a}`).addClass(`${s.params.containerModifierClass}${e}`), 
                s.emitContainerClasses(), s.params.direction = e, s.slides.each((t => {
                    "vertical" === e ? t.style.width = "" : t.style.height = "";
                })), s.emit("changeDirection"), t && s.update()), s;
            }
            changeLanguageDirection(e) {
                const t = this;
                t.rtl && "rtl" === e || !t.rtl && "ltr" === e || (t.rtl = "rtl" === e, t.rtlTranslate = "horizontal" === t.params.direction && t.rtl, 
                t.rtl ? (t.$el.addClass(`${t.params.containerModifierClass}rtl`), t.el.dir = "rtl") : (t.$el.removeClass(`${t.params.containerModifierClass}rtl`), 
                t.el.dir = "ltr"), t.update());
            }
            mount(e) {
                const t = this;
                if (t.mounted) return !0;
                const s = d(e || t.params.el);
                if (!(e = s[0])) return !1;
                e.swiper = t;
                const i = () => `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
                let r = (() => {
                    if (e && e.shadowRoot && e.shadowRoot.querySelector) {
                        const t = d(e.shadowRoot.querySelector(i()));
                        return t.children = e => s.children(e), t;
                    }
                    return s.children ? s.children(i()) : d(s).children(i());
                })();
                if (0 === r.length && t.params.createElements) {
                    const e = a().createElement("div");
                    r = d(e), e.className = t.params.wrapperClass, s.append(e), s.children(`.${t.params.slideClass}`).each((e => {
                        r.append(e);
                    }));
                }
                return Object.assign(t, {
                    $el: s,
                    el: e,
                    $wrapperEl: r,
                    wrapperEl: r[0],
                    mounted: !0,
                    rtl: "rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction"),
                    rtlTranslate: "horizontal" === t.params.direction && ("rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction")),
                    wrongRTL: "-webkit-box" === r.css("display")
                }), !0;
            }
            init(e) {
                const t = this;
                if (t.initialized) return t;
                return !1 === t.mount(e) || (t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(), 
                t.addClasses(), t.params.loop && t.loopCreate(), t.updateSize(), t.updateSlides(), 
                t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.enabled && t.setGrabCursor(), 
                t.params.preloadImages && t.preloadImages(), t.params.loop ? t.slideTo(t.params.initialSlide + t.loopedSlides, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0), 
                t.attachEvents(), t.initialized = !0, t.emit("init"), t.emit("afterInit")), t;
            }
            destroy(e, t) {
                void 0 === e && (e = !0), void 0 === t && (t = !0);
                const s = this, {params: a, $el: i, $wrapperEl: r, slides: n} = s;
                return void 0 === s.params || s.destroyed || (s.emit("beforeDestroy"), s.initialized = !1, 
                s.detachEvents(), a.loop && s.loopDestroy(), t && (s.removeClasses(), i.removeAttr("style"), 
                r.removeAttr("style"), n && n.length && n.removeClass([ a.slideVisibleClass, a.slideActiveClass, a.slideNextClass, a.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")), 
                s.emit("destroy"), Object.keys(s.eventsListeners).forEach((e => {
                    s.off(e);
                })), !1 !== e && (s.$el[0].swiper = null, function(e) {
                    const t = e;
                    Object.keys(t).forEach((e => {
                        try {
                            t[e] = null;
                        } catch (e) {}
                        try {
                            delete t[e];
                        } catch (e) {}
                    }));
                }(s)), s.destroyed = !0), null;
            }
            static extendDefaults(e) {
                g(_, e);
            }
            static get extendedDefaults() {
                return _;
            }
            static get defaults() {
                return W;
            }
            static installModule(e) {
                V.prototype.__modules__ || (V.prototype.__modules__ = []);
                const t = V.prototype.__modules__;
                "function" == typeof e && t.indexOf(e) < 0 && t.push(e);
            }
            static use(e) {
                return Array.isArray(e) ? (e.forEach((e => V.installModule(e))), V) : (V.installModule(e), 
                V);
            }
        }
        function F(e, t, s, i) {
            const r = a();
            return e.params.createElements && Object.keys(i).forEach((a => {
                if (!s[a] && !0 === s.auto) {
                    let n = e.$el.children(`.${i[a]}`)[0];
                    n || (n = r.createElement("div"), n.className = i[a], e.$el.append(n)), s[a] = n, 
                    t[a] = n;
                }
            })), s;
        }
        function U(e) {
            return void 0 === e && (e = ""), `.${e.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
        }
        function K(e) {
            const t = this, {$wrapperEl: s, params: a} = t;
            if (a.loop && t.loopDestroy(), "object" == typeof e && "length" in e) for (let t = 0; t < e.length; t += 1) e[t] && s.append(e[t]); else s.append(e);
            a.loop && t.loopCreate(), a.observer || t.update();
        }
        function Z(e) {
            const t = this, {params: s, $wrapperEl: a, activeIndex: i} = t;
            s.loop && t.loopDestroy();
            let r = i + 1;
            if ("object" == typeof e && "length" in e) {
                for (let t = 0; t < e.length; t += 1) e[t] && a.prepend(e[t]);
                r = i + e.length;
            } else a.prepend(e);
            s.loop && t.loopCreate(), s.observer || t.update(), t.slideTo(r, 0, !1);
        }
        function Q(e, t) {
            const s = this, {$wrapperEl: a, params: i, activeIndex: r} = s;
            let n = r;
            i.loop && (n -= s.loopedSlides, s.loopDestroy(), s.slides = a.children(`.${i.slideClass}`));
            const l = s.slides.length;
            if (e <= 0) return void s.prependSlide(t);
            if (e >= l) return void s.appendSlide(t);
            let o = n > e ? n + 1 : n;
            const d = [];
            for (let t = l - 1; t >= e; t -= 1) {
                const e = s.slides.eq(t);
                e.remove(), d.unshift(e);
            }
            if ("object" == typeof t && "length" in t) {
                for (let e = 0; e < t.length; e += 1) t[e] && a.append(t[e]);
                o = n > e ? n + t.length : n;
            } else a.append(t);
            for (let e = 0; e < d.length; e += 1) a.append(d[e]);
            i.loop && s.loopCreate(), i.observer || s.update(), i.loop ? s.slideTo(o + s.loopedSlides, 0, !1) : s.slideTo(o, 0, !1);
        }
        function J(e) {
            const t = this, {params: s, $wrapperEl: a, activeIndex: i} = t;
            let r = i;
            s.loop && (r -= t.loopedSlides, t.loopDestroy(), t.slides = a.children(`.${s.slideClass}`));
            let n, l = r;
            if ("object" == typeof e && "length" in e) {
                for (let s = 0; s < e.length; s += 1) n = e[s], t.slides[n] && t.slides.eq(n).remove(), 
                n < l && (l -= 1);
                l = Math.max(l, 0);
            } else n = e, t.slides[n] && t.slides.eq(n).remove(), n < l && (l -= 1), l = Math.max(l, 0);
            s.loop && t.loopCreate(), s.observer || t.update(), s.loop ? t.slideTo(l + t.loopedSlides, 0, !1) : t.slideTo(l, 0, !1);
        }
        function ee() {
            const e = this, t = [];
            for (let s = 0; s < e.slides.length; s += 1) t.push(s);
            e.removeSlide(t);
        }
        function te(e) {
            const {effect: t, swiper: s, on: a, setTranslate: i, setTransition: r, overwriteParams: n, perspective: l, recreateShadows: o, getEffectParams: d} = e;
            let c;
            a("beforeInit", (() => {
                if (s.params.effect !== t) return;
                s.classNames.push(`${s.params.containerModifierClass}${t}`), l && l() && s.classNames.push(`${s.params.containerModifierClass}3d`);
                const e = n ? n() : {};
                Object.assign(s.params, e), Object.assign(s.originalParams, e);
            })), a("setTranslate", (() => {
                s.params.effect === t && i();
            })), a("setTransition", ((e, a) => {
                s.params.effect === t && r(a);
            })), a("transitionEnd", (() => {
                if (s.params.effect === t && o) {
                    if (!d || !d().slideShadows) return;
                    s.slides.each((e => {
                        s.$(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").remove();
                    })), o();
                }
            })), a("virtualUpdate", (() => {
                s.params.effect === t && (s.slides.length || (c = !0), requestAnimationFrame((() => {
                    c && s.slides && s.slides.length && (i(), c = !1);
                })));
            }));
        }
        function se(e, t) {
            return e.transformEl ? t.find(e.transformEl).css({
                "backface-visibility": "hidden",
                "-webkit-backface-visibility": "hidden"
            }) : t;
        }
        function ae(e) {
            let {swiper: t, duration: s, transformEl: a, allSlides: i} = e;
            const {slides: r, activeIndex: n, $wrapperEl: l} = t;
            if (t.params.virtualTranslate && 0 !== s) {
                let e, s = !1;
                e = i ? a ? r.find(a) : r : a ? r.eq(n).find(a) : r.eq(n), e.transitionEnd((() => {
                    if (s) return;
                    if (!t || t.destroyed) return;
                    s = !0, t.animating = !1;
                    const e = [ "webkitTransitionEnd", "transitionend" ];
                    for (let t = 0; t < e.length; t += 1) l.trigger(e[t]);
                }));
            }
        }
        function ie(e, t, s) {
            const a = "swiper-slide-shadow" + (s ? `-${s}` : ""), i = e.transformEl ? t.find(e.transformEl) : t;
            let r = i.children(`.${a}`);
            return r.length || (r = d(`<div class="swiper-slide-shadow${s ? `-${s}` : ""}"></div>`), 
            i.append(r)), r;
        }
        Object.keys(q).forEach((e => {
            Object.keys(q[e]).forEach((t => {
                V.prototype[t] = q[e][t];
            }));
        })), V.use([ function(e) {
            let {swiper: t, on: s, emit: a} = e;
            const i = r();
            let n = null, l = null;
            const o = () => {
                t && !t.destroyed && t.initialized && (a("beforeResize"), a("resize"));
            }, d = () => {
                t && !t.destroyed && t.initialized && a("orientationchange");
            };
            s("init", (() => {
                t.params.resizeObserver && void 0 !== i.ResizeObserver ? t && !t.destroyed && t.initialized && (n = new ResizeObserver((e => {
                    l = i.requestAnimationFrame((() => {
                        const {width: s, height: a} = t;
                        let i = s, r = a;
                        e.forEach((e => {
                            let {contentBoxSize: s, contentRect: a, target: n} = e;
                            n && n !== t.el || (i = a ? a.width : (s[0] || s).inlineSize, r = a ? a.height : (s[0] || s).blockSize);
                        })), i === s && r === a || o();
                    }));
                })), n.observe(t.el)) : (i.addEventListener("resize", o), i.addEventListener("orientationchange", d));
            })), s("destroy", (() => {
                l && i.cancelAnimationFrame(l), n && n.unobserve && t.el && (n.unobserve(t.el), 
                n = null), i.removeEventListener("resize", o), i.removeEventListener("orientationchange", d);
            }));
        }, function(e) {
            let {swiper: t, extendParams: s, on: a, emit: i} = e;
            const n = [], l = r(), o = function(e, t) {
                void 0 === t && (t = {});
                const s = new (l.MutationObserver || l.WebkitMutationObserver)((e => {
                    if (1 === e.length) return void i("observerUpdate", e[0]);
                    const t = function() {
                        i("observerUpdate", e[0]);
                    };
                    l.requestAnimationFrame ? l.requestAnimationFrame(t) : l.setTimeout(t, 0);
                }));
                s.observe(e, {
                    attributes: void 0 === t.attributes || t.attributes,
                    childList: void 0 === t.childList || t.childList,
                    characterData: void 0 === t.characterData || t.characterData
                }), n.push(s);
            };
            s({
                observer: !1,
                observeParents: !1,
                observeSlideChildren: !1
            }), a("init", (() => {
                if (t.params.observer) {
                    if (t.params.observeParents) {
                        const e = t.$el.parents();
                        for (let t = 0; t < e.length; t += 1) o(e[t]);
                    }
                    o(t.$el[0], {
                        childList: t.params.observeSlideChildren
                    }), o(t.$wrapperEl[0], {
                        attributes: !1
                    });
                }
            })), a("destroy", (() => {
                n.forEach((e => {
                    e.disconnect();
                })), n.splice(0, n.length);
            }));
        } ]);
        const re = [ function(e) {
            let t, {swiper: s, extendParams: a, on: i, emit: r} = e;
            function n(e, t) {
                const a = s.params.virtual;
                if (a.cache && s.virtual.cache[t]) return s.virtual.cache[t];
                const i = a.renderSlide ? d(a.renderSlide.call(s, e, t)) : d(`<div class="${s.params.slideClass}" data-swiper-slide-index="${t}">${e}</div>`);
                return i.attr("data-swiper-slide-index") || i.attr("data-swiper-slide-index", t), 
                a.cache && (s.virtual.cache[t] = i), i;
            }
            function l(e) {
                const {slidesPerView: t, slidesPerGroup: a, centeredSlides: i} = s.params, {addSlidesBefore: l, addSlidesAfter: o} = s.params.virtual, {from: d, to: c, slides: p, slidesGrid: u, offset: h} = s.virtual;
                s.params.cssMode || s.updateActiveIndex();
                const m = s.activeIndex || 0;
                let f, g, v;
                f = s.rtlTranslate ? "right" : s.isHorizontal() ? "left" : "top", i ? (g = Math.floor(t / 2) + a + o, 
                v = Math.floor(t / 2) + a + l) : (g = t + (a - 1) + o, v = a + l);
                const w = Math.max((m || 0) - v, 0), b = Math.min((m || 0) + g, p.length - 1), x = (s.slidesGrid[w] || 0) - (s.slidesGrid[0] || 0);
                function y() {
                    s.updateSlides(), s.updateProgress(), s.updateSlidesClasses(), s.lazy && s.params.lazy.enabled && s.lazy.load(), 
                    r("virtualUpdate");
                }
                if (Object.assign(s.virtual, {
                    from: w,
                    to: b,
                    offset: x,
                    slidesGrid: s.slidesGrid
                }), d === w && c === b && !e) return s.slidesGrid !== u && x !== h && s.slides.css(f, `${x}px`), 
                s.updateProgress(), void r("virtualUpdate");
                if (s.params.virtual.renderExternal) return s.params.virtual.renderExternal.call(s, {
                    offset: x,
                    from: w,
                    to: b,
                    slides: function() {
                        const e = [];
                        for (let t = w; t <= b; t += 1) e.push(p[t]);
                        return e;
                    }()
                }), void (s.params.virtual.renderExternalUpdate ? y() : r("virtualUpdate"));
                const E = [], C = [];
                if (e) s.$wrapperEl.find(`.${s.params.slideClass}`).remove(); else for (let e = d; e <= c; e += 1) (e < w || e > b) && s.$wrapperEl.find(`.${s.params.slideClass}[data-swiper-slide-index="${e}"]`).remove();
                for (let t = 0; t < p.length; t += 1) t >= w && t <= b && (void 0 === c || e ? C.push(t) : (t > c && C.push(t), 
                t < d && E.push(t)));
                C.forEach((e => {
                    s.$wrapperEl.append(n(p[e], e));
                })), E.sort(((e, t) => t - e)).forEach((e => {
                    s.$wrapperEl.prepend(n(p[e], e));
                })), s.$wrapperEl.children(".swiper-slide").css(f, `${x}px`), y();
            }
            a({
                virtual: {
                    enabled: !1,
                    slides: [],
                    cache: !0,
                    renderSlide: null,
                    renderExternal: null,
                    renderExternalUpdate: !0,
                    addSlidesBefore: 0,
                    addSlidesAfter: 0
                }
            }), s.virtual = {
                cache: {},
                from: void 0,
                to: void 0,
                slides: [],
                offset: 0,
                slidesGrid: []
            }, i("beforeInit", (() => {
                s.params.virtual.enabled && (s.virtual.slides = s.params.virtual.slides, s.classNames.push(`${s.params.containerModifierClass}virtual`), 
                s.params.watchSlidesProgress = !0, s.originalParams.watchSlidesProgress = !0, s.params.initialSlide || l());
            })), i("setTranslate", (() => {
                s.params.virtual.enabled && (s.params.cssMode && !s._immediateVirtual ? (clearTimeout(t), 
                t = setTimeout((() => {
                    l();
                }), 100)) : l());
            })), i("init update resize", (() => {
                s.params.virtual.enabled && s.params.cssMode && v(s.wrapperEl, "--swiper-virtual-size", `${s.virtualSize}px`);
            })), Object.assign(s.virtual, {
                appendSlide: function(e) {
                    if ("object" == typeof e && "length" in e) for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.push(e[t]); else s.virtual.slides.push(e);
                    l(!0);
                },
                prependSlide: function(e) {
                    const t = s.activeIndex;
                    let a = t + 1, i = 1;
                    if (Array.isArray(e)) {
                        for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.unshift(e[t]);
                        a = t + e.length, i = e.length;
                    } else s.virtual.slides.unshift(e);
                    if (s.params.virtual.cache) {
                        const e = s.virtual.cache, t = {};
                        Object.keys(e).forEach((s => {
                            const a = e[s], r = a.attr("data-swiper-slide-index");
                            r && a.attr("data-swiper-slide-index", parseInt(r, 10) + i), t[parseInt(s, 10) + i] = a;
                        })), s.virtual.cache = t;
                    }
                    l(!0), s.slideTo(a, 0);
                },
                removeSlide: function(e) {
                    if (null == e) return;
                    let t = s.activeIndex;
                    if (Array.isArray(e)) for (let a = e.length - 1; a >= 0; a -= 1) s.virtual.slides.splice(e[a], 1), 
                    s.params.virtual.cache && delete s.virtual.cache[e[a]], e[a] < t && (t -= 1), t = Math.max(t, 0); else s.virtual.slides.splice(e, 1), 
                    s.params.virtual.cache && delete s.virtual.cache[e], e < t && (t -= 1), t = Math.max(t, 0);
                    l(!0), s.slideTo(t, 0);
                },
                removeAllSlides: function() {
                    s.virtual.slides = [], s.params.virtual.cache && (s.virtual.cache = {}), l(!0), 
                    s.slideTo(0, 0);
                },
                update: l
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: i, emit: n} = e;
            const l = a(), o = r();
            function c(e) {
                if (!t.enabled) return;
                const {rtlTranslate: s} = t;
                let a = e;
                a.originalEvent && (a = a.originalEvent);
                const i = a.keyCode || a.charCode, r = t.params.keyboard.pageUpDown, d = r && 33 === i, c = r && 34 === i, p = 37 === i, u = 39 === i, h = 38 === i, m = 40 === i;
                if (!t.allowSlideNext && (t.isHorizontal() && u || t.isVertical() && m || c)) return !1;
                if (!t.allowSlidePrev && (t.isHorizontal() && p || t.isVertical() && h || d)) return !1;
                if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey || l.activeElement && l.activeElement.nodeName && ("input" === l.activeElement.nodeName.toLowerCase() || "textarea" === l.activeElement.nodeName.toLowerCase()))) {
                    if (t.params.keyboard.onlyInViewport && (d || c || p || u || h || m)) {
                        let e = !1;
                        if (t.$el.parents(`.${t.params.slideClass}`).length > 0 && 0 === t.$el.parents(`.${t.params.slideActiveClass}`).length) return;
                        const a = t.$el, i = a[0].clientWidth, r = a[0].clientHeight, n = o.innerWidth, l = o.innerHeight, d = t.$el.offset();
                        s && (d.left -= t.$el[0].scrollLeft);
                        const c = [ [ d.left, d.top ], [ d.left + i, d.top ], [ d.left, d.top + r ], [ d.left + i, d.top + r ] ];
                        for (let t = 0; t < c.length; t += 1) {
                            const s = c[t];
                            if (s[0] >= 0 && s[0] <= n && s[1] >= 0 && s[1] <= l) {
                                if (0 === s[0] && 0 === s[1]) continue;
                                e = !0;
                            }
                        }
                        if (!e) return;
                    }
                    t.isHorizontal() ? ((d || c || p || u) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1), 
                    ((c || u) && !s || (d || p) && s) && t.slideNext(), ((d || p) && !s || (c || u) && s) && t.slidePrev()) : ((d || c || h || m) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1), 
                    (c || m) && t.slideNext(), (d || h) && t.slidePrev()), n("keyPress", i);
                }
            }
            function p() {
                t.keyboard.enabled || (d(l).on("keydown", c), t.keyboard.enabled = !0);
            }
            function u() {
                t.keyboard.enabled && (d(l).off("keydown", c), t.keyboard.enabled = !1);
            }
            t.keyboard = {
                enabled: !1
            }, s({
                keyboard: {
                    enabled: !1,
                    onlyInViewport: !0,
                    pageUpDown: !0
                }
            }), i("init", (() => {
                t.params.keyboard.enabled && p();
            })), i("destroy", (() => {
                t.keyboard.enabled && u();
            })), Object.assign(t.keyboard, {
                enable: p,
                disable: u
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a, emit: i} = e;
            const n = r();
            let l;
            s({
                mousewheel: {
                    enabled: !1,
                    releaseOnEdges: !1,
                    invert: !1,
                    forceToAxis: !1,
                    sensitivity: 1,
                    eventsTarget: "container",
                    thresholdDelta: null,
                    thresholdTime: null
                }
            }), t.mousewheel = {
                enabled: !1
            };
            let o, c = u();
            const h = [];
            function m() {
                t.enabled && (t.mouseEntered = !0);
            }
            function f() {
                t.enabled && (t.mouseEntered = !1);
            }
            function g(e) {
                return !(t.params.mousewheel.thresholdDelta && e.delta < t.params.mousewheel.thresholdDelta) && !(t.params.mousewheel.thresholdTime && u() - c < t.params.mousewheel.thresholdTime) && (e.delta >= 6 && u() - c < 60 || (e.direction < 0 ? t.isEnd && !t.params.loop || t.animating || (t.slideNext(), 
                i("scroll", e.raw)) : t.isBeginning && !t.params.loop || t.animating || (t.slidePrev(), 
                i("scroll", e.raw)), c = (new n.Date).getTime(), !1));
            }
            function v(e) {
                let s = e, a = !0;
                if (!t.enabled) return;
                const r = t.params.mousewheel;
                t.params.cssMode && s.preventDefault();
                let n = t.$el;
                if ("container" !== t.params.mousewheel.eventsTarget && (n = d(t.params.mousewheel.eventsTarget)), 
                !t.mouseEntered && !n[0].contains(s.target) && !r.releaseOnEdges) return !0;
                s.originalEvent && (s = s.originalEvent);
                let c = 0;
                const m = t.rtlTranslate ? -1 : 1, f = function(e) {
                    let t = 0, s = 0, a = 0, i = 0;
                    return "detail" in e && (s = e.detail), "wheelDelta" in e && (s = -e.wheelDelta / 120), 
                    "wheelDeltaY" in e && (s = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120), 
                    "axis" in e && e.axis === e.HORIZONTAL_AXIS && (t = s, s = 0), a = 10 * t, i = 10 * s, 
                    "deltaY" in e && (i = e.deltaY), "deltaX" in e && (a = e.deltaX), e.shiftKey && !a && (a = i, 
                    i = 0), (a || i) && e.deltaMode && (1 === e.deltaMode ? (a *= 40, i *= 40) : (a *= 800, 
                    i *= 800)), a && !t && (t = a < 1 ? -1 : 1), i && !s && (s = i < 1 ? -1 : 1), {
                        spinX: t,
                        spinY: s,
                        pixelX: a,
                        pixelY: i
                    };
                }(s);
                if (r.forceToAxis) if (t.isHorizontal()) {
                    if (!(Math.abs(f.pixelX) > Math.abs(f.pixelY))) return !0;
                    c = -f.pixelX * m;
                } else {
                    if (!(Math.abs(f.pixelY) > Math.abs(f.pixelX))) return !0;
                    c = -f.pixelY;
                } else c = Math.abs(f.pixelX) > Math.abs(f.pixelY) ? -f.pixelX * m : -f.pixelY;
                if (0 === c) return !0;
                r.invert && (c = -c);
                let v = t.getTranslate() + c * r.sensitivity;
                if (v >= t.minTranslate() && (v = t.minTranslate()), v <= t.maxTranslate() && (v = t.maxTranslate()), 
                a = !!t.params.loop || !(v === t.minTranslate() || v === t.maxTranslate()), a && t.params.nested && s.stopPropagation(), 
                t.params.freeMode && t.params.freeMode.enabled) {
                    const e = {
                        time: u(),
                        delta: Math.abs(c),
                        direction: Math.sign(c)
                    }, a = o && e.time < o.time + 500 && e.delta <= o.delta && e.direction === o.direction;
                    if (!a) {
                        o = void 0, t.params.loop && t.loopFix();
                        let n = t.getTranslate() + c * r.sensitivity;
                        const d = t.isBeginning, u = t.isEnd;
                        if (n >= t.minTranslate() && (n = t.minTranslate()), n <= t.maxTranslate() && (n = t.maxTranslate()), 
                        t.setTransition(0), t.setTranslate(n), t.updateProgress(), t.updateActiveIndex(), 
                        t.updateSlidesClasses(), (!d && t.isBeginning || !u && t.isEnd) && t.updateSlidesClasses(), 
                        t.params.freeMode.sticky) {
                            clearTimeout(l), l = void 0, h.length >= 15 && h.shift();
                            const s = h.length ? h[h.length - 1] : void 0, a = h[0];
                            if (h.push(e), s && (e.delta > s.delta || e.direction !== s.direction)) h.splice(0); else if (h.length >= 15 && e.time - a.time < 500 && a.delta - e.delta >= 1 && e.delta <= 6) {
                                const s = c > 0 ? .8 : .2;
                                o = e, h.splice(0), l = p((() => {
                                    t.slideToClosest(t.params.speed, !0, void 0, s);
                                }), 0);
                            }
                            l || (l = p((() => {
                                o = e, h.splice(0), t.slideToClosest(t.params.speed, !0, void 0, .5);
                            }), 500));
                        }
                        if (a || i("scroll", s), t.params.autoplay && t.params.autoplayDisableOnInteraction && t.autoplay.stop(), 
                        n === t.minTranslate() || n === t.maxTranslate()) return !0;
                    }
                } else {
                    const s = {
                        time: u(),
                        delta: Math.abs(c),
                        direction: Math.sign(c),
                        raw: e
                    };
                    h.length >= 2 && h.shift();
                    const a = h.length ? h[h.length - 1] : void 0;
                    if (h.push(s), a ? (s.direction !== a.direction || s.delta > a.delta || s.time > a.time + 150) && g(s) : g(s), 
                    function(e) {
                        const s = t.params.mousewheel;
                        if (e.direction < 0) {
                            if (t.isEnd && !t.params.loop && s.releaseOnEdges) return !0;
                        } else if (t.isBeginning && !t.params.loop && s.releaseOnEdges) return !0;
                        return !1;
                    }(s)) return !0;
                }
                return s.preventDefault ? s.preventDefault() : s.returnValue = !1, !1;
            }
            function w(e) {
                let s = t.$el;
                "container" !== t.params.mousewheel.eventsTarget && (s = d(t.params.mousewheel.eventsTarget)), 
                s[e]("mouseenter", m), s[e]("mouseleave", f), s[e]("wheel", v);
            }
            function b() {
                return t.params.cssMode ? (t.wrapperEl.removeEventListener("wheel", v), !0) : !t.mousewheel.enabled && (w("on"), 
                t.mousewheel.enabled = !0, !0);
            }
            function x() {
                return t.params.cssMode ? (t.wrapperEl.addEventListener(event, v), !0) : !!t.mousewheel.enabled && (w("off"), 
                t.mousewheel.enabled = !1, !0);
            }
            a("init", (() => {
                !t.params.mousewheel.enabled && t.params.cssMode && x(), t.params.mousewheel.enabled && b();
            })), a("destroy", (() => {
                t.params.cssMode && b(), t.mousewheel.enabled && x();
            })), Object.assign(t.mousewheel, {
                enable: b,
                disable: x
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a, emit: i} = e;
            function r(e) {
                let s;
                return e && (s = d(e), t.params.uniqueNavElements && "string" == typeof e && s.length > 1 && 1 === t.$el.find(e).length && (s = t.$el.find(e))), 
                s;
            }
            function n(e, s) {
                const a = t.params.navigation;
                e && e.length > 0 && (e[s ? "addClass" : "removeClass"](a.disabledClass), e[0] && "BUTTON" === e[0].tagName && (e[0].disabled = s), 
                t.params.watchOverflow && t.enabled && e[t.isLocked ? "addClass" : "removeClass"](a.lockClass));
            }
            function l() {
                if (t.params.loop) return;
                const {$nextEl: e, $prevEl: s} = t.navigation;
                n(s, t.isBeginning && !t.params.rewind), n(e, t.isEnd && !t.params.rewind);
            }
            function o(e) {
                e.preventDefault(), (!t.isBeginning || t.params.loop || t.params.rewind) && (t.slidePrev(), 
                i("navigationPrev"));
            }
            function c(e) {
                e.preventDefault(), (!t.isEnd || t.params.loop || t.params.rewind) && (t.slideNext(), 
                i("navigationNext"));
            }
            function p() {
                const e = t.params.navigation;
                if (t.params.navigation = F(t, t.originalParams.navigation, t.params.navigation, {
                    nextEl: "swiper-button-next",
                    prevEl: "swiper-button-prev"
                }), !e.nextEl && !e.prevEl) return;
                const s = r(e.nextEl), a = r(e.prevEl);
                s && s.length > 0 && s.on("click", c), a && a.length > 0 && a.on("click", o), Object.assign(t.navigation, {
                    $nextEl: s,
                    nextEl: s && s[0],
                    $prevEl: a,
                    prevEl: a && a[0]
                }), t.enabled || (s && s.addClass(e.lockClass), a && a.addClass(e.lockClass));
            }
            function u() {
                const {$nextEl: e, $prevEl: s} = t.navigation;
                e && e.length && (e.off("click", c), e.removeClass(t.params.navigation.disabledClass)), 
                s && s.length && (s.off("click", o), s.removeClass(t.params.navigation.disabledClass));
            }
            s({
                navigation: {
                    nextEl: null,
                    prevEl: null,
                    hideOnClick: !1,
                    disabledClass: "swiper-button-disabled",
                    hiddenClass: "swiper-button-hidden",
                    lockClass: "swiper-button-lock",
                    navigationDisabledClass: "swiper-navigation-disabled"
                }
            }), t.navigation = {
                nextEl: null,
                $nextEl: null,
                prevEl: null,
                $prevEl: null
            }, a("init", (() => {
                !1 === t.params.navigation.enabled ? h() : (p(), l());
            })), a("toEdge fromEdge lock unlock", (() => {
                l();
            })), a("destroy", (() => {
                u();
            })), a("enable disable", (() => {
                const {$nextEl: e, $prevEl: s} = t.navigation;
                e && e[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass), s && s[t.enabled ? "removeClass" : "addClass"](t.params.navigation.lockClass);
            })), a("click", ((e, s) => {
                const {$nextEl: a, $prevEl: r} = t.navigation, n = s.target;
                if (t.params.navigation.hideOnClick && !d(n).is(r) && !d(n).is(a)) {
                    if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === n || t.pagination.el.contains(n))) return;
                    let e;
                    a ? e = a.hasClass(t.params.navigation.hiddenClass) : r && (e = r.hasClass(t.params.navigation.hiddenClass)), 
                    i(!0 === e ? "navigationShow" : "navigationHide"), a && a.toggleClass(t.params.navigation.hiddenClass), 
                    r && r.toggleClass(t.params.navigation.hiddenClass);
                }
            }));
            const h = () => {
                t.$el.addClass(t.params.navigation.navigationDisabledClass), u();
            };
            Object.assign(t.navigation, {
                enable: () => {
                    t.$el.removeClass(t.params.navigation.navigationDisabledClass), p(), l();
                },
                disable: h,
                update: l,
                init: p,
                destroy: u
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a, emit: i} = e;
            const r = "swiper-pagination";
            let n;
            s({
                pagination: {
                    el: null,
                    bulletElement: "span",
                    clickable: !1,
                    hideOnClick: !1,
                    renderBullet: null,
                    renderProgressbar: null,
                    renderFraction: null,
                    renderCustom: null,
                    progressbarOpposite: !1,
                    type: "bullets",
                    dynamicBullets: !1,
                    dynamicMainBullets: 1,
                    formatFractionCurrent: e => e,
                    formatFractionTotal: e => e,
                    bulletClass: `${r}-bullet`,
                    bulletActiveClass: `${r}-bullet-active`,
                    modifierClass: `${r}-`,
                    currentClass: `${r}-current`,
                    totalClass: `${r}-total`,
                    hiddenClass: `${r}-hidden`,
                    progressbarFillClass: `${r}-progressbar-fill`,
                    progressbarOppositeClass: `${r}-progressbar-opposite`,
                    clickableClass: `${r}-clickable`,
                    lockClass: `${r}-lock`,
                    horizontalClass: `${r}-horizontal`,
                    verticalClass: `${r}-vertical`,
                    paginationDisabledClass: `${r}-disabled`
                }
            }), t.pagination = {
                el: null,
                $el: null,
                bullets: []
            };
            let l = 0;
            function o() {
                return !t.params.pagination.el || !t.pagination.el || !t.pagination.$el || 0 === t.pagination.$el.length;
            }
            function c(e, s) {
                const {bulletActiveClass: a} = t.params.pagination;
                e[s]().addClass(`${a}-${s}`)[s]().addClass(`${a}-${s}-${s}`);
            }
            function p() {
                const e = t.rtl, s = t.params.pagination;
                if (o()) return;
                const a = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length, r = t.pagination.$el;
                let p;
                const u = t.params.loop ? Math.ceil((a - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
                if (t.params.loop ? (p = Math.ceil((t.activeIndex - t.loopedSlides) / t.params.slidesPerGroup), 
                p > a - 1 - 2 * t.loopedSlides && (p -= a - 2 * t.loopedSlides), p > u - 1 && (p -= u), 
                p < 0 && "bullets" !== t.params.paginationType && (p = u + p)) : p = void 0 !== t.snapIndex ? t.snapIndex : t.activeIndex || 0, 
                "bullets" === s.type && t.pagination.bullets && t.pagination.bullets.length > 0) {
                    const a = t.pagination.bullets;
                    let i, o, u;
                    if (s.dynamicBullets && (n = a.eq(0)[t.isHorizontal() ? "outerWidth" : "outerHeight"](!0), 
                    r.css(t.isHorizontal() ? "width" : "height", n * (s.dynamicMainBullets + 4) + "px"), 
                    s.dynamicMainBullets > 1 && void 0 !== t.previousIndex && (l += p - (t.previousIndex - t.loopedSlides || 0), 
                    l > s.dynamicMainBullets - 1 ? l = s.dynamicMainBullets - 1 : l < 0 && (l = 0)), 
                    i = Math.max(p - l, 0), o = i + (Math.min(a.length, s.dynamicMainBullets) - 1), 
                    u = (o + i) / 2), a.removeClass([ "", "-next", "-next-next", "-prev", "-prev-prev", "-main" ].map((e => `${s.bulletActiveClass}${e}`)).join(" ")), 
                    r.length > 1) a.each((e => {
                        const t = d(e), a = t.index();
                        a === p && t.addClass(s.bulletActiveClass), s.dynamicBullets && (a >= i && a <= o && t.addClass(`${s.bulletActiveClass}-main`), 
                        a === i && c(t, "prev"), a === o && c(t, "next"));
                    })); else {
                        const e = a.eq(p), r = e.index();
                        if (e.addClass(s.bulletActiveClass), s.dynamicBullets) {
                            const e = a.eq(i), n = a.eq(o);
                            for (let e = i; e <= o; e += 1) a.eq(e).addClass(`${s.bulletActiveClass}-main`);
                            if (t.params.loop) if (r >= a.length) {
                                for (let e = s.dynamicMainBullets; e >= 0; e -= 1) a.eq(a.length - e).addClass(`${s.bulletActiveClass}-main`);
                                a.eq(a.length - s.dynamicMainBullets - 1).addClass(`${s.bulletActiveClass}-prev`);
                            } else c(e, "prev"), c(n, "next"); else c(e, "prev"), c(n, "next");
                        }
                    }
                    if (s.dynamicBullets) {
                        const i = Math.min(a.length, s.dynamicMainBullets + 4), r = (n * i - n) / 2 - u * n, l = e ? "right" : "left";
                        a.css(t.isHorizontal() ? l : "top", `${r}px`);
                    }
                }
                if ("fraction" === s.type && (r.find(U(s.currentClass)).text(s.formatFractionCurrent(p + 1)), 
                r.find(U(s.totalClass)).text(s.formatFractionTotal(u))), "progressbar" === s.type) {
                    let e;
                    e = s.progressbarOpposite ? t.isHorizontal() ? "vertical" : "horizontal" : t.isHorizontal() ? "horizontal" : "vertical";
                    const a = (p + 1) / u;
                    let i = 1, n = 1;
                    "horizontal" === e ? i = a : n = a, r.find(U(s.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${i}) scaleY(${n})`).transition(t.params.speed);
                }
                "custom" === s.type && s.renderCustom ? (r.html(s.renderCustom(t, p + 1, u)), i("paginationRender", r[0])) : i("paginationUpdate", r[0]), 
                t.params.watchOverflow && t.enabled && r[t.isLocked ? "addClass" : "removeClass"](s.lockClass);
            }
            function u() {
                const e = t.params.pagination;
                if (o()) return;
                const s = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length, a = t.pagination.$el;
                let r = "";
                if ("bullets" === e.type) {
                    let i = t.params.loop ? Math.ceil((s - 2 * t.loopedSlides) / t.params.slidesPerGroup) : t.snapGrid.length;
                    t.params.freeMode && t.params.freeMode.enabled && !t.params.loop && i > s && (i = s);
                    for (let s = 0; s < i; s += 1) e.renderBullet ? r += e.renderBullet.call(t, s, e.bulletClass) : r += `<${e.bulletElement} class="${e.bulletClass}"></${e.bulletElement}>`;
                    a.html(r), t.pagination.bullets = a.find(U(e.bulletClass));
                }
                "fraction" === e.type && (r = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`, 
                a.html(r)), "progressbar" === e.type && (r = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`, 
                a.html(r)), "custom" !== e.type && i("paginationRender", t.pagination.$el[0]);
            }
            function h() {
                t.params.pagination = F(t, t.originalParams.pagination, t.params.pagination, {
                    el: "swiper-pagination"
                });
                const e = t.params.pagination;
                if (!e.el) return;
                let s = d(e.el);
                0 !== s.length && (t.params.uniqueNavElements && "string" == typeof e.el && s.length > 1 && (s = t.$el.find(e.el), 
                s.length > 1 && (s = s.filter((e => d(e).parents(".swiper")[0] === t.el)))), "bullets" === e.type && e.clickable && s.addClass(e.clickableClass), 
                s.addClass(e.modifierClass + e.type), s.addClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass), 
                "bullets" === e.type && e.dynamicBullets && (s.addClass(`${e.modifierClass}${e.type}-dynamic`), 
                l = 0, e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)), "progressbar" === e.type && e.progressbarOpposite && s.addClass(e.progressbarOppositeClass), 
                e.clickable && s.on("click", U(e.bulletClass), (function(e) {
                    e.preventDefault();
                    let s = d(this).index() * t.params.slidesPerGroup;
                    t.params.loop && (s += t.loopedSlides), t.slideTo(s);
                })), Object.assign(t.pagination, {
                    $el: s,
                    el: s[0]
                }), t.enabled || s.addClass(e.lockClass));
            }
            function m() {
                const e = t.params.pagination;
                if (o()) return;
                const s = t.pagination.$el;
                s.removeClass(e.hiddenClass), s.removeClass(e.modifierClass + e.type), s.removeClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass), 
                t.pagination.bullets && t.pagination.bullets.removeClass && t.pagination.bullets.removeClass(e.bulletActiveClass), 
                e.clickable && s.off("click", U(e.bulletClass));
            }
            a("init", (() => {
                !1 === t.params.pagination.enabled ? f() : (h(), u(), p());
            })), a("activeIndexChange", (() => {
                (t.params.loop || void 0 === t.snapIndex) && p();
            })), a("snapIndexChange", (() => {
                t.params.loop || p();
            })), a("slidesLengthChange", (() => {
                t.params.loop && (u(), p());
            })), a("snapGridLengthChange", (() => {
                t.params.loop || (u(), p());
            })), a("destroy", (() => {
                m();
            })), a("enable disable", (() => {
                const {$el: e} = t.pagination;
                e && e[t.enabled ? "removeClass" : "addClass"](t.params.pagination.lockClass);
            })), a("lock unlock", (() => {
                p();
            })), a("click", ((e, s) => {
                const a = s.target, {$el: r} = t.pagination;
                if (t.params.pagination.el && t.params.pagination.hideOnClick && r && r.length > 0 && !d(a).hasClass(t.params.pagination.bulletClass)) {
                    if (t.navigation && (t.navigation.nextEl && a === t.navigation.nextEl || t.navigation.prevEl && a === t.navigation.prevEl)) return;
                    const e = r.hasClass(t.params.pagination.hiddenClass);
                    i(!0 === e ? "paginationShow" : "paginationHide"), r.toggleClass(t.params.pagination.hiddenClass);
                }
            }));
            const f = () => {
                t.$el.addClass(t.params.pagination.paginationDisabledClass), t.pagination.$el && t.pagination.$el.addClass(t.params.pagination.paginationDisabledClass), 
                m();
            };
            Object.assign(t.pagination, {
                enable: () => {
                    t.$el.removeClass(t.params.pagination.paginationDisabledClass), t.pagination.$el && t.pagination.$el.removeClass(t.params.pagination.paginationDisabledClass), 
                    h(), u(), p();
                },
                disable: f,
                render: u,
                update: p,
                init: h,
                destroy: m
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: i, emit: r} = e;
            const n = a();
            let l, o, c, u, h = !1, m = null, f = null;
            function g() {
                if (!t.params.scrollbar.el || !t.scrollbar.el) return;
                const {scrollbar: e, rtlTranslate: s, progress: a} = t, {$dragEl: i, $el: r} = e, n = t.params.scrollbar;
                let l = o, d = (c - o) * a;
                s ? (d = -d, d > 0 ? (l = o - d, d = 0) : -d + o > c && (l = c + d)) : d < 0 ? (l = o + d, 
                d = 0) : d + o > c && (l = c - d), t.isHorizontal() ? (i.transform(`translate3d(${d}px, 0, 0)`), 
                i[0].style.width = `${l}px`) : (i.transform(`translate3d(0px, ${d}px, 0)`), i[0].style.height = `${l}px`), 
                n.hide && (clearTimeout(m), r[0].style.opacity = 1, m = setTimeout((() => {
                    r[0].style.opacity = 0, r.transition(400);
                }), 1e3));
            }
            function v() {
                if (!t.params.scrollbar.el || !t.scrollbar.el) return;
                const {scrollbar: e} = t, {$dragEl: s, $el: a} = e;
                s[0].style.width = "", s[0].style.height = "", c = t.isHorizontal() ? a[0].offsetWidth : a[0].offsetHeight, 
                u = t.size / (t.virtualSize + t.params.slidesOffsetBefore - (t.params.centeredSlides ? t.snapGrid[0] : 0)), 
                o = "auto" === t.params.scrollbar.dragSize ? c * u : parseInt(t.params.scrollbar.dragSize, 10), 
                t.isHorizontal() ? s[0].style.width = `${o}px` : s[0].style.height = `${o}px`, a[0].style.display = u >= 1 ? "none" : "", 
                t.params.scrollbar.hide && (a[0].style.opacity = 0), t.params.watchOverflow && t.enabled && e.$el[t.isLocked ? "addClass" : "removeClass"](t.params.scrollbar.lockClass);
            }
            function w(e) {
                return t.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientX : e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].clientY : e.clientY;
            }
            function b(e) {
                const {scrollbar: s, rtlTranslate: a} = t, {$el: i} = s;
                let r;
                r = (w(e) - i.offset()[t.isHorizontal() ? "left" : "top"] - (null !== l ? l : o / 2)) / (c - o), 
                r = Math.max(Math.min(r, 1), 0), a && (r = 1 - r);
                const n = t.minTranslate() + (t.maxTranslate() - t.minTranslate()) * r;
                t.updateProgress(n), t.setTranslate(n), t.updateActiveIndex(), t.updateSlidesClasses();
            }
            function x(e) {
                const s = t.params.scrollbar, {scrollbar: a, $wrapperEl: i} = t, {$el: n, $dragEl: o} = a;
                h = !0, l = e.target === o[0] || e.target === o ? w(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null, 
                e.preventDefault(), e.stopPropagation(), i.transition(100), o.transition(100), b(e), 
                clearTimeout(f), n.transition(0), s.hide && n.css("opacity", 1), t.params.cssMode && t.$wrapperEl.css("scroll-snap-type", "none"), 
                r("scrollbarDragStart", e);
            }
            function y(e) {
                const {scrollbar: s, $wrapperEl: a} = t, {$el: i, $dragEl: n} = s;
                h && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, b(e), a.transition(0), 
                i.transition(0), n.transition(0), r("scrollbarDragMove", e));
            }
            function E(e) {
                const s = t.params.scrollbar, {scrollbar: a, $wrapperEl: i} = t, {$el: n} = a;
                h && (h = !1, t.params.cssMode && (t.$wrapperEl.css("scroll-snap-type", ""), i.transition("")), 
                s.hide && (clearTimeout(f), f = p((() => {
                    n.css("opacity", 0), n.transition(400);
                }), 1e3)), r("scrollbarDragEnd", e), s.snapOnRelease && t.slideToClosest());
            }
            function C(e) {
                const {scrollbar: s, touchEventsTouch: a, touchEventsDesktop: i, params: r, support: l} = t, o = s.$el;
                if (!o) return;
                const d = o[0], c = !(!l.passiveListener || !r.passiveListeners) && {
                    passive: !1,
                    capture: !1
                }, p = !(!l.passiveListener || !r.passiveListeners) && {
                    passive: !0,
                    capture: !1
                };
                if (!d) return;
                const u = "on" === e ? "addEventListener" : "removeEventListener";
                l.touch ? (d[u](a.start, x, c), d[u](a.move, y, c), d[u](a.end, E, p)) : (d[u](i.start, x, c), 
                n[u](i.move, y, c), n[u](i.end, E, p));
            }
            function T() {
                const {scrollbar: e, $el: s} = t;
                t.params.scrollbar = F(t, t.originalParams.scrollbar, t.params.scrollbar, {
                    el: "swiper-scrollbar"
                });
                const a = t.params.scrollbar;
                if (!a.el) return;
                let i = d(a.el);
                t.params.uniqueNavElements && "string" == typeof a.el && i.length > 1 && 1 === s.find(a.el).length && (i = s.find(a.el)), 
                i.addClass(t.isHorizontal() ? a.horizontalClass : a.verticalClass);
                let r = i.find(`.${t.params.scrollbar.dragClass}`);
                0 === r.length && (r = d(`<div class="${t.params.scrollbar.dragClass}"></div>`), 
                i.append(r)), Object.assign(e, {
                    $el: i,
                    el: i[0],
                    $dragEl: r,
                    dragEl: r[0]
                }), a.draggable && t.params.scrollbar.el && t.scrollbar.el && C("on"), i && i[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass);
            }
            function $() {
                const e = t.params.scrollbar, s = t.scrollbar.$el;
                s && s.removeClass(t.isHorizontal() ? e.horizontalClass : e.verticalClass), t.params.scrollbar.el && t.scrollbar.el && C("off");
            }
            s({
                scrollbar: {
                    el: null,
                    dragSize: "auto",
                    hide: !1,
                    draggable: !1,
                    snapOnRelease: !0,
                    lockClass: "swiper-scrollbar-lock",
                    dragClass: "swiper-scrollbar-drag",
                    scrollbarDisabledClass: "swiper-scrollbar-disabled",
                    horizontalClass: "swiper-scrollbar-horizontal",
                    verticalClass: "swiper-scrollbar-vertical"
                }
            }), t.scrollbar = {
                el: null,
                dragEl: null,
                $el: null,
                $dragEl: null
            }, i("init", (() => {
                !1 === t.params.scrollbar.enabled ? S() : (T(), v(), g());
            })), i("update resize observerUpdate lock unlock", (() => {
                v();
            })), i("setTranslate", (() => {
                g();
            })), i("setTransition", ((e, s) => {
                !function(e) {
                    t.params.scrollbar.el && t.scrollbar.el && t.scrollbar.$dragEl.transition(e);
                }(s);
            })), i("enable disable", (() => {
                const {$el: e} = t.scrollbar;
                e && e[t.enabled ? "removeClass" : "addClass"](t.params.scrollbar.lockClass);
            })), i("destroy", (() => {
                $();
            }));
            const S = () => {
                t.$el.addClass(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.$el && t.scrollbar.$el.addClass(t.params.scrollbar.scrollbarDisabledClass), 
                $();
            };
            Object.assign(t.scrollbar, {
                enable: () => {
                    t.$el.removeClass(t.params.scrollbar.scrollbarDisabledClass), t.scrollbar.$el && t.scrollbar.$el.removeClass(t.params.scrollbar.scrollbarDisabledClass), 
                    T(), v(), g();
                },
                disable: S,
                updateSize: v,
                setTranslate: g,
                init: T,
                destroy: $
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                parallax: {
                    enabled: !1
                }
            });
            const i = (e, s) => {
                const {rtl: a} = t, i = d(e), r = a ? -1 : 1, n = i.attr("data-swiper-parallax") || "0";
                let l = i.attr("data-swiper-parallax-x"), o = i.attr("data-swiper-parallax-y");
                const c = i.attr("data-swiper-parallax-scale"), p = i.attr("data-swiper-parallax-opacity");
                if (l || o ? (l = l || "0", o = o || "0") : t.isHorizontal() ? (l = n, o = "0") : (o = n, 
                l = "0"), l = l.indexOf("%") >= 0 ? parseInt(l, 10) * s * r + "%" : l * s * r + "px", 
                o = o.indexOf("%") >= 0 ? parseInt(o, 10) * s + "%" : o * s + "px", null != p) {
                    const e = p - (p - 1) * (1 - Math.abs(s));
                    i[0].style.opacity = e;
                }
                if (null == c) i.transform(`translate3d(${l}, ${o}, 0px)`); else {
                    const e = c - (c - 1) * (1 - Math.abs(s));
                    i.transform(`translate3d(${l}, ${o}, 0px) scale(${e})`);
                }
            }, r = () => {
                const {$el: e, slides: s, progress: a, snapGrid: r} = t;
                e.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((e => {
                    i(e, a);
                })), s.each(((e, s) => {
                    let n = e.progress;
                    t.params.slidesPerGroup > 1 && "auto" !== t.params.slidesPerView && (n += Math.ceil(s / 2) - a * (r.length - 1)), 
                    n = Math.min(Math.max(n, -1), 1), d(e).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((e => {
                        i(e, n);
                    }));
                }));
            };
            a("beforeInit", (() => {
                t.params.parallax.enabled && (t.params.watchSlidesProgress = !0, t.originalParams.watchSlidesProgress = !0);
            })), a("init", (() => {
                t.params.parallax.enabled && r();
            })), a("setTranslate", (() => {
                t.params.parallax.enabled && r();
            })), a("setTransition", ((e, s) => {
                t.params.parallax.enabled && function(e) {
                    void 0 === e && (e = t.params.speed);
                    const {$el: s} = t;
                    s.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((t => {
                        const s = d(t);
                        let a = parseInt(s.attr("data-swiper-parallax-duration"), 10) || e;
                        0 === e && (a = 0), s.transition(a);
                    }));
                }(s);
            }));
        }, function(e) {
            let {swiper: t, extendParams: s, on: a, emit: i} = e;
            const n = r();
            s({
                zoom: {
                    enabled: !1,
                    maxRatio: 3,
                    minRatio: 1,
                    toggle: !0,
                    containerClass: "swiper-zoom-container",
                    zoomedSlideClass: "swiper-slide-zoomed"
                }
            }), t.zoom = {
                enabled: !1
            };
            let l, o, c, p = 1, u = !1;
            const m = {
                $slideEl: void 0,
                slideWidth: void 0,
                slideHeight: void 0,
                $imageEl: void 0,
                $imageWrapEl: void 0,
                maxRatio: 3
            }, f = {
                isTouched: void 0,
                isMoved: void 0,
                currentX: void 0,
                currentY: void 0,
                minX: void 0,
                minY: void 0,
                maxX: void 0,
                maxY: void 0,
                width: void 0,
                height: void 0,
                startX: void 0,
                startY: void 0,
                touchesStart: {},
                touchesCurrent: {}
            }, g = {
                x: void 0,
                y: void 0,
                prevPositionX: void 0,
                prevPositionY: void 0,
                prevTime: void 0
            };
            let v = 1;
            function w(e) {
                if (e.targetTouches.length < 2) return 1;
                const t = e.targetTouches[0].pageX, s = e.targetTouches[0].pageY, a = e.targetTouches[1].pageX, i = e.targetTouches[1].pageY;
                return Math.sqrt((a - t) ** 2 + (i - s) ** 2);
            }
            function b(e) {
                const s = t.support, a = t.params.zoom;
                if (o = !1, c = !1, !s.gestures) {
                    if ("touchstart" !== e.type || "touchstart" === e.type && e.targetTouches.length < 2) return;
                    o = !0, m.scaleStart = w(e);
                }
                m.$slideEl && m.$slideEl.length || (m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`), 
                0 === m.$slideEl.length && (m.$slideEl = t.slides.eq(t.activeIndex)), m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0), 
                m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`), m.maxRatio = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio, 
                0 !== m.$imageWrapEl.length) ? (m.$imageEl && m.$imageEl.transition(0), u = !0) : m.$imageEl = void 0;
            }
            function x(e) {
                const s = t.support, a = t.params.zoom, i = t.zoom;
                if (!s.gestures) {
                    if ("touchmove" !== e.type || "touchmove" === e.type && e.targetTouches.length < 2) return;
                    c = !0, m.scaleMove = w(e);
                }
                m.$imageEl && 0 !== m.$imageEl.length ? (s.gestures ? i.scale = e.scale * p : i.scale = m.scaleMove / m.scaleStart * p, 
                i.scale > m.maxRatio && (i.scale = m.maxRatio - 1 + (i.scale - m.maxRatio + 1) ** .5), 
                i.scale < a.minRatio && (i.scale = a.minRatio + 1 - (a.minRatio - i.scale + 1) ** .5), 
                m.$imageEl.transform(`translate3d(0,0,0) scale(${i.scale})`)) : "gesturechange" === e.type && b(e);
            }
            function y(e) {
                const s = t.device, a = t.support, i = t.params.zoom, r = t.zoom;
                if (!a.gestures) {
                    if (!o || !c) return;
                    if ("touchend" !== e.type || "touchend" === e.type && e.changedTouches.length < 2 && !s.android) return;
                    o = !1, c = !1;
                }
                m.$imageEl && 0 !== m.$imageEl.length && (r.scale = Math.max(Math.min(r.scale, m.maxRatio), i.minRatio), 
                m.$imageEl.transition(t.params.speed).transform(`translate3d(0,0,0) scale(${r.scale})`), 
                p = r.scale, u = !1, 1 === r.scale && (m.$slideEl = void 0));
            }
            function E(e) {
                const s = t.zoom;
                if (!m.$imageEl || 0 === m.$imageEl.length) return;
                if (t.allowClick = !1, !f.isTouched || !m.$slideEl) return;
                f.isMoved || (f.width = m.$imageEl[0].offsetWidth, f.height = m.$imageEl[0].offsetHeight, 
                f.startX = h(m.$imageWrapEl[0], "x") || 0, f.startY = h(m.$imageWrapEl[0], "y") || 0, 
                m.slideWidth = m.$slideEl[0].offsetWidth, m.slideHeight = m.$slideEl[0].offsetHeight, 
                m.$imageWrapEl.transition(0));
                const a = f.width * s.scale, i = f.height * s.scale;
                if (!(a < m.slideWidth && i < m.slideHeight)) {
                    if (f.minX = Math.min(m.slideWidth / 2 - a / 2, 0), f.maxX = -f.minX, f.minY = Math.min(m.slideHeight / 2 - i / 2, 0), 
                    f.maxY = -f.minY, f.touchesCurrent.x = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, 
                    f.touchesCurrent.y = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, 
                    !f.isMoved && !u) {
                        if (t.isHorizontal() && (Math.floor(f.minX) === Math.floor(f.startX) && f.touchesCurrent.x < f.touchesStart.x || Math.floor(f.maxX) === Math.floor(f.startX) && f.touchesCurrent.x > f.touchesStart.x)) return void (f.isTouched = !1);
                        if (!t.isHorizontal() && (Math.floor(f.minY) === Math.floor(f.startY) && f.touchesCurrent.y < f.touchesStart.y || Math.floor(f.maxY) === Math.floor(f.startY) && f.touchesCurrent.y > f.touchesStart.y)) return void (f.isTouched = !1);
                    }
                    e.cancelable && e.preventDefault(), e.stopPropagation(), f.isMoved = !0, f.currentX = f.touchesCurrent.x - f.touchesStart.x + f.startX, 
                    f.currentY = f.touchesCurrent.y - f.touchesStart.y + f.startY, f.currentX < f.minX && (f.currentX = f.minX + 1 - (f.minX - f.currentX + 1) ** .8), 
                    f.currentX > f.maxX && (f.currentX = f.maxX - 1 + (f.currentX - f.maxX + 1) ** .8), 
                    f.currentY < f.minY && (f.currentY = f.minY + 1 - (f.minY - f.currentY + 1) ** .8), 
                    f.currentY > f.maxY && (f.currentY = f.maxY - 1 + (f.currentY - f.maxY + 1) ** .8), 
                    g.prevPositionX || (g.prevPositionX = f.touchesCurrent.x), g.prevPositionY || (g.prevPositionY = f.touchesCurrent.y), 
                    g.prevTime || (g.prevTime = Date.now()), g.x = (f.touchesCurrent.x - g.prevPositionX) / (Date.now() - g.prevTime) / 2, 
                    g.y = (f.touchesCurrent.y - g.prevPositionY) / (Date.now() - g.prevTime) / 2, Math.abs(f.touchesCurrent.x - g.prevPositionX) < 2 && (g.x = 0), 
                    Math.abs(f.touchesCurrent.y - g.prevPositionY) < 2 && (g.y = 0), g.prevPositionX = f.touchesCurrent.x, 
                    g.prevPositionY = f.touchesCurrent.y, g.prevTime = Date.now(), m.$imageWrapEl.transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`);
                }
            }
            function C() {
                const e = t.zoom;
                m.$slideEl && t.previousIndex !== t.activeIndex && (m.$imageEl && m.$imageEl.transform("translate3d(0,0,0) scale(1)"), 
                m.$imageWrapEl && m.$imageWrapEl.transform("translate3d(0,0,0)"), e.scale = 1, p = 1, 
                m.$slideEl = void 0, m.$imageEl = void 0, m.$imageWrapEl = void 0);
            }
            function T(e) {
                const s = t.zoom, a = t.params.zoom;
                if (m.$slideEl || (e && e.target && (m.$slideEl = d(e.target).closest(`.${t.params.slideClass}`)), 
                m.$slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`) : m.$slideEl = t.slides.eq(t.activeIndex)), 
                m.$imageEl = m.$slideEl.find(`.${a.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0), 
                m.$imageWrapEl = m.$imageEl.parent(`.${a.containerClass}`)), !m.$imageEl || 0 === m.$imageEl.length || !m.$imageWrapEl || 0 === m.$imageWrapEl.length) return;
                let i, r, l, o, c, u, h, g, v, w, b, x, y, E, C, T, $, S;
                t.params.cssMode && (t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.touchAction = "none"), 
                m.$slideEl.addClass(`${a.zoomedSlideClass}`), void 0 === f.touchesStart.x && e ? (i = "touchend" === e.type ? e.changedTouches[0].pageX : e.pageX, 
                r = "touchend" === e.type ? e.changedTouches[0].pageY : e.pageY) : (i = f.touchesStart.x, 
                r = f.touchesStart.y), s.scale = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio, 
                p = m.$imageWrapEl.attr("data-swiper-zoom") || a.maxRatio, e ? ($ = m.$slideEl[0].offsetWidth, 
                S = m.$slideEl[0].offsetHeight, l = m.$slideEl.offset().left + n.scrollX, o = m.$slideEl.offset().top + n.scrollY, 
                c = l + $ / 2 - i, u = o + S / 2 - r, v = m.$imageEl[0].offsetWidth, w = m.$imageEl[0].offsetHeight, 
                b = v * s.scale, x = w * s.scale, y = Math.min($ / 2 - b / 2, 0), E = Math.min(S / 2 - x / 2, 0), 
                C = -y, T = -E, h = c * s.scale, g = u * s.scale, h < y && (h = y), h > C && (h = C), 
                g < E && (g = E), g > T && (g = T)) : (h = 0, g = 0), m.$imageWrapEl.transition(300).transform(`translate3d(${h}px, ${g}px,0)`), 
                m.$imageEl.transition(300).transform(`translate3d(0,0,0) scale(${s.scale})`);
            }
            function $() {
                const e = t.zoom, s = t.params.zoom;
                m.$slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? m.$slideEl = t.$wrapperEl.children(`.${t.params.slideActiveClass}`) : m.$slideEl = t.slides.eq(t.activeIndex), 
                m.$imageEl = m.$slideEl.find(`.${s.containerClass}`).eq(0).find("picture, img, svg, canvas, .swiper-zoom-target").eq(0), 
                m.$imageWrapEl = m.$imageEl.parent(`.${s.containerClass}`)), m.$imageEl && 0 !== m.$imageEl.length && m.$imageWrapEl && 0 !== m.$imageWrapEl.length && (t.params.cssMode && (t.wrapperEl.style.overflow = "", 
                t.wrapperEl.style.touchAction = ""), e.scale = 1, p = 1, m.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"), 
                m.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"), m.$slideEl.removeClass(`${s.zoomedSlideClass}`), 
                m.$slideEl = void 0);
            }
            function S(e) {
                const s = t.zoom;
                s.scale && 1 !== s.scale ? $() : T(e);
            }
            function M() {
                const e = t.support;
                return {
                    passiveListener: !("touchstart" !== t.touchEvents.start || !e.passiveListener || !t.params.passiveListeners) && {
                        passive: !0,
                        capture: !1
                    },
                    activeListenerWithCapture: !e.passiveListener || {
                        passive: !1,
                        capture: !0
                    }
                };
            }
            function P() {
                return `.${t.params.slideClass}`;
            }
            function k(e) {
                const {passiveListener: s} = M(), a = P();
                t.$wrapperEl[e]("gesturestart", a, b, s), t.$wrapperEl[e]("gesturechange", a, x, s), 
                t.$wrapperEl[e]("gestureend", a, y, s);
            }
            function z() {
                l || (l = !0, k("on"));
            }
            function L() {
                l && (l = !1, k("off"));
            }
            function O() {
                const e = t.zoom;
                if (e.enabled) return;
                e.enabled = !0;
                const s = t.support, {passiveListener: a, activeListenerWithCapture: i} = M(), r = P();
                s.gestures ? (t.$wrapperEl.on(t.touchEvents.start, z, a), t.$wrapperEl.on(t.touchEvents.end, L, a)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.on(t.touchEvents.start, r, b, a), 
                t.$wrapperEl.on(t.touchEvents.move, r, x, i), t.$wrapperEl.on(t.touchEvents.end, r, y, a), 
                t.touchEvents.cancel && t.$wrapperEl.on(t.touchEvents.cancel, r, y, a)), t.$wrapperEl.on(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i);
            }
            function I() {
                const e = t.zoom;
                if (!e.enabled) return;
                const s = t.support;
                e.enabled = !1;
                const {passiveListener: a, activeListenerWithCapture: i} = M(), r = P();
                s.gestures ? (t.$wrapperEl.off(t.touchEvents.start, z, a), t.$wrapperEl.off(t.touchEvents.end, L, a)) : "touchstart" === t.touchEvents.start && (t.$wrapperEl.off(t.touchEvents.start, r, b, a), 
                t.$wrapperEl.off(t.touchEvents.move, r, x, i), t.$wrapperEl.off(t.touchEvents.end, r, y, a), 
                t.touchEvents.cancel && t.$wrapperEl.off(t.touchEvents.cancel, r, y, a)), t.$wrapperEl.off(t.touchEvents.move, `.${t.params.zoom.containerClass}`, E, i);
            }
            Object.defineProperty(t.zoom, "scale", {
                get: () => v,
                set(e) {
                    if (v !== e) {
                        const t = m.$imageEl ? m.$imageEl[0] : void 0, s = m.$slideEl ? m.$slideEl[0] : void 0;
                        i("zoomChange", e, t, s);
                    }
                    v = e;
                }
            }), a("init", (() => {
                t.params.zoom.enabled && O();
            })), a("destroy", (() => {
                I();
            })), a("touchStart", ((e, s) => {
                t.zoom.enabled && function(e) {
                    const s = t.device;
                    m.$imageEl && 0 !== m.$imageEl.length && (f.isTouched || (s.android && e.cancelable && e.preventDefault(), 
                    f.isTouched = !0, f.touchesStart.x = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, 
                    f.touchesStart.y = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY));
                }(s);
            })), a("touchEnd", ((e, s) => {
                t.zoom.enabled && function() {
                    const e = t.zoom;
                    if (!m.$imageEl || 0 === m.$imageEl.length) return;
                    if (!f.isTouched || !f.isMoved) return f.isTouched = !1, void (f.isMoved = !1);
                    f.isTouched = !1, f.isMoved = !1;
                    let s = 300, a = 300;
                    const i = g.x * s, r = f.currentX + i, n = g.y * a, l = f.currentY + n;
                    0 !== g.x && (s = Math.abs((r - f.currentX) / g.x)), 0 !== g.y && (a = Math.abs((l - f.currentY) / g.y));
                    const o = Math.max(s, a);
                    f.currentX = r, f.currentY = l;
                    const d = f.width * e.scale, c = f.height * e.scale;
                    f.minX = Math.min(m.slideWidth / 2 - d / 2, 0), f.maxX = -f.minX, f.minY = Math.min(m.slideHeight / 2 - c / 2, 0), 
                    f.maxY = -f.minY, f.currentX = Math.max(Math.min(f.currentX, f.maxX), f.minX), f.currentY = Math.max(Math.min(f.currentY, f.maxY), f.minY), 
                    m.$imageWrapEl.transition(o).transform(`translate3d(${f.currentX}px, ${f.currentY}px,0)`);
                }();
            })), a("doubleTap", ((e, s) => {
                !t.animating && t.params.zoom.enabled && t.zoom.enabled && t.params.zoom.toggle && S(s);
            })), a("transitionEnd", (() => {
                t.zoom.enabled && t.params.zoom.enabled && C();
            })), a("slideChange", (() => {
                t.zoom.enabled && t.params.zoom.enabled && t.params.cssMode && C();
            })), Object.assign(t.zoom, {
                enable: O,
                disable: I,
                in: T,
                out: $,
                toggle: S
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a, emit: i} = e;
            s({
                lazy: {
                    checkInView: !1,
                    enabled: !1,
                    loadPrevNext: !1,
                    loadPrevNextAmount: 1,
                    loadOnTransitionStart: !1,
                    scrollingElement: "",
                    elementClass: "swiper-lazy",
                    loadingClass: "swiper-lazy-loading",
                    loadedClass: "swiper-lazy-loaded",
                    preloaderClass: "swiper-lazy-preloader"
                }
            }), t.lazy = {};
            let n = !1, l = !1;
            function o(e, s) {
                void 0 === s && (s = !0);
                const a = t.params.lazy;
                if (void 0 === e) return;
                if (0 === t.slides.length) return;
                const r = t.virtual && t.params.virtual.enabled ? t.$wrapperEl.children(`.${t.params.slideClass}[data-swiper-slide-index="${e}"]`) : t.slides.eq(e), n = r.find(`.${a.elementClass}:not(.${a.loadedClass}):not(.${a.loadingClass})`);
                !r.hasClass(a.elementClass) || r.hasClass(a.loadedClass) || r.hasClass(a.loadingClass) || n.push(r[0]), 
                0 !== n.length && n.each((e => {
                    const n = d(e);
                    n.addClass(a.loadingClass);
                    const l = n.attr("data-background"), c = n.attr("data-src"), p = n.attr("data-srcset"), u = n.attr("data-sizes"), h = n.parent("picture");
                    t.loadImage(n[0], c || l, p, u, !1, (() => {
                        if (null != t && t && (!t || t.params) && !t.destroyed) {
                            if (l ? (n.css("background-image", `url("${l}")`), n.removeAttr("data-background")) : (p && (n.attr("srcset", p), 
                            n.removeAttr("data-srcset")), u && (n.attr("sizes", u), n.removeAttr("data-sizes")), 
                            h.length && h.children("source").each((e => {
                                const t = d(e);
                                t.attr("data-srcset") && (t.attr("srcset", t.attr("data-srcset")), t.removeAttr("data-srcset"));
                            })), c && (n.attr("src", c), n.removeAttr("data-src"))), n.addClass(a.loadedClass).removeClass(a.loadingClass), 
                            r.find(`.${a.preloaderClass}`).remove(), t.params.loop && s) {
                                const e = r.attr("data-swiper-slide-index");
                                if (r.hasClass(t.params.slideDuplicateClass)) o(t.$wrapperEl.children(`[data-swiper-slide-index="${e}"]:not(.${t.params.slideDuplicateClass})`).index(), !1); else o(t.$wrapperEl.children(`.${t.params.slideDuplicateClass}[data-swiper-slide-index="${e}"]`).index(), !1);
                            }
                            i("lazyImageReady", r[0], n[0]), t.params.autoHeight && t.updateAutoHeight();
                        }
                    })), i("lazyImageLoad", r[0], n[0]);
                }));
            }
            function c() {
                const {$wrapperEl: e, params: s, slides: a, activeIndex: i} = t, r = t.virtual && s.virtual.enabled, n = s.lazy;
                let c = s.slidesPerView;
                function p(t) {
                    if (r) {
                        if (e.children(`.${s.slideClass}[data-swiper-slide-index="${t}"]`).length) return !0;
                    } else if (a[t]) return !0;
                    return !1;
                }
                function u(e) {
                    return r ? d(e).attr("data-swiper-slide-index") : d(e).index();
                }
                if ("auto" === c && (c = 0), l || (l = !0), t.params.watchSlidesProgress) e.children(`.${s.slideVisibleClass}`).each((e => {
                    o(r ? d(e).attr("data-swiper-slide-index") : d(e).index());
                })); else if (c > 1) for (let e = i; e < i + c; e += 1) p(e) && o(e); else o(i);
                if (n.loadPrevNext) if (c > 1 || n.loadPrevNextAmount && n.loadPrevNextAmount > 1) {
                    const e = n.loadPrevNextAmount, t = Math.ceil(c), s = Math.min(i + t + Math.max(e, t), a.length), r = Math.max(i - Math.max(t, e), 0);
                    for (let e = i + t; e < s; e += 1) p(e) && o(e);
                    for (let e = r; e < i; e += 1) p(e) && o(e);
                } else {
                    const t = e.children(`.${s.slideNextClass}`);
                    t.length > 0 && o(u(t));
                    const a = e.children(`.${s.slidePrevClass}`);
                    a.length > 0 && o(u(a));
                }
            }
            function p() {
                const e = r();
                if (!t || t.destroyed) return;
                const s = t.params.lazy.scrollingElement ? d(t.params.lazy.scrollingElement) : d(e), a = s[0] === e, i = a ? e.innerWidth : s[0].offsetWidth, l = a ? e.innerHeight : s[0].offsetHeight, o = t.$el.offset(), {rtlTranslate: u} = t;
                let h = !1;
                u && (o.left -= t.$el[0].scrollLeft);
                const m = [ [ o.left, o.top ], [ o.left + t.width, o.top ], [ o.left, o.top + t.height ], [ o.left + t.width, o.top + t.height ] ];
                for (let e = 0; e < m.length; e += 1) {
                    const t = m[e];
                    if (t[0] >= 0 && t[0] <= i && t[1] >= 0 && t[1] <= l) {
                        if (0 === t[0] && 0 === t[1]) continue;
                        h = !0;
                    }
                }
                const f = !("touchstart" !== t.touchEvents.start || !t.support.passiveListener || !t.params.passiveListeners) && {
                    passive: !0,
                    capture: !1
                };
                h ? (c(), s.off("scroll", p, f)) : n || (n = !0, s.on("scroll", p, f));
            }
            a("beforeInit", (() => {
                t.params.lazy.enabled && t.params.preloadImages && (t.params.preloadImages = !1);
            })), a("init", (() => {
                t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c());
            })), a("scroll", (() => {
                t.params.freeMode && t.params.freeMode.enabled && !t.params.freeMode.sticky && c();
            })), a("scrollbarDragMove resize _freeModeNoMomentumRelease", (() => {
                t.params.lazy.enabled && (t.params.lazy.checkInView ? p() : c());
            })), a("transitionStart", (() => {
                t.params.lazy.enabled && (t.params.lazy.loadOnTransitionStart || !t.params.lazy.loadOnTransitionStart && !l) && (t.params.lazy.checkInView ? p() : c());
            })), a("transitionEnd", (() => {
                t.params.lazy.enabled && !t.params.lazy.loadOnTransitionStart && (t.params.lazy.checkInView ? p() : c());
            })), a("slideChange", (() => {
                const {lazy: e, cssMode: s, watchSlidesProgress: a, touchReleaseOnEdges: i, resistanceRatio: r} = t.params;
                e.enabled && (s || a && (i || 0 === r)) && c();
            })), a("destroy", (() => {
                t.$el && t.$el.find(`.${t.params.lazy.loadingClass}`).removeClass(t.params.lazy.loadingClass);
            })), Object.assign(t.lazy, {
                load: c,
                loadInSlide: o
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            function i(e, t) {
                const s = function() {
                    let e, t, s;
                    return (a, i) => {
                        for (t = -1, e = a.length; e - t > 1; ) s = e + t >> 1, a[s] <= i ? t = s : e = s;
                        return e;
                    };
                }();
                let a, i;
                return this.x = e, this.y = t, this.lastIndex = e.length - 1, this.interpolate = function(e) {
                    return e ? (i = s(this.x, e), a = i - 1, (e - this.x[a]) * (this.y[i] - this.y[a]) / (this.x[i] - this.x[a]) + this.y[a]) : 0;
                }, this;
            }
            function r() {
                t.controller.control && t.controller.spline && (t.controller.spline = void 0, delete t.controller.spline);
            }
            s({
                controller: {
                    control: void 0,
                    inverse: !1,
                    by: "slide"
                }
            }), t.controller = {
                control: void 0
            }, a("beforeInit", (() => {
                t.controller.control = t.params.controller.control;
            })), a("update", (() => {
                r();
            })), a("resize", (() => {
                r();
            })), a("observerUpdate", (() => {
                r();
            })), a("setTranslate", ((e, s, a) => {
                t.controller.control && t.controller.setTranslate(s, a);
            })), a("setTransition", ((e, s, a) => {
                t.controller.control && t.controller.setTransition(s, a);
            })), Object.assign(t.controller, {
                setTranslate: function(e, s) {
                    const a = t.controller.control;
                    let r, n;
                    const l = t.constructor;
                    function o(e) {
                        const s = t.rtlTranslate ? -t.translate : t.translate;
                        "slide" === t.params.controller.by && (!function(e) {
                            t.controller.spline || (t.controller.spline = t.params.loop ? new i(t.slidesGrid, e.slidesGrid) : new i(t.snapGrid, e.snapGrid));
                        }(e), n = -t.controller.spline.interpolate(-s)), n && "container" !== t.params.controller.by || (r = (e.maxTranslate() - e.minTranslate()) / (t.maxTranslate() - t.minTranslate()), 
                        n = (s - t.minTranslate()) * r + e.minTranslate()), t.params.controller.inverse && (n = e.maxTranslate() - n), 
                        e.updateProgress(n), e.setTranslate(n, t), e.updateActiveIndex(), e.updateSlidesClasses();
                    }
                    if (Array.isArray(a)) for (let e = 0; e < a.length; e += 1) a[e] !== s && a[e] instanceof l && o(a[e]); else a instanceof l && s !== a && o(a);
                },
                setTransition: function(e, s) {
                    const a = t.constructor, i = t.controller.control;
                    let r;
                    function n(s) {
                        s.setTransition(e, t), 0 !== e && (s.transitionStart(), s.params.autoHeight && p((() => {
                            s.updateAutoHeight();
                        })), s.$wrapperEl.transitionEnd((() => {
                            i && (s.params.loop && "slide" === t.params.controller.by && s.loopFix(), s.transitionEnd());
                        })));
                    }
                    if (Array.isArray(i)) for (r = 0; r < i.length; r += 1) i[r] !== s && i[r] instanceof a && n(i[r]); else i instanceof a && s !== i && n(i);
                }
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                a11y: {
                    enabled: !0,
                    notificationClass: "swiper-notification",
                    prevSlideMessage: "Previous slide",
                    nextSlideMessage: "Next slide",
                    firstSlideMessage: "This is the first slide",
                    lastSlideMessage: "This is the last slide",
                    paginationBulletMessage: "Go to slide {{index}}",
                    slideLabelMessage: "{{index}} / {{slidesLength}}",
                    containerMessage: null,
                    containerRoleDescriptionMessage: null,
                    itemRoleDescriptionMessage: null,
                    slideRole: "group",
                    id: null
                }
            }), t.a11y = {
                clicked: !1
            };
            let i = null;
            function r(e) {
                const t = i;
                0 !== t.length && (t.html(""), t.html(e));
            }
            function n(e) {
                e.attr("tabIndex", "0");
            }
            function l(e) {
                e.attr("tabIndex", "-1");
            }
            function o(e, t) {
                e.attr("role", t);
            }
            function c(e, t) {
                e.attr("aria-roledescription", t);
            }
            function p(e, t) {
                e.attr("aria-label", t);
            }
            function u(e) {
                e.attr("aria-disabled", !0);
            }
            function h(e) {
                e.attr("aria-disabled", !1);
            }
            function m(e) {
                if (13 !== e.keyCode && 32 !== e.keyCode) return;
                const s = t.params.a11y, a = d(e.target);
                t.navigation && t.navigation.$nextEl && a.is(t.navigation.$nextEl) && (t.isEnd && !t.params.loop || t.slideNext(), 
                t.isEnd ? r(s.lastSlideMessage) : r(s.nextSlideMessage)), t.navigation && t.navigation.$prevEl && a.is(t.navigation.$prevEl) && (t.isBeginning && !t.params.loop || t.slidePrev(), 
                t.isBeginning ? r(s.firstSlideMessage) : r(s.prevSlideMessage)), t.pagination && a.is(U(t.params.pagination.bulletClass)) && a[0].click();
            }
            function f() {
                return t.pagination && t.pagination.bullets && t.pagination.bullets.length;
            }
            function g() {
                return f() && t.params.pagination.clickable;
            }
            const v = (e, t, s) => {
                n(e), "BUTTON" !== e[0].tagName && (o(e, "button"), e.on("keydown", m)), p(e, s), 
                function(e, t) {
                    e.attr("aria-controls", t);
                }(e, t);
            }, w = () => {
                t.a11y.clicked = !0;
            }, b = () => {
                t.a11y.clicked = !1;
            }, x = e => {
                if (t.a11y.clicked) return;
                const s = e.target.closest(`.${t.params.slideClass}`);
                if (!s || !t.slides.includes(s)) return;
                const a = t.slides.indexOf(s) === t.activeIndex, i = t.params.watchSlidesProgress && t.visibleSlides && t.visibleSlides.includes(s);
                a || i || (t.isHorizontal() ? t.el.scrollLeft = 0 : t.el.scrollTop = 0, t.slideTo(t.slides.indexOf(s), 0));
            }, y = () => {
                const e = t.params.a11y;
                e.itemRoleDescriptionMessage && c(d(t.slides), e.itemRoleDescriptionMessage), e.slideRole && o(d(t.slides), e.slideRole);
                const s = t.params.loop ? t.slides.filter((e => !e.classList.contains(t.params.slideDuplicateClass))).length : t.slides.length;
                e.slideLabelMessage && t.slides.each(((a, i) => {
                    const r = d(a), n = t.params.loop ? parseInt(r.attr("data-swiper-slide-index"), 10) : i;
                    p(r, e.slideLabelMessage.replace(/\{\{index\}\}/, n + 1).replace(/\{\{slidesLength\}\}/, s));
                }));
            }, E = () => {
                const e = t.params.a11y;
                t.$el.append(i);
                const s = t.$el;
                e.containerRoleDescriptionMessage && c(s, e.containerRoleDescriptionMessage), e.containerMessage && p(s, e.containerMessage);
                const a = t.$wrapperEl, r = e.id || a.attr("id") || `swiper-wrapper-${n = 16, void 0 === n && (n = 16), 
                "x".repeat(n).replace(/x/g, (() => Math.round(16 * Math.random()).toString(16)))}`;
                var n;
                const l = t.params.autoplay && t.params.autoplay.enabled ? "off" : "polite";
                var o;
                let d, u;
                o = r, a.attr("id", o), function(e, t) {
                    e.attr("aria-live", t);
                }(a, l), y(), t.navigation && t.navigation.$nextEl && (d = t.navigation.$nextEl), 
                t.navigation && t.navigation.$prevEl && (u = t.navigation.$prevEl), d && d.length && v(d, r, e.nextSlideMessage), 
                u && u.length && v(u, r, e.prevSlideMessage), g() && t.pagination.$el.on("keydown", U(t.params.pagination.bulletClass), m), 
                t.$el.on("focus", x, !0), t.$el.on("pointerdown", w, !0), t.$el.on("pointerup", b, !0);
            };
            a("beforeInit", (() => {
                i = d(`<span class="${t.params.a11y.notificationClass}" aria-live="assertive" aria-atomic="true"></span>`);
            })), a("afterInit", (() => {
                t.params.a11y.enabled && E();
            })), a("slidesLengthChange snapGridLengthChange slidesGridLengthChange", (() => {
                t.params.a11y.enabled && y();
            })), a("fromEdge toEdge afterInit lock unlock", (() => {
                t.params.a11y.enabled && function() {
                    if (t.params.loop || t.params.rewind || !t.navigation) return;
                    const {$nextEl: e, $prevEl: s} = t.navigation;
                    s && s.length > 0 && (t.isBeginning ? (u(s), l(s)) : (h(s), n(s))), e && e.length > 0 && (t.isEnd ? (u(e), 
                    l(e)) : (h(e), n(e)));
                }();
            })), a("paginationUpdate", (() => {
                t.params.a11y.enabled && function() {
                    const e = t.params.a11y;
                    f() && t.pagination.bullets.each((s => {
                        const a = d(s);
                        t.params.pagination.clickable && (n(a), t.params.pagination.renderBullet || (o(a, "button"), 
                        p(a, e.paginationBulletMessage.replace(/\{\{index\}\}/, a.index() + 1)))), a.is(`.${t.params.pagination.bulletActiveClass}`) ? a.attr("aria-current", "true") : a.removeAttr("aria-current");
                    }));
                }();
            })), a("destroy", (() => {
                t.params.a11y.enabled && function() {
                    let e, s;
                    i && i.length > 0 && i.remove(), t.navigation && t.navigation.$nextEl && (e = t.navigation.$nextEl), 
                    t.navigation && t.navigation.$prevEl && (s = t.navigation.$prevEl), e && e.off("keydown", m), 
                    s && s.off("keydown", m), g() && t.pagination.$el.off("keydown", U(t.params.pagination.bulletClass), m), 
                    t.$el.off("focus", x, !0), t.$el.off("pointerdown", w, !0), t.$el.off("pointerup", b, !0);
                }();
            }));
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                history: {
                    enabled: !1,
                    root: "",
                    replaceState: !1,
                    key: "slides",
                    keepQuery: !1
                }
            });
            let i = !1, n = {};
            const l = e => e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, ""), o = e => {
                const t = r();
                let s;
                s = e ? new URL(e) : t.location;
                const a = s.pathname.slice(1).split("/").filter((e => "" !== e)), i = a.length;
                return {
                    key: a[i - 2],
                    value: a[i - 1]
                };
            }, d = (e, s) => {
                const a = r();
                if (!i || !t.params.history.enabled) return;
                let n;
                n = t.params.url ? new URL(t.params.url) : a.location;
                const o = t.slides.eq(s);
                let d = l(o.attr("data-history"));
                if (t.params.history.root.length > 0) {
                    let s = t.params.history.root;
                    "/" === s[s.length - 1] && (s = s.slice(0, s.length - 1)), d = `${s}/${e}/${d}`;
                } else n.pathname.includes(e) || (d = `${e}/${d}`);
                t.params.history.keepQuery && (d += n.search);
                const c = a.history.state;
                c && c.value === d || (t.params.history.replaceState ? a.history.replaceState({
                    value: d
                }, null, d) : a.history.pushState({
                    value: d
                }, null, d));
            }, c = (e, s, a) => {
                if (s) for (let i = 0, r = t.slides.length; i < r; i += 1) {
                    const r = t.slides.eq(i);
                    if (l(r.attr("data-history")) === s && !r.hasClass(t.params.slideDuplicateClass)) {
                        const s = r.index();
                        t.slideTo(s, e, a);
                    }
                } else t.slideTo(0, e, a);
            }, p = () => {
                n = o(t.params.url), c(t.params.speed, n.value, !1);
            };
            a("init", (() => {
                t.params.history.enabled && (() => {
                    const e = r();
                    if (t.params.history) {
                        if (!e.history || !e.history.pushState) return t.params.history.enabled = !1, void (t.params.hashNavigation.enabled = !0);
                        i = !0, n = o(t.params.url), (n.key || n.value) && (c(0, n.value, t.params.runCallbacksOnInit), 
                        t.params.history.replaceState || e.addEventListener("popstate", p));
                    }
                })();
            })), a("destroy", (() => {
                t.params.history.enabled && (() => {
                    const e = r();
                    t.params.history.replaceState || e.removeEventListener("popstate", p);
                })();
            })), a("transitionEnd _freeModeNoMomentumRelease", (() => {
                i && d(t.params.history.key, t.activeIndex);
            })), a("slideChange", (() => {
                i && t.params.cssMode && d(t.params.history.key, t.activeIndex);
            }));
        }, function(e) {
            let {swiper: t, extendParams: s, emit: i, on: n} = e, l = !1;
            const o = a(), c = r();
            s({
                hashNavigation: {
                    enabled: !1,
                    replaceState: !1,
                    watchState: !1
                }
            });
            const p = () => {
                i("hashChange");
                const e = o.location.hash.replace("#", "");
                if (e !== t.slides.eq(t.activeIndex).attr("data-hash")) {
                    const s = t.$wrapperEl.children(`.${t.params.slideClass}[data-hash="${e}"]`).index();
                    if (void 0 === s) return;
                    t.slideTo(s);
                }
            }, u = () => {
                if (l && t.params.hashNavigation.enabled) if (t.params.hashNavigation.replaceState && c.history && c.history.replaceState) c.history.replaceState(null, null, `#${t.slides.eq(t.activeIndex).attr("data-hash")}` || ""), 
                i("hashSet"); else {
                    const e = t.slides.eq(t.activeIndex), s = e.attr("data-hash") || e.attr("data-history");
                    o.location.hash = s || "", i("hashSet");
                }
            };
            n("init", (() => {
                t.params.hashNavigation.enabled && (() => {
                    if (!t.params.hashNavigation.enabled || t.params.history && t.params.history.enabled) return;
                    l = !0;
                    const e = o.location.hash.replace("#", "");
                    if (e) {
                        const s = 0;
                        for (let a = 0, i = t.slides.length; a < i; a += 1) {
                            const i = t.slides.eq(a);
                            if ((i.attr("data-hash") || i.attr("data-history")) === e && !i.hasClass(t.params.slideDuplicateClass)) {
                                const e = i.index();
                                t.slideTo(e, s, t.params.runCallbacksOnInit, !0);
                            }
                        }
                    }
                    t.params.hashNavigation.watchState && d(c).on("hashchange", p);
                })();
            })), n("destroy", (() => {
                t.params.hashNavigation.enabled && t.params.hashNavigation.watchState && d(c).off("hashchange", p);
            })), n("transitionEnd _freeModeNoMomentumRelease", (() => {
                l && u();
            })), n("slideChange", (() => {
                l && t.params.cssMode && u();
            }));
        }, function(e) {
            let t, {swiper: s, extendParams: i, on: r, emit: n} = e;
            function l() {
                if (!s.size) return s.autoplay.running = !1, void (s.autoplay.paused = !1);
                const e = s.slides.eq(s.activeIndex);
                let a = s.params.autoplay.delay;
                e.attr("data-swiper-autoplay") && (a = e.attr("data-swiper-autoplay") || s.params.autoplay.delay), 
                clearTimeout(t), t = p((() => {
                    let e;
                    s.params.autoplay.reverseDirection ? s.params.loop ? (s.loopFix(), e = s.slidePrev(s.params.speed, !0, !0), 
                    n("autoplay")) : s.isBeginning ? s.params.autoplay.stopOnLastSlide ? d() : (e = s.slideTo(s.slides.length - 1, s.params.speed, !0, !0), 
                    n("autoplay")) : (e = s.slidePrev(s.params.speed, !0, !0), n("autoplay")) : s.params.loop ? (s.loopFix(), 
                    e = s.slideNext(s.params.speed, !0, !0), n("autoplay")) : s.isEnd ? s.params.autoplay.stopOnLastSlide ? d() : (e = s.slideTo(0, s.params.speed, !0, !0), 
                    n("autoplay")) : (e = s.slideNext(s.params.speed, !0, !0), n("autoplay")), (s.params.cssMode && s.autoplay.running || !1 === e) && l();
                }), a);
            }
            function o() {
                return void 0 === t && !s.autoplay.running && (s.autoplay.running = !0, n("autoplayStart"), 
                l(), !0);
            }
            function d() {
                return !!s.autoplay.running && void 0 !== t && (t && (clearTimeout(t), t = void 0), 
                s.autoplay.running = !1, n("autoplayStop"), !0);
            }
            function c(e) {
                s.autoplay.running && (s.autoplay.paused || (t && clearTimeout(t), s.autoplay.paused = !0, 
                0 !== e && s.params.autoplay.waitForTransition ? [ "transitionend", "webkitTransitionEnd" ].forEach((e => {
                    s.$wrapperEl[0].addEventListener(e, h);
                })) : (s.autoplay.paused = !1, l())));
            }
            function u() {
                const e = a();
                "hidden" === e.visibilityState && s.autoplay.running && c(), "visible" === e.visibilityState && s.autoplay.paused && (l(), 
                s.autoplay.paused = !1);
            }
            function h(e) {
                s && !s.destroyed && s.$wrapperEl && e.target === s.$wrapperEl[0] && ([ "transitionend", "webkitTransitionEnd" ].forEach((e => {
                    s.$wrapperEl[0].removeEventListener(e, h);
                })), s.autoplay.paused = !1, s.autoplay.running ? l() : d());
            }
            function m() {
                s.params.autoplay.disableOnInteraction ? d() : (n("autoplayPause"), c()), [ "transitionend", "webkitTransitionEnd" ].forEach((e => {
                    s.$wrapperEl[0].removeEventListener(e, h);
                }));
            }
            function f() {
                s.params.autoplay.disableOnInteraction || (s.autoplay.paused = !1, n("autoplayResume"), 
                l());
            }
            s.autoplay = {
                running: !1,
                paused: !1
            }, i({
                autoplay: {
                    enabled: !1,
                    delay: 3e3,
                    waitForTransition: !0,
                    disableOnInteraction: !0,
                    stopOnLastSlide: !1,
                    reverseDirection: !1,
                    pauseOnMouseEnter: !1
                }
            }), r("init", (() => {
                if (s.params.autoplay.enabled) {
                    o();
                    a().addEventListener("visibilitychange", u), s.params.autoplay.pauseOnMouseEnter && (s.$el.on("mouseenter", m), 
                    s.$el.on("mouseleave", f));
                }
            })), r("beforeTransitionStart", ((e, t, a) => {
                s.autoplay.running && (a || !s.params.autoplay.disableOnInteraction ? s.autoplay.pause(t) : d());
            })), r("sliderFirstMove", (() => {
                s.autoplay.running && (s.params.autoplay.disableOnInteraction ? d() : c());
            })), r("touchEnd", (() => {
                s.params.cssMode && s.autoplay.paused && !s.params.autoplay.disableOnInteraction && l();
            })), r("destroy", (() => {
                s.$el.off("mouseenter", m), s.$el.off("mouseleave", f), s.autoplay.running && d();
                a().removeEventListener("visibilitychange", u);
            })), Object.assign(s.autoplay, {
                pause: c,
                run: l,
                start: o,
                stop: d
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                thumbs: {
                    swiper: null,
                    multipleActiveThumbs: !0,
                    autoScrollOffset: 0,
                    slideThumbActiveClass: "swiper-slide-thumb-active",
                    thumbsContainerClass: "swiper-thumbs"
                }
            });
            let i = !1, r = !1;
            function n() {
                const e = t.thumbs.swiper;
                if (!e || e.destroyed) return;
                const s = e.clickedIndex, a = e.clickedSlide;
                if (a && d(a).hasClass(t.params.thumbs.slideThumbActiveClass)) return;
                if (null == s) return;
                let i;
                if (i = e.params.loop ? parseInt(d(e.clickedSlide).attr("data-swiper-slide-index"), 10) : s, 
                t.params.loop) {
                    let e = t.activeIndex;
                    t.slides.eq(e).hasClass(t.params.slideDuplicateClass) && (t.loopFix(), t._clientLeft = t.$wrapperEl[0].clientLeft, 
                    e = t.activeIndex);
                    const s = t.slides.eq(e).prevAll(`[data-swiper-slide-index="${i}"]`).eq(0).index(), a = t.slides.eq(e).nextAll(`[data-swiper-slide-index="${i}"]`).eq(0).index();
                    i = void 0 === s ? a : void 0 === a ? s : a - e < e - s ? a : s;
                }
                t.slideTo(i);
            }
            function l() {
                const {thumbs: e} = t.params;
                if (i) return !1;
                i = !0;
                const s = t.constructor;
                if (e.swiper instanceof s) t.thumbs.swiper = e.swiper, Object.assign(t.thumbs.swiper.originalParams, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                }), Object.assign(t.thumbs.swiper.params, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                }); else if (m(e.swiper)) {
                    const a = Object.assign({}, e.swiper);
                    Object.assign(a, {
                        watchSlidesProgress: !0,
                        slideToClickedSlide: !1
                    }), t.thumbs.swiper = new s(a), r = !0;
                }
                return t.thumbs.swiper.$el.addClass(t.params.thumbs.thumbsContainerClass), t.thumbs.swiper.on("tap", n), 
                !0;
            }
            function o(e) {
                const s = t.thumbs.swiper;
                if (!s || s.destroyed) return;
                const a = "auto" === s.params.slidesPerView ? s.slidesPerViewDynamic() : s.params.slidesPerView;
                let i = 1;
                const r = t.params.thumbs.slideThumbActiveClass;
                if (t.params.slidesPerView > 1 && !t.params.centeredSlides && (i = t.params.slidesPerView), 
                t.params.thumbs.multipleActiveThumbs || (i = 1), i = Math.floor(i), s.slides.removeClass(r), 
                s.params.loop || s.params.virtual && s.params.virtual.enabled) for (let e = 0; e < i; e += 1) s.$wrapperEl.children(`[data-swiper-slide-index="${t.realIndex + e}"]`).addClass(r); else for (let e = 0; e < i; e += 1) s.slides.eq(t.realIndex + e).addClass(r);
                const n = t.params.thumbs.autoScrollOffset, l = n && !s.params.loop;
                if (t.realIndex !== s.realIndex || l) {
                    let i, r, o = s.activeIndex;
                    if (s.params.loop) {
                        s.slides.eq(o).hasClass(s.params.slideDuplicateClass) && (s.loopFix(), s._clientLeft = s.$wrapperEl[0].clientLeft, 
                        o = s.activeIndex);
                        const e = s.slides.eq(o).prevAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index(), a = s.slides.eq(o).nextAll(`[data-swiper-slide-index="${t.realIndex}"]`).eq(0).index();
                        i = void 0 === e ? a : void 0 === a ? e : a - o == o - e ? s.params.slidesPerGroup > 1 ? a : o : a - o < o - e ? a : e, 
                        r = t.activeIndex > t.previousIndex ? "next" : "prev";
                    } else i = t.realIndex, r = i > t.previousIndex ? "next" : "prev";
                    l && (i += "next" === r ? n : -1 * n), s.visibleSlidesIndexes && s.visibleSlidesIndexes.indexOf(i) < 0 && (s.params.centeredSlides ? i = i > o ? i - Math.floor(a / 2) + 1 : i + Math.floor(a / 2) - 1 : i > o && s.params.slidesPerGroup, 
                    s.slideTo(i, e ? 0 : void 0));
                }
            }
            t.thumbs = {
                swiper: null
            }, a("beforeInit", (() => {
                const {thumbs: e} = t.params;
                e && e.swiper && (l(), o(!0));
            })), a("slideChange update resize observerUpdate", (() => {
                o();
            })), a("setTransition", ((e, s) => {
                const a = t.thumbs.swiper;
                a && !a.destroyed && a.setTransition(s);
            })), a("beforeDestroy", (() => {
                const e = t.thumbs.swiper;
                e && !e.destroyed && r && e.destroy();
            })), Object.assign(t.thumbs, {
                init: l,
                update: o
            });
        }, function(e) {
            let {swiper: t, extendParams: s, emit: a, once: i} = e;
            s({
                freeMode: {
                    enabled: !1,
                    momentum: !0,
                    momentumRatio: 1,
                    momentumBounce: !0,
                    momentumBounceRatio: 1,
                    momentumVelocityRatio: 1,
                    sticky: !1,
                    minimumVelocity: .02
                }
            }), Object.assign(t, {
                freeMode: {
                    onTouchStart: function() {
                        const e = t.getTranslate();
                        t.setTranslate(e), t.setTransition(0), t.touchEventsData.velocities.length = 0, 
                        t.freeMode.onTouchEnd({
                            currentPos: t.rtl ? t.translate : -t.translate
                        });
                    },
                    onTouchMove: function() {
                        const {touchEventsData: e, touches: s} = t;
                        0 === e.velocities.length && e.velocities.push({
                            position: s[t.isHorizontal() ? "startX" : "startY"],
                            time: e.touchStartTime
                        }), e.velocities.push({
                            position: s[t.isHorizontal() ? "currentX" : "currentY"],
                            time: u()
                        });
                    },
                    onTouchEnd: function(e) {
                        let {currentPos: s} = e;
                        const {params: r, $wrapperEl: n, rtlTranslate: l, snapGrid: o, touchEventsData: d} = t, c = u() - d.touchStartTime;
                        if (s < -t.minTranslate()) t.slideTo(t.activeIndex); else if (s > -t.maxTranslate()) t.slides.length < o.length ? t.slideTo(o.length - 1) : t.slideTo(t.slides.length - 1); else {
                            if (r.freeMode.momentum) {
                                if (d.velocities.length > 1) {
                                    const e = d.velocities.pop(), s = d.velocities.pop(), a = e.position - s.position, i = e.time - s.time;
                                    t.velocity = a / i, t.velocity /= 2, Math.abs(t.velocity) < r.freeMode.minimumVelocity && (t.velocity = 0), 
                                    (i > 150 || u() - e.time > 300) && (t.velocity = 0);
                                } else t.velocity = 0;
                                t.velocity *= r.freeMode.momentumVelocityRatio, d.velocities.length = 0;
                                let e = 1e3 * r.freeMode.momentumRatio;
                                const s = t.velocity * e;
                                let c = t.translate + s;
                                l && (c = -c);
                                let p, h = !1;
                                const m = 20 * Math.abs(t.velocity) * r.freeMode.momentumBounceRatio;
                                let f;
                                if (c < t.maxTranslate()) r.freeMode.momentumBounce ? (c + t.maxTranslate() < -m && (c = t.maxTranslate() - m), 
                                p = t.maxTranslate(), h = !0, d.allowMomentumBounce = !0) : c = t.maxTranslate(), 
                                r.loop && r.centeredSlides && (f = !0); else if (c > t.minTranslate()) r.freeMode.momentumBounce ? (c - t.minTranslate() > m && (c = t.minTranslate() + m), 
                                p = t.minTranslate(), h = !0, d.allowMomentumBounce = !0) : c = t.minTranslate(), 
                                r.loop && r.centeredSlides && (f = !0); else if (r.freeMode.sticky) {
                                    let e;
                                    for (let t = 0; t < o.length; t += 1) if (o[t] > -c) {
                                        e = t;
                                        break;
                                    }
                                    c = Math.abs(o[e] - c) < Math.abs(o[e - 1] - c) || "next" === t.swipeDirection ? o[e] : o[e - 1], 
                                    c = -c;
                                }
                                if (f && i("transitionEnd", (() => {
                                    t.loopFix();
                                })), 0 !== t.velocity) {
                                    if (e = l ? Math.abs((-c - t.translate) / t.velocity) : Math.abs((c - t.translate) / t.velocity), 
                                    r.freeMode.sticky) {
                                        const s = Math.abs((l ? -c : c) - t.translate), a = t.slidesSizesGrid[t.activeIndex];
                                        e = s < a ? r.speed : s < 2 * a ? 1.5 * r.speed : 2.5 * r.speed;
                                    }
                                } else if (r.freeMode.sticky) return void t.slideToClosest();
                                r.freeMode.momentumBounce && h ? (t.updateProgress(p), t.setTransition(e), t.setTranslate(c), 
                                t.transitionStart(!0, t.swipeDirection), t.animating = !0, n.transitionEnd((() => {
                                    t && !t.destroyed && d.allowMomentumBounce && (a("momentumBounce"), t.setTransition(r.speed), 
                                    setTimeout((() => {
                                        t.setTranslate(p), n.transitionEnd((() => {
                                            t && !t.destroyed && t.transitionEnd();
                                        }));
                                    }), 0));
                                }))) : t.velocity ? (a("_freeModeNoMomentumRelease"), t.updateProgress(c), t.setTransition(e), 
                                t.setTranslate(c), t.transitionStart(!0, t.swipeDirection), t.animating || (t.animating = !0, 
                                n.transitionEnd((() => {
                                    t && !t.destroyed && t.transitionEnd();
                                })))) : t.updateProgress(c), t.updateActiveIndex(), t.updateSlidesClasses();
                            } else {
                                if (r.freeMode.sticky) return void t.slideToClosest();
                                r.freeMode && a("_freeModeNoMomentumRelease");
                            }
                            (!r.freeMode.momentum || c >= r.longSwipesMs) && (t.updateProgress(), t.updateActiveIndex(), 
                            t.updateSlidesClasses());
                        }
                    }
                }
            });
        }, function(e) {
            let t, s, a, {swiper: i, extendParams: r} = e;
            r({
                grid: {
                    rows: 1,
                    fill: "column"
                }
            }), i.grid = {
                initSlides: e => {
                    const {slidesPerView: r} = i.params, {rows: n, fill: l} = i.params.grid;
                    s = t / n, a = Math.floor(e / n), t = Math.floor(e / n) === e / n ? e : Math.ceil(e / n) * n, 
                    "auto" !== r && "row" === l && (t = Math.max(t, r * n));
                },
                updateSlide: (e, r, n, l) => {
                    const {slidesPerGroup: o, spaceBetween: d} = i.params, {rows: c, fill: p} = i.params.grid;
                    let u, h, m;
                    if ("row" === p && o > 1) {
                        const s = Math.floor(e / (o * c)), a = e - c * o * s, i = 0 === s ? o : Math.min(Math.ceil((n - s * c * o) / c), o);
                        m = Math.floor(a / i), h = a - m * i + s * o, u = h + m * t / c, r.css({
                            "-webkit-order": u,
                            order: u
                        });
                    } else "column" === p ? (h = Math.floor(e / c), m = e - h * c, (h > a || h === a && m === c - 1) && (m += 1, 
                    m >= c && (m = 0, h += 1))) : (m = Math.floor(e / s), h = e - m * s);
                    r.css(l("margin-top"), 0 !== m ? d && `${d}px` : "");
                },
                updateWrapperSize: (e, s, a) => {
                    const {spaceBetween: r, centeredSlides: n, roundLengths: l} = i.params, {rows: o} = i.params.grid;
                    if (i.virtualSize = (e + r) * t, i.virtualSize = Math.ceil(i.virtualSize / o) - r, 
                    i.$wrapperEl.css({
                        [a("width")]: `${i.virtualSize + r}px`
                    }), n) {
                        s.splice(0, s.length);
                        const e = [];
                        for (let t = 0; t < s.length; t += 1) {
                            let a = s[t];
                            l && (a = Math.floor(a)), s[t] < i.virtualSize + s[0] && e.push(a);
                        }
                        s.push(...e);
                    }
                }
            };
        }, function(e) {
            let {swiper: t} = e;
            Object.assign(t, {
                appendSlide: K.bind(t),
                prependSlide: Z.bind(t),
                addSlide: Q.bind(t),
                removeSlide: J.bind(t),
                removeAllSlides: ee.bind(t)
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                fadeEffect: {
                    crossFade: !1,
                    transformEl: null
                }
            }), te({
                effect: "fade",
                swiper: t,
                on: a,
                setTranslate: () => {
                    const {slides: e} = t, s = t.params.fadeEffect;
                    for (let a = 0; a < e.length; a += 1) {
                        const e = t.slides.eq(a);
                        let i = -e[0].swiperSlideOffset;
                        t.params.virtualTranslate || (i -= t.translate);
                        let r = 0;
                        t.isHorizontal() || (r = i, i = 0);
                        const n = t.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(e[0].progress), 0) : 1 + Math.min(Math.max(e[0].progress, -1), 0);
                        se(s, e).css({
                            opacity: n
                        }).transform(`translate3d(${i}px, ${r}px, 0px)`);
                    }
                },
                setTransition: e => {
                    const {transformEl: s} = t.params.fadeEffect;
                    (s ? t.slides.find(s) : t.slides).transition(e), ae({
                        swiper: t,
                        duration: e,
                        transformEl: s,
                        allSlides: !0
                    });
                },
                overwriteParams: () => ({
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    spaceBetween: 0,
                    virtualTranslate: !t.params.cssMode
                })
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                cubeEffect: {
                    slideShadows: !0,
                    shadow: !0,
                    shadowOffset: 20,
                    shadowScale: .94
                }
            });
            const i = (e, t, s) => {
                let a = s ? e.find(".swiper-slide-shadow-left") : e.find(".swiper-slide-shadow-top"), i = s ? e.find(".swiper-slide-shadow-right") : e.find(".swiper-slide-shadow-bottom");
                0 === a.length && (a = d(`<div class="swiper-slide-shadow-${s ? "left" : "top"}"></div>`), 
                e.append(a)), 0 === i.length && (i = d(`<div class="swiper-slide-shadow-${s ? "right" : "bottom"}"></div>`), 
                e.append(i)), a.length && (a[0].style.opacity = Math.max(-t, 0)), i.length && (i[0].style.opacity = Math.max(t, 0));
            };
            te({
                effect: "cube",
                swiper: t,
                on: a,
                setTranslate: () => {
                    const {$el: e, $wrapperEl: s, slides: a, width: r, height: n, rtlTranslate: l, size: o, browser: c} = t, p = t.params.cubeEffect, u = t.isHorizontal(), h = t.virtual && t.params.virtual.enabled;
                    let m, f = 0;
                    p.shadow && (u ? (m = s.find(".swiper-cube-shadow"), 0 === m.length && (m = d('<div class="swiper-cube-shadow"></div>'), 
                    s.append(m)), m.css({
                        height: `${r}px`
                    })) : (m = e.find(".swiper-cube-shadow"), 0 === m.length && (m = d('<div class="swiper-cube-shadow"></div>'), 
                    e.append(m))));
                    for (let e = 0; e < a.length; e += 1) {
                        const t = a.eq(e);
                        let s = e;
                        h && (s = parseInt(t.attr("data-swiper-slide-index"), 10));
                        let r = 90 * s, n = Math.floor(r / 360);
                        l && (r = -r, n = Math.floor(-r / 360));
                        const d = Math.max(Math.min(t[0].progress, 1), -1);
                        let c = 0, m = 0, g = 0;
                        s % 4 == 0 ? (c = 4 * -n * o, g = 0) : (s - 1) % 4 == 0 ? (c = 0, g = 4 * -n * o) : (s - 2) % 4 == 0 ? (c = o + 4 * n * o, 
                        g = o) : (s - 3) % 4 == 0 && (c = -o, g = 3 * o + 4 * o * n), l && (c = -c), u || (m = c, 
                        c = 0);
                        const v = `rotateX(${u ? 0 : -r}deg) rotateY(${u ? r : 0}deg) translate3d(${c}px, ${m}px, ${g}px)`;
                        d <= 1 && d > -1 && (f = 90 * s + 90 * d, l && (f = 90 * -s - 90 * d)), t.transform(v), 
                        p.slideShadows && i(t, d, u);
                    }
                    if (s.css({
                        "-webkit-transform-origin": `50% 50% -${o / 2}px`,
                        "transform-origin": `50% 50% -${o / 2}px`
                    }), p.shadow) if (u) m.transform(`translate3d(0px, ${r / 2 + p.shadowOffset}px, ${-r / 2}px) rotateX(90deg) rotateZ(0deg) scale(${p.shadowScale})`); else {
                        const e = Math.abs(f) - 90 * Math.floor(Math.abs(f) / 90), t = 1.5 - (Math.sin(2 * e * Math.PI / 360) / 2 + Math.cos(2 * e * Math.PI / 360) / 2), s = p.shadowScale, a = p.shadowScale / t, i = p.shadowOffset;
                        m.transform(`scale3d(${s}, 1, ${a}) translate3d(0px, ${n / 2 + i}px, ${-n / 2 / a}px) rotateX(-90deg)`);
                    }
                    const g = c.isSafari || c.isWebView ? -o / 2 : 0;
                    s.transform(`translate3d(0px,0,${g}px) rotateX(${t.isHorizontal() ? 0 : f}deg) rotateY(${t.isHorizontal() ? -f : 0}deg)`), 
                    s[0].style.setProperty("--swiper-cube-translate-z", `${g}px`);
                },
                setTransition: e => {
                    const {$el: s, slides: a} = t;
                    a.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), 
                    t.params.cubeEffect.shadow && !t.isHorizontal() && s.find(".swiper-cube-shadow").transition(e);
                },
                recreateShadows: () => {
                    const e = t.isHorizontal();
                    t.slides.each((t => {
                        const s = Math.max(Math.min(t.progress, 1), -1);
                        i(d(t), s, e);
                    }));
                },
                getEffectParams: () => t.params.cubeEffect,
                perspective: () => !0,
                overwriteParams: () => ({
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    resistanceRatio: 0,
                    spaceBetween: 0,
                    centeredSlides: !1,
                    virtualTranslate: !0
                })
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                flipEffect: {
                    slideShadows: !0,
                    limitRotation: !0,
                    transformEl: null
                }
            });
            const i = (e, s, a) => {
                let i = t.isHorizontal() ? e.find(".swiper-slide-shadow-left") : e.find(".swiper-slide-shadow-top"), r = t.isHorizontal() ? e.find(".swiper-slide-shadow-right") : e.find(".swiper-slide-shadow-bottom");
                0 === i.length && (i = ie(a, e, t.isHorizontal() ? "left" : "top")), 0 === r.length && (r = ie(a, e, t.isHorizontal() ? "right" : "bottom")), 
                i.length && (i[0].style.opacity = Math.max(-s, 0)), r.length && (r[0].style.opacity = Math.max(s, 0));
            };
            te({
                effect: "flip",
                swiper: t,
                on: a,
                setTranslate: () => {
                    const {slides: e, rtlTranslate: s} = t, a = t.params.flipEffect;
                    for (let r = 0; r < e.length; r += 1) {
                        const n = e.eq(r);
                        let l = n[0].progress;
                        t.params.flipEffect.limitRotation && (l = Math.max(Math.min(n[0].progress, 1), -1));
                        const o = n[0].swiperSlideOffset;
                        let d = -180 * l, c = 0, p = t.params.cssMode ? -o - t.translate : -o, u = 0;
                        t.isHorizontal() ? s && (d = -d) : (u = p, p = 0, c = -d, d = 0), n[0].style.zIndex = -Math.abs(Math.round(l)) + e.length, 
                        a.slideShadows && i(n, l, a);
                        const h = `translate3d(${p}px, ${u}px, 0px) rotateX(${c}deg) rotateY(${d}deg)`;
                        se(a, n).transform(h);
                    }
                },
                setTransition: e => {
                    const {transformEl: s} = t.params.flipEffect;
                    (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), 
                    ae({
                        swiper: t,
                        duration: e,
                        transformEl: s
                    });
                },
                recreateShadows: () => {
                    const e = t.params.flipEffect;
                    t.slides.each((s => {
                        const a = d(s);
                        let r = a[0].progress;
                        t.params.flipEffect.limitRotation && (r = Math.max(Math.min(s.progress, 1), -1)), 
                        i(a, r, e);
                    }));
                },
                getEffectParams: () => t.params.flipEffect,
                perspective: () => !0,
                overwriteParams: () => ({
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: !0,
                    spaceBetween: 0,
                    virtualTranslate: !t.params.cssMode
                })
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    scale: 1,
                    modifier: 1,
                    slideShadows: !0,
                    transformEl: null
                }
            }), te({
                effect: "coverflow",
                swiper: t,
                on: a,
                setTranslate: () => {
                    const {width: e, height: s, slides: a, slidesSizesGrid: i} = t, r = t.params.coverflowEffect, n = t.isHorizontal(), l = t.translate, o = n ? e / 2 - l : s / 2 - l, d = n ? r.rotate : -r.rotate, c = r.depth;
                    for (let e = 0, t = a.length; e < t; e += 1) {
                        const t = a.eq(e), s = i[e], l = (o - t[0].swiperSlideOffset - s / 2) / s, p = "function" == typeof r.modifier ? r.modifier(l) : l * r.modifier;
                        let u = n ? d * p : 0, h = n ? 0 : d * p, m = -c * Math.abs(p), f = r.stretch;
                        "string" == typeof f && -1 !== f.indexOf("%") && (f = parseFloat(r.stretch) / 100 * s);
                        let g = n ? 0 : f * p, v = n ? f * p : 0, w = 1 - (1 - r.scale) * Math.abs(p);
                        Math.abs(v) < .001 && (v = 0), Math.abs(g) < .001 && (g = 0), Math.abs(m) < .001 && (m = 0), 
                        Math.abs(u) < .001 && (u = 0), Math.abs(h) < .001 && (h = 0), Math.abs(w) < .001 && (w = 0);
                        const b = `translate3d(${v}px,${g}px,${m}px)  rotateX(${h}deg) rotateY(${u}deg) scale(${w})`;
                        if (se(r, t).transform(b), t[0].style.zIndex = 1 - Math.abs(Math.round(p)), r.slideShadows) {
                            let e = n ? t.find(".swiper-slide-shadow-left") : t.find(".swiper-slide-shadow-top"), s = n ? t.find(".swiper-slide-shadow-right") : t.find(".swiper-slide-shadow-bottom");
                            0 === e.length && (e = ie(r, t, n ? "left" : "top")), 0 === s.length && (s = ie(r, t, n ? "right" : "bottom")), 
                            e.length && (e[0].style.opacity = p > 0 ? p : 0), s.length && (s[0].style.opacity = -p > 0 ? -p : 0);
                        }
                    }
                },
                setTransition: e => {
                    const {transformEl: s} = t.params.coverflowEffect;
                    (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e);
                },
                perspective: () => !0,
                overwriteParams: () => ({
                    watchSlidesProgress: !0
                })
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                creativeEffect: {
                    transformEl: null,
                    limitProgress: 1,
                    shadowPerProgress: !1,
                    progressMultiplier: 1,
                    perspective: !0,
                    prev: {
                        translate: [ 0, 0, 0 ],
                        rotate: [ 0, 0, 0 ],
                        opacity: 1,
                        scale: 1
                    },
                    next: {
                        translate: [ 0, 0, 0 ],
                        rotate: [ 0, 0, 0 ],
                        opacity: 1,
                        scale: 1
                    }
                }
            });
            const i = e => "string" == typeof e ? e : `${e}px`;
            te({
                effect: "creative",
                swiper: t,
                on: a,
                setTranslate: () => {
                    const {slides: e, $wrapperEl: s, slidesSizesGrid: a} = t, r = t.params.creativeEffect, {progressMultiplier: n} = r, l = t.params.centeredSlides;
                    if (l) {
                        const e = a[0] / 2 - t.params.slidesOffsetBefore || 0;
                        s.transform(`translateX(calc(50% - ${e}px))`);
                    }
                    for (let s = 0; s < e.length; s += 1) {
                        const a = e.eq(s), o = a[0].progress, d = Math.min(Math.max(a[0].progress, -r.limitProgress), r.limitProgress);
                        let c = d;
                        l || (c = Math.min(Math.max(a[0].originalProgress, -r.limitProgress), r.limitProgress));
                        const p = a[0].swiperSlideOffset, u = [ t.params.cssMode ? -p - t.translate : -p, 0, 0 ], h = [ 0, 0, 0 ];
                        let m = !1;
                        t.isHorizontal() || (u[1] = u[0], u[0] = 0);
                        let f = {
                            translate: [ 0, 0, 0 ],
                            rotate: [ 0, 0, 0 ],
                            scale: 1,
                            opacity: 1
                        };
                        d < 0 ? (f = r.next, m = !0) : d > 0 && (f = r.prev, m = !0), u.forEach(((e, t) => {
                            u[t] = `calc(${e}px + (${i(f.translate[t])} * ${Math.abs(d * n)}))`;
                        })), h.forEach(((e, t) => {
                            h[t] = f.rotate[t] * Math.abs(d * n);
                        })), a[0].style.zIndex = -Math.abs(Math.round(o)) + e.length;
                        const g = u.join(", "), v = `rotateX(${h[0]}deg) rotateY(${h[1]}deg) rotateZ(${h[2]}deg)`, w = c < 0 ? `scale(${1 + (1 - f.scale) * c * n})` : `scale(${1 - (1 - f.scale) * c * n})`, b = c < 0 ? 1 + (1 - f.opacity) * c * n : 1 - (1 - f.opacity) * c * n, x = `translate3d(${g}) ${v} ${w}`;
                        if (m && f.shadow || !m) {
                            let e = a.children(".swiper-slide-shadow");
                            if (0 === e.length && f.shadow && (e = ie(r, a)), e.length) {
                                const t = r.shadowPerProgress ? d * (1 / r.limitProgress) : d;
                                e[0].style.opacity = Math.min(Math.max(Math.abs(t), 0), 1);
                            }
                        }
                        const y = se(r, a);
                        y.transform(x).css({
                            opacity: b
                        }), f.origin && y.css("transform-origin", f.origin);
                    }
                },
                setTransition: e => {
                    const {transformEl: s} = t.params.creativeEffect;
                    (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e), 
                    ae({
                        swiper: t,
                        duration: e,
                        transformEl: s,
                        allSlides: !0
                    });
                },
                perspective: () => t.params.creativeEffect.perspective,
                overwriteParams: () => ({
                    watchSlidesProgress: !0,
                    virtualTranslate: !t.params.cssMode
                })
            });
        }, function(e) {
            let {swiper: t, extendParams: s, on: a} = e;
            s({
                cardsEffect: {
                    slideShadows: !0,
                    transformEl: null,
                    rotate: !0,
                    perSlideRotate: 2,
                    perSlideOffset: 8
                }
            }), te({
                effect: "cards",
                swiper: t,
                on: a,
                setTranslate: () => {
                    const {slides: e, activeIndex: s} = t, a = t.params.cardsEffect, {startTranslate: i, isTouched: r} = t.touchEventsData, n = t.translate;
                    for (let l = 0; l < e.length; l += 1) {
                        const o = e.eq(l), d = o[0].progress, c = Math.min(Math.max(d, -4), 4);
                        let p = o[0].swiperSlideOffset;
                        t.params.centeredSlides && !t.params.cssMode && t.$wrapperEl.transform(`translateX(${t.minTranslate()}px)`), 
                        t.params.centeredSlides && t.params.cssMode && (p -= e[0].swiperSlideOffset);
                        let u = t.params.cssMode ? -p - t.translate : -p, h = 0;
                        const m = -100 * Math.abs(c);
                        let f = 1, g = -a.perSlideRotate * c, v = a.perSlideOffset - .75 * Math.abs(c);
                        const w = t.virtual && t.params.virtual.enabled ? t.virtual.from + l : l, b = (w === s || w === s - 1) && c > 0 && c < 1 && (r || t.params.cssMode) && n < i, x = (w === s || w === s + 1) && c < 0 && c > -1 && (r || t.params.cssMode) && n > i;
                        if (b || x) {
                            const e = (1 - Math.abs((Math.abs(c) - .5) / .5)) ** .5;
                            g += -28 * c * e, f += -.5 * e, v += 96 * e, h = -25 * e * Math.abs(c) + "%";
                        }
                        if (u = c < 0 ? `calc(${u}px + (${v * Math.abs(c)}%))` : c > 0 ? `calc(${u}px + (-${v * Math.abs(c)}%))` : `${u}px`, 
                        !t.isHorizontal()) {
                            const e = h;
                            h = u, u = e;
                        }
                        const y = c < 0 ? "" + (1 + (1 - f) * c) : "" + (1 - (1 - f) * c), E = `\n        translate3d(${u}, ${h}, ${m}px)\n        rotateZ(${a.rotate ? g : 0}deg)\n        scale(${y})\n      `;
                        if (a.slideShadows) {
                            let e = o.find(".swiper-slide-shadow");
                            0 === e.length && (e = ie(a, o)), e.length && (e[0].style.opacity = Math.min(Math.max((Math.abs(c) - .5) / .5, 0), 1));
                        }
                        o[0].style.zIndex = -Math.abs(Math.round(d)) + e.length;
                        se(a, o).transform(E);
                    }
                },
                setTransition: e => {
                    const {transformEl: s} = t.params.cardsEffect;
                    (s ? t.slides.find(s) : t.slides).transition(e).find(".swiper-slide-shadow").transition(e), 
                    ae({
                        swiper: t,
                        duration: e,
                        transformEl: s
                    });
                },
                perspective: () => !0,
                overwriteParams: () => ({
                    watchSlidesProgress: !0,
                    virtualTranslate: !t.params.cssMode
                })
            });
        } ];
        return V.use(re), V;
    }));
    function initSliders() {
        if (document.querySelector(".team__inner")) new core(".team__inner", {
            modules: [ Navigation ],
            observer: true,
            observeParents: true,
            slidesPerView: 1.3,
            spaceBetween: 20,
            autoHeight: true,
            speed: 800,
            loop: true,
            navigation: {
                prevEl: ".swiper-button-prev",
                nextEl: ".team__arrow"
            },
            breakpoints: {
                600: {
                    slidesPerView: 2.3
                },
                992: {
                    slidesPerView: 3.3
                },
                1024: {
                    slidesPerView: 4.3
                }
            },
            on: {}
        });
        if (document.querySelector(".reviews__inner")) new core(".reviews__inner", {
            observer: true,
            observeParents: true,
            slidesPerView: 1.3,
            spaceBetween: 20,
            autoHeight: true,
            speed: 800,
            loop: false,
            breakpoints: {
                500: {
                    slidesPerView: 2.3
                },
                768: {
                    slidesPerView: 3.3
                },
                900: {
                    slidesPerView: 4.3
                },
                1100: {
                    slidesPerView: 5
                }
            },
            on: {}
        });
    }
    window.addEventListener("load", (function(e) {
        initSliders();
    }));
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
    formSubmit();
})();