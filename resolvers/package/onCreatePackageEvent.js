// import { util, extensions } from "@aws-appsync/utils";

// export function request(ctx) {
// 	// simplfy return null for the payload
// 	return { payload: null };
// }

// export function response(ctx) {
//     console.log("Fonchu Filter context", ctx)
//   const filter = {
//     or: [
//       {
//         'package.deliveryMode': { eq: "PRO" },
//         'package.packageType': { in: ["MEDICATION", "FOOD"] },
//       },
//       { 'package.deliveryMode': { eq: "EXPRESS" }, 'package.packageType': { eq: "MEDICATION" } },
//     ],
//   };
//   extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter));
//   return null;
// }

import { util, extensions } from '@aws-appsync/utils';

// /**
//  * Sends an empty payload as the subscription is established
//  * @param {*} ctx the context
//  * @returns {import('@aws-appsync/utils').NONERequest} the request
//  */
export function request(ctx) {
    console.log("Fonchu >>>>>>>>>>>>>", ctx)
    // noop
    return { payload: {} };
}

// /**
//  * Creates an enhanced subscription
//  * @param {import('@aws-appsync/utils').Context} ctx the context
//  * @returns {*} the result
//  */
export function response(ctx) {
    // the logged in user group
    // or use the user's own groups
    // const groups = ctx.identity.groups
    console.log("hello world", ctx)

    // This filter sets up a subscription that is triggered when:
    // - a mutation with severity >= 7 and priority high or medium is made
    // - or a mtuation with classification "security" is made and the user belongs to the "admin" or "operators" group
    const filter = util.transform.toSubscriptionFilter({
        packageName: { eq: "Test" }
        // or: [
        //     { and: [{ deliveryMode: { eq: "PRO" }, }, { packageType: { in: ["MEDICATION", "FOOD"] }, }] },
        //     { and: [{ deliveryMode: { eq: "EXPRESS" }}, { packageType: { eq: "MEDICATION" } }] },
        // ],
    });
    console.log(filter);
    extensions.setSubscriptionFilter(filter);
    return null;
}
