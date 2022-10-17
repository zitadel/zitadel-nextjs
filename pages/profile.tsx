import Link from 'next/link';

import styles from '../styles/Home.module.css';

export default function ProfileView() {
  return (
    <div className={styles.container}>
      <h1>Login successful</h1>
      <Link href="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
}
