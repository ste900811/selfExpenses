import Link from 'next/link';
import navStyles from '../styles/Nav.module.css';

const Nav = ()  => {
  return (
    <nav className={navStyles.nav}>
      <ul>
        <li>
          <Link href='/' className={navStyles.title}>selfExpense</Link>
        </li>
        <li>
          <Link href='/insertDeleteExpense'>Insert</Link>
        </li>
        <li>
          <Link href='/testingPage'>testing</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav;
