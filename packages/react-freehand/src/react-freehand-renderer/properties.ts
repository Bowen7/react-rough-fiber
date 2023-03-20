import { isUnitlessNumber, STYLE, CHILDREN } from './constants';
import { getPropertyInfo, BOOLEAN, OVERLOADED_BOOLEAN } from './dom-property';

const setValueForStyles = (
  node: Element,
  styles: { [name: string]: string | number }
) => {
  const style = (node as HTMLElement).style;
  for (const styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    const isCustomProperty = styleName.indexOf('--') === 0;
    if (isCustomProperty) {
      style.setProperty(styleName, styles[styleName] as string);
    } else {
      let value = styles[styleName];
      if (
        !isCustomProperty &&
        typeof value === 'number' &&
        value !== 0 &&
        !(
          isUnitlessNumber.hasOwnProperty(styleName) &&
          styleName in isUnitlessNumber
        )
      ) {
        value = value.toString() + 'px';
      }
      style[styleName as any] = styles[styleName] as string;
    }
  }
};

export const setInitialDOMProperties = (
  domElement: Element,
  nextProps: object
) => {
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    const nextProp = nextProps[propKey as keyof typeof nextProps];
    if (propKey === STYLE) {
      setValueForStyles(
        domElement,
        nextProp as { [name: string]: string | number }
      );
    } else if (propKey === CHILDREN) {
      domElement.textContent = nextProp as string;
    }
  }
};

export const setValueForProperty = (
  node: Element,
  name: string,
  value: any
) => {
  const propertyInfo = getPropertyInfo(name);
  if (propertyInfo === null) {
    return;
  }
  const { attributeName } = propertyInfo;
  if (value === null) {
    node.removeAttribute(attributeName);
  } else {
    const { type } = propertyInfo;
    let attributeValue;
    if (type === BOOLEAN || (type === OVERLOADED_BOOLEAN && value === true)) {
      attributeValue = '';
    } else {
      attributeValue = value.toString();
    }
    node.setAttribute(attributeName, attributeValue);
  }
};

export const diffProperties = (prevProps: object, nextProps: object) => {};
