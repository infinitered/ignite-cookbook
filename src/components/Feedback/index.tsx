import React, { useEffect, useState } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import styles from './styles.module.css';

const VotedYes = () => {
  return <span>Thanks for your feedback! We hope this recipe has been helpful.</span>;
};

const VotedNo = () => {
  return <span>Thanks for your feedback. We will update this recipe as soon as we can.</span>;
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
      <h3 className={styles.title}>Is this page still up to date? Did it work for you?</h3>
      {!isReacted ? (
        <div
          className={styles.widget}
          data-hr-token="4ab1ef36-87f3-4637-8c37-a80473d7505a"
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
