/*
 * Author: mr.lozchka
 *
 * Основан на документации http://specs.adfox.ru/page/99/
 *
 * NOTE: Нужен jQuery, но если не нужно поддерживать IE8, можно легко адаптировать код
 *
 */

'use strict';

/***********************
 * Adv Loader - AdFox  *
 ***********************
 */

var AdFoxLoader = function() {

    // По классу элементов ищем контейнеры для баннеров
    this.key_elements = {
        elements_adv: '.adfox-adv'
    }

    // $elements_adv - Сюда мы запишем найденные контейнеры
    // lib_src - библиотека адфокса,
    // архив библиотеки лежит на сервере AdFox http://specs.adfox.ru/uploads/adfox.reload_code.embeds.zip
    this.meta_adv = {
        $elements_adv: null,
        lib_src: '/_PATH_TO_LIB_/adfox.reload_code.embeds.js'
    }

    return this;
};

// Просто короткая запись прототипа (jQuery Style)
AdFoxLoader.fn = AdFoxLoader.prototype;

/*
 * Ищем контейнеры для баннеров
 *
 */

AdFoxLoader.fn.getAdFoxEl = function() {

    var $elements_adv = $(this.key_elements.elements_adv);

    this.meta_adv.$elements_adv = $elements_adv;

    return this;

};

/*
 * Получаем библиотеку AdFox
 *
 * ToDo - надо добавить кеширование на клиенте или проверить, может оно есть :) 
 *
 */

AdFoxLoader.fn.getAdFoxLib = function() {

    var self = this,
        lib_src = self.meta_adv.lib_src;
       
    $.getScript(lib_src)
        .done(function(data){
            self.initAdFoxAdv();
        })
        .fail(function(data){
            console.error(data);
        });

    return self;

};

/*
 * Инициализация коллекции баннеров.
 *
 * Работает только, когда есть библиотека AdFox (метод getAdFoxLib)
 *
 * <div id="ID_BANNERS" class="adfox-adv" data-src="ССЫЛКА_ЗАПРОСА_БАННЕРА"></div>
 *
 */

AdFoxLoader.fn.initAdFoxAdv = function() {

    var self = this,
        $adv = self.meta_adv.$elements_adv;
      
    // Пробегаемся по всем элементам и инициализируем каждый      
    $.each($adv, function(index, adv_obj) {

        var $adv_obj = $(adv_obj),
             adv_id = $adv_obj.attr('id'),
             adv_src = $adv_obj.attr('data-src');

        // Функция инициализации баннера
        self.initAdFoxUnit(adv_id, adv_src);

    });

    return self;

};

/*
 * Инициализация баннера
 *
 * @bannerPlaceId - id-аттрибут элемента, куда вставлять баннер
 * @requestSrc - ссылка запроса AdFox (можно получить из кода вставки)
 *
 */

AdFoxLoader.fn.initAdFoxUnit = function(bannerPlaceId, requestSrc) {

    var $adv_el = $('#' + bannerPlaceId),
         tgNS = window.ADFOX.RELOAD_CODE,
         initData = null;

    // Получаем баннерное место через сервис AdFox - tgNS
    initData = tgNS.initBanner(bannerPlaceId, requestSrc);

    // Вставляем в элемент
    $adv_el.html(initData.html);

    // Загружаем баннер методом сервиса AdFox
    tgNS.loadBanner(initData.pr1, requestSrc, initData.sessionId);

    return this;

};

/*
 * Инициализация модуля
 *
 */

AdFoxLoader.fn.init = function() {

    // Получаем элементы
    // Загружаем библиотеку
    this.getAdFoxEl()
        .getAdFoxLib();

    return this;

};