package com.hida.ui

/**
 * Created by arief.hidayat on 14/10/2014.
 */
class TypeAheadUtil {

    static void setupBasicAttrs(Map attrs, String domain, String displayKey,
                                String domainIdField, String domainDisplayField = displayKey) {
        attrs.items = "all"; attrs.minLength = "1";
        attrs.domain = domain; attrs.displayKey = displayKey;

        attrs.parentInstance = attrs.for ?: "ta$domain"; attrs.field = attrs.field ?: domainDisplayField;
        if(!attrs.populatedFieldsConf) attrs.populatedFieldsConf = [:]
        if(attrs.populatedFieldsConf.isEmpty()) {
            if(domainIdField) attrs.populatedFieldsConf.put(domainIdField, 'id')
            attrs.populatedFieldsConf.put(domainDisplayField, displayKey)
        }
        if(attrs.parentValue) {
            attrs.value = attrs.value ?: attrs.parentValue["${attrs.field}"]
            if(!attrs.fields && !(attrs.populatedFieldsConf).isEmpty()) {
                def fieldData = [:]
                attrs.populatedFieldsConf.each { String fieldNm, v ->
                    fieldData[v] = attrs.parentValue[fieldNm]
                }
                attrs.fields = fieldData
            }
        } else {
            if(!attrs.fields && !(attrs.populatedFieldsConf).isEmpty()) {
                if(domainIdField) {
                    attrs.fields = [:]
                    attrs.populatedFieldsConf.each { String fieldNm, originalFieldNm ->
                        attrs.fields.put(originalFieldNm, fieldNm == displayKey ? attrs.value : null )
                    }
                }
            }
        }
    }
}
