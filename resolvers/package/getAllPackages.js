import { util } from "@aws-appsync/utils";
export function request(ctx) {
  return {
    operation: "Query",
    query: {
      expression: "PK = :pk and begins_with(SK, :sk)",
      expressionValues: util.dynamodb.toMapValues({
        ":pk": "PACKAGE",
        ":sk": "PACKAGE#"
      }),
    }
  };
}

export function response(ctx) {
  return ctx.result.items;
}
