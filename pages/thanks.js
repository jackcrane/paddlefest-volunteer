import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Success!</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Signup successful!</h1>

        <p className={styles.description}>
          Check your email for a copy of your responses and more information
          about paddlefest and your volunteer roles!
        </p>
      </main>
    </div>
  );
}
