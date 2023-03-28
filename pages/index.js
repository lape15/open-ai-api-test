import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./index.module.css";
import { signInWithGoogle } from "./api/auth/firebase";

export default function Home(props) {
  const { user, setUser } = props;
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  const router = useRouter();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const loginInUser = async () => {
    try {
      const result = await signInWithGoogle();
      setUser(result);
      setUser({
        name: result.displayName,
        uid: result.uid,
        photoUrl: result.reloadUserInfo.photoUrl,
      });
      router.push("dashboard");
    } catch (err) {
      console.log("EROR authenticating user", err);
    }
  };

  return (
    <div>
      <Head>
        <title>Auth Page</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Sign in with google</h3>

        <button onClick={loginInUser}>Login with Google</button>
      </main>
    </div>
  );
}
