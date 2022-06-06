import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.location.href = "/signup";
  }, []);
  return <p>You need to go to somewehere else</p>;
}
