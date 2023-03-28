import Head from "next/head";
import { signOutUser } from "./api/auth/firebase";
import { useRouter } from "next/router";
import { Header } from "./components/header";
import styles from "./dashboard.module.css";
import { useState, useEffect } from "react";
import { Chat } from "./components/chat";

export default function Dashboard(props) {
  const { user, setUser } = props;
  const router = useRouter();
  const [openChatBox, setOpenChatbox] = useState(false);

  useEffect(() => {
    if (!user) router.push("/");
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setUser();
      setOpenChatbox(false);
      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (openChatBox) return <Chat user={user} />;
  return (
    <div className={styles.dashboard}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Header handleLogout={handleLogout} />

      <section className={styles.flex}>
        <p>Welcome to chatty!</p>
        <div className={styles.align_right}>
          <button onClick={() => setOpenChatbox(true)}>Start a new chat</button>
        </div>
      </section>
    </div>
  );
}
