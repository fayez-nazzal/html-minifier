import type { NextPage } from "next";
import React, { useEffect } from "react";
import RetroArrow from "../components/RetroArrow/index";
import { playTrackWithLowVolume } from "../utilities";

const Home: NextPage = () => {
  const [isHTMLPasted, setIsHTMLPasted] = React.useState(false);
  const [html, setHtml] = React.useState("");
  const [isHTMLMinified, setIsHTMLMinified] = React.useState(false);
  const [isErrorShown, setIsErrorShown] = React.useState(false);
  const [hasMinifiedBefore, setHasMinifiedBefore] = React.useState(false);

  useEffect(() => {
    setIsErrorShown(false);
  }, [html]);

  useEffect(() => {
    isHTMLMinified && setHasMinifiedBefore(true);
  }, [isHTMLMinified]);

  const onHTMLPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setIsHTMLPasted(true);

    setHtml(event.currentTarget.value);
  };

  const onHTMLChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtml(event.target.value);

    setIsHTMLMinified(false);

    playTrackWithLowVolume("sounds/type.wav");
  };

  const onMinifyAndCopyClick = async () => {
    if (!html) {
      setIsErrorShown(true);

      playTrackWithLowVolume("sounds/err.wav");

      return;
    }

    if (isHTMLMinified) return;

    const response = await fetch("/api/minify-html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html,
      }),
    }).then((res) => res.json());

    setHtml(response.minifiedHTML);
    setIsHTMLMinified(true);

    navigator.clipboard.writeText(response.minifiedHTML);

    playTrackWithLowVolume("sounds/success.wav");
  };

  return (
    <>
      <h1>
        <img src="/favicon.png" alt="favicon" style={{ marginRight: 8 }} />
        <span>HTML Minifier</span>
      </h1>

      <RetroArrow
        text="Paste HTML here"
        degree={45}
        shown={!isHTMLPasted && !hasMinifiedBefore}
        domTarget={
          typeof window !== "undefined" && document.querySelector("textarea")
        }
        relativePos="top-right"
      />

      <textarea
        onPaste={onHTMLPaste}
        onChange={onHTMLChange}
        data-testid="html-textarea"
        value={html}
        className={isHTMLMinified ? "scale-in-out" : ""}
      />

      <button
        onClick={onMinifyAndCopyClick}
        className={!html ? "disabled" : ""}
      >
        Minify and Copy
      </button>

      <div
        className={`error ${isErrorShown ? "error--shown" : ""}`}
        style={{
          visibility: isErrorShown ? "visible" : "hidden",
        }}
      >
        Paste your HTML first
      </div>

      <div
        className={`success ${isHTMLMinified ? "success--shown" : ""}`}
        style={{
          visibility: isHTMLMinified ? "visible" : "hidden",
        }}
      >
        Minified HTML is copied to your clipboard
      </div>

      <RetroArrow
        shown={isHTMLPasted && !hasMinifiedBefore}
        text="Now click here"
        degree={135}
        domTarget={
          typeof window !== "undefined" && document.querySelector("button")
        }
        relativePos="bottom-right"
      />

      <h3>Created by Fayez Nazzal</h3>
    </>
  );
};

export default Home;
