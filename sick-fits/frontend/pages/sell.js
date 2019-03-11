import Link from 'next/link';
import CreateItem from '../components/CreateItem';
import RequireSignin from '../components/RequireSignin';

const Sell = props => {
  return (
    <div>
      <RequireSignin>
        <CreateItem/>
      </RequireSignin>
    </div>
  );
};

export default Sell;