import { util } from "@aws-appsync/utils";
export function request(ctx) {
  const packageStatus = ctx.packageStatus;
  return {
    operation: "Query",
    query: {
      expression: "PK = :pk and begins_with(SK, :sk)",
      expressionValues: util.dynamodb.toMapValues({
        ":pk": "PACKAGE",
        ":sk": "PACKAGE#"
      }),
    },
    filter: {
      expression: "packageStatus = :pkgStatus",
      expressionValues: util.dynamodb.toMapValues({
        ":pkgStatus": packageStatus
      }),
    }
  };
}

export function response(ctx) {
  return ctx.result.items;
}
