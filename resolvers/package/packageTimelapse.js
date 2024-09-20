import { put } from "@aws-appsync/utils/dynamodb";
export function request(ctx) {
  const { input } = ctx.args;
  const timestamp = util.time.nowEpochMilliSeconds();

  const key = {
    PK: `PACKAGE#${input.packageId}`,
    SK: `PACKAGETIMELAPSE#${timestamp}`,
  };

  const packageTimelapseItem = {
    ...input,
    id: input.packageId,
    timestamp: timestamp,
    GSI1_PK: `DELIVERYAGENT#${input.deliveryAgentId}`,
    GSI1_SK: `PACKAGE#${input.packageId}`,
    createdOn: util.time.nowEpochMilliSeconds(),
  };

  return put({ key: key, item: packageTimelapseItem });
}

export function response(ctx) {
  return ctx.result;
}

