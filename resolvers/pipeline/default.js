// The before step
export function request(ctx) {
    const { args } = ctx;
    console.log("Foonchu");
    return {};
  }
  
  // The after step
  export function response(ctx) {
    console.log(ctx.prev.result)
    return ctx.prev.result;
  }