
import { Router } from 'itty-router'
import axios from 'axios';

// Create a new router
const router = Router()

router.get("/", async ({query}) => {
  const url = `https://tiltify.com/oauth/token`
  const auth = btoa(CLIENT_ID + ':' + SECRET_KEY);
  const response = await fetch("https://tiltify.com/oauth/token", {
    body: `{"client_id":"${CLIENT_ID}","redirect_uri":"${REDIRECT_URI}", "code": "${query.code}", "grant_type": "authorization_code"}`,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });
  const json = await response.json();
  return Response.redirect(`${query.state}/credentials/oauth/tiltify/?token=${json.access_token}`, 301);
});

router.get("/authorize", async ({query}) => {
  const url = `https://tiltify.com/oauth/authorize?&client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&state=${query.state}&scope=public`;
  if (query.state) {
    return Response.redirect(url, 301);
  } else {
    return new Response("400, missing state!", { status: 400 })
  }
})

router.all("*", () => new Response("404, not found!", { status: 404 }))

addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request))
})