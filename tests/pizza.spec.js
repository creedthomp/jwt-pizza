import { test, expect } from 'playwright-test-coverage';

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});


  test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  // await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  // await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).first().click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
  });




test('register and get franchises', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const registerReq = {"name": "creed","email": "creed@jwt.com","password": "creed"};
    const registerRes = {"user": {"name": "creed","email": "creed@jwt.com", "roles": [{"role": "diner"}],"id": 552},"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3JlZWQiLCJlbWFpbCI6ImNyZWVkQGp3dC5jb20iLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn1dLCJpZCI6NTUyLCJpYXQiOjE3MzkyNDM5OTB9.eCBXxeWHuzO783VzXANxM69i3B-hNv-dE_sRoGSk0bs"};
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(registerReq); 
    await route.fulfill({ json: registerRes });
  });



  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('creed');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('creed@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('creed');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
  });




test('create a franchise', async ({ page }) => {

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = {"email": "a@jwt.com","password": "admin"};
    const loginRes = {"user": {"id": 1,"name": "常用名字","email": "a@jwt.com","roles": [{"role": "admin"}]},"token": "abcd"}
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "dinerId": 1,
      "orders": [
        {
          "id": 1,
          "franchiseId": 1,
          "storeId": 1,
          "date": "2025-01-15T20:08:44.000Z",
          "items": [
            {
              "id": 1,
              "menuId": 2,
              "description": "Pepperoni",
              "price": 0.0042
            }
          ]
        }
      ],
      "page": 1
    };
    expect(route.request().method()).toBe('GET');
    //expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  const franchiseData = [
    {
      "id": 5,
      "name": "cr",
      "admins": [
        {
          "id": 426,
          "name": "7ufi24mdqs",
          "email": "7ufi24mdqs@admin.com"
        }
      ],
      "stores": [
        { "id": 2, "name": "newstore", "totalRevenue": 0 },
        { "id": 3, "name": "newstore", "totalRevenue": 0 }
      ]
    },
    {
      "id": 45,
      "name": "franchise name",
      "admins": [
        {
          "id": 1,
          "name": "常用名字",
          "email": "a@jwt.com"
        }
      ],
      "stores": []
    }
  ]
  // get 
  await page.route('**/api/franchise', async (route) => {
    await route.fulfill({ json: franchiseData });
  });



  // post
  await page.route('**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      const postData = await route.request().postDataJSON();
      console.log("Mocked Franchise Creation:", postData);
      
      const franchiseRes = {
        "id": 45,
        "name": postData.name,
        "admins": postData.admins || [],
        "stores": []
      };

      franchiseData.push(franchiseRes);
  
      await route.fulfill({ json: franchiseRes, status: 201 });
    } else {
      await route.continue();
    }
  });

  // get 
  await page.route('**/api/franchise', async (route) => {
    await route.fulfill({ json: franchiseData });
  });
  
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('franchise test');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('test@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  // await expect(page.getByRole('row', { name: 'franchise test 常用名字 Close' })).toBeVisible();
  // await page.getByRole('row', { hasText: 'franchise test 常用名字 Close' }).getByRole('button').click();
  // await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  // await page.getByRole('button', { name: 'Close' }).click();
});




//  // failing on the create store button
//   test('create a store', async ({ page }) => {
//     let franchiseData = [
//       {
//         "id": 1,
//         "name": "pizzaPocket",
//         "admins": [
//           {
//             "id": 1,
//             "name": "pizza franchisee",
//             "email": "tester@jwt.com"
//           }
//         ],
//         "stores": [
//           {
//             "id": 1,
//             "name": "SLC",
//             "totalRevenue": 0
//           }
//         ]
//       }
//     ];
//     await page.route('*/**/api/auth', async (route) => {
//       const loginReq = {"email": "tester@jwt.com","password": "test"};
//       const loginRes = {"user":{"id":1,"name":"pizza franchisee","email":"tester@jwt.com","roles":[{"role": "diner"}, {"objectId":1, "role":"franchisee"}, ]},"token":"abcd"};
//       console.log("login");
//       expect(route.request().method()).toBe('PUT');
//       expect(route.request().postDataJSON()).toMatchObject(loginReq);
//       await route.fulfill({ json: loginRes });
//     });

//     await page.route('*/**/api/order', async (route) => {
    
//       const orderRes = {
//         "dinerId": 3,
//         "orders": [],
//         "page": 1
//       };
//       expect(route.request().method()).toBe('GET');
//       await route.fulfill({ json: orderRes });
//     });

//     await page.route('/api/franchise/1', async(route) => {
//       expect(route.request().method()).toBe('GET');
//       await route.fulfill({ json: franchiseData });
//     });

//     await page.route('/franchise/1/store', async(route) => {
//     storeReq = {"id": "","name": "test store"}
//     storeRes = {
//       "id": 4,
//       "franchiseId": 1,
//       "name": "test store"
//     }
//     franchiseData[0].stores.push(storeRes);
//     expect(route.request().method().toBe('POST'));
//     await route.fulfill({ json: storeRes });
//     })

//     await page.route('/api/franchise/1', async(route) => {
//       expect(route.request().method()).toBe('GET');
//       await route.fulfill({ json: franchiseData });
//     });

//     await page.goto('/');
//     await page.getByRole('link', { name: 'Login' }).click();
//     await page.getByRole('textbox', { name: 'Email address' }).fill('tester@jwt.com');
//     await page.getByRole('textbox', { name: 'Password' }).click();
//     await page.getByRole('textbox', { name: 'Password' }).fill('test');
//     //await page.getByRole('link', { name: 'pf' }).click();
//     await page.getByRole('button', { name: 'Login' }).click();
//     await page.getByRole('link', { name: 'pf' }).click();
//     await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
//     await page.getByRole('button', { name: 'Create store' }).click();
//     await page.getByRole('textbox', { name: 'store name' }).click();
//     await page.getByRole('textbox', { name: 'store name' }).fill('test store');
//     await page.getByRole('button', { name: 'Create' }).click();
//     await expect(page.locator('tbody')).toContainText('test store');
//     await page.getByRole('row', { name: 'test store 0 ₿ Close' }).getByRole('button').click();
//     await page.getByRole('button', { name: 'Close' }).click();
// });


test('create store ', async ({ page }) => {

await page.route('**/api/auth', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      user: {
        id: 3,
        name: "pizza franchisee",
        email: "tester@jwt.com",
        roles: [
          { role: "diner" },
          { objectId: 1, role: "franchisee" }
        ]
      },
      token: "test"
    }),
  });
});

// Mock GET /api/order
await page.route('**/api/order', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      dinerId: 3,
      orders: [],
      page: 1
    }),
  });
});

// Mock GET /api/franchise/3 before store creation
await page.route('**/api/franchise/3', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      {
        id: 1,
        name: "pizzaPocket",
        admins: [{ id: 3, name: "pizza franchisee", email: "tester@jwt.com" }],
        stores: [{ id: 1, name: "SLC", totalRevenue: 0 }]
      }
    ]),
  });
});

// Mock POST /franchise/1/store (Store Creation)
await page.route('**/franchise/1/store', async (route) => {
  await route.fulfill({
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify({
      id: 6,
      franchiseId: 1,
      name: "test store"
    }),
  });
});

// Mock GET /api/franchise/3 after store creation
await page.route('**/api/franchise/3', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([
      {
        id: 1,
        name: "pizzaPocket",
        admins: [{ id: 3, name: "pizza franchisee", email: "tester@jwt.com" }],
        stores: [
          { id: 1, name: "SLC", totalRevenue: 0 },
          { id: 6, name: "test store", totalRevenue: 0 }
        ]
      }
    ]),
  });
});

// Mock DELETE /franchise/1/store/6 (Store Deletion)
await page.route('**/franchise/1/store/6', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ message: "store deleted" }),
  });
});

  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('tester@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'pf' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('test store');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('row', { name: 'test store 0 ₿ Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});


