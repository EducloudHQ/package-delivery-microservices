import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const { payment_intent } = ctx.args;

  console.log(`payment input ${payment_intent}`);

  return {
    method: "POST",
    version: "2018-05-29",
    resourcePath: `/v1.0/payments/${payment_intent}/confirm`,
    params: {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        Accept: "application/json",
      },
    },
  };
}

export function response(ctx) {
  console.log(`response is ${ctx.result}`);
  const res = JSON.parse(ctx.result.body);
  return res;
}
