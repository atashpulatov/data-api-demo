import { propsProxy } from "./enum-props-proxy";

export const PopupTypeEnum = new Proxy({
    /**
     * propertyAlias: propertyName,
     */
    navigationTree: 'navigation-tree',
}, propsProxy);
