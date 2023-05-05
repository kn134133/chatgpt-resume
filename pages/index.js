import React from 'react';
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

const Example = ({ data }) => {

  const [result, setResult] = useState({ id: 0, resumes: [] });

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId: event.target.jobId.value }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult({ id: event.target.jobId.value, resumes: data });
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
      </Head>

      <main className={styles.main}>
        <h3>Open positions</h3>
        <ul className={styles.customList}>
          {data.map(item => (
            <li key={item.id}>
              <h4>{item.title}</h4>
              <div><span>Company:</span> {item.company}</div>
              <div><span>Location:</span> {item.location}</div>
              <div><span>Description:</span> {item.description}</div>
              <div>
                <form onSubmit={onSubmit}>
                  <input id='jobId' type='hidden' value={item.id} />
                  <button>Suggest candidate</button>
                </form>
              </div>
              <div>
                {
                  result.id == item.id &&
                  result.resumes.map(resume => (
                    <li key={resume.id}>
                      <h4>{resume.name}</h4>
                      <div><span>Title:</span> {resume.title}</div>
                      <div><span>Skills:</span> {resume.skills.join(', ')}</div>
                      <div><span>Experience:</span> <br></br>
                        <br></br>
                        {resume.experience.map(exp => (
                          <li key={exp.position}>
                            <div><span>Position:</span> {exp.position}</div>
                            <div><span>Company:</span> {exp.company}</div>
                            <div><span>From:</span> {exp.start_date}, <span>To:</span> {exp.end_date} </div>
                            <div><span>Description:</span> {exp.description}</div>
                            <hr></hr>
                          </li>
                        ))}
                      </div>
                    </li>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/jobs');
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
}

export default Example;