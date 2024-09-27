import { util, extensions } from "@aws-appsync/utils";

/**
 * Sends an empty payload as the subscription is established
 * @param {*} ctx the context
 * @returns {import('@aws-appsync/utils').NONERequest} the request
 */
export function request(ctx) {
  // noop
  return { payload: {} };
}

/**
 * Creates an enhanced subscription
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */
export function response(ctx) {
  console.log("hello world", ctx);
  const { input } = ctx.args;
  const filter = util.transform.toSubscriptionFilter({
    and: [
      { deliveryMode: { eq: "EXPRESS" } },
      { packageType: { eq: "MEDICATION" } },
    ],
  });
  console.log(filter);
  extensions.setSubscriptionFilter(filter);
  return null;
}
