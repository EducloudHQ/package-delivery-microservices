import { get } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const { id } = ctx.args;
  return get({ key: { PK: "PACKAGE", SK: `PACKAGE#${id}` } });
}

export function response(ctx) {
  return ctx.result;
}
