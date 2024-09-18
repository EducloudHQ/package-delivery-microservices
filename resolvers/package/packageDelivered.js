export function request(ctx) {
  const { id } = ctx.args;
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ id }),
    update: {
      expression: 'ADD #pkgStatusfield :pkgStatus',
      expressionNames: { '#pkgStatusfield': 'packageStatus' },
      expressionValues: { ':pkgStatus': { S: 'DELIVERED' } },
    },
  };
}

export function response(ctx) {
  console.log(ctx)
  return true
}

