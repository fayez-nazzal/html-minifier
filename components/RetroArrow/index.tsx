import { useEffect, useState } from "react";
import { IRetroArrowProps } from "./index.types";

const RetroArrow = ({
  text,
  degree,
  shown,
  domTarget,
  relativePos,
}: IRetroArrowProps) => {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const onResize = () => {
    if (domTarget) {
      const { top, left, width, height } = domTarget.getBoundingClientRect();

      if (relativePos === "top-right") {
        setTop(top - 32);
        setLeft(width + 64);
      } else if (relativePos === "bottom-right") {
        setLeft(width + left - 8);
        setTop(top + height + 8);
      }
    }
  };

  useEffect(() => {
    onResize();

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [domTarget]);

  return (
    <div
      hidden={!shown}
      className={`fly-${degree}`}
      style={{ left, top, backgroundColor: "red", position: "absolute" }}
    >
      <div style={{ position: "relative", width: 200 }}>
        <h2 className={`guideline-text guideline-text--${degree}`}>{text}</h2>
        <div className={`arrow arrow--${degree}`} />
        <div className={`arrow arrow__shadow arrow__shadow--${degree}`} />
      </div>
    </div>
  );
};

export default RetroArrow;
