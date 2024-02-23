import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import moment from "moment";

import styles from "../../pages/index.module.css";
import * as Arrow from "@site/static/img/arrow.svg";

interface Release {
  tag_name: string;
  published_at: string;
}

const LatestRelease = () => {
  const [latestVersion, setLatestVersion] = useState<string>("");
  const [latestReleaseDate, setLatestReleaseDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/repos/infinitered/ignite/releases/latest")
      .then((response) => response.json())
      .then((data: Release) => {
        setLatestReleaseDate(data.published_at);
        setLatestVersion(data.tag_name);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching latest release:", error));
  }, []);

  const daysSinceRelease =
    moment(latestReleaseDate).diff(moment(), "days") * -1;

  return (
    <div>
      <p className={styles.notificationTagText}>Latest Release</p>
      <h3 className={styles.notificationTitle}>Ignite Exp[ress]o ☕️</h3>
      {loading ? (
        <b style={{ margin: 10 }}>Checking...</b>
      ) : (
        <>
          <p className={styles.notificationDate}>
            {daysSinceRelease === 0 ? (
              <>
                <b>{latestVersion}</b> released today!
              </>
            ) : (
              <>
                <b>{latestVersion}</b> released{" "}
                <b>
                  {daysSinceRelease} day{daysSinceRelease === 1 ? "" : "s"} ago
                </b>
              </>
            )}
          </p>
          <Link
            className={styles.notificationLink}
            href={`https://github.com/infinitered/ignite/releases/tag/${latestVersion}`}
          >
            <b className={styles.notificationLinkText}>View on Github</b>
            <Arrow.default />
          </Link>
        </>
      )}
    </div>
  );
};

export default LatestRelease;
