import React from "react";
import styles from "./styles.module.css";

type SVGImageProps = {
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  classNameOverride?: string;
};

export default function SVGImage({
  Svg,
  classNameOverride,
}: SVGImageProps): JSX.Element {
  const className = classNameOverride ? " " + styles[classNameOverride] : "";
  return <Svg className={className} role="img" />;
}
