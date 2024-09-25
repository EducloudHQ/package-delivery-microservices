import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { input } = ctx.args;

  console.log(`create payment input ${input}`);

  return {
    method: "POST",
    version: "2018-05-29",
    resourcePath: `/v1.0/payments/create`,

    params: {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        Accept: "application/json",
      },

      body: {
        ...input,
      },
    },
  };
}

export function response(ctx) {
  console.log(`response is ${ctx.result}`);
  const res = JSON.parse(ctx.result.body);
  return res;
}
