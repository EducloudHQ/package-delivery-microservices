"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHV0RXZlbnRSZXNvbHZlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHV0RXZlbnRSZXNvbHZlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1Q0FBdUM7QUFDdkMsaUNBQWlDO0FBQ2pDLG9DQUFvQztBQUNwQywrQkFBK0I7QUFDL0IsNkRBQTZEO0FBQzdELHFFQUFxRTtBQUVyRSw0REFBNEQ7QUFDNUQsbUZBQW1GO0FBQ25GLG1FQUFtRTtBQUNuRSxpREFBaUQ7QUFFakQsK0dBQStHO0FBQy9HLCtEQUErRDtBQUUvRCwrQ0FBK0M7QUFDL0MsNkZBQTZGO0FBQzdGLFFBQVE7QUFFUixzQkFBc0I7QUFDdEIsNEVBQTRFO0FBRTVFLHlFQUF5RTtBQUV6RSx1Q0FBdUM7QUFDdkMsMERBQTBEO0FBQzFELG9CQUFvQjtBQUNwQixnQkFBZ0I7QUFDaEIsdURBQXVEO0FBQ3ZELFdBQVc7QUFDWCxTQUFTO0FBRVQsbUNBQW1DO0FBRW5DLCtCQUErQjtBQUMvQixnQ0FBZ0M7QUFDaEMsa0JBQWtCO0FBQ2xCLFlBQVk7QUFDWixvQ0FBb0M7QUFDcEMsc0JBQXNCO0FBQ3RCLGtDQUFrQztBQUNsQyxlQUFlO0FBQ2YsNkNBQTZDO0FBQzdDLGFBQWE7QUFDYixXQUFXO0FBQ1gsVUFBVTtBQUNWLFFBQVE7QUFFUixtRUFBbUU7QUFDbkUsb0JBQW9CO0FBQ3BCLGdCQUFnQjtBQUNoQix1REFBdUQ7QUFDdkQsV0FBVztBQUNYLFNBQVM7QUFFVCxtQ0FBbUM7QUFFbkMsK0JBQStCO0FBQy9CLGdDQUFnQztBQUNoQyxrQkFBa0I7QUFDbEIsWUFBWTtBQUNaLG9DQUFvQztBQUNwQyxzQkFBc0I7QUFDdEIscUVBQXFFO0FBQ3JFLGVBQWU7QUFDZiw2Q0FBNkM7QUFDN0MsYUFBYTtBQUNiLFdBQVc7QUFDWCxVQUFVO0FBQ1YsUUFBUTtBQUNSLE1BQU07QUFFTix3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLDJEQUEyRDtBQUMzRCxrRkFBa0Y7QUFFbEYsb0NBQW9DO0FBRXBDLGlDQUFpQztBQUNqQywrREFBK0Q7QUFFL0Qsb0ZBQW9GO0FBQ3BGLFFBQVE7QUFDUixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLy8gLy8gLy8gY29uc3QgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpXG4vLyAvLyAvLyBjb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbi8vIC8vIGltcG9ydCAqIGFzIEFXUyBmcm9tIFwiYXdzLXNka1wiXG4vLyAvLyBpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG4vLyAvLyBjb25zdCBjbGllbnQgPSBuZXcgQVdTLkFwcFN5bmMoeyByZWdpb246ICd1cy1lYXN0LTInIH0pXG4vLyAvLyBjb25zdCBydW50aW1lID0geyBuYW1lOiAnQVBQU1lOQ19KUycsIHJ1bnRpbWVWZXJzaW9uOiAnMS4wLjAnIH1cblxuLy8gLy8gdGVzdCgncmVxdWVzdCBjb3JyZWN0bHkgY2FsbHMgRHluYW1vREInLCBhc3luYyAoKSA9PiB7XG4vLyAvLyAgICAgY29uc3QgY29kZSA9IGZzLnJlYWRGaWxlU3luYyhcIi4uL3Jlc29sdmVycy9kZWxpdmVyeS9wdXRFdmVudC5qc1wiLCAndXRmOCcpXG4vLyAvLyAgICAgY29uc3QgY29udGV4dCA9IGZzLnJlYWRGaWxlU3luYygnLi9jb250ZXh0Lmpzb24nLCAndXRmOCcpXG4vLyAvLyAgICAgY29uc3QgY29udGV4dEpTT04gPSBKU09OLnBhcnNlKGNvbnRleHQpXG5cbi8vIC8vICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5ldmFsdWF0ZUNvZGUoeyBjb2RlLCBjb250ZXh0LCBydW50aW1lLCBmdW5jdGlvbjogJ3JlcXVlc3QnIH0pLnByb21pc2UoKVxuLy8gLy8gICAgIGNvbnN0IHJlc3VsdCA9IEpTT04ucGFyc2UocmVzcG9uc2UuZXZhbHVhdGlvblJlc3VsdCEpXG5cbi8vIC8vICAgICBleHBlY3QocmVzdWx0LmtleS5pZC5TKS50b0JlRGVmaW5lZCgpXG4vLyAvLyAgICAgZXhwZWN0KHJlc3VsdC5hdHRyaWJ1dGVWYWx1ZXMuZmlyc3RuYW1lLlMpLnRvRXF1YWwoY29udGV4dEpTT04uYXJndW1lbnRzLmZpcnN0bmFtZSlcbi8vIC8vIH0pXG5cbi8vIC8vIHJlc29sdmVyLnRlc3QuanNcbi8vIC8vIGltcG9ydCB7IHJlcXVlc3QsIHJlc3BvbnNlIH0gZnJvbSAnLi4vcmVzb2x2ZXJzL2RlbGl2ZXJ5L3B1dEV2ZW50LmpzJztcblxuLy8gLy8gaW1wb3J0IHtyZXF1ZXN0LCByZXNwb25zZX0gZnJvbSAnLi4vcmVzb2x2ZXJzL2RlbGl2ZXJ5L3B1dEV2ZW50LmpzJ1xuXG4vLyBkZXNjcmliZSgncmVxdWVzdCBmdW5jdGlvbicsICgpID0+IHtcbi8vICAgaXQoJ3Nob3VsZCBjcmVhdGUgYSBjb3JyZWN0IGV2ZW50IHN0cnVjdHVyZScsICgpID0+IHtcbi8vICAgICBjb25zdCBjdHggPSB7XG4vLyAgICAgICBhcmdzOiB7XG4vLyAgICAgICAgIHBhY2thZ2VJZDogJzEyMzQ1JywgIC8vIE1vY2tpbmcgYSBwYWNrYWdlIElEXG4vLyAgICAgICB9LFxuLy8gICAgIH07XG5cbi8vICAgICBjb25zdCByZXN1bHQgPSByZXF1ZXN0KGN0eCk7XG5cbi8vICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbi8vICAgICAgIG9wZXJhdGlvbjogJ1B1dEV2ZW50cycsXG4vLyAgICAgICBldmVudHM6IFtcbi8vICAgICAgICAge1xuLy8gICAgICAgICAgIHNvdXJjZTogJ2RlbGl2ZXJ5LmFwaScsXG4vLyAgICAgICAgICAgZGV0YWlsOiB7XG4vLyAgICAgICAgICAgICBwYWNrYWdlSWQ6ICcxMjM0NScsXG4vLyAgICAgICAgICAgfSxcbi8vICAgICAgICAgICBkZXRhaWxUeXBlOiAncGFja2FnZS5kZWxpdmVyZWQnLFxuLy8gICAgICAgICB9LFxuLy8gICAgICAgXSxcbi8vICAgICB9KTtcbi8vICAgfSk7XG5cbi8vICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBldmVudCB3aXRoIGVtcHR5IHBhY2thZ2VJZCcsICgpID0+IHtcbi8vICAgICBjb25zdCBjdHggPSB7XG4vLyAgICAgICBhcmdzOiB7XG4vLyAgICAgICAgIHBhY2thZ2VJZDogJycsICAvLyBFbXB0eSBwYWNrYWdlIElEIHNjZW5hcmlvXG4vLyAgICAgICB9LFxuLy8gICAgIH07XG5cbi8vICAgICBjb25zdCByZXN1bHQgPSByZXF1ZXN0KGN0eCk7XG5cbi8vICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHtcbi8vICAgICAgIG9wZXJhdGlvbjogJ1B1dEV2ZW50cycsXG4vLyAgICAgICBldmVudHM6IFtcbi8vICAgICAgICAge1xuLy8gICAgICAgICAgIHNvdXJjZTogJ2RlbGl2ZXJ5LmFwaScsXG4vLyAgICAgICAgICAgZGV0YWlsOiB7XG4vLyAgICAgICAgICAgICBwYWNrYWdlSWQ6ICcnLCAgLy8gU2hvdWxkIHN0aWxsIGhhbmRsZSBlbXB0eSBwYWNrYWdlSWRcbi8vICAgICAgICAgICB9LFxuLy8gICAgICAgICAgIGRldGFpbFR5cGU6ICdwYWNrYWdlLmRlbGl2ZXJlZCcsXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICBdLFxuLy8gICAgIH0pO1xuLy8gICB9KTtcbi8vIH0pO1xuXG4vLyBkZXNjcmliZSgncmVzcG9uc2UgZnVuY3Rpb24nLCAoKSA9PiB7XG4vLyAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUnLCAoKSA9PiB7XG4vLyAgICAgY29uc3QgY3R4ID0ge307ICAvLyBNb2NrIGNvbnRleHQgKGNvdWxkIGJlIGFueXRoaW5nKVxuLy8gICAgIGNvbnN0IGNvbnNvbGVTcHkgPSBqZXN0LnNweU9uKGNvbnNvbGUsICdsb2cnKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge30pO1xuXG4vLyAgICAgY29uc3QgcmVzdWx0ID0gcmVzcG9uc2UoY3R4KTtcblxuLy8gICAgIGV4cGVjdChyZXN1bHQpLnRvQmUodHJ1ZSk7XG4vLyAgICAgZXhwZWN0KGNvbnNvbGVTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFwiRXZlZWVudFwiLCBjdHgpO1xuXG4vLyAgICAgY29uc29sZVNweS5tb2NrUmVzdG9yZSgpOyAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgY29uc29sZS5sb2cgaW1wbGVtZW50YXRpb25cbi8vICAgfSk7XG4vLyB9KTtcbiJdfQ==