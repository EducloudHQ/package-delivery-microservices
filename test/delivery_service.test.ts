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
