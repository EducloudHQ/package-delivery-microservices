// The before step
export function request(ctx) {
    const { args } = ctx;
    return {};
  }
  
  // The after step
  export function response(ctx) {
    return ctx.prev.result;
  }