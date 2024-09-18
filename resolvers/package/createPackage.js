import { put } from '@aws-appsync/utils/dynamodb';
import { util } from '@aws-appsync/utils';
export function request(ctx) {
  const { input } = ctx.args;
  const timestamp = util.time.nowEpochSeconds();
  const id = `${util.autoKsuid()}@${timestamp}`;

  const packageItem = {
    ...input,
    id,
    pickupLocation: {
      type: "Point",
      coordinates: [input.longitude, input.latitude],
    },
    ENTITY: "PACKAGE",
    createdOn: timestamp,
    updatedOn: timestamp,
  };
  const key ={
    PK: "PACKAGE",
    SK: `PACKAGE#${id}`
  }
  return put({key: key, item: packageItem})
}

export function response(ctx) {
  ctx.stash.event = { detailType: 'package.created', detail: ctx.result };
  return ctx.result;
}