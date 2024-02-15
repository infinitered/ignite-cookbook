import React, { useState } from "react";
import styles from "./styles.module.css";

import * as ThumbsUp from "@site/static/img/thumbs-up.svg";
import * as ThumbsDown from "@site/static/img/thumbs-down.svg";

const VotedYes = () => {
  return (
    <span>Thanks for your feedback! We hope this recipe has been helpful.</span>
  );
};

const VotedNo = () => {
  return (
    <span>
      Thanks for your feedback. We will update this recipe as soon as we can.
    </span>
  );
};

type ReactionValue = "yes" | "no";

export default function Feedback({ resourceId }: { resourceId: string }) {
  const [reaction, setReaction] = useState<ReactionValue | null>(null);

  const isReacted = reaction === "yes" || reaction === "no";

  const handleReaction = (reaction: ReactionValue) => {
    setReaction(reaction);

    // track using Google Analytics custom event
    // include the resource name and yes/no in the event name for tracking purposes
    // gtag is not defined in dev, see https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-google-gtag
    gtag("event", `feedback_${resourceId}_${reaction}`, {
      event_category: "feedback",
      event_label: resourceId,
    });
  };

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>
        Is this page still up to date? Did it work for you?
      </h3>
      {!isReacted ? (
        <div className={styles.grid}>
          <button
            className={styles.reactionButton}
            onClick={() => handleReaction("yes")}
            aria-label="Yes"
          >
            <ThumbsUp.default className={styles.reactionIcon} />
            <div className={styles.reactionText}>Yes</div>
          </button>
          <button
            className={styles.reactionButton}
            onClick={() => handleReaction("no")}
            aria-label="No"
          >
            <ThumbsDown.default className={styles.reactionIcon} />
            <div className={styles.reactionText}>No</div>
          </button>
        </div>
      ) : reaction === "no" ? (
        <VotedNo />
      ) : (
        <VotedYes />
      )}
    </div>
  );
}
