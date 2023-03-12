import { Props } from "./types";
import { STYLE, CHILDREN, CLASS_NAME } from "./constants";

const camelToDashCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const dangerousStyleValue = (
  value: React.CSSProperties[keyof React.CSSProperties]
) => {
  const isEmpty = value == null || typeof value === "boolean" || value === "";
  if (isEmpty) {
    return "";
  }
  return ("" + value).trim();
};

const setValueForStyles = (
  element: SVGElement,
  styles: React.CSSProperties
) => {
  const style = element.style;
  for (let styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    const styleValue = dangerousStyleValue(
      styles[styleName as keyof React.CSSProperties]
    );
    style.setProperty(styleName, styleValue);
  }
};

export const setInitialProperties = (
  tag: string,
  element: SVGElement,
  nextProps: Props
) => {
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    const nextProp = nextProps[propKey];
    switch (propKey) {
      case STYLE:
        setValueForStyles(element, nextProp);
        break;
      case CHILDREN: {
        if (typeof nextProp === "string" || typeof nextProp === "number") {
          element.textContent = nextProp as string;
        }
      }
      case CLASS_NAME: {
        element.setAttribute("class", nextProp as string);
      }
      default:
        break;
    }
  }
};
