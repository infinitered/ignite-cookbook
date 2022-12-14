import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Spin Up Your App In Record Time",
    Svg: require("@site/static/img/cookbook_main_graphic.svg").default,
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
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
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
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
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

function Feature({ title, Svg, description }: FeatureItem): JSX.Element {
  return (
    <div className={clsx("row")}>
      <div className={clsx("col col--6")}>
        <div className="text--left padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className={clsx("col col--6")}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
