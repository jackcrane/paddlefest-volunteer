import { useState, useEffect } from "react";
import Input from "../components/Input";
import styles from "../styles/signup.module.scss";
import { Job } from "../components/Jobs";
import moment from "moment";

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const submit = async () => {
    if(confirm('YOU ARE ABOUT TO NOTIFY EVERYONE. ARE YOU SURE?')) {
      let f = await fetch(
        "https://paddlefestbackend.jackcrane.rocks/send-notification/everyone",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            body,
          }),
        }
      )
      if(f === 200) {
        alert('SUCCESS!')
      }
    }
  };

  return (
    <div style={{ margin: 10 }} className={styles.create}>
      <h1>Send notifications</h1>
      <Input placeholder="Notification Title" onInput={setTitle} />
      <Input placeholder="Notification Body" onInput={setBody} />
        <button type="submit" onClick={submit}>
          Submit!
        </button>
      </div>
  );
};
export default CreateJob;
