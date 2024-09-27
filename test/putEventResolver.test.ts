// // // const AWS = require('aws-sdk')
// // // const fs = require('fs')
// // import * as AWS from "aws-sdk"
// // import * as fs from 'fs';
// // const client = new AWS.AppSync({ region: 'us-east-2' })
// // const runtime = { name: 'APPSYNC_JS', runtimeVersion: '1.0.0' }

// // test('request correctly calls DynamoDB', async () => {
// //     const code = fs.readFileSync("../resolvers/delivery/putEvent.js", 'utf8')
// //     const context = fs.readFileSync('./context.json', 'utf8')
// //     const contextJSON = JSON.parse(context)

// //     const response = await client.evaluateCode({ code, context, runtime, function: 'request' }).promise()
// //     const result = JSON.parse(response.evaluationResult!)

// //     expect(result.key.id.S).toBeDefined()
// //     expect(result.attributeValues.firstname.S).toEqual(contextJSON.arguments.firstname)
// // })

// // resolver.test.js
// // import { request, response } from '../resolvers/delivery/putEvent.js';

// // import {request, response} from '../resolvers/delivery/putEvent.js'

// describe('request function', () => {
//   it('should create a correct event structure', () => {
//     const ctx = {
//       args: {
//         packageId: '12345',  // Mocking a package ID
//       },
//     };

//     const result = request(ctx);

//     expect(result).toEqual({
//       operation: 'PutEvents',
//       events: [
//         {
//           source: 'delivery.api',
//           detail: {
//             packageId: '12345',
//           },
//           detailType: 'package.delivered',
//         },
//       ],
//     });
//   });

//   it('should return correct event with empty packageId', () => {
//     const ctx = {
//       args: {
//         packageId: '',  // Empty package ID scenario
//       },
//     };

//     const result = request(ctx);

//     expect(result).toEqual({
//       operation: 'PutEvents',
//       events: [
//         {
//           source: 'delivery.api',
//           detail: {
//             packageId: '',  // Should still handle empty packageId
//           },
//           detailType: 'package.delivered',
//         },
//       ],
//     });
//   });
// });

// describe('response function', () => {
//   it('should return true', () => {
//     const ctx = {};  // Mock context (could be anything)
//     const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

//     const result = response(ctx);

//     expect(result).toBe(true);
//     expect(consoleSpy).toHaveBeenCalledWith("Eveeent", ctx);

//     consoleSpy.mockRestore();  // Restore the original console.log implementation
//   });
// });
