"use strict";
// import * as cdk from 'aws-cdk-lib';
// import * as assertions from 'aws-cdk-lib/assertions';
// import { DeliveryServiceStack } from '../lib/delivery_service-stack'; // Adjust the path based on your project structure
// describe('AppSync API Tests', () => {
//     test('AppSync API is created with correct authorization modes', () => {
//         const app = new cdk.App();
//         const stack = new DeliveryServiceStack(app, 'TestStack');
//         const template = assertions.Template.fromStack(stack);
//         template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
//             Name: 'DeliveryAPI',
//             AuthenticationType: 'API_KEY',
//             AdditionalAuthenticationProviders: [
//                 { AuthenticationType: 'AWS_IAM' }
//             ]
//         });
//     });
// });
// describe('EventBridge Data Source Tests', () => {
//   test('EventBridge Data Source is created for the AppSync API', () => {
//     const app = new cdk.App();
//     const stack = new DeliveryServiceStack(app, 'TestStack');
//     const template = assertions.Template.fromStack(stack);
//     template.hasResourceProperties('AWS::AppSync::DataSource', {});
//   });
// });
// describe('AppSync Function Tests', () => {
//   test('AppSync Function is created with correct properties', () => {
//     const app = new cdk.App();
//     const stack = new DeliveryServiceStack(app, 'TestStack');
//     const template = assertions.Template.fromStack(stack);
//     template.hasResourceProperties('AWS::AppSync::FunctionConfiguration', {
//       Name: 'PutEvent',
//       DataSourceName: 'EventBridge',
//       FunctionVersion: '2018-05-29',
//       Runtime: {
//         Name: 'APPSYNC_JS',
//         RuntimeVersion: '1.0.0'
//       }
//     });
//   });
// });
// describe('AppSync Resolver Tests', () => {
//   test('AppSync Resolver is created for Mutation packageDelivered', () => {
//     const app = new cdk.App();
//     const stack = new DeliveryServiceStack(app, 'TestStack');
//     const template = assertions.Template.fromStack(stack);
//     template.hasResourceProperties('AWS::AppSync::Resolver', {
//       TypeName: 'Mutation',
//       FieldName: 'packageDelivered'
//     });
//   });
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsaXZlcnlfc2VydmljZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVsaXZlcnlfc2VydmljZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBc0M7QUFDdEMsd0RBQXdEO0FBQ3hELDJIQUEySDtBQUUzSCx3Q0FBd0M7QUFDeEMsOEVBQThFO0FBQzlFLHFDQUFxQztBQUNyQyxvRUFBb0U7QUFFcEUsaUVBQWlFO0FBRWpFLHVFQUF1RTtBQUN2RSxtQ0FBbUM7QUFDbkMsNkNBQTZDO0FBQzdDLG1EQUFtRDtBQUNuRCxvREFBb0Q7QUFDcEQsZ0JBQWdCO0FBQ2hCLGNBQWM7QUFDZCxVQUFVO0FBQ1YsTUFBTTtBQUVOLG9EQUFvRDtBQUNwRCwyRUFBMkU7QUFDM0UsaUNBQWlDO0FBQ2pDLGdFQUFnRTtBQUNoRSw2REFBNkQ7QUFDN0Qsc0VBQXNFO0FBQ3RFLFFBQVE7QUFDUixNQUFNO0FBRU4sNkNBQTZDO0FBQzdDLHdFQUF3RTtBQUN4RSxpQ0FBaUM7QUFDakMsZ0VBQWdFO0FBQ2hFLDZEQUE2RDtBQUM3RCw4RUFBOEU7QUFDOUUsMEJBQTBCO0FBQzFCLHVDQUF1QztBQUN2Qyx1Q0FBdUM7QUFDdkMsbUJBQW1CO0FBQ25CLDhCQUE4QjtBQUM5QixrQ0FBa0M7QUFDbEMsVUFBVTtBQUNWLFVBQVU7QUFDVixRQUFRO0FBQ1IsTUFBTTtBQUVOLDZDQUE2QztBQUM3Qyw4RUFBOEU7QUFDOUUsaUNBQWlDO0FBQ2pDLGdFQUFnRTtBQUNoRSw2REFBNkQ7QUFDN0QsaUVBQWlFO0FBQ2pFLDhCQUE4QjtBQUM5QixzQ0FBc0M7QUFDdEMsVUFBVTtBQUNWLFFBQVE7QUFDUixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbi8vIGltcG9ydCAqIGFzIGFzc2VydGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG4vLyBpbXBvcnQgeyBEZWxpdmVyeVNlcnZpY2VTdGFjayB9IGZyb20gJy4uL2xpYi9kZWxpdmVyeV9zZXJ2aWNlLXN0YWNrJzsgLy8gQWRqdXN0IHRoZSBwYXRoIGJhc2VkIG9uIHlvdXIgcHJvamVjdCBzdHJ1Y3R1cmVcblxuLy8gZGVzY3JpYmUoJ0FwcFN5bmMgQVBJIFRlc3RzJywgKCkgPT4ge1xuLy8gICAgIHRlc3QoJ0FwcFN5bmMgQVBJIGlzIGNyZWF0ZWQgd2l0aCBjb3JyZWN0IGF1dGhvcml6YXRpb24gbW9kZXMnLCAoKSA9PiB7XG4vLyAgICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4vLyAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IERlbGl2ZXJ5U2VydmljZVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG4vLyAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZXJ0aW9ucy5UZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4vLyAgICAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBTeW5jOjpHcmFwaFFMQXBpJywge1xuLy8gICAgICAgICAgICAgTmFtZTogJ0RlbGl2ZXJ5QVBJJyxcbi8vICAgICAgICAgICAgIEF1dGhlbnRpY2F0aW9uVHlwZTogJ0FQSV9LRVknLFxuLy8gICAgICAgICAgICAgQWRkaXRpb25hbEF1dGhlbnRpY2F0aW9uUHJvdmlkZXJzOiBbXG4vLyAgICAgICAgICAgICAgICAgeyBBdXRoZW50aWNhdGlvblR5cGU6ICdBV1NfSUFNJyB9XG4vLyAgICAgICAgICAgICBdXG4vLyAgICAgICAgIH0pO1xuLy8gICAgIH0pO1xuLy8gfSk7XG5cbi8vIGRlc2NyaWJlKCdFdmVudEJyaWRnZSBEYXRhIFNvdXJjZSBUZXN0cycsICgpID0+IHtcbi8vICAgdGVzdCgnRXZlbnRCcmlkZ2UgRGF0YSBTb3VyY2UgaXMgY3JlYXRlZCBmb3IgdGhlIEFwcFN5bmMgQVBJJywgKCkgPT4ge1xuLy8gICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4vLyAgICAgY29uc3Qgc3RhY2sgPSBuZXcgRGVsaXZlcnlTZXJ2aWNlU3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG4vLyAgICAgY29uc3QgdGVtcGxhdGUgPSBhc3NlcnRpb25zLlRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4vLyAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwcFN5bmM6OkRhdGFTb3VyY2UnLCB7fSk7XG4vLyAgIH0pO1xuLy8gfSk7XG5cbi8vIGRlc2NyaWJlKCdBcHBTeW5jIEZ1bmN0aW9uIFRlc3RzJywgKCkgPT4ge1xuLy8gICB0ZXN0KCdBcHBTeW5jIEZ1bmN0aW9uIGlzIGNyZWF0ZWQgd2l0aCBjb3JyZWN0IHByb3BlcnRpZXMnLCAoKSA9PiB7XG4vLyAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbi8vICAgICBjb25zdCBzdGFjayA9IG5ldyBEZWxpdmVyeVNlcnZpY2VTdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbi8vICAgICBjb25zdCB0ZW1wbGF0ZSA9IGFzc2VydGlvbnMuVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbi8vICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBwU3luYzo6RnVuY3Rpb25Db25maWd1cmF0aW9uJywge1xuLy8gICAgICAgTmFtZTogJ1B1dEV2ZW50Jyxcbi8vICAgICAgIERhdGFTb3VyY2VOYW1lOiAnRXZlbnRCcmlkZ2UnLFxuLy8gICAgICAgRnVuY3Rpb25WZXJzaW9uOiAnMjAxOC0wNS0yOScsXG4vLyAgICAgICBSdW50aW1lOiB7XG4vLyAgICAgICAgIE5hbWU6ICdBUFBTWU5DX0pTJyxcbi8vICAgICAgICAgUnVudGltZVZlcnNpb246ICcxLjAuMCdcbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfSk7XG4vLyB9KTtcblxuLy8gZGVzY3JpYmUoJ0FwcFN5bmMgUmVzb2x2ZXIgVGVzdHMnLCAoKSA9PiB7XG4vLyAgIHRlc3QoJ0FwcFN5bmMgUmVzb2x2ZXIgaXMgY3JlYXRlZCBmb3IgTXV0YXRpb24gcGFja2FnZURlbGl2ZXJlZCcsICgpID0+IHtcbi8vICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuLy8gICAgIGNvbnN0IHN0YWNrID0gbmV3IERlbGl2ZXJ5U2VydmljZVN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuLy8gICAgIGNvbnN0IHRlbXBsYXRlID0gYXNzZXJ0aW9ucy5UZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuLy8gICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcHBTeW5jOjpSZXNvbHZlcicsIHtcbi8vICAgICAgIFR5cGVOYW1lOiAnTXV0YXRpb24nLFxuLy8gICAgICAgRmllbGROYW1lOiAncGFja2FnZURlbGl2ZXJlZCdcbi8vICAgICB9KTtcbi8vICAgfSk7XG4vLyB9KTtcbiJdfQ==