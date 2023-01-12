import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import { usePluginData } from "@docusaurus/useGlobalData";

const faceLookingDown = require("@site/static/img/face-looking-down.png");
const cardButtons = require("@site/static/img/card-buttons.png");
const cardControls = require("@site/static/img/card-controls.png");
const cardTextStyles = require("@site/static/img/card-text-styles.png");
const monocle = require("@site/static/img/monocle.png");
const screenComponents = require("@site/static/img/screen-components.png");
const screenMenu = require("@site/static/img/screen-menu.png");

type FeatureItem = {
  title: string;
  Component:
    | React.ComponentType
    | React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Spin Up Your App In Record Time",
    Component: () => {
      const ref = useRef();
      const inViewport = useIntersection(ref, "0px");
      const [transition, setTransition] = useState(false);
      const [monocleTransition, setMonocleTransition] = useState(false);

      useEffect(() => {
        if (inViewport) {
          const timeout = setTimeout(() => setTransition(true), 500);
          const monocleTimeout = setTimeout(
            () => setMonocleTransition(true),
            1000
          );
          return () => {
            clearTimeout(timeout);
            clearTimeout(monocleTimeout);
          };
        }
      }, [inViewport]);

      return (
        <div className={styles.imageOneContainer} ref={ref}>
          <img
            src={cardButtons.default}
            className={`${styles.cardButtonsInitial} ${
              transition ? styles.cardButtonsFinal : ""
            }`}
          />
          <img
            src={cardControls.default}
            className={`${styles.cardControlsInitial} ${
              transition ? styles.cardControlsFinal : ""
            }`}
          />
          <img
            src={cardTextStyles.default}
            className={`${styles.cardTextStylesInitial} ${
              transition ? styles.cardTextStylesFinal : ""
            }`}
          />
          <img
            src={screenComponents.default}
            className={`${styles.screenComponentsInitial} ${
              transition ? styles.screenComponentsFinal : ""
            }`}
          />
          <img
            src={screenMenu.default}
            className={`${styles.screenMenuInitial} ${
              transition ? styles.screenMenuFinal : ""
            }`}
          />
          <img
            src={monocle.default}
            className={`${styles.monocleInitial} ${
              monocleTransition ? styles.monocleFinal : ""
            }`}
          />
        </div>
      );
    },
    description: (
      <>
        Stop reinventing the wheel on every project. Use the Ignite CLI to get
        your app started. Then, hop over to the Ignite Cookbook for React Native
        to browse for things like libraries in “cookie cutter” templates that
        work for almost any project. It’s the fastest way to get a React Native
        app off the ground.
      </>
    ),
  },
  {
    title: "Find Quality Code When You Need It",
    Component: () => {
      const { snippets } = usePluginData("example-code-snippets") as {
        snippets: { author: string; content: string; lastUpdated: string }[];
      };

      const [show, setShow] = useState(false);
      const [current, setCurrent] = useState(0);
      useEffect(() => {
        const interval = setInterval(() => {
          setShow(false);
          setCurrent((current) => (current + 1) % snippets.length);
          setTimeout(() => setShow(true), 1000);
        }, 3300);
        return () => clearInterval(interval);
      }, [snippets]);

      const snippet = show
        ? snippets[current]
        : { author: "", content: "", lastUpdated: "..." };

      return (
        <div className={styles.imageTwoContainer}>
          <div className={styles.codeSnippet}>
            <div
              className={styles.scrollBar}
              style={show ? { transform: `translateY(376px)` } : {}}
            />
            <pre
              style={!show ? { opacity: 0, transform: `translateY(50px)` } : {}}
            >
              {snippet.content}
            </pre>
          </div>

          <div className={styles.timeStamp}>
            <div className={styles.timeStampText}>
              updated
              <span> {snippet.lastUpdated}</span>
              <span>{show && " by " + snippet.author}</span>
            </div>
          </div>
          <img
            className={styles.faceLookingDown}
            src={faceLookingDown.default}
          />
        </div>
      );
    },
    description: (
      <>
        The popular forum sites are great for finding code until you realize
        it’s based on an old version of React Native. Ignite Cookbook is a place
        for recipes that work as of the time they’re published – meaning, it
        worked when it was posted. And if it ever goes out of date, we’ll make
        sure the community knows on what version it was last working.
      </>
    ),
  },
  {
    title: "Backed By A Community of React Native Experts",
    Component: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        The Ignite Cookbook isn’t just a random group of code snippets. It’s a
        curated collection of usable code samples that the Infinite Red team’s
        used in their own React Native projects. Having worked with some of the
        biggest clients in the tech industry, we know a thing or two about
        keeping our code to a high standard. You can code confidently!
      </>
    ),
  },
];

function Feature({ title, description, Component }: FeatureItem): JSX.Element {
  return (
    <div className={styles.rowContainer}>
      <div className={"col col--6 padding--top--md"}>
        <div className="text--left">
          <p className={styles.featureTitle}>{title}</p>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
      <div className={"col col--6"}>
        <div className={styles.featureComponentContainer}>
          <Component className={styles.featureComponent} />
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

const useIntersection = (element, rootMargin) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );

    element.current && observer.observe(element.current);

    return () => observer.unobserve(element.current);
  }, []);

  return isVisible;
};
