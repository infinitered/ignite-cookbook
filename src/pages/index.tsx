import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";
import SVGImage from "../components/SVGImage";

const heroImage = require("@site/static/img/hero-graphic.svg");
const faceWinking = require("@site/static/img/face-winking.png");
const chefHat = require("@site/static/img/chef-hat.png");

const title = "Proven Recipes for your React Native apps";
const description =
  "Starting from scratch doesn’t always make sense. That’s why we made the Ignite Cookbook for React Native – an easy way for developers to browse and share code snippets (or “recipes”) that actually work. ";

function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroImage}>
        <SVGImage Svg={heroImage.default} classNameOverride="heroImage" />
      </div>
      <div className={styles.headerRight}>
        <div className="titleContainer">
          <img src={faceWinking.default} className={styles.faceWinking} />
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroSubtitle}>{description}</p>
        </div>
        <div className={styles.buttons}>
          <Link
            className={styles.heroButton}
            to="/docs/intro"
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <img src={chefHat.default} alt="chefHatSvg" />
            <p className={styles.buttonTitle}>Let's get cooking</p>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Cooking up some great Ignite Recipes for React Native."
    >
      <HomepageHeader />
      <main className={styles.mainContainer}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
