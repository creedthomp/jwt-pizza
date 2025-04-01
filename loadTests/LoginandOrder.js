import { sleep, check, group, fail } from "k6";
import http from "k6/http";
export const options = {
  cloud: {
    distribution: {
      "amazon:us:ashburn": { loadZone: "amazon:us:ashburn", percent: 100 },
    },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: "ramping-vus",
      gracefulStop: "30s",
      stages: [
        { target: 5, duration: "30s" },
        { target: 15, duration: "1m" },
        { target: 10, duration: "30s" },
        { target: 0, duration: "30s" },
      ],
      gracefulRampDown: "30s",
      exec: "scenario_1",
    },
  },
};
export function scenario_1() {
  let response;
  group("page_1 - https://pizza.creedthompson.click/", function () {
    const vars = {};
    response = http.put(
      "https://pizza-service.creedthompson.click/api/auth",
      '{"email":"d@jwt.com","password":"diner"}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.creedthompson.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    if (
      !check(response, {
        "status equals 200": (response) => response.status.toString() === "200",
      })
    ) {
      console.log(response.body);
      fail("Login was *not* 200");
    }
    vars.authToken = response.json().token;
    //check(response, { 'status equals 200': response => response.status.toString() === '200' })
    sleep(6);
    response = http.get(
      "https://pizza-service.creedthompson.click/api/order/menu",
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          authorization: `Bearer ${vars.authToken}`,
          origin: "https://pizza.creedthompson.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    sleep(0.5);
    response = http.get(
      "https://pizza-service.creedthompson.click/api/franchise",
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.creedthompson.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    sleep(14.2);
    response = http.post(
      "https://pizza-service.creedthompson.click/api/order",
      '{"items":[{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.creedthompson.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
        },
      }
    );
    sleep(2.8);
    response = http.post(
      "https://pizza-factory.cs329.click/api/order/verify",
      '{"jwt":"eyJpYXQiOjE3NDM0NTI0MTQsImV4cCI6MTc0MzUzODgxNCwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJjdHQxMiIsIm5hbWUiOiJDcmVlZCBUaG9tcHNvbiJ9LCJkaW5lciI6eyJpZCI6MiwibmFtZSI6InBpenphIGRpbmVyIiwiZW1haWwiOiJkQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MiwiZGVzY3JpcHRpb24iOiJQZXBwZXJvbmkiLCJwcmljZSI6MC4wMDQyfV0sInN0b3JlSWQiOiIxIiwiZnJhbmNoaXNlSWQiOjEsImlkIjoxfX0.l9Mp7mUl2jnudk4cmkWh6hoY49YvrQJrCQGvAYOMDajVsZOFIZOqn0Q1mFojRbRC2VbxOPAAP9Y9x6RhAwBvSk86c1prI2pNO8e27rZirN7CNj6VNQ5jjsNvlnis2zaO6T8g63LciuGuZUQadL9E8B7il8fmgDEEQ_HGoNO9wCtFyLH2_0LhoS5l7EKkCZZ2uYG0AjynmvJoNG9TPY0LK_91ajtF84ubI0XtX2KVyL6fzoEnS2x1PFDSjenaGU6A0cR6BhVo0Yl3FIabZNhH2CMgREYrG18ZsF7vNeapA-P-l8-eirUbfqbLDMfR_jw1rVlg_IfYlyd2K46LZnBtMZmPvW3Huh4QHCsaSDKEAe3B82vxOarANjK83Mz1bUfBUZ8RuYDH0vy-IEourbxcXjyGsMj_95lAMQAaGZMhPsUnXf1G_pTM-Fyi5v2RG2_ShD-rFjBrPZxFk2jZKtmPzGtbDkqA_BaRd6m8ai2n3k9nBKhYOrRz1WKArbnlP4emyUIZMf9UPlEtdi4yV5KGuhRvCyhdNp2AaZgdt1ux8ukLVbndRmlnghz0k2JCgt5pP-mANrjEJalHpxe3RdTr9yiOIg2ChnrZqHNEos4Z14f-XWGcvX6kfneLiFoIqRh76a-2_GEP-FfwOo9o22Wzfb20DpEWCcB1JHgc7VplKGs"}',
      {
        headers: {
          accept: "*/*",
          "accept-encoding": "gzip, deflate, br, zstd",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          origin: "https://pizza.creedthompson.click",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
      }
    );
  });
}
