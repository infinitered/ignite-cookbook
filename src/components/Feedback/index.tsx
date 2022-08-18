import React, { useEffect, useState } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import styles from './styles.module.css';

const VotedYes = () => {
  return <span>Thanks for your feedback. We are glad you like it :)</span>;
};

const VotedNo = () => {
  return <span>Thanks for your feedback. We will try to improve :(</span>;
};

export default function Feedback({ resource }) {
  const [reaction, setReaction] = useState(null);

  const isReacted = reaction === 'Yes' || reaction === 'No';

  const handleReaction = (params) => {
    setReaction(params.icon);
  };

  useEffect(() => {
    if (ExecutionEnvironment.canUseDOM) {
      window.HappyReact.init({
        onReaction: handleReaction,
      });
    }
  }, []);

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>Was this page helpful?</h3>
      {!isReacted ? (
        <div
          className={styles.widget}
          data-hr-token="316e1fbe-76cf-431a-90e5-5ee7072a8289"
          data-hr-resource={resource}
          data-hr-styles={JSON.stringify({
            container: styles.container,
            grid: styles.grid,
            cell: styles.cell,
            reaction: styles.reaction,
            footer: styles.footer,
          })}
        />
      ) : reaction === 'No' ? (
        <VotedNo />
      ) : (
        <VotedYes />
      )}
    </div>
  );
}
