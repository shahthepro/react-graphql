import Reset from "../components/Reset";

const ResetPasswordPage = props => {
  return (
    <div>
      <Reset resetToken={props.query.resetToken}/>
    </div>
  );
};

export default ResetPasswordPage;