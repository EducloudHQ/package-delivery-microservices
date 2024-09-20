import { util } from '@aws-appsync/utils';

export function request(ctx) {

  return {
    operation: 'PutEvents',
    events: [
      {
        source: 'delivery.api',
        detail: {
            packageId: ctx.args.packageId
        },
        detailType: 'package.delivered',
      },
    ],
  };
}

export function response(ctx) {
    console.log("Eveeent", ctx)
  return true;
}