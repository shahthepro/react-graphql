import RequireSignin from '../components/RequireSignin';
import Permissions from '../components/Permissions';

const PermissionsPage = props => {
  return (
    <div>
      <RequireSignin>
        <Permissions></Permissions>
      </RequireSignin>
    </div>
  );
};

export default PermissionsPage;