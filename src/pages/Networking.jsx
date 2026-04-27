import { useEffect, useState } from "react";
import nslookupImage from "../assets/nslookup.jpg";
import headersImage from "../assets/headers.jpg";

export default function Networking() {
  const [ipv4, setIpv4] = useState("Loading...");
  const [ipv6, setIpv6] = useState("Loading...");

  useEffect(() => {
    fetch("https://cloudflare-dns.com/dns-query?name=hzaidi1.github.io&type=A", {
      headers: { Accept: "application/dns-json" }
    })
      .then(res => res.json())
      .then(data => setIpv4(data.Answer?.[0]?.data || "Unable to resolve"))
      .catch(() => setIpv4("Unable to resolve"));

    fetch("https://cloudflare-dns.com/dns-query?name=hzaidi1.github.io&type=AAAA", {
      headers: { Accept: "application/dns-json" }
    })
      .then(res => res.json())
      .then(data => setIpv6(data.Answer?.[0]?.data || "Unable to resolve"))
      .catch(() => setIpv6("Unable to resolve"));
  }, []);

  return (
    <main className="landing-page">
      <h1>Networking Concepts</h1>
      <p>This page demonstrates how networking concepts are applied to our website deployment.</p>

      <div className="card">
        <h2>DNS</h2>
        <p>Our domain, hzaidi1.github.io, uses DNS to link the domain name into a machine readable IP address so the browser can locate the server.</p>
        <p> When a user types the domain into their browser, a DNS lookup is performed. The browser contacts a DNS resolver which then finds the IP address for our domain. GitHub Pages registers
          the domain and points to their servers. The resolver then returns an IP address and the browser uses that IP address to connect to the server and load our site.</p>
        <p>As shown below, the nslookup command shows our domain points to Github Pages.</p>
        <img src={nslookupImage} alt="DNS Lookup Evidence" style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }} />
        <p>This allows the public to access the site using a name instead of a numeric IP address.</p>
      </div>

      <div className="card">
        <h2>IP Addressing</h2>
        <p>IPv4 is a 32-bit address written in dotted decimal format. It identifies devices on the internet logically.</p>
        <p>Detected IPv4: <span id="ip-address">{ipv4}</span></p>

        <p>IPv6 is a 128-bit address written in hexadecimal format separated by colons. It was introduced to handle the exhaustion of IPv4 addresses.</p>
        <p>Detected IPv6: <span id="ip-address-v6">{ipv6}</span></p>

        <p>GitHub Pages supports both IPv4 and IPv6, ensuring compatibility with different network infrastructures.</p>
      </div>

      <div className="card">
        <h2>Protocols (HTTP vs HTTPS)</h2>
        <p>This site enforces HTTPS, ensuring that data is encrypted during transit. 
          This uses the TCP/IP protocol for reliable delivery. HTTP transfers data in plain text. HTTPS encrypts using TLS. </p>
        <p>As shown below, the HTTP headers confirm that HTTPS is being used and that the connection is secure. 
          The <strong>Strict-Transport-Security</strong> header enforces HTTPS by telling the browser to only use HTTPS for future
          requests and use an encrypted connection. The status code 200 OK confirms the server successfully returned the page. </p>
        <img src={headersImage} alt="HTTP Headers Evidence" style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }} />
      </div>
    </main>
  );
}