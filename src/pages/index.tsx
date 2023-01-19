import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import moment from "moment";

import styles from "./index.module.css";
import SVGImage from "../components/SVGImage";
import { usePluginData } from "@docusaurus/useGlobalData";
import * as Arrow from "@site/static/img/arrow.svg";

const heroImage = require("@site/static/img/hero-graphic.svg");
const faceWinking = require("@site/static/img/face-winking.png");
const chefHat = require("@site/static/img/chef-hat.png");

const NewSection = () => {
  const { snippets } = usePluginData("example-code-snippets") as {
    snippets: {
      author: string;
      publishDate: string;
      title: string;
    }[];
  };

  const mostRecentRecipe = snippets.sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )[0];

  const igniteReleaseVersion = "v8.4.6";
  const igniteReleaseDate = moment("2023-01-11").diff(moment(), "days");

  return (
    <div className={styles.newSection}>
      <div className={styles.notificationSection}>
        <div className={styles.notificationTag}>
          <p className={styles.notificationTagText}>New Recipe</p>
        </div>
        <h3 className={styles.notificationTitle}>{mostRecentRecipe.title}</h3>
        <p className={styles.notificationDate}>
          {`Last updated on `}
          <b>{moment(mostRecentRecipe.publishDate).format("MMMM Do, YYYY")}</b>
          {` by `}
          <b>{mostRecentRecipe.author}</b>
        </p>
        <Link
          className={styles.notificationLink}
          to={`/docs/recipes/${mostRecentRecipe.title.replace(/\s+/g, "")}`}
        >
          <b className={styles.notificationLinkText}>View recipe</b>
          <Arrow.default />
        </Link>
      </div>
      <div className={styles.notificationSection}>
        <p className={styles.notificationTagText}>Releases</p>
        <h3 className={styles.notificationTitle}>Ignite Maverick</h3>
        <p className={styles.notificationDate}>
          <b>{igniteReleaseVersion}</b> released{" "}
          <b>{igniteReleaseDate * -1} days ago</b>
        </p>
        <Link
          className={styles.notificationLink}
          href={`https://github.com/infinitered/ignite/releases/tag/${igniteReleaseVersion}`}
        >
          <b className={styles.notificationLinkText}>View on Github</b>
          <Arrow.default />
        </Link>
      </div>
    </div>
  );
};

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
            <img src={chefHat.default} alt="Chef's Hat" />
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
      <NewSection />
      <HomepageHeader />
      <main className={styles.mainContainer}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
