import { astarFacts } from '../const';

interface Props {
    badges: number;
  }

const InkFacts = ( {badges}: Props) => {
  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: astarFacts[badges] }} />
    </div>
  );
};

export default InkFacts;
