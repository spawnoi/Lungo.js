/**
 * Load Resources
 *
 * @namespace LUNGO.Boot
 * @class Resources
 *
 * @author Javier Jimenez Villar <javi@tapquo.com> || @soyjavi
 */

LUNGO.Boot.Resources = (function(lng, $$, undefined) {

    var RESOURCE_KEYS = {
        SECTIONS: 'sections',
        TEMPLATES: 'templates'
    }

    /**
     * Start loading async sections (local & remote)
     *
     * @method start
     *
     */
    var start = function() {
        var resources = lng.App.get('resources');
        for (resource_key in resources) {
            _loadResources(resource_key, resources[resource_key]);
        }
    };

    var _loadResources = function(resource_key, resources, callback) {
        for (index in resources) {
            var url = _parseUrl(resources[index], resource_key);
            var response = _loadAsyncSection(url);

            if (resource_key === RESOURCE_KEYS.SECTIONS) {
                _pushSectionInLayout(response);
            } else {
                _createTemplate(response);
            }
        }
    };

    var _parseUrl = function(section_url, folder) {
        return (/http/.test(section_url)) ? section_url : 'app/' + folder + '/' + section_url;
    };

    var _loadAsyncSection = function(url) {
        return $$.ajax({
            url: url,
            async: false,
            dataType: 'html',
            error: function() {
                console.error('[ERROR] Loading url', arguments);
            }
        });
    };

    var _pushSectionInLayout = function(section) {
        if (lng.Core.toType(section) === 'string') {
            lng.dom('body').append(section);
        }
    };

    var _createTemplate = function(markup) {
        var div = document.createElement('DIV');
        div.innerHTML = markup;

        var template_id = lng.dom(div.firstChild).data('template');

        if (template_id) {
            lng.View.Template.create(template_id, markup);
        }
    };

    return {
        start: start
    };

})(LUNGO, Quo);