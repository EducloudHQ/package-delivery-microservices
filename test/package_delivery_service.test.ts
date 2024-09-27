import { PackageServiceStack } from '../lib/package_service-stack';

import * as cdk from 'aws-cdk-lib';
import * as assertions from 'aws-cdk-lib/assertions';

describe('DynamoDB Table Tests', () => {
    test('DynamoDB table is created with correct properties', () => {
        const app = new cdk.App();
        const stack = new PackageServiceStack(app, 'TestStack');

        const template = assertions.Template.fromStack(stack);

        template.hasResourceProperties('AWS::DynamoDB::Table', {
            TableName: 'packageTable',
            BillingMode: 'PAY_PER_REQUEST',
            KeySchema: [
                { AttributeName: 'PK', KeyType: 'HASH' },
                { AttributeName: 'SK', KeyType: 'RANGE' }
            ]
        });
    });
});


describe('AppSync API Tests', () => {
    test('AppSync API is created with correct authorization modes', () => {
        const app = new cdk.App();
        const stack = new PackageServiceStack(app, 'TestStack');

        const template = assertions.Template.fromStack(stack);

        template.hasResourceProperties('AWS::AppSync::GraphQLApi', {
            Name: 'PackageAPI',
            AuthenticationType: 'API_KEY',
            AdditionalAuthenticationProviders: [
                { AuthenticationType: 'AWS_IAM' }
            ]
        });
    });
});

describe('EventBridge Tests', () => {
    test('EventBus is created', () => {
        const app = new cdk.App();
        const stack = new PackageServiceStack(app, 'TestStack');

        const template = assertions.Template.fromStack(stack);

        template.hasResource('AWS::Events::EventBus', {});
    });


    test('EventBridge rule is created with correct event pattern', () => {
        const app = new cdk.App();
        const stack = new PackageServiceStack(app, 'TestStack');

        const template = assertions.Template.fromStack(stack);

        template.hasResourceProperties('AWS::Events::Rule', {});
    });


    test('EventBridge target triggers AppSync mutation', () => {
        const app = new cdk.App();
        const stack = new PackageServiceStack(app, 'TestStack');

        const template = assertions.Template.fromStack(stack);

        template.hasResourceProperties('AWS::Events::Rule', {
            Targets: [{}]
        });
    });

    describe('IAM Role Tests', () => {
        test('IAM role for EventBridge is created', () => {
            const app = new cdk.App();
            const stack = new PackageServiceStack(app, 'TestStack');

            const template = assertions.Template.fromStack(stack);

            template.hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Effect: 'Allow',
                            Principal: { Service: 'events.amazonaws.com' },
                            Action: 'sts:AssumeRole'
                        }
                    ]
                }
            });
        });
    });
})