import styled from 'styled-components';
import Signup from "../components/Signup";

const Columns = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const SignupPage = props => {
  return (
    <Columns>
      <Signup></Signup>
      <Signup></Signup>
      <Signup></Signup>
    </Columns>
  );
};

export default SignupPage;