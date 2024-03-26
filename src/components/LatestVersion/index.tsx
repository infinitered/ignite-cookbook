import React, { useState, useEffect } from "react"
import Link from "@docusaurus/Link"
import moment from "moment"

// Bringing in the styles from the `pages/index.module.css` file to not have to duplicate the styles (nothing is new in this component)
import styles from "../../pages/index.module.css"
import * as Arrow from "@site/static/img/arrow.svg"

interface Release {
  tag_name: string
  published_at: string
}

interface ReleaseRemarkProps {
  latestVersion: string
  latestReleaseDate: string
}

const ReleaseRemark = ({
  latestVersion,
  latestReleaseDate,
}: ReleaseRemarkProps) => {
  const daysSinceRelease = moment(latestReleaseDate).diff(moment(), "days") * -1
  const releaseString =
    daysSinceRelease === 0
      ? "today"
      : `${moment.duration(daysSinceRelease, "days").humanize()} ago`
  return (
    <>
      <b>{latestVersion}</b> released <b>{releaseString}</b>
    </>
  )
}

const LatestRelease = () => {
  const [latestVersion, setLatestVersion] = useState<string>("")
  const [latestReleaseDate, setLatestReleaseDate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.github.com/repos/infinitered/ignite/releases/latest")
      .then((response) => response.json())
      .then((data: Release) => {
        setLatestReleaseDate(data.published_at)
        setLatestVersion(data.tag_name)
        setLoading(false)
      })
      .catch((error) => console.error("Error fetching latest release:", error))
  }, [])

  return (
    <>
      <p className={styles.notificationTagText}>Latest Ignite Release</p>
      {loading ? (
        <Link
          className={styles.notificationLink}
          href={`https://github.com/infinitered/ignite/releases/latest`}
        >
          <b className={styles.notificationLinkText}>View on Github</b>
          <Arrow.default />
        </Link>
      ) : (
        <>
          <h3 className={styles.notificationTitle}>
            <Link
              className={styles.notificationTitleLink}
              href={`https://github.com/infinitered/ignite/releases/tag/${latestVersion}`}
            >
              Ignite
            </Link>
          </h3>
          <p className={styles.notificationDate}>
            <ReleaseRemark
              latestVersion={latestVersion}
              latestReleaseDate={latestReleaseDate}
            />
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
    </>
  )
}

export default LatestRelease
