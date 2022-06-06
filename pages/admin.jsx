import React, { useState, useEffect } from "react";
import styles from "../styles/admin.module.scss";
import Input from "../components/Input";
import {
  ActivityHeartbeat,
  ExternalLink,
  Mail,
  MoodSmile,
  Phone,
} from "tabler-icons-react";
import Modal from "../components/Modal";
import moment from "moment";
const F = (props) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {props.children}
    </div>
  );
};

const Admin = () => {
  const [volunteers, setVolunteers] = useState([]);
  useEffect(() => {
    (async () => {
      let f = await fetch(
        "https://paddlefestbackend.jackcrane/rocks/volunteers"
      );
      let volunteers = await f.json();
      setVolunteers(volunteers);
    })();
  }, []);
  const [modal, setModal] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} _id={modal} />
      <nav>
        <h1>Volunteer Listing</h1>
        <div className={styles.navs}>
          <button>Volunteers</button>
          <button>Jobs</button>
        </div>
        <div className={styles.search}>
          {/* <input type="text" placeholder="Search" /> */}
          <Input placeholder="Search" onInput={() => {}} />
        </div>
      </nav>
      <main>
        <h1>Volunteers</h1>
        <p>
          Here is a listing of every volunteer and their commitments and contact
          information. To modify a listing, click the volunteer's row.
        </p>
        <table>
          <thead>
            <tr>
              <th>
                <F>
                  Name <MoodSmile height={18} />
                </F>
              </th>
              <th>
                <F>
                  Email <Mail height={18} />
                </F>
              </th>
              <th>
                <F>
                  Phone <Phone height={18} />
                </F>
              </th>
              <th>
                <F>
                  Jobs <ActivityHeartbeat height={18} />
                </F>
              </th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((volunteer) => (
              <tr
                key={volunteer._id}
                onClick={() => {
                  setModal(volunteer._id);
                  setModalOpen(true);
                }}
              >
                <td>{volunteer.name}</td>
                <td>
                  <F>
                    {volunteer.email}
                    <a href={`mailto:${volunteer.email}`}>
                      <ExternalLink height={18} />
                    </a>
                  </F>
                </td>
                <td>
                  <F>
                    {volunteer.phonenum}
                    <a href={`tel:${volunteer.phonenum}`}>
                      <ExternalLink height={18} />
                    </a>
                  </F>
                </td>
                <td>Click here to open jobs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};
export default Admin;
