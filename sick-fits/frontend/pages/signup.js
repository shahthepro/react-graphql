import styled from 'styled-components';
import Signup from "../components/Signup";
import Signin from '../components/SIgnin';
import RequestReset from '../components/RequestReset';

const Columns = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const SignupPage = props => {
  return (
    <Columns>
      <Signup />
      <Signin />
      <RequestReset />
    </Columns>
  );
};

export default SignupPage;