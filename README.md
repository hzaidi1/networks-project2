# Computer Networking Project 2

This project enhances a public website with security, performance, and monitoring features for the Spring 2026 Computer Networking course.

## Tech Stack

- React + Vite
- Vercel hosting
- Google Analytics
- Vercel Analytics
- DOMPurify

## Implemented Features

### Security Enhancements

- HTTPS through Vercel hosting
- XSS protection using `DOMPurify` in the feedback form
- Security headers configured in [vercel.json](./vercel.json)
  - `Strict-Transport-Security`
  - `Content-Security-Policy`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`

### Additional Enhancements

- Performance optimization with lazy-loaded images and async image decoding
- Traffic monitoring with Google Analytics
- Traffic monitoring with Vercel Analytics

## Project Pages

- Home page with project overview and feedback form
- Networking Concepts page with DNS, IPv4/IPv6, and HTTPS explanations

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown by Vite.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Use the default Vite build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy the project.
5. Verify that the deployed site loads over `https://`.

## Notes

- This project is intended to be deployed on Vercel.
- DNS and IP lookup results on the Networking page use the current deployed hostname.
- When running locally on `localhost`, public DNS results are not shown because the site is not yet deployed publicly.
