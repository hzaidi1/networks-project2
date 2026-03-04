// export default function Networking() {
//   return (
//     <div>
//       <h2>Networking Concepts</h2>

//       <h3>DNS</h3>
//       <p>
//         Our domain, ashaiman.github.io,  uses DNS to link the domain name into a machine readable IP address so the browser can locate the server.
//         As shown below, the nslookup command shows our doman points to Github Pages. 
//         This allows the public to access the site using a name instead of a numeric IP address.
//       </p>

//       <h3>IP Addressing</h3>
//       <p>
//         IP addresses identify devices on the internet. IPv4 uses numbers like
//         192.168.1.1, while IPv6 uses longer hexadecimal addresses.
//       </p>

//       <h3>HTTP vs HTTPS</h3>
//       <p>
//         HTTP transfers web data, while HTTPS encrypts communication using TLS.
//       </p>
//     </div>
//   );
// }

import { useState } from "react";

export default function Networking() {
  const [message, setMessage] = useState("");

  const sendPacket = (device) => {
    setMessage(`Packet sent from ${device} to Router`);
  };

  return (
    <main className="landing-page">
      <h1>Networking Concepts</h1>
      <p>This page demonstrates how networking concepts are applied to our website deployment.</p>

      <div className="card">
        <h2>DNS</h2>
        <p>DNS translates a domain name into an IP address so browsers can locate the server.</p>
      </div>

      <div className="card">
        <h2>IP Addressing</h2>
        <p>
          Detected IP: <span id="ip-address">75.137.6.232</span>
        </p>
      </div>

      <div className="card">
        <h2>Protocols (HTTP vs HTTPS)</h2>
        <p>HTTPS encrypts data during transit using TLS.</p>
        <button onClick={() => sendPacket("Laptop")}>Send Packet</button>
        <p>{message}</p>
      </div>
    </main>
  );
}