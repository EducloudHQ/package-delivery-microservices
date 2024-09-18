import { update, operations } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { input } = ctx.args;
  const updateObj = {
    address: operations.replace(input),
  };
  return update({
    key: { PK: `PACKAGE`, SK: `PACKAGE#${input.id}` },
    update: updateObj,
  });
}

export function response(ctx) {
    ctx.stash.event = { detailType: 'package.updated', detail: ctx.result };
  return ctx.result;
}
