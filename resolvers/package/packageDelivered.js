export function request(ctx) {
  const { packageId } = ctx.args;
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ PK: 'PACKAGE', SK: `PACKAGE#${packageId}` }),
    update: {
      expression: 'SET #pkgStatusfield=:pkgStatus',
      expressionNames: { '#pkgStatusfield': 'packageStatus' },
      expressionValues: { ':pkgStatus': { S: 'DELIVERED' } },
    },
  };
}

export function response(ctx) {
  return true
}

