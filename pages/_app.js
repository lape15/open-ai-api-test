import { useState } from "react";

const CustomApp = ({ Component, pageProps }) => {
  const [user, setUser] = useState();

  return <Component {...pageProps} user={user} setUser={setUser} />;
};

export default CustomApp;
