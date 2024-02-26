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
import type { Snippet } from "../types";
import LatestRelease from "../components/LatestVersion";

const heroImage = require("@site/static/img/hero-graphic.svg");
const faceWinking = require("@site/static/img/face-winking.png");
const chefHat = require("@site/static/img/chef-hat.png");

const NewSection = () => {
  const { snippets } = usePluginData("example-code-snippets") as {
    snippets: Snippet[];
  };

  const mostRecentRecipe = snippets.sort(
    (a, b) =>
      new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  )[0];

  return (
    <div className={styles.newSection}>
      {mostRecentRecipe && (
        <div className={styles.notificationSection}>
          <div className={styles.notificationTag}>
            <p className={styles.notificationTagText}>New Recipe</p>
          </div>
          <h3 className={styles.notificationTitle}>{mostRecentRecipe.title}</h3>
          <p className={styles.notificationDate}>
            {`Published on `}
            <b>
              {moment(mostRecentRecipe.publish_date).format("MMMM Do, YYYY")}
            </b>
            {` by `}
            <b>{mostRecentRecipe.author}</b>
          </p>
          <Link
            className={styles.notificationLink}
            to={`/docs/recipes/${mostRecentRecipe.doc_name.split(".")[0]}`}
          >
            <b className={styles.notificationLinkText}>View recipe</b>
            <Arrow.default />
          </Link>
        </div>
      )}
      <div className={styles.notificationSection}>
        <LatestRelease />
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

function FreshRecipes() {
  const { snippets } = usePluginData("example-code-snippets") as {
    snippets: {
      author: string;
      publish_date: string;
      title: string;
      doc_name: string;
    }[];
  };

  const mostRecentRecipes = snippets.sort(
    (a, b) =>
      new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime()
  );

  return (
    <div className={styles.freshSection}>
      <p className={styles.freshSectionHeader}>Freshly added to the cookbook</p>
      {mostRecentRecipes.slice(0, 4).map((recipe, index) => {
        return (
          <Link
            key={index}
            to={`/docs/recipes/${recipe.doc_name.split(".")[0]}`}
            className={styles.recipeWrapper}
          >
            {moment(recipe.publish_date).diff(moment(), "days") * -1 < 31 && (
              <div className={styles.freshSectionTag}>
                <p className={styles.freshSectionTagText}>New</p>
              </div>
            )}
            <h3 className={styles.freshSectionTitle}>{recipe.title}</h3>
            <p className={styles.freshSectionDate}>
              {`Published on `}
              <b>{moment(recipe.publish_date).format("MMMM Do, YYYY")}</b>
              {` by `}
              <b>{recipe.author}</b>
            </p>
          </Link>
        );
      })}
      <Link to="/docs/intro" className={styles.viewAllRecipes}>
        View all recipes
      </Link>
    </div>
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
        <FreshRecipes />
      </main>
    </Layout>
  );
}
