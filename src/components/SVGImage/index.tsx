import React from "react";
import styles from "./styles.module.css";

type SVGImageProps = {
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
};

export default function SVGImage({ Svg }: SVGImageProps): JSX.Element {
  return <Svg className={styles.mainSvg} role="img" />;
}
