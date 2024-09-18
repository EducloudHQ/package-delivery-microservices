import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { packageId, deliveryAgentId } = ctx.args;
  const assignPackageId = util.autoKsuid();

  const key = {
    PK: `DELIVERYAGENTID#${deliveryAgentId}`,
    SK: `PACKAGEID#${packageId}`,
  };

  const packageItem = {
    packageId,
    deliveryAgentId,
    id: assignPackageId,
    createdOn: util.time.nowEpochMilliSeconds(),
  };

  return put({ key: key, item: packageItem });
}

export function response(ctx) {
  ctx.stash.event = { detailType: 'package.assigned', detail: ctx.result };
  return true;
}
