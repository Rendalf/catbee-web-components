var helper = {
  ELEMENT_NODE_TYPE: 1,
  ATTRIBUTE_NODE_TYPE: 2,
  COMPONENT_PREFIX: 'cat-',
  COMPONENT_ID: '$catbeeId',
  COMPONENT_PREFIX_REGEXP: /^cat-/i,
  DOCUMENT_COMPONENT_NAME: 'document',
  DOCUMENT_ELEMENT_NAME: 'html',
  DOCUMENT_TAG_NAME: 'HTML',
  HEAD_TAG_NAME: 'HEAD',
  SLOT_TAG_NAME: 'SLOT',
  HEAD_COMPONENT_NAME: 'head',

  /**
   * Determines if specified component name is the "document" component name.
   * @param {string} componentName - Name of the component.
   * @returns {boolean} True if specified component is the "document" component.
   */
  isDocumentComponent (componentName) {
    return componentName.toLowerCase() === helper.DOCUMENT_COMPONENT_NAME;
  },
  /**
   * Determines if specified component name is the "head" component name.
   * @param {string} componentName - Name of the component.
   * @returns {boolean} True if specified component is the "head" component.
   */
  isHeadComponent (componentName) {
    return componentName.toLowerCase() === helper.HEAD_COMPONENT_NAME;
  },

  /**
   * Determines if the DOM node is a component element.
   * @param {Node} node The DOM node.
   */
  isComponentNode (node) {
    return node.nodeType === helper.ELEMENT_NODE_TYPE &&
      (
        helper.COMPONENT_PREFIX_REGEXP.test(node.nodeName) ||
        node.nodeName === helper.HEAD_TAG_NAME ||
        node.nodeName === helper.DOCUMENT_TAG_NAME
      );
  },

  /**
   * Determines if the DOM node is a slot.
   * @param {Node} node - The DOM node.
   * @returns {Boolean}
   */
  isSlotNode (node) {
    return node.nodeType === helper.ELEMENT_NODE_TYPE && node.nodeName === helper.SLOT_TAG_NAME;
  },

  /**
   * Gets the original component name without prefix.
   * @param {String} fullComponentName - Full component name (tag name).
   * @returns {String} The original component name without prefix.
   */
  getOriginalComponentName (fullComponentName) {
    if (typeof (fullComponentName) !== 'string') {
      return '';
    }
    fullComponentName = fullComponentName.toLowerCase();
    if (fullComponentName === helper.HEAD_COMPONENT_NAME) {
      return fullComponentName;
    }
    if (fullComponentName === helper.DOCUMENT_COMPONENT_NAME ||
      fullComponentName === helper.DOCUMENT_ELEMENT_NAME) {
      return helper.DOCUMENT_COMPONENT_NAME;
    }
    return fullComponentName.replace(helper.COMPONENT_PREFIX_REGEXP, '');
  },

  /**
   * Gets valid tag name for component.
   * @param {String} componentName - Name of the component.
   * @returns {String} Name of the tag.
   */
  getTagNameForComponentName (componentName) {
    if (typeof (componentName) !== 'string') {
      return '';
    }
    var upperComponentName = componentName.toUpperCase();
    if (componentName === helper.HEAD_COMPONENT_NAME) {
      return upperComponentName;
    }
    if (componentName === helper.DOCUMENT_COMPONENT_NAME) {
      return helper.DOCUMENT_ELEMENT_NAME.toUpperCase();
    }
    return helper.COMPONENT_PREFIX.toUpperCase() + upperComponentName;
  },

  /**
   * Gets method of the module that can be invoked.
   * @param {Object} module - Module implementation.
   * @param {String} prefix - Method prefix (i.e. handle).
   * @param {String?} name - Name of the entity to invoke method for (will be converted to camel casing).
   * @returns {Function} Method to invoke.
   */
  getMethodToInvoke (module, prefix, name) {
    if (!module || typeof (module) !== 'object') {
      return defaultPromiseMethod;
    }
    var methodName = helper.getCamelCaseName(prefix, name);
    if (typeof (module[methodName]) === 'function') {
      return module[methodName].bind(module);
    }
    if (typeof (module[prefix]) === 'function') {
      return module[prefix].bind(module, name);
    }

    return defaultPromiseMethod;
  },

  /**
   * Gets name in camel casing for everything.
   * @param {String} prefix - Prefix for the name.
   * @param {String} name - Name to convert.
   * @return {String}
   */
  getCamelCaseName (prefix, name) {
    if (!name) {
      return '';
    }

    var parts = name.split(/[^a-z0-9]/i);
    var camelCaseName = String(prefix || '');

    parts.forEach((part) => {
      if (!part) {
        return;
      }

      // first character in method name must be in lowercase
      camelCaseName += camelCaseName ? part[0].toUpperCase() : part[0].toLowerCase();
      camelCaseName += part.substring(1);
    });

    return camelCaseName;
  },

  /**
   * Gets safe promise resolved from action.
   * @param {Function} action Action to wrap with safe promise.
   * @returns {Promise}
   */
  getSafePromise (action) {
    var result;
    try {
      result = action();
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve(result);
  }
};

/**
 * Just returns resolved promise.
 * @returns {Promise} Promise for nothing.
 */
function defaultPromiseMethod () {
  return Promise.resolve();
}

module.exports = helper;
