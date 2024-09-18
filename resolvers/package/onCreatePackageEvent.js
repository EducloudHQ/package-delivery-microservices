import { util, extensions } from "@aws-appsync/utils";

export const request = (ctx) => ({ payload: null });

export function response(ctx) {
  const filter = {
    or: [
      {
        deliveryMode: { eq: "PRO" },
        packageType: { in: ["MEDICATION", "FOOD"] },
      },
      { deliveryMode: { eq: "EXPRESS" }, packageType: { eq: "MEDICATION" } },
    ],
  };
  console.log("filter:", filter);
  extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter));
  return null;
}
