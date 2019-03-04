import Nav from './Nav';

const Header = () => (
  <div>
      <div className="baz">
        <a href="">DemoApp</a>
        <Nav />
      </div>
      <div className="sub-bar">
        <p>Search</p>
      </div>
      <div>Cart</div>
  </div>
);

export default Header;