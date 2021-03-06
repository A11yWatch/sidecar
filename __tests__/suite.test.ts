import { TextEncoder, TextDecoder } from "util";

// jest setup for node v14.18.3
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

jest.setTimeout(30000);

describe("suite", () => {
  const email = "myemail@gmail.com"; // test auth email
  const password = "mypass"; // test auth password

  // can scan a single website using enhanced scan
  test("starts the server properly and run single page scan", async (done) => {
    const { scan } = await import("../src/server");

    const data = await scan({ url: "https://jeffmendez.com" });

    expect(data).toBeTruthy();

    done();
  });

  // can register a user into the app
  test("can register via email", async (done) => {
    const { appReady } = await import("../src/server");

    const { UsersController } = await import(
      "@a11ywatch/core/core/controllers"
    );

    await appReady();

    const data = await UsersController().createUser({
      email,
      password,
    });

    expect(data.email).toEqual(email);
    expect(data.password).not.toEqual(password); // password is hashed!!

    done();
  });

  // can sign on a user into the app
  test("can login via email", async (done) => {
    const { appReady } = await import("../src/server");

    const { UsersController } = await import(
      "@a11ywatch/core/core/controllers"
    );

    await appReady();

    const data = await UsersController().verifyUser({
      email,
      password,
    });

    expect(data.email).toEqual(email);
    expect(data.password).not.toEqual(password); // password is hashed!!

    done();
  });

  // can run authenticated multi page crawl by user id
  test("can multi page crawl by user", async (done) => {
    const { appReady, multiPageScan } = await import("../src/server");

    await appReady();

    const { UsersController } = await import(
      "@a11ywatch/core/core/controllers"
    );

    const data = await UsersController().verifyUser({
      email,
      password,
    });

    expect(data.email).toEqual(email);
    expect(data.password).not.toEqual(password); // password is hashed!!

    const results = await multiPageScan({
      url: "https://jeffmendez.com",
      userId: data.id,
    });

    expect(results.data[0].userId).toEqual(data.id);

    done();
  });
});
